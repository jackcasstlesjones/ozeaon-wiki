---
title: "Layout"
description: Page shells, layout constants, grids, flex containers, headings, carousels, tabs and the generic infinite feed.
sidebar:
  order: 9
---

Structural building blocks for pages and sections. Use `GridLayout` instead of raw `grid` classes, `SectionHeading` instead of hand-styled headings, and `NavTabs`/`FilterTabs` instead of custom tab markup. Everything except `GenericInfiniteFeed` is exported from `@/components/ui/layout`. The root `@/components/ui` barrel re-exports most of them but not `Carousel`, `NavTabs`, `FlexBox` or `FilterTabs`. `GenericInfiniteFeed` is a default export imported from `@/components/ui/layout/GenericInfiniteFeed`.

## Layout constants

`src/components/ui/layout/constants.ts` exports Tailwind class strings shared by the shells and route layouts.

- **Source:** [src/components/ui/layout/constants.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/constants.ts)
- **Used in:** `src/app/(main)/(reader)/layout.tsx`, `src/components/nav/SideNav.tsx`, `src/components/profiles/shared/ProfilePageShell.tsx`

| Constant | Value | Purpose |
|---|---|---|
| `CONTENT_MAX_WIDTH_CLASS` | `max-w-[1048px]` | Reading-measure cap for the content column. |
| `CONTENT_GUTTER_CLASS` | `px-4 md:px-11` | Horizontal gutter between the 232px rails and the content column. |
| `STICKY_ASIDE_CLASS` | `sticky top-14 z-10 max-h-[calc(100svh-7rem)]` | Sticky side rail below the topbar, capped above the footer; pair with `h-fit` content. |
| `STICKY_NAV_CLASS` | `sticky top-14 z-10 h-[calc(100svh-7rem)]` | Sticky nav rail that claims the full remaining height. |

## TwoColumnShell

Full-height page shell: topbar, then a row of sidebar plus a centred `<main>` column (gutter and max width from the constants above), then the `Footer`.

- **Source:** [src/components/ui/layout/shells/TwoColumnShell.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/shells/TwoColumnShell.tsx)
- **Kind:** Server component
- **Used in:** `src/app/(main)/(feed)/layout.tsx`, `src/app/(main)/(dashboard)/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `topbar` | `ReactNode` | — | Rendered above the columns. |
| `sidebar` | `ReactNode` | — | Left column. |
| `children` | `ReactNode` | — | Main content. |

```tsx
<SidebarProvider pageType="feed" defaultOpen={sidebarOpen}>
  <TwoColumnShell topbar={<AppTopbar />} sidebar={<AppSidebar />}>
    {children}
  </TwoColumnShell>
</SidebarProvider>
```

## SidebarShell

Sticky, 232px-wide (`w-58`) left rail wrapper using `STICKY_NAV_CLASS`. Hidden below `md`.

- **Source:** [src/components/ui/layout/shells/SidebarShell.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/shells/SidebarShell.tsx)
- **Kind:** Server component
- **Used in:** `src/components/nav/DashboardSidebar.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Rail content, laid out in a padded flex column. |

## Footer

Site footer with the copyright year, an external link to ozeaon.com, and internal links to `/terms` and `/privacy`.

- **Source:** [src/components/ui/layout/Footer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/Footer.tsx)
- **Kind:** Server component
- **Used in:** `src/components/ui/layout/shells/TwoColumnShell.tsx`, `src/app/(main)/(profile)/layout.tsx`, `src/app/(main)/(reader)/layout.tsx`

Takes no props. The links are hard-coded in the file.

## GridLayout

Responsive CSS grid with column counts per breakpoint and a fixed gap scale.

- **Source:** [src/components/ui/layout/GridLayout.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/GridLayout.tsx)
- **Kind:** Server component
- **Used in:** `src/components/projects/page/sections/TeamSection.tsx`, `src/components/home/ActivitySlot.tsx`, `src/components/profiles/users/images/ImageGalleryList.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Grid items. |
| `columns` | `{ base?, sm?, md?, lg?, xl?, "2xl"? }`, each `1`–`6` | `{ base: 1, sm: 2, lg: 3 }` | Column count per breakpoint. Passing an object replaces the default entirely. |
| `gap` | `"sm" \| "md" \| "lg"` | `"md"` | `gap-3` / `gap-4` / `gap-6`. |
| `className` | `string` | — | Extra classes. |

```tsx
<GridLayout columns={{ base: 1, sm: 2 }} gap="md" className="items-start">
  {team.map((member, i) => (
    <UserCard
      key={member.id ?? `team-${i}`}
      user={teamMemberToUserCard(member, `team-${i}`)}
      role={member.role}
      bio={member.bio}
    />
  ))}
</GridLayout>
```

## FlexBox

Polymorphic flex container with typed props for direction, wrap, justify and align.

- **Source:** [src/components/ui/layout/FlexBox.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/FlexBox.tsx)
- **Kind:** Server component
- **Used in:** `src/components/articles/cards/ArticleCard.tsx`, `src/components/articles/cards/CondensedArticleCard.tsx`, `src/components/projects/cards/MyProjectCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `keyof JSX.IntrinsicElements` | `"div"` | Element to render. |
| `direction` | `"row" \| "column"` | `"row"` | `column` adds `flex-col`. |
| `wrap` | `"wrap" \| "nowrap"` | — | `flex-wrap` / `flex-nowrap`. |
| `justify` | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly" \| "stretch"` | — | Maps to `justify-*`. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | — | Maps to `items-*`. |
| `className` | `ClassNameValue` (tailwind-merge) | — | Merged with `cn`. |
| `children` | `ReactNode` | — | Required. |

Plus all props of the element given by `as` (except `className`, which is retyped).

```tsx
<FlexBox
  as="article"
  direction="column"
  className="bg-bg-surface border-border relative gap-0 overflow-hidden rounded-md border"
>
  ...
</FlexBox>
```

## SectionHeading / Heading

Heading with optional description below and optional action slot on the right. `SectionHeading` and `Heading` are the same component; `headingVariants` is the underlying `cva` and is also exported.

- **Source:** [src/components/ui/layout/SectionHeading.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/SectionHeading.tsx)
- **Kind:** Server component
- **Used in:** `src/app/(main)/(feed)/(public)/articles/page.tsx`, `src/components/profiles/organizations/sections/MembersSection.tsx`, `src/components/projects/cards/CondensedProjectCard.tsx` (as `Heading`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h1" \| "h2" \| "h3" \| "h4"` | `"h2"` | Heading tag. |
| `title` | `string` | — | Heading text; falls back to `children` when omitted. |
| `description` | `string` | — | Paragraph below the heading (`font-body text-secondary`). |
| `action` | `ReactNode` | — | Right-aligned slot beside the heading. |
| `variant` | `"heading" \| "title" \| "display"` | `"heading"` | Type family. |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size within the family. |
| `textColor` | `"default" \| "secondary" \| "muted" \| "subtle"` | `"default"` | `text-primary` / `text-secondary` / `text-muted` / `text-subtle`. |

Plus all `<h1>`–`<h4>` HTML attributes except `color`; `className` applies to the heading tag, not the wrapper.

Variant/size mapping:

| variant | sm | md | lg | xl |
|---|---|---|---|---|
| `heading` | `font-h4` | `font-h3` | `font-h2` | `font-display` |
| `title` | `font-content-title-sm` | `font-content-title` | `font-content-title-lg` | (none) |
| `display` | `font-display` | `font-display` | `font-display` | `font-display` |

```tsx
<SectionHeading
  as="h1"
  variant="display"
  title="Articles"
  description="Read latest community research, focused on everything sustainable."
/>
```

## Carousel

Horizontal snap-scrolling strip with edge fade masks and left/right scroll buttons that appear only when there is more content in that direction.

- **Source:** [src/components/ui/layout/Carousel.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/Carousel.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/posts/attachments/PostImages.tsx`, `src/components/articles/pages/ArticleMediaSection.tsx`, `src/components/ui/layout/CarouselSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Carousel items. |
| `scrollClasses` | `ClassValue` | — | Extra classes for the scrolling track. |
| `containerClassName` | `ClassValue` | — | Extra classes for the outer wrapper. |
| `ariaLabel` | `string` | `"Scrollable content"` | `aria-label` on the scroll region. |

Notable behaviour:

- The track is a focusable `role="region"`; the scrollbar is hidden.
- Scroll buttons move 400px with smooth scrolling. Scroll state is checked on mount and on every scroll event, not on resize.

```tsx
<Carousel containerClassName={className} scrollClasses="pb-0">
  {images.map((image) => (
    <div key={image.id}>...</div>
  ))}
</Carousel>
```

## CarouselSection

A `SectionHeading` (`h2`, secondary colour, `md:font-h2`) above a `Carousel` labelled `"{title} carousel"`.

- **Source:** [src/components/ui/layout/CarouselSection.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/CarouselSection.tsx)
- **Kind:** Server component (renders the client `Carousel`)
- **Used in:** `src/app/(main)/(feed)/(public)/(home)/page.tsx`, `src/components/profiles/organizations/sections/ActiveProjectsSection.tsx`, `src/components/projects/page/sections/RelatedContentSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Section heading and carousel label. |
| `action` | `ReactNode` | — | Heading action slot. |
| `children` | `ReactNode` | — | Carousel items. |

```tsx
<CarouselSection title="Active Projects">
  {active.map((p) => (
    <CondensedProjectCard key={p.id} project={p} className="w-full" />
  ))}
</CarouselSection>
```

## NavTabs

Route-based tab bar of `next/link` links; the active tab is derived from the current pathname.

- **Source:** [src/components/ui/layout/NavTabs.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/NavTabs.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/app/(main)/(profile)/profiles/[username]/layout.tsx`, `src/app/(main)/(profile)/organizations/[slug]/layout.tsx`, `src/components/organizations/OrganizationsTabs.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `NavTab[]` | — | Tab definitions (see below). |
| `variant` | `"underline" \| "pill"` | — | Required. Underline border or filled pill for the active tab. |
| `ariaLabel` | `string` | `"Page tabs"` | `aria-label` on the `<nav>`. |
| `scroll` | `boolean` | — | Passed to `Link`'s `scroll`. |

`NavTab`: `{ label: string; href: string; disabled?: boolean; badge?: string; count?: number }`. `badge` renders an info `Badge` (e.g. "Soon"); `count` renders inline as ` (n)` and is hidden at zero.

Notable behaviour:

- Active tab: exact `href` match first, otherwise the longest `href` that the pathname starts with (followed by `/`).
- Disabled tabs render as a `<span aria-disabled="true">`, not a link.
- Links use `prefetch={false}`, set `aria-current="page"` on the active tab, and pass `transitionTypes` `["nav-forward"]` / `["nav-back"]` plus a `data-dir` attribute based on position relative to the active tab.

```tsx
<NavTabs
  ariaLabel="Profile sections"
  tabs={PROFILE_TABS(username, articleCount, projectCount)}
  variant="underline"
/>
```

## FilterTabs

State-driven (not route-driven) tab bar with ARIA tab semantics and arrow-key navigation.

- **Source:** [src/components/ui/layout/FilterTabs.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/FilterTabs.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/articles/pages/dashboard/PrivateArticlesInfiniteFeed.tsx`, `src/components/projects/pages/dashboard/PrivateProjectsInfiniteFeed.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `FilterTab<T>[]` | — | `{ label: string; value: T; badge?: string }`, `T extends string`. |
| `currentValue` | `T` | — | Selected value. Falls back to the first tab if not found. |
| `onTabChange` | `(value: T) => void` | — | Called on click and on arrow-key moves. |
| `ariaLabel` | `string` | `"Filter tabs"` | `aria-label` on the tablist. |

Notable behaviour:

- Renders `role="tablist"` with `role="tab"` buttons; only the active tab is in the tab order (roving `tabIndex`).
- Left/Right arrows wrap around, move focus and call `onTabChange` immediately.
- Each tab sets `id="filter-tab-{value}"` and `aria-controls="filter-tabpanel-{value}"`; the caller is responsible for rendering a panel with that id.

```tsx
<FilterTabs
  currentValue={filter}
  onTabChange={(value: FilterValue) => {
    if (value === filter) return;
    router.push(`?filter=${value}`);
  }}
  tabs={TABS}
/>
```

## ResponsiveCardList

Vertical card stack that becomes a bordered, padded surface panel from `md` up.

- **Source:** [src/components/ui/layout/ResponsiveCardList.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/ResponsiveCardList.tsx)
- **Kind:** Server component
- **Used in:** `src/app/(main)/(dashboard)/settings/(personal)/organizations/page.tsx`, `src/app/(main)/(dashboard)/settings/(personal)/organizations/invitations/page.tsx`, `src/app/(main)/(dashboard)/settings/(personal)/organizations/requests/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Cards. |
| `className` | `string` | — | Extra classes. |

```tsx
<ResponsiveCardList>
  {memberships.map((membership) => (
    <UserMembershipCard
      key={membership.id}
      membership={membership}
      userId={user.id}
    />
  ))}
</ResponsiveCardList>
```

## GenericInfiniteFeed

Client-side infinite scroll over one of the `/api/<entity>` list endpoints, seeded with server-rendered initial items.

- **Source:** [src/components/ui/layout/GenericInfiniteFeed.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/GenericInfiniteFeed.tsx)
- **Kind:** Client component (`"use client"`), default export
- **Used in:** `src/components/articles/ArticlesInfiniteFeed.tsx`, `src/components/articles/pages/dashboard/PrivateArticlesInfiniteFeed.tsx`, `src/components/users/NetworkInfiniteFeed.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `initial` | `T[]` (`T extends { id: string }`) | — | First page of items. |
| `entity` | `"articles" \| "projects" \| "organizations" \| "search" \| "users"` | — | Endpoint: `/api/{entity}`. |
| `renderItem` | `(item: T) => ReactNode` | — | Item renderer. |
| `limit` | `number` | `5` | Page size (`limit` query param). |
| `orderBy` | `string` | — | `orderBy` query param; `orderDir` is only sent when this is set. |
| `orderDir` | `"asc" \| "desc"` | `"desc"` | `orderDir` query param. |
| `extraParams` | `Record<string, string \| number \| boolean>` | — | Extra query params. |
| `wrapperClassName` | `string` | `"flex flex-col gap-4 mt-3"` | Classes on the items wrapper. |
| `wrapperProps` | `HTMLAttributes<HTMLDivElement>` (minus `className`) | — | Extra props on the items wrapper. |

Notable behaviour:

- An `IntersectionObserver` (100px root margin) on a sentinel below the list advances the page; `page` starts at 1, so the first fetch is page 2.
- `hasMore` starts true only if `initial.length === limit`, and stays true while each response returns a full page. An empty response or a fetch error stops loading.
- Items are de-duplicated by `id` when appended. Requests go through `fetchWithRetry`, with URLs built against `env.baseUrl`.
- Responses for a stale request key (entity/limit/order/params changed mid-flight) are discarded. A new `initial` array resets the list to page 1.
- Shows "Loading more…" in the sentinel while fetching.

```tsx
<GenericInfiniteFeed
  initial={initial}
  entity="articles"
  limit={limit}
  orderBy="published_at"
  orderDir="desc"
  extraParams={userId ? { userId } : undefined}
  renderItem={(article) => <ArticleCard article={article} />}
/>
```

Barrel: `layout/index.ts` exports `TwoColumnShell`, `SidebarShell`, the four constants, `Carousel`, `CarouselSection`, `Footer`, `NavTabs` (+ `NavTab`), `GridLayout` (+ `GridLayoutProps`), `ResponsiveCardList`, `SectionHeading`, `Heading`, `headingVariants` (+ `SectionHeadingProps`, `HeadingProps`), `FlexBox` (+ `FlexBoxProps`), `FilterTabs` (+ `FilterTab`). `shells/index.ts` re-exports the two shells.
