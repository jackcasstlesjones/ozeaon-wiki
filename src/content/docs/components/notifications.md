---
title: "Notifications"
description: The unread-notifications overlay opened from the top nav bell, and its row and skeleton components.
---

These components render the notification overlay. Import them from `@/components/notifications`. See also [Notifications](../../features/notifications/).

:::note[In progress]
Notifications are in progress (first release). The bell and overlay update in realtime and render only when `env.features.notifications` is on. The dedicated notifications page doesn't exist yet: the mobile bell renders without an overlay. Settings, grouping and digests are planned.
:::

The entry point lives in the nav: `NotificationBell` (server) reads the unread count and renders `NotificationBellButton`, which on desktop opens this overlay in a popover (see [Navigation](../nav/)). The overlay lists **unread notifications only**: a row disappears as soon as it is marked read.

## NotificationOverlay

The header, the "Mark all as read" action and the unread list, with loading, error (retry) and empty states. Data comes from `useNotifications(userId, open)`. Opening a row marks it read and navigates to its `destination_path`. "Mark all as read" marks only the currently loaded batch, not every unread notification.

**Source:** [src/components/notifications/NotificationOverlay.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/notifications/NotificationOverlay.tsx)

## NotificationRow

A single unread notification with its actor avatar, message, snippet, relative time and an options menu. The row button and the menu trigger are siblings, not nested. The menu has only "Mark as read"; delete isn't implemented. It renders an `<li>`, so place it in a `<ul>`.

**Source:** [src/components/notifications/NotificationRow.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/notifications/NotificationRow.tsx)

## NotificationRowSkeleton

Placeholder rows shown while the first batch loads. It renders `<li>` elements, so it must sit inside a `<ul>`.

**Source:** [src/components/notifications/NotificationRowSkeleton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/notifications/NotificationRowSkeleton.tsx)
