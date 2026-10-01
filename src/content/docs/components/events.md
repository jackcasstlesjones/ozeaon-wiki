---
title: "Events"
description: Unused scaffolding for the planned Events feature, a single event-creation dialog.
sidebar:
  order: 5
---

**Events are on the roadmap and not built.** This folder holds unwired scaffolding: nothing renders the dialog, and no page lists events. The [`/api/events`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/api/events) route it would call also has no callers. It accepts an authenticated POST without server-side schema validation, so add that before wiring anything up.

## NewEventDialog

A dialog with its own "New Event" trigger. It posts an all-day event (`{ title, start_time, end_time }`) to `/api/events`, with the title validated client-side by `newEventSchema`.

**Source:** [src/components/events/NewEventDialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/events/NewEventDialog.tsx)
