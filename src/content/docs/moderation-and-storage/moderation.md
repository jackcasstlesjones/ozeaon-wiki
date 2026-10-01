---
title: "Moderation"
description: "OpenAI omni-moderation-latest runs at publish time and upload time; the gate is fail-closed and every attempt is logged to Supabase."
sidebar:
  order: 1
---

Content moderation runs synchronously before any publish-time write succeeds. The OpenAI `omni-moderation-latest` model checks text fields and images via [`src/lib/moderation/`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/moderation). Every attempt — pass, reject or failure — is logged to the `moderation_attempts` table in Supabase, with typed link tables connecting an attempt to its target content.

## Overview

The moderation system has two entry points:

| Function | Input shape | Used by |
|---|---|---|
| `moderateField(field, text)` | Single field + text | Profile bio action |
| `moderateAndLog(...)` | Multiple fields + optional image, writes the DB log | All API route publish paths |

`moderateAndLog` is the primary gate. It calls `moderateSubmission` to run all field and image checks, then writes the `moderation_attempts` log row. On a rejection it returns HTTP 422 with per-field category data. On a moderation service error it logs the failure and returns HTTP 503 — the gate is **fail-closed**: content does not go through if moderation cannot complete.

## Architecture

### Two Calling Shapes

`moderateSubmission` accepts either plain text inputs (batched as a single array call to the OpenAI endpoint) or an image (converted to a base64 data URL and sent as an image part). Both paths use the same retry loop and produce the same `ModerationCheck` shape.

The retry condition: transient upstream errors (rate limit, timeout, network) are retried; authentication errors and malformed responses are not. The batch call is atomic — if any item in the batch fails, the whole batch is treated as failed.

### Surfaces & Callers

The `moderation_surface` enum covers seven values: `project`, `article`, `post`, `post_comment`, `project_comment`, `article_comment`, `profile`. All organization creates and updates also use the `profile` surface (there is no separate `organization` value in the enum).

Active callers of `moderateAndLog`:

- **Project publish/update** — [`api/projects/route.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/projects/route.ts), [`api/projects/[id]/route.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/projects/[id]/route.ts)
- **Article publish/update** — [`api/articles/route.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/articles/route.ts)
- **Post create** — [`api/posts/route.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/posts/route.ts)
- **Comment create/edit** (all three types) — [`lib/api/comments/moderation.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/api/comments/moderation.ts)
- **Organization create/update** — [`api/organizations/route.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/organizations/route.ts), [`api/organizations/[id]/route.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/organizations/[id]/route.ts)

`moderateField` is used by the profile bio server action in [`account/actions.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/(main)/(feed)/(private)/account/actions.ts).

Image moderation is used by article and project image upload routes.

### Database Schema

The log has three tables:

```
moderation_attempts  1──* moderation_checks
moderation_attempts  1──1 (project|article|post_comment|project_comment|article_comment)_moderation_attempts
```

`moderation_attempts` records the surface, actor, duration and optional failure reason. `moderation_checks` stores the per-field verdict and the 13 category scores. The five typed link tables connect an attempt to its target content row. Post creates and comment creates have no target row at check time, so they carry no link row. Profile and organization checks also carry no link row — the attempt's `owner_id` and `organization_id` columns already identify the actor.

Tunables (retry counts, timeouts, category thresholds) live in [`src/config/constants/moderation.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/moderation.ts).

## Failure Modes & Edge Cases

- **Service error (fail-closed)** — any `ModerationError` causes `moderateAndLog` to log the attempt with a `failureReason` and return HTTP 503 "Moderation unavailable". The write does not proceed.
- **Rejection** — a flagged submission returns HTTP 422 with the per-field category breakdown from `submission.verdict.fields`.
- **Batch fails as a unit** — if any item in a multi-field batch throws an upstream error, all fields in that call are treated as failed; individual fields do not get partial verdicts.
- **Image fetch failure** — if the image URL cannot be fetched or decoded, the check is logged with `failureReason: 'image_fetch'` or `'image_invalid'` and the upload is blocked (503).
- **Concurrent submissions** — each `moderateAndLog` call is independent; there is no cross-request state or lock. The database log is append-only, so concurrent attempts from the same user for different surfaces do not interfere.

## Operational Notes

The only required environment variable is `OPENAI_API_KEY`, used for moderation only — it is not used for any other AI features.

The full exported surface is at [`src/lib/moderation/index.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/moderation/index.ts).

## Related Links

- [Storage (R2)](../storage-r2/) — image upload pipeline that triggers image moderation
- [Notifications](../../community/notifications/) — notification pipeline (in progress)
