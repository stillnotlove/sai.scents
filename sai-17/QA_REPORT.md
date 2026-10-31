# SAI v17 — QA report

Baseline: `sai-16.zip` (v16). Targeted change: new `Connections` page with the two photo references and SAI contact information. No modifications to product catalog, images, modal, bag, or transition mechanics.

## Static QA
- `npm run check`: PASS (JavaScript parse, v17 asset and route assertions, dist build).
- Full set of pre-existing product and copy invariants retained: PASS.
- New storefront/flag assets encoded to WebP with original dimensions retained: PASS.

## Chromium browser checks
Tested at 1440 × 900 desktop and 390 × 844 mobile through local inline static page + blob assets (external networking disabled):
- Intro → Collection, all 5 non-overlapping tiles, metal finish: PASS.
- Connections tab opens with dark header, 2 images decode correctly, contact/hours/location present, scroll works: PASS.
- Philosophy intact (portrait, two text panels and required line break): PASS.
- Floating Object open, delayed close animation, Add to Bag keeps modal open: PASS.
- Bag image-free, quantity and totals: PASS.
- No JavaScript errors in tested interactions.

Not tested: actual live Vercel deployment, Internet links (Instagram/email), physical mobile devices, Safari browser visual parity.
