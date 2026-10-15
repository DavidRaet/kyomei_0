# 01: Apply the editorial theme to discovery and shared controls

**What to build:** Visitors can browse, search, and filter anime in the Tokyo Editorial paper-and-ink presentation, with clear primary actions and readable shared navigation and controls. Establish the shared palette through this working discovery experience so the remaining routes can adopt it.

**Type:** Implementation

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

Source: approved Tokyo Editorial spec, root design direction, and agreed palette note.

- [ ] Use paper `#F5F0E6`, ink `#242424`, vermilion `#E85D3F`, sage `#87B7A5`, and gold `#F2C66D` as palette anchors. Interpret 55/30/10/5 as hierarchy excluding artwork, not area quotas. Select and verify derived shades for muted text, borders, links, and controls.
- [ ] Discovery and shared header, footer, navigation, cards, filters, and controls use flat surfaces, fine rules, and restrained shadows. Remove their residual purple interface colors, colored gradients, and glows; set the browser color scheme and native controls to light.
- [ ] Main actions stand out in accessible vermilion treatments; secondary actions remain quieter in paper, ink, and borders. Reserve sage for saved confirmation and gold for ratings with ink labels. Errors and destructive actions have a distinct treatment with explicit messages; status never relies on color alone.
- [ ] Search, filters, discovery sections, navigation, and existing card actions retain their behavior. Check default, hover, focus, active, disabled, and loading states where applicable, plus loading, empty, error, and image-failure views.
- [ ] Posters and banners retain original colors; image text remains readable with necessary dark overlays. Orbital posters remain visible and spinning wherever currently displayed with motion enabled; preserve existing responsive and reduced-motion behavior.
- [ ] On rendered desktop and mobile pages, measure actual composited backgrounds: ordinary text at least 4.5:1, large text at least 3:1, essential control boundaries and keyboard focus indicators at least 3:1 against adjacent colors. Include muted labels, derived vermilion treatments, overlays, and every applicable interaction state.
- [ ] Preserve component boundaries, layout, typography, spacing, motion, routes, API contracts, and persistence. Add no dependency or theme switcher. Check other routes for breakage caused by shared changes; their route-specific treatments belong to tickets 02–04.
- [ ] Record rendered-page and interaction evidence for desktop/mobile and Chrome, Firefox, and Safari where available, identifying unavailable browser coverage. Run required type, lint, test, and production-build checks. Existing tests provide regression coverage; do not add tests that merely assert palette-token strings.
