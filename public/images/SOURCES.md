# Task Manager figure sources

The website uses [resource-use-orange.png](<resource-use-orange.png>), copied from the WallpaperLive author’s [figure](https://github.com/Raflyf/WallpaperLive/blob/cc468588a478b75997a7eb710fefff1bad2be4e1/assets/screenshots/resource-use-orange.png). Only the large metric annotations use Burnt Orange `#D9541E`. The full Task Manager photo band is pixel-identical to the retained v0.1.5 figure; measurements and capture-version attribution are unchanged. [Author source record](https://github.com/Raflyf/WallpaperLive/blob/cc468588a478b75997a7eb710fefff1bad2be4e1/assets/screenshots/SOURCES.md).

| Asset | SHA256 |
| --- | --- |
| Orange annotation figure | `03f5bc5e6280fc799e106af939a3d6edc9c6f9338e5758bba8b3f9e774e5f96d` |
| Retained original figure | `cd60990214fb034dbf28039684a9870b10fe9a9c15879739d0e156e017b795bc` |

These are v0.1.5 snapshots supplied on 8 November 2026: tray playback 20.3 MB / 0.5% CPU and auto-pause 4.5 MB / 0% CPU. Changing annotation color does not create a new benchmark or promote capture versions.

## TransparentBar

[transparentbar-resource-use-v0.2.4.png](<transparentbar-resource-use-v0.2.4.png>) is an unchanged copy of the [author-supplied capture](https://github.com/Raflyf/TransparentBar/blob/e6c17bf9f730921666fb74a82517669e2fdcd056/assets/resource-usage-v0.2.4.png), referenced by the [README at the same revision](https://github.com/Raflyf/TransparentBar/blob/e6c17bf9f730921666fb74a82517669e2fdcd056/README.md#resource-use). It is 728 by 41 pixels and shows host memory of 3.9 MB, 0% CPU, 0 MB/s disk, and 0 Mbps network. The Explorer bridge is not included.

SHA256: `1e36f81ff7794f1a7d87be97c49c2f37320309482b596b8386f6edb18f5d5fd4`.

## WallpaperLive v0.2.5 / v0.2.4 showcase assets (21 November 2026)

All newly added WallpaperLive showcase captures on the website are served exclusively in WebP (`opt/showcase-*-{640,1280}-v2.webp`) and lightweight WebM + faststart MP4 (`public/video/wallpaperlive-showcase-v0.2.5.{webm,mp4}`), converted directly from the author's 21 November 2026 captures without altering displayed desktop pixels or Task Manager readouts.

| Web asset | Source capture | Size / Resolution | SHA256 |
| --- | --- | --- | --- |
| `opt/showcase-library-1280-v2.webp` / `640` | `library showcase.png` (v0.2.4 UI, 14:15) | 62.7 KB / 24.9 KB (1280x720 / 640x360) | `f607a59264cef8bc23ee11966761b3a1fe36dfc7957c35e8c060dfefe3c9ffb6` / `d0c273d3f40b5c3e0306ace6801f60d024ea33c66d0b62d54c149d69fb13d692` |
| `opt/showcase-clock-1280-v2.webp` / `640` | `clock showcase.png` (v0.2.4 UI, 14:15) | 49.2 KB / 20.1 KB (1280x720 / 640x360) | `b8fd3a9b6e05decc708fb1b8e951f980348f49adb6cb1fe2b58b7b948c30448a` / `146dce3191d45a1efe5bacd4ad87c3a70c574ea2c8097b4052592510526d5347` |
| `opt/showcase-settings-1280-v2.webp` / `640` | `setting showcase.png` (v0.2.4 UI, 14:15) | 53.5 KB / 21.0 KB (1280x720 / 640x360) | `d2ab962bb244a93f7e89e1d0a0a0c3bfbc45f1f73b34e9d6622d759be5e6f1dc` / `d2b2095dc21b6dd9d710c852d4fd424e082963b7c865769cb5cba5077319eb67` |
| `opt/showcase-during-cache-1280-v2.webp` / `640` | `during cache.png` (v0.2.5, 449.8 MB / 12.8% CPU, 14:44:35) | 101.7 KB / 35.5 KB (1280x720 / 640x360) | `578990387d58bdd9acbe81af67ae62bc0380c5a244f2e9a754f7d93733c5b18f` / `884704b88804211c47d8b4a04efe168b5a8a6c44648796a7082118623e67c159` |
| `opt/showcase-after-cache-1280-v2.webp` / `640` | `after cache.png` (v0.2.5, 35.4 MB / 1.8% CPU, 14:44:51) | 100.6 KB / 35.4 KB (1280x720 / 640x360) | `aacdbe53a9f5397540771f7ead8ac33ff8a42b1e43cc790b030d95c73e221223` / `f5cd7ebd3053f3df0eaae1c3af550537477439cc327d4088b76f97103a723c93` |
| `opt/showcase-open-panel-1280-v2.webp` / `640` | `other wallpaper live usage in open panel.png` (v0.2.4, 46.0 MB / 1.8% CPU, 14:14) | 85.7 KB / 30.1 KB (1280x720 / 640x360) | `d80b4f5a9c9624715b1a3ba5313f1595cc472aa456cf901ed4c4664e501af02b` / `b3ad4b79734a7762c39d92bf3e5cf7d4fc9c864c1e5b32a4ee199922484e6d42` |
| `opt/showcase-closed-panel-1280-v2.webp` / `640` | `wallpaper live usage in closed panel.png` (v0.2.4, 24.3 MB / 1.5% CPU, 14:13) | 59.9 KB / 22.5 KB (1280x720 / 640x360) | `b475a606e2d633f51138b8dfb571fafbf83638eb1299c531bf79f67091397e3d` / `4bf49a00085ca3d4ef6063561e411ecceb37e6ea473372780025e67f922354d0` |
| `opt/showcase-paused-1280-v2.webp` / `640` | `paused.png` (v0.2.5, 2.1 MB / 0% CPU, 14:45) | 80.8 KB / 29.0 KB (1280x720 / 640x360) | `a81af1ee4ee0097a522ae8c69571f5f62114494f300c9c660c5133e21f854882` / `6509115b05f43042fc4da1089f2c1145aff96e779b79398bb653045da0a46d0d` |
| `opt/showcase-video-poster-1280-v2.webp` / `640` | Frame 1 of `wallpaperlive-showcase-v0.2.5.mp4` | 63.6 KB / 26.8 KB (1280x720 / 640x360) | `fb3dd9e3657271885a838d12e494ca1521f58031989ba1fed3a1bd917213a31a` / `15c113cc5d398769e4328fd4261da9bf68c72bd844d7e6dffc6781eb0925efde` |
| `../video/wallpaperlive-showcase-v0.2.5.webm` | Trimmed 34s VP9 + stereo Opus 64k WebM from `video wallpaperlive.mp4` (v0.2.5) | 3.56 MB (1280x720, 24fps) | `21b1f835b80564ba609d59fe4cd7f6ccffe2aa167be88c11aa7fdba0420ea0f1` |
| `../video/wallpaperlive-showcase-v0.2.5.mp4` | Trimmed 34s H.264 + stereo AAC 96k faststart MP4 from `video wallpaperlive.mp4` (v0.2.5) | 4.11 MB (1280x720, 24fps) | `30fb96e24c634e7469b4ae88e3af3043ca3c2a0839e2d8ef9dfa423603aa9196` |
