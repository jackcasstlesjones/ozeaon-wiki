---
title: "Images"
description: Wrappers around next/image for fixed-aspect containers and click-to-zoom images.
sidebar:
  order: 7
---

Thin wrappers around `next/image`, imported from `@/components/ui/images`. Both render nothing when `src` is empty, so callers don't need their own null checks. See also [Media & Images](../../../moderation-and-storage/media-and-images/).

## ImageContainer

A rounded box with an optional fixed aspect ratio, holding a `fill` + `object-cover` image. Other `next/image` props pass through. With `aspectRatio="auto"` the wrapper has no intrinsic height, so give it one via `className`.

**Source:** [src/components/ui/images/ImageContainer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/images/ImageContainer.tsx)

## ZoomableImage

A `fill` image inside a button. Clicking opens a dialog with the full image. The parent must be positioned and sized. The zoomed image uses its own size hints and ignores the thumbnail props.

**Source:** [src/components/ui/images/ZoomableImage.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/images/ZoomableImage.tsx)
