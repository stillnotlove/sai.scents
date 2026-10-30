# SAI v13 — QA

- `npm run check`: passed (JavaScript syntax, internal static assertions, build)
- `python3 scripts/browser_qa_v13.py`: passed in local Chromium desktop 1440x900 and mobile 390x844.
- Both sizes: 5 catalog cards, grey base, compact detail, single high-res Holder image, Add to bag twice without closing, bag count, bag without images, quantity decrease, recalculated summary, Philosophy page with one portrait and two blocks, scrolling, no JS errors.
- Desktop: verified pointer hover highlight and grey base retained.
- Screenshots from local testing are not part of the deploy ZIP; source PNG/WebP assets remain unchanged.
- Actual Vercel deployment/performance has not been tested. Checkout is a visual demo, not a payment flow.
