# SAI — Incense & Objects (v8)

Minimal editorial showroom concept, separate from 1337tools. No payment processing.

## Build and deploy

- `npm run check` — static QA and build
- `npm run build` — generate `dist/`
- Create a separate GitHub repo and import it as a **new Vercel project**.
- Framework: **Other**; Root: `./`; Build command: `npm run build`; Output directory: `dist`.

## Approved design

- Landing: untouched SAI logo graphic. Click anywhere to enter the Collection.
- Collection: exactly five text-only panels with a featured full-width Holder, two 2-column rows for Rice Smoke / Matches and Zine / Vinyl. Black background; grey and white panels.
- Hover: subtle light-diffusion without affecting readability.
- Unknown product prices show `TBD`; no fabricated prices.
- Holder modal: original **first photograph** (`holder-main-hq.png`), then user-supplied `holder-angle-02.png` and `holder-angle-03.png`.
- Philosophy: full scrollable page with smaller type and the exact new approved photo of Isao Mori (`isao-mori-portrait-approved.png`).
- All routes preserve the v7 fade/dissolve transition and shopping-bag demo logic.

## Editing safety

The approved v7 ZIP was used as the baseline for scoped modifications. Keep that ZIP available for rollback. Update **only** the SAI GitHub repository / Vercel project, not 1337tools.
