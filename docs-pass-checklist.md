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
- Status callouts for unbuilt or in-progress features: Starlight asides (`:::note[...]` for in progress or roadmap, `:::caution[...]` for unwired code), not `>` blockquotes.
- Citations: inline links in prose, not a `> Source:` blockquote after every snippet.
- Component catalog entries: `## Name`, 1–3 sentences on purpose and when to use it, one `**Source:**` link. No props tables, `Used in:` lists or `Kind:` lines.
- Spelling: UK "organisation(s)" in prose, titles, descriptions and link labels. Keep code identifiers, file and route paths, link targets and code blocks as written (`OrganizationCard`, `/organizations/[slug]`).
- Product name: "OZEAON", never "OZEAON V2". Keep `ozeaon-v2` only in repo URLs and code identifiers such as `ozeaondb_v2_*`.
- Headings: Title Case for every `##`/`###` (code identifiers excepted).
- Sidebar: one section per domain (Posts, Projects, Articles, Organisations, Profiles & Social, Community) for feature pages; all component catalogues stay together under Components.
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

### overview/getting-started.md

- [x] ROADMAP: Overview restated the README "central hub" list (educational content, mobile apps/third-party API) → removed
- [x] STALE-DETAIL: version tables, the README/package.json pnpm version discrepancy, the full env var template and table, the full script table with definitions, copied script bodies, type-derivation snippets, the client matrix duplicated from Supabase Client Patterns, and the cache directory list (579 lines) → ~85 lines: prerequisites, first-run commands, the DB loop, pre-push checks, and a failure table
- [x] ROADMAP/accuracy: the page claimed `src/types/supabase.ts` is generated and not committed, so `pnpm check` fails on a fresh clone. It is committed, and only `cloudflare-env.d.ts` is generated → corrected
- [x] FORMAT: removed Purpose and Scope and the `> Source:` blockquotes, used standard section names, and added `description:`

### overview/ (follow-ups from the audit of the rewritten pages)

- [x] ROADMAP project-overview: "comments and likes on posts, projects and articles" overstated the likes → likes are on posts and comments only
- [x] ROADMAP project-overview: noted the planned features that have disconnected code (connections/blocks APIs, events API with unused dialog, pod membership branch, basic search) and the notifications feature flag
- [x] FORMAT technology-stack: reworded the backwards CSP failure bullet, and the `ci:deploy` row now says CI-only
- [x] ROADMAP project-overview: it promises that the data-model page marks which tables are placeholders. Keep that sentence only once the data-model "Tables for Unbuilt Features" item below is done

## Site-wide format sweep (apply to every topic page as it is rewritten)

These apply to every one of the 46 non-component pages. Each page section below repeats them as a single FORMAT item so they can be ticked per page.

- Delete `## Purpose and Scope`, add `description:`, convert `> Source:` blockquotes to inline links, rename failure/ops sections to the standard names, replace plain-text "sibling page" references and stale generator slugs (`6-api-layer`, `2-architecture`, `8-design-system`…) with real relative links, and delete generator hedging ("not read within the source budget", "exploration budget", "not verified in source", "Careful readers should verify").
- [x] FORMAT src/sidebar.json (done; was pending `components/tiptap.md`, which still has `sidebar.order` because it was being rewritten; strip it once it's committed): the explicit Components list ignores `sidebar.order` on the top-level component pages (organizations and posts were both 10), and new component pages must be added by hand → drop `sidebar.order` from the top-level component pages and add a README note that `src/sidebar.json` sets their order
- [x] FORMAT: heading case. Every `##`/`###` heading uses Title Case (code identifiers excepted) → run a site-wide check at the end
- [x] FORMAT: spelling. Prose mixed "organisation" and "organization" → first standardised on "organization", then switched site-wide to UK "organisation" (see Follow-ups)
- [x] FORMAT: cross-links from component pages to their feature pages (components/projects → features/projects, etc.) → add a one-line "See also" in each component page intro

### architecture/app-structure.md (460 → ~200)

- [x] FORMAT: house-style sweep
- [x] ROADMAP/accuracy: "`(main)` — the authenticated application" is wrong. It hosts public feed, reader and profile pages too; auth gating is in the `(dashboard)` layout (`getAuthUserOrRedirect`) and in `(feed)/(private)`
- [x] ROADMAP/accuracy: `(main)/layout.tsx` mounts `NavSlotProvider`, `NavHistoryTracker` and `MobileFloatingCreate` (the real path is `src/components/nav/components/MobileFloatingCreate.tsx`) → list all three
- [x] ROADMAP/accuracy: `EntityTitleSlot` is mounted in the `(profile)` org and user layouts, not in `(reader)` or `(editor)`. Real routes are `/organizations/[slug]` and `/profiles/[username]` (not `/organisations/[handle]` or `/profile/[handle]`)
- [x] ROADMAP/accuracy: the layout file list leaves out `(editor)/layout.tsx` and the two `(profile)` entity layouts → add them, or say "see `src/app/**/layout.tsx`"
- [x] STALE-DETAIL: shell pixel values, the copied NavSlotContext and EntityTitleSlot source, the MobileFloatingCreate hide-route list, four near-identical layout snippets (keep `(feed)` only), and the logger category table → summarise and link. Cite code, not DESIGN-CONSISTENCY-PLAN.md

### architecture/data-model-and-schema.md (864 → ~250)

- [x] FORMAT: house-style sweep; merge "Configuration & Conventions Reference" and "API Reference: Migration-Defined Database Objects" into `## Conventions`; delete the "safe aliases" and "migrations read for this page" leftovers
- [x] ROADMAP: the intro says "content, governance, identity, and lookup entities" → drop "governance"
- [x] ROADMAP: add `### Tables for Unbuilt Features` with these placeholder groups:
  - pods (`pods`, `pod_members`, `pod_invites`, `pod_join_requests`, `pod_types`)
  - DAO (`dao_proposals`, `dao_votes`, `proposal_types`, `vote_choice`)
  - tokens (`token_transactions`, `transaction_types`)
  - educational hub (`educational_resources`, `educational_resource_sdgs`, `resource_subjects*`, `user_resource_progress`, `resource_types`, `difficulty_levels`, `course_types`)
  - notes and bookmarks (`bookmark_folders`, `bookmark_folder_bookmarks`, `resource_subject_bookmarks`, `user_subject_notes`, `note_labels`)
  - misc (`events`, `open_calls`, `referrals`, `search_queries`)
  - connections and blocking (`user_connections`, `user_blocks`): APIs exist but nothing calls them from the UI

  `resource_categories`/`resource_subcategories` are live only as the subject taxonomy for articles and projects
- [x] ROADMAP: the `funding_sources` seeds (`dao_treasury`, `crowdfunding`) are article attribution metadata only → say so
- [x] ROADMAP/accuracy: `article_attachments` was replaced by `article_documents` and `article_images` (`20260430104609`), and `notification_types` was dropped (notifications now come from `20260918000000_notifications_foundation.sql`) → update the text, diagrams and ER
- [x] FORMAT: the page covers only 20 of the 80 migrations → say it covers the V2 cutover and conventions, and link Migrations & Seeding for the full chain
- [x] STALE-DETAIL: column groups, `ADD COLUMN` SQL, per-table column tables, the enum value table, seed value lists (keep one empty-guard snippet), SQL drop blocks, ER attribute blocks (keep relationships), and the full `project_faqs` DDL → cut; link `docs/db/schema.sql`

### architecture/middleware-sessions.md (376 → ~120)

- [x] FORMAT: house-style sweep; delete the "not fully enumerable from the excerpt" leftover
- [x] ROADMAP/accuracy: `PUBLIC_PATHS = ["/theme", "/educational-resources", "/auth/signin", "/reset-password"]` is a prefix match that skips `getClaims()`. The middleware never redirects anonymous users to sign-in; gating happens in the layouts. The first three paths are leftovers for routes that don't exist (the educational hub is roadmap)
- [x] ROADMAP/accuracy: document the password-reset guard. If `user_metadata.password_reset_pending` is set, the user is redirected to `/reset-password` from everywhere except `/reset-password` and `/auth/signout`. `getUser()` runs only in that case, so normally there is one `getClaims()` call. Fix the sequence diagram and the "two sequential round-trips" claim
- [x] ROADMAP/accuracy: the matcher excludes `/api`, static and image assets, and prefetch requests → remove Api from the diagram and add a short Matcher paragraph. The auth-page redirect goes to `/`. The key is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. `withContext` sets requestId, route and method
- [x] STALE-DETAIL: Configuration Options and API Reference tables with line-number notes, and the line numbers in the failure table → cut

### architecture/ssr-rendering-and-caching.md (586 → ~150)

- [x] FORMAT: house-style sweep; delete the "Note on evidence" and "`2-architecture` section" leftovers; fix the garbled "`relativePath`-based `images.loaderFile`"
- [x] ROADMAP/accuracy: R2 incremental cache, D1 tag cache and DO queue are presented as how the app caches, but all three are commented out in `open-next.config.ts` → show the current state and keep them only as an Extension Point. "Caching controlled through OpenNext bindings" → "rendering is decided by which Supabase client a route uses"
- [x] ROADMAP: add `## Rendering Rules Today`:
  - `createClient()` makes a route dynamic; `createPublicClient()` lets it prerender
  - no `dynamic`/`revalidate`/`fetchCache`/`runtime` exports
  - ESLint bans `use cache`/`cacheTag`/`cacheLife`/`updateTag`
  - writes call `revalidatePath`; there are no `revalidateTag` calls despite CLAUDE.md

  Link `docs/ssr/*.md`
- [x] ROADMAP/accuracy: `FOUR_DAYS` is 345600 s, not 172800 → say "four days". Remove the speculative edge-HTML caching claims
- [x] STALE-DETAIL: copied `next.config.ts` blocks (keep the two Cache-Control rules and one CSP paragraph), the Configuration Options Reference, the headers table and the API Reference → cut

### architecture/supabase-client-patterns.md (580 → ~200)

- [x] FORMAT: house-style sweep; rename "Related Documentation Links" to "Related Links" and delete `## Summary`
- [x] ROADMAP/accuracy: the browser factory is `createBrowserClient()` (`src/lib/supabase/client.ts`), not `createClient()`; CLAUDE.md is stale → rename it everywhere
- [x] ROADMAP/accuracy: `server.ts` also exports `createActionClient()` (it doesn't swallow cookie-write errors) and is `server-only`. Link the auth helpers in `src/lib/supabase/queries/auth.ts` (`getAuthUser` is cached, `getAuthUserOrRedirect`, `withAuthUser`)
- [x] ROADMAP/accuracy: `server.ts` and `client.ts` bind `Database` too; only `admin.ts` is untyped. The middleware builds its own client in `src/lib/supabase/middleware.ts`. The ESLint restriction is path-based (`src/app/**/(private)/**/*.tsx`)
- [x] STALE-DETAIL: "Query Modules Built on These Clients" function reference (→ 2–3 sentences and a link to Server Actions & Queries), the version table, Configuration Options and API Reference, and the full `public.ts` copy (keep the admin credential-check snippet) → cut

### architecture/type-system.md (619 → ~180)

- [x] FORMAT: house-style sweep; **the unclosed ```typescript fence at L102 makes L179–191 render as code** → close it; remove "6170 more lines not shown" residue; link the plain-text Related Links
- [x] ROADMAP/accuracy: CI doesn't run `db:gen`. `src/types/supabase.ts` is committed and regenerated locally; CI runs `typegen` → fix the diagram and text
- [x] ROADMAP/accuracy: `Tables<"comments">`: no such table (`post_comments`, etc.) → fix. The `MembershipResult` `"pod"` variant reads placeholder tables (pods are roadmap). The `graphql_public` drift claim is unverified → verify or delete
- [x] STALE-DETAIL: the copied generated `Database` type (keep a 5-line Row/Insert/Update excerpt), the Domain File Reference export tables, script bodies, Configuration Options, Command Reference and API Reference → cut

### auth-and-accounts/account-switching.md (622 → ~200)

- [x] FORMAT: house-style sweep; fold the non-standard top-level sections under `## Architecture`
- [x] ROADMAP/accuracy: the org `ActiveAccount` variant is `Pick<organizations,"id"|"slug"|"name"> & {type:"org"; logo_path}`. The cookie carries slug, name and logo, which is why an org rename rewrites it. `/api/active-account` checks owner/admin inline (not via `isOrgManager`) and returns 400/403/404
- [x] STALE-DETAIL: copies of `getActiveAccount`/`setActiveAccount`/`clearActiveAccount`/`getOrgActiveAccount` and the cookie table (→ one paragraph: cached, malformed → user mode, httpOnly/lax/30 days, org-only pages redirect to /settings), `requestAccountSwitch`/`useAccountSwitch` copies, switcher JSX (keep the promise-as-prop + Suspense pattern), the `isOrgManager`/`resolveOrgId`/`canManageArticle` bodies (keep the security-model prose), the API Reference, the failure table with line links, and the hooks barrel link → cut

### auth-and-accounts/auth-flows.md (580 → ~180)

- [x] FORMAT: house-style sweep; fold Core Flow, Usage Examples and Configuration Options into Architecture and Operational Notes
- [x] ROADMAP/accuracy: `authorizeUser()` (`src/lib/supabase/auth.ts`) is dead code. The real guard is `getAuthUserOrRedirect()` (`queries/auth.ts`) in the `(dashboard)` layout and in pages; feed, profile and reader are public → rewrite the guard section and remove both guard diagrams
- [x] ROADMAP/accuracy: the auth flows are server actions in `src/lib/supabase/actions.ts`: `login`, `signup` (ACCESS_TOKEN gate), `forgotPassword`, `resetPassword`, `verifyOtpForRecovery`, `verifyEmailOtp`, `resendVerificationEmail`, `signOut`. Signup and recovery use in-app OTP; `/auth/confirm` is the link fallback. Add the middleware password-reset guard and the redirect of signed-in users away from auth pages
- [x] ROADMAP/accuracy: `/auth/error` reads only `message`. `AuthError` lives on `(main)/error` and reads `code`. `AuthFormPanel` is presentational; `LoginPageForm` calls `useAuth()`. Mention `GoogleSignIn` is disabled
- [x] STALE-DETAIL: the line-by-line confirm-route walkthrough (keep the decision mermaid), the config.toml table, the API Reference, the 13-row edge-case table, and the speculative "request-level deduplication" claim → cut

### auth-and-accounts/user-settings.md (841 → ~220)

- [x] FORMAT: house-style sweep; use real links for the sibling topics
- [x] ROADMAP: privacy settings are planned. `/api/user-settings` has no callers; only the profile layout filters on `user_settings.privacy`/`public_profile` → mark as roadmap and state what's wired
- [x] ROADMAP/accuracy: the dialogs use server actions: `initiateEmailChange`/`verifyEmailChange` (OTP), `changePassword` (`settings/actions.ts`) and `deleteAccount` (`lib/supabase/actions.ts`)
- [x] ROADMAP: add `## Account Deletion` (built): `delete_user_account` RPC → admin `deleteUser` → best-effort R2 purge → confirmation email → sign out and `clearActiveAccount`. Org owners get an extra dialog step (`isOrgOwner`)
- [x] STALE-DETAIL: form props and defaults copies, the full `profileSettingsSchema` and field table, the server action copied block by block (keep the why), ER/SQL/RLS SQL (→ one paragraph), the API Reference, dialog JSX, the second failure diagram, index/O(log n) notes, the extension table → cut

### api-layer/api-routes.md (922 → ~250)

- [x] FORMAT: house-style sweep; fix the colon link label "Organizations: Profiles…"; "Three envelope shapes" lists five; the status table is missing 404/409/422/503; the self-contradictory NaN paragraph; consistent `getErrorMessage` usage; real Related Links
- [x] ROADMAP/accuracy: the route/method table is wrong and incomplete (it misses posts, projects/[id], storage, users/search, etc.) → replace it with a per-family list linking `src/app/api` rather than a hand-maintained method table
- [x] ROADMAP: mark these as roadmap/unwired:
  - events (`NewEventDialog` is unmounted)
  - blocks, connections and user connections (no UI)
  - labels (Notes & Bookmarks)
  - subcategories and user-settings (no callers)
  - the pod branch in memberships

  Search covers profiles, orgs, projects and articles only; global search is planned
- [x] STALE-DETAIL: per-endpoint behaviour for every family (→ 1–2 unusual sentences each), long copied handler snippets (keep 3: the `withAuthUser` export, the uuid ownership schema, the `.select().maybeSingle()` delete), the API Reference, and the slug placeholder detail → cut

### api-layer/edge-functions.md (551 → ~90)

- [x] FORMAT: house-style sweep; standard section names
- [x] ROADMAP/accuracy: `delete-users` is obsolete. `user_profiles.deleted_at` was dropped (`20260826170100`) and deletion is synchronous via `deleteAccount` → mark it dead and a candidate for removal, and link user-settings
- [x] ROADMAP/accuracy: the invented callers (scheduler, admin tooling, client SDK) → the only caller is `resolveUserEmails` → `get-user-emails`. `reconcile-stats` has no caller in the repo. Delete the diagram and fix the non-existent page references
- [x] STALE-DETAIL: near-full copies of the three `index.ts` files, contract and env tables, three trivial flow diagrams, and the failure/perf tables → one paragraph per function plus a 3-row function/caller/auth table and 4 gotcha bullets

### api-layer/server-actions-and-queries.md (695 → ~220)

- [x] FORMAT: house-style sweep; split "Operations, Performance and Extension Points"; merge Core Flow, Canonical Code Sample and Configuration; drop the `[slug]` bug history; use "e.g." instead of the hard-coded list of 7 action files
- [x] ROADMAP: `sendConnectionRequest` is the "canonical action", but connections are unwired → use a live action (e.g. `deleteAccount` or `updateProfileSettings`) and reduce connections/blocking to one roadmap note (`isBlocked` still affects user stats)
- [x] ROADMAP/accuracy: `getAuthUser` lives in `src/lib/supabase/queries/auth.ts`, is cached, joins the profile and returns `{ user, activeAccount, supabase }`. The env var is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The getAuthUser diagram arrows are reversed
- [x] STALE-DETAIL: copies of `createClient`/`createActionClient` (keep the 4-row factory table), line-level comment-route detail (→ link Comments & Reactions; keep it in one place), the API Reference → cut

### editor/tiptap-core.md (867 → ~220)

- [x] FORMAT: house-style sweep; link toolbar-and-api and components/tiptap
- [x] ROADMAP/accuracy: heading levels are 2–4 (`levels: [2, 3, 4]`), not 1–3. The consumer is `InputContent` (the RHF field), not "the Article form". Check what the server does with the etag before claiming skip-on-no-change
- [x] STALE-DETAIL: the version table and lock note (→ "keep `@tiptap/*` versions aligned"), the `buildExtensions` body (keep the rationale bullets), the hook copied effect by effect (→ ~8 decision bullets plus the load sequence diagram), Editor JSX, props tables and classDiagram, Configuration Options and API Reference, the 14-row guard table → cut

### editor/toolbar-and-api.md (1013 → ~180)

- [x] FORMAT: house-style sweep; real sibling links
- [x] ROADMAP/accuracy:
  - the upload registry is hard-coded to `createIDBUploadRegistry("OZNArticleImagesDatabase")`, so every editor shares one store, and `clear()` on unmount wipes it for all of them
  - `keys()` is unused and reload recovery isn't wired
  - `characterCount` is always undefined (no CharacterCount extension)
  - `docs/hook-form-components.md` describes the old BlockNote editor → drop the link or flag it as stale
- [x] STALE-DETAIL: the barrel copy and exports table, toolbar JSX, the full selector body, every registry method, the duplicated Editor-prop section (keep it here as 2 sentences), Usage Examples, API Reference, the "~15 re-render" estimate → cut

### community/search.md (was features/search.md) (708 → ~170)

- [x] FORMAT: house-style sweep; Title Case the lowercase subheadings; use real sibling links
- [x] ROADMAP: shipped is keyword search at `/search` plus `GET /api/search` over org name, project/article title and profile name/username (plus author matches). Not covered: posts, comments, body text, tags, SDGs, events, resources. Global search is planned
- [x] ROADMAP/accuracy: the page SSRs page 1 via `searchContent`, and `SearchResultsFeed` fetches later pages from `/api/search` → fix the diagram. Delete the `@redis/search` aside
- [x] STALE-DETAIL: line-by-line copies of `search.ts` (keep the wildcard-hardening snippet), copied types and the ER diagram, usage examples, constants tables (keep the `SEARCH_AUTHOR_MATCH_CAP` gotcha), the API Reference, padding notes → cut

### community/notifications.md (was features/notifications.md) (620 → ~180)

- [x] FORMAT: title "Notifications & Real-Time Updates" → "Notifications"; house-style sweep; remove ticket/AC codes from prose
- [x] ROADMAP: in progress (first release). The bell renders only when `NEXT_PUBLIC_FEATURE_NOTIFICATIONS === "true"`, and `/posts/[id]` 404s when the flag is off. There is no notifications page yet. Realtime is wired (`supabase_realtime` publication, `REPLICA IDENTITY FULL`, `subscribeWithAuth`). Summarise the 18 triggers in `20260921000000_notifications_triggers.sql` in one line. Grouping, settings and digests are "second pass" (planned)
- [x] STALE-DETAIL: hook and query body copies (keep the scope-ref and `.is("read_at", null)` snippets), the API Reference, the constants table, the channel table (→ 2 bullets), the terminology table → cut

### profiles/profiles-and-social-graph.md (was features/profiles-and-social-graph.md) (769 → ~200)

- [x] FORMAT: house-style sweep; fix the `src/config/connectionConfig` link (add `.ts`)
- [x] ROADMAP: add a status callout. Follows, connections and blocking have server actions and tables, but no UI calls them: the profile layout passes `actions={null}` (`TODO(post-Phase-0)`). Rewiring them and re-enabling blocking is on the roadmap. Fix the diagram that draws `DataSlot --> Actions`, and the claim that "a block is enforced consistently"
- [x] STALE-DETAIL: the `UserProfile` type copy, ER columns, read-function bodies, connection action copies (keep the flowchart and 3–4 "why" sentences), the `followUser` copy, upload hook snippets, API Reference, config table → cut

### community/comments-and-reactions.md (was features/comments-and-reactions.md) (560 → ~170)

- [x] FORMAT: house-style sweep; add `## Failure Modes & Edge Cases` (redaction in the API only, 404 vs 403, identity switch clears likes) and `## Related Links`
- [x] ROADMAP/accuracy:
  - "notification delivery not implemented" is wrong; comment and reaction triggers exist (link notifications)
  - the only reaction is a like, on comments (all three entities) and on posts; `article_reactions`/`project_reactions` are unused and article reactions are planned
  - comment likes are server actions in `queries/reactions.ts`; only post likes have an API route
  - document realtime: `CommentThread` subscribes to `postgres_changes` and refetches
  - `CommentThread`, not `CommentList`, owns `use-thread-comments`
- [x] STALE-DETAIL: four copied types (keep the `CommentEntity` template-literal snippet), helper bodies (keep the "same hat" rule and the 404/403 rationale), the constants table, parser copies, ER columns, hook micro-snippets → cut

### posts/posts.md (was features/posts.md) (689 → ~160)

- [x] FORMAT: title "Posts Feed & Post Creation" → "Posts"; house-style sweep; remove "referenced only"/"source budget" wording
- [x] ROADMAP: `filterFollowed` is dormant (no consumer, and follows can't be created) → mark it as roadmap. Explain reposts: quote posts via `post_tag`, counted by `post_stats.repost_count`, and `useRepost().handleRepost` is a stub. The bookmark button is a disabled placeholder (Notes & Bookmarks is planned)
- [x] ROADMAP/accuracy: `PostsInfiniteFeed` consumers are the posts page and the profile/org posts tabs (`OrgPostsFeed` is unused). `FEED_PAGE_LIMIT` is in `constants/feeds.ts`. State the `/api/posts` params
- [x] STALE-DETAIL: props table and full feed copies (keep the de-dup snippet), composer snippets, Usage Examples, API Reference, performance table, component inventory → cut

### posts/post-attachments.md (was features/post-attachments.md) (357 → ~60, or delete)

- [x] ROADMAP/accuracy: the whole page describes a stale or invented model:
  - "posts are called articles" is false
  - `article_attachments` was dropped
  - `like_total`/`repost_total` no longer exist
  - the RLS quoted is for a dropped table

  → rewrite as a short "Post Images & Reposts" note: `/api/posts/image`, `post_images`, `use-post-images`, reposts via `post_tag`, `post_stats`. Move the article content-file note to articles-authoring
- [x] FORMAT: title → "Post Images & Reposts"; house-style sweep
- [x] STALE-DETAIL: RLS SQL, the property table, and the inferred route inventory → cut

### moderation-and-storage/media-and-images.md (was features/media-and-images.md) (311 → ~120)

- [x] FORMAT: title → "Media & Images"; house-style sweep; "Client-Side Upload Transport — `src/lib/images/client.ts`" → "Client Upload Transport"; trim the overlap with storage-r2 and link it
- [x] ROADMAP/accuracy: replace the four "not read" notes with facts:
  - `/api/storage?key=` sets an immutable Cache-Control and an ETag
  - validators live in `src/utils/validators/file.ts`/`image.ts`
  - keys come from `utils/generators/storage-key.ts`
  - the adapter also has `uploadBuffer`, `getFile`, `headFile`, `deleteFiles`

  Remove the invented `getImageUrl` width/quality options
- [x] STALE-DETAIL: the `client.ts` export table, the Used in list, the CSP table (→ 2 sentences), the duplicate sequence diagram → cut

### articles/articles-authoring.md (was features/articles-authoring.md) (844 → ~220)

- [x] FORMAT: house-style sweep; "storefront" → "the form"; move the off-topic storage/prerender bullets
- [x] ROADMAP/accuracy:
  - "no server-side validation" is wrong; the article API routes run Zod
  - the reader sidebar has Authors, FundingBlock and the date only; `BountyBlock` is an unrendered placeholder (bounties are planned)
  - `fundingSources` is research-funding provenance, not payments
  - drop the reader detail and link articles-reader
- [x] STALE-DETAIL: `generateMetadata` and the auth block copied twice, the reference-data block, attachment assembly copied twice, `ArticleFormProps` and API Reference, default values copied three times, language options, `useForm` options copied twice (keep the `shouldUnregister` snippet), the failure table with line links → cut

### articles/articles-reader.md (was features/articles-reader.md) (607 → ~110)

- [x] FORMAT: house-style sweep; link label "Articles: Authoring" → "Article Authoring & Publishing"; drop the non-existent "Articles: Feed" page reference
- [x] ROADMAP: "funding context" → `FundingBlock` shows the declared funding source, not payments. Cut the speculative "different revisions" claim
- [x] STALE-DETAIL: full copies of both page files (keep the `hasContent` `"<p></p>"` snippet), the decision flowchart, ER and field table, Configuration Options, API Reference, Usage Examples, the state diagram → cut

### organisations/organisations.md (was features/organizations.md) (840 → ~200)

- [x] FORMAT: house-style sweep. Pick one spelling: "organization" in prose (matching the code identifiers), "Organisation" only in quoted UI strings. Fix the stray "公开", "Priviledged", "four count functions" (it's three), and the emoji table
- [x] ROADMAP:
  - `verified` is a flag only; org verification is planned
  - there is no organization follow UI
  - "admin console" → the org settings Members page
  - "nav bell 3 pending" → settings badges
- [x] ROADMAP/accuracy: `POST /api/organizations/[id]/members` lets an owner or admin insert members directly. `20260520000000_organization_add_member_triggers.sql` stamps the originating invite or request; it doesn't maintain `member_count`. Cut the muddled counters sentence
- [x] STALE-DETAIL: type copies (keep the `viewer_role` no-N+1 point), query copies (keep the `maybeSingle`/`notFound()` rule), `getUserOrgRole`/`getAdminOrgs` bodies (keep the design bullets), pending-list bodies, activity metrics, `ORG_FIELD_LIMITS` values, API Reference and constants, performance restatement → cut

### projects/projects.md (was features/projects.md) (872 → ~200)

- [x] FORMAT: title "Project Lifecycle & Discovery" → "Projects"; house-style sweep; add `## Failure Modes & Edge Cases` (null-vs-[] filter, ownership OR, the uuid precondition, the date-suffix slug) and `## Related Links`
- [x] ROADMAP:
  - the For You/Latest/Trending tabs are commented out ("pending product sign-off") and `/for-you` redirects; `/projects` is one newest-first feed and nothing links `/trending` or `/latest`; the recommendation engine is planned
  - the funding/donations toggles are disabled "Coming soon"
  - "moderation queue" → automated moderation (`moderateAndLog`); the reporting queue is planned
- [x] STALE-DETAIL: import and barrel lists, the PATCH handler in 9 chunks (keep the sequence diagram), feed-builder bodies, overloads and option types, `filterByOwnership` copies (keep the rationale), the feed flowchart, ER columns, GET handler copies → cut

### moderation-and-storage/email-and-marketing.md (639 → ~150)

- [x] FORMAT: house-style sweep; delete the empty Source blockquote and the "source budget" wording
- [x] ROADMAP/accuracy:
  - auth emails come from Supabase Auth, and org invites are in-app only (no email)
  - the live Resend sends are just the email-change security notice and the account-deletion confirmation
  - `handleSendPost`/`SHARE_POST`/`sendTemplateEmail`/`resolveUserEmails`/`sendBatchEmails` have no callers → mark them unwired
  - "Transactional email & delivery" is planned
- [x] ROADMAP: `subscribeToAudience` runs on every signup (no opt-in) and its errors are swallowed and logged, not "fail loudly"
- [x] STALE-DETAIL: the Mailchimp deep dive (→ ~10 lines of why), env.ts copied twice (keep one env table), the files-at-a-glance table and helper bodies, the API Reference, the line-pinned failure table → cut

### moderation-and-storage/moderation.md (880 → ~200)

- [x] FORMAT: house-style sweep; rename the colon-form sections ("Transport Layer", "Verdict Mapping"); remove the hidden `Writeout` mermaid node
- [x] ROADMAP/accuracy:
  - `moderateAndLog` returns 503 on a `ModerationError` (fail-closed) and 422 with categories on a rejection → state it
  - the link-row answer is in the migration header: 5 typed link tables, and post and comment creates get none
  - list the real surfaces: the `moderation_surface` enum, org create/update, post creates, the profile bio via `moderateField`, image uploads
  - the reporting queue is planned (the report button is a Google Form link)
  - remove the `PREVIEW_ACCESS_TOKEN` row
- [x] STALE-DETAIL: transport walkthrough (→ ~10 lines), verdict/entry-point/failed-record copies (→ a short paragraph per concept), ER columns and migration table, constants table, API Reference, line-pinned edge and cost tables (keep the batching lever) → cut

### moderation-and-storage/storage-r2.md (504 → ~150)

- [x] FORMAT: house-style sweep; delete the generator wording and the "30+ tables" filler
- [x] ROADMAP/accuracy:
  - `/api/storage` uses no Cache API and no 304. It streams `R2BindingStorage.getAsResponse` with an immutable Cache-Control, `X-Cache: MISS` and a quoted ETag
  - `getPublicUrl` falls back to `/api/storage` only when `NEXT_PUBLIC_STORAGE_URL` is unset
  - the serving route and the audit use `R2BindingStorage` directly
  - buckets: top-level and production use `app-content`; preview and staging use `staging-app-content`
- [x] STALE-DETAIL: method tables, numbered upload steps plus the duplicate diagram, the `uploadImage` column lists, audit internals, next.config/open-next duplication, the API Reference → cut

### operations/ci-cd-workflows.md (649 → ~200)

- [x] FORMAT: house-style sweep; delete "API / Entry Point Reference"; "two gaps" lists three
- [x] ROADMAP/accuracy:
  - `staging.yml` is dispatch-only (the staging branch is retired)
  - add `pr-validation.yml`, `pr-monitoring.yml`, `backmerge.yml`, `performance-report.yml` and the `_shared-*` workflows
  - preview binds `staging-app-content`
  - the env table is wrong (the key is PUBLISHABLE_KEY; secrets live in GitHub Environments) → link the Cloudflare page
  - remove local `ci:deploy` and `wrangler rollback`; rollback is revert plus CI
- [x] STALE-DETAIL: keep the preview lifecycle on this page only (cloudflare-deployment links here) and the secrets table once; commit/branch tables (→ link `docs/workflows.md`), the Monday status matrix (keep the forward-only rule), the script body, the failure table → cut

### operations/cloudflare-deployment.md (596 → ~170)

- [x] FORMAT: title → "Cloudflare Deployment"; house-style sweep; split "Failure Modes and Operational Notes"; delete "API Reference (Script Contracts)"
- [x] ROADMAP/accuracy: production deploys on merge to main; staging is redeploy-on-demand only; `docs/ops-deployment.md` L18–20 is stale. Label `cacheComponents` adoption as planned and link the `eslint.rules.cache.mjs` bans
- [x] STALE-DETAIL: script bodies copied twice, version numbers, the `open-next.config.ts` copy and option tables, the preview lifecycle duplicate (→ 3 lines and a link), env table cleanup → cut

### operations/logging-observability.md (753 → ~220)

- [x] FORMAT: house-style sweep; fix the mangled `console[method](...)` link; link "Related catalog topics"; fold "Tests & Enforcement" into Operational Notes
- [x] ROADMAP/accuracy: the code still uses the manual `Object.keys(record.properties)` workaround while `docs/logging-conventions.md` says not to → state it and flag it as a codebase oddity. Label Sentry/OTel/tracing as roadmap ("Rate limiting & monitoring")
- [x] STALE-DETAIL: full `index.ts`/`config.ts` copies (keep the prod formatter excerpt and its array-not-JSON rationale), the `client-config.ts` copy (→ 3 bullets), Configuration Reference tables, API Reference, the duplicate `logError` sequence diagram → cut

### operations/migrations-and-seeding.md (475 → ~170)

- [x] FORMAT: house-style sweep; split the "Failure Modes, Edge Cases & Operational Notes" section; drop the brittle migration counts
- [x] ROADMAP: mark as not built:
  - `open_calls` and `organization_blocked_users`
  - `transfer_org_ownership()` (no callers; ownership transfer is planned)
  - `is_featured` on educational tables
  - `are_connected`/`is_blocked_pair` and the block veto (UI disconnected)
  - the org verification stopgap
- [x] STALE-DETAIL: the chronological catalog of ~80 migrations (→ eras plus the "Key Migrations in Depth" sections and a directory link), config.toml copies (keep the seed comment once), script bodies twice (→ a purpose table), the Seed Sources diagram and table → cut

### developer-guide/adding-a-feature.md (568 → ~200)

- [x] FORMAT: house-style sweep; link the sibling wiki pages
- [x] ROADMAP/accuracy:
  - the schema overview lists `pods`, `educational_resources`, `project_participants` (dropped) and `bookmarks` (doesn't exist) → link `docs/db/schema.sql`; CLAUDE.md is stale. Drop the platform tagline
  - API routes must use `withAuthUser()`; ESLint bans `auth.getUser()`
  - no local `ci:deploy` or `wrangler rollback`: merge to main, CI deploys, roll back by revert
  - the "TypeScript gate on Stop" is a Claude Code hook, not a project gate → "run `pnpm check`; `pr-validation.yml` runs lint/typecheck"
- [x] STALE-DETAIL: branch/commit/PR tables (→ link ci-cd), the deployment and lint command tables, the checklist table duplicating the steps (keep one) → cut

### developer-guide/conventions-and-linting.md (509 → ~170)

- [x] FORMAT: house-style sweep; remove the `<!-- SOURCE FILE REFERENCES -->` comment; link the logging and auth pages
- [x] ROADMAP: add a "Caching Model Restrictions" section (`eslint.rules.cache.mjs` bans `force-dynamic`/`force-static`, `use cache`, `cacheTag`, `cacheLife`, `updateTag`). Note that `import/order` is configured but off
- [x] STALE-DETAIL: the full `eslint.rules.base.mjs` copy and the ignore list (→ a summary), config import/shared-rules blocks (keep the selector-merge snippet), script bodies, the `globalIgnores` copy, the sequence diagram → cut

### config-and-utils/config-constants.md (713 → ~200)

- [x] FORMAT: house-style sweep; remove the "## Main Content" heading and the "update this page's tables" step
- [x] ROADMAP: `connectionConfig.ts` is reachable only from the unwired `profile.ts` queries (Connections & blocking is roadmap). The `VISIBILITY_OPTIONS` "connections" tier belongs to privacy settings (planned)
- [x] ROADMAP/accuracy: `OPENAI_API_KEY` is for content moderation (not "AI features"); `ACCESS_TOKEN` is the signup gate token
- [x] STALE-DETAIL: env.ts restated four times (→ one table plus the static-reference rationale), layout constants and their API Reference, the barrel name table, per-module value tables (→ a module/purpose table; keep the dead `CATEGORY_DOT_COLORS`/`ARTICLE_TYPE_REQUIRED_FIELDS`, the unrendered `VISIBILITY_OPTIONS` and the `getReactionTypeId` cache gotchas), direct `process.env` snippets → cut

### config-and-utils/hooks.md (512 → ~150)

- [x] FORMAT: house-style sweep; add `## Related Links`; replace the "not read" and "likely to coordinate view transitions" lines with what the two hooks actually do; delete the vague browser-store paragraph
- [x] STALE-DETAIL: the barrel copy, `use-auth` snippets (→ the three-hook projection idea and the display-only invariant), the `useAsyncAction` interface, body and flowchart (keep the envelope rule, `actionName` and the errorMessage-fallback gotcha), the `useArticleValidation` rules table, the `useDeleteArticle` body (keep the isDeleting gotcha) → cut

### config-and-utils/utilities.md (1409 → ~250)

- [x] FORMAT: house-style sweep; delete every "source budget"/"confirmed by grep" line and the Tests section; link plain-text page references
- [x] ROADMAP: `getDisplayCurrency`/`getDisplayCurrencySymbol`/`formatFundingAmount` are dead because project funding isn't built
- [x] ROADMAP/accuracy: fetch-with-retry is used by `GenericInfiniteFeed` and `PostsInfiniteFeed` (3 attempts, 500 ms linear backoff, retries on network errors and 5xx). `CATALUE` → `CATALOGUE`
- [x] STALE-DETAIL:
  - cut the slug-generator walkthrough to ~12 lines
  - delete the Usage Examples re-copies, the ~330-line API Reference, the constants table and the slug state diagram
  - per-module signature tables → one line per module, keeping the gotchas: dead `validators/password.ts`, the staticParams placeholder, the nav-history pushState patch, sanitise on write and render, `showUndoToast` deferral, orphan replies dropped, sidebar cookie, `decompressJSON`

### config-and-utils/zod-validation.md (1049 → ~220)

- [x] FORMAT: house-style sweep; delete the "Careful readers should verify" line
- [x] ROADMAP: `newEventSchema` and `NewEventDialog` are unwired (Events is planned); the project funding/donation fields are disabled "coming soon"; the article indigenous knowledge fields have no hub (planned)
- [x] ROADMAP/accuracy:
  - `z.config()` is global, so the only risk is a bundle where `z.ts` was never imported
  - the "four symbols per step" claim → "projects follow a quartet naming; articles and orgs use subsets"
  - list the real `validators.ts` exports in one line
- [x] STALE-DETAIL: the `z.ts` copy (keep a 6-line excerpt and the message table), import-line sections, ~500 lines of per-step field tables (→ a paragraph per domain plus the gotchas: `z.coerce.boolean("false")`, SDGs not actually required, the inert article date validation, tag limits from `strings.ts` vs `ARTICLE_FIELD_LIMITS`, `safeString` misuse, `parent_comment_id` set by trigger), the duplicate issue-code table, the duplicate mermaid → cut

### design-system/ui-primitives.md (377 → ~50)

- [x] FORMAT: title → "UI Primitives"; house-style sweep; delete `## Summary`, the `8-design-system` slug and the hedging
- [x] ROADMAP/accuracy:
  - `src/components/ui/` has 11 folders plus root files, and `display/` has ~15 components and a barrel
  - consumers mostly import from the root `@/components/ui`
  - the guessed comment hierarchy and its sequence diagram are wrong
  - the example props are invented

  → replace with a one-line-per-folder list linking `components/ui/*`
- [x] STALE-DETAIL: the file-level mermaid, per-family tables, barrel and source lists → cut

### design-system/cards-and-layout.md (435 → ~70)

- [x] FORMAT: house-style sweep; delete the "## API Reference" heading
- [x] ROADMAP/accuracy:
  - `settings/(organizations)` and `(personal)` layouts are account-type guards (they redirect on mismatch). The chrome comes from `(dashboard)/layout.tsx`; `members/layout.tsx` adds an owner/admin guard plus header and tabs
  - a card/feed API exists (`CondensedCard*`, `CollapsibleCard`, `GenericInfiniteFeed`, `ResponsiveCardList`, `TwoColumnShell`, `SidebarShell`)
  - the auth shell renders `AuthMarketingPanel`
  - the text colour ramp and "DM Mono" are stale → link design-tokens
  - fix the feed table
- [x] STALE-DETAIL: token tables repeated three times, route-tree diagrams (keep one small one), file-by-file tables, generic layout claims → cut

### design-system/design-tokens.md (1104 → ~150)

- [x] FORMAT: house-style sweep; plain headings instead of "Color System — Layer 1: Primitives"; fold the Concurrency section into Architecture; collapse F1–F9; real Related Links
- [x] ROADMAP/accuracy:
  - the mono font is Spline Sans Mono (`next/font` in `app/layout.tsx`); the `typography.css` comment and `docs/design-system.md` are stale
  - ESLint `better-tailwindcss/no-unknown-classes` does flag unknown classes
  - say plainly that there is no dark theme
- [x] STALE-DETAIL: verbatim `globals.css` blocks (→ a 3-layer summary), hex tables (keep the double-prefix rule and the link colours), `@utility`/base CSS copies, type-scale px values, the version number, the BEM examples (→ one JSX example), Configuration Options and API Reference, the provenance table → cut

### design-system/forms-and-validation.md (817 → ~120)

- [x] FORMAT: house-style sweep; remove the emoji columns; stop treating the stale repo docs as authoritative
- [x] ROADMAP/accuracy:
  - there's no `useArticleForm` and no article wizard; `ArticleForm` is a single page validated by the draft/publish schemas, and `useProjectForm` is the only domain form hook
  - `InputRichText` (BlockNote) doesn't exist; the field is Tiptap `InputContent`, imported by path
  - `OtpInput` is in `hook-form/` but not RHF-bound
  - document `ShowWhen` `unregisterFields` and `shouldUnregister: false`
  - drop the stale `ArticleForm.tsx:NNN` line refs
  - mark the access-level/embargo example as hidden UI (`token_gated` is planned)
  - add `RequiredFieldsProvider`
- [x] STALE-DETAIL: version numbers and package.json fragments, the wrapper-file mermaid, prop types and props tables (→ a gotcha per wrapper), the `useAsyncAction` duplicate → cut

### design-system/navigation-system.md (522 → ~90)

- [x] FORMAT: house-style sweep; one inline link to DESIGN-CONSISTENCY-PLAN.md instead of ~30 blockquotes; Related Links to wiki pages
- [x] ROADMAP/accuracy:
  - the page documents the plan spec as the implementation → reframe it around the code
  - the tablet icon sidebar and the `SidebarShell` size prop aren't built (it takes children only)
  - persistence is the `oz_sidebar_state` cookie resolved on the server (feed and single-entity only)
  - the real `SidebarContext` API has a Cmd/Ctrl+B shortcut
  - the Create dropdown renders `CREATE_LINKS`, and `useCreateAction` doesn't exist
  - the routes are wrong (`/network`, `/organizations/[slug]`, `/profiles/[username]`)
  - Platform is Community/Articles/Projects; My Library Resources/Notes/Bookmarks are "Soon" (roadmap)
  - the mono font is Spline Sans Mono
- [x] STALE-DETAIL: gutter tables, colour and type dumps, Configuration and API Reference tables → cut

### components/account.md (175 → ~60)

- [x] STALE-DETAIL: all 5 entries → 1–3 sentences plus Source. Keep: two-step OTP email change, `current_password_incorrect` mapped to its field, the extra org-owner step in `DeleteAccountDialog`, the bio moderation rejection. Compress the intro's join list. At most one usage snippet

### components/articles.md (880 → ~250)

- [x] ROADMAP: mark as roadmap placeholders:
  - `ArticleReviewSection` (reviews planned, not rendered)
  - `BountyBlock` (`$OZN` bounties, not rendered)
  - the "Tip - Coming soon" button
  - `token_gated` (paywalls; the access-level control is hidden)
  - the commented-out indigenous fields (Indigenous Knowledge Hub)
  - `FundingBlock`, which is provenance, not project funding
- [x] FORMAT: drop the Kind lines; folder-name group headings ("## cards/", "## Root") → Title Case group names
- [x] STALE-DETAIL: all ~40 entries → 1–3 sentences plus Source. Keep the ArticleForm flow notes (draft-then-publish, the shared in-flight create, the 7-day edit lock, `shouldUnregister`). Cut line-level detail, all but 2–3 usage snippets, and the barrel lists

### components/auth.md (207 → ~80)

- [x] STALE-DETAIL: all 10 entries → 1–3 sentences plus Source. Keep: login hydrates `useAuth`, forgot-password Resend returns to the email step, the Firefox 100 ms delay, `AuthError` needs Suspense. GoogleSignIn → one line (unused; nonce + ID token; profile bootstrap; hard-coded client ID). At most one snippet

### components/events.md (30 → ~12)

- [x] ROADMAP: Events is planned. `NewEventDialog` has zero call sites, and `/api/events` is unwired scaffolding with no server-side validation → say so up front and in `description:`
- [x] STALE-DETAIL: the props table and line-level behaviour → one sentence plus Source

### components/home.md (220 → ~70)

- [x] ROADMAP: `HowOzeaonWorks` describes planned features (quizzes, funding, DAO, Progress) and isn't rendered. `SubjectCard` is unused Educational Resources scaffolding. `ComingSoonPage` has no call sites
- [x] FORMAT: drop the Kind lines; shorten the barrel bullet
- [x] STALE-DETAIL: all 12 entries → 1–3 sentences plus Source. Compress the ActivitySlot query details (keep the Suspense/`getAuthUser` streaming note). At most one snippet

### components/icons.md (106 → ~45)

- [x] STALE-DETAIL: drop Kind and Used in lines, transform presets, and viewBox numbers. Keep the gotchas: Figma 16/20px scaled into 24px, filled paths ignore strokeWidth, fixed brand fills, `className` replaces `fill-primary`. Keep the CustomIcons snippet only

### components/nav.md (738 → ~220)

- [x] ROADMAP: the MegaMenu `comingSoon` links and the My Library "Soon" items are placeholders for roadmap features. `NotificationBell` is in progress behind `env.features.notifications`, and the mobile bell has no popover (no notifications page yet)
- [x] FORMAT: drop the Kind lines and barrel bullets
- [x] STALE-DETAIL: all 30 entries → 1–3 sentences plus Source. Keep the overview. Compress the `useNavSlot()` table, AppSidebar class values (keep the cookie gotcha), the NavLoginButtons table, and the MobileFloatingCreate path list (gotcha: it lists `/register`, which doesn't exist). Keep 2–3 snippets

### src/sidebar.json (components audit)
- [x] FORMAT: With the explicit Components list, any new `components/*.md` page won't appear in the sidebar until someone adds it by hand. The `sidebar.order` frontmatter on the 16 top-level component pages is also now ignored. Two of those values were broken anyway: `organizations` and `posts` are both `order: 10`, and 15 is unused. → Either remove `sidebar.order` from the top-level component pages, or add a note saying the explicit list sets the order. Alternative that avoids hand-maintaining the list: move `components/ui/` to a top-level `ui-components/` directory with its own autogenerated sidebar group.
- [x] FORMAT: `ui/misc.md` L132 still links with the old label "[UI: Forms](../forms/)". → Change it to "[Forms](../forms/)".

### components/notifications.md
- [x] ROADMAP L8–10: The intro doesn't say Notifications is in progress (first release) or that the overlay updates in realtime. `use-notifications.ts` subscribes to channel `notifications-overlay-{userId}`. → Add one sentence: "Notifications is in progress (first release: bell, dropdown, realtime delivery). The dedicated notifications page, settings, grouping and digests are not built yet." Keep the existing `env.features.notifications` gate note.
- [x] FORMAT L21: The "**Barrel:**" bullet sits on its own. → Fold it into the intro paragraph.
- [x] STALE-DETAIL L23–106: All 3 entries have Kind and Used in lines, a props table and a usage snippet. → Cut each to 1–3 sentences plus **Source:**. Keep these gotchas: "Mark all as read" marks only the loaded batch; the row button and the menu trigger are siblings, not nested; delete is not implemented; the skeleton renders `<li>` items so it must sit in a `<ul>`. About 106 → 45 lines.

### components/organizations.md
- [x] FORMAT L28, 72, 220, 326: Group headings mix styles ("## Feed", "## cards/", "## form/", "## members/"), and entries sit at `###`, including "### steps/IdentityStep". → Use plain group names ("Feed", "Cards", "Forms", "Members") consistently, or flatten to `## ComponentName` as the catalog style requires.
- [x] FORMAT: "Organisation" (UI strings) and "Organization" (prose) are mixed. → Use "organization" in prose and keep the British spelling only in quoted UI copy.
- [x] STALE-DETAIL L30–420: All 19 entries have Kind and Used in lines plus props tables. → Cut to 1–3 sentences plus **Source:**.
- [x] STALE-DETAIL L111, 131, 148–149, 168, 193–194, 214, 304–311: Each card lists its exact `fetch` method, path and body. → Replace with one sentence in the intro ("cards call `/api/organizations/{orgId}/…` then `router.refresh()`"), which the mermaid diagram already shows. Keep two gotchas: InviteCard cancels with no confirmation, and owners can't be removed.
- [x] STALE-DETAIL L301–311: The OrganizationSettingsForm walkthrough covers validation, save codes, slug, images, unsaved changes and delete. → Keep 3–4 bullets: images and link deletes commit immediately and undo doesn't revert them; slug re-sync starts only after the name is edited; 422 and 503 moderation handling; owner-only danger zone. Link the rest to the source. About 420 → 130 lines.

### components/posts.md
- [x] ROADMAP L85: The disabled, screen-reader-only bookmark button isn't tied to the roadmap. → Add "(Notes & Bookmarks is on the roadmap, not built)".
- [x] ROADMAP L360–375: `CircularProgress` (dead code, only in commented-out markup) has a full props table. → Reduce to one line ("unused; kept for planned project funding progress") or drop the entry.
- [x] FORMAT L27, 146, 179, 377, 609: Group headings are mixed ("## Feed and interactions", "## cards/", "## attachments/", "## create-form/", "## utils/"). Entries like "### layouts/DesktopComposer" and "### parts/ComposerTextarea" carry path prefixes, and `attachment-kinds.ts` is a heading. → Use consistent plain group names and `ComponentName` headings without path prefixes.
- [x] FORMAT L25: The long "**Barrels:**" bullet lists every re-export. → One sentence: "Import from `@/components/posts/{cards,attachments,utils}`."
- [x] STALE-DETAIL L29–631: All 30 entries have props tables, Kind lines and Used in lists. → Cut to 1–3 sentences plus **Source:**.
- [x] STALE-DETAIL L48–52, 217, 256–258, 469, 489–490: Numeric and implementation detail (IntersectionObserver margins, 300/600px thresholds, `max-h-75`, the 120px drag threshold, focus-trap mechanics). → Remove. Keep the gotchas: optimistic like re-syncs to the server status; attachment priority order; `post.message` is JSON-encoded; repost navigates to `/posts` when triggered elsewhere.
- [x] STALE-DETAIL L397: The `attachment-kinds.ts` paragraph enumerates every config field and endpoint. → "Per-kind attachment config (FormData field, labels, search endpoint); a post attaches one kind at a time." plus Source. About 631 → 170 lines.

### components/profiles.md
- [x] ROADMAP L173–175, 151: "ProgressTokensSoon … describing the upcoming impact metric". → Say it's a static teaser and that Progress Tokens / the PRG ledger are planned and not built.
- [x] ROADMAP L297–444: The ProfileActions, ConnectButton, FollowButton, BlockButton, UnblockButton, ConnectionRequests, ConnectionRequestCard and PrivateContentMessage entries each say "not rendered" separately. → Group them under one "Connections, following & blocking (disconnected)" section with one intro sentence: "Code exists but is unwired; rewiring connections into profiles and re-enabling blocking is on the roadmap; privacy settings are not built." Then list the names with Source links. Drop their props tables and the `check*` call lists.
- [x] ROADMAP L493: The "Verified" badge is presented as a feature. → Add "renders the `verified` flag; there is no verification flow yet (Org verification is on the roadmap)".
- [x] FORMAT L28, 181, 446–485, 487, 651–733: Group headings are "## shared", "## users", "### images", "#### ImageGalleryList", "### sections" and "#### DescriptionSection", so heading depth runs down to h4. → Use consistent group headings and put entries at one level.
- [x] FORMAT: "Organization" is capitalized mid-sentence throughout (L8–10, 493–733) but lowercase on other pages. → Make it lowercase.
- [x] STALE-DETAIL L30–733: All 35 entries have props tables, Kind lines, Used in lines and snippets. → Cut to 1–3 sentences plus **Source:**. Keep the ownership rule (owner only while acting as the user), `CoverImageEditor`'s dependency on the shell's `group` class, and the `OrgPostsFeed` empty-file note. About 733 → 200 lines.

### components/projects.md
- [x] ROADMAP L496: `roadmap`/`tokenomics` sections for the `dao-experiment` project type could read as DAO or token features. → Add "(free-text content sections only; DAO and token features are not built)".
- [x] ROADMAP L249, 462, 724, 756, 864, 905–911: Funding placeholders ("Funding - Soon" badge, disabled funding/donations toggles, `FundingSection`, "Fund - Coming Soon" CTA, `funding` always true) are described separately. → Keep them, but add one intro line: "Project funding, donations and rewards are on the roadmap; all funding UI is static placeholder."
- [x] ROADMAP L98: `ProjectsFilterDialog` is "pending product sign-off". → Connect it to the in-progress Feed filters item, or keep it flagged as unwired.
- [x] FORMAT L37, 114, 147, 343, 389, 624, 711, 866: Group headings are "## Root", "## pages/dashboard", "## cards", "## form/steps", "## form/parts", "## page", "## page/sections". The project-page `TeamSection`, `DocumentsSection` and `CommentsSection` headings duplicate the form-step headings of the same name, giving ambiguous anchors. → Rename the groups ("Form sections", "Public page sections") and disambiguate the headings, e.g. "TeamSection (form)" and "TeamSection (page)".
- [x] STALE-DETAIL L39–951: About 45 entries have props tables, Kind lines and Used in lists. → Cut to 1–3 sentences plus **Source:**.
- [x] STALE-DETAIL L367–373, 495–499, 544–546, 600–602: Function-level walkthroughs of `ProjectForm`, `ContentSection`, `DocumentsSection` and `RelatedSection`. → Keep the why: `saveDraftSilent` before uploads so a draft row exists; the edit check is cosmetic and the server re-checks `canManageProject`; only the first dropped document uploads; section removal commits through an undo toast. Drop the rest.
- [x] STALE-DETAIL L496: The `SECTION_VISIBILITY` mapping is copied in full. → "Section visibility per project type is hard-coded in `SECTION_VISIBILITY`" plus a link.
- [x] STALE-DETAIL L293: The `PROJECT_STATUS_BADGES` value list is copied. → Link to it instead.
- [x] STALE-DETAIL L846–864: The `section-data` export table. → One sentence plus Source. About 951 → 250 lines.

### components/search.md
- [x] ROADMAP L8: Doesn't say how much of Search is built. In code, `/search` and `/api/search` are live and ungated: a name/title match across organizations, projects, articles and people, merged via `searchContent`, with a minimum query length. → Add: "Current search is a basic name/title search across four kinds; full global search across every content type is on the roadmap."
- [x] FORMAT L11: The "**Barrel:**" bullet. → Fold it into the intro.
- [x] STALE-DETAIL L13–98: All 3 entries have Kind and Used in lines plus props tables. → Cut to 1–3 sentences plus **Source:**. Keep the gotchas: the `Suspense` wrapper is needed for `useSearchParams`; docked mode uses `router.replace` so history doesn't stack; the feed is keyed by `query`. About 98 → 40 lines.

### components/shadcn.md
- [x] FORMAT: This page overlaps `design-system/ui-primitives.md` ("Shared UI Primitives & shadcn Components"). → Add a cross-link, and make one page own each topic.
- [x] STALE-DETAIL L16–475: All 26 entries have Kind, Exports, Wrapped by and Used in lines. → Keep **Source:** and **Upstream:** only.
- [x] STALE-DETAIL L29–47, 69–76, 106, 222, 235, 247, 259, 271, 284, 297, 310, 325–367, 427, 431: Exhaustive variant lists and token class strings (`h-9 px-3`, `bg-bg-cold text-muted`, `z-60`, `max-h-75`, etc.). → Replace with 1–2 sentences per primitive on what's project-specific. Keep the real gotchas:
  - Button: pass icons via `iconLeft`/`iconRight`; the icon `className` props apply only with `asChild`.
  - Tooltip: touch toggle and `disableTouch`.
  - `CollapsibleContent animated`: re-measures content after mount.
  - Dialog sits above sheets and drawers.
  - Use `ConfirmDialog`, never `window.confirm`.
  - Toaster theme is fixed to light.
  - Drawer, Breadcrumb, ScrollArea and Tags are unused.
- [x] STALE-DETAIL L458–474: The props table and behaviour notes for the unused Tags (shadcn-io) component. → One line: "vendored, unused; use `InputTags`". About 474 → 120 lines.

### components/tiptap.md
- [x] FORMAT: This page duplicates `editor/tiptap-core.md` and `editor/toolbar-and-api.md` (about 1,880 lines covering the same module). → Make this a short catalog entry (purpose, public surface, the one consumer `InputContent`) that links to the Rich Text Editor section. Don't keep two references.
- [x] FORMAT L24: README-vs-source discrepancies are scattered (L179, 214, 264). → Keep them in a short "Gotchas" list: heading levels are 2–4, not 1–3; `parseHTML` does parse; drop fills the node but doesn't upload; `characterCount` is always `undefined`; the `minLength` arg isn't read.
- [x] STALE-DETAIL L26–39: The "## Barrels" section enumerates every export and type. → Remove it, or reduce it to "import from `@/components/tiptap`".
- [x] STALE-DETAIL L49–441: Args table (16 rows), registry members table, `ImageAttrs` table, extension option tables, selectors table, api/render/validation function tables, types shape table, Kind and Used in lines. → Remove them all (they're in the editor/ pages and the code). Keep the why: `immediatelyRender: false`; files live in an IndexedDB registry because node attrs can't hold `File`; `flush(routeOverride)` for records created after mount; an image node is removed only after the server delete succeeds. About 441 → 90 lines.

### components/users.md
- [x] ROADMAP L209 (ListHeader "followers and following") and L94 (Used in: `ConnectionRequestCard`): These reference the disconnected connections/follow code without saying so. → Add "(no call sites; follow/connection lists are not wired up, see the roadmap)".
- [x] FORMAT L10: The "Barrel:" paragraph. → Shorten it to one clause in the intro.
- [x] FORMAT: "Organization" is capitalized in prose. → Make it lowercase.
- [x] STALE-DETAIL L12–219: All 10 entries have Kind and Used in lines plus props tables. → Cut to 1–3 sentences plus **Source:**. Keep: deterministic initials colour from a hash of the name; the AuthorByline fallback order; `last:sr-only` on the divider; the whole-card overlay link with a raised button in `UserGridCard`; `ListHeader`'s back link has no accessible label. About 219 → 70 lines.

### components/ui/actions.md
- [x] FORMAT L138–140: The "## index.ts" barrel entry is a catalog heading. → Fold it into the intro ("Import from `@/components/ui/actions`"; already said at L8) and delete the section. The same applies to cards, comments and errors.
- [x] STALE-DETAIL L10–136: All 4 entries have Kind and Used in lines plus props tables (spinner sizes, gap classes). → Cut to 1–3 sentences plus **Source:**. Keep: `LoadingButton` drops icons while loading; `LikeButton` is presentational, and its count lives in a fixed `<data>` slot so the layout doesn't shift. About 140 → 45 lines.

### components/ui/cards.md
- [x] FORMAT L268–270: The "## index.ts" section. → Remove it (L8 already says what the barrel exports).
- [x] STALE-DETAIL L10–266: All 5 entries have Kind and Used in lines plus props tables, and pixel and class detail (`w-75`, `sizes="28rem"`). → Cut to 1–3 sentences plus **Source:**. Keep one composed snippet showing `CondensedCard*` used together. About 130 → 45 lines.

### components/ui/comments.md
- [x] FORMAT L36–44: "Notable behaviour:" is followed directly by a table, not bullets. → Make the entity → API/realtime table a short "Architecture" paragraph under `EntityComments`.
- [x] FORMAT L247–249: The "## index.ts" section. → Remove it.
- [x] STALE-DETAIL L19–245: All 8 entries have props tables (CommentList alone has 17 rows), Kind lines and Used in lines. → Keep `EntityComments` as the documented entry point. Cut the internal pieces to one line each plus Source.
- [x] STALE-DETAIL L133–141, 169–173, 224–229: Realtime and fold detail. → Keep the gotchas: realtime refetches on insert and delete, but other users' edits don't arrive live; switching account resets composer and like state; ownership is per acting identity; a thrown `onSubmit` is swallowed. Drop the CSS caps and breakpoint notes. About 249 → 80 lines.

### components/ui/display.md
- [x] ROADMAP L293–307: OrgVerifiedBadge. → Add "renders the `verified` column; there is no verification flow yet (Org verification is on the roadmap)".
- [x] FORMAT L417–486: "## Internal PDF viewer parts" is followed by sibling `##` entries for FullScreenWrapper, ViewerToolbar and ViewerToolbarButton, so the internals look like public catalog entries. → Collapse them into the one "Internal PDF viewer parts" section as a bullet list with Source links.
- [x] STALE-DETAIL L12–486: All 18 entries have Kind and Used in lines (EmptyState: "36 files in total"), props tables, and an exhaustive `Text` `color` enum (L360). → Cut to 1–3 sentences plus **Source:**.
- [x] STALE-DETAIL L378–386, 433–486: PDFViewer zoom steps, 600px/900px numbers, pdf.js unpkg asset list, toolbar props. → Keep the gotchas: the viewer is client-only via `next/dynamic` with `ssr: false`; the pdf.js worker loads from unpkg; state lives above `FullScreenWrapper` because toggling fullscreen remounts its children; `DocumentSelector` sorts its `documents` prop in place. About 486 → 120 lines.

### components/ui/errors.md
- [x] FORMAT L62–64: The "## index.ts" section. → Remove it.
- [x] STALE-DETAIL L10–60: Kind and Used in lines plus props tables with copied default strings. → 1–3 sentences plus Source each. Keep the "doesn't self-clear" note. About 64 → 30 lines.

### components/ui/forms.md
- [x] FORMAT L12, 166, 388: Entries are `###` under `##` group headings ("Layout and navigation", "File and image upload", "Hook-form wrappers"). Grouping is reasonable for 35 entries, but it differs from the flat sibling UI pages. → Either keep it here and adopt the same pattern on display.md and layout.md, or flatten. Decide once for the whole UI group.
- [x] FORMAT L1122–1125: The "## Barrels" section enumerates every re-export. → Replace with two import-path sentences in the intro.
- [x] STALE-DETAIL L14–1120: Props tables (about 270 table rows), Kind lines and Used in lists on every entry. → Cut each wrapper to 1–3 sentences plus **Source:**. Keep the "Shared props" concept as one sentence.
- [x] STALE-DETAIL L1008–1050: InputContent's upload limits (5 MB per file, 50 MB total, 10 uploads, png/jpeg/webp) and routes are duplicated in tiptap.md L118. → State them in one place (the editor page), or replace both with a link to the constants.
- [x] STALE-DETAIL L392–412, 1108–1120: Type alias definitions and the `useSearchSelect` return shape. → Keep these gotchas: `updates` is ignored by some wrappers; `StringArrayFieldPath` accepts any string; `OtpInput` isn't RHF-bound despite living in `hook-form/`; `InputContent` isn't exported from the barrel. Drop the rest. About 1125 → 250 lines.

### components/ui/images.md
- [x] STALE-DETAIL L16–63: Kind and Used in lines plus props tables. → 1–3 sentences plus Source each. Keep: both render nothing for an empty `src`; `aspectRatio="auto"` needs an explicit height; the zoomed image ignores the thumbnail props. About 63 → 25 lines.

### components/ui/inputs.md
- [x] FORMAT L12: The note that `src/components/ui/inputs/README.md` still describes Conform-based components. → Keep it, worded as a codebase oddity.
- [x] STALE-DETAIL L14–93: Kind and Used in lines plus props tables. → 1–3 sentences plus Source. Keep: `SearchInput`'s forwarded ref targets the wrapper (use `inputRef` for the input); `MultiSelect` text is a filter, not the value, and it doesn't render chips. About 93 → 35 lines.

### components/ui/layout.md
- [x] FORMAT L10–22: The "Layout constants" values table copies class strings. → Name the four constants and their purpose, then link.
- [x] FORMAT L341: The trailing "Barrel:" paragraph sits after the last entry. → Move it into the intro (L8 already covers it) or delete it.
- [x] STALE-DETAIL L24–339: All 15 entries have Kind and Used in lines plus props tables. → Cut to 1–3 sentences plus **Source:**. For `GenericInfiniteFeed`, keep: first fetch is page 2; `hasMore` requires a full page; responses for a stale request key are discarded; a new `initial` resets the list; the supported `entity` values. About 341 → 100 lines.

### components/ui/misc.md
- [x] FORMAT L132: Stale "[UI: Forms]" link label. → "[Forms](../forms/)".
- [x] FORMAT L2: The title "Misc" is vague. → Consider "Sidebar & Utilities", since the page is mostly `sidebar.tsx`.
- [x] STALE-DETAIL L18–25, 60–66, 88–111: SidebarProvider and Sidebar props tables, CSS variable values, and a 20-row sub-component table. → One paragraph: cookie-persisted open state per `pageType`, Cmd/Ctrl+B toggles it, `isMobile` is hard-coded false so the mobile Sheet path is dead, `AppSidebar` hides rather than collapses, and the sub-components are unused outside `sidebar.tsx`. Then a Source link.
- [x] STALE-DETAIL L189–191: The root barrel paragraph enumerates every re-export. → "`@/components/ui` re-exports a curated subset; notably not `Carousel`, `NavTabs`, `FlexBox`, `FilterTabs`, `ZoomableImage`, `GenericInfiniteFeed`, `DynamicMarker`" plus a link. About 191 → 60 lines.

### components/ui/overlays.md
- [x] STALE-DETAIL L10–133: All 4 entries have Kind and Used in lines plus props tables. → 1–3 sentences plus Source. Keep:
  - `ConfirmDialog`: confirming doesn't close the dialog; `isLoading` only disables the buttons (no spinner).
  - `ConfirmDeleteDialog`: requires a trimmed, case-sensitive `DELETE`.
  - `ModerationRejectedDialog`: has no close X; most callers spread `dialogProps` from the moderation hook.

  About 133 → 45 lines.

### components/ui/skeletons.md
- [x] STALE-DETAIL L14–70: Kind and Used in lines, props tables, and the `skeletonItemClass` value. → One line plus Source each. Note that `SkeletonCard` and `NavSkeleton` are unused. About 70 → 30 lines.

### Cross-cutting (all pages in this set)
- [x] FORMAT: None of the topic-style intros link to the matching feature page (e.g. components/projects → features/projects, components/search → features/search, components/notifications → features/notifications). → Add a one-line "See also" in each intro, or a "## Related Links" section at the end.
- [x] STALE-DETAIL: "**Kind:**" and "**Used in:**" lines appear on every entry, across about 270 entries. → Remove them everywhere. Keep a client/server note only where it's a gotcha (e.g. "no directive but uses state, so it only works inside a client parent").

## Follow-ups After the Pass

- [x] FIX: landing page hero links were relative, so `/ozeaon-wiki` without a trailing slash sent them to `/overview/project-overview/` (404) → made absolute
- [x] FIX: 9 broken relative links (wrong `../` depth) in agent-written pages → corrected; link checker reports 0 broken
- [x] CHORE: commit `3dd113c` accidentally tracked 22 empty sandbox placeholder files and `.claude/ralph-loop.local.md` → untracked in `0e325d5` and added to `.git/info/exclude` (history not rewritten)
- [x] CONTENT: project overview rewritten as a standalone description of the current system (Features / Roadmap), with no references to the README or earlier framing
- [x] CONTENT: ozeaon-v2 `README.md` rewritten on the `docs/readme` branch to describe the current platform; planned work listed as roadmap. Open question: README says MIT but the repo has no `LICENSE` file
- [x] LANDING: added Start Here and per-section `LinkCard` grids (Adding a Feature card later removed)
- [x] STYLE: accent colour switched from brand green to Ozeaon Blue (`#4c647e`, lighter tint in dark mode)
- [x] NAME: site renamed "OZEAON Developer Wiki"; "V2" removed from prose across the wiki
- [x] STRUCTURE: "Content & Social Features" split into Posts, Projects, Articles, Organisations, Profiles & Social and Community sections; Media & Images moved to Moderation & Storage; URLs changed from `/features/*` and all internal links rewritten
- [x] SPELLING: UK "organisation" across prose, titles, descriptions and link labels (123 changes); code, paths and link targets unchanged
- [x] STRUCTURE: "Moderation & Storage" split into Moderation (`/moderation/`) and Storage & Media (`/storage/`); Email & Marketing moved to Operations & Deployment; links rewritten and cross-linked
