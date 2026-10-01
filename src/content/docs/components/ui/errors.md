---
title: "Errors"
description: Error boundary fallback screen and the persistent page-level form error banner.
sidebar:
  order: 5
---

Error presentation, imported from `@/components/ui/errors`. Use `ErrorFallback` for `error.tsx` boundaries and full-area failure states. Use `FormErrorBanner` for a blocking form failure that must stay visible until the user acts, where a self-clearing toast would be wrong. See also [UI Primitives](../../../design-system/ui-primitives/).

## ErrorFallback

A centred error screen with a title, a description, an optional error digest, "Try again" and a home link. Pass `error` and `reset` from an `error.tsx` boundary, or just a title and description for a static failure state.

**Source:** [src/components/ui/errors/ErrorFallback.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/errors/ErrorFallback.tsx)

## FormErrorBanner

An inline alert banner (`role="alert"`) with an optional dismiss button. It renders nothing when `message` is null. It **doesn't self-clear**: the caller owns `message` and clears it.

**Source:** [src/components/ui/errors/FormErrorBanner.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/errors/FormErrorBanner.tsx)
