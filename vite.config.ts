import { defineConfig, type Connect } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App';
import { translations } from './src/types/content';
import { renderHomeMetadata } from './src/seo';
import { renderProductPage } from './src/products/render';
import { resolve } from 'node:path';
import { renderDocumentation } from './src/docs/render';
import { GET as handleReleasesGet } from './api/releases';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function mountReleaseProxy(middlewares: Connect.Server) {
  middlewares.use('/api/releases', async (req, res) => {
    const controller = new AbortController();
    req.on('close', () => controller.abort());
    try {
      const target = new URL(req.originalUrl ?? req.url ?? '/api/releases', 'http://localhost');
      const response = await handleReleasesGet(new Request(target, { method: req.method ?? 'GET', signal: controller.signal }));
      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(await response.text());
    } catch {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end('{"error":"Release proxy error"}');
    }
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'local-api-releases',
      configureServer(server) {
        mountReleaseProxy(server.middlewares);
      },
      configurePreviewServer(server) {
        mountReleaseProxy(server.middlewares);
      },
    },
    {
      name: 'static-site-content',
      transformIndexHtml: {
        order: 'pre',
        handler(html, context) {
          const lang = html.includes('<html lang="id"') ? 'id' : 'en';
          if (html.includes('<!--HOME_BODY-->')) {
            const body = renderToString(createElement(App, { initialLang: lang, t: translations[lang] }));
            return html.replace('<!--HOME_SEO-->', () => renderHomeMetadata(lang)).replace('<!--HOME_BODY-->', () => body);
          }
          if (html.includes('<!--PRODUCT_BODY-->')) {
            const slug = context.filename.includes('wallpaperlive') ? 'wallpaperlive' : 'transparentbar';
            const page = renderProductPage(slug, lang);
            return html.replace('<!--PRODUCT_HEAD-->', () => page.head).replace('<!--PRODUCT_BODY-->', () => page.body);
          }
          if (html.includes('<!--DOC_BODY-->')) {
            const page = renderDocumentation(lang);
            return html.replace('<!--DOC_HEAD-->', () => page.head).replace('<!--DOC_BODY-->', () => page.body);
          }
          return html;
        },
      },
    },
    {
      name: 'inline-built-css',
      transformIndexHtml: {
        order: 'post',
        handler(html, context) {
          const bundle = context.bundle;
          if (!bundle) return html;
          return html.replace(/<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/g, (tag, assetPath: string) => {
            const asset = bundle[assetPath];
            if (!asset || asset.type !== 'asset') return tag;
            const css = typeof asset.source === 'string' ? asset.source : new TextDecoder().decode(asset.source);
            return `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`;
          });
        },
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        homeId: resolve(import.meta.dirname, 'id/index.html'),
        wallpaperlive: resolve(import.meta.dirname, 'wallpaperlive/index.html'),
        wallpaperliveId: resolve(import.meta.dirname, 'wallpaperlive/id/index.html'),
        transparentbar: resolve(import.meta.dirname, 'transparentbar/index.html'),
        transparentbarId: resolve(import.meta.dirname, 'transparentbar/id/index.html'),
        docs: resolve(import.meta.dirname, 'doc/index.html'),
        docsId: resolve(import.meta.dirname, 'doc/id/index.html'),
      },
    },
  },
});
