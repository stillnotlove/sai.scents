# SAI v11 — Scoped update from sai-10.zip

Changed:
- `public/index.html` — low-priority Philosophy image preload instead of Holder PNG preload.
- `public/app.js` — image source references, idle prewarming, interruptible page dissolve, modal focus and pointer highlight.
- `public/styles.css` — transition timing/mist, silver-glass interaction, navigation and modal micro-animations.
- `public/assets/` — generated WebP equivalents from four approved PNGs; originals exported separately. Other images unmodified.
- `vercel.json` — short-lived, revalidatable cache header so repeated edits don't leave stale imagery.
- `package.json`, docs and QA — v11 and updated tests.

Unchanged: approved hero design, five-product structure and prices, Holder one-image presentation, Philosophy wording/layout, branding and exact black/white/#dddde0 palette, bag behavior, external contact links.

Tests: see `QA_REPORT.md`.
