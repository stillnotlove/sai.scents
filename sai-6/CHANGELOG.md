# SAI v6 — change log and test notes

Baseline: approved `sai-5.zip`; files changed are limited to `public/app.js`, `public/styles.css`, `public/index.html`, `scripts/verify.js`, `package.json`, `README.md`, and `CHANGELOG.md`. All original product artwork and high-resolution holder photos remain byte-identical to v5.

## Design adjustments

- `Collection`: removed product images **from card surfaces only**; created uniform rounded grey title plaques on black with index, product name, category, price and subtle hover-to-white.
- Restored one consistent three-column desktop grid, two tablet columns, and compact mobile layout.
- Product modals unchanged: original photographs remain available, and holder retains three approved HQ views.

## Motion and performance

- New overlapping route crossfade; old page and new page coexist for ~560 ms, starting motion immediately after navigation click.
- Subtle blur (2–3 px) and short displacement; no opaque blocker or faux loading pause.
- Background matches destination to avoid light flashing on dark views.
- Removed inactive legacy transition markup/styles.

## QA

- `npm run check`: PASS (JS syntax, static asset checks, build).
- Headless Chromium isolated embedded-assets smoke test: PASS (intro to catalog; 9 panels; no grid images; scroll; product modal; holder gallery; add $55 holder and cart; Philosophy scroll; mobile catalog scroll; no runtime JS exceptions).
- Vercel production / network performance: NOT TESTED. Check animation on the published site and on a real mobile device.

Rollback: keep `sai-5.zip` as the prior version.
