import type React from 'react';
import type Lenis from 'lenis';

let scroller: Lenis | undefined;
let wakeScroll = () => {};
let loadPromise: Promise<void> | undefined;

export function setupSmoothScroll() {
  let disposed = false;
  let frame = 0;
  let lenisInstance: Lenis | undefined;
  let rafId = 0;
  let idleId: number | undefined;
  let timerId: ReturnType<typeof setTimeout> | undefined;

  const tick = (time: number) => {
    frame = 0;
    if (disposed || document.hidden || !lenisInstance) return;
    lenisInstance.raf(time);
    if (lenisInstance.isScrolling === 'smooth') frame = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (!disposed && !document.hidden && !frame && lenisInstance) {
      // Reset the clock after idle so a new wheel gesture does not jump to its destination.
      lenisInstance.raf(performance.now());
      frame = requestAnimationFrame(tick);
    }
  };

  const visibility = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (lenisInstance) lenisInstance.scrollTo(lenisInstance.actualScroll, { immediate: true });
  };

  const interrupt = (event: KeyboardEvent) => {
    if (lenisInstance && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
      lenisInstance.scrollTo(lenisInstance.actualScroll, { immediate: true });
    }
  };

  const initLenis = () => {
    if (disposed || lenisInstance) return;
    loadPromise ??= import('lenis').then(({ default: LenisCtor }) => {
      if (disposed) return;
      const lenis = new LenisCtor({ smoothWheel: true, syncTouch: false, lerp: 0.12, autoRaf: false, respectReducedMotion: false });
      lenisInstance = lenis;
      scroller = lenis;
      lenis.on('virtual-scroll', wake);
      document.addEventListener('visibilitychange', visibility);
      window.addEventListener('keydown', interrupt);
      wakeScroll = wake;
    });
  };

  const onFirstInput = () => initLenis();
  window.addEventListener('wheel', onFirstInput, { passive: true, once: true });
  window.addEventListener('pointerdown', onFirstInput, { passive: true, once: true });

  // Defer Lenis construction past first paint to avoid synchronous mount reflow on mobile.
  rafId = requestAnimationFrame(() => {
    if (disposed) return;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => initLenis(), { timeout: 600 });
    } else {
      timerId = setTimeout(initLenis, 50);
    }
  });

  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    if (idleId !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
    if (timerId !== undefined) clearTimeout(timerId);
    window.removeEventListener('wheel', onFirstInput);
    window.removeEventListener('pointerdown', onFirstInput);
    cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange', visibility);
    window.removeEventListener('keydown', interrupt);
    lenisInstance?.destroy();
    if (scroller === lenisInstance) {
      scroller = undefined;
      wakeScroll = () => {};
    }
    loadPromise = undefined;
  };
}

export const scrollToSection = (id: string, keepHash = false) => (e?: React.MouseEvent) => {
  e?.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    if (scroller) {
      scroller.resize();
      wakeScroll();
      scroller.scrollTo(el, { offset: -72 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  if (!keepHash && window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
};
