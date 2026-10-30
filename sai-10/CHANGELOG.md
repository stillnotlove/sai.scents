# SAI v10 — targeted update from approved v9

1. Header brand link now points to the intro route, not the collection route (`public/index.html` only).
2. CONNECT link border subtly fades out on hover/focus (`public/styles.css`).
3. Collection cards now have a visible but restrained frosted-glass surface on hover/focus, with smooth gradients and inset highlights. Honors reduced-motion preference (`public/styles.css`).
4. No changes to `public/app.js`, visual assets or approved copy/layout. v9 remains rollback baseline.

## Previous v9 notes

# SAI v9 — targeted fixes based on sai-8

- Rebuilt Collection CSS grid with explicit row sizes and no overlapping panels. Reduced their height and typography. Preserved five-object hierarchy.
- Removed repeated footer labels, added CONNECT with the requested Instagram and email links at lower right.
- Holder detail now displays only the original first approved high-resolution image (2800 × 1848 PNG), without slide switching.
- Philosophy now contains one full-resolution supplied portrait (1122 × 1402 PNG) without destructive cropping, and two text blocks on its right. Removed the lower steel-holder photo.
- Rebalanced Philosophy typography and fixed the spacing between eyebrow and 'The face of SAI.'
- Preserved existing navigation, reduced-motion handling, smooth route transitions, prices, cart, palette and typography.
- Removed unused image gallery assets from the distributed package for a smaller download; sai-8 remains available as a rollback baseline.
