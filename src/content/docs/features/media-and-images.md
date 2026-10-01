---
title: "Media & Images"
sidebar:
  order: 11
description: "How images and files are uploaded, validated, moderated and turned back into URLs."
---

Ozeaon stores media as objects in a blob store, not as database rows. Every uploaded asset is written to an R2-style object store under a generated, collision-resistant key; the database persists only that key. Rendering code converts the key back to a URL through a single image-URL helper. This page covers the client-side upload transport and the image URL helpers. For the `StorageAdapter`, the R2 read path, and the server-side moderation pipeline see [Storage Abstraction & R2 Integration](../../moderation-and-storage/storage-r2/).

## Overview

Key-based indirection buys three things:

1. **Single source of truth for asset locations.** Application code never concatenates storage hosts by hand; it calls `getImageUrl` or `getImageUrlFromKey`, so a CDN host change is a one-file change.
2. **Cache-friendly, immutable URLs.** Uploads are written with `Cache-Control: public, max-age=31536000, immutable`. This is safe because each upload gets a unique key — a new image produces a new URL, so cached responses never go stale.
3. **Uniform validation.** File-type and file-size policy runs through shared helpers before any write touches storage.

## Client Upload Transport

[`src/lib/images/client.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/images/client.ts) is the one module every upload surface shares. Every image route answers with the same three outcomes — success, moderation rejection (`422` with categories), or failure — so FormData assembly and response normalisation are written once.

Key exports:

- **`uploadModeratedImage<T>(url, file, options?)`** — single-file upload to a moderating route; returns `ModeratedUploadResult<T>`.
- **`uploadModeratedFiles<T>(url, files, options?)`** — multi-file wrapper; `uploadModeratedImage` delegates to it.
- **`imageRejectedMessage(categories)`** — produces the shared rejection wording: `"We couldn't add this image because it may contain <categories>."`.
- **`ModeratedUploadResult<T>`** — `{ status: "uploaded", data: T } | { status: "rejected", categories } | { status: "failed", message }`.

Behaviours worth knowing:

- **Dimensions travel with the bytes.** For each `image/*` file the module measures the image and appends `width`/`height` form fields in file order, because server routes map them back to files when inserting `images` rows.
- **Rejections are structured.** A `422` response is flattened to the de-duplicated union of `moderation[].categories`; callers pass that array to `imageRejectedMessage`.
- **`503` has dedicated wording.** When moderation is unavailable the module substitutes `"We couldn't complete the content check. Please try again."`.
- **Aborts are rethrown.** A caller passing an `AbortSignal` keeps its own `AbortError` handling; only genuine failures collapse into `{ status: "failed" }`.

Consumers: `use-profile-image-upload`, `use-post-images`, `FormImageUpload`, `OrganizationSettingsForm`, `useArticleAttachments`, and the Tiptap editor's `ImageUploadNodeView` — every client surface that uploads an image.

## Image URL Helpers

Application code holds **keys**, not URLs. To render an asset it calls one of:

```typescript
getImageUrl({ path: key })   // object form — prefer for new code; extensible with width/quality options
getImageUrl(key)              // shorthand for the common case
getImageUrlFromKey(key)       // explicit alias that signals the argument is a storage key
```

All three resolve to the same public URL via [`src/utils/url/image.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/url/image.ts). The object form is preferred in new code because additional options (transform width, quality, format) can be threaded in without touching call sites.

`StorageAdapter.getPublicUrl(key)` (server-side) produces the same URL from the same key.

## Key Generation & Validation

Before calling the adapter, upload paths:

1. Validate the file with `validateFileType` and `validateFileSize` from [`src/utils/validators/`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/validators/).
2. Generate a collision-resistant key with `generateUniqueKey(prefix, filename)` from [`src/utils/generators/storage-key.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/generators/storage-key.ts). The prefix is a logical folder (e.g. `profiles/{userId}/covers`); the function appends a unique segment so the same filename uploaded twice produces two distinct keys, making the `immutable` cache header safe.

Validation runs before the adapter so a rejected file never consumes a storage write.

## Failure Modes & Edge Cases

- **Disallowed type or oversized file.** Rejected by `validateFileType` / `validateFileSize` before `uploadFile` runs.
- **Same filename uploaded twice.** Two distinct keys, two distinct objects — no overwrite. `generateUniqueKey` owns uniqueness; never hand-build keys.
- **Asset replaced for an entity.** Write a new key and update the stored reference; do not overwrite. The old URL remains valid and cached for up to a year.
- **Dangling reference.** If the database row holds a key and the object is deleted (or the upload failed silently), the read path returns nothing. The database column is a soft reference, not a foreign key into the bucket.
- **Orphaned object.** Deleting the database row without calling `deleteFile` leaves the object in the bucket. Any account-deletion or cleanup flow must delete objects explicitly by key.
- **Moderation rejection (`422`).** `uploadModeratedImage` returns `{ status: "rejected", categories }`; nothing was persisted server-side. Render `imageRejectedMessage(categories)`.
- **Moderation unavailable (`503`).** Returns `{ status: "failed" }` with the shared "content check" wording; surfaced as retryable.
- **Upload cancelled.** `AbortError` is rethrown; callers that pass a `signal` keep their own cancellation handling.

## Operational Notes

Every host that serves media must be listed in `STORAGE_HOSTS`, which is interpolated into the `img-src` directive of the Content-Security-Policy in [`next.config.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/next.config.ts). `data:` and `blob:` are also allowed in `img-src` to permit inline previews during upload flows. `media-src` is restricted to `'self'`; features that stream audio or video from the bucket would need it extended.

`/api/storage` serves assets with `Cache-Control: public, max-age=31536000, immutable` and a quoted ETag. It also exposes `/api/storage/audit`. The full caching chain (Cloudflare Cache API → ETag 304 → R2 read) and the adapter's additional methods (`uploadBuffer`, `getFile`, `headFile`, `deleteFiles`) are documented on [Storage Abstraction & R2 Integration](../../moderation-and-storage/storage-r2/).

## Extension Points

- **New asset categories.** Add a new prefix to `generateUniqueKey` (e.g. `articles/{id}/media`). The prefix is the only namespacing mechanism.
- **URL transformations.** Add width/quality/format options to the `getImageUrl({ path, ... })` object form. This is why the object form exists.
- **Serving behavior.** Caching policy for reads lives in `/api/storage`; tuning TTL, adding range support, or changing the ETag strategy is localized there.

## Related Links

- [`src/lib/images/client.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/images/client.ts) — `uploadModeratedImage` / `uploadModeratedFiles` / `imageRejectedMessage`
- [`src/utils/url/image.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/url/image.ts) — `getImageUrl` / `getImageUrlFromKey`
- [`src/utils/generators/storage-key.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/generators/storage-key.ts) — `generateUniqueKey`
- [Storage Abstraction & R2 Integration](../../moderation-and-storage/storage-r2/) — `StorageAdapter`, `/api/storage` serving path, server-side upload pipeline
- [Post Images & Reposts](../post-attachments/) — post image upload flow using this transport
- [`next.config.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/next.config.ts) — CSP `img-src`/`media-src` wiring
