# SAI — INCENSE & OBJECTS · v11

An editorial visual demo. Not a functioning checkout. Designed to live in a **separate GitHub repository and Vercel project** from 1337tools.

## How to use

1. Extract `sai-11.zip` and upload its contents to the dedicated SAI GitHub repository. Do not upload the ZIP itself and do not change the 1337tools repo.
2. In Vercel, import this SAI GitHub repository as a **new project**.
3. Framework: `Other`. Build command: `npm run build`. Output directory: `dist`.
4. After deployment, verify interactions on the live URL. The demo doesn't process payments.

Local commands: `npm run check`, `npm run build`, `npm run dev` (Python 3). No npm dependencies required for the static site.

## Approved SAI visual system

- Monochrome palette: `#dddde0`, `#ffffff`, `#000000`; Andale Mono with system monospaced fallbacks.
- Intro screen remains the unchanged, supplied SAI graphic; click to enter Collection.
- Collection: exactly five text-only cards. Holder (001) full width, Rice Smoke (002), Matches (003), Zine (004), Vinyl (005). Confirmed prices: $55 and $15. Unconfirmed prices are TBD.
- Holder modal shows **one** approved image, no gallery. Philosophy shows **one** original Isao Mori portrait and two text blocks.
- Social links, contact email, bag demo and click on header brand to return to intro remain.

## New in v11

- Duration-tuned 470 ms opacity crossfade and a gentle, very short optical mist; no blank interstitial or heavy full-viewport blur.
- Metallic/glass hover highlight on product cards follows cursor position; understated shadow and press feedback.
- Refined navigation underline and product modal opening; portrait gets a subtle hover scale on pointer devices. Respects reduced-motion preferences.
- Original images are visually preserved, encoded to quality-optimized WebP with original pixel dimensions. Isao portrait 2444 KB PNG -> 212 KB WebP, Holder 1612 KB -> 162 KB WebP. Mobile portrait additionally has a 640 px variant. Nonessential original PNGs have been removed from the website output.
- The portrait and other product images are pre-warmed in browser cache, after the intro screen appears. Philosophy portrait also has a preload hint.
- Changed asset cache headers to avoid week-long stale art from the previous `immutable` rule.

Original full-resolution PNGs are stored separately in `sai-11-originals.zip` (backup, not needed for Vercel). The previous `sai-10.zip` stays available as rollback baseline.
