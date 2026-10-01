---
title: "Skeletons"
description: Loading placeholders for feeds, navigation lists and cards.
sidebar:
  order: 12
---

Skeleton placeholders built on the shadcn `Skeleton`. Use them in `loading.tsx` files and Suspense fallbacks instead of hand-rolled pulsing `<div>`s. Import from `@/components/ui/skeletons` (also re-exported from `@/components/ui`). See also [Cards, Feeds & Layout Shells](../../../design-system/cards-and-layout/).

## PostSkeleton

A fixed-height placeholder shaped like a post card. It takes no props.

**Source:** [src/components/ui/skeletons/PostSkeleton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/skeletons/PostSkeleton.tsx)

## ContentSkeletonList

Renders a given skeleton component `count` times. This is the usual Suspense fallback for feeds.

```tsx
<Suspense fallback={<ContentSkeletonList SkeletonComponent={PostSkeleton} />}>
  {children}
</Suspense>
```

**Source:** [src/components/ui/skeletons/ContentSkeletonList.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/skeletons/ContentSkeletonList.tsx)

## Unused

`SkeletonCard` (a generic padded container, plus the `skeletonItemClass` helper for inner shapes) and `NavSkeleton` (a vertical nav list placeholder) are exported but have no call sites.

**Source:** [SkeletonCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/skeletons/SkeletonCard.tsx), [NavSkeleton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/skeletons/NavSkeleton.tsx)
