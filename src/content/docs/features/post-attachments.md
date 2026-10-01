---
title: "Post Images & Reposts"
sidebar:
  order: 2
description: "How post images are uploaded and stored, and how reposts are modeled as quote-posts."
---

Posts can carry images and can be reposted as quote-posts. This page documents the `post_images` table that stores attached images, the `/api/posts/image` upload route, the `use-post-images` hook, and the repost model built on `posts.post_tag` and `post_stats.repost_count`.

> **Earlier version note:** A previous version of this page described `article_attachments` and an `articles.repost_total` counter column. `article_attachments` was [dropped in migration `20260430104609`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/supabase/migrations/20260430104609_article_images_documents.sql) and `repost_total` no longer exists on that table. The models below reflect the current codebase.

## Post Images

Images are uploaded before the post exists. [`POST /api/posts/image`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/posts/image/route.ts) takes one composer image per request, runs it through the moderation pipeline, writes it to R2, and inserts a row into `post_images`. The returned id is collected in the composer and sent as `image_ids` on the post-create call, which creates the `posts` row and links the pre-uploaded images to it.

This pre-upload pattern means a moderation rejection names the specific image rather than failing the entire post submission.

The `post_images` table (schema in [`src/types/supabase.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/types/supabase.ts)) links each image to its post via `post_id` and to a shared `images` record via `image_id`.

The client side uses [`use-post-images`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/hooks/use-post-images.ts) and `uploadModeratedImage` from [`src/lib/images/client.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/images/client.ts). The upload transport (FormData assembly, moderation result normalisation) is documented on [Media & Images](../media-and-images/); the server-side pipeline (moderation gate, R2 write, `images` insert) is documented on [Storage Abstraction & R2 Integration](../../moderation-and-storage/storage-r2/).

## Reposts

A repost is a **quote-post**: [`RepostButton`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/posts/RepostButton.tsx) calls `requestRepost` from [`use-repost.tsx`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/hooks/use-repost.tsx), which opens the composer pre-loaded with the original post. Submitting creates a new `posts` row with `post_tag` set to the original post's id — the repost is a first-class post that embeds its source. The count is stored in `post_stats.repost_count` and returned as `post.stats.repost_count` in `PublicPost`.

Feed components receive `repostedPosts` (an array of post ids the viewer has reposted) alongside `initialPosts`. `PostsInfiniteFeed` turns it into a `Set` for O(1) per-card resolution of the `reposted` boolean passed to `PostCard`.

## Failure Modes & Edge Cases

- **One repost per viewer.** `RepostButton` returns early if `reposted` is already `true`; the composer context only fires if the viewer has not yet reposted.
- **Image upload rejection.** A moderation `422` returns `{ status: "rejected", categories }` from `uploadModeratedImage`; the composer surfaces the rejection message and does not create a `post_images` row or a post.
- **Orphaned images.** If an image uploads successfully but the post create subsequently fails, the `post_images` row is orphaned. There is no automatic cleanup.
- **Moderation unavailable.** A `503` from the moderation service returns `{ status: "failed" }` with the shared "couldn't complete the content check" wording; the upload does not proceed.

## Related Links

- [Posts](../posts/) — feed, composer and pagination
- [Media & Images](../media-and-images/) — client upload transport and image URL helpers
- [Storage Abstraction & R2 Integration](../../moderation-and-storage/storage-r2/) — server-side upload pipeline
- [`/api/posts/image` route](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/posts/image/route.ts)
- [`use-post-images.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/hooks/use-post-images.ts)
- [`RepostButton.tsx`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/posts/RepostButton.tsx)
- [`use-repost.tsx`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/hooks/use-repost.tsx)
