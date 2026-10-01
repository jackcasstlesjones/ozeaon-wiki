---
title: "Server Errors & Moderation"
description: How API failures, including validation errors, moderation rejections, moderation outages and slug conflicts, are mapped back onto form fields.
sidebar:
  order: 6
---

Client-side Zod catches most mistakes, but the API route has the final say. It re-validates, checks referenced rows exist, runs content moderation and enforces uniqueness. Each of those failures comes back as JSON, and the form has to turn it into a field error, a dialog, a banner or a toast. This page covers that mapping.

## The Error Contract

Every `/api/*` route returns errors as an [`ApiErrorBody`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/api-error.ts):

```ts
type ApiErrorBody = {
  error: string;         // headline, always present
  message?: string;      // detail
  code?: string;         // machine discriminator, e.g. "slug_taken"
  errors?: ApiFieldErrors;          // 400 only
  moderation?: ApiModerationIssue[]; // 422 only
};
```

Forms convert a failed response with `throw await ApiError.fromResponse(res)` and branch on the instance in `catch`:

| Getter | True when |
| --- | --- |
| `isModerationRejection` | status 422 **and** `moderation` present |
| `status === 503` | the moderation service failed (writes fail closed) |
| `zodIssues` | `errors` is an array of Zod issues |
| `fieldErrors` | `errors` is a plain `{ field: message }` object (FK and lookup failures) |
| `code` | a specific known failure, such as `slug_taken` |

`errors` takes two shapes, so check which one a route sends before relying on it:

- **Article routes** send `parsed.error.issues`, an array, for schema failures. They send an object for lookup failures (`{ article_type_id: "Selected article type does not exist" }`).
- **Project routes** send `result.error.flatten().fieldErrors`, an object of string **arrays**. That matches neither `zodIssues` nor the declared `fieldErrors` type.

## What Each Form Does With an Error

| Failure | Projects | Articles | Organisations (create) |
| --- | --- | --- | --- |
| 422 moderation | `applyRejection` → dialog plus field errors | same | same |
| 503 moderation outage | `applyFailure` → page banner | same | same |
| 400 with Zod issues | generic toast | `setError` per issue, focus the first, toast | generic toast |
| 400 with object `errors` | generic toast | generic toast | generic toast |
| `slug_taken` | n/a | n/a | `setError("slug")` + `setFocus` + toast |
| Anything else | `showErrorToast` | `showErrorToast`, and logged | `showErrorToast` |

Only articles map server validation errors onto fields. Projects and organisations rely on the client having run the same schema first, so a server 400 is unexpected and gets a toast. The project **draft** save path catches everything with a toast, moderation included.

Article Zod issues are mapped with `issue.path[0]` only. A nested error such as `authors.0.display_name` lands on the top-level `authors` field.

## Moderation Rejections

[`useModerationRejection(form, resolveField?)`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/hooks/use-moderation-rejection.ts) is the shared hook for every surface that moderates on write: the three editor forms, `OrganizationSettingsForm`, `ProfileSettings`, post creation (`useCreatePost`) and image uploads (`useImageModeration`). Comments have their own copy in `use-thread-comments`. It owns one `ModerationRejectedDialog`, the field errors under it, and the page banner.

| Member | Call it when |
| --- | --- |
| `resetBeforeAttempt()` | at the start of every submit; clears the dialog and banner without moving focus |
| `applyRejection(issues)` | on a 422; opens the dialog and sets `"May contain <categories>."` on each reported field |
| `applyImageRejection(categories)` | an image upload was rejected; dialog only, as images have no field error |
| `applyFailure(message?)` | on a 503; sets `pageError` for the banner |
| `dialogProps` | spread onto `ModerationRejectedDialog` |
| `pageError`, `clearPageError` | render and dismiss the banner |

Text is moderated on submit and images on upload, so the dialog only ever shows one `kind` at a time.

### Field Paths That Don't Match the Form

The server reports fields by stable name, which isn't always the name React Hook Form registered. Pass `resolveField` to translate:

- **Projects** report content blocks by slug (`sections.overview.body`), since array indexes shift on reorder. `useProjectForm` resolves the slug to the block's current index (`sections.2.body`).
- **Articles** report the body as `content_text`, but the form field is `content`.

`resolveField` is called again when the dialog closes, not cached, so it resolves against the form as it is then.

### Why Focus Is Deferred on Close

Closing the dialog runs `clearModerationRejection`, which focuses the first rejected field inside a `setTimeout`. Without the deferral, Radix's own focus-return runs after it and pulls focus back off the field. That blur triggers an `onBlur` re-validation, and since moderation isn't a schema rule, the schema finds the field valid and **clears the moderation error**. If you see moderation errors vanishing as the dialog closes, something has undone this ordering.

## Failure Modes & Edge Cases

- **Moderation errors are cleared by the next validation of that field.** They are `setError` errors, not schema errors. Editing or blurring the field re-runs the resolver, which removes the error even though the text hasn't been re-moderated. That's intentional, because the next submit re-checks it.
- **Forgetting `resetBeforeAttempt`** leaves the previous attempt's banner showing over a successful retry.
- **Unparseable error bodies** (an edge error page, an empty gateway response) become `ApiError(status, { error: "Failed to parse response" })` and are logged from `fromResponse`.
- **Project 400s are not mapped to fields** because of the `flatten()` shape above. Switching the project routes to send `error.issues` would let them reuse the article mapping.

## Extension Points

- **A new moderated form:** call `useModerationRejection` (with `resolveField` if any reported path differs from the registered one), call `resetBeforeAttempt()` before submitting, branch on `isModerationRejection` and `503` in `catch`, and render `ModerationRejectedDialog` with `dialogProps` plus a banner for `pageError`.
- **A new known failure:** return a `code` from the route and branch on `error.code` in the form, as `slug_taken` does. Don't string-match `error.message`.
- **Server-side field validation:** send `errors` as a Zod issue array so clients can use `zodIssues`.

## Related Links

- [Moderation](../../moderation/moderation/): what is checked, and `moderateAndLog`
- [API Route Structure & Conventions](../../api-layer/api-routes/): how routes shape errors
- [Drafts, Saving & Publishing](../saving-and-publishing/)
