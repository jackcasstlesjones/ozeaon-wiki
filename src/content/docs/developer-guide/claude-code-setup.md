---
title: "Claude Code Setup"
description: "The Claude Code configuration that ships with ozeaon-v2: CLAUDE.md, the type-check hook, the project skills and the config agent."
sidebar:
  order: 3
---

The ozeaon-v2 repository ships a shared Claude Code configuration, so every developer who clones it gets the same project instructions, hook, skills and agent. This page covers what each piece does, how to invoke it, and what you have to set up yourself. For the conventions the configuration encodes, see [Conventions & Linting](../conventions-and-linting/) and [Adding a Feature End-to-End](../adding-a-feature/).

## Overview

| File | Kind | Purpose |
| --- | --- | --- |
| [`CLAUDE.md`](https://github.com/ozeaon/ozeaon-v2/blob/eb7b75a5ce9802b7848f614195586fadda822f0b/CLAUDE.md) | Project memory | Loaded into every session. Stack, rules, client patterns and pointers into `docs/` |
| [`.claude/settings.json`](https://github.com/ozeaon/ozeaon-v2/blob/eb7b75a5ce9802b7848f614195586fadda822f0b/.claude/settings.json) | Settings | One `PostToolUse` hook that type-checks after edits |
| [`.claude/skills/oz-review/`](https://github.com/ozeaon/ozeaon-v2/blob/eb7b75a5ce9802b7848f614195586fadda822f0b/.claude/skills/oz-review/SKILL.md) | Skill | Structured, ticket-aware code review of the current branch against `main` |
| [`.claude/skills/db-trigger/`](https://github.com/ozeaon/ozeaon-v2/blob/eb7b75a5ce9802b7848f614195586fadda822f0b/.claude/skills/db-trigger/SKILL.md) | Skill | The project's security convention for PostgreSQL trigger functions and migrations |
| [`.claude/skills/zod4/`](https://github.com/ozeaon/ozeaon-v2/blob/eb7b75a5ce9802b7848f614195586fadda822f0b/.claude/skills/zod4/SKILL.md) | Skill | Zod 4 syntax reference, so schemas avoid deprecated Zod 3 APIs |
| [`.claude/skills/logtape/`](https://github.com/ozeaon/ozeaon-v2/blob/eb7b75a5ce9802b7848f614195586fadda822f0b/.claude/skills/logtape/SKILL.md) | Skill | LogTape usage reference: loggers, structured messages, context, redaction |
| [`.claude/skills/analyze/`](https://github.com/ozeaon/ozeaon-v2/blob/eb7b75a5ce9802b7848f614195586fadda822f0b/.claude/skills/analyze/SKILL.md) | Skill | Read-only analysis that writes a severity-ranked report and fix plan |
| [`.claude/agents/claude-config-docs.md`](https://github.com/ozeaon/ozeaon-v2/blob/eb7b75a5ce9802b7848f614195586fadda822f0b/.claude/agents/claude-config-docs.md) | Subagent | Generic helper for writing Claude Code configuration |

## How the pieces load

```mermaid
flowchart TD
    Start["Session starts in ozeaon-v2"] --> Memory["CLAUDE.md loaded into context"]
    Memory --> Prompt["Developer prompt"]
    Prompt -->|"/oz-review, /db-trigger, ..."| Skill["Skill instructions loaded"]
    Prompt -->|"request matches a skill description"| Skill
    Skill --> Work["Claude reads and edits code"]
    Prompt --> Work
    Work -->|"Write or Edit tool"| Hook["PostToolUse hook: npx tsc --noEmit (async)"]
```

`CLAUDE.md` is always in context. Skills load on demand, either when you type their name as a slash command or when Claude decides a request matches the skill's `description`. CLAUDE.md also tells Claude to reach for a skill in specific cases, for example "invoke the `db-trigger` skill" before writing any trigger.

## CLAUDE.md

The project instructions are deliberately short and point into `docs/` for the full detail, so the two don't drift apart. Its sections:

| Section | What it tells Claude |
| --- | --- |
| Project Overview | SSR constraints, the planned `cacheComponents` move, and the ban on old route segment config (`export const dynamic`, `revalidate`, `fetchCache`, `runtime`). Read the bundled Next.js docs in `node_modules/next/dist/docs/` before touching routes, caching or Supabase-in-SSR code |
| Workflow Rules | Diagnose the root cause before editing. Analysis first when asked to understand, analyse or review. Parallel agents for changes spanning 4+ files |
| TypeScript | Verify each fix resolves the exact error, check field names across Zod, DB types and props, and always await promises |
| Technology Stack & Versions | Breaking changes that matter: async `cookies()`/`headers()`, Zod 4, Tailwind v4 config, pnpm only |
| Commands Reference | The `pnpm` scripts (`dev`, `check`, `lint`, `db:gen`, `ci:deploy`, ...) |
| Supabase Client Patterns | Which client to import where, and never calling `createClient()` after `getAuthUser()` or inside a `withAuthUser` handler. See [Supabase Client Patterns](../../architecture/supabase-client-patterns/) |
| R2 Storage Patterns | Always go through `StorageAdapter`. Points to `docs/r2-storage.md` |
| API & Server Action Patterns | Status codes, `TablesInsert<>`, ownership checks on mutations, `revalidateTag` after writes |
| Import Conventions | Barrel imports and domain `cards/` subdirectories |
| Type System | Derive from generated types, never hand-roll them. Domain types live in `src/types/` |
| Component Library | The primitives most often reinvented (`EmptyState`, `GridLayout`, `Button` icon props, `ConfirmDialog`). Points to `docs/component-library.md` |
| Typography & Color System | No raw Tailwind size or colour utilities. Points to `docs/design-system.md` |
| Database Schema / Triggers | Core tables, `docs/db/schema.sql`, and side effects as triggers written with the `db-trigger` skill |
| Deployment | Always pass `--env` to `ci:deploy`, plus the per-PR preview fixture rule |

### The Next.js agent-rules block

The block between `<!-- BEGIN:nextjs-agent-rules -->` and `<!-- END:nextjs-agent-rules -->` at the bottom is written by `next dev`, not by hand. If you delete it, it reappears as an uncommitted change the next time the dev server starts. Leave it committed.

