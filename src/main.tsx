import React, { startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import type { Language, Translation } from './types/content.ts';
import './index.css';

export function mountHomeApp(lang: Language, t: Translation) {
  const root = document.getElementById('root')!;
  let useSavedLanguage = false;
  try { useSavedLanguage = location.pathname === '/' && localStorage.getItem('lang') === 'id'; } catch { /* Use the URL when storage is unavailable. */ }
  if (useSavedLanguage) {
    location.replace('/id' + location.search + location.hash);
    return;
  }
  const app = <React.StrictMode><App initialLang={lang} t={t} /></React.StrictMode>;
  if (root.hasChildNodes()) {
    startTransition(() => {
      ReactDOM.hydrateRoot(root, app);
    });
  } else {
    ReactDOM.createRoot(root).render(app);
  }
}
