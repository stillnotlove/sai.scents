# SAI — INCENSE & OBJECTS · v12

A premium visual storefront concept for SAI. Checkout is a demo and does not process orders or payments. 

## Deploy separately from 1337tools

1. Extract `sai-13.zip` and upload the **contents** to the existing, separate SAI GitHub repository. Do not upload the ZIP itself.
2. Vercel: import/update the **SAI project only**. Framework `Other`, build command `npm run build`, output directory `dist`.
3. After deploying, confirm the new Vercel URL and test transitions, portrait, Add to bag and mobile interactions.

Local commands: `npm run check` (static checks/build), `npm run build`, `npm run dev` (Python 3). No npm installation necessary.

## Approved visual/content baseline

- SAI gray `#dddde0`, white `#ffffff`, black `#000000`. Andale Mono with system monospaced fallbacks. No embedded font files.
- Intro: approved source image; click to enter Collection. Brand link in header returns to intro.
- Collection: exactly 5 text-only rectangular cards. Full-width Holder / 001 ($55); Rice Smoke / 002 ($15); Matches / 003, Zine / 004, Vinyl / 005 (unconfirmed prices shown `TBD`).
- Holder product detail: one approved photograph, no image gallery. Philosophy: one approved Isao Mori portrait and two editorial text blocks.
- Social links remain underlined except on hover. Interactive silver-glass effect on Collection cards and 470 ms crossfade retained from v11.

Keep v11 archive as a rollback baseline until v12 is approved.

## Changes in v13

- All five collection tiles remain metallic grey at rest and when hovered, with cursor-following reflection and subtle elevation.
- Clicking a tile opens a compact **Floating Object** above the unchanged collection. The catalogue behind the window is softly blurred. Product details show exactly one approved photo (or an unfilled placeholder for future editions), a short description, price and action.
- **Add to bag never closes the Floating Object**. It confirms addition and updates bag count.
- The bag contains **text-only shopping rows** with product name, category/index, quantity controls and price. No thumbnails.

No changes to the homepage, Philosophy, approved images or product set. See `CHANGELOG.md` and `QA_REPORT.md`.
