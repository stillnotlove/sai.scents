# SAI v8 — QA report

Baseline: sai-7.zip. v7 source archive is untouched.

## Passed

- `npm run check` (JavaScript syntax, custom static assertions, build).
- Product index contains exactly 5 entries and no inline product thumbnails.
- Index order and labels: OBJECT STUDY / 001, SCENT / 002, IGNITION / 003, PHILOSOPHY / 004, VINYL / 005.
- Prices shown at lower right: $55, $15, TBD, TBD, TBD. No guessed prices.
- Holder gallery: 3 views in specified order; first view unchanged from v7, second and third from uploaded PNGs.
- Philosophy uses uploaded Isao Mori portrait and preserves its scrollable layout.
- Browser interaction smoke tests at 390px / 768px / 1600px: five cards, vertical scroll, no horizontal overflow, add Rice Smoke, bag count 01, subtotal $15, no JavaScript exceptions.
- Browser interaction tested Gallery 02 and Gallery 03 selection.

## Limits

- Browser test used an inlined copy of original CSS and JavaScript because this runtime blocks navigation to local HTTP/file URLs; image fetches were replaced by a transparent test asset in the browser. Original high-resolution image files were verified as present, but visual fidelity in a live Vercel deployment still needs acceptance testing.
- No real payment functionality is provided. Matches, Zine and Vinyl prices and additional artwork remain pending user input.
