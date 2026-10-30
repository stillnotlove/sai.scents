# SAI v16 — QA report

Baseline: `sai-15.zip` (v15). Scoped changes: Floating Object closing, Philosophy line break, removal of the word `study` from visible copy.

## Static / build

- `npm run check`: PASS (JS syntax, asset references, content assertions, build)
- `public/` and `dist/` synchronized by build: PASS
- Visible `study` text removed from page JS: PASS

## Browser QA

Chromium via Playwright, direct local assets (no public deployment). Viewports: 1440 × 900 and 390 × 844.

- Intro to Collection: PASS
- Collection still has exactly five nonoverlapping product tiles: PASS
- White nav header / approved grey product tiles: PASS
- Floating Object opens with existing photo: PASS
- Closing the object begins fading immediately; remains present ~190ms, finishes by ~450ms: PASS
- Add to Bag keeps the Floating Object open: PASS
- Bag without thumbnails, quantity/total: PASS
- Philosophy shows two content panels, responsive image, vertical scrolling: PASS
- `but to` begins in its own block line: PASS
- User-facing `study` references absent: PASS
- JavaScript page errors: 0 on both viewports

**Not tested:** actual Vercel deployment, physical-device performance, cross-browser visual parity.
