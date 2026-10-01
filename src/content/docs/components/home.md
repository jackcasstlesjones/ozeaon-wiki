---
title: "Home"
description: Home feed sections (welcome header, create-post slot, activity metrics), home cards and small home helpers.
sidebar:
  order: 6
---

The home page (`src/app/(main)/(feed)/(public)/(home)/page.tsx`) is built from three streamed "slot" components followed by carousel sections:

1. `WelcomeSlot` — greeting with the viewer's name.
2. `CreatePostFormSlot` — the create-post form, signed-in viewers only.
3. `ActivitySlot` — four `MetricCard`s, personal for signed-in viewers, platform-wide otherwise.
4. `CarouselSection`s for latest projects, articles and organizations, each with a `SectionAllLink` action; the organizations carousel uses `OrganisationCard`.

Each slot wraps an async child in `Suspense` that calls `getAuthUser()`, so the auth read streams in without blocking the rest of the page. `WelcomeSlot` and `ActivitySlot` render the signed-out version as their fallback.

`ComingSoonPage`, `SubjectCard`, `CreateFabMenu` and `HowOzeaonWorks` currently have no call sites.

- **Barrel:** `src/components/home/index.ts` exports `WelcomeSlot`, `ActivitySlot`, `CreatePostFormSlot`, `ComingSoonPage`, `MetricCard`, `SubjectCard`, `OrganisationCard`, `SectionAllLink`. `HowOzeaonWorks` is commented out of the barrel; `WelcomeHeader` and `CreateFabMenu` are not exported from it.

## Sections and helpers

Files at the root of `src/components/home/`.

### WelcomeSlot

Streams the `WelcomeHeader` with the viewer's name.

- **Source:** [src/components/home/WelcomeSlot.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/WelcomeSlot.tsx)
- **Kind:** Server component (async child via `getAuthUser()`)
- **Used in:** `src/app/(main)/(feed)/(public)/(home)/page.tsx`

Notable behaviour:

- Name is the active organization's name when acting as an organization, otherwise `platform_meta.display_name` (or `""`); signed-out viewers get `""`.
- Fallback is `<WelcomeHeader name="" />`.

```tsx
<WelcomeSlot />
```

### WelcomeHeader

The "Welcome to Ozeaon" heading and tagline.

- **Source:** [src/components/home/WelcomeHeader.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/WelcomeHeader.tsx)
- **Kind:** No directive (shared)
- **Used in:** `src/components/home/WelcomeSlot.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Appended as `, {name}` when non-empty. |

```tsx
<Suspense fallback={<WelcomeHeader name="" />}>
  <WelcomeStream />
</Suspense>
```

### CreatePostFormSlot

Renders the create-post form (`CreatePostForm` from `@/components/posts/create-form`) only for signed-in viewers.

- **Source:** [src/components/home/CreatePostFormSlot.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/CreatePostFormSlot.tsx)
- **Kind:** Server component (async child via `getAuthUser()`)
- **Used in:** `src/app/(main)/(feed)/(public)/(home)/page.tsx`

Returns `null` for signed-out viewers; the `Suspense` fallback is also `null`.

```tsx
<CreatePostFormSlot />
```

### ActivitySlot

A heading plus a 2-column (4 from `lg`) grid of `MetricCard`s for users, articles, projects and posts, each with a month-over-month trend.

- **Source:** [src/components/home/ActivitySlot.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/ActivitySlot.tsx)
- **Kind:** Server component (async; Supabase queries)
- **Used in:** `src/app/(main)/(feed)/(public)/(home)/page.tsx`

Notable behaviour:

- Signed out (and as the `Suspense` fallback): "Platform Highlights", using `createPublicClient()`.
- Signed in: "My Activity", using the `supabase` client from `getAuthUser()`. Articles are filtered by `author_id`, projects by `owner_id`, posts by `user_id`. The user count stays platform-wide.
- All counts are `head: true` exact counts. Articles and projects require `published = true`; posts require `show_in_feed = true`; users count every `user_profiles` row.
- Trend compares this calendar month with last (`monthBoundaries()`): percentage change when last month is non-zero, `+100%` when only this month has rows, otherwise `+0%`.
- Query errors on the total count are logged via LogTape (`["components", "home"]`); the count falls back to `0`.

```tsx
<WelcomeSlot />
<CreatePostFormSlot />
<ActivitySlot />
```

### SectionAllLink

Small "All …" link with a trailing arrow, used as a carousel section's action.

- **Source:** [src/components/home/SectionAllLink.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/SectionAllLink.tsx)
- **Kind:** No directive (shared)
- **Used in:** `src/app/(main)/(feed)/(public)/(home)/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | Link target. |
| `label` | `string` | — | Link text. |

Uses `prefetch={false}`.

```tsx
<CarouselSection
  title="Latest Projects"
  action={<SectionAllLink href="/projects" label="All Projects" />}
>
```

### ComingSoonPage

An `EmptyState` reading "{title} is coming soon".

- **Source:** [src/components/home/ComingSoonPage.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/ComingSoonPage.tsx)
- **Kind:** No directive (shared)
- **Used in:** no call sites found

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Feature name, prefixed to "is coming soon". |

### CreateFabMenu

Mobile-only (`md:hidden`) fixed floating "+" button that opens a dropdown linking to `/articles/new`, `/projects/new` and `/organizations/new`.

- **Source:** [src/components/home/CreateFabMenu.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/CreateFabMenu.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** no call sites found. The mobile create button actually mounted is `MobileFloatingCreate` in `src/components/nav/components/` (see [Navigation](../nav/)).

### HowOzeaonWorks

Collapsible "How Ozeaon works" section listing six colour-coded steps (Discover & Learn through "The DAO has the final vote"), open by default.

- **Source:** [src/components/home/HowOzeaonWorks.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/HowOzeaonWorks.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** no call sites found. A TODO at the top of the file says it will be used once the section is scoped; it is commented out of the barrel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra classes on the `Collapsible` root. |

The toggle label ("Collapse"/"Expand") is visually hidden below `md` but kept for screen readers.

## Cards

Files in `src/components/home/cards/`.

### MetricCard

Coloured stat tile with a title, large value, label and a "vs. last month" trend line.

- **Source:** [src/components/home/cards/MetricCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/cards/MetricCard.tsx)
- **Kind:** No directive (shared)
- **Used in:** `src/components/home/ActivitySlot.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"learn" \| "publish" \| "create" \| "support" \| "connect"` | — | Selects the `bg-metric-{variant}-bg` / `-dot` tokens. |
| `title` | `string` | — | Heading beside the coloured dot. |
| `value` | `string` | — | Large display value. |
| `label` | `string` | — | Caption under the value. |
| `trend` | `{ value: string; positive: boolean }` | — | Trend text; `positive: false` renders it in `text-error`. |

```tsx
<MetricCard
  variant="publish"
  title="Publish"
  value={String(articles.total)}
  label="Articles Published"
  trend={articles.trend}
/>
```

### OrganisationCard

Fixed-width carousel card for an organization: logo, name, mission, member and project counts, the viewer's role, and an arrow link to the organization page.

- **Source:** [src/components/home/cards/OrganisationCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/cards/OrganisationCard.tsx)
- **Kind:** No directive (shared)
- **Used in:** `src/app/(main)/(feed)/(public)/(home)/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `slug` | `string` | — | Builds the `/organizations/{slug}` link. |
| `name` | `string` | — | Organization name; also the avatar fallback and link `aria-label`. |
| `mission` | `string \| null` | — | Mission text under the name. |
| `memberCount` | `number` | `0` | Shown as "{n} members". |
| `projectCount` | `number` | `0` | Shown as "{n} projects". |
| `logo` | `string \| null` | — | Logo URL for `UserAvatar`. |
| `viewerRole` | `OrgMemberRole \| null` | — | `owner`/`admin`/`member` renders "You are the owner" etc.; omitted otherwise. |

Notable behaviour: uses `snap-center` for carousel snapping; the link carries the `card-link` class and `prefetch={false}`.

```tsx
{organizations.map((org) => (
  <OrganisationCard key={org.name} {...org} />
))}
```

### SubjectCard

Fixed-width card with a title, two-line summary and a category badge.

- **Source:** [src/components/home/cards/SubjectCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/cards/SubjectCard.tsx)
- **Kind:** No directive (shared)
- **Used in:** no call sites found

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Single-line title. |
| `summary` | `string` | — | Clamped to two lines. |
| `category` | `string` | — | Badge text. |
