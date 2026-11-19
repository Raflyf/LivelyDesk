import React, { useEffect, useRef, useState } from 'react';
import { Translation, Language } from '../types/content';
import { Heart, Download, Moon, Sun, BookOpen, Menu, X } from 'lucide-react';
import { scrollToSection } from '../utils/scroll';

interface NavbarProps {
  t: Translation;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const MobileNavMenu: React.FC<{ t: Translation; lang: Language }> = ({ t, lang }) => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const navigate = (id: string) => (event: React.MouseEvent) => {
    setOpen(false);
    scrollToSection(id)(event);
  };

  return (
    <div className="xl:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
        onClick={() => setOpen(current => !current)}
        className="motion-button min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg border border-fg/20 text-fg hover:bg-fg/5 cursor-pointer"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>
      {open && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-16 z-40 border-b border-fg/15 bg-canvas px-4 py-3 shadow-lg"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm font-medium">
            <button type="button" onClick={navigate('simulator')} className="min-h-11 px-3 rounded-lg text-left text-fg hover:bg-fg/5 hover:text-accent-text cursor-pointer">
              {t.nav.simulator}
            </button>
            <button type="button" onClick={navigate('features')} className="min-h-11 px-3 rounded-lg text-left text-fg hover:bg-fg/5 hover:text-accent-text cursor-pointer">
              {t.nav.features}
            </button>
            <button type="button" onClick={navigate('benchmark')} className="min-h-11 px-3 rounded-lg text-left text-fg hover:bg-fg/5 hover:text-accent-text cursor-pointer">
              {t.nav.benchmark}
            </button>
            <button type="button" onClick={navigate('download')} className="min-h-11 px-3 rounded-lg text-left text-fg hover:bg-fg/5 hover:text-accent-text cursor-pointer">
              {t.nav.download}
            </button>
            <button type="button" onClick={navigate('support')} className="min-h-11 px-3 rounded-lg text-left text-accent-text hover:bg-burnt/10 inline-flex items-center gap-1.5 cursor-pointer">
              <Heart className="w-3.5 h-3.5 fill-burnt shrink-0" aria-hidden="true" />
              <span>{t.nav.supportBtn}</span>
            </button>
            <a href={lang === 'id' ? '/doc/id' : '/doc'} className="min-h-11 px-3 rounded-lg text-fg hover:bg-fg/5 hover:text-accent-text inline-flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.nav.docs}</span>
            </a>
          </div>
        </nav>
      )}
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ t, lang, onToggleLang, isDark, onToggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-fg/10 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          type="button"
          onClick={scrollToSection('top')}
          className="flex min-h-11 min-w-11 shrink-0 items-center gap-2.5 group cursor-pointer text-left"
        >
          <img src="/favicon.svg" alt="" width="36" height="36" className="h-9 w-9 shrink-0 group-hover:scale-105 transition-transform" />
          <span className="sr-only sm:not-sr-only sm:flex sm:flex-col">
            <span className="font-display font-bold text-base tracking-tight text-fg leading-none">
              LivelyDesk
            </span>
            <span className="hidden lg:block text-[10px] text-fg/70 font-mono tracking-wider uppercase mt-0.5">
              WallpaperLive <span className="text-accent-text font-normal">&amp;</span> TransparentBar
            </span>
          </span>
        </button>

        {/* Nav Links */}
        <nav aria-label="Section navigation" className="hidden xl:flex items-center gap-5 text-sm font-medium text-fg/80">
          <button
            type="button"
            onClick={scrollToSection('simulator')}
            className="min-h-11 inline-flex items-center hover:text-accent-text transition-colors cursor-pointer"
          >
            {t.nav.simulator}
          </button>
          <button
            type="button"
            onClick={scrollToSection('features')}
            className="min-h-11 inline-flex items-center hover:text-accent-text transition-colors cursor-pointer"
          >
            {t.nav.features}
          </button>
          <button
            type="button"
            onClick={scrollToSection('benchmark')}
            className="min-h-11 inline-flex items-center hover:text-accent-text transition-colors cursor-pointer"
          >
            {t.nav.benchmark}
          </button>
          <button
            type="button"
            onClick={scrollToSection('download')}
            className="min-h-11 inline-flex items-center hover:text-accent-text transition-colors cursor-pointer"
          >
            {t.nav.download}
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href={lang === 'id' ? '/doc/id' : '/doc'}
            title={t.nav.docs}
            className="motion-button hidden min-h-11 min-w-11 md:inline-flex items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-fg/80 hover:text-accent-text"
          >
            <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Docs</span>
          </a>

          {/* Language Switcher */}
          <div className="flex items-center bg-fg/5 rounded-lg p-0.5 border border-fg/15 text-xs font-mono">
            <a
              href="/id"
              hrefLang="id"
              lang="id"
              onClick={() => onToggleLang('id')}
              className={`inline-flex items-center justify-center min-h-11 min-w-11 px-2 py-1 rounded-md transition-[color,background-color,box-shadow] cursor-pointer ${
                lang === 'id'
                  ? 'bg-inverse text-on-inverse font-bold shadow-sm'
                  : 'text-fg/75 hover:text-fg'
              }`}
              aria-current={lang === 'id' ? 'page' : undefined}
              title="Bahasa Indonesia"
            >
              ID
            </a>
            <a
              href="/"
              hrefLang="en"
              lang="en"
              onClick={() => onToggleLang('en')}
              className={`inline-flex items-center justify-center min-h-11 min-w-11 px-2 py-1 rounded-md transition-[color,background-color,box-shadow] cursor-pointer ${
                lang === 'en'
                  ? 'bg-inverse text-on-inverse font-bold shadow-sm'
                  : 'text-fg/75 hover:text-fg'
              }`}
              aria-current={lang === 'en' ? 'page' : undefined}
              title="English"
            >
              EN
            </a>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={lang === 'id' ? 'Mode gelap' : 'Dark mode'}
            title={lang === 'id'
              ? (isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap')
              : (isDark ? 'Switch to light mode' : 'Switch to dark mode')}
            onClick={onToggleTheme}
            className="flex h-11 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg hover:bg-fg/5"
          >
            <span aria-hidden="true" className={
              `relative h-7 w-12 rounded-full border border-fg/50 ${isDark ? 'bg-burnt' : 'bg-fg/10'}`
            }>
              <span className={
                `theme-switch-thumb absolute top-[3px] left-[3px] flex h-5 w-5 items-center justify-center rounded-full bg-ink text-cream ${isDark ? 'translate-x-5' : ''}`
              }>
                {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={scrollToSection('support')}
            className="motion-button hidden min-h-11 md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-burnt/40 text-xs font-semibold text-accent-text hover:bg-burnt/10 transition-colors cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-burnt" aria-hidden="true" />
            <span>{t.nav.supportBtn}</span>
          </button>

          {/* Primary Download CTA Button (Clean Scroll) */}
          <button
            type="button"
            onClick={scrollToSection('download')}
            className="motion-button min-h-11 min-w-11 inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-inverse text-on-inverse text-xs font-semibold hover:bg-burnt hover:text-ink transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{t.nav.downloadBtn}</span>
          </button>

          <MobileNavMenu t={t} lang={lang} />
        </div>
      </div>
    </header>
  );
};
