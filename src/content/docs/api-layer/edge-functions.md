---
title: "Supabase Edge Functions"
description: "The three Deno edge functions under supabase/functions, who calls them, and which one is dead code."
sidebar:
  order: 3
---

The repository ships three Supabase Edge Functions in [`supabase/functions/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/functions). Each is a single self-contained `index.ts` that builds a service-role Supabase client at module load and calls `Deno.serve` once. There is no shared helper code, router or test suite. Only one of them is called from the app today.

## Overview

| Function | Caller in the repo | Auth inside the function |
| --- | --- | --- |
| `get-user-emails` | `resolveUserEmails` (via `supabase.functions.invoke`) | None. Relies on the gateway's default JWT check |
| `reconcile-stats` | None | Requires `Authorization: Bearer <service-role key>` |
| `delete-users` | None. Obsolete | None |

`supabase/config.toml` has no `[functions.*]` blocks, so every function runs with the platform default `verify_jwt = true`. Nothing in `.github/` or `package.json` deploys them. They are deployed by hand with the Supabase CLI.

## get-user-emails

[`get-user-emails`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/functions/get-user-emails/index.ts) takes `{ ids: string[] }`, keeps the ids that exist in `user_profiles`, and looks up each one's email with `auth.admin.getUserById`. It exists because `auth.users.email` is not readable through PostgREST with the user's own key.

Its only caller is [`resolveUserEmails`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/email/services/user-emails.ts). That function uses usernames that are already emails directly and sends only the remaining ids to the edge function, using the request-scoped server client. `resolveUserEmails` is in turn only used by `handleSendPost` in [`queries/reactions.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/queries/reactions.ts) (share a post by email), and nothing in `src/` calls `handleSendPost`. In practice the function is not reached from the UI at this commit. See [Email & Marketing](../../operations/email-and-marketing/).

## reconcile-stats

[`reconcile-stats`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/functions/reconcile-stats/index.ts) is a thin authenticated wrapper around the `reconcile_stats()` SQL function. That function recomputes the denormalised counters that triggers normally keep up to date, and returns a JSON object of rows fixed per counter. The edge function adds a `total_fixed` sum. `reconcile_stats()` has `EXECUTE` revoked from `anon` and `authenticated` and granted only to `service_role` (migrations [`20260313000000`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations/20260313000000_reconcile_stats_function.sql) and [`20260505120000`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations/20260505120000_security_warnings.sql)). Nothing in the repo schedules or calls it. It is a manual backstop you run when counters drift.

## delete-users

[`delete-users`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/functions/delete-users/index.ts) was a sweep that hard-deleted auth users whose `user_profiles.deleted_at` was more than 30 minutes old. That column was never written and was dropped in [`20260826170100_drop_unused_soft_delete_flags.sql`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations/20260826170100_drop_unused_soft_delete_flags.sql). Account deletion is now synchronous: the `deleteAccount` server action calls the `delete_user_account()` RPC and then `auth.admin.deleteUser` (see [User Settings & Account Management](../../auth-and-accounts/user-settings/)). The function is dead code, would fail on its first query if invoked, and is a candidate for removal.

## Failure Modes & Edge Cases

- `get-user-emails` returns emails in `user_profiles` row order, not request order, and silently drops ids with no profile. `resolveUserEmails` reports `failedUserIds` only when the whole invocation errors, so a partial miss is invisible.
- If `getUserById` returns no user for any id, `data.user.email` throws and the whole batch fails with a 500.
- `get-user-emails` does no authorisation of its own. Any caller that passes the gateway's JWT check, such as any signed-in user's access token, can resolve the email of any user id. Treat it as sensitive if it is ever wired back up.
- All three files are `// @ts-nocheck` and import `@supabase/supabase-js` unpinned from esm.sh, so `pnpm check` does not cover them and a redeploy can pick up a new client version.

## Operational Notes

- The functions need `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, which the Supabase platform injects.
- Local debugging uses `supabase functions serve`. The Deno inspector port and Deno version are set in `supabase/config.toml`.
- Logging is plain `console.*`, visible in the Supabase dashboard function logs. It does not go through LogTape (see [Logging & Observability](../../operations/logging-observability/)).

## Extension Points

Prefer a server action with `createAdminClient` over a new edge function. The app already runs server-side on Cloudflare Workers, so an edge function is only worth it for work that must run outside a request, such as a scheduled job. If you add one, check the service-role key in the handler, as `reconcile-stats` does, instead of relying on `verify_jwt`, and add a `[functions.<name>]` block to `config.toml` so its settings are explicit.

## Related Links

- [API Routes](../api-routes/)
- [Server Actions & Queries](../server-actions-and-queries/)
- [User Settings & Account Management](../../auth-and-accounts/user-settings/)
- [Data Model & Schema](../../architecture/data-model-and-schema/)
