---
title: "Founding Member Badges"
description: How the Founding Member (alpha) badge is granted to early users and organisations, when the window closes, and how to change it.
sidebar:
  order: 2
---

Every user and organisation created before the alpha cutoff gets a **Founding Member** badge on its profile. The database grants the badge automatically at insert time. Users can't grant it to themselves, and after the cutoff only a privileged connection can set it.

## The Window

The cutoff is **midnight UTC at the start of 2 December 2026**, defined once in `private.alpha_badge_window_open()`:

```sql
SELECT now() < timestamptz '2026-12-02 00:00:00+00'
```

Both `user_profiles.has_alpha_badge` and `organizations.has_alpha_badge` default to that function. A row created inside the window gets `true`, and a row created after it gets `false`. The value is snapshotted onto each row at insert, so a profile keeps its badge after the window closes.

The window lives in a column default rather than app code because profiles are created from more than one place, including the browser (Google sign-in). An app-side date check there would be duplicated and spoofable. The function sits in the `private` schema so PostgREST can't expose it.

All of this is in [`20260826170000_alpha_badge_window.sql`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations/20260826170000_alpha_badge_window.sql). Accounts and organisations that existed before that migration were backfilled to `true`.

## Self-Grant Protection

The UPDATE policies on both tables don't restrict individual columns. A `BEFORE INSERT OR UPDATE OF has_alpha_badge` trigger, `trg_alpha_badge_guard`, closes that gap. For requests arriving through PostgREST as `anon` or `authenticated`, it:

- forces the value on insert to whatever the window says, and
- keeps the existing value on update, so a client `PATCH` can't add or remove the badge.

`service_role`, migrations and direct database connections bypass the guard, so the badge can be granted deliberately. The guard deliberately fails open for those callers. Tightening it to a `service_role` allowlist would break every migration that touches the column.

## Display

`ProfileDataSlot` and `OrganizationDataSlot` render [`FoundingMemberBadge`](../../components/ui/display/) when `has_alpha_badge` is true. User and organisation badges use different gradient palettes from the `--badge-founding-*` tokens in `globals.css`. The badge is purely visual: nothing in the app checks it for permissions or features today.

## Changing the Window

- **Move the cutoff** by redefining `private.alpha_badge_window_open()` in a new migration. This only affects rows created afterwards.
- **Extend the cutoff retrospectively** with a backfill alongside the new date:

  ```sql
  UPDATE public.user_profiles SET has_alpha_badge = true WHERE created_at < '<new cutoff>';
  UPDATE public.organizations  SET has_alpha_badge = true WHERE created_at < '<new cutoff>';
  ```

- **Grant or revoke one badge** with a `service_role` or direct connection. Client requests can't change it.

:::note[Roadmap]
Planned features use the badge as the key for founding-member entitlements:
- a platform-fee exemption in the Stripe integration
- a 1,000 PRG grant in the Progress ledger
- a private founding-member DAO pod

None of these are built yet.
:::

## Related Links

- [User Profiles & Social Graph](../profiles-and-social-graph/)
- [Organisation Profiles, Membership & Roles](../../organisations/organisations/)
- [Display components](../../components/ui/display/): `FoundingMemberBadge`
- [Database Migrations & Seeding](../../operations/migrations-and-seeding/)
