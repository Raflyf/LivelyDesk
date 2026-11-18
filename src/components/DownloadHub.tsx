import React from 'react';
import { Translation, type Language } from '../types/content';
import type { ProductReleases } from '../releases';
import { Download, Github, Monitor, Terminal, ExternalLink, Package, ShieldCheck, Lock } from 'lucide-react';

interface DownloadHubProps {
  t: Translation;
  releases: ProductReleases;
  lang: Language;
}

export const DownloadHub: React.FC<DownloadHubProps> = ({ t, releases, lang }) => {
  const wl = releases.WallpaperLive;
  const tb = releases.TransparentBar;
  const numberLocale = lang === 'id' ? 'id-ID' : 'en-US';
  const statusLabel = (status: string) => status === 'loading' ? t.download.releaseLoading : t.download.releaseUnavailable;
  const installerLabel = (url: string | null) => {
    if (!url) return t.download.latestRelease;
    return url.toLowerCase().endsWith('.msi')
      ? t.download.installerBtn.replace('(.exe)', '(.msi)')
      : t.download.installerBtn;
  };

  return (
    <section id="download" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Header */}
      <div data-reveal className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burnt/10 border border-burnt/20 text-xs font-mono text-accent-text font-semibold">
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.download.badge}</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-fg tracking-tight">
          {t.download.title}
        </h2>
        <p className="text-sm sm:text-base text-fg/70 leading-relaxed">
          {t.download.subtitle}
        </p>
      </div>

      {/* Two Main Cards: WallpaperLive & TransparentBar */}
      <div className="motion-sequence grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

        {/* Card 1: WallpaperLive */}
        <div data-reveal className="motion-card bg-surface p-8 rounded-3xl border border-fg/10 flex flex-col justify-between shadow-xs hover:border-burnt/40">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-inverse text-on-inverse text-xs font-mono font-semibold">
                {wl.version ? `${wl.version} ${t.download.latest}` : statusLabel(wl.status)}
              </span>
              <span className="text-xs font-mono text-fg/70 shrink-0">GPL-3.0 License</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img src="/icons/wallpaperlive-128-v1.webp" alt={t.download.wpIconAlt} width="64" height="64" loading="lazy" decoding="async" className="product-icon h-16 w-16 shrink-0 object-contain" />
              <h3 className="font-display text-2xl font-bold text-fg">
                <a href={lang === 'id' ? '/wallpaperlive/id' : '/wallpaperlive'} className="hover:text-accent-text inline-flex items-center min-h-11">
                  {t.download.wpTitle}
                </a>
              </h3>
            </div>
            <p className="text-sm text-fg/75 mb-4 leading-relaxed">
              {t.download.wpDesc}
            </p>
            <a href={lang === 'id' ? '/wallpaperlive/id' : '/wallpaperlive'} className="mb-6 min-h-11 inline-flex items-center text-sm font-semibold text-accent-text underline underline-offset-4">
              {lang === 'id' ? 'Fitur dan cara memasang wallpaper bergerak' : 'Live wallpaper features and setup'}
            </a>

            {/* Feature Checklist */}
            <ul className="text-xs font-mono text-fg/70 space-y-2 mb-8">
              {t.download.wpChecklist.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burnt shrink-0" aria-hidden="true"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-6 border-t border-fg/10">
            {/* Direct dynamic download link to latest installer */}
            <a
              href={wl.downloadUrl ?? 'https://github.com/Raflyf/WallpaperLive/releases/latest'}
              className="motion-button w-full min-h-12 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-burnt text-ink font-semibold text-xs sm:text-sm hover:bg-burnt-hover shadow-md shadow-burnt/20"
            >
              <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{installerLabel(wl.downloadUrl)}</span>
            </a>

            {wl.portableUrl && (
              <a
                href={wl.portableUrl}
                className="motion-button w-full min-h-11 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-fg/5 hover:bg-fg/10 text-fg border border-fg/15 font-semibold text-xs"
              >
                <Package className="w-4 h-4 text-accent-text shrink-0" aria-hidden="true" />
                <span>{t.download.portableBtn}{wl.portableSizeMb ? ` (${wl.portableSizeMb})` : ''}</span>
              </a>
            )}

            {/* Release version, size, and download count */}
            <div className="text-center py-0.5">
              {wl.version && (
                <div className="text-[11px] text-fg/70 font-mono">
                  {t.download.version} {wl.version.replace(/^v/, '')}{wl.sizeMb && <>, {t.download.about} {wl.sizeMb}</>}.
                </div>
              )}
              <div className="text-xs font-mono text-fg/80 mt-0.5">
                {wl.downloads !== null ? <><strong className="text-fg font-bold text-sm tabular-nums">{wl.downloads.toLocaleString(numberLocale)}</strong> {t.download.downloadsSoFar}</> : t.download.downloadsUnavailable}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="https://github.com/Raflyf/WallpaperLive/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-fg/5 hover:bg-fg/10 text-fg border border-fg/15 text-xs font-medium transition-colors"
              >
                <span>Releases</span>
                <ExternalLink className="w-3 h-3 text-fg/70" aria-hidden="true" />
              </a>

              <a
                href="https://github.com/Raflyf/WallpaperLive"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-inverse text-on-inverse text-xs font-medium hover:bg-inverse/90 transition-colors"
              >
                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Card 2: TransparentBar */}
        <div data-reveal className="motion-card bg-surface p-8 rounded-3xl border border-fg/10 flex flex-col justify-between shadow-xs hover:border-burnt/40">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-burnt text-ink text-xs font-mono font-semibold">
                {tb.version ? `${tb.version} ${t.download.latest}` : statusLabel(tb.status)}
              </span>
              <span className="text-xs font-mono text-fg/70 shrink-0">MIT License</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img src="/icons/transparentbar-128-v1.webp" alt={t.download.tbIconAlt} width="64" height="64" loading="lazy" decoding="async" className="product-icon h-16 w-16 shrink-0 object-contain" />
              <h3 className="font-display text-2xl font-bold text-fg">
                <a href={lang === 'id' ? '/transparentbar/id' : '/transparentbar'} className="hover:text-accent-text inline-flex items-center min-h-11">
                  {t.download.tbTitle}
                </a>
              </h3>
            </div>
            <p className="text-sm text-fg/75 mb-4 leading-relaxed">
              {t.download.tbDesc}
            </p>
            <a href={lang === 'id' ? '/transparentbar/id' : '/transparentbar'} className="mb-6 min-h-11 inline-flex items-center text-sm font-semibold text-accent-text underline underline-offset-4">
              {lang === 'id' ? 'Fitur dan cara membuat taskbar transparan' : 'Transparent taskbar features and setup'}
            </a>

            {/* Feature Checklist */}
            <ul className="text-xs font-mono text-fg/70 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-burnt shrink-0" aria-hidden="true"></span>
                <span>{t.benchmark.tbRowRam} · {t.hero.stat2Sub}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-burnt shrink-0" aria-hidden="true"></span>
                <span>{t.features.items.f2Title}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-burnt shrink-0" aria-hidden="true"></span>
                <span>{t.download.tbStartup}</span>
              </li>
            </ul>
            <p className="text-xs text-fg/70 leading-relaxed mb-6">
              {t.download.tbCompatibility}
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-fg/10">
            {/* Direct dynamic download link to latest installer */}
            <a
              href={tb.downloadUrl ?? 'https://github.com/Raflyf/TransparentBar/releases/latest'}
              className="motion-button w-full min-h-12 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-inverse text-on-inverse font-semibold text-xs sm:text-sm hover:bg-inverse/90 shadow-sm"
            >
              <Download className="w-4 h-4 text-burnt shrink-0" aria-hidden="true" />
              <span>{installerLabel(tb.downloadUrl)}</span>
            </a>

            {tb.portableUrl && (
              <a
                href={tb.portableUrl}
                className="motion-button w-full min-h-11 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-fg/5 hover:bg-fg/10 text-fg border border-fg/15 font-semibold text-xs"
              >
                <Package className="w-4 h-4 text-accent-text shrink-0" aria-hidden="true" />
                <span>{t.download.portableBtn}{tb.portableSizeMb ? ` (${tb.portableSizeMb})` : ''}</span>
              </a>
            )}

            {/* Release version, size, and download count */}
            <div className="text-center py-0.5">
              {tb.version && (
                <div className="text-[11px] text-fg/70 font-mono">
                  {t.download.version} {tb.version.replace(/^v/, '')}{tb.sizeMb && <>, {t.download.about} {tb.sizeMb}</>}.
                </div>
              )}
              <div className="text-xs font-mono text-fg/80 mt-0.5">
                {tb.downloads !== null ? <><strong className="text-fg font-bold text-sm tabular-nums">{tb.downloads.toLocaleString(numberLocale)}</strong> {t.download.downloadsSoFar}</> : t.download.downloadsUnavailable}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="https://github.com/Raflyf/TransparentBar/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-fg/5 hover:bg-fg/10 text-fg border border-fg/15 text-xs font-medium transition-colors"
              >
                <span>Releases</span>
                <ExternalLink className="w-3 h-3 text-fg/70" aria-hidden="true" />
              </a>

              <a
                href="https://github.com/Raflyf/TransparentBar"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-inverse text-on-inverse text-xs font-medium hover:bg-inverse/90 transition-colors"
              >
                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* System Requirements and Security Banner */}
      <div data-reveal className="bg-fg/5 p-5 rounded-2xl border border-fg/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-fg/70">
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 text-accent-text shrink-0" aria-hidden="true" />
          <span>{t.download.requirements}</span>
        </div>
        <div className="flex items-center gap-2 text-fg/70">
          <Terminal className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.download.checksumNote}</span>
        </div>
      </div>

      {/* Code Signing Policy & Privacy Policy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <article
          id="code-signing-policy"
          data-reveal
          className="scroll-mt-24 bg-surface p-6 rounded-2xl border border-fg/10 text-xs leading-relaxed text-fg/80 space-y-3"
        >
          <div className="flex items-center gap-2 font-display font-bold text-base text-fg">
            <ShieldCheck className="w-4 h-4 text-accent-text shrink-0" aria-hidden="true" />
            <h3>{t.download.signingTitle}</h3>
          </div>
          <p className="text-fg font-medium">
            {t.download.signingNoticePrefix}
            <a href="https://signpath.io/" target="_blank" rel="noopener noreferrer" className="text-accent-text underline underline-offset-2">
              SignPath.io
            </a>
            {t.download.signingNoticeMiddle}
            <a href="https://signpath.org/" target="_blank" rel="noopener noreferrer" className="text-accent-text underline underline-offset-2">
              SignPath Foundation
            </a>
            .
          </p>
          <p>{t.download.signingStatus}</p>
          <ul className="space-y-1 font-mono text-[11px] text-fg/80">
            <li>
              <strong className="text-fg">{t.download.signingAuthorsLabel}</strong> {t.download.signingRoleValue}
            </li>
            <li>
              <strong className="text-fg">{t.download.signingReviewersLabel}</strong> {t.download.signingRoleValue} ({t.download.signingReviewersNote})
            </li>
            <li>
              <strong className="text-fg">{t.download.signingApproversLabel}</strong> {t.download.signingRoleValue} ({t.download.signingApproversNote})
            </li>
          </ul>
          <div className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-y-2 pt-1 font-mono text-[11px]">
            <a
              href="https://github.com/Raflyf/WallpaperLive#code-signing-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 sm:min-h-0 inline-flex items-center text-accent-text underline underline-offset-2"
            >
              WallpaperLive policy
            </a>
            <a
              href="https://github.com/Raflyf/TransparentBar#code-signing-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 sm:min-h-0 inline-flex items-center text-accent-text underline underline-offset-2"
            >
              TransparentBar policy
            </a>
          </div>
        </article>

        <article
          id="privacy-policy"
          data-reveal
          className="scroll-mt-24 bg-surface p-6 rounded-2xl border border-fg/10 text-xs leading-relaxed text-fg/80 space-y-3"
        >
          <div className="flex items-center gap-2 font-display font-bold text-base text-fg">
            <Lock className="w-4 h-4 text-accent-text shrink-0" aria-hidden="true" />
            <h3>{t.download.privacyTitle}</h3>
          </div>
          <p className="text-fg font-medium">{t.download.privacyIntro}</p>
          <p>
            <strong className="text-fg">{t.download.privacyWpLabel}</strong> {t.download.privacyWpText}
          </p>
          <p>
            <strong className="text-fg">{t.download.privacyTbLabel}</strong> {t.download.privacyTbText}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-y-2 pt-1 font-mono text-[11px]">
            <a
              href="https://github.com/Raflyf/WallpaperLive#privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 sm:min-h-0 inline-flex items-center text-accent-text underline underline-offset-2"
            >
              WallpaperLive privacy
            </a>
            <a
              href="https://github.com/Raflyf/TransparentBar#privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 sm:min-h-0 inline-flex items-center text-accent-text underline underline-offset-2"
            >
              TransparentBar privacy
            </a>
          </div>
        </article>
      </div>

    </section>
  );
};
