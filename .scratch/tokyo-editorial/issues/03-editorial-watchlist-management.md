# 03: Theme watchlist management

**What to build:** Watchlist users can browse and manage their saved titles in the same editorial theme as discovery, with clear controls and understandable saved, empty, loading, and failure states.

**Type:** Implementation

**Blocked by:** 01: Apply the editorial theme to discovery and shared controls.

**Status:** ready-for-agent

Source: approved Tokyo Editorial spec, root design direction, and agreed palette note. This ticket can proceed independently of the detail-page ticket using the existing watchlist behavior.

- [ ] Watchlist surfaces, covers, cards, filters, progress controls, counts, and removal actions use the established paper-and-ink palette. Remove remaining route-specific purple treatments, colored gradients, and glows in favor of flat surfaces, fine rules, and restrained shadows.
- [ ] Main actions use accessible vermilion treatments and secondary controls use paper, ink, and borders. Reserve sage with ink labels and text/icons for saved confirmation and gold for ratings. Clearly distinguish destructive removal and errors through explicit text and distinct treatment.
- [ ] Verify existing watchlist filtering, progress updates, title navigation, and removal with saved titles; confirm state survives navigation and reload exactly as before.
- [ ] Verify loading, empty, error, and image-failure views where supported, plus default, hover, focus, active, disabled, and loading controls where applicable. Preserve artwork colors and readable overlays.
- [ ] Measure rendered desktop/mobile text against actual composited backgrounds: ordinary text at least 4.5:1, large text at least 3:1, and essential boundaries and keyboard focus indicators at least 3:1 against adjacent colors. Include muted text, badges, primary controls, and destructive feedback.
- [ ] Preserve component boundaries, layout, typography, spacing, existing responsive and reduced-motion behavior, routes, API contracts, and persistence. Add no dependency or new management behavior.
- [ ] Record desktop/mobile rendered-page and interaction evidence, checking Chrome, Firefox, and Safari where available and reporting unavailable coverage. Run required type, lint, test, and production-build checks; avoid palette-token assertion tests.
