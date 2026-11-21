import React from 'react';
import { Translation } from '../types/content';
import { Cpu, Clock, BatteryMedium, Layers, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface FeaturesProps {
  t: Translation;
}

export const Features: React.FC<FeaturesProps> = ({ t }) => {
  const { items } = t.features;

  const secondaryCards = [
    { icon: <BatteryMedium className="w-5 h-5 text-accent-text" aria-hidden="true" />, title: items.f3Title, desc: items.f3Desc, spec: 'WallpaperLive' },
    { icon: <Layers className="w-5 h-5 text-accent-text" aria-hidden="true" />, title: items.f4Title, desc: items.f4Desc, spec: 'TransparentBar' },
    { icon: <SlidersHorizontal className="w-5 h-5 text-accent-text" aria-hidden="true" />, title: items.f5Title, desc: items.f5Desc, spec: 'XAML Connector' },
    { icon: <ShieldCheck className="w-5 h-5 text-accent-text" aria-hidden="true" />, title: items.f6Title, desc: items.f6Desc, spec: 'SHA-256 Local' },
  ];

  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Header */}
      <div data-reveal className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <p className="text-xs font-mono uppercase tracking-wider text-accent-text font-semibold">
          {t.features.badge}
        </p>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-fg tracking-tight">
          {t.features.title}
        </h2>
        <p className="text-sm sm:text-base text-fg/75 leading-relaxed">
          {t.features.subtitle}
        </p>
      </div>

      {/* Asymmetric Editorial Bento Grid: Consistent Surface Cards Across All Columns */}
      <div className="space-y-5">
        <div className="motion-sequence grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Featured 1 (7 columns on desktop): GPU-Accelerated 4K Cache */}
          <article
            data-reveal
            className="motion-card lg:col-span-7 bg-surface p-7 sm:p-8 rounded-3xl border border-fg/10 hover:border-burnt/40 shadow-xs flex flex-col justify-between gap-6"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-fg/5 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-accent-text" aria-hidden="true" />
                </div>
                <span className="px-3 py-1 rounded-full bg-fg/5 border border-fg/10 text-[11px] font-mono text-fg/80 font-semibold">
                  {t.features.featuredBadge}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-fg mb-3">
                {items.f1Title}
              </h3>
              <p className="text-sm text-fg/75 leading-relaxed">
                {items.f1Desc}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {items.f1Tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-fg/5 border border-fg/10 text-[11px] font-mono text-fg/85">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Featured 2 (5 columns on desktop): Day Clock & Acrylic */}
          <article
            data-reveal
            className="motion-card lg:col-span-5 bg-surface p-7 sm:p-8 rounded-3xl border border-fg/10 hover:border-burnt/40 shadow-xs flex flex-col justify-between gap-6"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-fg/5 flex items-center justify-center mb-5">
                <Clock className="w-5 h-5 text-accent-text" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-fg mb-3">
                {items.f2Title}
              </h3>
              <p className="text-sm text-fg/75 leading-relaxed">
                {items.f2Desc}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {items.f2Tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-fg/5 border border-fg/10 text-[11px] font-mono text-fg/85">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </div>

        {/* Lower Row: 4 Focused Specification Cards */}
        <div className="motion-sequence grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-5">
          {secondaryCards.map((card, idx) => (
            <article
              key={idx}
              data-reveal
              className="motion-card bg-surface p-6 rounded-3xl border border-fg/10 hover:border-burnt/40 shadow-xs flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-fg/5 flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="font-display text-base font-bold text-fg mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-fg/75 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-fg/10 text-[11px] font-mono text-accent-text font-semibold">
                {card.spec}
              </div>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
};
