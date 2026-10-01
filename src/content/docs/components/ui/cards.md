---
title: "Cards"
description: Building blocks for condensed carousel cards, cover category chips and collapsible form cards.
sidebar:
  order: 2
---

Shared card pieces. The `CondensedCard*` parts compose the fixed-width article and project cards used in carousels. `CollapsibleCard` is the expandable section card used in editor forms and organization member lists. The `cards` barrel exports only the three `CondensedCard*` parts, so import the other two from their own files. See also [Cards & Layout](../../../design-system/cards-and-layout/).

## Condensed Cards

`CondensedCardShell` is the carousel-snapping frame, `CondensedCardCover` is the linked cover image with a badge and category chips, and `CondensedCardActions` is the arrow link at the bottom. They compose like this:

```tsx
<CondensedCardShell>
  <CondensedCardCover type="article" href={href} src={coverUrl} alt={title} badge={badge} categories={categories} />
  {/* byline, title, summary */}
  <CondensedCardActions href={href} label={`Read ${title}`} />
</CondensedCardShell>
```

**Source:** [CondensedCardShell.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CondensedCardShell.tsx), [CondensedCardCover.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CondensedCardCover.tsx), [CondensedCardActions.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CondensedCardActions.tsx)

## CardCategoryBadges

Category chips fitted to a single line, with a "+N" chip whose tooltip lists the hidden categories. It is built on `MeasuredChipRow` from [Display](../display/).

**Source:** [src/components/ui/cards/CardCategoryBadges.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CardCategoryBadges.tsx)

## CollapsibleCard

A collapsible card with a clickable header, a chevron and an optional delete button that confirms before calling `onRemove`. Use it for repeatable form sections (FAQs, team members, content sections) and org member/invite cards. The delete click doesn't toggle the card.

**Source:** [src/components/ui/cards/CollapsibleCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CollapsibleCard.tsx)
