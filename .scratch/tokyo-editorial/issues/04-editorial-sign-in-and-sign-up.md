# 04: Theme sign-in and sign-up

**What to build:** Visitors moving into sign-in or sign-up see the same paper-and-ink presentation, with readable embedded forms and clear authentication feedback, while existing authentication flows continue to work.

**Type:** Implementation

**Blocked by:** 01: Apply the editorial theme to discovery and shared controls.

**Status:** ready-for-agent

**Workflow:** resolved

Source: approved Tokyo Editorial spec, root design direction, and agreed palette note. This ticket can proceed independently of the detail and watchlist tickets.

- [x] Both authentication pages, their shared introduction and mobile header, and the separately configured embedded authentication appearance adopt the established light palette. Remove purple interface literals, colored gradients, and glows; native form controls match the light theme.
- [x] Primary submission actions use accessible vermilion treatments; secondary links and controls use quieter paper, ink, and borders. Validation and authentication errors remain distinct from primary actions and include explicit messages. Do not use sage or gold decoratively.
- [x] Verify existing entry links from the application, switching between sign-in and sign-up, returning to browse, and existing submission and redirect behavior using an available test session. Record any environment or credential limitation instead of claiming an unverified flow passed.
- [x] Inspect actual form default, hover, focus, active, disabled, loading, and validation/error states where applicable, including embedded controls rather than only the surrounding page.
- [x] Measure rendered desktop/mobile text against actual composited backgrounds: at least 4.5:1 for ordinary text, 3:1 for large text, and 3:1 for essential boundaries and keyboard focus indicators against adjacent colors. Include placeholders, muted labels, links, buttons, and errors.
- [x] Preserve layout, typography, spacing, component boundaries, responsive and reduced-motion behavior, authentication logic, routes, API contracts, and persistence. Add no dependency or new authentication feature.
- [x] Record rendered-page and interaction evidence on desktop/mobile and Chrome, Firefox, and Safari where available; report unavailable coverage. Run required type, lint, test, and production-build checks. Prefer rendered behavior checks over palette-token assertion tests.
- [x] If this is the final ticket to resolve, verify the combined discovery → details → watchlist journey and authentication entry across all five routes. Confirm consistent palette roles, no residual purple interface treatments, original artwork, and preserved spinning orbit and reduced-motion behavior; record remaining coverage limitations in the resolution and link it from the ticket map.

## Answer

Applied the editorial light palette to both authentication shells, mobile headers, Clerk appearance and actual embedded form states. Removed the final legacy route palette and generated Clerk button gradient/shadow. Chrome desktop/mobile form rendering, switching, required-field validation, application entry links and return-to-browse pass. Successful authentication and redirects require unavailable test credentials and are explicitly unverified. Firefox smoke checks pass; Safari is unavailable.

Combined discovery search, detail, watchlist and authentication entry checks, contrast results, screenshots, required passing checks and independent standards/spec reviews are recorded in [final verification](../verification.md). Original motion, orbit, artwork sources, API and persistence behavior are preserved. Existing watchlist progress/sort limitations remain outside this palette migration.
