---
title: "Search"
description: The desktop and mobile search fields in the top nav, and the infinite results feed on /search.
---

The search UI has three components, all imported from `@/components/search`. Today's search is a basic keyword match on name or title across organizations, projects, articles and people. Search across every content type is on the roadmap. See also [Search & Discovery](../../features/search/).

Both search fields read `useSearchParams()`, so `TopNavClient` wraps each in a `Suspense` boundary to keep static pages prerendering.

## SearchBar

The desktop search form in the top nav, shown when no page has replaced the nav's left slot. On submit it navigates to `searchHref(value)`. If no `initialQuery` is passed, it seeds from `?q=`.

**Source:** [src/components/search/SearchBar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/search/SearchBar.tsx)

## MobileSearchBar

The mobile top nav collapsed into a full-width search field (opened by `MobileSearchTrigger`, see [Navigation](../nav/)). In docked mode, on the `/search` page, submitting uses `router.replace`, so refining a query doesn't stack history entries, and back/Escape leave the page. The value re-syncs from `?q=` on back/forward navigation.

**Source:** [src/components/search/MobileSearchBar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/search/MobileSearchBar.tsx)

## SearchResultsFeed

The infinite results list on `/search`. It is a `GenericInfiniteFeed` with `entity="search"` that renders the matching domain card for each result `kind`. The page passes the first page server-rendered and keys the feed by `query`, so a new query resets it.

**Source:** [src/components/search/SearchResultsFeed.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/search/SearchResultsFeed.tsx)
