---
title: "Profiles"
description: Components that build the user profile and Organization profile pages — shared page shell, header data slots, owner image controls, actions and overview sections.
sidebar:
  order: 12
---

The `profiles/` components assemble the two profile page layouts: `src/app/(main)/(profile)/profiles/[username]/layout.tsx` (users) and `src/app/(main)/(profile)/organizations/[slug]/layout.tsx` (Organizations). Both layouts fetch the entity on the server, then compose the same `shared/` frame — `ProfilePageShell` with a `CoverImageSlot` cover, a `ProfileHeader`, tabs and a sidebar — and fill its slots with domain-specific pieces from `users/` or `organizations/`.

Viewer-specific pieces are isolated so the rest of the page can stay public: `ProfileDataSlot`, `OrganizationActions` and `ProfileActions` call `getAuthUser()` on the server, while `CoverOwnerControls` and `AvatarOwnerControls` read the session on the client. Owner editing (cover, avatar, the Edit Profile link) is only offered while the active account is the user themself, not an Organization they are acting as.

```mermaid
flowchart TD
  UL["profiles/[username]/layout.tsx"] --> Shell[ProfilePageShell]
  OL["organizations/[slug]/layout.tsx"] --> Shell
  Shell -->|cover| Cover[CoverImageSlot]
  UL -.->|cover| COC[CoverOwnerControls] --> CIE[CoverImageEditor]
  Shell -->|header| PH[ProfileHeader]
  PH -->|dataSlot, users| PDS[ProfileDataSlot] --> AOC[AvatarOwnerControls]
  PH -->|dataSlot, Organizations| ODS[OrganizationDataSlot] -->|actions| OA[OrganizationActions]
  OA --> EOB[EditOrganizationButton]
  OA --> JOB[JoinOrgButton]
  Shell -->|sidebar, users| AC[ActivityCard] --> PAC[ProfileActivityCard]
  Shell -->|sidebar, Organizations| OAS[OrganizationActivitySidebar] --> PAC
  PAC --> ASC[ActivityStatsCard]
```

## shared

### ProfilePageShell

The two-column profile page frame: a full-width cover band, then a main column (header, tabs, content) that overlaps the cover, with a sticky sidebar from `md` up.

- **Source:** [src/components/profiles/shared/ProfilePageShell.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/shared/ProfilePageShell.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/app/(main)/(profile)/profiles/[username]/layout.tsx`, `src/app/(main)/(profile)/organizations/[slug]/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `cover` | `React.ReactNode` | — | Rendered inside the relative, `overflow-hidden` cover band (which is also a `group` for hover controls). |
| `header` | `React.ReactNode` | — | Top of the main column. |
| `tabs` | `React.ReactNode` | — | Below the header. |
| `sidebar` | `React.ReactNode` | — | Sticky aside (`STICKY_ASIDE_CLASS`), hidden below `md`. |
| `children` | `React.ReactNode` | — | Tab content, wrapped in a `<section>`. |
| `coverClassName` | `string` | `"h-56"` | Cover height. |
| `offsetClassName` | `string` | `"-mt-35"` | Negative top margin pulling the content up over the cover. |

```tsx
<ProfilePageShell
  coverClassName="h-32"
  offsetClassName="-mt-18"
  cover={<CoverImageSlot coverPath={org.cover_image?.path ?? null} alt={`${org.name} cover`} />}
  header={<ProfileHeader dataSlot={<OrganizationDataSlot organization={org} actions={orgActions} />} actions={null} />}
  tabs={<NavTabs ariaLabel="Organisation sections" tabs={ORG_TABS(org.slug, articleCount, projectCount)} variant="underline" />}
  sidebar={<OrganizationActivitySidebar org={org} className="pt-0 px-4" />}
>
  {children}
</ProfilePageShell>
```

### CoverImageSlot

The cover image for a profile, or a brand gradient when there is none. Intended for the `cover` slot of `ProfilePageShell`.

- **Source:** [src/components/profiles/shared/CoverImageSlot.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/shared/CoverImageSlot.tsx)
- **Kind:** Server component (no directive); default export
- **Used in:** `src/app/(main)/(profile)/profiles/[username]/layout.tsx`, `src/app/(main)/(profile)/organizations/[slug]/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `coverPath` | `string \| null` | — | Storage path, resolved with `getImageUrl` after trimming. |
| `alt` | `string` | — | Image alt text. |

Notable behaviour:

- Renders `next/image` with `fill` and `priority`, so it needs a positioned parent (the shell's cover band provides one).

```tsx
<CoverImageSlot coverPath={coverPath} alt={`${profile.display_name} cover`} />
```

### ProfileHeader

Stacks a data slot above an actions slot, wrapping the actions in `Suspense` with a 36px-tall fallback.

- **Source:** [src/components/profiles/shared/ProfileHeader.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/shared/ProfileHeader.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/app/(main)/(profile)/profiles/[username]/layout.tsx`, `src/app/(main)/(profile)/organizations/[slug]/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `dataSlot` | `React.ReactNode` | — | The header card (`ProfileDataSlot` or `OrganizationDataSlot`). |
| `actions` | `React.ReactNode` | — | Viewer actions; both current layouts pass `null`. |

```tsx
<ProfileHeader
  dataSlot={<ProfileDataSlot profile={profile} username={username} />}
  actions={null}
/>
```

### ProfileHeaderCard

The rounded, padded card background shared by both header data slots.

- **Source:** [src/components/profiles/shared/ProfileHeaderCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/shared/ProfileHeaderCard.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/profiles/users/ProfileDataSlot.tsx`, `src/components/profiles/organizations/OrganizationDataSlot.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | — | Card content. |
| `className` | `string` | — | Merged with the base classes (layout is supplied by the caller). |

```tsx
<ProfileHeaderCard className="relative flex flex-col gap-4">
  {/* header content */}
</ProfileHeaderCard>
```

### ActivityStatsCard

A titled stats card: a row of numeric stats, an optional month-on-month trend line, and a children slot.

- **Source:** [src/components/profiles/shared/ActivityStatsCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/shared/ActivityStatsCard.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/profiles/shared/ProfileActivityCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Card heading. |
| `stats` | `{ label: string; value: number }[]` | — | Stats rendered left to right; `label` is used as the React key. |
| `trend` | `{ value: string; positive: boolean }` | — | Shows an up/down arrow, the value and "vs. last month". |
| `children` | `React.ReactNode` | — | Rendered at the bottom of the card. |

```tsx
<ActivityStatsCard
  title={title}
  stats={[
    { label: "Projects", value: projectsCount },
    { label: "Articles", value: articlesCount },
  ]}
  trend={trend}
>
  <ProgressTokensSoon />
</ActivityStatsCard>
```

### ProfileActivityCard

An `ActivityStatsCard` preset with Projects and Articles counts and the `ProgressTokensSoon` teaser.

- **Source:** [src/components/profiles/shared/ProfileActivityCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/shared/ProfileActivityCard.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/profiles/users/ActivityCard.tsx`, `src/components/profiles/organizations/OrganizationActivitySidebar.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Card heading. |
| `projectsCount` | `number` | — | Projects stat. |
| `articlesCount` | `number` | — | Articles stat. |
| `trend` | `{ value: string; positive: boolean }` | — | Optional trend line. |

```tsx
<ProfileActivityCard
  title="Org Activity"
  projectsCount={projectCount}
  articlesCount={articleCount}
  trend={trend}
/>
```

### ProgressTokensSoon

A static "Progress Tokens — Soon" placeholder describing the upcoming impact metric. Takes no props.

- **Source:** [src/components/profiles/shared/ProgressTokensSoon.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/shared/ProgressTokensSoon.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/profiles/shared/ProfileActivityCard.tsx`

## users

### ProfileDataSlot

The user profile header card: avatar (with owner controls), name, founding-member badge, location and role, social and custom links, and an Edit Profile link for the owner.

- **Source:** [src/components/profiles/users/ProfileDataSlot.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/ProfileDataSlot.tsx)
- **Kind:** Async server component; default export
- **Used in:** `src/app/(main)/(profile)/profiles/[username]/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `profile` | `UserProfile` (`@/types/profiles`) | — | The profile being viewed, including `user_links` and `avatar_image`. |
| `username` | `string` | — | Route username, passed to `AvatarOwnerControls` for the ownership check. |

Notable behaviour:

- Calls `getAuthUser()`; the viewer is the owner only when `activeAccount.type === "user"` and `user.id === profile.id`. Owners get an "Edit Profile" link to `/settings` (top-right on desktop, full-width below on mobile).
- Builds an `x.com` URL from `twitter_handle` (stripping a leading `@`). Website and custom links show their URL without the `http(s)://` prefix; custom links prefer `title`.
- The links row is omitted entirely when there are no links.

```tsx
<ProfileDataSlot profile={profile} username={username} />
```

### AvatarOwnerControls

The profile avatar, with camera (upload) and trash (remove) buttons overlaid on hover/focus when the viewer owns the profile. For non-owners it is just a `UserAvatar`.

- **Source:** [src/components/profiles/users/AvatarOwnerControls.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/AvatarOwnerControls.tsx)
- **Kind:** Client component (`"use client"`); default export
- **Used in:** `src/components/profiles/users/ProfileDataSlot.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `username` | `string` | — | Compared against the session user's `platform_meta.username`. |
| `displayName` | `string` | — | Passed to `UserAvatar`. |
| `initialAvatarPath` | `string \| null` | — | Current avatar storage path; also decides whether the remove button shows. |
| `size` | `UserAvatarSize` | `"lg"` | Avatar size. |

Notable behaviour:

- Ownership comes from `useSessionInfo()` and requires `activeAccount.type === "user"`.
- File selection is checked against `IMAGE_CONFIG.allowedMimeTypes` and `IMAGE_CONFIG.maxSizes.avatar` (toast on failure), then opened in `AvatarCropModal`.
- Upload/remove go through `useProfileImageUpload` (`type: "avatar"`, 0.5 MB, 512px). The upload result is returned from the crop handler so a moderation rejection keeps the crop modal open; rejections show `ModerationRejectedDialog` via `useImageModeration`.
- Removal is confirmed with a destructive `ConfirmDialog`. Settings pages use `AvatarUpload` instead of this component.

```tsx
<AvatarOwnerControls
  username={username}
  displayName={profile.display_name}
  initialAvatarPath={profile.avatar_image?.path ?? null}
  size="xl"
/>
```

### CoverOwnerControls

Renders `CoverImageEditor` only when the viewer is the profile owner acting as themself; otherwise renders nothing.

- **Source:** [src/components/profiles/users/CoverOwnerControls.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/CoverOwnerControls.tsx)
- **Kind:** Client component (`"use client"`); default export
- **Used in:** `src/app/(main)/(profile)/profiles/[username]/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `username` | `string` | — | Compared against the session user's `platform_meta.username`. |
| `initialCoverPath` | `string \| null` | — | Passed through to `CoverImageEditor`. |

Notable behaviour:

- Returns `null` when the active account is an Organization, because the upload route always writes to the personal profile.

```tsx
<CoverOwnerControls username={username} initialCoverPath={coverPath} />
```

### CoverImageEditor

Hover buttons over the cover band to add, replace or remove the cover image, with an uploading overlay.

- **Source:** [src/components/profiles/users/CoverImageEditor.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/CoverImageEditor.tsx)
- **Kind:** Client component (`"use client"`); default export
- **Used in:** `src/components/profiles/users/CoverOwnerControls.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `initialCoverPath` | `string \| null` | — | Decides the button label ("Edit profile cover" / "Add profile cover") and whether remove shows. |

Notable behaviour:

- Does no ownership check itself; render it through `CoverOwnerControls`.
- Validates type and `IMAGE_CONFIG.maxSizes.coverImage`, then uploads directly (no crop step) via `useProfileImageUpload` (`type: "coverImage"`, 1 MB, 1920px).
- Buttons appear on `group-hover`, relying on the `group` class of `ProfilePageShell`'s cover band. Shows `LoadingOverlay` while uploading.
- Removal is confirmed with a destructive `ConfirmDialog`; moderation rejections show `ModerationRejectedDialog`.

```tsx
<CoverImageEditor initialCoverPath={initialCoverPath} />
```

### ActivityCard

Fetches a user's project and article counts and renders them as a `ProfileActivityCard` titled "Activity".

- **Source:** [src/components/profiles/users/ActivityCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/ActivityCard.tsx)
- **Kind:** Async server component; default export
- **Used in:** `src/app/(main)/(profile)/profiles/[username]/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `profileId` | `string` | — | User profile id passed to `getProfileActivityCounts`. |

```tsx
sidebar={<ActivityCard profileId={profile.id} />}
```

### ProfileActions

Server-side wiring for Connect, Follow and Block buttons on another user's profile. Marked `TODO(post-Phase-0)`: not currently rendered — the profile layout passes `actions={null}` to `ProfileHeader`.

- **Source:** [src/components/profiles/users/ProfileActions.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/ProfileActions.tsx)
- **Kind:** Async server component; default export
- **Used in:** No current call sites (referenced in a TODO in `src/app/(main)/(profile)/profiles/[username]/layout.tsx`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `profileId` | `string` | — | The viewed user's id. |
| `username` | `string` | — | The viewed user's username; used to hide actions on your own profile. |

Notable behaviour:

- Returns `null` when signed out or viewing your own profile.
- Runs `checkIsFollowing`, `checkIsConnected`, `checkOutgoingRequest`, `checkIncomingRequest` and `checkCooldownFollowing` in parallel, then derives the connection state (`connected` > `pending_outgoing` > `pending_incoming` > `none`) for `ConnectButton`.

### ConnectButton

Connection request controls whose label and action depend on the connection state. Marked `TODO(post-Phase-0)`: not currently rendered.

- **Source:** [src/components/profiles/users/ConnectButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/ConnectButton.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/profiles/users/ProfileActions.tsx` (itself unrendered)

| Prop | Type | Default | Description |
|---|---|---|---|
| `targetUserId` | `string` | — | The other user. |
| `initialStatus` | `{ state: "none" \| "pending_outgoing" \| "pending_incoming" \| "connected"; requestId?: string }` | `{ state: "none" }` | Current connection state. |
| `cooldownUntil` | `string \| null` | — | ISO date; while in the future, the Connect button is disabled. |

Notable behaviour:

- `pending_incoming` shows Accept/Decline in a `ButtonGroup`; `pending_outgoing` shows Cancel; `connected` shows Disconnect; `none` shows Connect.
- Calls `sendConnectionRequest`, `cancelConnectionRequest`, `acceptConnectionRequest`, `declineConnectionRequest` and `disconnectConnection` from `@/lib/supabase/queries/profile` through `useAsyncAction` (toasts on success/failure).
- The displayed state does not change after an action; it comes only from `initialStatus`.
- Returns `null` when signed out or when `targetUserId` is the current user.

### FollowButton

A Follow / Following toggle. Marked `TODO(post-Phase-0)`: not currently rendered.

- **Source:** [src/components/profiles/users/FollowButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/FollowButton.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/profiles/users/ProfileActions.tsx` (itself unrendered)

| Prop | Type | Default | Description |
|---|---|---|---|
| `targetUserId` | `string` | — | The user to follow/unfollow. |
| `isFollowing` | `boolean` | — | Chooses between the "Following" (unfollow) and "Follow" buttons. |

Notable behaviour:

- Calls `followUser` / `unfollowUser` from `@/lib/supabase/queries/profile` via `useAsyncAction`. The label is driven solely by the `isFollowing` prop.
- Returns `null` when signed out or on your own profile.

### BlockButton

An overflow ("…") menu with a "Block user" item and a destructive confirm dialog. Marked `TODO(post-Phase-0)`: not currently rendered.

- **Source:** [src/components/profiles/users/BlockButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/BlockButton.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/profiles/users/ProfileActions.tsx` (itself unrendered)

| Prop | Type | Default | Description |
|---|---|---|---|
| `targetUserId` | `string` | — | The user to block. |

Notable behaviour:

- Confirm calls `blockUser` from `@/lib/supabase/queries/profile` via `useAsyncAction`, closing the dialog on success.
- Returns `null` when signed out or on your own profile.

### UnblockButton

A ghost "Unblock" button that unblocks a user and refreshes the route.

- **Source:** [src/components/profiles/users/UnblockButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/UnblockButton.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** No current call sites.

| Prop | Type | Default | Description |
|---|---|---|---|
| `targetUserId` | `string` | — | The user to unblock. |

Notable behaviour:

- Calls `unblockUser` from `@/lib/supabase/queries/profile` via `useAsyncAction`, then `router.refresh()` on success.

### ConnectionRequests

A list of incoming or outgoing connection requests that removes each request from the list once it is accepted, declined or cancelled.

- **Source:** [src/components/profiles/users/ConnectionRequests.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/ConnectionRequests.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** No current call sites.

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"incoming" \| "outgoing"` | — | Incoming requests show the `requester`; outgoing show the `recipient`. |
| `requests` | `{ id: string; requester?: UserProfileForJoin; recipient?: UserProfileForJoin; created_at: string \| null }[]` | — | Initial requests; copied into local state. |

Notable behaviour:

- Calls `acceptConnectionRequest`, `declineConnectionRequest` or `cancelConnectionRequest` from `@/lib/supabase/queries/profile`; on `success` the request is filtered out of state and a toast is shown.
- Renders `EmptyState` ("No pending requests") when the list is empty. Requests missing the relevant user are skipped.

### ConnectionRequestCard

One connection request row: the other user's `AuthorMeta` with `@username`, plus Accept/Decline (incoming) or Cancel (outgoing) buttons.

- **Source:** [src/components/profiles/users/ConnectionRequestCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/ConnectionRequestCard.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/profiles/users/ConnectionRequests.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `requestId` | `string` | — | Passed back to the handlers. |
| `user` | `UserProfileForJoin` | — | The other party. |
| `type` | `"incoming" \| "outgoing"` | — | Selects which buttons render. |
| `onAccept` | `(requestId: string) => void` | — | Incoming only. |
| `onDecline` | `(requestId: string) => void` | — | Incoming only. |
| `onCancel` | `(requestId: string) => void` | — | Outgoing only. |

```tsx
<ConnectionRequestCard
  key={request.id}
  requestId={request.id}
  user={user}
  type={type}
  onAccept={handleAccept}
  onDecline={handleDecline}
  onCancel={handleCancel}
/>
```

### PrivateContentMessage

A centred lock message explaining why a user's posts and articles are hidden.

- **Source:** [src/components/profiles/users/PrivateContentMessage.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/PrivateContentMessage.tsx)
- **Kind:** Server component (no directive)
- **Used in:** No current call sites.

| Prop | Type | Default | Description |
|---|---|---|---|
| `privacy` | `ContentVisibility` (`@/config`) | — | `"private"` shows the private message; any other value shows the connections-only message. |

### images

Barrel: `src/components/profiles/users/images/index.ts` exports `ImageGalleryList` and `ImageCard`.

#### ImageGalleryList

A responsive grid (2 / 3 / 4 columns at base / `md` / `lg`) of post images, or an `EmptyState` when there are none.

- **Source:** [src/components/profiles/users/images/ImageGalleryList.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/images/ImageGalleryList.tsx)
- **Kind:** Server component (no directive)
- **Used in:** No current call sites.

| Prop | Type | Default | Description |
|---|---|---|---|
| `images` | `{ imageKey: string; postId: string; createdAt: string }[]` | — | Images to show; URLs are built with `getImageUrlFromKey(imageKey)`. |
| `emptyMessage` | `string` | `"No images to display"` | Empty-state title. |

Notable behaviour:

- Uses `GridLayout`; each item is wrapped in a `role="gridcell"` div and gets alt text "Image from post {n} of {total}".

#### ImageCard

A square card holding a single `ZoomableImage`.

- **Source:** [src/components/profiles/users/images/ImageCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/users/images/ImageCard.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/profiles/users/images/ImageGalleryList.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image URL. |
| `alt` | `string` | `"Gallery image"` | Alt text. |

```tsx
<ImageCard
  src={getImageUrlFromKey(image.imageKey)}
  alt={`Image from post ${index + 1} of ${images.length}`}
/>
```

## organizations

Barrel: `src/components/profiles/organizations/index.ts` exports `JoinOrgButton`, `OrganizationActivitySidebar`, `DescriptionSection`, `ActiveProjectsSection`, `RecentArticlesSection` and `MembersSection`.

### OrganizationDataSlot

The Organization profile header card: logo, name, Verified and founding-member badges, contact/social links, mission, member and active-project counts, and an actions slot.

- **Source:** [src/components/profiles/organizations/OrganizationDataSlot.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/OrganizationDataSlot.tsx)
- **Kind:** Server component (no directive); default export
- **Used in:** `src/app/(main)/(profile)/organizations/[slug]/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `organization` | `OrganizationForLayout` | — | The Organization being viewed. |
| `actions` | `React.ReactNode` | — | Rendered at the bottom of the card, aligned with the content column. |

Notable behaviour:

- Uses `UserAvatar` for the logo, so Organizations without a logo get initials.
- Mission is clamped to two lines. Member count defaults to 0; the project count only shows when `project_count` is not null.
- Mission, counts and actions span the full card width on mobile and indent beside the logo from `sm` up.

```tsx
<OrganizationDataSlot
  organization={org}
  actions={
    <Suspense fallback={<div className="h-9" />}>
      <OrganizationActions organizationId={org.id} />
    </Suspense>
  }
/>
```

### OrganizationActions

Chooses the viewer's action on an Organization profile: Edit for owners and admins, Join/Cancel Request for non-members, nothing for other members or signed-out viewers.

- **Source:** [src/components/profiles/organizations/OrganizationActions.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/OrganizationActions.tsx)
- **Kind:** Async server component; default export
- **Used in:** `src/app/(main)/(profile)/organizations/[slug]/layout.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `organizationId` | `string` | — | The Organization's id. |

Notable behaviour:

- Uses the `supabase` client from `getAuthUser()` to query, in parallel, the viewer's `organization_members` row (with `member_roles` slug) and any `pending` row in `organization_join_requests`.
- Role `owner` or `admin` → `EditOrganizationButton`. Any other member → `null`. Non-member → `JoinOrgButton` seeded with `pending` (and the request id) or `not-member`.
- Because it reads the session, the layout wraps it in `Suspense`.

```tsx
<OrganizationActions organizationId={org.id} />
```

### EditOrganizationButton

An "Edit Organisation" button that switches the active account to the Organization if needed, then navigates to `/settings`.

- **Source:** [src/components/profiles/organizations/EditOrganizationButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/EditOrganizationButton.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/profiles/organizations/OrganizationActions.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `orgId` | `string` | — | The Organization to edit. |

Notable behaviour:

- Organization settings render from the active account cookie, so it calls `switchToOrg(orgId)` (from `useAccountSwitch`) first unless that Organization is already active, then `router.push("/settings")`. Wrapped in `useAsyncAction` for the loading state.

```tsx
<EditOrganizationButton orgId={organizationId} />
```

### JoinOrgButton

A "Join Organisation" button that becomes "Cancel Request" while a join request is pending.

- **Source:** [src/components/profiles/organizations/JoinOrgButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/JoinOrgButton.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/profiles/organizations/OrganizationActions.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `orgId` | `string` | — | The Organization to join. |
| `initialStatus` | `JoinStatus` | — | `{ state: "not-member" } \| { state: "pending"; requestId: string } \| { state: "member" }`. |

Notable behaviour:

- Calls the `requestToJoinOrg` and `cancelJoinRequest` server actions (`src/app/(main)/(profile)/organizations/[slug]/actions`) via `useAsyncAction`, with toasts. Status is held in local state and updated on success (the join action's `requestId` is stored for cancelling).
- Returns `null` when signed out (`useAuth`) or when the state is `member`.
- Also exports the `JoinStatus` type.

```tsx
<JoinOrgButton orgId={organizationId} initialStatus={initialJoinStatus} />
```

### OrganizationActivitySidebar

The Organization profile sidebar: an activity card with project/article counts and trend, above a labelled column of the Organization's links.

- **Source:** [src/components/profiles/organizations/OrganizationActivitySidebar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/OrganizationActivitySidebar.tsx)
- **Kind:** Async server component
- **Used in:** `src/app/(main)/(profile)/organizations/[slug]/layout.tsx`, `src/app/(main)/(profile)/organizations/[slug]/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `org` | `OrganizationForSidebar` | — | The Organization. |
| `className` | `string` | — | Merged onto the wrapper. |

Notable behaviour:

- Calls `getOrganizationActivityCounts(org.id)` for `projectCount`, `articleCount` and `trend`, and renders a `ProfileActivityCard` titled "Org Activity".
- The layout renders it in the desktop sidebar; the overview page renders a second copy inside a `md:hidden` wrapper for mobile.

```tsx
<OrganizationActivitySidebar org={org} className="pt-0 px-4" />
```

### OrganizationLinks

An Organization's contact and social links: `contact_email`, `website_url`, `linkedin_url`, then each custom link. Icon-only row by default, or a labelled column.

- **Source:** [src/components/profiles/organizations/OrganizationLinks.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/OrganizationLinks.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/profiles/organizations/OrganizationDataSlot.tsx`, `src/components/profiles/organizations/OrganizationActivitySidebar.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `org` | `OrganizationLinksData` | — | Source of the link columns and `links` array. |
| `orientation` | `"row" \| "column"` | `"row"` | Layout direction. |
| `showLabels` | `boolean` | `false` | Show text beside each icon. |
| `className` | `string` | — | Merged onto the wrapper. |

Notable behaviour:

- Returns `null` when there are no links.
- Email uses `mailto:`; all other links open in a new tab with `rel="noopener noreferrer"`.
- Without labels, each link gets an `aria-label` (the email, the website without `http(s)://`, "LinkedIn", or the custom link label).
- Custom link icons come from `SocialLinkIcon`.

```tsx
<OrganizationLinks org={org} orientation="column" showLabels />
```

### SocialLinkIcon

Picks a brand icon for a link from its label: LinkedIn, GitHub, or a generic globe.

- **Source:** [src/components/profiles/organizations/SocialLinkIcon.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/SocialLinkIcon.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/profiles/organizations/OrganizationLinks.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Matched case-insensitively for `"linkedin"` or `"github"` (custom links are labelled with their hostname). |
| `...props` | `LucideProps` | — | Forwarded to the icon. |

```tsx
<SocialLinkIcon label={link.label} className={ICON_CLASS} />
```

### sections

Overview-tab sections for an Organization profile. Barrel: `src/components/profiles/organizations/sections/index.ts` exports `DescriptionSection`, `ActiveProjectsSection`, `RecentArticlesSection` and `MembersSection`; the fifth file in the directory, `OrgPostsFeed.tsx`, is an empty placeholder (below).

#### DescriptionSection

A "Description" heading and the Organization's description text. Returns `null` when there is no description.

- **Source:** [src/components/profiles/organizations/sections/DescriptionSection.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/sections/DescriptionSection.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/app/(main)/(profile)/organizations/[slug]/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `org` | `OrganizationWithRelations` | — | Only `description` is read. |

```tsx
<DescriptionSection org={org} />
```

#### ActiveProjectsSection

An "Active Projects" carousel of `CondensedProjectCard`s, or an `EmptyState`.

- **Source:** [src/components/profiles/organizations/sections/ActiveProjectsSection.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/sections/ActiveProjectsSection.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/app/(main)/(profile)/organizations/[slug]/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `projects` | `OrganizationProjectCard[]` | — | All of the Organization's projects. |

Notable behaviour:

- Excludes projects whose `project_status.status` is `"archived"` and caps the carousel at 12.

```tsx
<ActiveProjectsSection projects={org.projects} />
```

#### RecentArticlesSection

A "Recent Articles" carousel of `CondensedArticleCard`s, or an `EmptyState`.

- **Source:** [src/components/profiles/organizations/sections/RecentArticlesSection.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/sections/RecentArticlesSection.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/app/(main)/(profile)/organizations/[slug]/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `articles` | `OrganizationArticleCard[]` | — | The Organization's articles. |

Notable behaviour:

- Drops articles with a null `published_at` (narrowing the type for `CondensedArticleCard`) and caps at 12.

```tsx
<RecentArticlesSection articles={org.articles} />
```

#### MembersSection

A "Members" heading and a one- or two-column grid of `UserCard`s. Returns `null` when no member has a `user_profile`.

- **Source:** [src/components/profiles/organizations/sections/MembersSection.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/sections/MembersSection.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/app/(main)/(profile)/organizations/[slug]/page.tsx`, `src/app/(main)/(profile)/organizations/[slug]/(tabs)/members/page.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `members` | `OrganizationMember[]` | — | Members; those without a joined `user_profile` are skipped. |

```tsx
<MembersSection members={org.members} />
```

#### OrgPostsFeed

An empty placeholder for an Organization-scoped posts feed section. The file has no content and exports nothing, and the sections barrel does not list it. The Organization posts tab renders the shared `PostsInfiniteFeed` with an `organizationId` directly instead (see [Posts Feed & Post Creation](../../features/posts/)).

- **Source:** [src/components/profiles/organizations/sections/OrgPostsFeed.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/profiles/organizations/sections/OrgPostsFeed.tsx)
- **Kind:** Empty file (no exports)
- **Used in:** No call sites.
