import '../docs/main.ts';
import './products.css';

const gallery = document.querySelector<HTMLElement>('[data-product-gallery]');
if (gallery) {
  const buttons = [...gallery.querySelectorAll<HTMLButtonElement>('.product-gallery-btn')];
  const img = gallery.querySelector<HTMLImageElement>('[data-gallery-img]');
  const source = gallery.querySelector<HTMLSourceElement>('[data-gallery-source]');
  const captionEl = gallery.querySelector<HTMLElement>('[data-gallery-caption]');
  const suffix = document.documentElement.lang === 'id'
    ? ' Artwork bukan bagian unduhan aplikasi.'
    : ' Artwork is not included in the app download.';

  const activate = (btn: HTMLButtonElement) => {
    const src = btn.dataset.gallerySrc;
    const srcset = btn.dataset.gallerySrcset;
    const alt = btn.dataset.galleryAlt;
    const caption = btn.dataset.galleryCaption;
    if (img && src) img.src = src;
    if (img && alt !== undefined) img.alt = alt;
    if (source && srcset) source.srcset = srcset;
    if (captionEl && caption) captionEl.textContent = caption + suffix;
    for (const candidate of buttons) {
      candidate.setAttribute('aria-pressed', candidate === btn ? 'true' : 'false');
    }
  };

  for (const [index, btn] of buttons.entries()) {
    btn.addEventListener('click', () => activate(btn));
    btn.addEventListener('keydown', event => {
      let nextIndex = -1;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = buttons.length - 1;
      if (nextIndex < 0) return;
      event.preventDefault();
      const target = buttons[nextIndex];
      activate(target);
      target.focus();
    });
  }
}
