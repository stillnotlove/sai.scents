# SAI v14 — QA report

Base: SAI v13. All modifications scoped to the collection heading and nav separator.

## Static and build tests

- `npm run check`: PASS
- Syntax check: PASS
- Asset references: PASS
- Five products, Floating Object, bag and navigation preserved: PASS

## Browser tests

Chromium, direct local assets embedded (no public deploy), 1440 × 900 desktop and 390 × 844 mobile:

- Initial logo entry -> Collection: PASS
- Collection heading `STILL AIR.`: PASS
- Small label `SAI / SERIES 001—005`: PASS
- Updated descriptive text: PASS
- Header separator removed only in Collection: PASS
- Five catalogue cards, non-overlapping: PASS
- Metallic hover colour maintained: PASS
- Floating Object opens with single image: PASS
- Add to Bag without closing: PASS
- Bag displays item without thumbnail and updates quantities/totals: PASS
- Philosophy portrait and scrolling: PASS
- JavaScript console errors: 0

External Vercel deploy and real devices have not been tested.
