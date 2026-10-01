---
title: "UI: Comments"
description: Threaded comment UI for posts, projects and articles — composer, list, items, toggle and realtime thread.
sidebar:
  order: 3
---

The shared comment system. In almost every case you want `EntityComments` (optionally inside `CardComments`, toggled by `CommentToggle` on feed cards); the lower-level pieces (`CommentThread`, `CommentList`, `CommentItem`, `CommentForm`, `DeleteDialog`) are composed by it and not used directly elsewhere. Import from `@/components/ui/comments`.

The hierarchy is:

```
EntityComments → CommentThread → CommentForm (root)
                              → CommentList → CommentItem → CommentForm (edit / reply)
                              → DeleteDialog
                              → ModerationRejectedDialog
```

## EntityComments

The comment thread for a commentable entity. Maps the entity to its API route, realtime table and reaction actions, then renders `CommentThread`.

- **Source:** [src/components/ui/comments/EntityComments.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/EntityComments.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/page/sections/CommentsSection.tsx`, `src/components/articles/pages/ArticleCommentsSection.tsx`, `src/components/posts/PostInteractions.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `entity` | `CommentEntity` | — | `"post"`, `"project"` or `"article"`. |
| `entityId` | `string` | — | ID of the entity. |
| `currentUser` | `AuthUser` | — | Signed-in user; without it the composer, reply and like controls are unavailable. |
| `commentCount` | `number` | — | Known count, used to decide whether to show the loading state. |
| `commentsEnabled` | `boolean` | — | Whether new comments, replies and edits are allowed. |
| `onCommentCountChange` | `(count: number) => void` | — | Notified when the thread's count changes. |

Notable behaviour:

| `entity` | API base | Realtime table | Filter column |
|---|---|---|---|
| `post` | `/api/posts/{id}/comments` | `post_comments` | `post_id` |
| `project` | `/api/projects/{id}/comments` | `project_comments` | `project_id` |
| `article` | `/api/articles/{id}/comments` | `article_comments` | `article_id` |

Likes use `toggleLikeComment` / `toggleLikeProjectComment` / `toggleLikeArticleComment` and the matching `getUserLiked*Comments` from `@/lib/supabase/queries/reactions`.

```tsx
<EntityComments
  entity="project"
  entityId={project.id}
  currentUser={user ?? undefined}
  commentCount={commentCount}
  commentsEnabled={project.comments_enabled}
/>
```

## CardComments

A collapsible container that pins a comment thread to the bottom of a feed card, with the spacing that separates it from the card's action row.

- **Source:** [src/components/ui/comments/CardComments.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CardComments.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/posts/PostInteractions.tsx`, `src/components/projects/cards/ProjectCardActions.tsx`, `src/components/articles/cards/ArticleCardActions.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Whether the thread is expanded. |
| `children` | `ReactNode` | — | Usually `EntityComments`. |
| `className` | `string` | — | Extra classes; cards whose container applies a flex gap should cancel it here (e.g. `-mt-3`). |

Notable behaviour:

- Uses the animated `CollapsibleContent`; children get `mt-4`.

## CommentToggle

A comment-icon plus count plus chevron button that opens and closes a card's comment thread.

- **Source:** [src/components/ui/comments/CommentToggle.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentToggle.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/posts/PostActions.tsx`, `src/components/projects/cards/ProjectCardActions.tsx`, `src/components/articles/cards/ArticleCardActions.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Current state; rotates the chevron and sets `aria-expanded`. |
| `count` | `number` | — | Comment count, shown compact in a `<data>` element. |
| `onToggle` | `() => void` | — | Click handler. |

Notable behaviour:

- `aria-label` and the tooltip read "Show comments" / "Hide comments". Tooltip uses `disableTouch`.

```tsx
<CommentToggle
  open={commentsOpen}
  count={commentCount}
  onToggle={() => setCommentsOpen(!commentsOpen)}
/>

<CardComments open={commentsOpen && !hideComments}>
  <EntityComments
    entity="project"
    entityId={projectId}
    currentUser={user ?? undefined}
    commentCount={commentCount}
    commentsEnabled={commentsEnabled}
    onCommentCountChange={setCommentCount}
  />
</CardComments>
```

## CommentThread

The stateful thread: loads comments through `useThreadComments`, tracks which comment is being edited, replied to or deleted, subscribes to Supabase realtime, and renders the root composer, list and dialogs.

- **Source:** [src/components/ui/comments/CommentThread.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentThread.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/comments/EntityComments.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `basePath` | `string` | — | Comments API route; also names the realtime channel (`comments-{basePath}`). |
| `realtimeTable` | `string` | — | Table to subscribe to. |
| `realtimeFilter` | `string` | — | Postgres changes filter, e.g. `post_id=eq.{id}`. |
| `toggleLike` | `(commentId: string) => Promise<unknown>` | — | Persists a like toggle. |
| `fetchLiked` | `(commentIds: string[]) => Promise<string[]>` | — | Returns which of the given comments the caller has liked. |
| `currentUser` | `AuthUser` | — | Signed-in user. |
| `commentCount` | `number` | — | Known count; a "Loading comments..." line shows only while loading and this is non-zero. |
| `commentsEnabled` | `boolean` | — | Gates the root composer and shows "Comments were disabled by the Author" when false. |
| `onCommentCountChange` | `(count: number) => void` | — | Forwarded to `useThreadComments` as `onCountChange`. |

Notable behaviour:

- Realtime: `INSERT` (filtered) refetches, widening the window first for a new root comment; `DELETE` refetches; `UPDATE` refetches only when `deleted_at` is set. Other users' edits do not arrive live.
- Switching the active account (personal vs organization, from `useSessionInfo`) closes any open composer and resets the liked set.
- The liked set is refetched when the user or the set of loaded comment IDs changes.
- Escape closes the open edit or reply composer.
- Activating Reply on the comment already being replied to closes the composer.
- After a reply is submitted, that thread's fold state is cleared so the new reply is visible.
- Likes are optimistic; a failure reverts and shows a `sonner` error toast.
- Returns `null` when `shouldHideCommentSection(commentsEnabled, comments.length)` is true.
- Shows `ModerationRejectedDialog` with the de-duplicated categories when a write is rejected by moderation.

## CommentList

Groups comments into Level 1 threads with their replies and renders `CommentItem`s, reply folding and "show more" pagination.

- **Source:** [src/components/ui/comments/CommentList.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentList.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/comments/CommentThread.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `comments` | `T[]` (`T extends ThreadComment`) | — | Loaded comments, flat. |
| `total` | `number` | — | Total Level 1 comments, for the "Show N more comments" button. |
| `replyTotals` | `Record<string, number>` | — | Total replies per Level 1 comment. |
| `currentUser` | `AuthUser` | — | Signed-in user. |
| `commentsEnabled` | `boolean` | — | Passed to each item. |
| `likedComments` | `string[]` | — | IDs the caller has liked. |
| `editingId` | `string \| null` | — | Comment currently being edited. |
| `replyingId` | `string \| null` | — | Comment currently being replied to. |
| `foldStates` | `Record<string, CommentFoldState>` | — | Per-root `"expanded"` / `"collapsed"` state. |
| `onFoldChange` | `(rootId: string, state: CommentFoldState \| null) => void` | — | Fold toggle. |
| `onEdit`, `onDelete`, `onReply`, `onLike`, `onSubmitEdit`, `onSubmitReply`, `onCancelEdit`, `onCancelReply` | callbacks | — | Forwarded to each `CommentItem`. |
| `onLoadMore` | `() => void` | — | Loads more Level 1 comments. |
| `isLoadingMore` | `boolean` | — | Disables the load-more button and shows "Loading...". |

Notable behaviour:

- Empty list renders `EmptyState` "Be the first to leave a comment".
- Without a fold state, replies are cut to `REPLY_FOLD_THRESHOLD`; "Show N more replies" expands, "Hide all replies" collapses (shown when the total exceeds the threshold).
- A thread holding the open edit or reply composer ignores its fold state so the composer stays visible.
- Replies show "Replied to {name}" or "Replied to a deleted comment".
- Scrolls inside a `max-h-96` container.

## CommentItem

A single comment row: avatar and name linking to the author's or organization's profile, relative date, "Edited" marker, owner edit/delete controls, like button and reply control, plus inline edit or reply composers.

- **Source:** [src/components/ui/comments/CommentItem.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentItem.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/comments/CommentList.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `comment` | `T` (`T extends ThreadComment`) | — | The comment. |
| `currentUser` | `AuthUser` | — | Reply control and liking require it. |
| `commentsEnabled` | `boolean` | — | Disables Edit and Reply when false. |
| `replyToLabel` | `string \| null` | — | Line under the author on a Level 2 reply. |
| `liked` | `boolean` | — | Like state. |
| `isEditing` | `boolean` | — | Swaps the body for an edit composer. |
| `isReplying` | `boolean` | — | Shows a reply composer below and replaces the Reply button with "Reply to {name}". |
| `onEdit` | `(comment: T) => void` | — | Edit clicked. |
| `onDelete` | `(commentId: string) => void` | — | Delete clicked. |
| `onReply` | `(comment: T) => void` | — | Reply clicked. |
| `onLike` | `(comment: T, liked: boolean) => void` | — | Like toggled; receives the current state. |
| `onSubmitEdit` / `onSubmitReply` | `(content: string) => Promise<void>` | — | Composer submit. |
| `onCancelEdit` / `onCancelReply` | `() => void` | — | Composer cancel. |

Notable behaviour:

- Ownership comes from `useCommentIdentity().ownsComment`, i.e. per acting identity: a user and an organization they post as are separate participants.
- Profile link: `/organizations/{slug}` when authored as an organization, otherwise `/profiles/{username}/posts`.
- Deleted comments render "This comment was deleted" and cannot be liked or replied to.
- Owner controls are icon-only below `md`, icon plus label from `md`.

## CommentForm

The comment composer, in three variants: `root` (persistent box at the top), `reply` and `edit`. React Hook Form with `commentSchema`.

- **Source:** [src/components/ui/comments/CommentForm.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentForm.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/comments/CommentThread.tsx`, `src/components/ui/comments/CommentItem.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"root" \| "reply" \| "edit"` | — | Sets placeholder, submit label (Comment / Reply / Save), rows and controls. |
| `onSubmit` | `(content: string) => Promise<void>` | — | Called with the comment text. |
| `onCancel` | `() => void` | — | Cancel handler for `reply` and `edit`. |
| `defaultValue` | `string` | `""` | Initial text (used by `edit`). |
| `className` | `string` | — | Extra classes on the form. |

Notable behaviour:

- Enter submits; Shift+Enter inserts a newline (IME composition is respected).
- `reply` and `edit` autofocus the textarea on mount.
- Only `root` resets after a successful submit; a thrown `onSubmit` is swallowed (the mutation layer reports it).
- Submit is disabled while the text is blank or submitting. `maxLength` is `COMMENT_MAX_LENGTH`.
- `edit` hides the avatar and uses 3 rows; others show the acting identity's avatar.
- `reply`/`edit` show Cancel + submit text buttons from `md`, and round icon buttons below `md`.

## DeleteDialog

The confirm-delete dialog for comments (exported from `DeleteComment.tsx`). Shows "Deleting..." and disables both buttons while `onConfirm` runs, then closes.

- **Source:** [src/components/ui/comments/DeleteComment.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/DeleteComment.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/comments/CommentThread.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Dialog open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Open state change; called with `false` after a successful confirm. |
| `onConfirm` | `() => Promise<void>` | — | The delete. If it throws, the dialog stays open. |
| `title` | `string` | `"Confirm Deletion"` | Dialog title. |
| `description` | `string` | "Are you sure you want to delete this comment? This action cannot be undone." | Dialog body. |

## index.ts

Barrel exporting `CardComments`, `CommentForm`, `CommentItem`, `CommentList`, `CommentThread`, `CommentToggle`, `DeleteDialog` and `EntityComments`.
