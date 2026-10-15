# 04: Complete frontend authentication regression coverage

**Repository:** kyomei_0
**Source:** auth-spec.md, Feature 9 — frontend; Features 2–3 are complete.
**What to build:** Automated tests preserve the user's authentication experience from session loading through protected API access and sign-out.
**Blocked by:** None (can start immediately).
**Status:** ready-for-agent

## Scope

Extend the existing frontend testing tools and centralized authenticated API client. Mock Clerk session/token boundaries and API responses; do not require a live Clerk account. This is coverage of existing authentication behavior, not a new profile, preferences, ratings, or watchlist-sync feature.

## Acceptance criteria

- [ ] While Clerk loads, authenticated content is not shown prematurely and protected requests are not issued.
- [ ] Signed-out and signed-in states render correctly, and existing protected UI follows its intended access policy.
- [ ] Authenticated API requests obtain a session token centrally and attach the Bearer header; public requests work without a token.
- [ ] A missing session or unavailable token produces a controlled failure without issuing an unauthenticated protected request.
- [ ] A 401 follows the defined reauthentication behavior; 403 and temporary failures remain distinct and do not cause retry loops.
- [ ] Signing out or switching accounts cannot leave the previous user's protected data visible or reusable through frontend state/caches.
- [ ] Tokens are neither manually persisted nor logged by the application.
- [ ] Tests assert user-visible outcomes and request behavior, extending existing coverage without repeating SDK internals.
- [ ] Type checking, lint, the frontend test suite, and the production build pass.

## Related tickets

Production verification is ticket 05 in kyomei_api's auth-completion effort and is blocked by this ticket. Backend tickets 01–03 are in the same effort there; this ticket can proceed independently using mocked responses.

