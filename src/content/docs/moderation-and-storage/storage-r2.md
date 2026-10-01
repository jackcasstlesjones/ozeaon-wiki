---
title: "Storage (R2)"
description: "Cloudflare R2 storage for user images and article content, accessed through a StorageAdapter layer that switches between a public URL and a fallback API route."
sidebar:
  order: 2
---

User-uploaded images (avatars, cover images, project and article images) and article content documents are stored in Cloudflare R2. The storage layer has three parts: [`R2BindingStorage`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/storage/r2-binding.ts) — the low-level class wrapping the R2 binding, [`StorageAdapter`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/storage/adapter.ts) — the application-level write path, and [`/api/storage`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/storage/route.ts) — a fallback read route for environments without a public bucket URL. Note: `docs/r2-storage.md` in the codebase is stale and does not reflect the current implementation.

## Overview

Application write paths (`uploadFile`, `uploadBuffer`) go through `StorageAdapter`, which acquires the Cloudflare context and constructs `R2BindingStorage` internally. Reads use `StorageAdapter.getPublicUrl(key)`: when `NEXT_PUBLIC_STORAGE_URL` is set (production and staging), this returns `${storageUrl}/<key>` directly; when it is not set, it falls back to `/api/storage?key=<encoded-key>`, which reads R2 via the binding class. The audit script (`lib/storage/audit.ts`) and the fallback route both construct `R2BindingStorage` directly.

## Architecture

### R2BindingStorage

[`R2BindingStorage`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/storage/r2-binding.ts) wraps a `R2Bucket` binding and exposes `uploadFile`, `upload` (buffer), `get`, `getAsResponse`, `getAsText`, `getAsJson`, `exists`, `head`, `copy`, `deleteFile`, and `deleteFiles` (batched in groups of 1,000). `StorageAdapter` calls these through `getCloudflareContext`; the API route and the audit utility call them directly.

### Fallback Read Route

`GET /api/storage?key=<key>` reads the object with `R2BindingStorage.getAsResponse`, then sets:

```
Cache-Control: public, max-age=31536000, immutable
X-Cache: MISS
```

The ETag from R2 is quoted if it is not already. There is no Cloudflare Cache API lookup, no `If-None-Match` / 304 handling, and no conditional re-read: every request reads R2 directly. This route is the fallback for environments without `NEXT_PUBLIC_STORAGE_URL`; it is commented out for non-development environments in the current code.

### Upload Pipeline

The upload order is: validate → write to R2 → moderate (images only) → DB insert. If any later step fails, the already-written R2 object is deleted. This means failed uploads never leave orphaned files provided the delete succeeds; the audit script (`lib/storage/audit.ts`) reconciles any that slip through.

Images set an explicit `cacheControl: "public, max-age=31536000, immutable"` on the `StorageAdapter.uploadFile` call, making them suitable for long-term CDN caching. Article content documents (compressed as `application/gzip`) do not set explicit cache control on upload, so they rely on R2's defaults.

### Bucket Configuration

| Environment | R2 bucket |
|---|---|
| Production | `app-content` |
| Staging | `staging-app-content` |
| Preview (per-PR workers) | `staging-app-content` |

Configured in [`wrangler.jsonc`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/wrangler.jsonc). The top-level block (production default) uses `app-content`; both `env.staging` and `env.preview` use `staging-app-content`.

## Failure Modes & Edge Cases

- **Missing binding** — `StorageAdapter` methods throw `"R2_BUCKET not available in Cloudflare context"` if the binding is absent; the API route returns 500.
- **Object not found** — `getAsResponse` returns `null`; the API route returns 404 "File not found in storage".
- **Upload then DB failure** — the upload pipeline calls `StorageAdapter.deleteFile` (or `deleteFiles`) on DB insert failure. The delete is best-effort and logged on error; failures are reconciled by the audit script.
- **Audit orphans** — `lib/storage/audit.ts` compares R2 keys against the `documents` table and reports orphaned objects and DB records without a matching file.
- **Local development** — `NEXT_PUBLIC_STORAGE_URL` is typically unset locally, so all reads go through `/api/storage`.

## Operational Notes

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_STORAGE_URL` | Public base URL for the R2 bucket; falls back to `/api/storage` when absent |

The full `StorageAdapter` API (including `uploadBuffer`, `getFile`, `headFile`, `deleteFile`, `deleteFiles`) is in [`src/lib/storage/adapter.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/storage/adapter.ts).

## Related Links

- [Moderation](../moderation/) — image moderation runs inside the upload pipeline
- [Media & Images](../../features/media-and-images/) — image upload hooks and routes
- [Email & Marketing](../email-and-marketing/) — other external integrations
