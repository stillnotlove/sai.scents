# SAI v10 — QA report

- `npm run check`: PASS (JavaScript syntax, asset references, static checks, build).
- `scripts/browser_qa_v10.py`: PASS with in-memory Chromium testing at 1440×900 and 390×844.
- Intro -> Collection -> Philosophy -> Intro by brand link: PASS.
- Collection: exactly five cards, same approved content: PASS.
- Glass hover: pseudo-layer opacity 0 -> 1 and backdrop blur 14px: PASS.
- CONNECT social link: bottom-border opacity 0.5 -> 0 on hover: PASS.
- Holder detail: exactly one approved photo: PASS.
- Add Holder to bag: 01 item: PASS.
- No uncaught JS errors in tested scenarios.

Limitations: test navigates an embedded local page (not public Vercel); touch-device UX, deployment, and all possible devices have not been independently tested.
