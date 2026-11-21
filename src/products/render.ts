import { products, type ProductSlug } from './content.ts';
import { escapeHtml, renderBlock, renderSiteHeader, renderSiteFooter } from '../docs/render.ts';
import { docSources } from '../docs/content.ts';
import { renderPageMetadata, siteOrigin, type PageLanguage } from '../seo.ts';

interface GalleryShot {
  id: string;
  label: string;
  base: string;
  caption: string;
  alt: string;
}

function getWallpaperLiveGallery(id: boolean): GalleryShot[] {
  if (id) {
    return [
      {
        id: 'library',
        label: 'Library & Acrylic',
        base: 'showcase-library',
        caption: 'Panel Smoked Ink Black Acrylic WallpaperLive dengan grid Library 3x3, pemilih FPS/Quality/GPU, dan Day Clock (cuplikan UI v0.2.4, identik dengan v0.2.5).',
        alt: 'Library Smoked Ink Black Acrylic WallpaperLive dengan grid thumbnail 3x3 dan Day Clock aktif',
      },
      {
        id: 'clock',
        label: 'Day Clock Studio',
        base: 'showcase-clock',
        caption: 'Tab Day Clock dengan tipografi Anurati, roda warna HSV dan input hex Confirm (#A31A37), serta lapisan di belakang ikon desktop (cuplikan v0.2.4).',
        alt: 'Tab Day Clock WallpaperLive menampilkan roda warna HSV, input hex, dan jam di desktop',
      },
      {
        id: 'settings',
        label: 'Settings & Cache',
        base: 'showcase-settings',
        caption: 'Pengaturan auto-pause, toggle Acrylic blur, pintasan Open TransparentBar, serta pengelola cache video 2 GiB (cuplikan v0.2.4).',
        alt: 'Tab Settings WallpaperLive dengan kontrol auto-pause, Acrylic blur, dan ukuran cache',
      },
      {
        id: 'cached',
        label: 'Cache 4K Siap (35.4 MB)',
        base: 'showcase-after-cache',
        caption: 'WallpaperLive v0.2.5 setelah cache GPU 4K selesai (~16 detik): Task Manager menunjukkan 35.4 MB RAM dan 1.8% CPU dengan panel terbuka.',
        alt: 'Task Manager WallpaperLive v0.2.5 menampilkan 35.4 MB RAM dan 1.8% CPU setelah cache 4K selesai',
      },
    ];
  }
  return [
    {
      id: 'library',
      label: 'Library & Acrylic',
      base: 'showcase-library',
      caption: 'Smoked Ink Black Acrylic panel with 3x3 Library grid, FPS/Quality/GPU selectors, and Day Clock (v0.2.4 UI capture, matches v0.2.5).',
      alt: 'WallpaperLive smoked Ink Black Acrylic Library with 3x3 thumbnail grid and active Day Clock',
    },
    {
      id: 'clock',
      label: 'Day Clock Studio',
      base: 'showcase-clock',
      caption: 'Day Clock tab with Anurati typography, HSV color wheel and confirmed hex input (#A31A37), and behind-icons desktop layering (v0.2.4 capture).',
      alt: 'WallpaperLive Day Clock tab with HSV wheel, hex picker, and desktop overlay',
    },
    {
      id: 'settings',
      label: 'Settings & Cache',
      base: 'showcase-settings',
      caption: 'Battery/fullscreen pause toggles, Acrylic blur switch, Open TransparentBar launcher, and 2 GiB video cache management (v0.2.4 capture).',
      alt: 'WallpaperLive Settings tab showing pause safeguards, Acrylic blur toggle, and cache size',
    },
    {
      id: 'cached',
      label: '4K Cached (35.4 MB)',
      base: 'showcase-after-cache',
      caption: 'WallpaperLive v0.2.5 ~16 seconds after 4K GPU caching completes: Task Manager shows 35.4 MB RAM and 1.8% CPU with the panel open.',
      alt: 'Task Manager showing WallpaperLive v0.2.5 at 35.4 MB RAM and 1.8% CPU after 4K cache finished',
    },
  ];
}

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
  const iconWebp = slug === 'wallpaperlive' ? '/icons/wallpaperlive-256-v1.webp' : '/icons/transparentbar-256-v1.webp';

  let previewBlock: string;
  if (slug === 'wallpaperlive') {
    const gallery = getWallpaperLiveGallery(id);
    const primary = gallery[0];
    const buttons = gallery.map((shot, idx) => {
      const thumb640 = '/images/opt/' + shot.base + '-640-v2.webp';
      const full1280 = '/images/opt/' + shot.base + '-1280-v2.webp';
      const fullSrcSet = thumb640 + ' 640w, ' + full1280 + ' 1280w';
      return '<button type="button" class="product-gallery-btn" aria-pressed="' + (idx === 0 ? 'true' : 'false') + '"' +
        ' data-gallery-src="' + escapeHtml(full1280) + '"' +
        ' data-gallery-srcset="' + escapeHtml(fullSrcSet) + '"' +
        ' data-gallery-alt="' + escapeHtml(shot.alt) + '"' +
        ' data-gallery-caption="' + escapeHtml(shot.caption) + '">' +
        '<img src="' + thumb640 + '" alt="" width="320" height="180" loading="lazy" decoding="async" />' +
        '<span>' + escapeHtml(shot.label) + '</span>' +
        '</button>';
    }).join('');

    previewBlock = '<figure data-reveal class="product-preview" data-product-gallery>' +
      '<picture>' +
      '<source type="image/webp" data-gallery-source srcSet="/images/opt/' + primary.base + '-640-v2.webp 640w, /images/opt/' + primary.base + '-1280-v2.webp 1280w" sizes="(max-width: 768px) 92vw, 1040px" />' +
      '<img class="motion-card" data-gallery-img src="/images/opt/' + primary.base + '-1280-v2.webp" alt="' + escapeHtml(primary.alt) + '" width="1280" height="720" decoding="async" />' +
      '</picture>' +
      '<figcaption data-gallery-caption>' + escapeHtml(primary.caption) + ' ' + (id ? 'Artwork bukan bagian unduhan aplikasi.' : 'Artwork is not included in the app download.') + '</figcaption>' +
      '<div class="product-gallery-thumbs" role="group" aria-label="' + (id ? 'Galeri cuplikan WallpaperLive' : 'WallpaperLive screenshot gallery') + '">' + buttons + '</div>' +
      '</figure>';
  } else {
    previewBlock = '<figure data-reveal class="product-preview"><picture><source type="image/webp" srcSet="/images/opt/desktop-preview-640-v1.webp 640w, /images/opt/desktop-preview-1200-v1.webp 1200w" sizes="(max-width: 768px) 92vw, 1040px" /><img class="motion-card" src="/images/opt/desktop-preview-1200-v1.webp" alt="' + escapeHtml(id ? 'Pratinjau desktop Windows 11 dengan detail taskbar transparan.' : 'Windows 11 desktop preview with transparent taskbar detail.') + '" width="1200" height="925" decoding="async" /></picture><figcaption>' + (id ? 'Pratinjau desktop Windows 11 dengan detail taskbar transparan. Artwork bukan bagian unduhan aplikasi.' : 'Windows 11 desktop preview with transparent taskbar detail. Artwork is not included in the app download.') + '</figcaption></figure>';
  }

  const signingPolicy = '<section data-reveal class="docs-section" id="code-signing-policy"><h2>' +
    (id ? 'Verifikasi rilis &amp; build unsigned' : 'Release verification &amp; unsigned builds') + '</h2>' +
    '<p>' + (id ? 'Rilis yang diterbitkan saat ini bersifat unsigned (belum memakai sertifikat Authenticode berbayar). Semua rilis dibangun otomatis dari kode sumber repositori publik melalui GitHub Actions.' : 'Published releases are currently unsigned (no Authenticode code-signing certificate is active). All official releases are built transparently from public source via GitHub Actions.') + '</p>' +
    '<ul><li><strong>SHA-256 checksums:</strong> ' + (id ? 'Cocokkan hash file lokal Anda dengan SHA256SUMS.txt pada halaman rilis sebelum menjalankan pemasang.' : 'Compare your local file digest against SHA256SUMS.txt on each GitHub Release before running Setup.') + '</li>' +
    '<li><strong>Maintainer:</strong> <a href="https://github.com/Raflyf">Rafly Firmansyah (@Raflyf)</a></li>' +
    '<li><strong>' + (id ? 'Perlindungan Windows:' : 'Windows protections:') + '</strong> ' + (id ? 'Jangan menonaktifkan antivirus atau Windows Defender SmartScreen, dan jangan menjalankan Setup sebagai Administrator.' : 'Keep antivirus and Windows Defender protections enabled, and do not run Setup as Administrator.') + '</li></ul>' +
    '<div class="docs-links"><a href="' + product.repository + '#code-signing-policy">' + product.name + ' Release verification</a></div></section>';

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
    '<div class="product-intro hero-line"><div><p class="product-name">' + product.name + '</p><h1>' + escapeHtml(copy.heading) + '</h1><p>' + escapeHtml(copy.intro) + '</p></div><img class="product-page-icon" src="' + iconWebp + '" alt="" width="128" height="128" decoding="async" /></div>' +
    '<p class="product-license">Windows 10/11 x64 · ' + (id ? 'Gratis' : 'Free') + ' · ' + product.license + '</p>' +
    '<div class="product-actions"><a class="product-download motion-button" href="' + product.repository + '/releases/latest">' + (id ? 'Unduh ' : 'Download ') + product.name + '</a><a href="' + guide + '#' + copy.guideSection + '">' + (id ? 'Panduan penggunaan' : 'Read the user guide') + '</a><a href="' + product.repository + '">GitHub</a></div>' +
    '<div data-reveal role="note" class="docs-note"><p>' + escapeHtml(copy.boundary) + '</p><p>' + (id ? 'Rilis resmi belum bertanda tangan digital (unsigned). Ikuti kebijakan keamanan perangkat dan periksa checksum SHA-256 sebelum pemasangan; jangan menonaktifkan antivirus atau proteksi Windows.' : 'Official builds are unsigned. Follow your device security policy and verify SHA-256 checksums before installing; do not disable antivirus or Windows protection.') + ' <a href="#code-signing-policy">' + (id ? 'Verifikasi rilis' : 'Release verification') + '</a>.</p></div>' +
    '<nav data-reveal class="product-contents" aria-label="' + (id ? 'Pada halaman ini' : 'On this page') + '">' + copy.sections.map(section => '<a href="#' + section.id + '">' + escapeHtml(section.title) + '</a>').join('') + '<a href="#code-signing-policy">' + (id ? 'Verifikasi rilis' : 'Release verification') + '</a><a href="#privacy-policy">Privacy policy</a></nav>' +
    previewBlock +
    '<div class="product-copy">' + sections + signingPolicy + privacyPolicy +
    '<section data-reveal class="docs-section" id="help"><h2>' + (id ? 'Panduan dan bantuan' : 'Guides and help') + '</h2><div class="docs-links"><a href="' + guide + '#' + copy.guideSection + '">' + (id ? 'Instalasi dan penggunaan ' : 'Install and use ') + product.name + '</a><a href="' + guide + '#troubleshooting">' + (id ? 'Pemecahan masalah' : 'Troubleshooting') + '</a><a href="' + product.repository + '/issues">' + (id ? 'Laporkan masalah' : 'Report an issue') + '</a><a href="' + source.url + '">' + (id ? 'Dokumentasi sumber' : 'Source documentation') + '</a></div></section></div></main>' + renderSiteFooter(lang);
  return {head,body};
}
