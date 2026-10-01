---
title: "UI: Skeletons"
description: Loading placeholders for feeds, navigation lists and cards.
sidebar:
  order: 12
---

Skeleton placeholders built on the shadcn `Skeleton`. Use them in `loading.tsx` files and Suspense fallbacks instead of hand-rolled pulsing `<div>`s. All are exported from `@/components/ui/skeletons` (and re-exported from `@/components/ui`). None of these files declares `"use client"`.

## PostSkeleton

Fixed-height (`h-48`) placeholder shaped like a post card: avatar and name lines, two body lines, and a footer row with three action pills.

- **Source:** [src/components/ui/skeletons/PostSkeleton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/skeletons/PostSkeleton.tsx)
- **Kind:** Server component
- **Used in:** `src/app/(main)/(feed)/(public)/posts/loading.tsx`, `src/app/(main)/(feed)/(private)/account/posts/AccountPostsClient.tsx`, `src/app/(main)/(profile)/organizations/[slug]/layout.tsx`

Takes no props.

```tsx
<PostSkeleton />
```

## ContentSkeletonList

Renders a given skeleton component `count` times inside a vertically spaced `<section>`.

- **Source:** [src/components/ui/skeletons/ContentSkeletonList.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/skeletons/ContentSkeletonList.tsx)
- **Kind:** Server component
- **Used in:** `src/app/(main)/(profile)/organizations/[slug]/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `SkeletonComponent` | `() => ReactNode` | — | Component to repeat (passed as a component, not an element). |
| `count` | `number` | `3` | Number of copies. |

```tsx
<Suspense fallback={<ContentSkeletonList SkeletonComponent={PostSkeleton} />}>
  {children}
</Suspense>
```

## SkeletonCard

Generic skeleton container with padding and theme-aware background; you supply the inner placeholder shapes.

- **Source:** [src/components/ui/skeletons/SkeletonCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/skeletons/SkeletonCard.tsx)
- **Kind:** Server component
- **Used in:** No call sites outside the barrel exports.

| Prop | Type | Default | Description |
|---|---|---|---|
| `height` | `string` | `"h-[25dvh]"` | Tailwind height class. |
| `className` | `string` | — | Extra classes, merged with `cn`. |
| `children` | `ReactNode` | — | Inner placeholder content (required). |

The same file exports `skeletonItemClass` (`"bg-bg-subtle dark:bg-accent"`), the background class intended for the inner shapes.

## NavSkeleton

Placeholder for a vertical navigation list.

- **Source:** [src/components/ui/skeletons/NavSkeleton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/skeletons/NavSkeleton.tsx)
- **Kind:** Server component
- **Used in:** No call sites outside the barrel exports.

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` | `number` | `8` | Number of rows. |
| `variant` | `"simple" \| "compound"` | `"simple"` | `simple`: full-width `h-10` bars. `compound`: bordered boxes each holding a title line and a shorter subtitle line. |
