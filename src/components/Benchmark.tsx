import React, { useRef, useState } from 'react';
import { Translation } from '../types/content';
import { Zap, AlertCircle, MoveHorizontal } from 'lucide-react';

interface BenchmarkProps {
  t: Translation;
}

const MAX_RAM_MB = 449.8;

export const Benchmark: React.FC<BenchmarkProps> = ({ t }) => {
  const [split, setSplit] = useState<number>(50);
  const stageRef = useRef<HTMLDivElement>(null);

  const updateSplitFromPointer = (clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = Math.min(96, Math.max(4, Math.round(((clientX - rect.left) / rect.width) * 100)));
    setSplit(pct);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('input')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSplitFromPointer(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons === 0 && event.pointerType === 'mouse') return;
    if (event.currentTarget.hasPointerCapture(event.pointerId) || event.buttons === 1) {
      updateSplitFromPointer(event.clientX);
    }
  };

  return (
    <section id="benchmark" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Container with Ink Black Background (no decorative blur orbs) */}
      <div className="media-frame bg-ink text-cream rounded-3xl p-5 sm:p-10 md:p-12 border border-cream/15 shadow-2xl">

        <div data-reveal className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream/10 border border-cream/15 text-xs font-mono text-cream mb-4">
            <Zap className="w-3.5 h-3.5 text-burnt" aria-hidden="true" />
            <span>{t.benchmark.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-cream">
            {t.benchmark.title}
          </h2>
          <p className="text-sm sm:text-base text-cream/80 leading-relaxed">
            {t.benchmark.subtitle}
          </p>
        </div>

        {/* Interactive 4K GPU Cache Before / After Comparison Scrubber */}
        <div data-reveal className="mb-12 rounded-2xl border border-cream/15 bg-cream/[0.03] p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
            <div className="max-w-2xl">
              <p className="text-[11px] font-mono uppercase tracking-wider text-burnt font-semibold mb-1.5">
                {t.benchmark.compare.badge}
              </p>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-cream">
                {t.benchmark.compare.title}
              </h3>
              <p className="text-xs sm:text-sm text-cream/75 mt-1 leading-relaxed">
                {t.benchmark.compare.subtitle}
              </p>
            </div>
            <span className="self-start lg:self-auto px-3.5 py-1.5 rounded-full bg-burnt text-ink font-mono text-xs font-bold shrink-0 tabular-nums">
              {t.benchmark.compare.deltaBadge}
            </span>
          </div>

          <div
            ref={stageRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            style={{ '--split': `${split}%` } as React.CSSProperties}
            className="compare-stage rounded-2xl border border-cream/15 bg-ink aspect-video cursor-ew-resize"
          >
            {/* Base Layer: Cache Ready (~16s later, 35.4 MB / 1.8% CPU) */}
            <picture className="block w-full h-full">
              <source
                type="image/webp"
                srcSet="/images/opt/showcase-after-cache-640-v2.webp 640w, /images/opt/showcase-after-cache-1280-v2.webp 1280w"
                sizes="(max-width: 768px) 92vw, 1080px"
              />
              <img
                src="/images/opt/showcase-after-cache-1280-v2.webp"
                alt={t.benchmark.compare.afterAlt}
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            </picture>

            {/* Clipped Layer: During 4K GPU Cache (449.8 MB / 12.8% CPU) */}
            <div className="compare-before" aria-hidden="true">
              <picture className="block w-full h-full">
                <source
                  type="image/webp"
                  srcSet="/images/opt/showcase-during-cache-640-v2.webp 640w, /images/opt/showcase-during-cache-1280-v2.webp 1280w"
                  sizes="(max-width: 768px) 92vw, 1080px"
                />
                <img
                  src="/images/opt/showcase-during-cache-1280-v2.webp"
                  alt=""
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              </picture>
            </div>

            {/* Corner Metric Labels */}
            <div className="hidden sm:block pointer-events-none absolute bottom-3 left-3 z-10 max-w-[44%] rounded-lg bg-ink/90 border border-cream/20 px-2.5 py-1.5 font-mono text-xs">
              <span className="block text-burnt font-bold">{t.benchmark.compare.beforeLabel}</span>
              <span className="block text-cream tabular-nums truncate">{t.benchmark.compare.beforeMetric}</span>
            </div>

            <div className="hidden sm:block pointer-events-none absolute bottom-3 right-3 z-10 max-w-[44%] rounded-lg bg-ink/90 border border-cream/20 px-2.5 py-1.5 font-mono text-xs text-right">
              <span className="block text-burnt font-bold">{t.benchmark.compare.afterLabel}</span>
              <span className="block text-cream tabular-nums truncate">{t.benchmark.compare.afterMetric}</span>
            </div>

            {/* Vertical Divider & Grabber Handle */}
            <div className="compare-divider" aria-hidden="true">
              <div className="compare-handle">
                <MoveHorizontal className="w-4 h-4 text-burnt" />
              </div>
            </div>
          </div>

          <div className="sm:hidden mt-2.5 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="rounded-xl bg-cream/5 border border-cream/10 px-2.5 py-2">
              <span className="block text-burnt font-bold">{t.benchmark.compare.beforeLabel}</span>
              <span className="block text-cream tabular-nums">{t.benchmark.compare.beforeMetric}</span>
            </div>
            <div className="rounded-xl bg-cream/5 border border-cream/10 px-2.5 py-2 text-right">
              <span className="block text-burnt font-bold">{t.benchmark.compare.afterLabel}</span>
              <span className="block text-cream tabular-nums">{t.benchmark.compare.afterMetric}</span>
            </div>
          </div>

          {/* Accessible Range Scrubber & Preset Controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label htmlFor="cache-compare-range" className="sr-only">
              {t.benchmark.compare.sliderAriaLabel}
            </label>
            <input
              id="cache-compare-range"
              type="range"
              min={0}
              max={100}
              value={split}
              onChange={event => setSplit(Number(event.target.value))}
              aria-label={t.benchmark.compare.sliderAriaLabel}
              className="compare-range flex-1 min-h-11"
            />
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSplit(88)}
                aria-pressed={split >= 75}
                className={`min-h-11 px-3 py-2 rounded-xl font-mono text-xs transition-colors cursor-pointer ${
                  split >= 75 ? 'bg-burnt text-ink font-bold' : 'bg-cream/10 hover:bg-cream/15 text-cream'
                }`}
              >
                {t.benchmark.compare.presetBefore}
              </button>
              <button
                type="button"
                onClick={() => setSplit(50)}
                aria-pressed={split > 25 && split < 75}
                className={`min-h-11 px-3 py-2 rounded-xl font-mono text-xs transition-colors cursor-pointer ${
                  split > 25 && split < 75 ? 'bg-cream text-ink font-bold' : 'bg-cream/10 hover:bg-cream/15 text-cream'
                }`}
              >
                {t.benchmark.compare.presetSplit}
              </button>
              <button
                type="button"
                onClick={() => setSplit(12)}
                aria-pressed={split <= 25}
                className={`min-h-11 px-3 py-2 rounded-xl font-mono text-xs transition-colors cursor-pointer ${
                  split <= 25 ? 'bg-burnt text-ink font-bold' : 'bg-cream/10 hover:bg-cream/15 text-cream'
                }`}
              >
                {t.benchmark.compare.presetAfter}
              </button>
            </div>
          </div>
        </div>

        {/* Real Task Manager Captured Data + Proportional Bars */}
        <div data-reveal data-lenis-prevent-horizontal className="mb-10">
          {/* Mobile stacked cards (< 768px) to prevent horizontal table clipping */}
          <div className="space-y-3 md:hidden">
            {t.benchmark.rows.map((row, idx) => {
              const pct = Math.max(2, Math.round((row.ramMb / MAX_RAM_MB) * 100));
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border border-cream/10 p-4 ${
                    row.highlight === 'accent'
                      ? 'bg-burnt/15 border-l-2 border-l-burnt'
                      : row.highlight === 'subtle'
                        ? 'bg-cream/[0.06] border-l-2 border-l-cream/50'
                        : 'bg-cream/[0.03]'
                  }`}
                >
                  <div className="font-sans text-sm font-bold text-cream mb-2">{row.state}</div>
                  <div className="telemetry-bar-track mb-3" aria-hidden="true">
                    <div className="telemetry-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <dl className="grid grid-cols-2 gap-3 font-mono text-xs mb-2.5 pb-2.5 border-b border-cream/10">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-burnt mb-0.5">{t.benchmark.ramCol}</dt>
                      <dd className="tabular-nums font-bold text-cream">{row.ram}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-cream/70 mb-0.5">{t.benchmark.cpuCol}</dt>
                      <dd className="tabular-nums font-bold text-cream">{row.cpu}</dd>
                    </div>
                  </dl>
                  <p className="font-mono text-[11px] leading-relaxed text-cream/80">{row.notes}</p>
                </div>
              );
            })}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-cream/15 text-cream/75 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">{t.benchmark.stateCol}</th>
                  <th className="py-3 px-4 text-cream whitespace-nowrap">{t.benchmark.ramCol}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{t.benchmark.cpuCol}</th>
                  <th className="py-3 px-4">{t.benchmark.notesCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/10 text-cream/90">
                {t.benchmark.rows.map((row, idx) => {
                  const pct = Math.max(2, Math.round((row.ramMb / MAX_RAM_MB) * 100));
                  const rowBg = row.highlight === 'accent'
                    ? 'bg-burnt/15 border-l-2 border-burnt hover:bg-burnt/20'
                    : row.highlight === 'subtle'
                      ? 'bg-cream/[0.04] hover:bg-cream/[0.08]'
                      : 'hover:bg-cream/5';
                  return (
                    <tr key={idx} className={`${rowBg} transition-colors`}>
                      <td className="py-3.5 px-4 font-sans font-bold text-cream">{row.state}</td>
                      <td className="py-3.5 px-4 min-w-[11rem]">
                        <div className="tabular-nums font-bold text-cream mb-1.5">{row.ram}</div>
                        <div className="telemetry-bar-track" aria-hidden="true">
                          <div className="telemetry-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 tabular-nums whitespace-nowrap font-bold text-cream">{row.cpu}</td>
                      <td className="py-3.5 px-4 text-cream/80 text-xs">{row.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer / Context Box directly echoing author's note */}
        <div data-reveal className="bg-cream/5 border border-cream/10 rounded-2xl p-5 flex items-start gap-3.5 text-xs font-mono text-cream/80 leading-relaxed">
          <AlertCircle className="w-5 h-5 text-burnt shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold text-cream block mb-1">{t.benchmark.contextTitle}</span>
            <span>{t.benchmark.disclaimer}</span>
          </div>
        </div>

      </div>

    </section>
  );
};
