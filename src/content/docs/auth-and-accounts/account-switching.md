---
title: "Account Switching & Active Account"
description: "How Ozeaon lets an authenticated user act as themselves or as an organization they administer, via the oz_active_account cookie and the /api/active-account endpoint."
sidebar:
  order: 2
---

A signed-in user can act either as themselves or as an organization they own or administer. The choice is persisted in the `oz_active_account` cookie and surfaced uniformly across server components, API routes, and client state via `getActiveAccount()` and the `SessionProvider`. The "Switch account" modal and the `useAccountSwitch` hook drive this from the browser.

## Overview

The `ActiveAccount` union type ([`src/types/account.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/types/account.ts)) has two variants:

- `{ type: "user" }` — personal mode, with no extra fields.
- `Pick<organizations, "id" | "slug" | "name"> & { type: "org"; logo_path: string | null }` — org mode. The cookie carries `slug`, `name`, and `logo_path` so that an org rename requires rewriting the cookie.

The cookie name is `oz_active_account`. It is httpOnly, sameSite lax, scoped to `/`, and expires after 30 days. A missing or malformed cookie always falls back to `{ type: "user" }`, so the personal default is safe under all failure modes.

## Architecture

### Server-side Reading and Writing

[`src/utils/data/active-account.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/data/active-account.ts) exports four helpers:

- `getActiveAccount()` — React-cached; reads and JSON-parses the cookie; returns `{ type: "user" }` on any error.
- `setActiveAccount(account)` — writes the cookie with the 30-day options.
- `clearActiveAccount()` — deletes the cookie.
- `getOrgActiveAccount()` — asserts the active account is an org; redirects to `/settings` otherwise. Used in org-mode layouts to guard routes.

`getAuthUser()` in [`src/lib/supabase/queries/auth.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/queries/auth.ts) runs `getActiveAccount()` in parallel with the profile fetch, so every server call that resolves the session also carries the current active account.

### The /api/active-account Endpoint

[`src/app/api/active-account/route.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/active-account/route.ts) is protected by `withAuthUser`. It has two methods:

- **POST** — expects `{ org_id: string }`. Queries `organization_members` to confirm the caller holds an `owner` or `admin` role (checked inline against the `member_roles.slug` column, not via `isOrgManager`). Returns 400 if `org_id` is absent, 403 if the membership is missing or the role is insufficient, 404 if the org row is absent. On success, writes the cookie and returns the new `ActiveAccount` payload.
- **DELETE** — clears the cookie and returns `{ type: "user" }`.

The GET path is superseded by `/api/session`, which returns profile and active account in a single call.

### Client Hook and UI

[`src/hooks/use-account-switch.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/hooks/use-account-switch.ts) wraps the two API calls in `switchToOrg(orgId)` and `switchToUser()`. Both call `setActiveAccount` from the `useActiveAccount` hook after a successful response, keeping the client `SessionProvider` state in sync without a full page reload.

The `AccountSwitcherModal` (nav) and `UserMembershipCard` (org profile page) are the two surfaces that call `useAccountSwitch`. `EditOrganizationButton` uses it to auto-switch to an org before opening the settings form.

The switcher renders org memberships as a promise prop passed through Suspense, so the server can start fetching the org list while the shell renders.

### Authorization Helpers

[`src/utils/data/account.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/data/account.ts) exposes the server-side gate functions that consume the active account:

- `resolveOrgId(supabase, userId, account)` — returns the org id when the user is an owner or admin in org mode, null otherwise. Used to set `organization_id` on new content.
- `canManageProject(supabase, project, userId, activeAccount)` — mirrors the `projects` RLS policies. Personal projects require user mode and ownership; org projects require org mode and an owner/admin role in that org.
- `canManageArticle(supabase, article, userId, activeAccount)` — same pattern for articles.
- `canManagePost(supabase, post, userId, activeAccount)` — posts always carry `user_id` (the creating user) even for org posts, so `organization_id` is what distinguishes an org post.

These helpers exist to return a clean 403 rather than an opaque database error. RLS is the enforced boundary; a drift in the helpers makes an error message wrong, never a permission wrong.

## Failure Modes & Edge Cases

- **Malformed cookie** — `getActiveAccount` catches the JSON parse error and returns `{ type: "user" }`.
- **Stale org cookie** — if the org is deleted or the user loses membership, the cookie still says org mode. The `/api/active-account` POST will return 403 on the next switch attempt; org-only routes call `getOrgActiveAccount`, which redirects to `/settings`.
- **Org rename** — because the cookie carries `slug` and `name`, a rename leaves the cookie stale. The cookie must be refreshed by calling the POST endpoint again. The `EditOrganizationButton` triggers a `switchToOrg` after saving to handle this.
- **Identity switch clears active account** — `signOut` and `deleteAccount` both call `clearActiveAccount` before redirecting.

## Operational Notes

`getActiveAccount` is wrapped in React's `cache()`, so it is called at most once per server render no matter how many components read it. The API route uses `withAuthUser`, which calls `getAuthUser` (also cached), so the session and the active account are resolved together.

Org-only pages redirect to `/settings` when the active account is not org mode. This means a direct URL visit to an org-only route from a personal-mode session lands on `/settings`, not a 404.

## Related Links

- [Auth Flows](../auth-flows/) — session setup, login and signup
- [User Settings & Account Management](../user-settings/) — account deletion and profile settings
- [Organizations](../../organisations/organisations/) — org membership and roles
