# Issue tracker: Local Markdown

- Specs: `.scratch/<feature>/spec.md`
- Tickets: `.scratch/<feature>/issues/<NN>-<slug>.md`, numbered from 01, one file per ticket.
- Record triage state as a `Status:` line near the top.
- Use the status vocabulary in `triage-labels.md`.
- Append discussion under `## Comments`.

“Publish to the issue tracker” means write the corresponding local Markdown file. Fetch a ticket by reading its file.

Preserve existing local tickets and their paths.

For wayfinding, use `.scratch/<feature>/map.md` and numbered child tickets. Record `Type:`, `Blocked by:`, and workflow status (`claimed` or `resolved`). Claim before working; resolve with an `## Answer` and a pointer from the map. A ticket is unblocked when every referenced blocker is resolved; select the first unblocked, unclaimed ticket by number.
