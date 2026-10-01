---
title: "Search"
description: The desktop and mobile search fields in the top nav, and the infinite results feed on /search.
sidebar:
  order: 13
---

Search has three pieces. `SearchBar` is the desktop field docked in the top nav's left side; `MobileSearchBar` is the mobile top nav collapsed into a search field (opened by `MobileSearchTrigger` in the nav, see [Navigation](../nav/)). Both submit by navigating to `searchHref(value)`. The `/search` page then renders `SearchResultsFeed`, which pages through mixed result kinds.

Both fields read `useSearchParams()`, so `TopNavClient` wraps each in a `Suspense` boundary to keep static pages prerendering.

- **Barrel:** `src/components/search/index.ts` exports `MobileSearchBar`, `SearchBar`, `SearchResultsFeed`.

## SearchBar

Desktop search form shown in the top nav when no page has replaced the left slot.

- **Source:** [src/components/search/SearchBar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/search/SearchBar.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/nav/TopNav.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `initialQuery` | `string` | — | Seeds the box, overriding `?q=`. |
| `className` | `string` | — | Extra classes on the `<form>`. |

Notable behaviour:

- Initial value is `initialQuery ?? searchParams.get("q") ?? ""`; held in local state after mount.
- Submit calls `router.push(searchHref(value))`.
- A clear button (`aria-label="Clear search"`) appears in the trailing slot while the field has a value; the native WebKit cancel button is hidden.
- Form has `role="search"`.

```tsx
<Suspense fallback={<div className="hidden h-9 w-full max-w-80 md:block" />}>
  <SearchBar className="hidden md:block" />
</Suspense>
```

## MobileSearchBar

The mobile top nav replaced by a full-width search field with a back arrow, clear button and submit button.

- **Source:** [src/components/search/MobileSearchBar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/search/MobileSearchBar.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/nav/TopNav.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `onCloseAction` | `() => void` | — | Closes the bar (non-docked mode). |
| `docked` | `boolean` | `false` | Set on the search page, where the bar stays in place. |
| `className` | `string` | — | Extra classes on the `<form>`. |

Notable behaviour:

- Non-docked: the input autofocuses on mount; submit does `router.push(searchHref(value))` then calls `onCloseAction`.
- Docked: submit uses `router.replace(...)`, so refining a query does not stack history entries; the back arrow and Escape call `safeRouterBack(router, "/")` to leave the page instead of just closing the bar.
- Value re-syncs from `?q=` whenever the query param changes (back/forward navigation).
- Escape anywhere in the form dismisses. Clearing refocuses the input.

```tsx
<Suspense fallback={<div className="h-9 w-full md:hidden" />}>
  <MobileSearchBar
    onCloseAction={closeSearch}
    docked={searchDocked}
    className="md:hidden"
  />
</Suspense>
```

## SearchResultsFeed

Infinite-scrolling list of search results, rendering the matching domain card for each result kind.

- **Source:** [src/components/search/SearchResultsFeed.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/search/SearchResultsFeed.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/app/(main)/(feed)/(public)/search/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `initial` | `SearchResultItem[]` | — | First page of results, fetched on the server. |
| `query` | `string` | — | Search query, forwarded as the `q` param when loading more. |
| `limit` | `number` | — | Page size. |

Notable behaviour:

- Wraps `GenericInfiniteFeed` with `entity="search"` and `extraParams={{ q: query }}`.
- Switches on `item.kind`: `organization` → `OrganizationCard` (with `showRole={false}`), `project` → `ProjectCard`, `article` → `ArticleCard`, `user` → `UserCard`.
- The search page keys it by `query` so a new query resets the feed.

```tsx
<SearchResultsFeed
  key={query}
  initial={results}
  query={query}
  limit={SEARCH_PAGE_LIMIT}
/>
```
