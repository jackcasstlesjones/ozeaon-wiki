---
title: "Users"
description: Shared user-presentation primitives — avatars, author bylines and meta, user cards, and the Network directory feed.
---

The `users/` components show a person anywhere in the app. `UserAvatar` and `AuthorByline` can also show an organisation. They take already-fetched data as props and never query Supabase. Import them from `@/components/users`; `ExpandableBio` isn't in the barrel. See also [User Profiles & Social Graph](../../profiles/profiles-and-social-graph/).

## UserAvatar

A round avatar with three states: the image, a coloured initials fallback, or an upload placeholder. The initials colour comes from a hash of `displayName`, so a given name always gets the same colour.

**Source:** [src/components/users/UserAvatar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/UserAvatar.tsx)

## AuthorByline

An inline author credit. It links to the authoring organisation if there is one, otherwise to the author URL, otherwise renders plain text. It returns `null` when given none of these. `AuthorLineDivider`, in the same file, is the decorative dot between byline items. It uses `last:sr-only`, so a trailing divider is hidden.

**Source:** [src/components/users/AuthorByline.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/AuthorByline.tsx)

## AuthorMeta

An avatar beside a name, both linking to `/profiles/{username}` when a username exists, with a children slot for extra lines underneath.

**Source:** [src/components/users/AuthorMeta.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/AuthorMeta.tsx)

## UserCard

A compact user row: `AuthorMeta` plus a role line, an `ExpandableBio` and an optional action slot. Used in search results and org member lists. `ExpandableBio` clamps to two lines and shows "Read more" only when the text actually overflows. It re-measures after fonts load.

**Source:** [src/components/users/UserCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/UserCard.tsx), [ExpandableBio.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/ExpandableBio.tsx)

## UserGridCard

The directory card on `/network`. The name link's `::after` overlay makes the whole card clickable, and the "View" button is raised above that overlay.

**Source:** [src/components/users/UserGridCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/UserGridCard.tsx)

## NetworkInfiniteFeed

The infinite grid of `UserGridCard`s on the Network page, a thin wrapper over `GenericInfiniteFeed` with `entity="users"`.

**Source:** [src/components/users/NetworkInfiniteFeed.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/NetworkInfiniteFeed.tsx)

## ListHeader

A header with a back link, a title and a count, intended for followers/following lists. It has **no call sites**: follow and connection lists aren't wired up (connections & blocking is on the roadmap). Its icon-only back link has no accessible label.

**Source:** [src/components/users/ListHeader.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/users/ListHeader.tsx)
