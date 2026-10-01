---
title: "Environment & Configuration Constants"
description: "Type-safe environment-variable aggregation and shared application constants for OZEAON."
sidebar:
  order: 1
---

The `src/config` directory is the single source of truth for runtime configuration and shared application constants. [`src/config/env.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts) funnels every environment-variable read through one module; the `src/config/constants/` tree holds upload limits, feed sizes, navigation, metadata, and domain-specific invariants, all importable via the `@/config` barrel.

## Overview

Next.js traditionally scatters `process.env.X` reads across server actions, route handlers, and components — hard to audit, easy to misconfigure. `src/config/env.ts` resolves this with three design decisions:

1. **Static references for inlining.** `NEXT_PUBLIC_*` values are only substituted into the browser bundle when the reference is a literal `process.env.NEXT_PUBLIC_FOO` expression. Destructuring `process.env` or computed key access breaks that substitution silently. Every variable is therefore hoisted into a module-level `const` with a dotted literal access path.
2. **Fail-fast on required values.** The two Supabase variables are guarded immediately after the hoist block with `if (!X) throw`. Missing them fails at import time with a named error, not silently at the Supabase call.
3. **Explicit optionality.** Every non-required variable gets a `|| ""` fallback or an explicit default, so the exported `env` object has a stable, non-`undefined` shape — except `storageUrl`, which is intentionally `string | undefined` and requires callers to handle the absent case themselves.

## Environment (`env.ts`)

The exported `env` object groups configuration into vendor namespaces and flat application-level fields:

| Field path | Source variable | Default | Notes |
|---|---|---|---|
| `supabase.url` | `NEXT_PUBLIC_SUPABASE_URL` | required (throws) | Browser-visible Supabase project URL |
| `supabase.pubKey` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | required (throws) | Publishable (anon) key; safe in the browser |
| `google.clientId` | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `""` | Public OAuth client id for Google sign-in |
| `baseUrl` | `NEXT_PUBLIC_BASE_URL` | `"http://localhost:3000"` | Canonical origin; used for absolute links |
| `storageUrl` | `NEXT_PUBLIC_STORAGE_URL` | `undefined` | Asset/object storage origin — the only field with no fallback |
| `features.notifications` | `NEXT_PUBLIC_FEATURE_NOTIFICATIONS` | `false` | Short-lived release toggle; `true` only when the variable is exactly `"true"`. Gates `NotificationBell` in the topbar and the `/posts/[id]` route. Notifications is in progress. |
| `resend.apiKey` | `RESEND_API_KEY` | `""` | Server-only email provider credential |
| `resend.email` | `RESEND_SENDER_EMAIL` | `""` | From-address for outgoing mail |
| `mailchimp.apiKey` | `MAILCHIMP_API_KEY` | `""` | Server-only marketing credential |
| `mailchimp.audienceId` | `MAILCHIMP_AUDIENCE_ID` | `""` | Target list/audience identifier |
| `openai.apiKey` | `OPENAI_API_KEY` | `""` | Server-only; used for content moderation only |
| `accessToken` | `ACCESS_TOKEN` | `""` | Sign-up gate token: `signup()` in `lib/supabase/actions.ts` compares the form's `access_token` field against this value to gate registration |
| `isDevelopment` | `NODE_ENV` | derived | `true` only when `NODE_ENV === "development"` |
| `isProduction` | `NODE_ENV` | derived | `true` only when `NODE_ENV === "production"` |

`SUPABASE_SERVICE_ROLE_KEY` is deliberately excluded from the `env` object. It is read only in [`lib/supabase/admin.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/admin.ts) via a direct `process.env` read with a `!` assertion. Excluding it from the shared object prevents it from being accidentally imported into a bundle.

Three Supabase clients (`lib/supabase/admin.ts`, `lib/supabase/middleware.ts`, `lib/supabase/public.ts`) bypass `env` and read `process.env` directly — a consistency note for anyone renaming variables.

## Constants

All constant modules under `src/config/constants/` are importable via `@/config` (the barrel at [`src/config/index.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/index.ts)). Three modules are imported by direct path only (`articles.ts`, `organizations.ts`, `profile.ts`) because they are consumed exclusively by their validation-adjacent call sites.

| Module | Purpose |
|---|---|
| [`feeds.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/feeds.ts) | Feed and search page-size limits; `SEARCH_AUTHOR_MATCH_CAP` bounds the `in.(…)` filter list in search URLs |
| [`posts.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/posts.ts) | `MAX_MESSAGE_LENGTH` (3000 chars) — enforced by the post composer and `MobileComposer` |
| [`password.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/password.ts) | `PASSWORD_REQUIREMENTS` object passed to `validator.isStrongPassword`, plus `validatePassword` and `checkPasswordStrength` helpers |
| [`privacy.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/privacy.ts) | `VISIBILITY_OPTIONS` array and `ContentVisibility` union (`"public" \| "connections" \| "private"`). The `connections` option depends on Connections & blocking, which is on the roadmap — `VISIBILITY_OPTIONS` currently has no UI consumers |
| [`image.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/image.ts) | `IMAGE_CONFIG` (allowed types, MIME types, per-slot size caps), `IMAGE_ERROR_MESSAGES`, and `MAX_IMAGES_PER_POST` — the most widely imported constant in the codebase |
| [`documents.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/documents.ts) | `DOCUMENT_CONFIG` (extensions, 25 MB cap) and `DOCUMENT_ERROR_MESSAGES` for the project document upload path |
| [`attachments.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/attachments.ts) | `ATTACHMENT_LIMITS` (per-kind and combined caps), `EDIT_GRACE_DAYS` (7 days post-publication), and MIME/extension lists per kind (pdf, annex, image) |
| [`categories.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/categories.ts) | `CATEGORY_DOT_COLORS` (slug → Tailwind class map) and chip border constants. `CATEGORY_DOT_COLORS` currently has no UI consumers — exported but unread |
| [`metadata.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/metadata.ts) | `NO_INDEX_ROBOTS` and `AUTHOR_OZEAON` — typed against Next.js's `Metadata` type with `satisfies` |
| [`navigation.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/navigation.ts) | `DASHBOARD_NAV_ITEMS` keyed by active-account type; drives the dashboard sidebar, account dropdown, and mobile profile menu |
| [`articles.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/articles.ts) | `VALIDATION_MESSAGES`, `ARTICLE_FIELD_LIMITS`, `ISO_LANGUAGE_CODES`, and `DELETE_ARTICLE_DIALOG`. `ARTICLE_TYPE_REQUIRED_FIELDS` is defined but has no consumers |
| [`moderation.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/moderation.ts) | Model name, timeout, retry delay, and report URL for the OpenAI moderation client |
| [`notifications.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/notifications.ts) | Batch size and debounce for the notification poller |
| [`comments.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/comments.ts) | Max comment length, batch size, and reply fold/expand thresholds |
| [`postgres.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/postgres.ts) | `PG_ERROR_CODES` map for typed Postgres error handling |

### Layout Constants

[`src/components/ui/layout/constants.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/constants.ts) lives outside the `@/config` barrel but is part of the configuration layer. It exports `CONTENT_MAX_WIDTH_CLASS`, `CONTENT_GUTTER_CLASS`, `STICKY_ASIDE_CLASS`, and `STICKY_NAV_CLASS` — Tailwind class fragments shared by the reader and feed grids so column widths and sticky offsets cannot drift independently. The `STICKY_ASIDE_CLASS` vs. `STICKY_NAV_CLASS` distinction encodes a geometry choice: `max-h-…` for sidebars with `h-fit` content vs. `h-…` for rails claiming the full remaining height. Both use `svh` (small viewport height) to stay stable across mobile browser toolbar changes.

### Root Modules Outside the Barrel

[`src/config/connectionConfig.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/connectionConfig.ts) encodes connection-request expiration (30 min) and cancel cooldown (30 min) and exports two helpers that turn those windows into ISO timestamp strings. Its sole consumer is `lib/supabase/queries/profile.ts`. Connections & blocking are on the roadmap — this config backs dormant code; `ProfileActions` (ConnectButton/BlockButton) is not rendered.

[`src/config/reaction-types.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/reaction-types.ts) exports `getReactionTypeId(slug, supabase)`, which resolves a reaction slug to its database id using a module-level cache. The cache is never invalidated, so reaction types added after process start are invisible until restart. Consumers: `app/api/posts/[id]/like/route.ts` and `lib/supabase/queries/reactions.ts`.

## Failure Modes & Edge Cases

**Import-time failure is global.** Missing a required Supabase variable throws at first import — including during build. There is no partial-degradation path for either required field.

**Client bundle leakage.** Nothing in the type system distinguishes public from server-only fields on the `env` object. Importing `env` into a client component returns `""` for server-only keys (they are not substituted, so `undefined` is caught by the `|| ""` fallback). This masks bugs rather than leaking secrets.

**`storageUrl` is the only unguarded export.** It is `string | undefined`; every other `string` field is guaranteed non-`undefined`.

**Silent degradation on optional secrets.** A missing `RESEND_API_KEY` or `OPENAI_API_KEY` starts the process successfully and fails only when the feature is used. Features relying on server-only keys must validate at their own boundary.

**`reaction-types.ts` cache staleness.** The module-level cache is never cleared. Reaction types added while the process is running are invisible until restart — a deliberate trade-off (one DB round-trip per process lifetime).

## Operational Notes

- The `env` object is built once at module evaluation and never mutated — no I/O, no lazy re-read, no synchronization required.
- Adding a variable: hoist a literal `const X = process.env.X` reference; choose a tier (throw, `|| ""`, explicit default, or derived boolean); add it to the appropriate vendor group or flat field.
- `features.notifications` is explicitly short-lived: when the last notifications ticket closes, remove the constant, the hoist, and the env variable together.
- Prefer `@/config` for all new constant imports. Direct-path imports (`@/config/constants/articles`) are for modules consumed only from their own domain.

## Extension Points

- Add a vendor group by extending the `env` literal with a new namespaced key and adding the corresponding hoisted `const`s.
- Additional Tailwind class fragments shared by more than one component belong in `src/components/ui/layout/constants.ts`.
- The three Supabase clients that bypass `env` could be routed through a validated superset; `SUPABASE_SERVICE_ROLE_KEY` would need a separate admin-only accessor to preserve isolation.

## Related Links

- [`src/config/env.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts) — environment aggregation module
- [`src/config/index.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/index.ts) — `@/config` barrel
- [`src/config/constants/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants) — all constant modules
- [Logging & Observability](../../operations/logging-observability/) — `src/lib/logger/config.ts` and instrumentation setup
- [Zod Validation](../zod-validation/) — Zod schemas that consume `articles.ts` limits and messages
- [Media & Images](../../storage/media-and-images/) — `IMAGE_CONFIG` consumers
