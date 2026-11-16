import React, { useEffect, useRef, useState } from 'react';
import { setupVideoVisibility } from '../motion';
import { Translation } from '../types/content';
import { Monitor, Image as ImageIcon, Sliders, CheckCircle2, ExternalLink } from 'lucide-react';

interface SimulatorProps {
  t: Translation;
}

type TabKey = 'desktop' | 'library' | 'taskbar' | 'telemetry';

const TAB_KEYS: TabKey[] = ['desktop', 'library', 'taskbar', 'telemetry'];

export const DesktopSimulator: React.FC<SimulatorProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('desktop');
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    desktop: null,
    library: null,
    taskbar: null,
    telemetry: null,
  });

  useEffect(() => {
    if (videoRef.current) return setupVideoVisibility(videoRef.current);
  }, []);

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

  const tabData = {
    desktop: {
      image: 'https://raw.githubusercontent.com/Raflyf/WallpaperLive/main/assets/screenshots/preview-v0.1.5.png',
      width: 1920,
      height: 1080,
      alt: t.simulator.alts.desktop,
      title: t.simulator.captions.desktopTitle,
      desc: t.simulator.captions.desktopDesc,
      tag: t.simulator.desktopTag,
      repoLink: 'https://github.com/Raflyf/WallpaperLive',
    },
    library: {
      image: 'https://raw.githubusercontent.com/Raflyf/WallpaperLive/main/assets/screenshots/cache-ready-v0.1.6.png',
      width: 1917,
      height: 883,
      alt: t.simulator.alts.library,
      title: t.simulator.captions.libraryTitle,
      desc: t.simulator.captions.libraryDesc,
      tag: 'WallpaperLive v0.1.6 · Rust / Win32',
      repoLink: 'https://github.com/Raflyf/WallpaperLive',
    },
    taskbar: {
      image: 'https://raw.githubusercontent.com/Raflyf/TransparentBar/main/assets/desktop-preview.png',
      width: 1440,
      height: 1110,
      alt: t.simulator.alts.taskbar,
      title: t.simulator.captions.taskbarTitle,
      desc: t.simulator.captions.taskbarDesc,
      tag: 'Native Rust · legacy / XAML',
      repoLink: 'https://github.com/Raflyf/TransparentBar',
    },
    telemetry: {
      image: '/images/resource-use-orange.png',
      width: 1600,
      height: 550,
      alt: t.simulator.alts.telemetry,
      title: t.simulator.captions.telemetryTitle,
      desc: t.simulator.captions.telemetryDesc,
      tag: 'Task Manager · v0.1.5',
      repoLink: 'https://github.com/Raflyf/WallpaperLive#resource-use',
    },
  };

  const current = tabData[activeTab];

  const renderTabIcon = (key: TabKey) => {
    switch (key) {
      case 'desktop': return <Monitor className="w-4 h-4 text-accent-text shrink-0" aria-hidden="true" />;
      case 'library': return <Sliders className="w-4 h-4 text-accent-text shrink-0" aria-hidden="true" />;
      case 'taskbar': return <ImageIcon className="w-4 h-4 text-accent-text shrink-0" aria-hidden="true" />;
      case 'telemetry': return <span className="w-2 h-2 rounded-full bg-burnt shrink-0" aria-hidden="true"></span>;
    }
  };

  return (
    <section id="simulator" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Header */}
      <div data-reveal className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burnt/10 border border-burnt/20 text-xs font-mono text-accent-text font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.simulator.tag}</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-fg tracking-tight">
          {t.simulator.title}
        </h2>
        <p className="text-sm sm:text-base text-fg/70 leading-relaxed">
          {t.simulator.subtitle}
        </p>
      </div>

      {/* Interactive Tab Controls */}
      <div data-reveal role="tablist" aria-label={t.simulator.title} className="flex flex-wrap items-center justify-center gap-2 mb-6">
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
              className={`motion-button min-h-11 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-[color,background-color,border-color,box-shadow] flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-inverse text-on-inverse font-bold shadow-sm'
                  : 'bg-surface hover:bg-fg/10 text-fg/80 border border-fg/15'
              }`}
            >
              {renderTabIcon(key)}
              <span>{t.simulator.tabs[key]}</span>
            </button>
          );
        })}
      </div>

      {/* Authentic High-Res Frame */}
      <div
        data-reveal
        role="tabpanel"
        id="showcase-panel"
        aria-labelledby={`showcase-tab-${activeTab}`}
        className="media-frame rounded-3xl p-3 sm:p-5 bg-ink shadow-2xl border border-fg/20"
      >

        {/* Frame Top Window Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-cream/70 text-xs font-mono border-b border-cream/10 mb-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-burnt shrink-0" aria-hidden="true"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-cream/60 shrink-0" aria-hidden="true"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-cream/30 shrink-0" aria-hidden="true"></div>
            <span className="ml-1 text-cream/75 font-semibold truncate">{current.tag}</span>
          </div>

          <a
            href={current.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 sm:min-h-0 items-center gap-1.5 text-xs text-accent-text hover:underline whitespace-nowrap shrink-0"
          >
            <span>{t.simulator.sourceLink}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>

        {/* High-Resolution Video / Capture Display */}
        <div className={`relative rounded-2xl overflow-hidden bg-ink flex items-center justify-center border border-cream/5 ${activeTab === 'telemetry' ? 'aspect-[32/11]' : 'aspect-video'}`}>
          <video
            ref={videoRef}
            hidden={activeTab !== 'desktop'}
            src="/video/1109.mp4"
            poster="https://raw.githubusercontent.com/Raflyf/WallpaperLive/main/assets/screenshots/preview-v0.1.5.png"
            preload="metadata"
            loop
            muted
            playsInline
            controls
            className="w-full h-full object-contain select-none"
          >
            {t.simulator.videoUnsupported}
          </video>
          {activeTab !== 'desktop' && (
            <img
              key={current.image}
              src={current.image}
              alt={current.alt}
              width={current.width}
              height={current.height}
              className="w-full h-full object-contain select-none motion-swap"
              loading="lazy"
            />
          )}
        </div>

        {/* Caption Bar */}
        <div key={activeTab} className="motion-swap mt-4 px-3 py-3 rounded-2xl bg-cream/5 border border-cream/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-cream">
          <div>
            <h3 className="font-display font-bold text-sm text-cream flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-burnt shrink-0" aria-hidden="true"></span>
              {current.title}
            </h3>
            <p className="text-xs text-cream/75 mt-0.5 leading-relaxed">
              {current.desc}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-burnt/20 text-accent-text text-[11px] font-mono shrink-0 font-medium">
            {activeTab === 'desktop' ? t.simulator.desktopBadge : t.simulator.tag}
          </span>
        </div>

      </div>

    </section>
  );
};
