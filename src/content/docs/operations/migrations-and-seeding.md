---
title: "Database Migrations & Seeding"
description: How the Supabase schema evolves through append-only SQL migrations, and how local and preview databases get their data.
sidebar:
  order: 4
---

The schema is defined only by the ordered, append-only SQL files in [`supabase/migrations/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations). There is no ORM and no declarative schema. Migrations own structure and reference data, and seeds own content data. The rules are configured in the `[db.migrations]` and `[db.seed]` blocks of [`supabase/config.toml`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/config.toml).

## Overview

- **Migration-first.** `schema_paths` is deliberately empty. Every change arrives as a timestamped `YYYYMMDDHHMMSS_description.sql` file, applied in lexicographic order. Related migrations in one batch get manually spaced timestamps (`…000000`, `…000001`) so their order is deterministic.
- **Applied migrations are immutable.** Fixes are new corrective migrations, never edits to old files. For example, the May 2026 security wave corrected its own first attempt one migration later, and the August deletion cascades had four same-day follow-ups.
- **Reference data lives in migrations.** Lookup tables (`member_roles`, `sdgs`, `article_types`, `resource_categories`, `project_types`, …) are created and populated inside migrations, so every environment has them.
- **Triggers follow the `db-trigger` conventions:** `SECURITY DEFINER` only where needed, a pinned `search_path`, and revoked default grants. [`CLAUDE.md`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/CLAUDE.md) points authors to the `db-trigger` skill rather than hand-writing these.

## Migration History

The history falls into a few eras. Read the files themselves for detail. The headers of the larger migrations explain their reasoning at length and are worth reading before touching the same area.

| Era | What changed |
| --- | --- |
| Feb–Apr 2026: foundation | Remote-schema import, the `ozeaondb_v2` tables and RLS, lookup seeding, the article schema, project child tables, and the first `fix_*` hardening pair. See [Data Model & Database Schema](../../architecture/data-model-and-schema/). |
| Late Apr–May: organisations | The org MVP schema, the per-operation permissions matrix, in-app (non-email) invites, and member triggers |
| May: security wave | Linter clean-up, `REVOKE … FROM PUBLIC`, dropping `pg_graphql`, and moving RLS helpers into a `private` schema |
| May–Jul: content plumbing | `article_images`/`article_documents` replacing `article_attachments`, `ON DELETE SET NULL` image FKs, engagement scores and profile fields |
| Aug: ownership & deletion | Explicit project and article ownership (`owner_id` XOR `organization_id`), shared `private` RLS helpers, comment soft-delete and two-level nesting, the account and org deletion cascades with `delete_user_account()`/`delete_organization()`, the moderation log and the alpha badge |
| Sep: notifications | The new `notifications` table, trigger-only delivery and narrowed grants. See [Notifications](../../community/notifications/). |

:::caution[Schema for unbuilt features]
Several migrations create objects for features that aren't built yet. Don't read their presence as a working feature:

- `open_calls` and `organization_blocked_users` (orgs MVP): Open Calls is planned.
- `transfer_org_ownership()`: the RPC exists, but no UI or API calls it. Org ownership transfer is planned.
- `is_featured` on the educational resource tables: Educational Resources and Featured are planned.
- `are_connected`/`is_blocked_pair` and the blocked-users veto in the project policies: the connections and blocking UI is disconnected (planned: Connections & blocking).
- The July 2026 "default verified" stopgap was reversed a week later. Org verification is planned.
:::

## Seeding

`supabase db reset` applies every migration, then seeds from `sql_paths`. That list contains only the committed synthetic fixture, [`supabase/seeds/10-preview-fixture.sql`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/seeds/10-preview-fixture.sql). The reasoning, from the `config.toml` comments:

- `supabase/seed.sql` is the real-data dump (`pnpm db:seed-dump`). It is gitignored, so the Supabase GitHub integration can't see it, and preview branches used to come up empty. The fixture gives every preview branch usable content.
- `seeds/00-truncate.sql` is deliberately **not** in `sql_paths`. It exists only to clear migration-inserted rows that would collide with the real dump. Without the dump, it would delete the reference data the fixture depends on.

To work against real data locally, run `pnpm db:reset-real`. It resets, then applies `00-truncate.sql` and `seed.sql` with `psql -v ON_ERROR_STOP=1`. It needs `jq` and `psql` on your `PATH`.

## Failure Modes & Edge Cases

- **A migration changes what the fixture writes:** update `10-preview-fixture.sql` in the same PR, or preview deployments break.
- **Editing an applied migration:** environments that already ran it won't re-run it and silently diverge. Always append a corrective migration.
- **Adding `00-truncate.sql` to `sql_paths`:** every reset then loses its reference data and the fixture fails on foreign keys.
- **Revoking from `anon`/`authenticated` alone is a no-op** while Postgres' default `PUBLIC` EXECUTE grant stands. Revoke from `PUBLIC`, as the May security wave learned.
- **Supabase default privileges can widen column-level grants.** The notifications grant fix had to revoke defaults first.

## Operational Notes

- After any migration, run `pnpm db:gen` to regenerate `docs/db/schema.sql` and `src/types/supabase.ts`, and commit both. See [Type System & Generated Types](../../architecture/type-system/).
- Every PR gets its own Supabase branch seeded from the fixture. See [CI/CD Workflows](../ci-cd-workflows/).

## Extension Points

- **Schema change:** add a new timestamped file to `supabase/migrations/`. Never edit an applied one.
- **Committable seed content:** add a numerically prefixed file under `supabase/seeds/` and list it in `[db.seed].sql_paths`. Files apply in list order.
- **Local-only data:** keep it in the gitignored `seed.sql` and out of `sql_paths`.

## Related Links

- [`supabase/migrations/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations), [`supabase/config.toml`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/config.toml), [`supabase/seeds/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/seeds)
- [Data Model & Database Schema](../../architecture/data-model-and-schema/)
- [Getting Started & Local Setup](../../overview/getting-started/)
