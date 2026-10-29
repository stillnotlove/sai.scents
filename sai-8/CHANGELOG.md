# v8 changelog — 2026-10-29

Baseline: `sai-7.zip` (not a rewrite).

1. Removed unused scents. The collection index now consists of five entries: Holder, Rice Smoke, Matches, Zine and Vinyl.
2. Replaced photographic product cards with five text-only panels, full-width Holder on top, 2×2 below, prices in lower-right. Added subtle bright/blurred hover, no new colors.
3. Kept the approved first image of Holder (`holder-main-hq.png`) unchanged; gallery image 2 → `04_overhead_view(1).png`; image 3 → `05_reverse_angle(1).png`.
4. Replaced Philosophy portrait with the user-provided `Снимок экрана — 2026-10-29 в 19.29.50.png` exactly; reduced Philosophy headline and body text sizes, and shortened image cards while retaining full scroll.
5. Left unknown prices (Matches, Zine, Vinyl) as TBD; no invented pricing or unavailable artwork.
6. Corrected a stale HTML image preload filename.
7. Preserved original header, landing, route transitions and bag logic. See QA_REPORT.md for testing outcomes.
