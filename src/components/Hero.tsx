import React from 'react';
import { Translation } from '../types/content';
import { Download, Heart, ArrowRight, Layers, Zap, PauseCircle } from 'lucide-react';
import { scrollToSection } from '../utils/scroll';
import type { ProductReleases } from '../releases';

interface HeroProps {
  t: Translation;
  releases: ProductReleases;
}

export const Hero: React.FC<HeroProps> = ({ t, releases }) => {
  const anyUnavailable = releases.WallpaperLive.status === 'unavailable' || releases.TransparentBar.status === 'unavailable';

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Top Specification Strip (non-pill editorial masthead) */}
      <div className="flex justify-center mb-5">
        <p className="text-xs font-mono tracking-wide uppercase text-fg/75 text-center border-b border-fg/15 pb-1.5">
          {t.hero.badge}
        </p>
      </div>

      {/* Main Editorial Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-fg leading-[1.06]">
          <span className="hero-line block">{t.hero.titlePart1}</span>
          <span className="hero-line block text-burnt italic font-normal">
            {t.hero.titlePart2}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-fg/80 leading-relaxed max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={scrollToSection('download')}
            className="motion-button w-full sm:w-auto min-h-12 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-burnt text-ink font-semibold text-sm hover:bg-burnt-hover transition-[color,background-color,box-shadow,transform] shadow-md shadow-burnt/20 cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{t.hero.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 opacity-75" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={scrollToSection('support')}
            className="motion-button w-full sm:w-auto min-h-12 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-inverse text-on-inverse font-semibold text-sm hover:bg-inverse/90 transition-[color,background-color,box-shadow,transform] shadow-sm cursor-pointer"
          >
            <Heart className="w-4 h-4 text-burnt fill-burnt" aria-hidden="true" />
            <span>{t.hero.ctaSecondary}</span>
          </button>
        </div>

        <p className="text-xs font-mono text-fg/75 pt-1">
          WallpaperLive {releases.WallpaperLive.version ?? 'v0.2.5'} · TransparentBar {releases.TransparentBar.version ?? 'v0.2.5'} · {t.hero.metaInfo}
          {anyUnavailable && (
            <span className="block mt-1">
              {t.download.releaseUnavailable}{' '}
              <a
                href="https://github.com/Raflyf/WallpaperLive/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-accent-text"
              >
                WallpaperLive
              </a>{' '}
              ·{' '}
              <a
                href="https://github.com/Raflyf/TransparentBar/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-accent-text"
              >
                TransparentBar
              </a>
            </span>
          )}
        </p>
      </div>

      {/* 3 Value Metric Cards */}
      <div className="motion-sequence grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-4 mt-14 pt-8 border-t border-fg/10">
        <div className="motion-card bg-surface p-5 rounded-2xl border border-fg/10 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-fg/5 text-accent-text shrink-0">
            <Zap className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="font-display font-bold text-2xl text-fg tabular-nums">
              {t.hero.stat1}
            </div>
            <div className="text-xs text-fg/75 font-medium mt-0.5 leading-relaxed">
              {t.hero.stat1Sub}
            </div>
          </div>
        </div>

        <div className="motion-card bg-surface p-5 rounded-2xl border border-fg/10 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-fg/5 text-accent-text shrink-0">
            <PauseCircle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="font-display font-bold text-2xl text-fg tabular-nums">
              {t.hero.stat2}
            </div>
            <div className="text-xs text-fg/75 font-medium mt-0.5 leading-relaxed">
              {t.hero.stat2Sub}
            </div>
          </div>
        </div>

        <div className="motion-card bg-surface p-5 rounded-2xl border border-fg/10 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-fg/5 text-accent-text shrink-0">
            <Layers className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="font-display font-bold text-2xl text-fg tabular-nums">
              {t.hero.stat3}
            </div>
            <div className="text-xs text-fg/75 font-medium mt-0.5 leading-relaxed">
              {t.hero.stat3Sub}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
