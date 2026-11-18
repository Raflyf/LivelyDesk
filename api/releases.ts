type ProductRepo = 'WallpaperLive' | 'TransparentBar';

export interface ReleasePayload {
  status: 'ready';
  version: string;
  downloadUrl: string | null;
  sizeMb: string | null;
  portableUrl: string | null;
  portableSizeMb: string | null;
  downloads: number | null;
}

const ALLOWED_REPOS = new Set<ProductRepo>(['WallpaperLive', 'TransparentBar']);
const MAX_RELEASE_PAGES = 20;

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid GitHub release payload');
  }
  return value as Record<string, unknown>;
}

function safeDownloadUrl(repo: ProductRepo, href: unknown): string {
  if (typeof href !== 'string') throw new Error('Invalid download URL');
  const url = new URL(href);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'github.com' ||
    url.username ||
    url.password ||
    !url.pathname.startsWith('/Raflyf/' + repo + '/releases/download/')
  ) {
    throw new Error('Unexpected download URL');
  }
  return url.href;
}

function formatSizeMb(bytes: number): string {
  return (bytes / 1_000_000).toFixed(1) + ' MB';
}

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'LivelyDesk-Release-Proxy',
  };
  const token = typeof process !== 'undefined' ? process.env?.GITHUB_TOKEN?.trim() : undefined;
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
}

async function githubJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
    headers: githubHeaders(),
  });
  if (!response.ok) throw new Error('GitHub HTTP ' + response.status);
  return response.json();
}

function parseApiRelease(repo: ProductRepo, value: unknown): Omit<ReleasePayload, 'downloads'> {
  const release = record(value);
  if (
    typeof release.tag_name !== 'string' ||
    !release.tag_name.trim() ||
    release.draft !== false ||
    release.prerelease !== false ||
    !Array.isArray(release.assets)
  ) {
    throw new Error('Invalid latest stable release');
  }
  const assets = release.assets.map(record);
  const installer = assets.find(
    asset => typeof asset.name === 'string' && /(?:setup|installer).*\.(?:msi|exe)$/i.test(asset.name),
  );
  const portable = assets.find(
    asset => typeof asset.name === 'string' && /\.zip$/i.test(asset.name),
  );

  let downloadUrl: string | null = null;
  let sizeMb: string | null = null;
  if (installer) {
    if (typeof installer.size !== 'number' || !Number.isSafeInteger(installer.size) || installer.size <= 0) {
      throw new Error('Invalid installer metadata');
    }
    downloadUrl = safeDownloadUrl(repo, installer.browser_download_url);
    sizeMb = formatSizeMb(installer.size);
  }

  let portableUrl: string | null = null;
  let portableSizeMb: string | null = null;
  if (portable) {
    if (typeof portable.size !== 'number' || !Number.isSafeInteger(portable.size) || portable.size <= 0) {
      throw new Error('Invalid portable metadata');
    }
    portableUrl = safeDownloadUrl(repo, portable.browser_download_url);
    portableSizeMb = formatSizeMb(portable.size);
  }

  return {
    status: 'ready',
    version: release.tag_name,
    downloadUrl,
    sizeMb,
    portableUrl,
    portableSizeMb,
  };
}

async function sumDownloads(repo: ProductRepo, signal: AbortSignal): Promise<number> {
  let total = 0;
  for (let page = 1; page <= MAX_RELEASE_PAGES; page++) {
    const releases = await githubJson(
      `https://api.github.com/repos/Raflyf/${repo}/releases?per_page=100&page=${page}`,
      signal,
    );
    if (!Array.isArray(releases)) throw new Error('Invalid release list');
    for (const item of releases) {
      const release = record(item);
      if (release.draft === true) continue;
      if (!Array.isArray(release.assets)) throw new Error('Invalid release assets');
      for (const rawAsset of release.assets) {
        const asset = record(rawAsset);
        if (typeof asset.name !== 'string' || !/\.(?:exe|msi|zip)$/i.test(asset.name)) continue;
        if (typeof asset.download_count !== 'number' || !Number.isSafeInteger(asset.download_count) || asset.download_count < 0) {
          throw new Error('Invalid download count');
        }
        total += asset.download_count;
      }
    }
    if (releases.length < 100) return total;
  }
  return total;
}

async function resolveAssetSizeMb(url: string, signal: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]),
      headers: { 'User-Agent': 'LivelyDesk-Release-Proxy' },
    });
    if (!res.ok) return null;
    const len = Number(res.headers.get('content-length'));
    return Number.isSafeInteger(len) && len > 0 ? formatSizeMb(len) : null;
  } catch {
    return null;
  }
}

async function fetchWebFallback(repo: ProductRepo, signal: AbortSignal): Promise<ReleasePayload> {
  const latestRes = await fetch(`https://github.com/Raflyf/${repo}/releases/latest`, {
    method: 'HEAD',
    redirect: 'manual',
    signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]),
    headers: { 'User-Agent': 'LivelyDesk-Release-Proxy' },
  });
  const location = latestRes.headers.get('location');
  if (!location) throw new Error('Missing release redirect location');
  const tagMatch = /\/releases\/tag\/([^/?#]+)$/.exec(location);
  if (!tagMatch) throw new Error('Unexpected release redirect location');
  const version = decodeURIComponent(tagMatch[1]);

  const assetsRes = await fetch(
    `https://github.com/Raflyf/${repo}/releases/expanded_assets/${encodeURIComponent(version)}`,
    {
      signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]),
      headers: { 'User-Agent': 'LivelyDesk-Release-Proxy' },
    },
  );
  if (!assetsRes.ok) throw new Error('Expanded assets HTTP ' + assetsRes.status);
  const html = await assetsRes.text();

  const prefix = `/Raflyf/${repo}/releases/download/${encodeURIComponent(version)}/`;
  const hrefs: string[] = [];
  const hrefRegex = /href="([^"]+)"/g;
  for (let match = hrefRegex.exec(html); match; match = hrefRegex.exec(html)) {
    if (match[1].startsWith(prefix)) hrefs.push('https://github.com' + match[1]);
  }

  const installerCandidate = hrefs.find(href => /(?:setup|installer).*\.(?:msi|exe)$/i.test(href));
  const portableCandidate = hrefs.find(href => /\.zip$/i.test(href));
  const downloadUrl = installerCandidate ? safeDownloadUrl(repo, installerCandidate) : null;
  const portableUrl = portableCandidate ? safeDownloadUrl(repo, portableCandidate) : null;

  const [sizeMb, portableSizeMb] = await Promise.all([
    downloadUrl ? resolveAssetSizeMb(downloadUrl, signal) : Promise.resolve(null),
    portableUrl ? resolveAssetSizeMb(portableUrl, signal) : Promise.resolve(null),
  ]);

  return {
    status: 'ready',
    version,
    downloadUrl,
    sizeMb,
    portableUrl,
    portableSizeMb,
    downloads: null,
  };
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const repoParam = url.searchParams.get('repo');
  if (!repoParam || !ALLOWED_REPOS.has(repoParam as ProductRepo)) {
    return Response.json(
      { error: 'Invalid repository parameter' },
      { status: 400, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } },
    );
  }
  const repo = repoParam as ProductRepo;

  try {
    const [latest, downloads] = await Promise.all([
      githubJson(`https://api.github.com/repos/Raflyf/${repo}/releases/latest`, request.signal).then(data =>
        parseApiRelease(repo, data),
      ),
      sumDownloads(repo, request.signal).catch(() => null),
    ]);
    const payload: ReleasePayload = { ...latest, downloads };
    const cacheHeader =
      downloads !== null
        ? 'public, max-age=120, s-maxage=300, stale-while-revalidate=1800'
        : 'public, max-age=60, s-maxage=180, stale-while-revalidate=600';
    return Response.json(payload, {
      status: 200,
      headers: { 'Cache-Control': cacheHeader, 'X-Content-Type-Options': 'nosniff' },
    });
  } catch (apiError) {
    try {
      const fallbackPayload = await fetchWebFallback(repo, request.signal);
      return Response.json(fallbackPayload, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=900',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } catch (fallbackError) {
      console.error('Release proxy failed for', repo, apiError, fallbackError);
      return Response.json(
        { error: 'Release metadata unavailable' },
        { status: 502, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } },
      );
    }
  }
}
