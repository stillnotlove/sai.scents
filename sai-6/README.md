# SAI — Incense & Objects / sai-6

SAI is a visual brand concept site, independent of 1337tools. Static HTML/CSS/JS and local image assets; no network dependencies and no bundled font files.

## Changes from sai-5 (approved Minimal Product Grid 01)

- Collection cards are now **nine equal-size typographic panels**, set on a pure black `#000000` field. Cards are `#dddde0` with black type, and turn `#ffffff` on hover/focus. Each shows index, name, category and price. **No product images are loaded in the catalogue.**
- Full-resolution existing product images remain inside each product detail modal, including the approved three-view holder gallery.
- Page transitions now cross-dissolve with a small amount of blur and translation. The next screen is mounted before the old one is removed; no opaque interstitial/blank loading screen. Duration ~0.5 seconds.
- Destination-matched backgrounds prevent light flashes when switching between black Collection / Philosophy views.
- Preserved: exact SAI intro art with click-to-enter, mobile logo image, full vertically scrolling Philosophy page, demo cart, favicon (white original S on #dddde0), prices and gallery.
- Simplified unused legacy transition overlay; all local images and the previous stable archive are preserved for rollback.

## Verify locally

```bash
npm run check    # JavaScript syntax + source asset checks + static build in dist/
npm run dev      # local HTTP preview, default port 4173
```

Browser smoke tests executed in headless Chromium using embedded local assets in an isolated test page because localhost navigation is blocked by the sandbox. Passed: intro click, 9 typographic products and no images in the grid, scrollable catalog, holder 3-view gallery, add to bag and $55 total, Philosophy scroll and mobile scroll. The transition duration is specified in code/CSS; subjective animation feel should be reviewed in the deployed browser. Actual Vercel deployment not tested.

## Deploy safely

Upload **archive contents** to the existing *SAI-only* GitHub repo. In Vercel import/update the separate SAI project. Do **not** change the 1337tools repository, project, domain, environment variables, or build settings.

- Framework preset: Other
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`

The shopping bag is a non-payment demo. Matches and journal prices are unspecified; journal deliberately has no image. Andale Mono is a system font fallback, not bundled.
