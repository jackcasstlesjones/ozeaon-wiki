---
title: "Documentation Conventions"
description: "Figma owns visuals, specs own behaviour, and what to do when they disagree."
sidebar:
  order: 3
---

Two documents describe every feature. Figma covers visuals. The spec covers logic. They do not overlap.

## Figma is the source of truth for visuals

Anything a user can see is defined in Figma. That includes:

- Colours, typography, and spacing.
- Component placement and layout.
- Iconography and imagery.
- Copy that appears in the UI.
- Empty, loading, and error states.

Do not restate any of this in a spec. If it is in Figma, do not describe it in prose.

## Specs are the source of truth for behaviour

The spec covers what the feature does and why. That includes:

- What the feature is for and who uses it.
- What actions each role can take.
- What states exist and what triggers transitions between them.
- What validation applies to each input.
- What errors surface and when.
- What side effects a change has, for example emails, notifications, or counter updates.
- Any non-visible rules, for example permissions or rate limits.

The spec does not describe where a button sits, what colour it is, or what icon it uses.

## When Figma and the spec disagree

- Visual detail. Figma wins. Update the spec only if the disagreement is behavioural.
- Behavioural detail. Spec wins. Update Figma to reflect the specced behaviour, then flag the mismatch on the ticket.

## Why we split them this way

Duplicating visual detail in specs creates a maintenance burden. Every small design change would require two edits, and specs would drift out of date quickly. Keeping Figma authoritative for visuals and specs authoritative for behaviour lets each artefact stay tight and current.

The tradeoff is that reading a spec alone is not enough to build a feature. Read the spec for behaviour, then open Figma for the visuals. Both should be linked from every dev ticket in Monday.
