# SAI v12 — QA report

**Baseline:** `sai-11.zip`. Only Collection surface, corresponding header theme, and Add to bag behavior were intentionally modified. Additionally fixed mobile modal close button stacking.

**Automated static checks:** `npm run check` PASSED (syntax, referenced assets, five products, exact routes, image preloading, transition and hover code, build to dist).

**Browser regression checks:** Playwright + Chromium on 1440 × 900 and 390 × 844. Both PASSED: intro to Collection, pure-white Collection background, five cards without overlapping geometry, hover effect, holder photograph decoding at 2800 native px, modal remains open on first and second Add to bag, item count advances to 2, bag subtotal $110, manual close, navigation to Philosophy, two Philosophy text blocks, no JavaScript runtime errors. Mobile close button was corrected as part of the regression test.

**Not tested:** Public Vercel deployment, actual ecommerce checkout (not implemented), Safari and non-Chromium browser rendering. Colors and visual preference require user approval; Collection white background is a trial.
