---
title: "Comments"
description: Threaded comment UI for posts, projects and articles — composer, list, items, toggle and realtime thread.
sidebar:
  order: 3
---

The shared comment system. In almost every case you want `EntityComments` (optionally inside `CardComments`, toggled by `CommentToggle` on feed cards); the lower-level pieces are composed by it and not used directly elsewhere. Import from `@/components/ui/comments`.

See also: [Comments & Reactions](../../../features/comments-and-reactions/).

The hierarchy is:

```
EntityComments → CommentThread → CommentForm (root)
                              → CommentList → CommentItem → CommentForm (edit / reply)
                              → DeleteDialog
                              → ModerationRejectedDialog
```

## EntityComments

The comment thread for a commentable entity. Maps the entity to its API route, realtime table and reaction actions, then renders `CommentThread`. Supports `"post"`, `"project"` and `"article"` entities, each with its own API base (`/api/{entity}s/{id}/comments`), Supabase realtime table and like helpers from `@/lib/supabase/queries/reactions`.

**Source:** [src/components/ui/comments/EntityComments.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/EntityComments.tsx)

```tsx
<EntityComments
  entity="project"
  entityId={project.id}
  currentUser={user ?? undefined}
  commentCount={commentCount}
  commentsEnabled={project.comments_enabled}
/>
```

## CommentThread

The stateful thread: loads comments through `useThreadComments`, subscribes to Supabase realtime, and renders the root composer, list and dialogs. Key behaviour to know: realtime `INSERT` and `DELETE` events refetch the thread, but other users' edits do not arrive live. Switching the acting account (personal vs organization) resets the open composer and the liked set. Ownership is per acting identity — a user and an organization they post as are separate participants. Shows `ModerationRejectedDialog` when a write is rejected.

**Source:** [src/components/ui/comments/CommentThread.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentThread.tsx)

## CommentList

Groups comments into Level 1 threads with their replies and renders `CommentItem`s, reply folding and "show more" pagination. A thread holding the open edit or reply composer ignores its fold state so the composer stays visible.

**Source:** [src/components/ui/comments/CommentList.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentList.tsx)

## CommentItem

A single comment row: avatar and name linking to the author's or organization's profile, relative date, owner edit/delete controls, like button and reply control, plus inline edit or reply composers. Profile links go to `/organizations/{slug}` when authored as an organization, otherwise `/profiles/{username}/posts`. Deleted comments render "This comment was deleted" and cannot be liked or replied to.

**Source:** [src/components/ui/comments/CommentItem.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentItem.tsx)

## CommentForm

The comment composer in three variants: `root` (persistent box at the top), `reply` and `edit`. React Hook Form with `commentSchema`; Enter submits, Shift+Enter inserts a newline. Only the `root` variant resets after a successful submit; a thrown `onSubmit` is swallowed (the mutation layer reports it).

**Source:** [src/components/ui/comments/CommentForm.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentForm.tsx)

## DeleteDialog

The confirm-delete dialog for comments (exported from `DeleteComment.tsx`). Shows "Deleting..." and disables both buttons while `onConfirm` runs, then closes on success.

**Source:** [src/components/ui/comments/DeleteComment.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/DeleteComment.tsx)

## CardComments

A collapsible container that pins a comment thread to the bottom of a feed card, with the spacing that separates it from the card's action row. Uses the animated `CollapsibleContent`.

**Source:** [src/components/ui/comments/CardComments.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CardComments.tsx)

## CommentToggle

A comment-icon plus count plus chevron button that opens and closes a card's comment thread. `aria-label` and tooltip read "Show comments" / "Hide comments"; the chevron rotates with open state.

**Source:** [src/components/ui/comments/CommentToggle.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/comments/CommentToggle.tsx)

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
