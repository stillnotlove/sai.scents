# SAI v13 — Changes from v12

Only `public/app.js`, `public/styles.css`, `package.json`, the QA verification script and documentation changed. Existing approved product images, logo, homepage, Philosophy content, catalog arrangement, route transitions and pricing remain as in v12.

1. Collection: all five cards retain SAI metallic light-grey `#dddde0` at rest and on hover. Existing pointer-following reflection and card lift are preserved; shadow is subtly enhanced.
2. Product detail: replaced the large modal with a compact Floating Object (`760px` maximum on desktop). Single approved product photo, compact typography and price plus Add to bag on one row; gentle blur behind the card. Responsive mobile stacking.
3. Add to bag: preserves v12 behavior: the Floating Object remains open; brief `Added ✓` acknowledgment and quantity feedback, no sudden dismissal.
4. Bag: removed *all* product thumbnail elements. Compact editorial rows use the product name, index, quantity controls, and line price; order summary and live recalculation remain.
5. No new brand colors or assets.

Rollback: `sai-12.zip` is the previous source baseline.
