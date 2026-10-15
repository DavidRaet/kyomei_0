# Tickets 02–04 verification

Verified 2026-10-15. Scope: anime details, watchlist, sign-in and sign-up, plus the combined discovery journey.

## Delivered

Removed the temporary dark route palette. All five routes now share paper/ink tokens, accessible derived vermilion actions, sage saved confirmation and ink-on-gold scores. Detail character cards, watchlist controls and authentication surfaces are flat and neutral. Removed purple literals, glows and interface gradients, including Clerk's generated submit-button pseudo-element. Necessary artwork veils and existing scan/shimmer animations remain. Detail heading text sits on opaque paper; save controls use opaque fills, so bright/dark artwork cannot affect their text contrast. Poster/banner sources, typography, layout, spacing, routes, API requests, cache TTLs and persistence code are unchanged. Removed the fallback banner's saturation adjustment while retaining its existing blur.

## Rendered journeys

- Chrome desktop 1440 × 1000 and mobile 390 × 844: live Frieren detail, save/remove controls, saved reload, watchlist navigation, search and format filtering, unmatched filter feedback, removal, and empty-state reload pass. Mobile detail has no horizontal overflow. Watchlist progress remains display-only and sort selection already does not reorder titles; this palette change preserves those behaviors.
- Live discovery search for Frieren → its detail → back to browse passes. Discovery → Join Kyomei → sign-up → sign-in → mobile Browse also passes. Initial attempts clicked a stale trending card before the search results arrived; selecting the named result after it arrives completed the journey.
- Detail fixtures at the existing API boundary cover loading, explicit 503 feedback, subsequent successful load, missing synopsis/image, empty cast, populated character/actor cards, and failed poster/character images. No application API or cache code was modified. Fixture cache entries were cleared between scenarios. A character API failure still leaves skeletons under the existing behavior.
- Actual Clerk sign-in and sign-up forms rendered on desktop/mobile. Form switching, keyboard focus, required-field validation, placeholder text, hover and disabled appearance were inspected. Empty submission remains blocked by native validation. No account credentials were available; successful authentication, OAuth, verification-code flows, server authentication errors and post-auth redirects are unverified. No account was created or message sent. Configured redirect and authentication logic are unchanged.
- The final button probe confirmed no background image or shadow on the Clerk primary button or either pseudo-element. Scoped overrides are required because Clerk's generated rules override some appearance settings.
- The discovery orbit changed poster position over 350 ms with motion enabled and hid under reduced-motion emulation. Existing responsive/motion rules are unchanged.
- Firefox smoke checks passed on detail, watchlist, sign-in and sign-up. Full Firefox mobile/interaction coverage was not performed. Safari is unavailable on this Windows host; no Safari coverage is claimed.
- No uncaught page errors during the final measured Chrome journey.

## Contrast

[Computed rendered measurements](verification.json) composite ancestor fills for the sampled text. All measured ordinary text exceeds 4.5:1, including large headings. Opaque title/control backgrounds avoid artwork-dependent contrast. Values below are rounded; neutral decorative rules are not essential control boundaries.

| Treatment | Ratio |
| --- | --- |
| Detail ink heading on paper | 13.67:1 |
| Detail muted metadata / watchlist progress | 5.37:1 |
| Save control hover | 7.89:1 |
| Saved label/hint on hovered sage | 5.58:1 |
| Watchlist score on gold | 9.66:1 |
| Watchlist search/auth placeholders | 5.70:1 |
| Character role on its surface | 5.70:1 |
| Failed-image fallback | 4.89:1 |
| Error heading on surface | 7.05:1 |
| Auth primary normal / hover | 6.16:1 / 7.89:1 |
| Auth muted footer / secondary link | 4.65:1 / 4.89:1 |
| Strong input boundary against surface | 3.98:1 |
| Vermilion focus against paper / surface | 5.64:1 / 5.99:1 |

Focus inspection confirmed the real embedded input has a 2px vermilion outline with 2px offset; the primary and secondary form controls use visible focus outlines. Detail action focus is inset ivory on vermilion and ink on sage. Watchlist controls retain the shared focus-within ring. Not every possible Clerk server-generated form state was available; exhaustive browser/state contrast coverage is not claimed.

## Evidence

- Detail [desktop](02-desktop.png), [mobile](02-mobile.png), [focus](02-focus.png), [loading](02-loading.png), [error](02-error.png), [failed images and character cards](02-image-failure.png), [empty mobile](02-empty-mobile.png).
- Watchlist [desktop](03-desktop.png), [mobile](03-mobile.png).
- Sign-in [desktop](04-sign-in-desktop.png), [mobile](04-sign-in-mobile.png), [validation/focus](04-validation.png).
- Sign-up [desktop](04-sign-up-desktop.png), [mobile](04-sign-up-mobile.png).
- [Cross-route interaction results](journey.json).

## Required checks and review

`npm run tsc`, `npm run lint`, `npm test` (2 files / 7 tests), `npm run build`, and `git diff --check` pass. Type/lint/build were repeated after the embedded-form fixes. No dependencies or palette-token assertion tests were added.

Independent code-review skill axes against starting commit `a1be18555871e07c7575ca5e072cc0496caea668`: Standards 0 actionable findings; Spec 0 confirmed findings. The spec reviewer requested verification of generated Clerk button decoration; browser inspection found and removed it, then confirmed flat output.
