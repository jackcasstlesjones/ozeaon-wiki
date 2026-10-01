---
title: "User Settings & Account Management"
description: "How authenticated users edit their public profile, change email or password, and permanently delete their account."
sidebar:
  order: 3
---

The `/settings` page is the single surface for an authenticated user's personal account operations: editing public profile fields (display name, bio, links, avatar), changing their email or password, and deleting their account. Settings are split across `user_profiles`, `user_links`, and `user_settings` tables, but the user-facing operations all run through server actions.

## Overview

The `ProfileSettings` client component ([`src/components/account/ProfileSettings.tsx`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/account/ProfileSettings.tsx)) renders the main form and mounts the account dialogs. The settings page itself ([`src/app/(main)/(dashboard)/settings/page.tsx`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/(main)/(dashboard)/settings/page.tsx)) calls `getAuthUserOrRedirect()` so anonymous visitors are redirected to `/login`.

Three separate concern areas are handled by different actions:

| Operation | Action | Location |
|---|---|---|
| Profile fields and links | `updateProfileSettings` | `account/actions.ts` |
| Email change (two-step OTP) | `initiateEmailChange` / `verifyEmailChange` | `settings/actions.ts` |
| Password change | `changePassword` | `settings/actions.ts` |
| Account deletion | `deleteAccount` | `lib/supabase/actions.ts` |

## Architecture

### Profile Settings Form

`updateProfileSettings` ([`src/app/(main)/(feed)/(private)/account/actions.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/(main)/(feed)/(private)/account/actions.ts)) validates input against `profileSettingsSchema` (Zod), runs the bio through the moderation gate (`moderateField`), upserts `user_profiles`, then reconciles `user_links` by deleting stale rows and upserting the current list. The moderation gate runs before any database writes; a rejection returns the flagged categories so the UI can display them.

The link reconciliation deletes all `user_links` rows that are not in the submitted `id` set before upserting, which means an empty submission clears all links. New links have no `id` and get a generated one on insert.

### Email Change

Email change is a two-step OTP flow handled in [`src/app/(main)/(dashboard)/settings/actions.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/(main)/(dashboard)/settings/actions.ts):

1. `initiateEmailChange(newEmail)` — calls `supabase.auth.updateUser({ email })`, which triggers Supabase to send an OTP to the new address.
2. `verifyEmailChange(newEmail, token)` — calls `supabase.auth.verifyOtp` with type `email_change`. After verification it checks that `data.user.email` actually moved to the new address — under Supabase's `double_confirm_changes` setting the OTP can be accepted without the change taking effect until a second confirmation arrives in the old mailbox. If the address hasn't moved, `verifyEmailChange` returns an explanatory error instead of a false success. On a confirmed change, a security notice email is sent to the previous address.

### Password Change

`changePassword(currentPassword, newPassword)` re-authenticates with `signInWithPassword` to verify the current password before calling `supabase.auth.updateUser`. If the current password is wrong it returns a `"current_password_incorrect"` code for the UI to handle. On success it calls `supabase.auth.signOut({ scope: "others" })` to invalidate other active sessions.

### Privacy Settings (Roadmap)

The `user_settings` table has `privacy` and `public_profile` columns. Only the profile layout at [`src/app/(main)/(profile)/profiles/[username]/layout.tsx`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/(main)/(profile)/profiles/[username]/layout.tsx) reads these — it filters the query to profiles where `public_profile = true` and `privacy = "public"`. The `/api/user-settings` route exists but has no UI callers. A settings UI for privacy is planned and not yet built.

## Account Deletion

Account deletion is fully built. `deleteAccount` in [`src/lib/supabase/actions.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/actions.ts) runs in this order:

1. Calls the `delete_user_account` RPC, which soft-deletes all owned content and returns the R2 storage keys to purge. This is the only fatal step — if it fails, the account is still intact.
2. Calls `adminClient.auth.admin.deleteUser` to remove the `auth.users` row. Failure here is logged but not surfaced — the content rows are already gone, so the account is effectively inaccessible, but a stray `auth.users` row may remain for manual cleanup.
3. Calls `StorageAdapter.deleteFiles` for the returned R2 keys. Failure is logged but does not block.
4. Sends a deletion confirmation email to the account's address.
5. Signs out locally and calls `clearActiveAccount`, then redirects to `/`.

`ProfileSettings` receives `isOrgOwner` as a prop. When it is true, the delete button opens an extra dialog step informing the user that their organisations will be affected.

## Failure Modes & Edge Cases

- **Moderation rejection on bio** — `updateProfileSettings` returns both an `error` string and `moderationCategories` so the form can surface the specific category.
- **Double confirm changes on email** — `verifyEmailChange` detects when the change hasn't taken effect and returns an error asking the user to check the previous mailbox.
- **R2 purge failure on deletion** — the deletion proceeds; the unpurged keys are logged with the user id for a manual sweep.
- **Admin delete failure on deletion** — also non-fatal to the user flow but logged; the `auth.users` row remains without a profile.

## Operational Notes

All three `settings/actions.ts` actions use `createActionClient` so session cookies are correctly rotated after password operations. `updateProfileSettings` uses `getAuthUser` (not `getAuthUserOrRedirect`) so it can return a typed error for the unauthenticated case rather than redirecting — the action is always called from within an authenticated layout anyway.

`revalidatePath("/settings")` is called after a profile update. If the username changed, the profile route is also revalidated: `revalidatePath("/profiles/[username]", "layout")`.

## Related Links

- [Auth Flows](../auth-flows/) — login, signup, and password reset
- [Account Switching & Active Account](../account-switching/) — org mode and the active account cookie
- [Moderation](../../moderation/moderation/) — how bio moderation works
