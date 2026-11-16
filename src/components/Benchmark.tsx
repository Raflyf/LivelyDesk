import React from 'react';
import { Translation } from '../types/content';
import { Zap, AlertCircle } from 'lucide-react';

interface BenchmarkProps {
  t: Translation;
}

export const Benchmark: React.FC<BenchmarkProps> = ({ t }) => {
  const rows = [
    { state: t.benchmark.row1State, ram: t.benchmark.row1Ram, cpu: t.benchmark.row1Cpu, notes: t.benchmark.row1Notes, rowClass: 'hover:bg-cream/5', ramClass: 'font-bold text-cream', cpuClass: 'text-cream font-bold', stateClass: 'font-sans font-medium text-cream' },
    { state: t.benchmark.row2State, ram: t.benchmark.row2Ram, cpu: t.benchmark.row2Cpu, notes: t.benchmark.row2Notes, rowClass: 'hover:bg-cream/5', ramClass: 'font-bold text-cream/90', cpuClass: 'text-cream/90 font-bold', stateClass: 'font-sans font-medium text-cream' },
    { state: t.benchmark.row3State, ram: t.benchmark.row3Ram, cpu: t.benchmark.row3Cpu, notes: t.benchmark.row3Notes, rowClass: 'bg-burnt/10 border-l-2 border-burnt hover:bg-burnt/15', ramClass: 'font-bold text-accent-text sm:text-base', cpuClass: 'text-accent-text font-bold sm:text-base', stateClass: 'font-sans font-bold text-cream' },
    { state: t.benchmark.row4State, ram: t.benchmark.row4Ram, cpu: t.benchmark.row4Cpu, notes: t.benchmark.row4Notes, rowClass: 'hover:bg-cream/5', ramClass: 'font-bold text-cream sm:text-base', cpuClass: 'text-cream font-bold sm:text-base', stateClass: 'font-sans font-medium text-cream' },
    { state: t.benchmark.tbRowState, ram: t.benchmark.tbRowRam, cpu: t.benchmark.tbRowCpu, notes: t.benchmark.tbRowNotes, rowClass: 'bg-cream/5 border-l-2 border-burnt hover:bg-cream/10', ramClass: 'font-bold text-cream sm:text-base', cpuClass: 'text-cream font-bold sm:text-base', stateClass: 'font-sans font-bold text-cream' },
  ];

  return (
    <section id="benchmark" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Container with Ink Black Background */}
      <div className="media-frame bg-ink text-cream rounded-3xl p-5 sm:p-10 md:p-12 border border-cream/10 shadow-2xl relative overflow-hidden">

        {/* Glow background accent */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-burnt/20 blur-3xl pointer-events-none" aria-hidden="true"></div>

        <div data-reveal className="relative z-10 max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream/10 border border-cream/15 text-xs font-mono text-accent-text mb-4">
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.benchmark.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-cream">
            {t.benchmark.title}
          </h2>
          <p className="text-sm sm:text-base text-cream/75 leading-relaxed">
            {t.benchmark.subtitle}
          </p>
        </div>

        {/* Real Task Manager Captured Data */}
        <div data-reveal data-lenis-prevent-horizontal className="mb-10">
          {/* Mobile stacked cards (< 768px) to prevent horizontal table clipping */}
          <div className="space-y-3 md:hidden">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border border-cream/10 p-4 ${
                  idx === 2
                    ? 'bg-burnt/10 border-l-2 border-l-burnt'
                    : idx === 4
                      ? 'bg-cream/5 border-l-2 border-l-burnt'
                      : 'bg-cream/[0.03]'
                }`}
              >
                <div className={`text-sm mb-2.5 ${row.stateClass}`}>{row.state}</div>
                <dl className="grid grid-cols-2 gap-3 font-mono text-xs mb-2.5 pb-2.5 border-b border-cream/10">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-accent-text mb-0.5">{t.benchmark.ramCol}</dt>
                    <dd className={`tabular-nums ${row.ramClass}`}>{row.ram}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-cream/70 mb-0.5">{t.benchmark.cpuCol}</dt>
                    <dd className={`tabular-nums ${row.cpuClass}`}>{row.cpu}</dd>
                  </div>
                </dl>
                <p className="font-mono text-[11px] leading-relaxed text-cream/75">{row.notes}</p>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-cream/15 text-cream/75 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">{t.benchmark.stateCol}</th>
                  <th className="py-3 px-4 text-accent-text whitespace-nowrap">{t.benchmark.ramCol}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{t.benchmark.cpuCol}</th>
                  <th className="py-3 px-4">{t.benchmark.notesCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5 text-cream/85">
                {rows.map((row, idx) => (
                  <tr key={idx} className={`${row.rowClass} transition-colors`}>
                    <td className={`py-3.5 px-4 ${row.stateClass}`}>{row.state}</td>
                    <td className={`py-3.5 px-4 tabular-nums whitespace-nowrap ${row.ramClass}`}>{row.ram}</td>
                    <td className={`py-3.5 px-4 tabular-nums whitespace-nowrap ${row.cpuClass}`}>{row.cpu}</td>
                    <td className="py-3.5 px-4 text-cream/75 text-xs">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer / Context Box directly echoing author's note */}
        <div data-reveal className="bg-cream/5 border border-cream/10 rounded-2xl p-5 flex items-start gap-3.5 text-xs font-mono text-cream/75 leading-relaxed">
          <AlertCircle className="w-5 h-5 text-cream shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold text-cream block mb-1">{t.benchmark.contextTitle}</span>
            <span>{t.benchmark.disclaimer}</span>
          </div>
        </div>

      </div>

    </section>
  );
};
