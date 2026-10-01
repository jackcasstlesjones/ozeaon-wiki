# Docs pass checklist

Source of truth for built vs planned: `~/coding/ozeaon-roadmap/index.html` (as of 30 Sep 2026).
Codebase pin: ozeaon-v2 `0a4f1a95`.

## Roadmap status used

- **Done:** mobile designs, article and project comments, article/project publish & hard deletion (My Articles / My Projects), account and organisation hard deletion, automated moderation, alpha badges.
- **In progress:** legal pages, feed filters, notifications (first release).
- **Planned:** everything else, including pods, DAO, tokens (PRG/$OZN), payments/funding/tipping, educational resources and quizzes, events, messaging, global search, bookmarks, connections and blocking (code exists but isn't wired up), open calls and invites.
- Schema tables for unbuilt features (`pods`, `dao_*`, `token_transactions`, `educational_resources`, `events`, `bookmark_folders`, `open_calls`…) exist. The docs may mention them but must mark the feature as roadmap.

## House style

- Titles: plain Title Case name, no `Heading: subtitle` colon form, `&` instead of "and".
- Every page has a one-sentence `description:` in frontmatter.
- No boilerplate `## Purpose and Scope`; one short intro paragraph instead.
- Standard section names: `## Overview`, `## Architecture`, `## Failure Modes & Edge Cases`, `## Operational Notes`, `## Extension Points`, `## Related Links`.
- Citations: inline links in prose, not a `> Source:` blockquote after every snippet.
- Component catalog entries: `## Name`, 1–3 sentences on purpose and when to use it, one `**Source:**` link. No props tables, `Used in:` lists or `Kind:` lines.
- Keep the why, architecture, flows, gotchas and conventions. Cut field lists, copied types, function-by-function tables, exhaustive constants and version numbers, and link to the code instead.

## Site-wide

- [x] FORMAT: `features/` titles used `Heading: subtitle` (Articles:, Organizations:, Projects:) → renamed to plain titles
- [x] FORMAT: `components/ui/*` titles prefixed `UI: ` → dropped the prefix; `src/sidebar.json` Components group now lists top-level pages and a `UI` subgroup (autogenerate showed the raw dir name `ui`)
- [x] FORMAT: title case fixes: `shadcn primitives` → `shadcn Primitives`, `Shadcn Components` → `shadcn Components`
- [x] FORMAT: `index.mdx` description said "Generated documentation" → "Developer documentation"

### overview/project-overview.md

- [x] ROADMAP: README mission bullets, the "what this repository powers" table, audience feature areas and terminology presented pods, DAO, token rewards, funding/donations, educational hub, quizzes and mobile/third-party API as existing → rewritten as "What Is Built" (verified against code) and "What Is Planned" (explicitly roadmap)
- [x] ROADMAP: ER diagram included `pods`, `educational_resources`, `bookmarks`, `project_participants` (no such table) → removed; the page now notes which schema tables are placeholders
- [x] ROADMAP: architecture diagram showed "Mobile Apps / Third Parties" calling the API → removed
- [x] STALE-DETAIL: version table, full pnpm script table and script bodies, config file table, import snippets, client matrix, failure-mode table and conventions copied from CLAUDE.md (~560 lines) → cut to ~100 lines that link to the owning pages
- [x] FORMAT: removed Purpose and Scope boilerplate and `> Source:` blockquotes, and added `description:`
- [x] FORMAT: stale link `docs/supabase_local.md` (the file is `supabase-local.md`) → removed with the docs index table

### overview/technology-stack.md

- [x] STALE-DETAIL: version numbers, copied `next.config.ts`/`tsconfig.json`/`package.json` blocks, per-flag and per-option tables, full dependency inventory, script bodies and step-by-step script walkthroughs (793 lines) → ~90 lines: a stack table, the build decisions that matter, a scripts-by-purpose table, gotchas, and links to the config files
- [x] FORMAT: removed Purpose and Scope and the `> Source:` blockquotes; renamed "Failure Modes and Edge Cases" to the standard name, dropped "Performance and Operational Notes", and added `description:`
