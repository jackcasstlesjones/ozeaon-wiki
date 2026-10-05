---
title: "Design Omissions"
description: "What a dev does when a design or spec leaves a small gap, and how the gap gets back into Figma and the spec."
sidebar:
  order: 5
---

Designs and specs will not cover everything. When a dev reaches the build and finds a gap - which parts of a design are clickable, hover or empty states, a small element the flow implies but nobody drew - they must not stop and wait, that would be too disruptive to our development process.

The dev is free to interpret the gap or add the small thing themselves. Build sensible defaults, match patterns already established elsewhere in the product, and keep moving. Blocking on a designer or BA for something small and obvious is worse than making the call in-flight.

Once the change is in, BA and Designer are informed and update the developer-facing Figma and spec so the docs stay authoritative.

Unless the dev's implementation is a catastrophically breaking mistake, it is accepted and can be iterated on further down the line. The default is to trust the call, ship it, and refine later through the normal change request flow - not to unwind the work.

## What counts as an omission

- Clickability or affordance not specified on an element that clearly needs one.
- Hover, focus, disabled, loading, or empty states not drawn.
- Micro-interactions the flow implies: a toast on save, a confirmation on destructive actions, a spinner during async work.
- Missing elements on a mobile version of a desktop design that are blocking functionality.

## The flow

1. Dev fills the gap while building.
2. Dev opens a change request ticket noting what they added or interpreted, and why.
3. Designer updates the developer-facing Figma to match what shipped. BA reviews and updates the spec if the change affects behaviour.

No silent additions. Even the smallest interpretation goes on a ticket so the spec and design stay in sync with the product.
