export type ProductRepo = 'WallpaperLive' | 'TransparentBar';

export interface ReleaseState {
  status: 'loading' | 'ready' | 'unavailable';
  version: string | null;
  downloadUrl: string | null;
  sizeMb: string | null;
  portableUrl: string | null;
  portableSizeMb: string | null;
  downloads: number | null;
}
export type ProductReleases = Record<ProductRepo, ReleaseState>;

export const emptyRelease: ReleaseState = {
  status: 'loading',
  version: null,
  downloadUrl: null,
  sizeMb: null,
  portableUrl: null,
  portableSizeMb: null,
  downloads: null,
};

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid GitHub release response');
  return value as Record<string, unknown>;
}

function safeDownloadUrl(repo: ProductRepo, href: unknown): string {
  if (typeof href !== 'string') throw new Error('Invalid installer URL');
  const url = new URL(href);
  if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password || !url.pathname.startsWith('/Raflyf/' + repo + '/releases/download/')) {
    throw new Error('Unexpected installer URL');
  }
  return url.href;
}

export function parseLatestRelease(repo: ProductRepo, value: unknown): ReleaseState {
  const release = record(value);
  if (typeof release.tag_name !== 'string' || !release.tag_name.trim() || release.draft !== false || release.prerelease !== false || !Array.isArray(release.assets)) {
    throw new Error('Invalid latest stable release');
  }
  const assets = release.assets.map(record);
  const installer = assets.find(asset => typeof asset.name === 'string' && /(?:setup|installer).*\.(?:msi|exe)$/i.test(asset.name));
  const portable = assets.find(asset => typeof asset.name === 'string' && /\.zip$/i.test(asset.name));

  let downloadUrl: string | null = null;
  let sizeMb: string | null = null;
  if (installer) {
    if (typeof installer.size !== 'number' || !Number.isSafeInteger(installer.size) || installer.size <= 0) throw new Error('Invalid installer metadata');
    downloadUrl = safeDownloadUrl(repo, installer.browser_download_url);
    sizeMb = (installer.size / 1_000_000).toFixed(1) + ' MB';
  }

  let portableUrl: string | null = null;
  let portableSizeMb: string | null = null;
  if (portable) {
    if (typeof portable.size !== 'number' || !Number.isSafeInteger(portable.size) || portable.size <= 0) throw new Error('Invalid portable metadata');
    portableUrl = safeDownloadUrl(repo, portable.browser_download_url);
    portableSizeMb = (portable.size / 1_000_000).toFixed(1) + ' MB';
  }

  return { status: 'ready', version: release.tag_name, downloadUrl, sizeMb, portableUrl, portableSizeMb, downloads: null };
}

async function githubJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) throw new Error('GitHub HTTP ' + response.status);
  return response.json();
}

async function downloadCount(repo: ProductRepo, signal: AbortSignal): Promise<number> {
  let total = 0;
  for (let page = 1; ; page++) {
    const releases = await githubJson('https://api.github.com/repos/Raflyf/' + repo + '/releases?per_page=100&page=' + page, signal);
    if (!Array.isArray(releases)) throw new Error('Invalid release list');
    for (const value of releases) {
      const release = record(value);
      if (release.draft === true) continue;
      if (!Array.isArray(release.assets)) throw new Error('Invalid release assets');
      for (const value of release.assets) {
        const asset = record(value);
        if (typeof asset.name !== 'string' || !/\.(?:exe|msi|zip)$/i.test(asset.name)) continue;
        if (typeof asset.download_count !== 'number' || !Number.isSafeInteger(asset.download_count) || asset.download_count < 0) throw new Error('Invalid download count');
        total += asset.download_count;
        if (!Number.isSafeInteger(total)) throw new Error('Download count too large');
      }
    }
    if (releases.length < 100) return total;
  }
}

const CACHE_PREFIX = 'livelydesk:release:v2:';
const CACHE_TTL_MS = 10 * 60 * 1000;
const PARTIAL_TTL_MS = 5 * 60 * 1000;

function validateReleaseState(repo: ProductRepo, data: Record<string, unknown>): ReleaseState | null {
  if (data.status !== 'ready' || typeof data.version !== 'string' || !data.version.trim()) return null;
  const downloadUrl = data.downloadUrl == null ? null : safeDownloadUrl(repo, data.downloadUrl);
  if (data.sizeMb != null && typeof data.sizeMb !== 'string') return null;
  const portableUrl = data.portableUrl == null ? null : safeDownloadUrl(repo, data.portableUrl);
  if (data.portableSizeMb != null && typeof data.portableSizeMb !== 'string') return null;
  if (data.downloads != null && !(typeof data.downloads === 'number' && Number.isSafeInteger(data.downloads) && data.downloads >= 0)) return null;
  return {
    status: 'ready',
    version: data.version,
    downloadUrl,
    sizeMb: (data.sizeMb as string | null | undefined) ?? null,
    portableUrl,
    portableSizeMb: (data.portableSizeMb as string | null | undefined) ?? null,
    downloads: (data.downloads as number | null | undefined) ?? null,
  };
}

function readCache(repo: ProductRepo, allowStale = false): ReleaseState | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + repo);
    if (!raw) return null;
    const entry = record(JSON.parse(raw));
    if (typeof entry.ts !== 'number' || !Number.isFinite(entry.ts)) return null;
    const parsed = validateReleaseState(repo, record(entry.data));
    if (!parsed) return null;
    const ttl = parsed.downloads === null ? PARTIAL_TTL_MS : CACHE_TTL_MS;
    const age = Date.now() - entry.ts;
    if (!allowStale && (age < 0 || age >= ttl)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(repo: ProductRepo, data: ReleaseState): void {
  if (typeof localStorage === 'undefined' || data.status !== 'ready') return;
  try {
    localStorage.setItem(CACHE_PREFIX + repo, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // Storage quota or privacy mode; ignore without breaking fetch.
  }
}

async function loadFromProxy(repo: ProductRepo, signal: AbortSignal): Promise<ReleaseState> {
  const response = await fetch('/api/releases?repo=' + encodeURIComponent(repo), {
    signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('Proxy HTTP ' + response.status);
  const parsed = validateReleaseState(repo, record(await response.json()));
  if (!parsed) throw new Error('Invalid proxy release payload');
  return parsed;
}

export async function loadRelease(repo: ProductRepo, signal: AbortSignal): Promise<ReleaseState> {
  const cached = readCache(repo);
  if (cached) return cached;

  const canUseProxy = typeof window !== 'undefined' && /^https?:$/.test(window.location?.protocol ?? '');
  try {
    if (canUseProxy) {
      try {
        const proxied = await loadFromProxy(repo, signal);
        writeCache(repo, proxied);
        return proxied;
      } catch (proxyError) {
        if (signal.aborted) throw proxyError;
      }
    }

    const [latest, downloads] = await Promise.all([
      githubJson('https://api.github.com/repos/Raflyf/' + repo + '/releases/latest', signal).then(value => parseLatestRelease(repo, value)),
      downloadCount(repo, signal).catch(() => null),
    ]);
    const result: ReleaseState = { ...latest, downloads };
    writeCache(repo, result);
    return result;
  } catch (error) {
    if (!signal.aborted) {
      const stale = readCache(repo, true);
      if (stale) return stale;
    }
    throw error;
  }
}
