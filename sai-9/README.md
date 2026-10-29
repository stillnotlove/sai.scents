# SAI — Incense & Objects (v9)

Editorial product-showcase concept. Separate repository and Vercel project from 1337tools. This is a **visual demo**, not a checkout service.

## Build

- `npm run check` — syntax/static asset checks + create `dist/`.
- `npm run build` — create `dist/`.
- `npm run dev` — local server (Python 3).

## GitHub / Vercel

Upload **the contents of this ZIP** to the separate SAI repository, not to 1337tools. New Vercel project → Import SAI repository → Preset: **Other** → Build command: `npm run build` → Output: `dist`.

Keep your prior approved version of SAI as a rollback point. Do not import the ZIP itself into the repository as a single file.

## Approved design retained

- Home screen is the original SAI graphic, click anywhere to enter.
- Collection has exactly five text-only cards: featured Holder; Rice Smoke / Matches; Zine / Vinyl.
- Card indices, black/white/`#dddde0` palette, subtle light hover, transitions, demo bag preserved.
- Only Holder ($55) and Rice Smoke ($15) have confirmed prices; other prices marked TBD.

## v9 changes

- Corrected overlapping card grid with explicit compact row heights; responsive desktop + mobile.
- Only the **first** approved Holder image in its modal; no photo gallery or next/previous controls. Original PNG is kept at 2800 × 1848.
- Philosophy: one unaltered user-provided portrait of Isao Mori at 1122 × 1402, without center crop, and two editorial text sections on its right. No second photo below.
- Better spacing between "A quiet figure / Isao Mori" and "The face of SAI.".
- Removed duplicated collection footer text; replaced with right-aligned `CONNECT`, Instagram `@sai.incense` and email `sai.scents@info.com`.
- Removed unused photo files from archive to keep the download smaller. Images remain available in the earlier `sai-8` baseline if later needed.

## Limits

Browser checks were run in an in-memory sandbox test rather than on a real published Vercel URL. No production deploy or checkout was performed. Browser rendering uses the original PNG pixel dimensions; display on higher-density screens still depends on the browser and screen resolution.
