# Kyomei Design System

This document catalogs Kyomei's current visual language and UI component patterns as they exist in the codebase today. It is a reference for keeping new UI work consistent with what's already there — not an aspirational spec.

**There is no CSS framework in this project.** Kyomei does not use Tailwind (or any other utility-CSS framework) — there is no `tailwind.config.*`, no PostCSS config, and no Tailwind dependency in `package.json`. All styling is a single hand-written stylesheet, [`src/index.css`](../src/index.css) (~1570 lines), built on native CSS custom properties as design tokens, with BEM-ish component class names (`.card`, `.chip`, `.state`, `.wl-row`, etc.) consumed directly from JSX `className` props. There is one fixed dark theme — no light mode, no `prefers-color-scheme` handling, no theme toggle.

The visual identity is a **dark, violet-accented, Japanese-editorial aesthetic**: near-black backgrounds, glowing violet accents, serif display type paired with vertical Japanese typographic accents (`書道`-style kanji, `writing-mode: vertical-rl` side rails), and glassy blurred badges over poster art.

---

## 1. Color tokens

All colors are defined as CSS custom properties on `:root` in `src/index.css:5-36`.

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0a0613` | App background (near-black violet), layered under three radial gradients on `body` for ambient glow |
| `--bg-2` | `#0d0818` | Secondary background shade |
| `--surface` | `#15092a` | Card / panel background (e.g. `.poster`, `.sk-poster`) |
| `--surface-2` | `#1c0e35` | Lighter panel background (skeleton shimmer highlight, thumbnails) |
| `--line` | `rgba(168, 130, 247, 0.14)` | Default hairline border/divider (subtle) |
| `--line-2` | `rgba(168, 130, 247, 0.28)` | Stronger hairline border (inputs, active/hover states) |
| `--violet-100` | `#ede9fe` | Lightest violet — hover/active text on chips, filter panel text |
| `--violet-200` | `#e9d5ff` | Light violet — active nav links, hover title text |
| `--violet-300` | `#c4b5fd` | Mid-light violet — Japanese-script accents, icons |
| `--violet-400` | `#a855f7` | **Primary interactive accent** — focus rings, active borders, glowing dots/underlines |
| `--violet-500` | `#7c3aed` | Primary accent, used in button gradients and filled states |
| `--violet-600` | `#6d28d9` | Darker gradient stop (paired with `--violet-500` in buttons/badges) |
| `--violet-700` | `#5b21b6` | Darkest violet — defined but rarely referenced directly |
| `--gold` | `#f4c95d` | **Score/rating accent** — the only "positive/highlight" semantic color (`.score` badge, `.wl-c-score`) |
| `--rose` | `#f0abfc` | **Destructive/remove accent** — `.wl-remove` icon color, `.d-cover-hint` ("click to remove") text |
| `--ink` | `#f5f0ff` | Primary text color |
| `--ink-2` | `#d8cef0` | Secondary text color (taglines, synopsis, sub-labels) |
| `--muted` | `#9484b8` | Tertiary text — labels, meta text, placeholders |
| `--muted-2` | `#6b5e8a` | Quietest tone — small separator dots/dividers |

**Gap:** there is no dedicated error/danger red token. `ErrorState` communicates failure through copy and layout (the `.state` block + a Japanese glyph), not color — `--rose` is scoped specifically to destructive *actions* (removing a watchlist entry), not to error messaging. Two colors are also hardcoded outside the token system: `#fff` appears literally in `.d-cover-overlay.added .d-add-plus` and `.nav-count` rather than referencing `--ink` or a white token.

Selection color is also tokenized: `::selection { background: var(--violet-500); color: white; }` (`src/index.css:983`).

---

## 2. Typography

Three Google Fonts are loaded via `<link>` in [`index.html`](../index.html) (no self-hosted `@font-face`, no variable-font subsetting):

```html
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&family=Zen+Antique&display=swap" rel="stylesheet" />
```

| CSS variable | Font | Role |
|---|---|---|
| `--display` | `'Shippori Mincho', 'Noto Serif JP', ui-serif, Georgia, serif` | Serif display font for all headings: page titles (`.hero-title`, `.d-title`, `.wl-h1`), section titles (`.section-title h2`), brand mark, card editorial titles, empty/error state headings |
| `--body` | `'Zen Kaku Gothic New', ui-sans-serif, system-ui, -apple-system, sans-serif` | Sans-serif default for body copy, UI labels, inputs, poster-card titles |
| `--jp` | `'Zen Antique', 'Shippori Mincho', serif` | Decorative Japanese-script accents only — vertical side-rail text (`.rail-jp`), inline kanji/kana next to headings (`.hero-title .jp`, `.d-title-jp`), the large glyph in empty/error states (`.jp-big`) |

### Informal type scale

There's no formal `--font-size-*` token set — sizes are set per-component, but a consistent scale emerges in practice:

| Use | Size | Weight | Letter-spacing | Example |
|---|---|---|---|---|
| Hero/page title | `clamp(48px, 7vw, 96px)` – `clamp(38px, 5vw, 60px)` | 500–600 | `-0.02em` to `-0.025em` | `.hero-title`, `.wl-h1`, `.d-title` |
| Section heading | 34px | 500 | `-0.01em` | `.section-title h2` |
| Card/detail sub-heading | 22–26px | 500 | normal | `.state h3`, `.d-sec-hd h2` |
| Card editorial title | 16px | 500 | `-0.01em` | `.v-editorial .title` |
| Body / tagline / synopsis | 13–15px | 400 | normal, `line-height: 1.6–1.7` | `.hero-tagline`, `.d-synopsis` |
| Poster-card title | 13px | 500 | normal, 2-line clamp | `.v-poster .title` |
| Meta/sub text | 10–14px | 400 | `0.04–0.18em` | `.sub`, `.d-meta-value`, `.wl-title` |
| Uppercase micro-label | 9–12px | 400–700 | **0.2–0.35em**, `text-transform: uppercase` | `.nav a`, `.section-meta`, buttons, `.chip`, `.type-pill` |

The uppercase-with-wide-letter-spacing micro-label is the single most repeated typographic pattern in the app — it's used for nav links, section meta, button labels, badges, and form labels alike.

---

## 3. Spacing & radius

Two radius tokens exist (`src/index.css:34-35`):

| Token | Value | Used for |
|---|---|---|
| `--radius` | `4px` | Default control/panel radius — inputs, buttons, chips-panel, cards, `.state` block |
| `--radius-lg` | `10px` | Defined but not directly referenced in current component CSS (larger-radius surfaces use hardcoded values, e.g. `.d-cover` at `6px`) |

There is no formal `--space-*` scale — spacing is set ad hoc per component, but a consistent rhythm shows up:

| Context | Value |
|---|---|
| Card grid gutter | `gap: 28px 22px` (`.grid`) |
| Section vertical rhythm | `padding: 56px 0 0` between sections |
| Page horizontal margin | `.main { padding: 0 40px 96px }`, detail/watchlist pages `40px` side padding within a `max-width: 1280px` centered container |
| Control height (search) | `64px` |
| Control height (compact, watchlist search/select) | `40–42px` |
| Chip/pill height | `32px` |
| Circular icon button | `34px` (`.d-back`), `28px` (`.wl-remove`) |

**Note:** color, font, and radius are the only formally tokenized values (CSS custom properties). Spacing and the type scale are consistent by convention, not enforced by tokens — worth formalizing if the CSS grows further.

---

## 4. Layout & responsive breakpoints

The home route uses a fixed 3-column app shell (`src/index.css:70-75`):

```css
.app {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 56px 1fr 56px; /* left rail | main | right rail */
}
```

The 56px side rails (`.rail`) hold decorative vertical Japanese text (`writing-mode: vertical-rl`) and a pulsing status dot — pure ornamentation, not navigation. The detail and watchlist pages instead use a centered `max-width: 1280px` container with a sticky sidebar + main-content two-column grid (`.d-body`, `.wl-body`, both `grid-template-columns: 240px 1fr` / `230px 1fr`).

All responsive behavior is hand-written `@media (max-width: …)` rules — there is no `sm:`/`md:`/`lg:` utility system and no shared breakpoint variable set (each value is a literal pixel number repeated in each query):

| Breakpoint | Effect |
|---|---|
| `1440px` | Hides the decorative `PosterOrbit` (`.orbit { display: none }`) so it doesn't crowd the hero title/search |
| `1400px` | Card grid steps down `.grid-6` from 6 → 5 columns |
| `1180px` | Card grid steps down to 4 columns |
| `1100px` | Detail page's 2-column character grid (`.d-char-grid`) collapses to 1 column |
| `900px` | Card grid steps down to 3 columns; detail page (`.d-body`) and watchlist page (`.wl-body`) both collapse their sidebar+main grid to a single stacked column, sidebars go `position: static`; watchlist rows drop the progress column |
| `640px` | Card grid steps down to 2 columns |

**Gap:** no responsive treatment exists for the 56px side rails or the topbar's flex-row nav below any breakpoint — on narrow viewports the rails and nav links have no defined collapse/stacking behavior.

---

## 5. Component patterns

These are the de-facto reusable UI patterns in the app — not formal components with a shared abstraction, but consistent class-name/CSS conventions reused across multiple React components.

### Card

The primary content unit (`src/components/AnimeCard.tsx`), rendered in 3 visual variants sharing one base wrapper:

```html
<div className="card">
  <div className="card-inner"> <!-- v-poster | v-editorial | v-minimal --> </div>
</div>
```

Base card (`src/index.css:691-732`):
```css
.card { position: relative; perspective: 900px; cursor: pointer; }
.card-inner { transform-style: preserve-3d; transition: transform 0.35s cubic-bezier(.2,.7,.2,1); }
.poster { aspect-ratio: 2 / 3; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line); overflow: hidden; }
.card:hover .poster img { transform: scale(1.06); filter: saturate(1.15) brightness(1.05); }
.card:hover .poster::after { box-shadow: 0 0 0 1px rgba(168,85,247,0.55) inset, 0 0 60px rgba(124,58,237,0.35); }
```
A mouse-tracked 3D tilt effect is applied imperatively in JS (`AnimeCard.tsx`, mutating `.card-inner`'s `style.transform` on `mousemove`/`mouseleave`) rather than via CSS — this is the one interaction not expressible as a static class.

- **`.v-poster`** (default): minimal — 2-line-clamped 13px title below the poster, muted meta row.
- **`.v-editorial`**: magazine treatment — 16px serif title, a top-border-divided meta block, and an absolutely-positioned index number (`№ 01`-style, `.idx`).
- **`.v-minimal`**: title overlaid directly on the poster over a bottom gradient scrim, no separate metadata block.

### Glass overlay badge

A blurred, semi-opaque dark chip placed over poster art — used for score, media type, and watch-status indicators (`.score`, `.type-pill`, `.d-instate`):
```css
.score {
  background: rgba(10, 6, 19, 0.78);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(244, 201, 93, 0.35);
  border-radius: 3px;
  color: var(--gold);
}
```
This "glass badge" shape (translucent near-black background, `backdrop-filter: blur(8px)`, thin colored border, small uppercase or serif text) is the shared visual grammar for any overlay label on image content.

### Pill / chip

A rounded, small, bordered control used for filters, counts, and meta tags (`.chip`, `.pill`, `.wl-count`):
```css
.chip {
  height: 32px; padding: 0 14px;
  border: 1px solid var(--line-2);
  border-radius: 999px;
  font-size: 12px; color: var(--ink-2);
  background: rgba(28,14,53,0.4);
}
.chip.active, .chip[aria-expanded="true"] {
  border-color: var(--violet-400);
  background: rgba(124, 58, 237, 0.18);
  box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.35) inset;
}
```

### Button — two variants

There's no unified `.btn` component, but two consistent button treatments recur throughout:

**Primary (filled)** — `.search-btn`, the main call-to-action pattern:
```css
.search-btn {
  background: linear-gradient(180deg, var(--violet-500), var(--violet-600));
  font-weight: 700; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase;
  color: white;
  box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.4) inset, 0 8px 28px rgba(124, 58, 237, 0.35);
}
.search-btn:hover { transform: translateY(-1px); box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.6) inset, 0 12px 36px rgba(124, 58, 237, 0.5); }
```

**Secondary (outline)** — `.state .btn`, used in `EmptyState`, `ErrorState`, and empty-list placeholders:
```css
.state .btn {
  padding: 10px 22px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--violet-200); border: 1px solid var(--violet-500); border-radius: var(--radius);
}
.state .btn:hover { background: rgba(124, 58, 237, 0.2); color: var(--violet-100); }
```

Both variants share the same typographic voice (small, bold-ish, uppercase, wide letter-spacing) — the primary is filled with a violet gradient + glow shadow, the secondary is a transparent/outline style. Any new button should pick one of these two treatments rather than introducing a third.

### Skeleton / shimmer loading

```css
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.skeleton {
  background: linear-gradient(90deg, var(--surface) 0%, var(--surface-2) 50%, var(--surface) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite linear;
  border-radius: var(--radius);
}
```
`.sk-poster` (2:3 aspect ratio block) and `.sk-line` (text-line bars, `w-60`/`w-40` width modifiers) compose into card-shaped skeletons (`SkeletonGrid.tsx`). Some one-off skeleton dimensions in `AnimeDetailPage.tsx`'s `DetailSkeleton` are set via inline `style={{ width, height }}` rather than a class modifier — a minor inconsistency worth reconciling if more skeleton shapes are added.

### Empty / error placeholder block

One shared block (`.state`) used by `EmptyState`, `ErrorState`, the empty watchlist, and the empty cast list:
```html
<div className="state">
  <div className="jp-big">無</div> <!-- glyph varies by context: 無 / 圏外 / 空 / 該当なし -->
  <h3>No resonance found</h3>
  <p>…</p>
  <button className="btn">Clear search</button> <!-- or Retry, or a <Link> -->
</div>
```
```css
.state {
  padding: 80px 0; text-align: center;
  border: 1px dashed var(--line-2); border-radius: var(--radius);
  background: rgba(28,14,53,0.18);
  max-width: 640px; margin: 32px auto;
}
```
Each usage picks a different large Japanese glyph (`.jp-big`, 56px, `--jp` font) as the visual anchor — `無` ("nothing"), `圏外` ("out of range"), `空` ("empty"), `該当なし` ("no match") — reinforcing the empty/error identity while varying the specific meaning.

**Known stub:** on `AnimeDetailPage`, `ErrorState`'s `onRetry` is a no-op (`() => {}`) — unlike the home route's fully-wired `onRetryTrending`/`onRetrySeasonal`/`onRetrySearch` handlers.

### Topbar / navigation

Repeated (with minor variation) across the home, detail, and watchlist pages:
```html
<header className="topbar">
  <div className="brand">
    <div className="brand-mark">Kyomei</div>
    <div className="brand-jp">共鳴</div>
    <div className="brand-sub">An Anime Index</div>
  </div>
  <nav className="nav">
    <Link className="active" to="/">Browse</Link>
    <Link to="/watchlist">Watchlist</Link>
  </nav>
  <div className="top-meta"><span className="dot" />Live · AniList</div>
</header>
```
Active/hovered nav links turn `var(--violet-200)` and the active link gets a small glowing underline (`box-shadow: 0 0 8px var(--violet-400)` on a 1px `::after`).

### Circular icon button

A repeating 34px circular back-button (`.d-back`), duplicated verbatim (including its inline SVG chevron) in both `AnimeDetailPage.tsx` and `WatchlistPage.tsx`:
```css
.d-back { width: 34px; height: 34px; border: 1px solid var(--line-2); border-radius: 50%; }
.d-back:hover { background: rgba(124,58,237,0.2); border-color: var(--violet-400); transform: translateX(-2px); }
```

### Section header

Wraps every content block (`Section.tsx`):
```html
<section className="section">
  <div className="section-hd">
    <div className="section-title"><span className="num">①</span><h2>Trending <em>Now</em><span className="jp">話題作</span></h2></div>
    <div className="section-meta">…</div>
  </div>
  {children}
</section>
```

### Live-status dot

A small glowing circle (`.dot`, `.rail-dot`, `.top-meta .dot`, `.d-eyebrow .dot`) — `width/height: 4-6px`, `border-radius: 50%`, paired with a `box-shadow` glow in `--violet-400` — used anywhere the UI signals "live"/active status.

### Watchlist table row

`WatchlistPage.tsx` renders entries as data-table rows rather than cards:
```css
.wl-row {
  display: grid; grid-template-columns: minmax(0,1fr) 84px 130px 84px;
  min-height: 64px; border-bottom: 1px solid var(--line);
}
.wl-row:not(.wl-head):hover { background: rgba(124,58,237,0.1); }
```
Hovering a row reveals a circular remove button (`.wl-remove`, `opacity: 0 → 1` on row hover) colored `--rose` — the app's one clearly "destructive" colored control.

### Icons

No icon library (no lucide-react, no heroicons) — every icon is a hand-written inline SVG component in [`src/components/icons.tsx`](../src/components/icons.tsx): `IconSearch`, `IconStar`, `IconCheck`, `IconPlus`, `IconCaret`, `IconX`, and `IconPlay` (defined but not imported anywhere in the app — dead code). All follow the same convention: a functional component accepting an optional `size` prop, `viewBox="0 0 24 24"`, and `stroke="currentColor"` (except `IconStar`/`IconPlay`, which use `fill="currentColor"` for solid shapes).

---

## 6. Known inconsistencies / gaps

Documented here for awareness — not fixed as part of writing this doc:

- **Two divergent dropdown implementations**: `FilterDropdown.tsx`'s custom chip + floating panel (`.chip`, `.filter-panel`, `.filter-option`) versus `WatchlistPage.tsx`'s native `<select>` styled with `appearance: none` (`.wl-field select`). These solve the same UI problem two different ways and should probably converge on one pattern.
- **No unified error/danger color token** — see Section 1.
- **Dead CSS rules with no matching JSX usage**: `.nav-count` (`src/index.css:1210`) and `.wl-list-btn` (`src/index.css:1438`) are both fully styled but never referenced by any `className` in `src/components/*.tsx` or `src/App.tsx`.
- **`IconPlay`** is defined in `icons.tsx` but not imported anywhere.
- **Duplicated inline SVG**: the back-arrow chevron inside `.d-back` is written out twice (once in `AnimeDetailPage.tsx`, once in `WatchlistPage.tsx`) instead of being a shared icon in `icons.tsx`.
- **No responsive collapse** for the 56px side rails or topbar nav on narrow viewports (see Section 4).
- **Spacing and type scale are consistent by convention only** — unlike color/font/radius, they aren't backed by CSS custom properties, so drift is possible as new components are added.
