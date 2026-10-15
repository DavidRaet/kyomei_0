# Tokyo Editorial palette migration

Status: draft. Verification approach awaits user confirmation. Issue publication awaits project issue-tracker setup.

## Problem Statement

Kyomei currently presents a dark purple interface with colored glows and gradients. The agreed direction is a paper-and-ink editorial presentation that frames anime artwork, makes actions easy to distinguish, and preserves familiar browsing flows.

## Solution

Apply the Tokyo Editorial palette consistently across discovery, anime details, watchlist, sign-in, and sign-up. Keep existing layout, typography, and behavior. Use flat surfaces, fine rules, and restrained shadows. Preserve original artwork colors and readable overlays where text sits over images.

## User Stories

1. As a visitor, I want paper backgrounds and ink text, so that browsing feels clear and consistent.
2. As a visitor, I want the same palette across discovery and anime details, so that moving between pages feels coherent.
3. As a watchlist user, I want my saved titles presented in the same theme, so that managing them feels connected to discovery.
4. As a visitor signing in or signing up, I want authentication to match the application, so that the transition feels familiar.
5. As a visitor, I want the main action to stand out in vermilion, so that I can identify the next step quickly.
6. As a visitor, I want secondary actions to remain readable and quieter, so that they do not compete with the main action.
7. As a watchlist user, I want saved confirmation to use sage with a label or icon, so that I can recognize the result of saving a title.
8. As a visitor, I want gold reserved for ratings, so that scores remain easy to identify.
9. As a visitor encountering an error, I want distinct feedback and an explicit message, so that I understand what happened and what I can do next.
10. As a reader, I want readable text and control labels on every surface, so that decorative colors do not obscure information.
11. As a keyboard user, I want visible focus indicators, so that I can navigate and operate controls confidently.
12. As a visitor, I want original poster and banner colors, so that I can assess the artwork as intended.
13. As a visitor viewing text over artwork, I want readable overlays, so that titles and actions remain understandable.
14. As a mobile visitor, I want the palette to remain coherent at narrow widths, so that browsing stays comfortable.
15. As a visitor waiting for content, I want loading, empty, and image-failure states to match the theme, so that the interface stays understandable.
16. As a returning visitor, I want existing navigation, filters, and watchlist behavior preserved, so that the visual change does not disrupt my habits.

## Implementation Decisions

- Core colors: paper `#F5F0E6`, ink `#242424`, vermilion `#E85D3F`, sage `#87B7A5`, and gold `#F2C66D`.
- Use 55/30/10/5 as visual hierarchy, excluding artwork, rather than literal area quotas.
- Use a single paper-based light theme across all five routes, including authentication and browser-native controls.
- Update shared color tokens, component-specific literal colors, and the separate authentication appearance. Remove residual purple interface treatments.
- Replace interface glows and colored gradients with flat surfaces, fine rules, and restrained shadows.
- Allow derived shades for muted text, borders, interactive states, and accessible vermilion links and buttons. Exact values remain to be selected and verified.
- Reserve sage for saved/watchlist confirmation and gold for ratings, using ink labels on these fills.
- Give errors and destructive actions a distinct treatment with explicit text. Do not communicate status solely through color.
- Preserve original artwork colors and dark overlays needed for text readability.
- Retain the existing spinning orbital anime posters and their animation, including current responsive and reduced-motion behavior. Recolor surrounding interface treatments as needed; do not remove the orbit or make it static as part of this migration.
- Preserve existing component boundaries, layout, typography, spacing, motion behavior, route structure, API contracts, and persistence behavior. No new dependency is needed for this change.

## Testing Decisions

Proposed verification seam, pending user confirmation: rendered application pages and user interactions across all five routes. Verify visible behavior rather than CSS variable names or internal implementation details.

- Check discovery search and filters, detail watchlist actions, saved-state feedback, watchlist controls, and authentication entry and form states.
- Inspect default, hover, focus, active, disabled, and loading treatments where applicable, plus empty, error, and image-failure states.
- Measure text contrast against actual backgrounds, including derived vermilion controls, muted labels, image overlays, essential control boundaries, and focus indicators.
- Verify desktop and mobile layouts and retain existing reduced-motion behavior. Follow the project's browser expectations for Chrome, Firefox, and Safari where available; report unavailable coverage.
- Confirm that the orbital anime posters remain visible and spinning wherever the current interface displays them with motion enabled, and that their existing responsive and reduced-motion behavior is preserved.
- Existing automated tests cover API behavior and year matching. They are regression coverage, not visual-palette tests. Prefer rendered-page checks for this change rather than tests that assert color-token strings.
- Run the repository's required type, lint, test, and production-build checks when implementation occurs. No application tests are needed for these planning-only document edits.

## Out of Scope

- A separate dark mode or theme switcher.
- Layout recomposition, new typography, spacing changes, or new animation work.
- Recoloring artwork.
- New product features, routes, API behavior, or persistence changes.
- A new styling framework or design-system dependency.

## Further Notes

The root design document is the authoritative design direction. The palette discussion note captures the agreed color decisions.

The requested to-spec workflow requires confirmation of the verification seam before publication, a configured project issue tracker, and the `ready-for-agent` triage label. No issue has been published and no application implementation has begun.
