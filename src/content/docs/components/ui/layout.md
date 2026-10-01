---
title: "Layout"
description: Page shells, layout constants, grids, flex containers, headings, carousels, tabs and the generic infinite feed.
sidebar:
  order: 9
---

Structural building blocks for pages and sections, imported from `@/components/ui/layout`. The root `@/components/ui` barrel re-exports most of them, but not `Carousel`, `NavTabs`, `FlexBox` or `FilterTabs`. See also [Cards & Layout](../../../design-system/cards-and-layout/).

## Layout Constants

`CONTENT_MAX_WIDTH_CLASS` (the centred content cap), `CONTENT_GUTTER_CLASS` (the responsive side gutter), and `STICKY_ASIDE_CLASS` / `STICKY_NAV_CLASS` (sticky rails below the top bar). Shells and route layouts use these class strings. Reuse them rather than re-typing the values.

**Source:** [src/components/ui/layout/constants.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/constants.ts)

## TwoColumnShell

The full-height page shell: top bar, then the sidebar plus a centred `<main>` column, then the footer. The feed and dashboard layouts use it.

**Source:** [src/components/ui/layout/shells/TwoColumnShell.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/shells/TwoColumnShell.tsx)

## SidebarShell

The sticky left-rail wrapper for sidebars, hidden below `md`. It takes only `children`; there is no icon-only or collapsed size.

**Source:** [src/components/ui/layout/shells/SidebarShell.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/shells/SidebarShell.tsx)

## Footer

The site footer, with the copyright line, an ozeaon.com link and the terms/privacy links.

**Source:** [src/components/ui/layout/Footer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/Footer.tsx)

## GridLayout

A responsive grid with per-breakpoint column counts and a fixed gap scale. Use it instead of raw `grid` classes.

**Source:** [src/components/ui/layout/GridLayout.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/GridLayout.tsx)

## FlexBox

A polymorphic flex container with typed direction, wrap, justify and align props.

**Source:** [src/components/ui/layout/FlexBox.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/FlexBox.tsx)

## SectionHeading

A heading with an optional description and an optional right-hand action slot. `Heading` is the same component. Use it instead of hand-styled headings.

**Source:** [src/components/ui/layout/SectionHeading.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/SectionHeading.tsx)

## Carousel and CarouselSection

`Carousel` is a horizontal snap-scrolling strip with edge fades, and scroll buttons that appear only when there is more content in that direction. `CarouselSection` puts a `SectionHeading` above one.

**Source:** [src/components/ui/layout/Carousel.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/Carousel.tsx)

## NavTabs and FilterTabs

`NavTabs` is route-based: `next/link` tabs, with the active tab taken from the pathname. `FilterTabs` is state-based, with ARIA tab semantics and arrow-key navigation. Use these instead of custom tab markup.

**Source:** [src/components/ui/layout/NavTabs.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/NavTabs.tsx)

## ResponsiveCardList

A vertical card stack that becomes a bordered surface panel from `md` up.

**Source:** [src/components/ui/layout/ResponsiveCardList.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/ResponsiveCardList.tsx)

## GenericInfiniteFeed

Client-side infinite scroll over `/api/<entity>` (`articles`, `projects`, `organizations`, `search` or `users`), seeded with server-rendered items. Gotchas:

- The first fetch is page 2, because the server renders page 1.
- `hasMore` stays true only while each response is a full page. An empty response or an error stops loading.
- Items are de-duplicated by `id`. Requests use `fetchWithRetry`.
- Responses for a stale request (entity, order or params changed mid-flight) are discarded, and a new `initial` array resets the list.

It's a default export, imported from `@/components/ui/layout/GenericInfiniteFeed`.

**Source:** [src/components/ui/layout/GenericInfiniteFeed.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/GenericInfiniteFeed.tsx)
