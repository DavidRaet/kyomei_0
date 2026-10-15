# 02: Theme anime details and watchlist actions

**What to build:** Visitors can open an anime from discovery, read its details, and save or remove it from their watchlist in a coherent editorial presentation, with unmistakable saved confirmation and readable artwork overlays.

**Type:** Implementation

**Blocked by:** 01: Apply the editorial theme to discovery and shared controls.

**Status:** ready-for-agent

Source: approved Tokyo Editorial spec, root design direction, and agreed palette note.

- [ ] Anime detail surfaces, metadata, synopsis, characters, and controls adopt the established paper-and-ink palette. Replace remaining route-specific purple colors, colored gradients, and glows with flat surfaces, fine rules, and restrained shadows.
- [ ] Use accessible vermilion treatments for the main action, quieter paper/ink/bordered secondary actions, gold only for ratings, and sage with ink labels plus text or icons for saved confirmation. Give errors and destructive actions a distinct treatment with explicit text.
- [ ] Verify navigation from discovery to details and back, saving and removing a title, and accurate saved-state feedback across navigation and reload using existing persistence behavior.
- [ ] Preserve original poster and banner colors and necessary dark image overlays. Verify readable content and actions with bright and dark artwork, loading images, and failed images.
- [ ] Inspect default, hover, focus, active, disabled, and loading treatments where applicable, including detail loading, missing/empty content, and error feedback.
- [ ] Measure rendered desktop/mobile text against actual composited backgrounds: at least 4.5:1 for ordinary text, 3:1 for large text, and 3:1 for essential boundaries and keyboard focus indicators against adjacent colors. Include overlays, muted metadata, primary controls, and saved feedback.
- [ ] Preserve layout, typography, spacing, component boundaries, existing motion and reduced-motion behavior, routes, API contracts, and persistence. Add no dependency, artwork recoloring, or new feature.
- [ ] Record rendered-page and interaction evidence on desktop/mobile and Chrome, Firefox, and Safari where available; report unavailable coverage. Run required type, lint, test, and production-build checks. Prefer visible behavior checks over palette-token assertion tests.
