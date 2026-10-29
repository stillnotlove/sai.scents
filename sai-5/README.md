# SAI — Incense & Objects / sai-5

Static brand concept site. Separate from 1337tools. No npm runtime dependencies or hosted fonts.

## What changed in sai-5

- First screen: only the supplied original SAI artwork, no header or text controls. Click or press Enter to enter the collection.
- Smooth, fast transition between self-contained screens, with no endless landing-page scroll.
- Collection: pure black background with white type, equal-sized product cards, responsive 3 → 2 → 1 columns, vertically scrollable.
- Philosophy: full long-form page with vertical scroll and paragraph beginning “It…” on its own line.
- **Holder quality:** uses unaltered approved original 2800×1848 image for the catalog (high-quality native-resolution WebP) and original PNG in item preview, with 2800×1602 top view and 3500×2000 close-up accessible via the 01/02/03 gallery controls. Resizing does not create new source detail; originals remain unchanged.
- Incense images: photographed concept assets in original generated resolution (1448×1086) instead of flat placeholders; cedar has a distinct composition rather than the same image as Rice Smoke.
- Exact white **S** extracted from the supplied original logo on `#dddde0` favicon.
- UI palette: `#dddde0`, `#ffffff`, `#000000` only; no dark gray theme.
- JS/CSS trimmed of legacy content and unused images removed.

## Build / QA

```bash
npm run check
```

Static build goes to `dist/`; `npm run check` validates JavaScript syntax, asset references and required UI elements. Browser smoke tests passed in the sandbox with local assets embedded in the test page: intro → collection, nine cards, scroll, three-view holder gallery, add holder ($55), cart, Philosophy and mobile scrolling. A real deployed Vercel URL has **not** yet been tested; verify the same flows after publishing.

## Vercel deploy (safe separation)

Create a **separate** GitHub repo `sai-incense-objects`, and in Vercel choose **Add New → Project → Import that new repo**.

- Framework: Other
- Root: `./`
- Build Command: `npm run build`
- Output Directory: `dist`

Do not connect or modify the 1337tools GitHub repo, Vercel project, domain, environment variables, or deployment settings.

## Notes

- The website is a visual concept, not a real storefront. Bag state persists locally, checkout is a demo.
- Andale Mono appears only if installed on the visitor's device; no licensed font files are bundled.
- Matches and journal pricing have not been invented; journal image placeholder intentionally remains empty.
