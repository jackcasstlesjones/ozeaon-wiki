---
title: "Display"
description: Read-only presentation primitives — empty states, dates, badges, chip rows, document metadata and the PDF viewer.
sidebar:
  order: 4
---

Presentation components that render data without owning it. Reach for these instead of raw markup: `EmptyState` for any "nothing here" message, `DateDisplay` for any formatted date, and the chip-row components for category chips that must fit on one line. The barrel `src/components/ui/display/index.ts` exports `EmptyState`, `DateDisplay`, `CardFooter`, `Text`, `DocumentMetadata` and `AttachedItemCard`; everything else on this page is imported from its own file path. See also [UI Primitives](../../../design-system/ui-primitives/).

## AttachedItemCard

A list item (`<li>`) showing an icon tile, a title, optional children (usually `DocumentMetadata`), and optional remove and download buttons. Use it for attached files and linked items in forms and document lists; render it inside a `<ul>`. Only one download control renders: the link if `downloadHref` is set, otherwise the button.

**Source:** [src/components/ui/display/AttachedItemCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/AttachedItemCard.tsx)

```tsx
<AttachedItemCard
  key={doc.id}
  icon={File}
  iconContainerClassName="bg-lavender-mist rounded-xl"
  className="rounded-xl"
  title={doc.title ?? doc.filename}
  downloadHref={getImageUrlFromKey(doc.path)}
>
  <DocumentMetadata /* ... */ />
</AttachedItemCard>
```

## CardFooter

A small "label + arrow" row for the bottom of a clickable card. The text colour and arrow nudge respond to a parent `group` hover. No call sites found; exported from `@/components/ui`.

**Source:** [src/components/ui/display/CardFooter.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/CardFooter.tsx)

## CategoryBadges

Category chips derived from a list of subcategories, styled as bordered pills on a `bg-bg-cold` background. A thin wrapper over `CategoryChipRow` with a fixed chip style.

**Source:** [src/components/ui/display/CategoryBadges.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/CategoryBadges.tsx)

## CategoryChipRow

Dedupes subcategories to their parent categories and renders them as a single-line chip row (via `MeasuredChipRow`) with a "Show more / Show less" toggle for the overflow. If no categories remain after deduplication, renders `prepend` or nothing. Callers supply the chip styling.

**Source:** [src/components/ui/display/CategoryChipRow.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/CategoryChipRow.tsx)

## ChipOverflowTooltip

A "+N" chip whose tooltip lists the hidden items as chips. Designed to be the `renderOverflow` node of `MeasuredChipRow`. The trigger's `aria-label` is hard-coded as "N more categories".

**Source:** [src/components/ui/display/ChipOverflowTooltip.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/ChipOverflowTooltip.tsx)

## DateDisplay

Renders a date inside a `<time dateTime=…>` element in one of several fixed formats (`relative`, `countdown`, `short`, `long`, `date`, `date-dot`, `day-month`, `short-time`, `long-time`). Use it for every user-facing date instead of formatting inline. The formatter is wrapped in `<Suspense>` whose fallback shows the ISO string reformatted as `yyyy/MM/dd HH:mm`.

**Source:** [src/components/ui/display/DateDisplay.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/DateDisplay.tsx)

```tsx
<DateDisplay
  date={project.updated_at}
  format="relative"
  className="font-body-sm text-placeholder"
/>
```

## DocumentMetadata

A `<dl>` row of document facts — type, file size and page count — separated by middle dots. Each item is omitted when its value is falsy; the whole component renders nothing if all are. `<dt>` labels are `sr-only`; only values are visible.

**Source:** [src/components/ui/display/DocumentMetadata.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/DocumentMetadata.tsx)

## EmptyState

A centred `<section>` with an optional icon, a title, an optional description and optional children (typically a call-to-action button). Use it for every empty list or "nothing here" message rather than a raw centred `<div>`.

**Source:** [src/components/ui/display/EmptyState.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/EmptyState.tsx)

```tsx
<EmptyState
  size="lg"
  icon={<Folders className="size-10!" strokeWidth={1.5} />}
  title="No projects yet"
>
  <Button type="button" /* ... */ />
</EmptyState>
```

## FoundingMemberBadge

A gradient "Founding Member" pill with a star glyph. User and organisation profiles use different colour palettes; pass `variant="user"` or `variant="organization"`.

**Source:** [src/components/ui/display/FoundingMemberBadge.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/FoundingMemberBadge.tsx)

## MeasuredChipRow

Generic single-line chip row: measures each chip's real width in a hidden mirror list, shows as many as fit the container, and hands the rest to a caller-supplied overflow node. The building block behind `CategoryChipRow` and `CardCategoryBadges`. Needs a width-bounded container; re-measures on `ResizeObserver` resize and skips measuring while the container width is 0 (e.g. hidden at a breakpoint).

**Source:** [src/components/ui/display/MeasuredChipRow.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/MeasuredChipRow.tsx)

## OrgVerifiedBadge

A green check badge marking a verified organisation, optionally with a "Verified" label. Renders the `verified` column from the organisations table; there is no verification flow yet (org verification is on the roadmap).

**Source:** [src/components/ui/display/OrgVerifiedBadge.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/OrgVerifiedBadge.tsx)

## SDGs

A list of "SDG N" badges, each colour-coded per goal, with a tooltip showing the goal title. The list has `aria-label="Sustainable Development Goals"`; each badge is wrapped in a focusable `<button>` so keyboard users can open the tooltip.

**Source:** [src/components/ui/display/SDGs.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/SDGs.tsx)

## Tags

A "Keywords:" row of keyword badges for article or project tags. The "Keywords:" prefix is hidden below `md`. Renders nothing when the tags array is missing or empty.

**Source:** [src/components/ui/display/Tags.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/Tags.tsx)

## Text

A typed text element mapping `size` and `color` names to design-system classes. No call sites found; exported from the display barrel.

**Source:** [src/components/ui/display/Text.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/Text.tsx)

## PDFViewer

Client-only PDF viewer for a file URL, with a toolbar (file name, page count, zoom, optional download, fullscreen toggle). Loaded with `next/dynamic` (`ssr: false`), so it is safe to import on any page but renders only after hydration. The pdf.js worker, cMaps and assets load from `unpkg.com`. Page, zoom and loaded-file state live above `FullScreenWrapper` because toggling fullscreen remounts everything below it.

**Source:** [src/components/ui/display/PDFViewer/Viewer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/Viewer.tsx)

```tsx
<PDFViewer
  fileUrl={getImageUrl(pdfFile.path)}
  allowDownload
  fileName={pdfFile.title || pdfFile.filename}
/>
```

## DocumentSelector

A document list plus PDF viewer: each document is an `AttachedItemCard` with `DocumentMetadata`; clicking a PDF shows it in the `PDFViewer` next to the list. Exported from the same file as `PDFViewer`. Calls `.sort()` on the `documents` prop, so the caller's array is sorted in place.

**Source:** [src/components/ui/display/PDFViewer/Viewer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/Viewer.tsx)

## Internal PDF Viewer Parts

These live under `PDFViewer/` and are used only by the viewer itself. None has a `"use client"` directive; they run on the client because they are imported from `PDFViewer.tsx`.

- **`PDFWebViewer`** — the `react-pdf` viewer loaded dynamically by `PDFViewer`. [PDFViewer/PDFViewer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/PDFViewer.tsx)
- **`FullScreenWrapper`** — render-prop wrapper owning fullscreen state; toggling fullscreen remounts everything below it (which is why viewer state lives above). While fullscreen, Escape or a `mousedown` outside the content box closes it. [PDFViewer/FullScreenWrapper.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/FullScreenWrapper.tsx)
- **`ViewerToolbar`** — file name and page count on the left, zoom/download/fullscreen buttons on the right. Page previous/next controls are commented out. [PDFViewer/ViewerToolbar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/ViewerToolbar.tsx)
- **`ViewerToolbarButton`** — compact ghost icon button used by `ViewerToolbar`. While `disabled`, `onClick` is not attached at all. [PDFViewer/ViewerToolbarButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/ViewerToolbarButton.tsx)
