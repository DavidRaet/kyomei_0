# Kyomei Responsiveness Fix Plan

This is an implementation task list, prioritized by impact. It follows from a full audit of every layout-defining component in the app (see git history / conversation for the raw findings) — this doc only contains what to fix and in what order.

**Stack reality check:** Kyomei has no Tailwind and no Next.js. Every responsive rule in the app is a hand-written `@media (max-width: Npx)` block inside the single global stylesheet, [`src/index.css`](../src/index.css). Any fix below means editing that file directly (or adding rules scoped to the same selectors it already uses) — there is no framework config to change.

**Current breakpoints** (all in `src/index.css`, for reference while working through the tasks): `1440px` (hides `.orbit`), `1400px`/`1180px`/`900px`/`640px` (`.grid-6` column steps), `1100px` (`.d-char-grid`), `900px` (`.d-body`/`.wl-body` reflow). **Nothing exists below 640px.**

---

## P0 — App shell breaks on any phone-width viewport

These block everything else: no component below can be "responsive" if the shell around it isn't.

### P0.1 — Add a phone breakpoint tier and fix `.app`/`.main`/`.rail`

- **Where:** `src/index.css:70-134` (`.app`, `.rail`, `.rail-r`, `.main`)
- **Problem:** `.app` is a fixed `grid-template-columns: 56px 1fr 56px`; `.main` has fixed `padding: 0 40px 96px`. Together they permanently consume ~192px of width, regardless of viewport — on a 375px phone that leaves ~183px for all content.
- **Fix:** add a `@media (max-width: 480px)` (or whatever the reconciled scale from P0.2 lands on) rule that either collapses `.app`'s grid to a single column (hide `.rail`/`.rail-r` — they're `aria-hidden`-eligible decoration, not navigation) or shrinks the rail columns to near-zero, and reduces `.main`'s horizontal padding to something like `16px–20px`.
- **Acceptance:** at 320–414px viewport width, content area is at least ~85% of viewport width, not ~50%.

### P0.2 — Reconcile the six existing breakpoints into one documented scale

- **Where:** all `@media` rules in `src/index.css` (lines 607, 682-685, 1333, 1377, 1567)
- **Problem:** six magic-number breakpoints (1440/1400/1180/1100/900/640) with no shared source of truth; 900px is reused for three unrelated components by what looks like coincidence, not intent.
- **Fix:** pick a small scale (e.g. `1400 / 1100 / 900 / 640 / 480`) and retrofit every existing `@media` rule to one of those five values. Document the scale as a comment block at the top of `src/index.css` (near the `:root` token block) so future rules reference it instead of inventing new numbers. Given this is a single hand-written stylesheet with no build-step preprocessing today, a documented comment convention is the lower-overhead fix; only reach for `postcss-custom-media` (letting `@media (--bp-md)` work natively) if the plain-comment convention proves hard to keep consistent in practice.
- **Acceptance:** every `@media` value in the file matches one of the five documented tiers; the doc comment lists all five with what they're for.

### P0.3 — Topbar/nav collapse at narrow widths

- **Where:** `src/index.css:128-209` (`.topbar`, `.brand`, `.nav`, `.top-meta`)
- **Problem:** `.topbar` is a non-wrapping `flex; justify-content: space-between` row with three children (brand, nav, meta text) and no fallback — will crowd or overflow on phone widths.
- **Fix:** at the phone tier, hide or collapse `.top-meta` (it's decorative status text, lowest-value on small screens) and/or stack `.nav` below `.brand`. A hamburger/overflow menu is one option but may be overkill for a 2-link nav (`Browse`/`Watchlist`) — simplest fix is likely just letting `.topbar` wrap and hiding `.top-meta` below the phone breakpoint.
- **Acceptance:** topbar doesn't overflow or visually break at 320–414px.

---

## P1 — Individual components that don't reflow on phones

### P1.1 — `AnimeDetailPage`'s `.d-head` never stacks

- **Where:** `src/index.css:1052-1069` (`.d-head`), plus the existing `@media (max-width: 900px)` block at `src/index.css:1377-1383`
- **Problem:** cover (fixed 220px, or 150px post-900px) and the title block stay side-by-side (`display: flex`) at every width. Below ~400px there isn't enough room left for the title.
- **Fix:** in the phone-tier media query, change `.d-head` to `flex-direction: column` (or grid, single column) and let `.d-cover-col` size itself relative to the viewport (e.g. `width: min(150px, 40vw)`) instead of a further fixed px step.
- **Acceptance:** at 320–414px, cover and title/synopsis stack vertically and neither is visually cramped.

### P1.2 — `.search-row` doesn't wrap

- **Where:** `src/index.css:271-333` (`.search-row`, `.search`, `.search-btn`)
- **Problem:** `display: flex` with no `flex-wrap`; `.search-btn` has fixed `padding: 0 32px`, so at narrow widths the input shrinks awkwardly rather than the button dropping to its own row.
- **Fix:** phone-tier rule: `.search-row { flex-wrap: wrap }` (or `flex-direction: column`) so `.search-btn` moves to its own full-width row below the input.
- **Acceptance:** search input and button are both comfortably tappable/readable at 320–414px, no horizontal squeeze.

### P1.3 — `.grid-6` never reaches a 1-column phone state

- **Where:** `src/index.css:676-685` (`.grid`, `.grid-6`)
- **Problem:** bottoms out at 2 columns (below 640px) with a fixed `28px 22px` gap that doesn't scale down; on the narrowest phones each card gets very little width.
- **Fix:** add the phone-tier step: `@media (max-width: 480px) { .grid-6 { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px 12px; } }` — keep 2 columns (cards read fine at 2-up even on phones) but shrink the gap. Only drop to 1 column if 2-up genuinely doesn't fit at the smallest supported width (~320px) once P0.1 is done — verify visually rather than assuming.
- **Acceptance:** cards remain legible and the grid gap doesn't waste disproportionate space at 320–414px.

---

## P2 — Already reasonably handled, lower priority

### P2.1 — `WatchlistPage`'s `.wl-row` table

- **Where:** `src/index.css:1503-1572`
- **Status:** already drops the progress column and shrinks score/type to 60px at 900px — the best-prepared component for narrow widths besides `.grid-6`. Revisit only if P0/P1 fixes reveal it still breaks at true phone widths (320–360px); not expected to need changes.

### P2.2 — `.orbit` hides via a single breakpoint, no responsive scaling

- **Where:** `src/index.css:463-609` (`.orbit`), hides below 1440px
- **Status:** purely decorative (`aria-hidden`), already fully hidden well before tablet/phone widths. No action needed — noted only so it isn't mistaken for an oversight during implementation.

---

## Verification

No visual-regression tooling exists in this project (`npm test` covers `yearMatch.ts` only). Verify each task manually:

1. `npm run dev`, open the app in a browser.
2. Use devtools responsive mode and check these widths for each affected page (`/`, `/anime/:id`, `/watchlist`): **1920, 1440, 1280, 1024, 900, 768, 640, 480, 414, 390, 360, 320**.
3. Confirm no horizontal scrollbar appears on `body` at any width (the existing `overflow-x: hidden` on `body` in `src/index.css:59` will currently mask overflow rather than fix it — treat any content that needs that hidden overflow as a bug, not a pass).
4. Re-run `npm run build` (which type-checks) and `npm run lint` after CSS/JSX changes.
