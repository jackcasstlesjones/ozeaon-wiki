---
title: "Images"
description: Wrappers around next/image for fixed-aspect containers and click-to-zoom images.
sidebar:
  order: 7
---

Thin wrappers around `next/image`. Both render nothing when `src` is empty, so callers do not need their own null checks.

Barrel: `src/components/ui/images/index.ts` exports `ImageContainer` and `ZoomableImage` (plus `ImageContainerProps` and `ZoomableImageProps`).

## ImageContainer

A rounded, `overflow-hidden` box with an optional fixed aspect ratio, containing a `fill` + `object-cover` `next/image`.

- **Source:** [src/components/ui/images/ImageContainer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/images/ImageContainer.tsx)
- **Kind:** Server component (no directive)
- **Used in:** No call sites found; exported from `@/components/ui`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string \| null` | — | Image URL. Renders nothing when empty. |
| `alt` | `string` | — | Alt text. Required. |
| `aspectRatio` | `"square" \| "video" \| "portrait" \| "auto"` | `"auto"` | `aspect-square`, `aspect-video`, `aspect-[3/4]`, or none. |
| `priority` | `boolean` | `false` | Passed to `next/image`. |
| `className` | `string` | — | Merged onto the wrapper `<div>`, not the image. |

Plus all other `next/image` props (forwarded to the `Image`, so they can override `fill` and `className`).

Notable behaviour: with `aspectRatio="auto"` the wrapper has no intrinsic height, so give it one via `className`.

## ZoomableImage

A `fill` image inside a button; clicking opens a dialog with the full image (`object-contain`, max 85vh tall).

- **Source:** [src/components/ui/images/ZoomableImage.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/images/ZoomableImage.tsx)
- **Kind:** Server component (no directive; uses the shadcn `Dialog`)
- **Used in:** `src/components/profiles/users/images/ImageCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image URL. Required; renders nothing when empty. |
| `alt` | `string` | `"Image"` | Alt text, also used for the trigger's `aria-label` ("View … in full size") and the dialog's hidden title. |
| `className` | `string` | — | Applied to the thumbnail `Image`. |
| `loading` | `"lazy" \| "eager"` | — | Thumbnail only. |
| `priority` | `boolean` | — | Thumbnail only. |
| `quality` | `number` | — | Thumbnail only. |
| `sizes` | `string` | — | Thumbnail only. |

Notable behaviour:

- The trigger button is `w-full h-full` with a `fill` image, so the parent must be positioned and sized.
- The zoomed image uses fixed `width={1200} height={800}` hints and ignores the thumbnail props.

```tsx
<ZoomableImage
  src={src}
  alt={alt}
  className="object-cover w-full h-full"
  loading="lazy"
  quality={85}
/>
```
