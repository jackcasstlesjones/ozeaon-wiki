---
title: "UI: Misc"
description: Top-level files in components/ui — the sidebar system, PasswordInput, ExternalLink, DynamicMarker, getFeatureMarker and the root barrel.
sidebar:
  order: 10
---

Files that sit directly in `src/components/ui/` rather than in a subfolder. The most important is `sidebar.tsx`, which owns the open/collapsed state for the app's left rail.

## SidebarProvider

Context provider for sidebar state. Wraps each `(main)` route-group layout; the open state is resolved on the server from a cookie and passed in as `defaultOpen`.

- **Source:** [src/components/ui/sidebar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/sidebar.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/app/(main)/(feed)/layout.tsx`, `src/app/(main)/(dashboard)/layout.tsx`, `src/app/(main)/(reader)/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `pageType` | `SidebarPageType` (`"feed" \| "single-entity" \| "settings"`) | `"feed"` | Which persisted preference to read and write. `"settings"` sets `sidebarAvailable` to `false`. |
| `defaultOpen` | `boolean` | — | Required. Initial open state; server layouts should pass the cookie-resolved value so the first HTML matches. |
| `open` | `boolean` | — | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Controlled setter; used instead of internal state when provided. |

Plus all `<div>` props (applied to the `data-slot="sidebar-wrapper"` div, which also sets the `--sidebar-width` (232px) and `--sidebar-width-icon` (3rem) CSS variables).

Notable behaviour:

- Every `setOpen` call persists the value via `persistSidebarOpen(pageType, value)` (from `@/utils/data/sidebar-state`).
- On mount and on every pathname change it re-reads the sidebar cookie and, for persisted page types, applies the stored value.
- `Cmd+B` / `Ctrl+B` toggles the sidebar (window `keydown` listener).
- `isMobile` is hard-coded to `false`, so the mobile `Sheet` path in `Sidebar` and `openMobile` are currently never used.

```tsx
<SidebarProvider pageType="feed" defaultOpen={sidebarOpen}>
  <TwoColumnShell topbar={<AppTopbar />} sidebar={<AppSidebar />}>
    {children}
  </TwoColumnShell>
</SidebarProvider>
```

## useSidebar / useSidebarSafe

Hooks returning the sidebar context: `{ pageType, sidebarAvailable, state ("expanded" | "collapsed"), open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }`.

- **Source:** [src/components/ui/sidebar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/sidebar.tsx)
- **Used in:** `src/components/nav/SideNav.tsx` (`useSidebar`), `src/components/nav/TopNav.tsx` (`useSidebarSafe`)

- `useSidebar` throws if there is no `SidebarProvider` above it.
- `useSidebarSafe` returns a closed, unavailable (`pageType: "settings"`, `sidebarAvailable: false`) fallback with no-op setters instead of throwing. Use it in components that can render outside a provider.

## Sidebar

The sidebar container itself.

- **Source:** [src/components/ui/sidebar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/sidebar.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/nav/SideNav.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"left" \| "right"` | `"left"` | Which edge it sits on. |
| `variant` | `"sidebar" \| "floating" \| "inset"` | `"sidebar"` | `floating` adds a border, radius and shadow to the inner panel; `floating`/`inset` add padding. |
| `collapsible` | `"offcanvas" \| "icon" \| "none"` | `"offcanvas"` | Collapse behaviour. `none` renders a plain fixed-width div. |

Plus all `<div>` props (applied to the fixed `sidebar-container` div on desktop).

Notable behaviour:

- On desktop it renders an `<aside>` (hidden below `md`) with `data-state`, `data-collapsible`, `data-variant` and `data-side` attributes, a width-reserving gap div, and a `fixed top-14` container.
- `AppSidebar` in `SideNav.tsx` returns `null` when `open` is false, so in practice the app hides the sidebar rather than using the collapsed styles.

```tsx
const { open } = useSidebar();
if (!open) return null;

return (
  <Sidebar
    {...props}
    suppressHydrationWarning
    className={cn(props.className, "transition-all", STICKY_NAV_CLASS, "hidden md:flex w-58")}
  >
    ...
  </Sidebar>
);
```

### Sidebar sub-components

The remaining exports are shadcn-style sidebar parts restyled with project tokens. None of them is used outside `sidebar.tsx` at this commit. Each accepts the props of the element it renders and sets `data-slot` / `data-sidebar` attributes.

| Component | Renders | Extra props / notes |
|---|---|---|
| `SidebarTrigger` | shadcn `Button` (ghost, icon) with `PanelLeftIcon` | Calls `toggleSidebar()` after your `onClick`. |
| `SidebarRail` | `<button>` | Thin edge hit-area that toggles the sidebar; `tabIndex={-1}`. |
| `SidebarInset` | `<main>` | Content area; adds margin/radius when the sidebar `variant` is `inset`. |
| `SidebarInput` | shadcn `Input` | `h-8`, surface background. |
| `SidebarHeader` / `SidebarFooter` | `<div>` | `flex flex-col gap-2 p-2`. |
| `SidebarSeparator` | shadcn `Separator` | `mx-2`. |
| `SidebarContent` | `<div>` | Passes props through with no styling (its classes are commented out). |
| `SidebarGroup` | `<div>` | Relative flex column. |
| `SidebarGroupLabel` | `<div>` | `asChild?: boolean`. Hidden in icon-collapsed mode. |
| `SidebarGroupAction` | `<button>` | `asChild?: boolean`. Absolutely positioned top-right. |
| `SidebarGroupContent` | `<div>` | `font-body-sm`. |
| `SidebarMenu` / `SidebarMenuItem` | `<ul>` / `<li>` | |
| `SidebarMenuButton` | `<button>` | `asChild?`, `isActive?` (sets `data-active`), `variant?: "default" \| "outline"`, `size?: "default" \| "sm" \| "lg"`, `tooltip?: string \| TooltipContent props` (shown only when collapsed). |
| `SidebarMenuAction` | `<button>` | `asChild?`, `showOnHover?` (hidden on `md+` until the item is hovered/focused). |
| `SidebarMenuBadge` | `<div>` | Positioned according to the sibling button's `data-size`. |
| `SidebarMenuSkeleton` | `<div>` with shadcn `Skeleton`s | `showIcon?: boolean`. Text bar is fixed at 80% max width. |
| `SidebarMenuSub` / `SidebarMenuSubItem` | `<ul>` / `<li>` | Indented with a left border. |
| `SidebarMenuSubButton` | `<a>` | `asChild?`, `size?: "sm" \| "md"` (default `"md"`), `isActive?`. |

## PasswordInput

shadcn `Input` with an eye/eye-off button that toggles between `type="password"` and `type="text"`.

- **Source:** [src/components/ui/password-input.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/password-input.tsx)
- **Kind:** Client component (`"use client"`), `forwardRef` to the `<input>`
- **Used in:** `src/components/account/ChangePasswordDialog.tsx`, `src/components/ui/forms/hook-form/InputPassword.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `show` | `boolean` | — | Controlled visibility. When set, the toggle calls `onToggle` instead of updating internal state. |
| `onToggle` | `() => void` | — | Toggle handler for controlled mode. |

Plus all `<input>` props (`type` is overridden by the visibility state).

Notable behaviour:

- The toggle button has `tabIndex={-1}` and no accessible label.
- If `show` is set without `onToggle`, clicking flips internal state, which has no visible effect because `show` wins.
- For React Hook Form, use the `InputPassword` wrapper (see [UI: Forms](../forms/)).

```tsx
<PasswordInput
  id="current-password"
  autoComplete="current-password"
  value={currentPwd}
  onChange={(e) => setCurrentPwd(e.target.value)}
  disabled={isLoading}
/>
```

## ExternalLink

`<a>` that opens in a new tab with `rel="noopener noreferrer"`, styled as a muted `flex items-center gap-1.5` row for icon + text.

- **Source:** [src/components/ui/ExternalLink.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/ExternalLink.tsx)
- **Kind:** Server component
- **Used in:** No call sites outside the barrel exports.

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | Link target. |
| `children` | `ReactNode` | — | Link content. |
| `className` | `string` | — | Extra classes, merged with `cn`. |

## DynamicMarker

Async server component that renders nothing but calls `connection()` from `next/server` inside a `Suspense` boundary, opting the surrounding route into dynamic rendering.

- **Source:** [src/components/ui/DynamicMarker.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/DynamicMarker.tsx)
- **Kind:** Server component (async), default export
- **Used in:** `src/app/(main)/(feed)/(private)/layout.tsx`

Takes no props. Import from `@/components/ui/DynamicMarker`; it is not in the barrel.

```tsx
<Suspense fallback={null}>
  <DynamicMarker />
  {children}
</Suspense>
```

## getFeatureMarker

Helper function (not a component) in `utils.tsx` that returns a green `✓` or red `x` `<div>` for a boolean.

- **Source:** [src/components/ui/utils.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/utils.tsx)
- **Used in:** `src/app/(main)/(feed)/(private)/account/posts/AccountPostsClient.tsx`

Signature: `getFeatureMarker(flag = false): JSX.Element`. Import from `@/components/ui/utils`.

```tsx
{getFeatureMarker(post.comments_enabled)}
<p className="font-label">Allow comment</p>
```

## Root barrel (`index.ts`)

[src/components/ui/index.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/index.ts) re-exports a curated subset as `@/components/ui`: the three `CondensedCard*` primitives; `LoadingButton`, `ButtonGroup`, `IconButton`, `LikeButton`; everything from `./inputs`; `EmptyState`, `DateDisplay`, `CardFooter`, `Text`, `DocumentMetadata`, `AttachedItemCard`; `CardComments`, `CommentToggle`, `EntityComments`; `ImageContainer`; `CarouselSection`, `Footer`, `GridLayout`, `ResponsiveCardList`, `SectionHeading`, `Heading`, `headingVariants`, `TwoColumnShell`, `SidebarShell` and the four layout class constants; all skeletons; shadcn `Skeleton`; all four overlays; `ErrorFallback`, `FormErrorBanner`; `ExternalLink`; `PasswordInput`; and every `sidebar.tsx` export. Matching prop types are re-exported alongside. Anything not listed (for example `Carousel`, `NavTabs`, `FlexBox`, `FilterTabs`, `ZoomableImage`, `GenericInfiniteFeed`, `DynamicMarker`, `getFeatureMarker`) must be imported from its subfolder or file.
