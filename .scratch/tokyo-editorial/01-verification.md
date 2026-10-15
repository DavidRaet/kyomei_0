# Ticket 01 verification

Verified on 2026-10-15. Scope: discovery and shared interface treatments, with regression checks on the remaining routes.

## Delivered

Paper and ink surfaces, accessible derived vermilion for actions and emphasis, ink-on-gold ratings, neutral secondary controls, and distinct error feedback. Removed discovery's purple literals, decorative gradients, and glows. The existing neutral loading shimmer, artwork overlays, layout, typography, spacing, card transforms, orbit animations, breakpoints, and reduced-motion rules remain in place. Hover no longer alters poster saturation or contrast, preserving original artwork colors.

Temporary legacy palette overrides keep detail, watchlist, and authentication content readable on their existing dark surfaces until tickets 02–04. Shared headers and footers use the new light palette on these routes. These overrides are migration scaffolding to remove as each route adopts the palette; they are not a selectable dark theme. Authentication submission and watchlist persistence logic were not changed.

## Browser and interaction evidence

- Chrome 155: rendered desktop at 1440 × 1000 and mobile at 390 × 844. Live trending, seasonal, and Frieren search requests returned HTTP 200; the existing provider/client rendered results. Keyboard activation opened the Frieren detail route, whose detail and character requests returned HTTP 200. Back navigation and watchlist navigation worked. Sign-in and sign-up shells and embedded forms rendered. No uncaught page errors during these journeys.
- Genre selection exposed the selected label and check icon, and Escape closed the dropdown. Checked normal, hover, selected/expanded, keyboard-focus, and active styling. No discovery controls currently expose a disabled state; no new disabling behavior was introduced.
- API-boundary fixtures exercised loading skeletons, an explicit 503 error and successful retry, an empty search and reset, and a failed image with a readable title fallback. Fixtures used the existing API response shape; application API code and contracts were unchanged.
- Desktop orbit showed six posters, with different rendered positions sampled 300 ms apart. Mobile retained the existing hidden orbit, with no horizontal page overflow. Reduced-motion emulation hid the orbit and prevented card hover tilt.
- Firefox: discovery smoke check rendered the theme and live cards. Some artwork had not finished loading at capture; full Firefox interaction/mobile coverage is not claimed.
- Safari is unavailable on this Windows host. Installed WebKit automation stalled during startup and was stopped; no WebKit coverage is claimed.

The backend implementation was not audited; HTTP responses and rendered results verify the client integration used by this visual change.

## Contrast

Measured computed foregrounds against rendered ancestor fills, including composited colors. All measured ordinary text exceeded 4.5:1; headings also passed that stricter threshold. Decorative rules were not treated as essential control boundaries.

| Treatment | Contrast |
| --- | --- |
| Ink on paper | 13.67:1 |
| Muted labels on paper | 5.37:1 |
| Vermilion emphasis on paper | 5.64:1 |
| Primary button label, normal / hover | 6.16:1 / 7.89:1 |
| Selected filter label | 4.89:1 |
| Rating label on gold | 9.66:1 |
| Search placeholder | 5.70:1 |
| Default filter boundary against its fill | 3.98:1 |
| Primary keyboard focus outline against adjacent paper | 5.64:1 |
| Error heading on its panel | 7.05:1 |
| Failed-image fallback label | 4.89:1 |
| Minimal-card format label, rendered pixel sample | 8.05:1 |
| Minimal-card title over brightest artwork-overlay sample | 9.08:1 |

The minimal-card probe copied existing card markup into a rendered fixture with white artwork, representing the brightest possible background. Pixel sampling confirmed the actual stacking and composited overlay, rather than relying only on declared colors. See [measurements](01-verification.json) and [minimal-card measurements](01-minimal-contrast.json).

## Screenshots

- [Desktop discovery](01-preview.png)
- [Mobile discovery](01-mobile.png)
- [Selected filter](01-filter.png)
- [Error state](01-error.png)
- [Minimal-card contrast fixture](01-minimal-card.png)

## Required checks

- `npm run tsc`: passed, including after the review fix.
- `npm run lint`: passed.
- `npm test`: passed, 2 files / 7 tests.
- `npm run build`: passed, including after the review fix.
- `git diff --check`: passed.

No palette-token assertion tests or application dependencies were added. Existing API/year-matching tests remain regression coverage, not visual-theme coverage.

## Standards

Independent read-only review found no documented-standard violations or actionable code smells.

## Spec

Independent review found one issue: the minimal-card artwork overlay painted above the new format pill. Fixed by stacking that pill above the overlay, then verified using rendered pixels. Follow-up review confirmed the fix and found no remaining actionable spec issues.

Final review totals: Standards 0 findings; Spec 1 finding fixed, 0 unresolved.
