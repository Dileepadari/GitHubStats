# not_for_you.md

The log for whoever has to touch this next, which is probably me. Decisions too small for
[DEVDOC.md](./DEVDOC.md), things considered and rejected, and the mistakes worth not repeating.

---

## This repository was missed by the overhaul entirely

It is the 55th. The inventory that drives that job was taken on 2026-09-02; this repository's
first commit is 2026-09-08. A one-off inventory does not notice what is created after it, and
nothing re-scanned for a month. Found on 2026-10-01 by diffing every directory under
`My_Projects`, `My_Projects/apps` and `others_projects` against `INVENTORY.md`.

The lesson is not about this repository. It is that "every repository is done" was true of a list,
not of a disk.

## What a missing CI actually cost

Not style. At the moment CI was added, this repository simultaneously had:

- a **critical** advisory in its pinned framework (`next` 16.3.4, GHSA-vcvr-r3jv-pc5j, RCE in
  `next/og`),
- 28 ESLint errors, and
- a username flaw that let a caller point the deployment's own GitHub token at any API path.

None of these needed cleverness to find. `npm audit` and `npm run lint` find two of them in
fifteen seconds. Nobody had run either, because nothing ran them automatically.

## Things considered and not done

**A unit test suite.** Thirteen pure string functions and two fetch paths. Asserting that
`renderStatsCard` contains "Total Stars" tests nothing a typo would not pass. Parsing the real
SVG and attacking it with markup catches the failures that actually happen, so `check-cards.ts`
is the whole suite. If this grows a scheduler or a queue, revisit.

**Rate limiting.** The endpoints are public, unauthenticated and read-only, and GitHub's own
rate limit is the backstop. Worth adding if the deployment ever pays per request. Recorded, not
built.

**Pruning `github_stats_cache`.** `expires_at` is checked on read, so stale rows are never
served; they only take space. A nightly delete is housekeeping and there is no cron here by
choice.

**Replacing the achievement thresholds with GitHub's real ones.** GitHub does not publish them.
The current ones are guesses that produce a plausible card, and the card says "recomputed from
public data" rather than claiming to be GitHub's own badges.

**Removing `AGENTS.md`.** It carries em dashes against the house style, and `next dev` rewrites
it on every run. Deleting it is a change that undoes itself.

## Mistakes made while doing this

**I replaced a grade ring with a trophy and animated it with a CSS `transform`.** The group is
positioned by a `transform` attribute, and the CSS transform replaced it: the whole trophy
animated itself into the top-left corner and was clipped off the card. I spent three captures
convinced the paths were not rendering, when they were rendering in the wrong place. Animate
opacity; leave the positioning transform alone.

**I debugged a blank capture for several minutes before noticing it was my own harness.** The
wrapper page appended the image to `document.body` from a script that ran before `<body>`
existed. The image had loaded, the title said so, and nothing was on the page.

**My first verification script reported a missing translation that was present.** It compared
raw strings against a TypeScript source where an apostrophe is backslash-escaped. The check was
wrong, not the data. Escape before comparing.

**I killed my own shell with `pgrep -f "next dev"`.** The pattern matched the command line
containing the pattern. Find the listening PID instead:
`ss -ltnp | awk '/:3001 /{print $NF}'`.

## Capture notes, for next time

- The card endpoints return `image/svg+xml`, and the screenshot tool cannot inject a script into
  an SVG document, so a zoom capture times out. Wrap the card in a throwaway HTML page with an
  `<img>` and capture that. The wrapper is deleted before committing.
- **Cache-bust every capture.** Two cards were shot showing a pre-fix render because the browser
  reused the image for an identical URL.
- The screenshot scale was 0.7875 this session (1512 / 1920). Measure it once; a zoom region is
  in screenshot pixels, not CSS pixels.
- Cards were captured at 2x and quantised afterwards. Largest file: 52 KB.

## Verified, so nobody has to redo it

- gitleaks over all history: clean. The manual blob sweep found only placeholders in
  `.env.example` and the README table.
- `.gitignore` already had `.env*` with `!.env.example`, which is the right shape.
- The username fix tested against the running app, not only in theory:
  `/api/stats?username=../orgs/github` answers
  `"../orgs/github" is not a valid GitHub username`.
- The regex accepts 7 real usernames and refuses 11 payloads, including `..`, `x/followers`,
  `x?per_page=1`, a leading hyphen, a doubled hyphen and 40 characters.
- `check-cards` fails when one `escapeXml` is removed, and passes when it is restored.
- `hashVisitorIp` returns null with no salt, and distinct values per IP with one.

## Left for the owner

- **Apply `db/schema.sql` to the deployed database** if it was ever created by hand - the
  columns should already match, but now there is a file to compare against.
- **Set `IP_HASH_SALT`** in the Vercel project, or accept that no view IPs are recorded, which is
  a perfectly good answer.
- **Old `github_view_logs` rows hold raw IP addresses** if this ran before 2026-10-01. DEVDOC has
  the query to count them and the one to null them.
