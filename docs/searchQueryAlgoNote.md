# Search Result Sorting Design Note

## Overview

To improve search result relevance, results are sorted based on how closely their titles match the user's query. This document explains the logic, trade-offs, and future directions for this sorting approach.

## How the Sort Works At a High Level

1. Convert both titles and the query to **lowercase** for case-insensitive comparison.
2. Check if the query string is **included** in each title.
3. If one title includes the query and the other does not, the title that includes it **comes first**.
4. If both titles include the query, or neither does, they are considered **equal** in sort order.

This ensures titles containing the query surface above those that don't, directly improving relevance for the user's input.

## Trade-offs

### Pros

- Simple and easy to implement.
- Meaningfully improves relevance by prioritizing titles that contain the query string.

### Cons

- Does not account for other relevance signals such as score, popularity, or exact match position.
- May underperform on complex queries or partial/fuzzy matches.
- Does not distinguish between a query appearing at the start of a title versus buried in the middle.

## Future Improvements

- **Multi-factor ranking** — incorporate signals like score, view count, or recency alongside string inclusion.
- **Exact match boosting** — rank titles where the query appears at the beginning higher than those where it appears mid-string.
- **Dedicated search library** — replace manual sorting with a library designed for relevance ranking (e.g., `bleve` in Go, or `fuse.js` on the frontend) for more nuanced matching.
- **Fuzzy/partial match handling** — account for typos and partial queries to avoid zero-result scenarios.

## Summary

This sorting approach is a reasonable starting point. It's low complexity and shows visible improvement in result relevance. As Kyomei grows and query patterns become clearer, replacing or layering this with a more sophisticated ranking strategy will be a natural next step. We can also move this sorting logic to the backend in the future to reduce frontend processing and improve performance.