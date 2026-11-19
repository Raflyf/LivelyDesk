import { products, type ProductSlug } from './content.ts';
import { escapeHtml, renderBlock, renderSiteHeader, renderSiteFooter } from '../docs/render.ts';
import { docSources } from '../docs/content.ts';
import { renderPageMetadata, siteOrigin, type PageLanguage } from '../seo.ts';

export function renderProductPage(slug: ProductSlug, lang: PageLanguage) {
  const product = products[slug];
  const copy = product.copy[lang];
  const id = lang === 'id';
  const paths = { en: '/' + slug, id: '/' + slug + '/id' };
  const home = id ? '/id' : '/';
  const guide = id ? '/doc/id' : '/doc';
  const canonical = siteOrigin + paths[lang];
  const source = docSources.find(item => item.name === product.name)!;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': canonical + '#page', url: canonical, name: copy.title, description: copy.description, inLanguage: lang,
        isPartOf: { '@id': siteOrigin + '/#website' }, mainEntity: { '@id': canonical + '#app' } },
      { '@type': 'SoftwareApplication', '@id': canonical + '#app', name: product.name, url: canonical, description: copy.intro,
        operatingSystem: 'Windows 10, Windows 11 (x64)', applicationCategory: 'UtilitiesApplication', isAccessibleForFree: true,
        image: siteOrigin + product.icon, downloadUrl: product.repository + '/releases/latest', sameAs: product.repository,
        license: product.license === 'MIT' ? 'https://opensource.org/license/mit' : 'https://www.gnu.org/licenses/gpl-3.0.html',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', url: product.repository + '/releases/latest' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'LivelyDesk', item: siteOrigin + home },
        { '@type': 'ListItem', position: 2, name: product.name, item: canonical },
      ] },
    ],
  };
  const head = renderPageMetadata({title:copy.title,description:copy.description,lang,paths,schema,image:product.icon});
  const sections = copy.sections.map(section => '<section data-reveal class="docs-section" id="' + section.id + '"><h2>' + escapeHtml(section.title) + '</h2>' + section.blocks.map(block => renderBlock(block, section.title)).join('') + '</section>').join('');
  const media = slug === 'wallpaperlive'
    ? { width: 1917, height: 883, url: 'https://raw.githubusercontent.com/Raflyf/WallpaperLive/46dad013e6498a963350840e13f6c445e09be5ce/assets/screenshots/cache-ready-v0.1.6.png',
        webpSrcSet: '/images/opt/cache-ready-640-v1.webp 640w, /images/opt/cache-ready-1280-v1.webp 1280w',
        iconWebp: '/icons/wallpaperlive-256-v1.webp',
        label: id ? 'Library WallpaperLive dengan thumbnail dan kontrol pemutaran, cuplikan v0.1.6.' : 'WallpaperLive Library with thumbnails and playback controls, v0.1.6 capture.' }
    : { width: 1440, height: 1110, url: 'https://raw.githubusercontent.com/Raflyf/TransparentBar/2ccb731a63a1079ad650690a02ab0aee8724b9b9/assets/desktop-preview.png',
        webpSrcSet: '/images/opt/desktop-preview-640-v1.webp 640w, /images/opt/desktop-preview-1200-v1.webp 1200w',
        iconWebp: '/icons/transparentbar-256-v1.webp',
        label: id ? 'Pratinjau desktop Windows 11 dengan detail taskbar transparan.' : 'Windows 11 desktop preview with transparent taskbar detail.' };
  const signingPolicy = '<section data-reveal class="docs-section" id="code-signing-policy"><h2>Code signing policy</h2>' +
    '<p>Free code signing provided by <a href="https://signpath.io/">SignPath.io</a>, certificate by <a href="https://signpath.org/">SignPath Foundation</a>.</p>' +
    '<p>' + (id ? 'Rilis sebelum integrasi SignPath CI tetap unsigned sampai penandatanganan diaktifkan di GitHub Actions. Rilis signed dibangun otomatis dari sumber repositori publik.' : 'Releases published prior to SignPath CI integration remain unsigned until signing is enabled in GitHub Actions. Signed releases are built automatically from public repository source.') + '</p>' +
    '<ul><li><strong>Authors / Committers:</strong> <a href="https://github.com/Raflyf">Rafly Firmansyah (@Raflyf)</a></li>' +
    '<li><strong>Reviewers:</strong> <a href="https://github.com/Raflyf">Rafly Firmansyah (@Raflyf)</a> (' + (id ? 'semua pull request memerlukan tinjauan maintainer sebelum merge' : 'all pull requests require maintainer review before merge') + ')</li>' +
    '<li><strong>Approvers:</strong> <a href="https://github.com/Raflyf">Rafly Firmansyah (@Raflyf)</a> (' + (id ? 'meninjau tag rilis dan menyetujui permintaan penandatanganan' : 'reviews release tags and approves signing requests') + ')</li></ul>' +
    '<div class="docs-links"><a href="' + product.repository + '#code-signing-policy">' + product.name + ' Code signing policy</a></div></section>';
  const privacyText = slug === 'wallpaperlive'
    ? (id
        ? 'WallpaperLive tidak mengumpulkan atau mengirim data pribadi, telemetri, atau path media lokal ke server pengembang maupun pihak ketiga. Pengaturan, pustaka, thumbnail, dan cache tersimpan lokal di %LOCALAPPDATA%\\WallpaperLive. Saat cek pembaruan aktif atau dipicu manual, aplikasi hanya mengirim permintaan HTTPS GET baca-saja ke api.github.com/repos/Raflyf/WallpaperLive/releases/latest tanpa path media atau identitas pribadi; pembaruan terverifikasi dan dekoder libmpv diunduh dari GitHub hanya atas persetujuan pengguna disertai verifikasi SHA-256.'
        : 'WallpaperLive does not collect or transmit personal data, telemetry, or local media paths to developer servers or third parties. Settings, library entries, thumbnails, and cache stay locally under %LOCALAPPDATA%\\WallpaperLive. Update checks send only read-only HTTPS GET requests to api.github.com/repos/Raflyf/WallpaperLive/releases/latest without media paths or personal identifiers; verified updates and the libmpv decoder download from GitHub only with user consent and SHA-256 verification.')
    : (id
        ? 'TransparentBar tidak mengumpulkan atau mengirim data pribadi, telemetri, atau tangkapan layar ke server pengembang. Preferensi tersimpan lokal di HKCU\\Software\\TransparentBar dan log startup di %LOCALAPPDATA%\\TransparentBar\\startup.log. Sampel tepi layar konektor hanya diproses di memori. Cek pembaruan hanya mengirim permintaan HTTPS baca-saja ke github.com dan api.github.com untuk membandingkan tag rilis.'
        : 'TransparentBar does not collect or transmit personal data, telemetry, or screen captures to developer servers. Preferences stay locally under HKCU\\Software\\TransparentBar and startup diagnostics under %LOCALAPPDATA%\\TransparentBar\\startup.log. Connector edge samples remain in memory only. Update checks send only read-only HTTPS requests to github.com and api.github.com to compare release tags.');
  const privacyPolicy = '<section data-reveal class="docs-section" id="privacy-policy"><h2>Privacy policy</h2>' +
    '<p>' + escapeHtml(privacyText) + '</p>' +
    '<div class="docs-links"><a href="' + product.repository + '#privacy-policy">' + product.name + ' Privacy policy</a></div></section>';
  const body = '<a class="docs-skip" href="#docs-main">' + (id ? 'Langsung ke isi' : 'Skip to content') + '</a>' + renderSiteHeader(lang, paths) +
    '<main id="docs-main" tabindex="-1" class="product-page">' +
    '<nav class="docs-breadcrumbs" aria-label="Breadcrumb"><a href="' + home + '">LivelyDesk</a><span aria-hidden="true">/</span><span aria-current="page">' + product.name + '</span></nav>' +
    '<div class="product-intro hero-line"><div><p class="product-name">' + product.name + '</p><h1>' + escapeHtml(copy.heading) + '</h1><p>' + escapeHtml(copy.intro) + '</p></div><img class="product-page-icon" src="' + media.iconWebp + '" alt="" width="128" height="128" decoding="async" /></div>' +
    '<p class="product-license">Windows 10/11 x64 · ' + (id ? 'Gratis' : 'Free') + ' · ' + product.license + '</p>' +
    '<div class="product-actions"><a class="product-download motion-button" href="' + product.repository + '/releases/latest">' + (id ? 'Unduh ' : 'Download ') + product.name + '</a><a href="' + guide + '#' + copy.guideSection + '">' + (id ? 'Panduan penggunaan' : 'Read the user guide') + '</a><a href="' + product.repository + '">GitHub</a></div>' +
    '<div data-reveal role="note" class="docs-note"><p>' + escapeHtml(copy.boundary) + '</p><p>' + (id ? 'Rilis sebelum integrasi SignPath CI belum ditandatangani. Ikuti kebijakan keamanan perangkat; jangan menonaktifkan antivirus atau proteksi Windows.' : 'Releases published prior to SignPath CI integration are unsigned. Follow your device security policy; do not disable antivirus or Windows protection.') + ' <a href="#code-signing-policy">Code signing policy</a>.</p></div>' +
    '<nav data-reveal class="product-contents" aria-label="' + (id ? 'Pada halaman ini' : 'On this page') + '">' + copy.sections.map(section => '<a href="#' + section.id + '">' + escapeHtml(section.title) + '</a>').join('') + '<a href="#code-signing-policy">Code signing policy</a><a href="#privacy-policy">Privacy policy</a></nav>' +
    '<figure data-reveal class="product-preview"><picture><source type="image/webp" srcSet="' + media.webpSrcSet + '" sizes="(max-width: 768px) 92vw, 1040px" /><img class="motion-card" src="' + media.url + '" alt="' + escapeHtml(media.label) + '" width="' + media.width + '" height="' + media.height + '" decoding="async" /></picture><figcaption>' + escapeHtml(media.label) + ' ' + (id ? 'Artwork bukan bagian unduhan aplikasi.' : 'Artwork is not included in the app download.') + '</figcaption></figure>' +
    '<div class="product-copy">' + sections + signingPolicy + privacyPolicy +
    '<section data-reveal class="docs-section" id="help"><h2>' + (id ? 'Panduan dan bantuan' : 'Guides and help') + '</h2><div class="docs-links"><a href="' + guide + '#' + copy.guideSection + '">' + (id ? 'Instalasi dan penggunaan ' : 'Install and use ') + product.name + '</a><a href="' + guide + '#troubleshooting">' + (id ? 'Pemecahan masalah' : 'Troubleshooting') + '</a><a href="' + product.repository + '/issues">' + (id ? 'Laporkan masalah' : 'Report an issue') + '</a><a href="' + source.url + '">' + (id ? 'Dokumentasi sumber' : 'Source documentation') + '</a></div></section></div></main>' + renderSiteFooter(lang);
  return {head,body};
}
