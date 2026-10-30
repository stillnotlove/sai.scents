# SAI v11 — QA

## Automated

- `npm run check` — JavaScript syntax, referenced assets, expected structure, build.
- `python scripts/browser_qa_v11.py` — Chromium visual and interaction checks at 1440×900 and 390×844 using an in-memory asset origin (browser sandbox blocks local/public URLs).

Test cases: intro → collection, five cards with no overlaps, hover specular gradient, single full-resolution 2800 px Holder modal image, add item to bag, Philosophy portrait WebP load and two sections, brand navigation to intro, interrupted fast transitions, no uncaught JS errors.

## Performance work

- Isao Mori 2,444 KB PNG → 212 KB WebP (same 1122×1402 pixel dimensions), plus 640 px mobile variant (70 KB).
- Holder 1,612 KB PNG → 162 KB WebP (same 2800×1848 pixel dimensions).
- Rice Smoke 1,965 KB PNG → 57 KB WebP.
- Matches 1,697 KB PNG → 59 KB WebP.
- Decode and prefetch warm-up begins after entry screen; no loading indicator is imposed during page switches.

## Limits

Pixel-level fidelity is subject to visually near-lossless image compression, browser scaling and device characteristics. Browser tests do not verify a real Vercel deployment, actual network latency, or iOS Safari. No changes made to 1337tools.
