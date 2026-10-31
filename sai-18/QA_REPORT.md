# SAI v18 — QA report

Baseline: existing `sai-17.zip` from this conversation, extracted unchanged as the starting point. No redesign or unrelated source rewriting.

## Build and static checks
- `node --check public/app.js`: PASS.
- `node scripts/verify.js`: PASS, including new assets / line-wrap assertions.
- `npm run build`: PASS, synchronized `dist/`.
- New images: Holder 1365 × 870 (WebP), Zine 1744 × 2048 (WebP), Vinyl 2048 × 1316 (WebP). Source reference artwork used, no re-generation.
- Icon: approved S glyph reused from v17, inside circular background.

## Chromium regression
Desktop (1440 × 900) and mobile (390 × 844), local assets via blob URLs:
- Intro navigation, exactly five cards, tile overlap: PASS.
- Holder/Zine/Vinyl modal media loaded and decoded: PASS.
- Floating modal animated close: PASS; Add to Bag keeps it open: PASS.
- Bag without thumbnails, totals and quantity: PASS.
- Connections: location, Instagram, hours, two images and explicit line break before `and attention.`: PASS.
- Philosophy: portrait, two copy blocks and existing `but to` line break: PASS.
- JS errors in tested paths: NONE.

Not tested: live GitHub/Vercel deployment, Safari layout, physical devices, external Instagram/email connectivity or payments. This is a visual prototype, not a checkout service.
