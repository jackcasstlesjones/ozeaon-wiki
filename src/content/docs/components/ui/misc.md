---
title: "Sidebar & Utilities"
description: Top-level files in components/ui — the sidebar system, PasswordInput, ExternalLink, DynamicMarker, getFeatureMarker and the root barrel.
sidebar:
  order: 10
---

Files that sit directly in `src/components/ui/` rather than in a subfolder. The most important is `sidebar.tsx`, which owns the open/collapsed state of the app's left rail. See also [Navigation System](../../../design-system/navigation-system/).

## Sidebar System

`SidebarProvider` wraps each `(main)` route-group layout and owns the sidebar state per `pageType`. The open state persists in the `oz_sidebar_state` cookie and is resolved on the server into `defaultOpen`, so the first render has no layout shift. Cmd/Ctrl+B toggles it. `useSidebar()` reads the context, and `useSidebarSafe()` falls back to closed outside a provider.

Gotchas:

- `isMobile` is hard-coded to `false`, so the mobile Sheet path inside `sidebar.tsx` is dead code. Mobile navigation uses the nav components instead.
- `AppSidebar` hides rather than collapses: when closed it renders nothing.
- The many shadcn-style sub-components exported from `sidebar.tsx` aren't used outside that file.

**Source:** [src/components/ui/sidebar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/sidebar.tsx)

## PasswordInput

A shadcn `Input` with a show/hide toggle.

**Source:** [src/components/ui/password-input.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/password-input.tsx)

## ExternalLink

An `<a>` that opens in a new tab with `rel="noopener noreferrer"`, styled for an icon plus text.

**Source:** [src/components/ui/ExternalLink.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/ExternalLink.tsx)

## DynamicMarker

An async server component that renders nothing but calls `connection()`, which opts the surrounding route into dynamic rendering. Use it where a route must not prerender but makes no cookie-reading Supabase call, as in the `(feed)/(private)` layout. See [SSR, Rendering & Caching](../../../architecture/ssr-rendering-and-caching/).

**Source:** [src/components/ui/DynamicMarker.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/DynamicMarker.tsx)

## getFeatureMarker

A helper in `utils.tsx`, not a component. It returns a green ✓ or red ✗ for a boolean.

**Source:** [src/components/ui/utils.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/utils.tsx)

## Root Barrel

`@/components/ui` re-exports a curated subset of the folders documented on the other UI pages. It notably leaves out `Carousel`, `NavTabs`, `FlexBox`, `FilterTabs`, `ZoomableImage`, `GenericInfiniteFeed` and `DynamicMarker`, which are imported by path.

**Source:** [src/components/ui/index.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/index.ts)
