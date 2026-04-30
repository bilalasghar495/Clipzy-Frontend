# Universal Video Downloader

Angular 17+ standalone-component frontend for a SaaS video downloader (TikTok, YouTube, Instagram, Snapchat, Pinterest). Frontend only — backend integration is wired through `VideoDownloaderService` and currently returns mock data.

## Run

```bash
npm install
npm start
```

Open http://localhost:4200.

## Structure

- `src/app/app.component.*` — hero, layout, footer
- `src/app/components/video-input` — URL input + CTA
- `src/app/components/video-result` — result card with thumbnail, title, download button
- `src/app/components/platform-badge` — colored platform pill with SVG icon
- `src/app/components/loader` — spinner used while processing
- `src/app/services/video-downloader.service.ts` — URL state, platform detection, mock processing (1–2s delay)

## Backend hook

Replace `VideoDownloaderService.process()` with a real HTTP call. The shape `{ platform, title, thumbnail, success }` is consumed directly by `VideoResultComponent`.
