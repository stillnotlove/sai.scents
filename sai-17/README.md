# SAI — INCENSE & OBJECTS. (v16)

A standalone lightweight website prototype. The catalogue is titled **STILL AIR.**

## Local preview

```bash
npm run dev
```

Open http://localhost:4173, click the intro, and navigate between Collection, Philosophy, and Bag.

## Verify / build

```bash
npm run check
python3 scripts/browser_qa_v16.py  # optional; requires Python Playwright + Chromium
```

The Node check validates syntax, core content and referenced assets and builds the static output to `dist/`.

## GitHub / Vercel

Upload the **contents** of this archive to the **SAI-specific** GitHub repository, not the 1337tools repository. In the **existing SAI Vercel project** use Framework Preset `Other`, Build Command `npm run build`, Output Directory `dist`, Root Directory `./`.

## Notes

Checkout is only a visual prototype; no payment is processed. Images have not been altered in v16. Changes are limited to modal closing behavior and user-facing copy/line breaks. See `CHANGELOG.md` and `QA_REPORT.md`.
