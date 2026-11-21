import React, { useCallback, useEffect, useRef, useState } from 'react';
import { setupVideoVisibility } from '../motion';
import { Translation } from '../types/content';
import type { SimulatorTabKey, TelemetryStateKey } from '../types/schema';
import { Monitor, LayoutGrid, Clock, Settings, Layers, Activity, ExternalLink, Maximize2, X, Volume2, VolumeX } from 'lucide-react';

interface SimulatorProps {
  t: Translation;
}

const TAB_KEYS: SimulatorTabKey[] = ['desktop', 'library', 'clock', 'settings', 'telemetry', 'taskbar'];
const TELEMETRY_KEYS: TelemetryStateKey[] = ['tray', 'openPanel', 'cached', 'paused'];

const IMAGE_MEDIA_MAP: Record<Exclude<SimulatorTabKey, 'desktop' | 'telemetry'>, { base: string; width: number; height: number; repoLink: string }> = {
  library: {
    base: 'showcase-library',
    width: 1280,
    height: 720,
    repoLink: 'https://github.com/Raflyf/WallpaperLive',
  },
  clock: {
    base: 'showcase-clock',
    width: 1280,
    height: 720,
    repoLink: 'https://github.com/Raflyf/WallpaperLive',
  },
  settings: {
    base: 'showcase-settings',
    width: 1280,
    height: 720,
    repoLink: 'https://github.com/Raflyf/WallpaperLive',
  },
  taskbar: {
    base: 'desktop-preview',
    width: 1200,
    height: 925,
    repoLink: 'https://github.com/Raflyf/TransparentBar',
  },
};

function webpUrl(base: string, size: 640 | 1200 | 1280): string {
  if (base === 'desktop-preview') {
    return `/images/opt/desktop-preview-${size === 640 ? '640' : '1200'}-v2.webp`;
  }
  return `/images/opt/${base}-${size}-v2.webp`;
}

function webpSrcSet(base: string): string {
  if (base === 'desktop-preview') {
    return '/images/opt/desktop-preview-640-v2.webp 640w, /images/opt/desktop-preview-1200-v2.webp 1200w';
  }
  return `/images/opt/${base}-640-v2.webp 640w, /images/opt/${base}-1280-v2.webp 1280w`;
}

export const DesktopSimulator: React.FC<SimulatorProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<SimulatorTabKey>('desktop');
  const [telemetryKey, setTelemetryKey] = useState<TelemetryStateKey>('tray');
  const [videoMuted, setVideoMuted] = useState<boolean>(true);
  const [lightboxMedia, setLightboxMedia] = useState<{ src: string; alt: string; caption: string; width: number; height: number } | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; top: number; width: number; height: number; ready: boolean }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef<Record<SimulatorTabKey, HTMLButtonElement | null>>({
    desktop: null,
    library: null,
    clock: null,
    settings: null,
    taskbar: null,
    telemetry: null,
  });

  useEffect(() => {
    if (videoRef.current) return setupVideoVisibility(videoRef.current);
  }, []);

  const syncIndicator = useCallback(() => {
    const container = tabListRef.current;
    const btn = tabRefs.current[activeTab];
    if (!container || !btn) return;
    setIndicator({
      left: btn.offsetLeft,
      top: btn.offsetTop,
      width: btn.offsetWidth,
      height: btn.offsetHeight,
      ready: true,
    });
  }, [activeTab]);

  useEffect(() => {
    syncIndicator();
    window.addEventListener('resize', syncIndicator);
    return () => window.removeEventListener('resize', syncIndicator);
  }, [syncIndicator]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxMedia && !dialog.open) {
      dialog.showModal();
    } else if (!lightboxMedia && dialog.open) {
      dialog.close();
    }
  }, [lightboxMedia]);

  const handleTabKeyDown = (currentIndex: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % TAB_KEYS.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + TAB_KEYS.length) % TAB_KEYS.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = TAB_KEYS.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextKey = TAB_KEYS[nextIndex];
    setActiveTab(nextKey);
    tabRefs.current[nextKey]?.focus();
  };

  const renderTabIcon = (key: SimulatorTabKey) => {
    switch (key) {
      case 'desktop': return <Monitor className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case 'library': return <LayoutGrid className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case 'clock': return <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case 'settings': return <Settings className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case 'taskbar': return <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case 'telemetry': return <Activity className="w-4 h-4 shrink-0" aria-hidden="true" />;
    }
  };

  const activeTelemetry = t.simulator.telemetryStates[telemetryKey];
  const caption = t.simulator.captions[activeTab];

  let frameTag = t.simulator.desktopTag;
  let repoLink = 'https://github.com/Raflyf/WallpaperLive';
  let activeImageSpec: { src: string; srcSet: string; alt: string; captionText: string; width: number; height: number } | null = null;

  if (activeTab === 'telemetry') {
    frameTag = activeTelemetry.versionTag;
    repoLink = 'https://github.com/Raflyf/WallpaperLive#resource-use';
    const fullSrc = webpUrl(activeTelemetry.imageBase, 1280);
    activeImageSpec = {
      src: fullSrc,
      srcSet: webpSrcSet(activeTelemetry.imageBase),
      alt: activeTelemetry.alt,
      captionText: activeTelemetry.caption,
      width: activeTelemetry.width,
      height: activeTelemetry.height,
    };
  } else if (activeTab !== 'desktop') {
    const meta = IMAGE_MEDIA_MAP[activeTab];
    frameTag = t.simulator.tags[activeTab];
    repoLink = meta.repoLink;
    activeImageSpec = {
      src: webpUrl(meta.base, meta.base === 'desktop-preview' ? 1200 : 1280),
      srcSet: webpSrcSet(meta.base),
      alt: t.simulator.alts[activeTab],
      captionText: caption.desc,
      width: meta.width,
      height: meta.height,
    };
  }

  return (
    <section id="simulator" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Header */}
      <div data-reveal className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <p className="text-xs font-mono text-accent-text font-semibold uppercase tracking-wider">
          {t.simulator.tag}
        </p>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-fg tracking-tight">
          {t.simulator.title}
        </h2>
        <p className="text-sm sm:text-base text-fg/75 leading-relaxed">
          {t.simulator.subtitle}
        </p>
      </div>

      {/* Interactive Workbench Tabs with Sliding Active Indicator */}
      <div
        ref={tabListRef}
        data-reveal
        role="tablist"
        aria-label={t.simulator.title}
        className="showcase-tablist flex flex-wrap items-center justify-center gap-2 mb-6"
      >
        {indicator.ready && (
          <span
            aria-hidden="true"
            className="showcase-tab-indicator"
            style={{
              width: `${indicator.width}px`,
              height: `${indicator.height}px`,
              transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
            }}
          />
        )}
        {TAB_KEYS.map((key, index) => {
          const isSelected = activeTab === key;
          return (
            <button
              key={key}
              ref={el => { tabRefs.current[key] = el; }}
              type="button"
              role="tab"
              id={`showcase-tab-${key}`}
              aria-selected={isSelected}
              aria-controls="showcase-panel"
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(key)}
              onKeyDown={handleTabKeyDown(index)}
              className={`relative z-10 min-h-11 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? (indicator.ready ? 'text-on-inverse font-bold' : 'bg-inverse text-on-inverse font-bold')
                  : 'bg-surface/90 hover:bg-fg/10 text-fg/85 border border-fg/15'
              }`}
            >
              <span className={isSelected ? 'text-burnt' : 'text-accent-text'}>{renderTabIcon(key)}</span>
              <span>{t.simulator.tabs[key]}</span>
            </button>
          );
        })}
      </div>

      {/* Container */}
      <div
        data-reveal
        role="tabpanel"
        id="showcase-panel"
        aria-labelledby={`showcase-tab-${activeTab}`}
        className="overflow-x-hidden rounded-3xl p-3 sm:p-5 bg-surface text-fg shadow-xs border border-fg/10"
      >

        {/* Frame Top Window Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-fg/75 text-xs font-mono border-b border-fg/10 mb-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-burnt shrink-0" aria-hidden="true" />
            <span className="text-fg/85 font-semibold truncate">{frameTag}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 max-w-full">
            {activeTab === 'desktop' && (
              <button
                type="button"
                aria-pressed={!videoMuted}
                onClick={() => {
                  const vid = videoRef.current;
                  if (!vid) return;
                  const nextMuted = !vid.muted;
                  if (!nextMuted && vid.volume === 0) vid.volume = 1;
                  vid.muted = nextMuted;
                  setVideoMuted(nextMuted);
                }}
                className="inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 px-2.5 py-1 rounded-lg bg-fg/5 hover:bg-fg/10 border border-fg/15 text-fg text-xs font-mono transition-colors cursor-pointer"
              >
                {videoMuted
                  ? <VolumeX className="w-3.5 h-3.5 text-accent-text shrink-0" aria-hidden="true" />
                  : <Volume2 className="w-3.5 h-3.5 text-accent-text shrink-0" aria-hidden="true" />}
                <span>{videoMuted ? t.simulator.soundOff : t.simulator.soundOn}</span>
              </button>
            )}
            {activeImageSpec && (
              <button
                type="button"
                onClick={() => setLightboxMedia({
                  src: activeImageSpec.src,
                  alt: activeImageSpec.alt,
                  caption: activeImageSpec.captionText,
                  width: activeImageSpec.width,
                  height: activeImageSpec.height,
                })}
                className="inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 px-2.5 py-1 rounded-lg bg-fg/5 hover:bg-fg/10 border border-fg/15 text-fg text-xs font-mono transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-accent-text shrink-0" aria-hidden="true" />
                <span>{t.simulator.inspectFull}</span>
              </button>
            )}
            <a
              href={repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 sm:min-h-0 items-center gap-1.5 text-xs text-accent-text hover:underline whitespace-nowrap"
            >
              <span>{t.simulator.sourceLink}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Sub-Switcher Inside Telemetry Tab */}
        {activeTab === 'telemetry' && (
          <div className="mb-3 space-y-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t.simulator.tabs.telemetry}>
              {TELEMETRY_KEYS.map(key => {
                const stateSpec = t.simulator.telemetryStates[key];
                const selected = telemetryKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setTelemetryKey(key)}
                    className={`min-h-11 px-3.5 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer flex items-center gap-2 ${
                      selected
                        ? 'bg-burnt text-ink font-bold'
                        : 'bg-fg/5 hover:bg-fg/10 text-fg/85 border border-fg/15'
                    }`}
                  >
                    <span>{stateSpec.label}</span>
                    <span className={`tabular-nums ${selected ? 'text-ink/85' : 'text-fg/65'}`}>
                      {stateSpec.ram}
                    </span>
                  </button>
                );
              })}
            </div>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-2xl bg-canvas/70 border border-fg/10 p-3 font-mono text-xs">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-fg/65">{t.simulator.telemetryMetricsLabel.ram}</dt>
                <dd className="text-sm font-bold text-fg tabular-nums mt-0.5">{activeTelemetry.ram}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-fg/65">{t.simulator.telemetryMetricsLabel.cpu}</dt>
                <dd className="text-sm font-bold text-fg tabular-nums mt-0.5">{activeTelemetry.cpu}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-fg/65">{t.simulator.telemetryMetricsLabel.disk}</dt>
                <dd className="text-sm font-bold text-fg tabular-nums mt-0.5">{activeTelemetry.disk}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-fg/65">{t.simulator.telemetryMetricsLabel.net}</dt>
                <dd className="text-sm font-bold text-fg tabular-nums mt-0.5">{activeTelemetry.net}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Lightweight WebM + Faststart MP4 Video / WebP Screenshot Stage */}
        <div className="relative rounded-2xl overflow-hidden bg-ink flex items-center justify-center border border-fg/15 aspect-video">
          <video
            ref={videoRef}
            hidden={activeTab !== 'desktop'}
            poster="/images/opt/showcase-video-poster-640-v2.webp"
            preload="none"
            loop
            muted={videoMuted}
            onVolumeChange={event => setVideoMuted(event.currentTarget.muted)}
            playsInline
            controls
            aria-label={t.simulator.alts.desktop}
            className="w-full h-full object-contain select-none"
          >
            <source src="/video/wallpaperlive-showcase-v0.2.5-v2.webm" type="video/webm" />
            <source src="/video/wallpaperlive-showcase-v0.2.5-v2.mp4" type="video/mp4" />
            {t.simulator.videoUnsupported}
          </video>

          {activeTab !== 'desktop' && activeImageSpec && (
            <button
              type="button"
              onClick={() => setLightboxMedia({
                src: activeImageSpec.src,
                alt: activeImageSpec.alt,
                caption: activeImageSpec.captionText,
                width: activeImageSpec.width,
                height: activeImageSpec.height,
              })}
              aria-label={t.simulator.inspectFull}
              className="w-full h-full block cursor-zoom-in focus-visible:outline-2 focus-visible:outline-burnt"
            >
              <picture key={activeImageSpec.src} className="w-full h-full block motion-swap">
                <source type="image/webp" srcSet={activeImageSpec.srcSet} sizes="(max-width: 768px) 92vw, 1080px" />
                <img
                  src={activeImageSpec.src}
                  alt={activeImageSpec.alt}
                  width={activeImageSpec.width}
                  height={activeImageSpec.height}
                  className="w-full h-full object-contain select-none"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </button>
          )}
        </div>

        {/* Caption Bar */}
        <div key={`${activeTab}-${telemetryKey}`} className="motion-swap mt-4 px-3.5 py-3 rounded-2xl bg-canvas/70 border border-fg/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-fg">
          <div>
            <h3 className="font-display font-bold text-sm text-fg">
              {activeTab === 'telemetry' ? `${caption.title}: ${activeTelemetry.label}` : caption.title}
            </h3>
            <p className="text-xs text-fg/75 mt-0.5 leading-relaxed">
              {activeTab === 'telemetry' ? activeTelemetry.caption : caption.desc}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-burnt text-ink text-[11px] font-mono shrink-0 font-bold">
            {activeTab === 'desktop' ? t.simulator.desktopBadge : t.simulator.tabs[activeTab]}
          </span>
        </div>

      </div>

      {/* Native Top-Layer Lightbox Dialog (loads image only when opened) */}
      <dialog
        ref={dialogRef}
        className="lightbox-dialog"
        aria-label={t.simulator.inspectFull}
        onCancel={() => setLightboxMedia(null)}
        onClick={event => {
          if (event.target === dialogRef.current) setLightboxMedia(null);
        }}
      >
        {lightboxMedia && (
          <div className="flex flex-col bg-ink text-cream">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-cream/15">
              <p className="text-xs font-mono text-cream/85 truncate">{lightboxMedia.caption}</p>
              <button
                type="button"
                onClick={() => setLightboxMedia(null)}
                aria-label={t.simulator.closeLightbox}
                className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl bg-cream/10 hover:bg-burnt hover:text-ink text-cream transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="p-2 sm:p-4 flex items-center justify-center bg-ink">
              <img
                src={lightboxMedia.src}
                alt={lightboxMedia.alt}
                width={lightboxMedia.width}
                height={lightboxMedia.height}
                className="max-h-[78dvh] w-auto h-auto object-contain rounded-xl"
                decoding="async"
              />
            </div>
          </div>
        )}
      </dialog>

    </section>
  );
};
