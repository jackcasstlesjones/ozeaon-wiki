---
title: "Technology Stack & Scripts"
description: What OZEAON V2 is built with, why the build is set up the way it is, and what the pnpm scripts are for.
sidebar:
  order: 3
---

OZEAON V2 is a single Next.js App Router application in TypeScript, deployed to Cloudflare Workers through OpenNext and backed by Supabase. Exact versions live in [`package.json`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/package.json). This page covers the choices that matter when you work in the code.

## Overview

| Concern | Libraries |
| --- | --- |
| Framework | Next.js (App Router, React Server Components), React 19 |
| Runtime and deploy | Cloudflare Workers via `@opennextjs/cloudflare` and Wrangler |
| Data and auth | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| Styling and UI | Tailwind CSS v4 (PostCSS plugin), Radix UI via vendored shadcn/ui, `lucide-react`, `sonner`, `vaul`, `cmdk` |
| Forms and validation | React Hook Form, Zod v4, `validator` |
| Rich text | Tiptap |
| Media | `react-pdf`/`pdfjs-dist`, `browser-image-compression`, `react-image-crop` |
| Content safety | `xss` (sanitizing HTML), `obscenity` (profanity) |
| Logging | LogTape with `@logtape/redaction` |
| Toolchain | pnpm (enforced), TypeScript in strict mode, ESLint flat config, Prettier, Husky |

The toolchain is pinned: `packageManager` fixes the pnpm version, and `devEngines.runtime` fixes Node with `onFail: "download"`. Local, CI and Cloudflare builds all run the same versions.

## Build Configuration

Most of the build configuration lives in [`next.config.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/next.config.ts). The decisions worth knowing:

- **Next.js is pinned to an exact version**, and so is `eslint-config-next`. Minor Next releases change build output, and OpenNext has to stay compatible with it.
- **`cacheComponents` is off.** The Supabase client a route uses decides whether it renders dynamically (see [SSR, Rendering Model & Caching](../../architecture/ssr-rendering-and-caching/)).
- **Images use a custom loader** (`src/lib/image-loader.ts`). The built-in Next optimizer needs Node and a filesystem, and Workers provides neither. See [Media, Images & Attachments](../../features/media-and-images/).
- **The CSP is built from environment URLs, not `NODE_ENV`.** `pnpm preview` and `ci:build` emit production headers while still pointing at a local Supabase. Both R2 storage hosts are always allowed, because stored content keeps absolute URLs from whichever environment uploaded it. Security headers are skipped in development.
- **`typedRoutes` is on**, so `href`s are type-checked.
- **`pdfjs-dist` is in `serverExternalPackages`** so its worker loading works on the server.
- **Cloudflare dev bindings only initialise under `next dev`.** Otherwise `typegen`, `build` and other CLI commands stall.
- **OpenNext caching is not enabled yet.** The R2 incremental cache, D1 tag cache and DO queue in [`open-next.config.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/open-next.config.ts) are commented out, so caching follows OpenNext defaults.

TypeScript runs in strict mode with a single `@/*` → `src/*` alias ([`tsconfig.json`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/tsconfig.json)). `typescript` and `@typescript/native` are npm aliases to the TypeScript 6 and native (Go) compilers. That is why Next is told not to shell out to the TypeScript CLI.

Linting composes per-concern rule files (`eslint.rules.{base,import,auth,cache,logging}.mjs`) in `eslint.config.mjs`. See [Coding Conventions & Linting Rules](../../developer-guide/conventions-and-linting/).

## Scripts

Script definitions are in the `scripts` block of [`package.json`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/package.json). The ones you will use:

| Script | Use it to |
| --- | --- |
| `pnpm dev` | Run the dev server on localhost:3000 |
| `pnpm check` | Type-check (`tsc --noEmit`) |
| `pnpm lint` / `lint:fix` | Run ESLint |
| `pnpm format` / `format:check` | Run Prettier over `src` |
| `pnpm typegen` | Regenerate Next route types and the `CloudflareEnv` binding types (`cloudflare-env.d.ts`) after changing `wrangler.jsonc` |
| `pnpm db:gen` | Regenerate `docs/db/schema.sql` and `src/types/supabase.ts` after a migration |
| `pnpm db:reset-real` | Reset the local DB and load the real data dump instead of the preview fixture |
| `pnpm db:seed-dump` | Dump remote data to `supabase/seed.sql` |
| `pnpm preview` | Build the Worker bundle and serve it locally with real Worker semantics |
| `pnpm ci:build` / `ci:deploy` | Build and deploy the Worker. CI runs this as `pnpm ci:deploy --env staging` or `--env production`. Never deploy from a laptop |
| `pnpm clean-cache` | Clear `.next`, `.open-next`, `.wrangler` and the other tool caches when builds misbehave |

`pnpm build` is a plain `next build`. It is **not** the Worker build. Use `ci:build` or `preview` to check what actually ships.

## Failure Modes & Edge Cases

- **Preview breaks against local Supabase if the CSP is derived from `NODE_ENV`.** Keep it derived from `NEXT_PUBLIC_SUPABASE_URL`.
- **`db:reset-real` stops on the first error.** It fails if `DB_URL` can't be read and on the first SQL error, so you never get a half-seeded database.
- **Stale `.open-next` or `.wrangler` state after switching environments:** run `pnpm clean-cache`.

## Related Links

- [Getting Started & Local Setup](../getting-started/)
- [Cloudflare Deployment (OpenNext & Wrangler)](../../operations/cloudflare-deployment/)
- [Database Migrations & Seeding](../../operations/migrations-and-seeding/)
- [`package.json`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/package.json), [`next.config.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/next.config.ts), [`tsconfig.json`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/tsconfig.json), [`eslint.config.mjs`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/eslint.config.mjs)
