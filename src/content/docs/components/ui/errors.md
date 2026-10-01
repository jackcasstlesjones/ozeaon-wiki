---
title: "UI: Errors"
description: Error boundary fallback screen and the persistent page-level form error banner.
sidebar:
  order: 5
---

Error presentation. Use `ErrorFallback` for `error.tsx` boundaries and full-area failure states; use `FormErrorBanner` for a blocking form failure that must stay visible until the user acts, where a self-clearing toast would be wrong. Import from `@/components/ui/errors`.

## ErrorFallback

A centred error screen with title, description, optional error digest, a "Try again" button and a home link.

- **Source:** [src/components/ui/errors/ErrorFallback.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/errors/ErrorFallback.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/app/error.tsx`, `src/app/(main)/(dashboard)/settings/(personal)/organizations/error.tsx`, `src/app/(main)/(editor)/projects/new/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `error` | `Error & { digest?: string }` | — | When it has a `digest`, shows "Error ref: {digest}". |
| `reset` | `() => void` | — | When set, shows a "Try again" button that calls it. |
| `title` | `string` | `"Something went wrong"` | Heading. |
| `description` | `string` | `"An unexpected error occurred. Please try again."` | Body text. |
| `homeHref` | `string` | `"/"` | Secondary button link. |
| `homeLabel` | `string` | `"Go home"` | Secondary button label. |
| `className` | `string` | `""` | Extra classes on the wrapper (default min height `40vh`). |

```tsx
// error.tsx boundary
return <ErrorFallback error={error} reset={reset} />;

// static failure state in a page
<ErrorFallback
  title="Permission Denied"
  description="You do not have permission to edit this draft."
  className="h-[calc(100vh-10rem)]"
/>
```

## FormErrorBanner

An inline error banner with an alert icon and optional dismiss button. Renders nothing when `message` is null.

- **Source:** [src/components/ui/errors/FormErrorBanner.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/errors/FormErrorBanner.tsx)
- **Kind:** Server component (no `"use client"` directive)
- **Used in:** `src/components/projects/form/ProjectForm.tsx`, `src/components/articles/form/ArticleForm.tsx`, `src/components/organizations/form/OrganizationForm.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `message` | `string \| null` | — | Error text; `null` hides the banner. |
| `onDismiss` | `() => void` | — | When set, shows an X button (`aria-label="Dismiss"`). |

Notable behaviour:

- `role="alert"` with `aria-live="polite"`.
- Does not self-clear; the caller clears `message`.

```tsx
<FormErrorBanner message={pageError} onDismiss={clearPageError} />
```

## index.ts

Barrel exporting `ErrorFallback`, `FormErrorBanner` and the `FormErrorBannerProps` type.
