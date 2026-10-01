---
title: "UI: Cards"
description: Building blocks for condensed carousel cards, cover category chips and collapsible form cards.
sidebar:
  order: 2
---

Shared card pieces. The `CondensedCard*` parts compose the fixed-width article and project cards used in carousels; `CollapsibleCard` is the expandable section card used in editor forms and organization member lists. The `cards/index.ts` barrel exports only the three `CondensedCard*` components — import `CardCategoryBadges` and `CollapsibleCard` from their own files.

## CondensedCardShell

The outer frame of a condensed card: a bordered, rounded flex column, 300px wide (`w-75`, `sm:w-md`), with `snap-center` for carousel scroll snapping.

- **Source:** [src/components/ui/cards/CondensedCardShell.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CondensedCardShell.tsx)
- **Kind:** Server component
- **Used in:** `src/components/articles/cards/CondensedArticleCard.tsx`, `src/components/projects/cards/CondensedProjectCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Card contents. |
| `className` | `string` | — | Extra classes. |

## CondensedCardCover

The linked cover area at the top of a condensed card: a `next/image` fill image over a gradient background, with an optional top-right badge and bottom category chips.

- **Source:** [src/components/ui/cards/CondensedCardCover.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CondensedCardCover.tsx)
- **Kind:** Server component
- **Used in:** `src/components/articles/cards/CondensedArticleCard.tsx`, `src/components/projects/cards/CondensedProjectCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | Link target for the whole cover. |
| `src` | `string \| null` | — | Image URL; when null only the gradient shows. |
| `alt` | `string` | — | Image alt text. |
| `height` | `string` | `"h-48"` | Tailwind height class. |
| `badge` | `ReactNode` | — | Rendered top-right. |
| `categories` | `string[]` | — | Rendered via `CardCategoryBadges` along the bottom. |
| `type` | `"article" \| "project"` | — | Picks the background gradient. |

Notable behaviour:

- The link uses `prefetch={false}`; the image uses `sizes="28rem"`.
- Category chips get the darker border (`badgeDarkerBorder`) when there is no image.

## CondensedCardActions

A small arrow link button for the bottom of a condensed card.

- **Source:** [src/components/ui/cards/CondensedCardActions.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CondensedCardActions.tsx)
- **Kind:** Server component
- **Used in:** `src/components/articles/cards/CondensedArticleCard.tsx`, `src/components/articles/cards/ArticleCard.tsx`, `src/components/projects/cards/CondensedProjectCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | Link target. |
| `label` | `string` | — | Used as both `aria-label` and `title`. |
| `prefetch` | `LinkProps["prefetch"]` | — | Passed to `next/link`. |

```tsx
<CondensedCardShell className={cn("relative z-0 items-start", className)}>
  <CondensedCardCover
    type="article"
    href={href}
    src={coverUrl}
    alt={article.title}
    height="h-52"
    badge={badge}
    categories={categories}
  />
  {/* byline, title, summary */}
  <CondensedCardActions href={href} label={`Read ${article.title}`} prefetch={false} />
</CondensedCardShell>
```

## CardCategoryBadges

Category chips fitted to a single line, with a "+N" chip whose tooltip lists the hidden categories. Built on `MeasuredChipRow` and `ChipOverflowTooltip` from `ui/display`.

- **Source:** [src/components/ui/cards/CardCategoryBadges.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CardCategoryBadges.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/cards/CondensedCardCover.tsx`, `src/components/articles/cards/ArticleCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `categories` | `string[]` | — | Category labels; each label is also its key. |
| `badgeDarkerBorder` | `boolean` | — | Applies `CATEGORY_CHIP_BORDER_DARK` (used when the cover has no image). |

```tsx
<CardCategoryBadges categories={categories} />
```

## CollapsibleCard

A shadcn `Collapsible` card with a clickable header row, chevron and optional delete button. Use for repeatable form sections (FAQs, team members, content sections) and organization member/invite cards.

- **Source:** [src/components/ui/cards/CollapsibleCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/cards/CollapsibleCard.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/parts/FAQItemCard.tsx`, `src/components/projects/form/parts/TeamMemberCard.tsx`, `src/components/organizations/cards/MemberCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `header` | `ReactNode` | — | Content on the left of the trigger row. |
| `children` | `ReactNode` | — | Collapsible body. |
| `onRemove` | `() => void` | — | When set, shows a trash icon button with a "Delete" tooltip. |
| `removeConfirmTitle` | `string` | `"Delete this section?"` | Confirm dialog title. |
| `removeConfirmMessage` | `string` | — | When set, removal goes through a `ConfirmDialog`; otherwise `onRemove` fires immediately. |
| `defaultOpen` | `boolean` | `true` | Initial open state (managed internally). |
| `className` | `string` | — | Extra classes on the root. |

Notable behaviour:

- The delete click calls `stopPropagation()` so it does not toggle the card.
- The confirm dialog uses `variant="destructive"` with a "Delete" confirm label.

```tsx
<CollapsibleCard
  header={<span>{question?.trim() || `Question ${index + 1}`}</span>}
  onRemove={onRemove}
  removeConfirmTitle="Delete this question?"
  removeConfirmMessage="This will remove the question and its answer from your project."
>
  <InputText label="Question" name={`faqs.${index}.question`} />
  <InputTextarea label="Answer" name={`faqs.${index}.answer`} />
</CollapsibleCard>
```

## index.ts

Barrel exporting `CondensedCardShell`, `CondensedCardCover` and `CondensedCardActions`.
