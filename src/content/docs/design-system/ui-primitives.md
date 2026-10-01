---
title: "UI Primitives"
sidebar:
  order: 2
description: An overview of the shared presentational components in src/components/ui and how to import them.
---

`src/components/ui/` is the shared presentational layer used across every feature area. It is split into eleven domain-scoped folders, each with an `index.ts` barrel, plus a handful of root-level utility files. Consumers import from the root barrel (`@/components/ui`) rather than from per-folder paths.

## Folders

Each folder has a dedicated catalog page:

- [actions](../../components/ui/actions/) — button-shaped primitives: `ButtonGroup`, `IconButton`, `LikeButton`, `LoadingButton`
- [cards](../../components/ui/cards/) — card shells and surfaces: `CondensedCard*`, `CollapsibleCard`
- [comments](../../components/ui/comments/) — comment thread components: `EntityComments`, `CommentThread`, `CommentForm`, and friends
- [display](../../components/ui/display/) — read-only fragments: `CategoryBadges`, `CardFooter`, `Tags`, `EmptyState`, and ~15 others
- [errors](../../components/ui/errors/) — error UI components
- [forms](../../components/ui/forms/) — form wrappers and field primitives
- [images](../../components/ui/images/) — image display utilities
- [inputs](../../components/ui/inputs/) — controlled input components
- [layout](../../components/ui/layout/) — layout shells and feed utilities: `GenericInfiniteFeed`, `ResponsiveCardList`, `TwoColumnShell`, `SidebarShell`
- [overlays](../../components/ui/overlays/) — modals, drawers, and popovers
- [skeletons](../../components/ui/skeletons/) — loading skeleton components

Root-level files (`ExternalLink.tsx`, `DynamicMarker.tsx`, `sidebar.tsx`, `utils.tsx`) provide loose utilities not large enough for their own folder.

## Import Convention

Import from the root barrel. The root `index.ts` re-exports everything from the folder barrels, so there is no need to reach into a subfolder:

```tsx
import { IconButton, EntityComments, TwoColumnShell } from "@/components/ui";
```

Feature components (`src/components/articles`, `src/components/projects`, etc.) follow the same pattern and compose from this layer rather than duplicating it.

## Related Links

- [src/components/ui](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui) — folder tree
- [Design Tokens](../design-tokens/) — color and typography tokens used by these components
- [Cards & Layout](../cards-and-layout/) — how layout shells and card components are composed
