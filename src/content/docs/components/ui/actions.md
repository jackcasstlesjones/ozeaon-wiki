---
title: "Actions"
description: Button-style controls — loading button, icon button, like toggle and button grouping.
sidebar:
  order: 1
---

Action primitives built on the shadcn `Button` or a plain `<button>`, imported from `@/components/ui/actions`. Use them instead of rolling your own spinner button, badge icon button or heart toggle.

## LoadingButton

A `Button` that disables itself and shows a spinner (or `loadingText`) while `isLoading` is true. Use it for any submit or async action. Icons are dropped while loading.

**Source:** [src/components/ui/actions/LoadingButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/actions/LoadingButton.tsx)

## IconButton

A square icon-only button with an optional numeric badge or dot, for toolbar and nav icons. `label` is required and becomes the `aria-label`.

**Source:** [src/components/ui/actions/IconButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/actions/IconButton.tsx)

## LikeButton

A heart toggle with a count, shared by posts and comments. It is purely presentational: the caller owns the liked state and persistence. The count sits in a fixed-width slot so the layout doesn't shift as the number changes.

**Source:** [src/components/ui/actions/LikeButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/actions/LikeButton.tsx)

## ButtonGroup

A flex wrapper with `role="group"` for laying out related buttons.

**Source:** [src/components/ui/actions/ButtonGroup.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/actions/ButtonGroup.tsx)
