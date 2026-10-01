---
title: "Display"
description: Read-only presentation primitives — empty states, dates, badges, chip rows, document metadata and the PDF viewer.
sidebar:
  order: 4
---

Presentation components that render data without owning it. Reach for these instead of raw markup: `EmptyState` for any "nothing here" message, `DateDisplay` for any formatted date, and the chip-row components for category chips that must fit on one line.

The barrel `src/components/ui/display/index.ts` exports `EmptyState`, `DateDisplay`, `CardFooter`, `Text`, `DocumentMetadata` and `AttachedItemCard` (plus their `*Props` types). Everything else on this page is imported from its own file path.

## AttachedItemCard

A list item (`<li>`) showing an icon tile, a title, optional children (usually `DocumentMetadata`), and optional remove and download buttons. Use it for attached files and linked items in forms and document lists; render it inside a `<ul>`.

- **Source:** [src/components/ui/display/AttachedItemCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/AttachedItemCard.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/page/sections/DocumentsSection.tsx`, `src/components/projects/form/steps/DocumentsSection.tsx`, `src/components/articles/form/sections/attachments/ArticlePaperUpload.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | — | Icon rendered in the leading tile. Required. |
| `title` | `string` | — | Item title. Required. Also used in the download button's `aria-label`. |
| `children` | `ReactNode` | — | Rendered under the title. |
| `iconContainerClassName` | `string` | `"bg-body-parchment"` | Classes for the icon tile (replaces the default background). |
| `className` | `string` | — | Merged onto the `<li>`. |
| `onRemove` | `() => void` | — | When set, shows a trash button that calls it. |
| `removeAriaLabel` | `string` | — | `aria-label` for the remove button. |
| `downloadHref` | `string` | — | When set, shows a download link (`target="_blank"`). Takes precedence over `onDownload`. |
| `onDownload` | `() => void` | — | When set and `downloadHref` is not, shows a download button that calls it. |
| `onClick` | `() => void` | — | Click handler on the whole `<li>`. |

Notable behaviour:

- Title is clamped to two lines on mobile and truncated to one line from `md` up.
- Only one download control renders: the link if `downloadHref` is set, otherwise the button if `onDownload` is set.

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

A small "label + arrow" row for the bottom of a clickable card. The text colour and arrow nudge respond to a parent `group` hover.

- **Source:** [src/components/ui/display/CardFooter.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/CardFooter.tsx)
- **Kind:** Server component (no directive)
- **Used in:** No call sites found; exported from `@/components/ui`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Footer text. Required. |

## CategoryBadges

Category chips derived from a list of subcategories, styled as bordered pills on a `bg-bg-cold` background. A thin wrapper over `CategoryChipRow` with a fixed chip style.

- **Source:** [src/components/ui/display/CategoryBadges.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/CategoryBadges.tsx)
- **Kind:** Server component (no directive; renders the client `CategoryChipRow`)
- **Used in:** `src/components/posts/attachments/AttachedProject.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `subcategories` | `{ id; slug; name; category: { id; name; slug } }[]` | — | Subcategories whose parent categories are shown. Required. |
| `showMore` | `boolean` | `true` | Show the "Show more / Show less" toggle when chips overflow. |
| `appendedItem` | `ReactNode` | — | Passed to `CategoryChipRow` as `prepend` — rendered before the chips despite the name. |
| `className` | `ClassNameValue` | — | Classes for the row wrapper. |
| `categoryClassName` | `ClassNameValue` | — | Extra classes merged onto each chip. |

```tsx
<CategoryBadges
  subcategories={project.subcategories}
  categoryClassName="bg-transparent"
/>
```

## CategoryChipRow

Dedupes subcategories to their parent categories and renders them as a single-line chip row (via `MeasuredChipRow`) with a "Show more / Show less" toggle for the overflow. Callers supply the chip styling.

- **Source:** [src/components/ui/display/CategoryChipRow.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/CategoryChipRow.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/page/HeroCategoryBadges.tsx`, `src/components/projects/cards/ProjectCardCategories.tsx`, `src/components/articles/pages/ArticleHeroSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `subcategories` | `S[]` where `S extends { category: { id; name; slug } }` | — | Source subcategories. Required. |
| `chipClassName` | `ClassNameValue` | — | Classes for each chip, merged after `font-label` and `CATEGORY_CHIP_BORDER`. Required. |
| `className` | `ClassNameValue` | — | Classes for the outer flex wrapper. |
| `prepend` | `ReactNode` | — | Rendered before the chips. |
| `showMore` | `boolean` | `true` | Render the toggle button as the overflow node. |

Notable behaviour:

- Categories are deduped with `dedupeSubcategoriesToCategories`. If none remain, it renders `prepend` (or nothing).
- The toggle has `aria-expanded` and switches the row to wrapped "show all" mode.

```tsx
<CategoryChipRow
  subcategories={subcategories}
  chipClassName={chipClassName}
  className={className}
/>
```

## ChipOverflowTooltip

A "+N" chip whose tooltip lists the hidden items as chips. Designed to be the `renderOverflow` node of `MeasuredChipRow`.

- **Source:** [src/components/ui/display/ChipOverflowTooltip.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/ChipOverflowTooltip.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/cards/CardCategoryBadges.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `T[]` | — | Hidden items. The trigger shows `+{items.length}`. Required. |
| `getKey` | `(item: T) => string` | — | React key per item. Required. |
| `getLabel` | `(item: T) => string` | — | Text per item in the tooltip. Required. |
| `triggerClass` | `string` | — | Classes for the "+N" trigger chip. Required. |
| `contentChipClass` | `string` | `triggerClass` | Classes for each chip in the tooltip. |
| `getContentClass` | `(item: T) => string` | — | Per-item class; overrides `contentChipClass` when it returns a value. |

Notable behaviour: the trigger's `aria-label` is hard-coded as "`N` more categories".

```tsx
<ChipOverflowTooltip
  items={hidden}
  getKey={(cat) => cat}
  getLabel={(cat) => cat}
  triggerClass={chipClassName}
  contentChipClass={overflowChipClass}
/>
```

## DateDisplay

Renders a date inside a `<time dateTime=…>` element in one of several fixed formats. Use it for every user-facing date instead of formatting inline.

- **Source:** [src/components/ui/display/DateDisplay.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/DateDisplay.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/cards/ProjectCard.tsx`, `src/components/projects/page/ProjectHeroSection.tsx`, `src/components/ui/comments/CommentItem.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `date` | `string \| Date \| null \| undefined` | — | Date to show. Required. Renders nothing if empty or invalid. |
| `format` | `"relative" \| "countdown" \| "short" \| "long" \| "date" \| "date-dot" \| "day-month" \| "short-time" \| "long-time"` | `"short"` | Output format (see below). |
| `prefix` | `string` | — | Text placed before the date, followed by a space. |
| `className` | `string` | — | Merged onto the `<time>` element. |

Plus all `<time>` HTML attributes.

Formats (date-fns patterns):

| Format | Output |
|---|---|
| `relative` | `formatFromNow` result with "in …" / "… ago", or "now" |
| `countdown` | `formatCountdown` result |
| `short` | `MMM d, yyyy` |
| `long` | `MMMM d, yyyy` |
| `date` | `dd/MM/yyyy` |
| `date-dot` | `dd.MM.yyyy` |
| `day-month` | `d MMM` |
| `short-time` | `MMM d, HH:mma` |
| `long-time` | `MMM d, yyyy HH:mma` |

Notable behaviour: the formatter is wrapped in `<Suspense>` whose fallback is a `<span>` with the ISO string reformatted as `yyyy/MM/dd HH:mm`.

```tsx
<DateDisplay
  date={project.updated_at}
  format="relative"
  className="font-body-sm text-placeholder"
/>
```

## DocumentMetadata

A `<dl>` row of document facts — type, file size and page count — separated by middle dots. Each item is omitted when its value is falsy; the whole component renders nothing if all are.

- **Source:** [src/components/ui/display/DocumentMetadata.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/DocumentMetadata.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/articles/form/sections/attachments/ArticlePaperUpload.tsx`, `src/components/articles/form/sections/attachments/ArticleAnnexesUpload.tsx`, `src/components/projects/form/steps/DocumentsSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `attachmentType` | `string \| null` | — | Shown as-is under the "Type" label. |
| `fileSizeBytes` | `number \| null` | — | Formatted with `formatFileSize`. |
| `pageCount` | `number \| null` | — | Shown as "1 page" / "N pages". |
| `itemClassName` | `ClassNameValue` | — | Classes merged onto each item wrapper. |

Notable behaviour: `<dt>` labels are `sr-only`; only values are visible.

```tsx
<DocumentMetadata
  attachmentType="Paper File"
  fileSizeBytes={pdf.file_size_bytes}
  pageCount={pdf.page_count}
/>
```

## EmptyState

A centred `<section>` with an optional icon, a title, an optional description and optional children (typically a call-to-action button). Use it for every empty list or "nothing here" message rather than a raw centred `<div>`.

- **Source:** [src/components/ui/display/EmptyState.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/EmptyState.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/ui/comments/CommentList.tsx`, `src/components/projects/pages/dashboard/PrivateProjectsInfiniteFeed.tsx`, `src/components/organizations/members/InvitationsTab.tsx` (36 files in total)

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Main message. Required. |
| `description` | `string` | — | Secondary text under the title. |
| `icon` | `ReactNode` | — | Rendered through a Radix `Slot` that applies the size's icon dimensions. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Controls vertical padding (`py-8` / `py-12` / `py-16`), icon size and title typography. |
| `className` | `string` | `""` | Merged onto the `<section>`. |
| `children` | `ReactNode` | — | Rendered after the description. |

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

A gradient "Founding Member" pill with a star glyph. User and Organization profiles use different palettes.

- **Source:** [src/components/ui/display/FoundingMemberBadge.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/FoundingMemberBadge.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/profiles/users/ProfileDataSlot.tsx`, `src/components/profiles/organizations/OrganizationDataSlot.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"user" \| "organization"` | — | Palette. Required. |
| `className` | `string` | — | Merged onto the badge. |

```tsx
{profile.has_alpha_badge && <FoundingMemberBadge variant="user" />}
```

## MeasuredChipRow

Generic single-line chip row: measures each chip's real width in a hidden mirror list, shows as many as fit the container, and hands the rest to a caller-supplied overflow node. The building block behind `CategoryChipRow` and `CardCategoryBadges`.

- **Source:** [src/components/ui/display/MeasuredChipRow.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/MeasuredChipRow.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/display/CategoryChipRow.tsx`, `src/components/ui/cards/CardCategoryBadges.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `T[]` | — | Items to render. Renders nothing when empty. Required. |
| `getKey` | `(item: T) => string` | — | Stable key per item; keys also drive re-measurement. Required. |
| `renderChip` | `(item: T) => ReactNode` | — | Renders one chip. Required. |
| `renderOverflow` | `(hidden: T[]) => ReactNode` | — | Renders the overflow node, given the hidden items. Required. |
| `className` | `string` | — | Merged onto the outer container. |
| `showAll` | `boolean` | `false` | Show every item and let the row wrap. |

Notable behaviour:

- Needs a width-bounded container. Re-measures on container resize (`ResizeObserver`) and skips measuring while the container width is 0 (e.g. hidden at a breakpoint).
- Assumes an 8px gap between chips and reserves 72px for the overflow node when not everything fits.
- With `showAll`, `renderOverflow` is still called (with all items) so a "Show less" toggle can stay visible.

```tsx
<MeasuredChipRow
  items={categories}
  getKey={(cat) => cat}
  renderChip={(cat) => <span className={chipClassName}>{cat}</span>}
  renderOverflow={(hidden) => (
    <ChipOverflowTooltip
      items={hidden}
      getKey={(cat) => cat}
      getLabel={(cat) => cat}
      triggerClass={chipClassName}
    />
  )}
/>
```

## OrgVerifiedBadge

A green check badge marking a verified Organization, optionally with a "Verified" label.

- **Source:** [src/components/ui/display/OrgVerifiedBadge.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/OrgVerifiedBadge.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/users/AuthorByline.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `boolean` | `false` | Show the "Verified" label; without it the badge has no padding. |
| `round` | `boolean` | `false` | Use the round `CircleCheck` icon instead of `BadgeCheck`. |

```tsx
{authoringOrg.verified && <OrgVerifiedBadge round />}
```

## SDGs

A list of "SDG N" badges, each colour-coded per goal, with a tooltip showing the goal title.

- **Source:** [src/components/ui/display/SDGs.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/SDGs.tsx)
- **Kind:** Server component (no directive; uses shadcn `Tooltip`)
- **Used in:** `src/components/projects/page/ProjectHeroSection.tsx`, `src/components/articles/pages/ArticleHeroSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `sdgs` | `SDG[]` | — | Goals to show. Renders nothing if missing or empty. |

Notable behaviour: the list has `aria-label="Sustainable Development Goals"`; each badge is wrapped in a focusable `<button>` so keyboard users can open the tooltip.

```tsx
<SDGs sdgs={project.sdgs} />
```

## Tags

A "Keywords:" row of keyword badges for article or project tags.

- **Source:** [src/components/ui/display/Tags.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/Tags.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/articles/pages/ArticleContentSection.tsx`, `src/components/projects/page/sections/OverviewSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `tags` | `(ArticleTag \| ProjectTag)[]` | — | Tags to render (uses each item's `tag` field). Renders nothing if missing or empty. |
| `ariaLabel` | `string` | `"Keywords"` | `aria-label` for the `role="list"` wrapper. |

Notable behaviour: the "Keywords:" prefix is hidden below `md`.

```tsx
<Tags tags={article.article_tags} ariaLabel="Article Keywords" />
```

## Text

A typed text element mapping `size` and `color` names to design-system classes.

- **Source:** [src/components/ui/display/Text.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/Text.tsx)
- **Kind:** Server component (no directive)
- **Used in:** No call sites found; exported from the display barrel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content. Required. |
| `as` | `"span" \| "p" \| "div"` | `"p"` | Element to render. |
| `size` | `"sm" \| "md" \| "lg" \| "display" \| "caption"` | — | Maps to `font-body-sm`, `text-body-md`, `font-body-lg`, `font-display`, `font-caption`. |
| `color` | `"primary" \| "secondary" \| "accent" \| "success" \| "warning" \| "yellow" \| "destructive" \| "blue" \| "green" \| "purple" \| "pink" \| "muted" \| "subtle" \| "link"` | — | Maps to the matching text colour token (`primary` → `text-foreground`). |
| `className` | `string` | — | Merged last. |

## PDFViewer

Client-only PDF viewer for a file URL, with a toolbar (file name, page count, zoom, optional download, fullscreen toggle). `Viewer.tsx` exports this wrapper, which waits for hydration and loads the real viewer with `next/dynamic` (`ssr: false`).

- **Source:** [src/components/ui/display/PDFViewer/Viewer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/Viewer.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/articles/pages/ArticleContentSection.tsx`, `DocumentSelector` (below)

| Prop | Type | Default | Description |
|---|---|---|---|
| `fileUrl` | `string \| null` | — | URL of the PDF. Renders nothing when null. Required. |
| `fileName` | `string` | — | Shown in the toolbar and used as the download file name (falls back to `"file"`). |
| `allowDownload` | `boolean` | — | Show the download button outside fullscreen. In fullscreen the button is always shown. |

Notable behaviour (implemented in `PDFViewer.tsx`):

- Uses `react-pdf`; the pdf.js worker, cMaps, fonts, WASM and ICC data load from `unpkg.com` at the installed `pdfjs` version.
- Pages render lazily: each page is a placeholder until it comes within 600px of the scroll viewport, then renders. The visible page is tracked with an `IntersectionObserver`.
- Pages are sized to fit inside a 16px gutter and are never wider than 900px. Zoom steps by 0.25 between 0.5 and 2.5 (capped at 1.25 in fullscreen); zooming in grows width only, so tall pages scroll.
- The inline viewer is fixed at `h-110`; fullscreen fills a modal-like overlay.
- Page, zoom and loaded-file state live above `FullScreenWrapper` so they survive toggling fullscreen.
- Imports `viewer.custom.css`, which centres `.react-pdf__Document` / `.react-pdf__Page`, makes page backgrounds transparent and pads `.react-pdf__message`.

```tsx
<PDFViewer
  fileUrl={getImageUrl(pdfFile.path)}
  allowDownload
  fileName={pdfFile.title || pdfFile.filename}
/>
```

## DocumentSelector

A document list plus PDF viewer: each document is an `AttachedItemCard` with `DocumentMetadata`; clicking a PDF shows it in the `PDFViewer` next to the list. Exported from the same file as `PDFViewer`.

- **Source:** [src/components/ui/display/PDFViewer/Viewer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/Viewer.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/articles/pages/ArticleDocumentsSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `documents` | `ArticleDocument[]` | — | Article documents to list. Renders nothing when empty. Required. |

Notable behaviour:

- PDFs sort first and the first PDF is selected automatically. Non-PDF items get `cursor-not-allowed` and do not change the selection.
- Every item has a download button that calls `downloadFile`.
- The type label is the upper-cased file extension, or "FILE".
- Calls `.sort()` on the `documents` prop, so the caller's array is sorted in place.

```tsx
<DocumentSelector documents={documents} />
```

## Internal PDF viewer parts

These live under `PDFViewer/` and are used only by the viewer itself. None has a `"use client"` directive; they run on the client because they are imported from `PDFViewer.tsx`.

- **`PDFWebViewer`** (default export of [PDFViewer/PDFViewer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/PDFViewer.tsx)) — the `react-pdf` viewer loaded dynamically by `PDFViewer`. Takes `fileUrl: string`, `fileName?: string`, `allowDownload?: boolean`. The directory's other parts — `FullScreenWrapper`, `ViewerToolbar` and `ViewerToolbarButton` — each have their own section below.

## FullScreenWrapper

Render-prop wrapper owning the viewer's fullscreen state. Inline it renders its children in a plain relative flex container; in fullscreen it moves them into a fixed, blurred backdrop overlay and reports the state through the render prop.

- **Source:** [src/components/ui/display/PDFViewer/FullScreenWrapper.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/FullScreenWrapper.tsx)
- **Kind:** No `"use client"` directive (uses React state; runs on the client inside `PDFViewer`)
- **Used in:** `src/components/ui/display/PDFViewer/PDFViewer.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `(props: { isFullscreen: boolean; toggleFullscreen: () => void }) => ReactNode` | — | Render function, called in both modes; `toggleFullscreen` flips the state. Required. |
| `className` | `ClassNameValue` | — | Extra classes for the fullscreen content box; ignored while inline. |

Notable behaviour:

- Inline mode wraps the children in a `relative flex` div (`w-full min-w-0 max-w-full`).
- Fullscreen mode is a fixed `inset-0 z-50` overlay (`bg-overlay-scrim backdrop-blur-sm`) holding a centred `max-w-6xl max-h-[90vh]` content box; `className` is merged onto that box.
- While fullscreen, `Escape` or a `mousedown` outside the content box closes it; the window listeners exist only while fullscreen. The outside check uses `mousedown` so it reacts the moment a press starts on the backdrop, which is safe only while nothing inside portals outside the content box.
- The root element differs per mode, so toggling remounts everything below the wrapper — which is why `PDFViewer` keeps page, zoom and file state above it.

## ViewerToolbar

The bar above the pages: file name and page count on the left, download, zoom out/in and fullscreen buttons on the right. Every button is a `ViewerToolbarButton`.

- **Source:** [src/components/ui/display/PDFViewer/ViewerToolbar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/ViewerToolbar.tsx)
- **Kind:** No `"use client"` directive (no hooks; runs on the client inside `PDFViewer`)
- **Used in:** `src/components/ui/display/PDFViewer/PDFViewer.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `fileName` | `string` | — | Truncated label on the left. |
| `fileUrl` | `string` | — | File handed to `downloadFile` by the download button. |
| `fullScreen` | `boolean` | — | Always shows the download button and caps zoom-in at 1.25. |
| `scaleFactor` | `number` | — | Current zoom; disables zoom out at the minimum and zoom in at the cap. |
| `setScaleFactor` | `Dispatch<SetStateAction<number>>` | — | Receives the zoom writes. |
| `toggleFullscreen` | `() => void` | — | Fullscreen button handler. |
| `totalPages` | `number` | — | Shown as "N pages"; a spinner shows until it arrives. |
| `allowDownload` | `boolean` | — | Shows the download button outside fullscreen. |

Notable behaviour:

- Zoom steps by 0.25 between 0.5 and 2.5; in fullscreen zoom-in is disabled from 1.25 up.
- Download calls `downloadFile(fileUrl, fileName)`.
- The page count is formatted with `pluralizeMetric`; a spinning `Loader2` shows while `totalPages` is unknown.
- Page previous/next controls are commented out in the source, along with their `onChangePage` prop.

## ViewerToolbarButton

The toolbar's compact ghost icon button.

- **Source:** [src/components/ui/display/PDFViewer/ViewerToolbarButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/display/PDFViewer/ViewerToolbarButton.tsx)
- **Kind:** No `"use client"` directive (no hooks; runs on the client inside `ViewerToolbar`)
- **Used in:** `src/components/ui/display/PDFViewer/ViewerToolbar.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | — | Icon, passed to `Button` as `iconLeft`. Required. |
| `onClick` | `() => void` | — | Click handler. Required. |
| `disabled` | `boolean` | — | Disables the button and detaches `onClick`. |
| `className` | `string` | — | Extra classes. |

Plus all `<button>` props.

Notable behaviour: renders a ghost `Button` fixed at `size-6 p-0 rounded-sm` with muted text and a 1.5px icon stroke. While `disabled`, `onClick` is not attached at all rather than merely ignored.
