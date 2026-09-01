# The API caching layer (`src/api/cache.ts`)

A refresher on how Kyomei's client-side response cache works, written as part of the Jikan → AniList migration.

## The problem it solves

Every anime list/detail/character fetch used to hit the network every single time a component mounted or re-fetched — even if the exact same request had just succeeded a second ago (e.g. navigating away from the home page and back re-fetches trending/seasonal from scratch). That's wasted requests against `kyomei_api`, which is itself rate-limited per client IP.

The fix is a **cache**: remember the result of a request for a while, and serve the remembered value instead of re-fetching, as long as it's still "fresh enough."

## Why not a library (TanStack Query, SWR, etc.)?

Those libraries solve this same problem plus a lot more (background refetching, request deduplication across components, pagination helpers, devtools). For an app this size, that's a lot of API surface and setup ceremony to learn and configure for a need that boils down to "remember this value for N minutes." A ~60-line hand-rolled cache is easier to read top-to-bottom than to configure a library correctly, and it's exactly as much cache as this app needs today.

## The core idea: memoize with an expiry time

At its simplest, a cache is just a lookup table (here, a `Map`) from a **key** (something that identifies the request — e.g. `"list:trending:12"`) to a **value** (the data that request returned). Before making a network call, check the table first:

```
if (key is in the table AND it hasn't expired yet):
    return the stored value          # cache HIT — no network call
else:
    make the network call
    store the result in the table, tagged with an expiry time
    return the result                 # cache MISS
```

That's the entire algorithm. Everything else in `cache.ts` is refinement of this idea.

## Two layers: memory, then localStorage

`withCache` checks two places, in order:

1. **In-memory `Map`** — fastest, but wiped every time the page reloads (it's just a JS variable).
2. **`localStorage`** — slower (has to `JSON.parse` a string), but survives page reloads and browser restarts.

```ts
const memHit = memoryCache.get(key);
if (memHit && memHit.expiresAt > now) return memHit.data;   // fastest path

if (persist) {
  const lsHit = readFromLocalStorage(key);
  if (lsHit && lsHit.expiresAt > now) {
    memoryCache.set(key, lsHit);   // warm the fast cache from the slow one
    return lsHit.data;
  }
}
```

Warming the memory cache from `localStorage` on a hit means the *second* request for the same key within a session is instant, even though the *first* request after a page reload had to go through `localStorage`.

Not everything gets persisted to `localStorage` — search results use `{ persist: false }` because there could be hundreds of distinct search queries in a session, and stashing all of them in `localStorage` forever would bloat it for no benefit (nobody re-runs the exact same rare search often enough to justify surviving a reload).

## TTL: "time to live"

Every cache entry is stamped with an `expiresAt` timestamp (`Date.now() + ttlMs`) when it's written. That's the whole expiry mechanism — no background timer sweeping old entries, just a comparison (`expiresAt > now`) at read time. An entry that's never read again just sits there unused; it doesn't need to be actively cleaned up for the cache to behave correctly.

Different data gets different TTLs based on how often it actually changes:

| Data | TTL | Why |
|---|---|---|
| Trending | 15 min | Changes slowly, but is the homepage's "live" hook |
| Seasonal | 60 min | Barely changes within a day |
| Search | 2 min, memory-only | Mostly about deduping rapid resubmits, not long-term freshness |
| Detail / characters | 30 min | Rarely changes; revisited often via the watchlist |

There's no single "right" TTL — it's a trade-off between *freshness* (short TTL, more network calls) and *savings* (long TTL, staler data). Picking per-endpoint TTLs based on how often the underlying data actually changes is usually smarter than one global number.

## Why cache the *resolved* result, not the source

`animeProvider.ts` now calls `kyomei_api` (`src/api/kyomeiApi.ts`) exclusively — the AniList-primary/Jikan-fallback logic this cache was originally built alongside has moved server-side into `kyomei_api` itself. The cache key just stores whatever `kyomei_api` returned; it doesn't need to know or care how `kyomei_api` produced that answer internally.

## Why a `key` string at all?

The cache doesn't understand "trending" or "search for Frieren" as concepts — it just maps strings to values. The key has to encode everything that makes a request *distinct*: `list:trending:12` differs from `list:trending:24` (different `limit`), and `list:search:frieren` differs from `list:search:one piece` (different query). Get the key wrong (too coarse) and unrelated requests collide and return each other's data; get it wrong (too fine, e.g. including a timestamp) and nothing ever hits the cache at all.

## Failure handling

`withCache`'s `fetcher()` is only called on a miss, and if it throws, `withCache` doesn't catch it — the error propagates to the caller and **nothing gets cached**. This matters: a temporary network failure shouldn't get "remembered" as the answer for the next 15 minutes. Only successful results are worth caching.