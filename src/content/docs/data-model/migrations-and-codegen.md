---
title: "Migrations, Schema Generation & Type Sync"
sidebar:
  order: 3
---

How database schema changes flow from SQL migration files into seeded databases, generated TypeScript types, and the deployment pipeline.

## Purpose and Scope

This page documents the schema lifecycle of the `ozeaon-v2` project: how SQL migrations under `supabase/migrations/` are applied, how seed data is loaded on top of them, how the Supabase CLI generates schema documentation and TypeScript types (`pnpm db:gen`), and how those pieces are wired into local development and preview deployments.

It covers:

- The migration/seed configuration in `supabase/config.toml`
- The daily commands used to apply migrations and rebuild the local database
- The seed strategy (preview fixture vs. real dump) and why they differ
- The order-of-operations constraints between migrations, seeds, and generated types
- How preview branches consume migrations and fixtures automatically

Related topics intentionally left to sibling pages: the database schema concept model and table relationships themselves belong to the data-model overview; authentication, RLS policy semantics, and Cloudflare deployment packaging are documented elsewhere.

## Overview

This project treats the database schema as **SQL-first**. There is no ORM migration DSL (no Prisma, Drizzle, or TypeORM migrations in the repository — a glob for `**/{migrations,prisma,drizzle}/**` returns nothing). Instead:

1. Schema changes live as timestamp-prefixed `.sql` files in `supabase/migrations/`.
2. The Supabase CLI tracks which migrations have been applied and applies the rest.
3. Seed files (`supabase/seeds/…`) run **after** migrations, on reset or start.
4. `pnpm db:gen` regenerates the schema documentation and TypeScript types from the live database — that is the "type sync" half of the pipeline.
5. The Supabase GitHub integration replays migrations and the preview fixture for every PR branch.

The key design tension this page explains is the **ordering contract**: seeds run after migrations, and generated types run after the schema exists. Breaking either order produces a subtly broken state — empty pages in previews, or TypeScript that disagrees with the database.

## Architecture

The following diagram shows the real moving parts and the direction of dependency between them.

```mermaid
flowchart TD
    subgraph sg_Source["Schema Source of Truth"]
        Migrations["supabase/migrations/*.sql"]
        FixtureSeed["supabase/seeds/10-preview-fixture.sql"]
        TruncateSeed["supabase/seeds/00-truncate.sql"]
        RealDump["supabase/seed.sql (gitignored)"]
    end

    subgraph sg_Config["Configuration"]
        ConfigToml["supabase/config.toml"]
    end

    subgraph sg_Tooling["Local Tooling"]
        Cli["Supabase CLI"]
        DbGen["pnpm db:gen"]
        SeedDump["pnpm db:seed-dump"]
        ResetReal["pnpm db:reset-real"]
    end

    subgraph sg_DB["Database Instances"]
        LocalPG[("Local Postgres :54322")]
        RemotePG[("Remote Supabase")]
        BranchPG[("Preview Branch DB")]
    end

    subgraph sg_Build["Build Inputs"]
        GeneratedTypes["Generated TypeScript types"]
        Postgres["Next.js / OpenNext build"]
    end

    ConfigToml -->|"schema_paths / sql_paths"| Cli
    Migrations --> Cli
    Cli -->|"migration up / db reset"| LocalPG
    FixtureSeed --> LocalPG
    TruncateSeed --> LocalPG
    RealDump --> LocalPG
    SeedDump -->|"pg dump"| RealDump
    RemotePG --> SeedDump
    ResetReal --> LocalPG
    LocalPG --> DbGen
    DbGen --> GeneratedTypes
    GeneratedTypes --> Postgres
    Migrations -->|"GitHub integration"| BranchPG
    FixtureSeed -->|"GitHub integration"| BranchPG
    BranchPG --> Postgres
```

Two independent database consumers exist: the **local** Postgres instance used for day-to-day development and type generation, and the **preview branch** database created by the Supabase GitHub integration for each PR. Both replay the same migrations, but they seed from different sources — that asymmetry is deliberate and is explained below.

## Migration Configuration

The migration behavior is driven by `supabase/config.toml`. The relevant blocks define the project identity, database version, and the migration/seed paths.

```toml
project_id = "ozeaon-v2"

[db]
# Port to use for the local database URL.
port = 54322
# Port used by db diff command to initialize the shadow database.
shadow_port = 54320
# The database major version to use. This has to be the same as your remote database's.
major_version = 17
```

> Source: [config.toml](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/config.toml#L5-L34)

The `major_version = 17` setting is operationally significant: the comment states it "has to be the same as your remote database's" Postgres version. A mismatch between the local container's major version and the remote project's version is a common source of migration failures that only appear in one environment.

### Migrations block

```toml
[db.migrations]
# If disabled, migrations will be skipped during a db push or reset.
enabled = true
# Specifies an ordered list of schema files that describe your database.
# Supports glob patterns relative to supabase directory: "./schemas/*.sql"
schema_paths = []
```

> Source: [config.toml](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/config.toml#L51-L56)

Design intent: `schema_paths` is empty, meaning the project does **not** use a declarative schema snapshot directory. The ordered SQL files in `supabase/migrations/` are the sole schema authority. This keeps the history append-only and avoids the drift problems that arise when a declarative schema file and a migration history disagree.

### Seed block

```toml
[db.seed]
# If enabled, seeds the database after migrations during a db reset.
enabled = true
# Supports glob patterns relative to supabase directory: "./seeds/*.sql"
#
# Synthetic fixture only. seed.sql (the real-data dump) is gitignored, so the
# Supabase GitHub integration cannot see it and preview branches came up empty.
#
# 00-truncate.sql is deliberately NOT listed: it exists to stop migration-inserted
# rows colliding with that dump, and without the dump it just destroys the
# reference data migrations create (member_roles, sdgs, article_types,
# resource_categories, project_types...), which the fixture depends on.
#
# To load the real dump locally instead:
#   psql "$DB" -f supabase/seeds/00-truncate.sql -f supabase/seed.sql
sql_paths = ["./seeds/10-preview-fixture.sql"]
```

> Source: [config.toml](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/config.toml#L58-L73)

This is the single most important configuration decision on this page, and the inline comments explain the reasoning in the original author's words. Three constraints collapse into one line of config:

1. **Only the synthetic fixture is listed.** `supabase/seed.sql` — the real-data dump — is gitignored, so the Supabase GitHub integration literally cannot read it when creating a preview branch. If the fixture were not committed, preview branches would come up with an empty database.
2. **`00-truncate.sql` is deliberately excluded.** The truncate script exists only to clear migration-inserted rows that would collide with the real dump. Without the dump, running truncate would destroy the reference data that migrations create (`member_roles`, `sdgs`, `article_types`, `resource_categories`, `project_types`, …) — which the fixture itself depends on. So listing it would break previews.
3. **The real dump is loaded manually** via `psql -f supabase/seeds/00-truncate.sql -f supabase/seed.sql`, not through `sql_paths`.

A subtle but important consequence: because `sql_paths` points at the fixture, `supabase db reset` locally produces a **fixture-loaded** database that matches what a preview branch looks like. To get real data locally you must instead run the dedicated `db:reset-real` command, which shells out to `psql`.

## Migration Authoring and Naming

Migrations are plain SQL files named with a 14-digit UTC timestamp prefix and a snake_case description, e.g. `20260430104609_article_images_documents.sql`. The timestamp prefix is what orders them; the Supabase CLI applies any migration whose version has not yet been recorded in the migration history table.

Migration files in this repository are written as **self-documenting SQL**: each begins with a comment describing the intent. For example:

```sql
-- This migration adds the article_images and article_documents tables, removes the affiliation column from article_authors, adds doi field to articles table.
```

> Source: [20260430104609_article_images_documents.sql](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations/20260430104609_article_images_documents.sql#L1-L2)

Migrations also carry their **root-cause reasoning** inline when they fix a previous migration. This pattern is used for grant/RLS corrections:

```sql
-- Root cause: PostgreSQL grants EXECUTE to PUBLIC by default for all functions.
-- The previous migration (20260505120000) revoked only from anon/authenticated,
```

> Source: [20260505130000_fix_public_execute_grants.sql](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations/20260505130000_fix_public_execute_grants.sql#L3-L4)

This matters operationally: because the schema history is append-only, a mistake is fixed by *adding* a forward migration rather than editing the original. The follow-up file records why the correction was needed — including the specific prior migration version it compensates for — so a future reader does not "restore" the broken grant.

## Core Flow: Applying Migrations Locally

The end-to-end local workflow is: dump real data once, reset the database (migrations + seed), then keep applying incremental migrations as you pull.

```mermaid
flowchart TD
    Start([Clone repo]) --> Login["supabase login"]
    Login --> Link["supabase link --project-ref"]
    Link --> StartStack["supabase start"]
    StartStack --> Dump{"Need real data?"}
    Dump -->|"Yes"| SeedDump["pnpm db:seed-dump<br/>remote to supabase/seed.sql"]
    Dump -->|"No"| ResetFixture["supabase db reset<br/>migrations + preview fixture"]
    SeedDump --> Reset["supabase db reset"]
    Reset --> Env["Set .env.local<br/>NEXT_PUBLIC_SUPABASE_URL / KEY"]
    ResetFixture --> Env
    Env --> Gen["pnpm db:gen<br/>regenerate docs + TS types"]
    Gen --> Dev["pnpm dev"]
    Dev --> Pull{"git pull brings new migrations?"}
    Pull -->|"Yes"| MigUp["supabase migration up"]
    Pull -->|"No"| Dev
    MigUp --> Regen["pnpm db:gen"]
    Regen --> Dev
    MigUp -->|"seed/structural conflict"| Reset
```

### Step 1 — Start the local stack

```bash
supabase start
```

First run pulls Docker images. When ready the CLI prints the endpoints that the environment file depends on:

```text
API URL: http://127.0.0.1:54321
DB URL:  postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio:  http://127.0.0.1:54323
```

> Source: [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L36-L48)

These values populate `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[generated_key]
```

> Source: [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L69-L76)

### Step 2 — Dump remote data (optional)

```bash
pnpm db:seed-dump
```

`seed.sql` is gitignored — it contains real user data and must never be committed.

> Source: [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L50-L56)

### Step 3 — Apply migrations and load the seed

Seeds only run on `supabase start` or `supabase db reset`, so any dump must exist *before* this step:

```bash
supabase db reset
```

> Source: [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L58-L64)

> **Important:** This is the one time you want `db reset`. From here on, apply new migrations with `supabase migration up` — it's the safe command for day-to-day use. Only use `db reset` if you've just exported a seed dump and are sure the migrations in your local match those on the remote from which the pg dump originates (or at least that the migrations added in local do not alter data structure that will result in the seed to fail).

> Source: [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L66-L67)

### Day-to-day commands

```bash
supabase start         # start local instance (Docker must be running)
supabase stop          # stop local instance
supabase migration up  # apply new migrations — use this most of the time
supabase db reset      # rebuild local DB
```

> Source: [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L80-L87)

Local Supabase Studio is at `http://127.0.0.1:54323` while running.

## Keeping in Sync When Pulling Code

When you pull code containing migrations, the documented procedure is:

```bash
git pull
supabase migration up
```

> Source: [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L93-L100)

If `migration up` fails, fall back to `supabase db reset`. There is a documented ordering hazard here:

> **Important:** Make sure to keep your seed file up to date with the database structure when rebuilding it with new migrations. The seed takes place **AFTER** all migrations apply. If you know the migrations alter the data structure from what your seed file contains, temporarily delete the migrations that do that, rebuild, restore the tricky migrations and then use `migration up`.

> Source: [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L104-L105)

This workaround exists specifically because `seed.sql` is a **dump that always lags the schema**. The recommended migration-only path (`migration up`) avoids the problem entirely because it never replays the seed.

## Seed Strategy: Fixture vs. Real Dump

Two distinct seed sources exist, and choosing the wrong one for the wrong context is the primary cause of "empty database" symptoms.

| Seed source | Committed? | Loaded by | Contents |
| --- | --- | --- | --- |
| `supabase/seeds/10-preview-fixture.sql` | Yes (in `sql_paths`) | `supabase db reset`, preview branches | Synthetic: 20 accounts, 3 organisations, projects and articles with content, posts, R2 imagery |
| `supabase/seed.sql` | No (gitignored) | `pnpm db:reset-real` only | Real data dump from remote |
| `supabase/seeds/00-truncate.sql` | Yes, but **excluded** from `sql_paths` | Manual `psql` invocation | Clears migration-inserted rows before a real dump load |

Note the login and R2 details of the fixture, which make it usable for manual preview testing:

| | |
| --- | --- |
| Login | `alpha@ozeaon.com` … `tango@ozeaon.com` (20 accounts) — password `ozeaon-preview` |
| Fixture contents | `supabase/seeds/10-preview-fixture.sql` — 20 accounts, 3 organisations, projects and articles with content, posts, R2 imagery |

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L8-L9)

### Why a fixture, not the dump

The rationale is documented verbatim: `supabase/seed.sql` is gitignored, so the GitHub integration cannot read it, and branches seeded to nothing. `seeds/00-truncate.sql` is excluded from `sql_paths` for the same reason — without the dump it only destroys the reference data that migrations create (`member_roles`, `sdgs`, `article_types`).

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L28-L33)

Because the fixture ships **with** migrations in the same repository, it gets updated rather than worked around. The `deployment-previews.md` notes this is explicitly not the `supabase-local.md` workaround: "Removing a migration, reseeding, then reapplying it exists because `seed.sql` is a dump that always lags the schema. The fixture ships with migrations, so it gets updated rather than worked around."

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L46-L48)

### Local reset variants

```bash
supabase db reset      # fixture, matches previews
pnpm db:reset-real     # truncate + supabase/seed.sql
```

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L50-L55)

`db:reset-real` shells out to `psql` and `jq`, and **stops if the local stack is not running** rather than letting `psql` fall through to whatever server is listening on the default port. That guard prevents accidentally truncating and rewriting a non-local database.

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L57-L58)

## Schema Generation and Type Sync

`pnpm db:gen` is the code-generation entry point. It regenerates two artifacts from the live database:

| Command | Description |
| --- | --- |
| `pnpm db:gen` | Generate Supabase DB schema types (run after migrations) |
| `pnpm db:seed-dump` | Dump remote data to `supabase/seed.sql` |
| `pnpm typegen` | Generate Next.js route types + Cloudflare env types |

> Source: [CLAUDE.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/CLAUDE.md#L71-L73)

The README describes the same command as generating "DB schema docs + TypeScript types":

| Command | Description |
| --- | --- |
| `pnpm db:gen` | 🗄️ Generate DB schema docs + TypeScript types |
| `pnpm db:seed-dump` | 🌱 Dump remote data to `supabase/seed.sql` |

> Source: [README.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/README.md#L251-L252)

So `db:gen` has two outputs — human-readable schema documentation and the TypeScript types consumed by the application. This is the "type sync" step: the TypeScript database types are **generated from the actual database**, not hand-written, which is why the documented usage is "run after migrations."

### Why order matters

The generation step reads a live database, so the database must already reflect the latest schema. Combined with the seed ordering rule, the full invariant chain is:

```mermaid
flowchart LR
    A["Write .sql migration"] --> B["supabase migration up / db reset"]
    B --> C["Schema exists in Postgres"]
    C --> D["Seeds run after migrations"]
    C --> E["pnpm db:gen reads live schema"]
    E --> F["Generated TS types match DB"]
    F --> G["pnpm check / tsc --noEmit passes"]
```

If generation runs before the migration is applied, the generated types describe the *old* schema and TypeScript will report errors against code that correctly uses the new columns.

### Type consistency enforcement

The project enforces agreement between the database, the schemas, and the UI props. The project guidance states: verify every fix resolves the exact error and "check field names match between Zod schemas, DB types, and props (e.g. `author_name` vs `display_name`)".

> Source: [CLAUDE.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/CLAUDE.md#L40-L40)

There is also an automated gate — an auto-validation hook that, on stop, runs an incremental `tsc --noEmit` over edited `.ts`/`.tsx` files and blocks completion if errors remain:

```text
- **Auto-validation hook**: On Stop, if any `.ts`/`.tsx` files were edited this turn, runs incremental `tsc --noEmit` and **blocks completion** if errors remain, forcing a fix loop. No need to run tsc manually.
```

> Source: [CLAUDE.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/CLAUDE.md#L42-L42)

This is the practical enforcement mechanism for type sync: drifted generated types surface as `tsc` errors that cannot be dismissed. The manual check command is:

```bash
pnpm check    # tsc --noEmit
```

> Source: [CLAUDE.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/CLAUDE.md#L69-L69)

## Preview Branch Migration Flow

Every PR into `main` gets its own Worker and its own database. The Supabase GitHub integration handles migrations and seeding for the branch.

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub PR
    participant Supabase as Supabase Branching
    participant WF as preview.yml
    participant Worker as Cloudflare Worker

    Dev->>GH: Open PR into main
    GH->>Supabase: Create branch
    Supabase->>Supabase: Run migrations from supabase/migrations
    Supabase->>Supabase: Seed 10-preview-fixture.sql
    WF->>Supabase: Wait for branch, read credentials
    Supabase-->>WF: Branch URL + keys
    WF->>WF: Build with credentials inlined
    WF->>Worker: Deploy pr-N-app-ozeaon
    WF->>GH: Comment preview URL
    Dev->>GH: Close or merge PR
    GH->>Worker: preview-teardown.yml deletes Worker
    GH->>Supabase: Delete branch
```

The documented flow, step by step:

1. PR opens — Supabase creates a branch, runs migrations, seeds `supabase/seeds/10-preview-fixture.sql`
2. `preview.yml` waits for the branch, reads its credentials, builds with them inlined
3. Deploys `pr-<N>-app-ozeaon` and comments the URL
4. PR closes — `preview-teardown.yml` deletes the Worker; Supabase deletes the branch

Roughly 7 minutes end to end.

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L11-L18)

| Resource | Value |
| --- | --- |
| URL | `https://pr-<N>-app-ozeaon.joseph-400.workers.dev` |
| Lifetime | created on open, destroyed on close or merge |

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L5-L9)

### Failures when a PR contains a migration

> Seeds run after migrations, so a migration that drops or renames something the fixture writes to leaves the branch empty. Credentials still resolve and the build still succeeds, so the only symptom would be empty pages — `preview.yml` asserts a few tables are non-empty and fails instead.

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L35-L39)

The mitigation table:

| Situation | What to do |
| --- | --- |
| Fixture needs updating for your migration | Update `seeds/10-preview-fixture.sql` in the same PR |
| You want a preview before fixing it | Label `preview:allow-empty-db` — the check warns and deploys anyway |

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L41-L44)

This is the preview-side analogue of the `seed.sql`-lags-schema problem: because seeds run after migrations, any structural change that invalidates the seed data breaks the branch. The difference is that here the fix is to update the committed fixture, since it *is* version-controlled.

### Deployment previews affected by storage config

Because the fixture references R2 imagery, storage configuration matters for previews:

- `wrangler.jsonc` → `env.preview` sets `workers_dev: true`, staging R2, and self-ref to staging.
- R2 is **shared with staging**, and uploads persist after teardown.
- Branch limit is 10; cost is roughly $0.013 per branch-hour.

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L60-L85)

## Configuration Reference

| Setting | File | Value | Purpose |
| --- | --- | --- | --- |
| `project_id` | `supabase/config.toml` | `"ozeaon-v2"` | Distinguishes the Supabase project locally |
| `db.port` | `supabase/config.toml` | `54322` | Local Postgres port |
| `db.shadow_port` | `supabase/config.toml` | `54320` | Shadow DB for `db diff` |
| `db.major_version` | `supabase/config.toml` | `17` | Must match the remote database's Postgres major version |
| `db.migrations.enabled` | `supabase/config.toml` | `true` | Migrations run on `db push` / `db reset` |
| `db.migrations.schema_paths` | `supabase/config.toml` | `[]` | No declarative schema snapshot; migrations are authoritative |
| `db.seed.enabled` | `supabase/config.toml` | `true` | Seed after migrations during reset |
| `db.seed.sql_paths` | `supabase/config.toml` | `["./seeds/10-preview-fixture.sql"]` | Only the synthetic fixture is auto-applied |
| `api.schemas` | `supabase/config.toml` | `["public", "graphql_public"]` | Schemas exposed through the API |
| `api.max_rows` | `supabase/config.toml` | `1000` | Payload size limit for API responses |

All values above are read from `supabase/config.toml`. Seed path and API settings are at `supabase/config.toml#L7-L18` and `#L58-L73`; database settings are at `supabase/config.toml#L27-L56`.

> Source: [config.toml](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/config.toml#L1-L73)

## API / Command Reference

### `pnpm db:gen`

Generate Supabase DB schema types and schema documentation. **Must run after migrations have been applied**, because it reads the live database schema.

- **Prereq:** local Supabase stack running with migrations applied
- **Consumer:** TypeScript code in `apps`/`src` that types against database tables
- **See:** [CLAUDE.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/CLAUDE.md#L72-L72), [README.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/README.md#L251-L251)

### `pnpm db:seed-dump`

Dump remote data into `supabase/seed.sql`. Output is gitignored.

- **See:** [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L50-L56)

### `pnpm db:reset-real`

Rebuild the local database using `00-truncate.sql` plus `supabase/seed.sql` instead of the preview fixture. Shells out to `psql` and `jq`; refuses to run if the local stack is not up.

- **See:** [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L52-L58)

### `pnpm typegen`

Generate Next.js route types plus Cloudflare environment types. Distinct from `db:gen` — covers routing and Workers env, not database tables.

- **See:** [CLAUDE.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/CLAUDE.md#L71-L71)

### `supabase migration up`

Apply pending migrations without rebuilding the database or replaying seeds. The recommended day-to-day command.

- **See:** [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L85-L85)

### `supabase db reset`

Drop, recreate, replay all migrations, then run seed files from `sql_paths`. Use sparingly.

- **See:** [supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md#L63-L67)

## Failure Modes and Edge Cases

| Failure | Root cause | Symptom | Resolution |
| --- | --- | --- | --- |
| Preview branch comes up empty | `seed.sql` is gitignored and invisible to the GitHub integration | Empty pages; `preview.yml` assertion fails | Fixture is committed and used instead; update `10-preview-fixture.sql` in the same PR as the migration |
| Migration drops/renames fixture-referenced data | Seeds run **after** migrations | Build succeeds but pages are empty | Update the fixture; or label `preview:allow-empty-db` to deploy with a warning |
| `migration up` fails after `git pull` | Local DB is behind in a way that conflicts | CLI error mid-migration | Fall back to `supabase db reset` |
| Seed fails on `db reset` after a structural migration | `seed.sql` dump lags the schema | Reset errors while loading the dump | Temporarily remove the conflicting migration, rebuild, restore it, then `migration up` (the `supabase-local.md` workaround) |
| Type errors after a schema change | `db:gen` not re-run | `tsc --noEmit` errors referencing stale table types | Re-run `pnpm db:gen`, then `pnpm check` |
| Local/remote Postgres version mismatch | `db.major_version` differs from remote | Migration behavior diverges between environments | Align `major_version` (default `17`) with remote `SHOW server_version;` |
| `db:reset-real` appears to hang or hit the wrong DB | Local stack not running, `psql` falls through to default port | Potential destructive writes to an unintended server | The command refuses to run unless the local stack is up |

### Concurrency and state notes

- **Seed runs exactly once per reset/start.** Editing the fixture requires recreating the database (or the branch). Per `deployment-previews.md`: "Seeds run at branch **creation**. Editing the fixture needs the branch recreated — close and reopen the PR."
- **Preview branches are ephemeral and capped at 10.** Exceeding the limit blocks new previews.
- **R2 storage is shared with staging and survives teardown**, so uploads made from a preview persist after the branch is deleted.
- **Migrations are append-only.** A fix is a new forward migration with the rationale in comments, as in `20260505130000_fix_public_execute_grants.sql`, not an edit of the original file.

> Source: [deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md#L79-L85)

## Related Links

- Local setup walkthrough: [docs/supabase-local.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/supabase-local.md)
- Preview deployment pipeline: [docs/deployment-previews.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/deployment-previews.md)
- Supabase project configuration: [supabase/config.toml](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/config.toml)
- Command reference: [CLAUDE.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/CLAUDE.md#L61-L79), [README.md](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/README.md#L246-L252)
- Example structural migration: [20260430104609_article_images_documents.sql](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations/20260430104609_article_images_documents.sql)
- Example corrective migration: [20260505130000_fix_public_execute_grants.sql](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations/20260505130000_fix_public_execute_grants.sql)
