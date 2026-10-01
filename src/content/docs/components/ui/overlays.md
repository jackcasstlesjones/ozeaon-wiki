---
title: "Overlays"
description: Confirmation dialogs, the type-DELETE gate, the moderation rejection dialog and a full-screen loading overlay.
sidebar:
  order: 11
---

Modal and full-screen overlays built on the shadcn `Dialog`, imported from `@/components/ui/overlays` (also re-exported from `@/components/ui`). For any yes/no confirmation, use `ConfirmDialog` instead of `window.confirm()`. Use `ConfirmDeleteDialog` when the action can't be undone.

## ConfirmDialog

A title, a description body and a Cancel/Confirm footer. It is the base for every confirmation in the app. Gotchas:

- Confirming **doesn't close** the dialog. The caller closes it via `onOpenChange`.
- `isLoading` only disables the buttons and shows no spinner. Pass custom `children` for a `LoadingButton`.

**Source:** [src/components/ui/overlays/ConfirmDialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/overlays/ConfirmDialog.tsx)

## ConfirmDeleteDialog

A destructive confirmation that fires `onConfirm` only once the user has typed `DELETE` (trimmed, case-sensitive). Use it for teardowns such as account and organization deletion. Closing it resets the typed text.

**Source:** [src/components/ui/overlays/ConfirmDeleteDialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/overlays/ConfirmDeleteDialog.tsx)

## ModerationRejectedDialog

Shown when automated moderation rejects a publish, comment or upload. It lists the flagged categories and links to the report form, which is currently an external form; the in-app reporting queue is on the roadmap. It has no close X, only OK. Most callers spread `dialogProps` from the moderation hook. See [Content Moderation Pipeline](../../../moderation-and-storage/moderation/).

**Source:** [src/components/ui/overlays/ModerationRejectedDialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/overlays/ModerationRejectedDialog.tsx)

## LoadingOverlay

A fixed, full-screen blurred overlay with a spinner and a message, for blocking operations such as uploads.

**Source:** [src/components/ui/overlays/LoadingOverlay.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/overlays/LoadingOverlay.tsx)
