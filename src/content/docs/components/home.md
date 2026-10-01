---
title: "Home"
description: Home feed sections (welcome header, create-post slot, activity metrics), home cards and small home helpers.
---

Components in [`src/components/home/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home) build the home page at `/`. The page streams three slot components — `WelcomeSlot`, `CreatePostFormSlot` and `ActivitySlot` — followed by carousel sections for projects, articles and organisations. Each slot wraps an async child in `Suspense` that calls `getAuthUser()`, so auth reads stream in without blocking the rest of the page. `WelcomeSlot` (`src/components/home/index.ts`) exports `WelcomeSlot`, `ActivitySlot`, `CreatePostFormSlot`, `MetricCard`, `SectionAllLink` and `OrganisationCard`.

## Slots & Helpers

### WelcomeSlot

Streams the viewer's name into `WelcomeHeader`. When acting as an organisation it uses the org name; signed-out viewers get an empty string. The Suspense fallback renders `<WelcomeHeader name="" />`.

**Source:** [src/components/home/WelcomeSlot.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/WelcomeSlot.tsx)

### WelcomeHeader

The "Welcome to Ozeaon" heading and tagline. Appends `, {name}` when a non-empty name is supplied.

**Source:** [src/components/home/WelcomeHeader.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/WelcomeHeader.tsx)

### CreatePostFormSlot

Renders the create-post form (`CreatePostForm` from `@/components/posts/create-form`) only for signed-in viewers; returns `null` for signed-out viewers and uses `null` as its Suspense fallback.

**Source:** [src/components/home/CreatePostFormSlot.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/CreatePostFormSlot.tsx)

### ActivitySlot

A 2-column (4 from `lg`) grid of `MetricCard`s for users, articles, projects and posts, each with a month-over-month trend. Signed-out viewers (and the Suspense fallback) see "Platform Highlights" via `createPublicClient()`; signed-in viewers see personal "My Activity" counts. Query errors fall back to `0`.

**Source:** [src/components/home/ActivitySlot.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/ActivitySlot.tsx)

### SectionAllLink

Small "All …" link with a trailing arrow used as a carousel section's action. Uses `prefetch={false}`.

**Source:** [src/components/home/SectionAllLink.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/SectionAllLink.tsx)

### ComingSoonPage

An `EmptyState` reading "{title} is coming soon". No current call sites.

**Source:** [src/components/home/ComingSoonPage.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/ComingSoonPage.tsx)

### CreateFabMenu

Mobile-only fixed floating "+" button linking to create routes. No current call sites — the mobile create button that is actually mounted is `MobileFloatingCreate` in [`src/components/nav/components/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/nav/components).

**Source:** [src/components/home/CreateFabMenu.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/CreateFabMenu.tsx)

### HowOzeaonWorks

Collapsible "How Ozeaon works" section listing six colour-coded steps. Not rendered — the file has a TODO saying it will be used once the section is scoped, and it is commented out of the barrel. Several of the steps it describes (DAO, funding, quizzes, Progress Tokens) are on the roadmap and not yet built.

**Source:** [src/components/home/HowOzeaonWorks.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/HowOzeaonWorks.tsx)

## Cards

### MetricCard

Coloured stat tile with a title, large value, label and a "vs. last month" trend line. The `variant` prop selects the `bg-metric-{variant}-{bg|dot}` design tokens.

**Source:** [src/components/home/cards/MetricCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/cards/MetricCard.tsx)

### OrganisationCard

Fixed-width carousel card for an organisation: logo, name, mission, member and project counts, and the viewer's role. Uses `snap-center` for carousel snapping and `prefetch={false}` on its link.

**Source:** [src/components/home/cards/OrganisationCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/cards/OrganisationCard.tsx)

### SubjectCard

Fixed-width card with a title, two-line clamped summary and a category badge. No current call sites — this is unused scaffolding for the Educational Resources feature, which is on the roadmap and not built.

**Source:** [src/components/home/cards/SubjectCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/home/cards/SubjectCard.tsx)
