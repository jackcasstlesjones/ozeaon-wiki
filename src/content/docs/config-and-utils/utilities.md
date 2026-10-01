---
title: Utility Modules
sidebar:
  order: 4
description: A dependency-light collection of pure helpers for formatting, slug generation, input validation, retry-aware fetching, and notification copy under src/utils/.
---

Utility code in [`src/utils/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/) is organized by concern — formatters, generators, validators, URL helpers, data helpers, and cross-cutting primitives — so the same transformation logic can be imported safely by both Client Components and Server Components without pulling in I/O dependencies.

## Overview

Eight structural groups live under `src/utils/`:

| Group | Path | Purpose |
|-------|------|---------|
| Top-level | `src/utils/*.ts` | Cross-cutting: article/category/project helpers, HTML sanitization, toasts, navigation history, notification copy, error shaping, retry wrapper |
| `formatters/` | `src/utils/formatters/` | Presentation-shaping for dates, numbers, file sizes, strings, arrays, and objects; barrel at `index.ts` |
| `generators/` | `src/utils/generators/` | Deterministic construction of slugs and storage keys; barrel at `index.ts` |
| `validators/` | `src/utils/validators/` | Input checking: email, file size/type, image files, article attachment quotas; barrel at `index.ts` |
| `url/` | `src/utils/url/` | Filename-to-MIME lookup, document-type queries, image and search URL helpers |
| `data/` | `src/utils/data/` | Stateless gzip compression, comment-thread shaping, sidebar cookie pair |
| `form/` | `src/utils/form/` | Form-value normalization; `data.ts` is documented with the [UI forms](../../forms/field-wrappers/) component pages |
| `shadcn/` | `src/utils/shadcn/utils.ts` | `cn` — `clsx` + `tailwind-merge` class-merge helper |

The key split is between **pure transformation** (formatters, generators) and **I/O-bearing helpers** (data, fetch, api-error). Pure modules are safe to import from both client and server contexts. `nav-history.ts` is `client-only` guarded. The sidebar-state pair enforces the server boundary through the `.server.ts` module name convention.

## Architecture

### Slug Generator

[`src/utils/generators/generate-slug.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/generators/generate-slug.ts) builds URL-safe slugs in five steps: transliterate the input to ASCII using `transliteration`, drop stop words, Porter-stem and dedup remaining tokens, greedily fill up to 80 characters, then append an 8-character ID suffix derived from the object's UUID. The base and suffix join with a hyphen, capping slugs at 89 characters.

Two functions are consumed downstream. `buildSlugBase` is called directly by the [projects API routes](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/projects/route.ts) to generate placeholder and subcategory slugs. `idSuffix` and `buildSlugBase` together power [`lib/supabase/queries/generate-unique-slug.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/queries/generate-unique-slug.ts), which retries with incrementing salts until the slug is confirmed unique in the database.

### Other Generators

- [`date.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/generators/date.ts) — formats timestamps as relative strings ("2 hours ago").
- [`username.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/generators/username.ts) — derives a unique username from display name with a numeric suffix.
- [`storage-key.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/generators/storage-key.ts) — builds the upload path key passed to [R2 storage](../../storage/storage-r2/).
- [`static-params.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/generators/static-params.ts) — `staticParams` calls a fetch function to populate `generateStaticParams`; on fetch failure or empty result it falls back to a single `__placeholder__` entry so the build never fails. `notFoundIfPlaceholder` must be called inside the page component to convert a placeholder route visit into a runtime 404.

### Formatters

[`src/utils/formatters/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/formatters/) provides one module per type, all re-exported from the barrel:

- `date.ts` — absolute date formats (locale strings, ISO snippets).
- `number.ts` — locale-aware number and percentage formatting.
- `file-size.ts` — converts bytes to human-readable size strings (used by [Media & Images](../../storage/media-and-images/) upload feedback).
- `string.ts` — `capitalize`, `truncate`, `toLabel` (camel/snake → sentence case). `toLabel` is also consumed by the [Zod validation](../../forms/zod-schemas/) custom-error hook to derive field display names.
- `array.ts` — dedupe, chunk, and sort helpers.
- `object.ts` — `omit`, `pick`, and deep-equality helpers.

### Validators

[`src/utils/validators/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/validators/) is for runtime checks that are not Zod-schema based:

- `email.ts` — format validation for email strings.
- `file.ts` — generic file size cap and allowed MIME-type list.
- `image.ts` — image-specific constraints (dimensions, format).
- `attachments.ts` — article attachment quota rules.

`validators/password.ts` exports `validatePassword` and `checkPasswordStrength`, but identical implementations also exist in [`src/config/constants/password.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/constants/password.ts) and are barrel-exported from `src/config/constants/index.ts`. Application code imports from the constants barrel, making the validators copy dead code.

### URL Helpers

[`src/utils/url/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/url/) has three modules:

- `content-type.ts` — `getContentType` maps a filename extension to a MIME type; `getDocumentType` classifies a MIME type into a broader category (image, video, pdf, doc, etc.).
- `image.ts` — `getImageUrl` / `getImageUrlFromKey` build the public CDN URL for an uploaded asset; `getBlurDataUrl` returns a base64 blur placeholder; `downloadFile` triggers a browser download from a blob URL.
- `search.ts` — `searchHref` builds the query-string URL for the [Search](../../community/search/) route.

### Top-Level Helpers

- [`articles.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/articles.ts) — `getArticleTypeName` and `canManageArticleFromActiveAccount`. The latter derives manage permissions from the unsigned active-account cookie for cosmetic UI gating only; server actions use the authoritative `canManageArticle` RPC.
- [`sanitize.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/sanitize.ts) — `sanitizeArticleHtml` runs an allowlist XSS filter (via `xss`) mirroring the exact TipTap extension vocabulary. Called on the write path (API route) and again on the render path; see [Editor](../../editor/tiptap-core/).
- [`notifications.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/notifications.ts) — a `CATALOGUE` record keyed by `NotificationType` maps each type to a text factory and a snippet factory; consumed by the [Notifications](../../community/notifications/) feature layer.
- [`nav-history.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/nav-history.ts) and [`safe-router-back.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/safe-router-back.ts) — `nav-history.ts` patches `pushState`/`replaceState` to stamp a depth counter onto each history entry. `safeRouterBack` uses both in-app depth and `document.referrer` to decide whether `router.back()` is safe; if neither signal confirms in-app history, it falls back to a caller-supplied URL. `window.history.length` is unreliable because it counts entries predating the user's arrival on the site.
- [`toast.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/toast.ts) — `showUndoToast` shows a Sonner toast with an Undo button. The `onCommit` callback fires after the toast duration expires, not on dismiss, so the action is deferred.
- [`project.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/project.ts) — `parseProjectFilters`, `getProjectTags`, `getSubcategoryIds`, `getSDGIds`, `getDisplayProjectType`, and `updateDraftUrl`. `getDisplayCurrency`, `getDisplayCurrencySymbol`, and `formatFundingAmount` are scaffolding for planned project funding and have no current callers in components.
- [`api-error.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/api-error.ts) / [`supabase-error.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/supabase-error.ts) — normalize thrown values into structured `ApiError` objects that route handlers and server actions return.
- [`zod-to-db.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/zod-to-db.ts) — bridges validated [Zod](../../forms/zod-schemas/) form data to the DB row shape expected by Supabase mutations.

:::note[Project funding — roadmap]
`getDisplayCurrency`, `getDisplayCurrencySymbol`, and `formatFundingAmount` in `project.ts` are defined but have no callers. Project funding (currency selection, funding rounds, donations) is a planned feature not yet built.
:::

### Data Helpers

- [`data/compression.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/data/compression.ts) — `compressJSON`/`decompressJSON` use the Web Streams `CompressionStream`/`DecompressionStream` API for edge-runtime and browser compatibility.
- [`data/comments.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/data/comments.ts) — `buildCommentTree` shapes flat DB rows into a nested thread. Orphaned replies whose parent was deleted before the query ran are dropped rather than promoted to root.
- [`data/sidebar-state.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/data/sidebar-state.ts) / [`sidebar-state.server.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/data/sidebar-state.server.ts) — client-side and server-side reads of the sidebar-open cookie. The `.server.ts` module name enforces the boundary at the bundler level. Both share the same cookie key and default value.

### `fetchWithRetry`

[`src/utils/fetch-with-retry.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/fetch-with-retry.ts) wraps `fetch` with bounded linear-backoff retry: 3 attempts by default, 500 ms × attempt index between retries, retries on network errors and 5xx responses, throws immediately on 4xx. Its only callers are [`GenericInfiniteFeed`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/GenericInfiniteFeed.tsx) and [`PostsInfiniteFeed`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/posts/PostsInfiniteFeed.tsx).

## Failure Modes & Edge Cases

- **Slug generation with all stop words** — if every token falls in the stop-word list, `buildSlugBase` returns `"project"` as a fallback. Callers that need uniqueness must use `generate-unique-slug.ts`.
- **`staticParams` build failure** — all fetch errors are caught and the placeholder is returned, so the build never fails. `notFoundIfPlaceholder` must be called in every page component; if it is not, the placeholder URL returns real content silently.
- **`decompressJSON` outside edge runtime** — `DecompressionStream` is not available in Node.js without a polyfill; calling it in a Node server-render path throws.
- **`nav-history.ts` patch ordering** — patches `pushState`/`replaceState` once on first import with no teardown. If another library patches those functions after this module loads, both patches stack.
- **`showUndoToast` deferral** — `onCommit` does not run on toast dismiss; it fires when the duration expires. Callers that need an immediate commit must use Sonner's `onDismiss` option directly.
- **`canManageArticleFromActiveAccount` is cosmetic only** — it reads the unsigned active-account cookie. Never use it to authorize data access; use the server-side `canManageArticle` query instead.
- **`validators/password.ts` dead code** — password validation is duplicated in `src/config/constants/password.ts`. The constants version is what application code imports; the validators copy is unreachable through normal import paths.

## Operational Notes

All `formatters/`, `generators/`, `validators/`, and `shadcn/` modules are pure and side-effect-free; they can be safely imported in server or client context and are tree-shakeable. `nav-history.ts` is `client-only` guarded. `fetchWithRetry` and the `data/` helpers appear in client bundles only where they are imported. The `data/` account modules (`account.ts`, `active-account.ts`) are Supabase-facing and documented separately from the stateless data helpers on this page.

## Related Links

- [Zod Schemas](../../forms/zod-schemas/) — schema and form validation layer; `zod-to-db.ts` bridges the two
- [Config Constants](../config-constants/) — env vars and constants that some validators and formatters reference
- [Storage (R2)](../../storage/storage-r2/) — `storage-key.ts` builds keys for R2 uploads
- [Media & Images](../../storage/media-and-images/) — image validation and upload pipeline
- [Notifications](../../community/notifications/) — `CATALOGUE` in `notifications.ts` is the notification copy source
- [Search](../../community/search/) — `searchHref` in `url/search.ts` supports search routing
- [Nav](../../components/nav/) — `nav-history.ts` and `safe-router-back.ts` back the safe back-navigation component
- [Editor](../../editor/tiptap-core/) — `sanitize.ts` mirrors the TipTap extension allowlist
