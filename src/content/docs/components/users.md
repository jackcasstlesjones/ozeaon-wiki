---
title: "Users"
description: Shared user-presentation primitives — avatars, author bylines and meta, user cards, and the Network directory feed.
---

The `users/` components are presentation primitives for showing a person (or, for `UserAvatar` and `AuthorByline`, an Organization) anywhere in the app. `UserAvatar` is the base building block, reused across nav, comments, posts, composers and Organization cards. `AuthorMeta` pairs an avatar with a linked name, `UserCard` wraps `AuthorMeta` with a role line and expandable bio, and `UserGridCard` is the larger directory card rendered by `NetworkInfiniteFeed` on `/network`. All of these take already-fetched data as props; none of them query Supabase.

Barrel: `src/components/users/index.ts` exports `UserAvatar`, `UserCard`, `UserGridCard`, `NetworkInfiniteFeed`, `ListHeader`, `AuthorMeta` (and type `AuthorMetaProps`), `AuthorByline` and `AuthorLineDivider`. `ExpandableBio` is not exported from the barrel.

## UserAvatar

A round avatar with three states: the image, a coloured initials fallback, or an upload placeholder icon.

- **Source:** [src/components/users/UserAvatar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/UserAvatar.tsx)
- **Kind:** Server component (no directive; usable from client components)
- **Used in:** `src/components/posts/cards/PostCard.tsx`, `src/components/ui/comments/CommentItem.tsx`, `src/components/nav/components/UserDropdown.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `avatarUrl` | `string \| null` | — | Image URL. When absent, initials or the placeholder render. |
| `displayName` | `string` | — | Used for `aria-label`, image `alt`, and the initials. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | 28 / 36 / 44 / 72 / 120 px, each with its own initials typography. |
| `placeholder` | `boolean` | `false` | With no image, show an upload icon instead of initials. |
| `className` | `string` | `""` | Merged onto the wrapper and the `next/image` element. |

Notable behaviour:

- Initials are the first letters of the first two words, or the first two characters of a single-word name; falls back to `"OZ"` if empty.
- The initials background is picked deterministically from a fixed palette by hashing `displayName`, so a given name always gets the same colour.
- The wrapper has `role="img"` and `aria-label={displayName}`. Images use `next/image` with `fill` and `sizes` set to the pixel size.
- Also exports the `UserAvatarSize` type.

```tsx
<UserAvatar displayName={displayName} avatarUrl={avatarUrl} size="md" />
```

## AuthorByline

An inline author credit that links to an Organization, to an author URL, or renders plain text, in that order of preference.

- **Source:** [src/components/users/AuthorByline.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/AuthorByline.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/projects/cards/ProjectCard.tsx`, `src/components/articles/cards/ArticleBylineRow.tsx`, `src/components/projects/page/ProjectHeroSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `authoringOrg` | `OrgBylineData \| null` | — | When set, links to `/organizations/{slug}` with the Organization name and a verified badge if `verified`. |
| `authorDisplayName` | `string \| null` | — | Author name. Shown as "Unknown" if `authorUrl` is set without a name. |
| `authorUrl` | `string` | — | When set (and no `authoringOrg`), the name links here. |
| `className` | `ClassNameValue` | `""` | Merged onto the link or span. |
| `icon` | `React.ReactNode` | — | Rendered before the name. |

Notable behaviour:

- Returns `null` when none of `authoringOrg`, `authorUrl` or `authorDisplayName` is provided.
- Links use `prefetch={false}`.

```tsx
<AuthorByline
  authorDisplayName={author.display_name}
  authorUrl={`/profiles/${author.username}/articles`}
  className="relative z-1 min-w-0"
/>
```

## AuthorLineDivider

A small decorative dot used between items in a byline row. Exported from the same file as `AuthorByline`.

- **Source:** [src/components/users/AuthorByline.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/AuthorByline.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/articles/cards/ArticleBylineRow.tsx`, `src/components/projects/cards/CondensedProjectCard.tsx`, `src/components/articles/cards/MyArticleCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `ClassNameValue` | — | Merged onto the dot. |

Notable behaviour:

- `aria-hidden`. Uses `last:sr-only`, so a divider that ends up as the last child is visually hidden.

```tsx
<AuthorLineDivider className="bg-subtle/60 hidden @md:block" />
```

## AuthorMeta

An avatar beside a name, both linking to `/profiles/{username}` when a username exists, with a slot for extra lines underneath.

- **Source:** [src/components/users/AuthorMeta.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/AuthorMeta.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/users/UserCard.tsx`, `src/components/profiles/users/ConnectionRequestCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `avatarUrl` | `string \| null` | — | Passed to `UserAvatar`. |
| `displayName` | `string` | — | Shown as the heading line. |
| `username` | `string \| null` | — | When null, the avatar and name are not linked and the name is muted. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Avatar size. |
| `children` | `React.ReactNode` | — | Rendered below the name. |

```tsx
<AuthorMeta
  avatarUrl={getImageUrl(user.avatar_image)}
  displayName={user.display_name}
  username={user.username}
  size="lg"
>
  {displayedRole && <p className="font-body-sm text-muted truncate">{displayedRole}</p>}
</AuthorMeta>
```

## UserCard

A compact card for one user: `AuthorMeta` with a role line and an `ExpandableBio`, plus an optional action on the right.

- **Source:** [src/components/users/UserCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/UserCard.tsx)
- **Kind:** Server component (no directive; renders the client `ExpandableBio`)
- **Used in:** `src/components/search/SearchResultsFeed.tsx`, `src/components/profiles/organizations/sections/MembersSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `user` | `UserCardData` | — | The user to display. |
| `action` | `ReactNode` | — | Optional element rendered at the right of the card. |
| `role` | `string \| null` | `user.role_descriptor` | Overrides the role line. |
| `bio` | `string \| null` | `user.bio` | Overrides the bio. |

Notable behaviour:

- `role` and `bio` fall back with `??`, so passing `null` also falls back to the user's own value.

```tsx
<UserCard key={member.id} user={member.user_profile!} />
```

## ExpandableBio

A two-line clamped bio with a "Read more" / "Show less" toggle that only appears when the text actually overflows.

- **Source:** [src/components/users/ExpandableBio.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/ExpandableBio.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/users/UserCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `bio` | `string` | — | Bio text. |
| `className` | `string` | — | Applied to the wrapper. |

Notable behaviour:

- In an effect it compares `scrollHeight` to `clientHeight` to detect clamping, and re-measures after `document.fonts.ready` resolves. Re-runs when `bio` changes.

```tsx
<ExpandableBio bio={displayedBio} className="mt-1" />
```

## UserGridCard

The directory card for one user: avatar, linked name and `@username`, location and join date, two-line bio and a "View" button.

- **Source:** [src/components/users/UserGridCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/UserGridCard.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/users/NetworkInfiniteFeed.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `user` | `UserGridCardData` | — | The user to display. |

Notable behaviour:

- Stacked and centred below `md`, avatar beside content from `md` up.
- The name link uses an `after:absolute after:inset-0` overlay, making the whole card clickable to `/profiles/{username}`; the "View" button sits above it with `relative z-10`.
- Join date renders via `DateDisplay` with `format="date-dot"` and prefix "Joined". The location/date row is omitted when both are empty.

```tsx
renderItem={(user) => <UserGridCard user={user} />}
```

## NetworkInfiniteFeed

The infinite-scrolling grid of `UserGridCard`s on the Network page.

- **Source:** [src/components/users/NetworkInfiniteFeed.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/NetworkInfiniteFeed.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/app/(main)/(feed)/(public)/network/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `initial` | `UserGridCardData[]` | — | First page of users, fetched on the server. |
| `limit` | `number` | `20` | Page size for subsequent loads. |

Notable behaviour:

- Thin wrapper over `GenericInfiniteFeed` with `entity="users"`; further pages are loaded by that component, not here.
- One column below `lg`, two columns with 32px gaps from `lg`.

```tsx
<NetworkInfiniteFeed initial={users} limit={BATCH} />
```

## ListHeader

A page header row with a back-arrow link, an `h1` title and an optional count, intended for user list pages such as followers and following.

- **Source:** [src/components/users/ListHeader.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/ListHeader.tsx)
- **Kind:** Server component (no directive)
- **Used in:** No current call sites.

| Prop | Type | Default | Description |
|---|---|---|---|
| `backHref` | `string` | — | Target of the back arrow link. |
| `title` | `string` | — | Heading text. |
| `count` | `number` | — | Shown after the title when defined (including `0`). |

Notable behaviour:

- The back link contains only an icon and has no accessible label.
