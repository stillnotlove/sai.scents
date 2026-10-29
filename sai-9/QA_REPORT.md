# QA — SAI v9 / 2026-10-29

- `npm run check` — PASS (syntax, referenced assets, required v9 UI invariants and static build).
- In-memory Chromium browser (1440 × 900 and 390 × 844): PASS for navigation intro → collection → product → philosophy → bag.
- Five collection cards: PASS; no intersection between card bounding boxes on either tested viewport.
- Holder modal: PASS; one photo, native 2800 × 1848; no image carousel.
- Philosophy: PASS; full original 1122 × 1402 portrait, 2 text blocks, scroll available at both viewports.
- Bag: PASS; add Holder and verify $55 total.
- Page errors: none during tested scenarios.
- Not tested: real published Vercel hosting, remote Instagram page response, actual checkout/payment (not implemented).

The browser test uses inline assets because the testing environment disallows navigation to all URLs, including local `file://` and `http://127.0.0.1`. A production browser deployment must be smoke-tested after publication.
