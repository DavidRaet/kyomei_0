# Kyomei Design Direction

Status: Tokyo Editorial palette agreed; implementation not started
Reference: `C:\Users\david\Downloads\cognitive-architecture-topology-DESIGN.md`
Scope: visual language and interaction direction for the existing Kyomei anime discovery app

## Design read

Reading this as: a consumer anime discovery product for people choosing what to watch, with a paper-and-ink editorial language, native CSS tokens, Japanese typographic detail, and restrained spatial motion.

The reference document remains a design influence for useful metadata, deliberate section rhythm, topology as a visual metaphor, and motion that reveals relationships. The agreed Tokyo Editorial palette supersedes its dark-field and atmospheric color direction. Kyomei should not copy its unrelated content or become a generic technology landing page.

## Direction in one sentence

Kyomei is a quiet signal map for finding anime that resonates: a paper-and-ink editorial index where posters are nodes, recommendations are pathways, and a watchlist is a personal constellation.

## Product intent

The redesign should help users:

- discover a compelling title quickly
- understand why a title is worth opening
- move between discovery, detail, and watchlist without losing context
- build a personal watchlist that feels intentional rather than administrative

The redesign must preserve the existing information architecture and route intent:

- Browse home: search, filters, trending, seasonal, and result sections
- Anime detail: cover, synopsis, metadata, characters, and watchlist action
- Watchlist: saved titles, filtering, progress, and removal

URL structure, navigation labels, API boundaries, analytics hooks, legal copy, and persistence behavior are outside this visual rebrand unless separately approved.

## Brand translation of the reference

| Reference idea | Kyomei interpretation |
| --- | --- |
| Cognitive architecture | The user's taste, memory, and curiosity forming a personal map |
| Topology | Connections between titles, genres, seasons, formats, and watchlist choices |
| Sequence | Discovery flow: notice, inspect, save, return |
| Technical metadata | Useful anime facts, never fake precision or decorative jargon |
| Edge infrastructure | Reliable, fast browsing across imperfect image and API states |
| Visual depth | Flat paper surfaces, fine rules, and restrained shadows that support posters and transitions |

## Design dials

These values guide future implementation:

- `DESIGN_VARIANCE: 7` - asymmetric editorial compositions, but enough order for fast scanning
- `MOTION_INTENSITY: 5` - visible transitions and tactile feedback, without turning browsing into a spectacle
- `VISUAL_DENSITY: 5` - a rich catalog with clear breathing room and strong hierarchy

The dials are intentionally lower than an experimental showcase. Kyomei is a product people use repeatedly, so novelty belongs in composition and detail rather than in friction.

## Foundation and theme

Use one paper-based light theme across Browse, Detail, Watchlist, Sign-in, and Sign-up. Defer a separate dark mode. Preserve the existing layout and typography during this palette change; composition and motion ideas elsewhere in this document are not additional implementation scope.

The project currently uses React, TypeScript, Vite, and a single native CSS stylesheet. The design should continue using CSS custom properties and existing component boundaries. Do not add Tailwind, a design-system package, an animation package, or an icon library solely to execute this document. Any dependency change requires a separate implementation decision.

The visual family is an honest hybrid of:

- paper-and-ink editorial index
- restrained flat interface with fine rules
- Japanese typographic accents
- poster-led media discovery

This is not an official design system. It is a Kyomei-owned visual language implemented with native CSS.

## Color system

Tokyo Editorial replaces the violet dark theme with five core colors:

| Color | Value | Role |
| --- | --- | --- |
| Paper | `#F5F0E6` | Dominant page and interface background |
| Ink | `#242424` | Typography and structural elements |
| Vermilion | `#E85D3F` | Primary actions and selective emphasis |
| Sage | `#87B7A5` | Saved/watchlist confirmation |
| Gold | `#F2C66D` | Ratings and score-related information |

The 55% paper / 30% ink / 10% vermilion / 5% supporting accents split is a visual hierarchy, not a literal screen-area target. Exclude anime artwork from these proportions. Paper dominates; do not add dark panels merely to satisfy the ink percentage.

Derived shades are allowed for muted text, borders, hover states, and darker vermilion for small links and filled buttons. Exact derived values will be selected and verified during implementation; the five core colors remain the anchors.

Color rules:

- `--accent` represents vermilion consistently across routes; readable derived variants support links and primary controls.
- `--score` is reserved for ratings and score-related information.
- Sage communicates saved/watchlist confirmation, paired with text or an icon.
- `--danger` is reserved for destructive actions and error feedback, with a distinct treatment and explicit messages so it is not confused with primary actions.
- Secondary actions use paper, ink, and borders.
- Replace colored glows and interface gradients with flat surfaces, fine rules, and restrained shadows.
- Ink against paper has approximately 13.67:1 contrast. Core vermilion against paper is only 3.05:1 and against ink is 4.49:1; use a verified derived treatment for ordinary-size links and button labels.
- Sage and gold fills use ink labels. Do not use them as small text or essential boundaries against paper.
- Keep posters and banners in their original colors. Retain dark overlays where text sits over imagery and verify readability against the actual image treatment.
- Text and controls must remain legible when poster imagery fails, loads slowly, or is high contrast.
- Update browser-native controls and authentication appearance to the light theme; a global token swap alone does not cover hardcoded purple treatments.

## Typography

Keep the current Japanese-editorial character, while making the roles more explicit.

| Role | Direction | Use |
| --- | --- | --- |
| Display | Shippori Mincho or the current display token | Page titles, section titles, editorial anime names |
| Interface | Zen Kaku Gothic New or the current body token | Navigation, controls, metadata, descriptions |
| Japanese accent | Zen Antique or the current Japanese token | Short decorative translations and state anchors |
| Technical label | Current body face or a compatible mono fallback | IDs, formats, years, statuses, and compact metadata only |

Typography rules:

- Headlines are left-aligned by default and should read in one or two lines.
- Use Japanese characters as meaningful accents, not as unexplained decoration in every component.
- Reduce the frequency of uppercase, wide-tracked labels. They are reserved for navigation, compact metadata, and occasional section context.
- Keep body copy short, direct, and easy to scan.
- Do not mix a new display family into an existing heading merely for contrast.

## Shape, spacing, and materiality

Use one consistent shape system:

- cards and panels: `4px` radius
- controls: `4px` radius
- status chips and counts: full pill only when they represent a compact status or count
- circular buttons: circular only when the control is an icon-only action

Formalize spacing in a future token pass:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
}
```

Prefer hairlines, grouped content, and poster scale to heavy containers. A card should communicate a real relationship, such as a title with its poster and metadata. Decorative panels should be removed if spacing can do the same job.

## Spatial composition

### Home

The first viewport should establish Kyomei as a living index, not a marketing hero.

- Keep the brand and navigation on one compact top line.
- Use a left-aligned title and search action.
- Keep the existing `PosterOrbit`, its anime posters, and its spinning animation as the right-side visual counterweight on wide screens. Preserve its current responsive and reduced-motion behavior. The palette change may update surrounding colors, borders, and effects, but must not remove the orbit or replace its animation with a static treatment.
- Keep the first action visible without scrolling.
- Place trending or the most relevant discovery content directly after the search moment.
- Retain section rhythm, but vary section composition so every block does not look like the same grid.

### Anime cards

Posters remain the dominant visual asset. Use the existing card variants intentionally:

- poster: fast catalog scanning
- editorial: featured or high-interest selections
- minimal: occasional visual interruption, not the default for every result

The poster is the node. The title and metadata are its label. Hover should slightly clarify the node through scale, border, or image treatment. Avoid making every card glow continuously.

### Detail page

The detail page should feel like entering a single node in the map.

- Keep the banner and cover relationship.
- Preserve the cover as the primary watchlist action.
- Make synopsis and key metadata readable before secondary sections.
- Treat characters and related information as connected evidence, not a wall of equal cards.
- Keep the back action obvious and consistent with the watchlist page.

### Watchlist

The watchlist is a personal index, not a spreadsheet.

- Keep the current row-based structure for desktop because it supports comparison.
- Make the saved title the visual anchor of each row.
- Use the score, progress, and type columns as quiet supporting signals.
- On small screens, collapse secondary columns explicitly and retain title, cover, and remove action.
- Empty watchlist states should feel like an invitation to browse, not an error.

## Interaction and motion

Motion should communicate one of four things: hierarchy, discovery sequence, feedback, or state change.

Recommended behaviors:

- first-load reveal: stagger the title, search, and first content section softly
- poster hover: small image scale and border clarification
- card focus: use the same visual language as hover for keyboard users
- filter changes: transition result content without disorienting the page
- watchlist add/remove: give a clear tactile response and update the count immediately
- detail entry: let the banner and cover settle into place before secondary metadata appears

Avoid scroll hijacking, perpetual movement on every card, and decorative motion with no content purpose. Respect `prefers-reduced-motion` by removing transforms, shimmer, and stagger delays while preserving state changes and focus visibility.

## Component rules

### Navigation

The nav remains compact, single-line on desktop, and collapses before it wraps. Browse and Watchlist remain the primary destinations. The live/API status can remain quiet metadata, not a competing action.

### Search and filters

Search is the main discovery control. It should have a strong focus ring, a clear submit affordance, and a visible loading state. Filters should converge on one interaction pattern rather than mixing custom dropdowns and native selects without a documented reason.

### Badges and chips

Use badges for score, format, status, and small counts. Do not place explanatory copy inside a badge. Overlay badges on posters only when the label is useful at a glance and remains readable over image fallbacks.

### Buttons

Keep two roles:

- primary: filled vermilion-family action with a verified readable label for search or the main watchlist action
- secondary: outlined action for retry, clear, back, or lower-priority navigation

Every button needs visible hover, focus, active, disabled, and loading behavior where applicable. Labels must not wrap at desktop widths.

### Loading, empty, and error states

Skeletons should match poster and text geometry. Empty and error states should retain Kyomei's Japanese glyph anchor, but pair it with plain English copy that explains what happened and what the user can do next. Retry actions must be wired to real handlers on every route.

## Responsive behavior

Use these shared breakpoints in the future CSS cleanup:

- `640px`: two-column poster grid and compact mobile spacing
- `768px`: single-column collapse threshold for multi-column content
- `900px`: collapse detail and watchlist sidebars
- `1180px`: reduce dense poster grids
- `1440px`: hide or simplify optional orbit decoration

Below `768px`:

- remove decorative side rails or convert them into a small top accent
- collapse the nav into a compact menu or reduced link set before it wraps
- keep search full width
- use two poster columns where the viewport allows, with generous tap targets
- stack detail cover and text with the cover first
- turn watchlist rows into title-led compact entries
- preserve at least `16px` horizontal page padding

Do not use viewport-height assumptions that break when mobile browser chrome changes. Full-height treatments should use dynamic viewport units only when genuinely needed.

## Accessibility and resilience

- Maintain keyboard navigation for cards, links, filters, and icon buttons.
- Provide visible focus states that do not depend on glow alone.
- Keep contrast at WCAG AA for body text and controls.
- Use meaningful alt text for poster images and empty alt text for purely decorative marks.
- Never communicate status through color alone.
- Keep content usable when images fail, fonts are unavailable, motion is reduced, or API responses are empty.
- Ensure icon-only controls have accessible names.

## Content voice

Kyomei's voice is observant, concise, and slightly poetic, but always functional. Use language that helps a user decide what to do.

Good: `Save to watchlist`, `No titles match these filters`, `Try a broader search`.

Avoid invented technical claims, fake metrics, unexplained system language, and decorative micro-copy that competes with the title. Do not use em dashes in visible UI copy.

## Implementation sequence

For the agreed palette change, preserve layout, typography, spacing, and motion behavior. When implementation begins, use this order:

1. Audit color tokens, hardcoded purple treatments, image overlays, browser color scheme, and authentication appearance.
2. Define the core palette and readable derived shades without changing product behavior.
3. Apply flat surfaces, fine rules, restrained shadows, and consistent action and status colors to shared components.
4. Align Browse, Detail, Watchlist, Sign-in, and Sign-up with the shared palette.
5. Verify contrast, loading, empty, error, image-failure, keyboard, and mobile states.

## Non-goals and guardrails

- Preserve Kyomei's poster-led editorial identity across the paper-based theme.
- Do not replace the anime poster experience with abstract gradients or fake product screenshots.
- Do not remove the Japanese-editorial character in pursuit of a neutral technology aesthetic.
- Keep vermilion, sage, and gold scoped to their agreed roles and preserve the existing radius language.
- Defer dark mode, layout recomposition, typography changes, and new motion work beyond this palette change.
- Do not change route structure, API usage, persistence, or primary navigation labels as part of visual work.
- Do not use fake-precise popularity numbers or unsupported claims in the interface.
- Do not make every section a card grid, every label uppercase, or every interaction animated.

## Pre-flight checklist

- [ ] The first viewport communicates discovery and exposes the primary action.
- [ ] The paper-based light theme is consistent across Browse, Detail, Watchlist, Sign-in, and Sign-up, including browser-native controls.
- [ ] Vermilion marks primary actions, sage marks saved/watchlist confirmation, gold marks ratings, and errors have a distinct treatment.
- [ ] Derived shades, text, control boundaries, and focus indicators meet contrast requirements on their actual backgrounds.
- [ ] Interface glows and colored gradients are replaced; original artwork colors and necessary dark text overlays are retained.
- [ ] The color proportions guide hierarchy without imposing literal area quotas or counting artwork.
- [ ] Cards, controls, pills, and circular icon actions follow the documented shape rules.
- [ ] Desktop navigation stays on one line and mobile behavior is explicit.
- [ ] Cards use real poster imagery and remain useful when imagery fails.
- [ ] Loading, empty, error, focus, disabled, and active states are represented.
- [ ] Motion has a user-facing reason and a reduced-motion fallback.
- [ ] Visible copy is concise, grammatical, and free of em dashes.
- [ ] The rebrand preserves existing product flows and API boundaries.
