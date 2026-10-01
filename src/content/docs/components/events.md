---
title: "Events"
description: The single calendar-event creation dialog under src/components/events.
sidebar:
  order: 5
---

The events domain currently holds one component: a controlled dialog that creates an all-day calendar event through the `/api/events` route. Nothing in `src/` renders it yet.

## NewEventDialog

A dialog with its own "New Event" trigger button and a two-field form (title, date) that posts a new all-day event to `/api/events`.

- **Source:** [src/components/events/NewEventDialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/events/NewEventDialog.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** no call sites in `src/`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state of the dialog. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the dialog opens or closes, including from the Cancel button and after a successful submit. |
| `onEventCreated` | `() => void` | — | Optional callback fired after the event is created. |

Notable behaviour:

- The dialog renders its own `DialogTrigger`: a full-width `Button` with a `PlusIcon` labelled "New Event". The parent only owns the open state.
- Form state uses React Hook Form with `zodResolver(newEventSchema)` from `@/zod/events`. The schema is `title` (`safeString({ profanity: true }).trim()`) and `date` (`z.string()`). Defaults are empty strings.
- On submit, the date becomes a whole-day range: `start_time` is the chosen date at `00:00:00.000` and `end_time` is the same date at `23:59:59.999`, both converted with `toISOString()` in the browser's local timezone. The request body is `{ title, start_time, end_time }`, sent as a JSON `POST` to `/api/events`.
- On success it shows a `toast.success`, resets the form, closes the dialog and calls `onEventCreated`. On a non-OK response or a thrown error, it logs through `logError` (logger category `["components", "events"]`) and shows `toast.error("Failed to create event")`.
- The Cancel and submit buttons are disabled while `formState.isSubmitting`; the submit label switches to "Creating...".
