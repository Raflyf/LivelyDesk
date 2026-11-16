import React, { useState, useEffect } from 'react';
import { Language, translations } from './types/content';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DesktopSimulator } from './components/DesktopSimulator';
import { Features } from './components/Features';
import { Benchmark } from './components/Benchmark';
import { DownloadHub } from './components/DownloadHub';
import { SupportYapp } from './components/SupportYapp';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { emptyRelease, loadRelease, type ProductReleases, type ProductRepo } from './releases';
import { setupMotion } from './motion';
import { setupSmoothScroll, scrollToSection } from './utils/scroll';

export default function App({ initialLang = 'en' }: { initialLang?: Language }): React.JSX.Element {
  const lang = initialLang;
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [themeReady, setThemeReady] = useState(false);
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    setThemeReady(true);
    try { localStorage.setItem('lang', lang); } catch { /* The URL still selects the language. */ }
  }, [lang]);
  const [releases, setReleases] = useState<ProductReleases>({
    WallpaperLive: emptyRelease, TransparentBar: emptyRelease,
  });
  const t = translations[lang];

  useEffect(setupSmoothScroll, []);
  useEffect(setupMotion, []);

  useEffect(() => {
    const controller = new AbortController();
    for (const repo of ['WallpaperLive', 'TransparentBar'] as ProductRepo[]) {
      loadRelease(repo, controller.signal).then(
        release => { if (!controller.signal.aborted) setReleases(current => ({ ...current, [repo]: release })); },
        () => { if (!controller.signal.aborted) setReleases(current => ({ ...current, [repo]: { ...emptyRelease, status: 'unavailable' } })); },
      );
    }
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // The selected theme remains active when storage is unavailable.
    }
  }, [theme, themeReady]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Clean any #hash from address bar on mount while preserving scroll target
  useEffect(() => {
    if (window.location.hash) {
      let id = window.location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Keep raw id when malformed. */ }
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      let cancelled = false;
      let frame = 0;
      const runScroll = () => {
        if (cancelled) return;
        frame = window.requestAnimationFrame(() => {
          if (!cancelled) scrollToSection(id)();
        });
      };
      const fontsReady = document.fonts?.ready;
      if (fontsReady) {
        fontsReady.then(runScroll, runScroll);
      } else {
        runScroll();
      }
      return () => {
        cancelled = true;
        if (frame) window.cancelAnimationFrame(frame);
      };
    }
  }, []);

  return (
    <div id="top" className="min-h-screen bg-canvas text-fg flex flex-col font-sans selection:bg-burnt selection:text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-[60] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-inverse focus:text-on-inverse focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        {t.nav.skipToContent}
      </a>
      <Navbar
        t={t}
        lang={lang}
        isDark={theme === 'dark'}
        onToggleTheme={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
        onToggleLang={l => {
          try { localStorage.setItem('lang', l); } catch { /* Keep the choice in this tab. */ }
        }}
      />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero t={t} releases={releases} />
        <DesktopSimulator t={t} />
        <Features t={t} />
        <Benchmark t={t} />
        <DownloadHub t={t} releases={releases} lang={lang} />
        <SupportYapp t={t} />
        <FAQ t={t} />
      </main>
      <Footer t={t} lang={lang} />
    </div>
  );
}
