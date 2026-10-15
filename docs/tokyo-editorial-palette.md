# Tokyo Editorial palette

Status: design decisions agreed; awaiting final confirmation before implementation.

## Direction and scope

Replace Kyomei's purple dark presentation with a paper-based theme across discovery, anime details, watchlist, sign-in, and sign-up. Keep the existing layout and typography. Replace colored glows and gradients with flat surfaces, fine rules, and restrained shadows. Defer a separate dark mode.

## Core palette

| Color | Value | Role |
| --- | --- | --- |
| Paper | `#F5F0E6` | Dominant page and interface background |
| Ink | `#242424` | Typography and structural elements |
| Vermilion | `#E85D3F` | Primary actions and selective emphasis |
| Sage | `#87B7A5` | Saved/watchlist confirmation |
| Gold | `#F2C66D` | Ratings |

The 55% paper / 30% ink / 10% vermilion / 5% supporting accents split expresses visual hierarchy, not literal screen-area targets. Exclude anime artwork from these proportions. Paper dominates; avoid adding dark panels merely to satisfy the ink percentage.

## Readability and interaction

Allow derived shades for muted text, borders, hover states, and darker vermilion for small links and filled buttons. Preserve the five core colors as the palette's anchors.

Computed sRGB contrast ratios: ink against paper is approximately 13.67:1; core vermilion against paper is 3.05:1 and against ink is 4.49:1. Use an appropriately contrasting derived treatment for ordinary-size button labels and links. Sage and gold fills use ink labels; neither serves as small text or an essential boundary against paper.

Use vermilion for the main action on each screen. Secondary actions use paper, ink, and borders. Give errors a distinct treatment with explicit messages. Pair status colors with text or icons.

## Artwork

Keep posters and banners in their original colors. Retain dark overlays where text sits over imagery, with sufficient contrast for the text.

## Implementation considerations

Global palette tokens live in `src/index.css`, but literal purple colors, backgrounds, glows, borders, and overlays also require review. Update the browser color scheme and the separate authentication appearance in `src/auth/clerkAppearance.ts` to match.

Verify all five routes, interactive states, and responsive layouts after implementation. Check text, control boundaries, and focus indicators against their actual backgrounds.
