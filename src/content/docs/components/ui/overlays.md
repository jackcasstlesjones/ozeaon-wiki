---
title: "UI: Overlays"
description: Confirmation dialogs, the type-DELETE gate, the moderation rejection dialog and a full-screen loading overlay.
sidebar:
  order: 11
---

Modal and full-screen overlays built on the shadcn `Dialog`. Use `ConfirmDialog` for any yes/no confirmation instead of `window.confirm()`, and `ConfirmDeleteDialog` when the action cannot be undone. All are exported from `@/components/ui/overlays` (and re-exported from `@/components/ui`).

## ConfirmDialog

Dialog with a title, a description body and a Cancel/Confirm footer. The base for every confirmation in the app.

- **Source:** [src/components/ui/overlays/ConfirmDialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/overlays/ConfirmDialog.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/profiles/users/BlockButton.tsx`, `src/components/organizations/cards/MemberCard.tsx`, `src/components/projects/ProjectDeleteDialog.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the dialog opens or closes; Cancel calls it with `false`. |
| `title` | `string` | — | Dialog title. |
| `description` | `ReactNode` | — | Body content. |
| `confirmLabel` | `string` | `"Confirm"` | Confirm button text. |
| `cancelLabel` | `string` | `"Cancel"` | Cancel button text. |
| `onConfirm` | `() => void \| Promise<unknown>` | — | Confirm handler. If omitted, no Confirm button is rendered. |
| `variant` | `"default" \| "destructive"` | `"default"` | Confirm button variant; `destructive` also adds a trash icon to the header. |
| `headerIcon` | `ReactNode` | — | Icon shown before the title; overrides the destructive trash icon. |
| `isLoading` | `boolean` | `false` | Disables both footer buttons. |
| `children` | `ReactNode` | — | Replaces the default footer entirely when provided. |

Notable behaviour:

- The description is rendered via `DialogDescription asChild` inside a `<div>`, so multi-paragraph bodies don't nest `<p>` inside `<p>`.
- Confirming does not close the dialog; the caller closes it via `onOpenChange`.
- `isLoading` only disables the buttons; there is no spinner. Pass custom `children` (as `ConfirmDeleteDialog` does) for a `LoadingButton`.

```tsx
<ConfirmDialog
  open={showBlockModal}
  onOpenChange={setShowBlockModal}
  title="Block User"
  description="Are you sure you want to block this user?"
  confirmLabel="Block"
  onConfirm={handleBlock}
  variant="destructive"
  isLoading={isLoading}
/>
```

## ConfirmDeleteDialog

Destructive confirmation that only fires `onConfirm` once the user has typed `DELETE`. Use for teardowns that cannot be undone (account deletion, Organization deletion).

- **Source:** [src/components/ui/overlays/ConfirmDeleteDialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/overlays/ConfirmDeleteDialog.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/account/DeleteAccountDialog.tsx`, `src/components/organizations/form/OrganizationSettingsForm.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Open/close handler. |
| `title` | `string` | — | Dialog title. |
| `description` | `ReactNode` | — | Optional body shown above the confirmation field. |
| `confirmLabel` | `string` | — | Destructive button text. |
| `onConfirm` | `() => void` | — | Runs only when the typed text equals `DELETE`. |
| `isDeleting` | `boolean` | `false` | Shows the loading state on the confirm button and disables the input and Cancel. |
| `error` | `string \| null` | — | Error from the caller's delete, shown under the field. |

Notable behaviour:

- Wraps `ConfirmDialog` with `variant="destructive"` and a custom footer (`Cancel` + `LoadingButton`).
- The input is compared after `trim()`, case-sensitive. Clicking confirm with the wrong text shows "Type DELETE to confirm".
- Closing the dialog resets the typed text and the error state.

```tsx
<ConfirmDeleteDialog
  open={open}
  onOpenChange={handleOpenChange}
  title="Delete your account?"
  confirmLabel="Delete Account"
  onConfirm={() => void handleDelete()}
  isDeleting={isDeleting}
  error={deleteError}
/>
```

## ModerationRejectedDialog

Shown when a moderation check rejects a publish, comment or image upload. Lists the flagged categories, links to the moderation report URL, and has a single OK button.

- **Source:** [src/components/ui/overlays/ModerationRejectedDialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/overlays/ModerationRejectedDialog.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/comments/CommentThread.tsx`, `src/components/articles/form/ArticleForm.tsx`, `src/components/profiles/users/CoverImageEditor.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Open/close handler; OK calls it with `false`. |
| `categories` | `string[]` | — | Flagged categories, joined with `", "` into the body copy. |
| `kind` | `"content" \| "image"` | `"content"` | Switches title and body copy between text content ("edit the text") and images ("choose a different image"). |

Notable behaviour:

- The dialog's close (X) button is hidden; OK is the only control. There is no retry, because nothing was changed.
- The "report the issue" link points at `MODERATION_REPORT_URL` from `@/config/constants` and opens in a new tab.
- Most callers spread `dialogProps` from a moderation hook rather than passing props by hand.

```tsx
<ModerationRejectedDialog
  open={!!moderationRejection}
  onOpenChange={(open) => !open && clearModerationRejection()}
  categories={Array.from(
    new Set((moderationRejection ?? []).flatMap((m) => m.categories)),
  )}
/>
```

## LoadingOverlay

Fixed, full-screen blurred overlay with a spinner and a message.

- **Source:** [src/components/ui/overlays/LoadingOverlay.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/overlays/LoadingOverlay.tsx)
- **Kind:** Server component (no `"use client"`; usable from either)
- **Used in:** `src/components/profiles/users/CoverImageEditor.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | `"Loading..."` | Text under the spinner. |

```tsx
{isUploading && <LoadingOverlay message="Uploading..." />}
```
