# SAI — INCENSE & OBJECTS. (v18)

A standalone lightweight website prototype. The catalogue is titled **STILL AIR.**

## Local preview

```bash
npm run dev
```

Open http://localhost:4173, click the intro, and navigate between Collection, Philosophy, Connections, and Bag.

## Verify / build

```bash
npm run check
python3 scripts/browser_qa_v18.py  # optional; requires Python Playwright + Chromium
```

The Node check validates syntax, core content and referenced assets and builds the static output to `dist/`.

## GitHub / Vercel

Upload the **contents** of this archive to the **SAI-specific** GitHub repository, not the 1337tools repository. In the **existing SAI Vercel project** use Framework Preset `Other`, Build Command `npm run build`, Output Directory `dist`, Root Directory `./`.

## Notes

Checkout is only a visual prototype; no payment is processed. v18 uses the user-supplied artwork in the three product detail panels (Holder, Zine and Vinyl), adds the approved S favicon treatment and corrects the Connections line wrap. The other site sections and effects are unchanged. See `CHANGELOG.md` and `QA_REPORT.md`.
