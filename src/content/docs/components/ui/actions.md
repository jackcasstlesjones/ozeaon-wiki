---
title: "Actions"
description: Button-style controls — loading button, icon button, like toggle and button grouping.
sidebar:
  order: 1
---

Action primitives built on the shadcn `Button` or a plain `<button>`. Use these instead of rolling your own spinner button, badge-carrying icon button or heart toggle. Import from `@/components/ui/actions`.

## LoadingButton

A shadcn `Button` that disables itself and swaps its content for a spinner (or `loadingText`) while `isLoading` is true. Use it for any submit or async action.

- **Source:** [src/components/ui/actions/LoadingButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/actions/LoadingButton.tsx)
- **Kind:** Server component (no `"use client"` directive; renders the client `Button`)
- **Used in:** `src/components/auth/LoginPageForm.tsx`, `src/components/articles/form/ArticleFormNav.tsx`, `src/components/profiles/users/ConnectButton.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `isLoading` | `boolean` | — | Disables the button and shows the loading content. |
| `loadingText` | `string` | — | Shown instead of the spinner while loading. |
| `size` | `Button` size | `"default"` | Also picks the spinner size (`sm` 3.5, `default`/`auto` 4, `lg` 5, `icon` 6). |

Plus all `Button` props (`variant`, `iconLeft`, `iconRight`, `<button>` attributes, …).

Notable behaviour:

- `disabled` is `disabled || isLoading`.
- `iconLeft` / `iconRight` are dropped while loading.
- When `loadingText` is set, only the text is shown — no spinner.

```tsx
<LoadingButton
  type="submit"
  variant="ozeaon"
  isLoading={isSubmitting}
  loadingText="Signing in..."
  className="w-full"
>
  Sign In
</LoadingButton>
```

## IconButton

A square 36px icon-only `<button>` with an optional red numeric badge or green dot. Use for toolbar and nav icons.

- **Source:** [src/components/ui/actions/IconButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/actions/IconButton.tsx)
- **Kind:** Server component (no `"use client"` directive)
- **Used in:** `src/components/nav/components/NotificationBellButton.tsx`, `src/components/nav/MegaMenu.tsx`, `src/components/posts/create-form/parts/AttachmentActionBar.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | — | Icon rendered at size 20. |
| `label` | `string` | — | Required; becomes `aria-label`. |
| `badge` | `number` | — | Red counter badge, shown only when `> 0`. |
| `badgeMax` | `number` | `99` | Above this the badge reads `{badgeMax}+`. |
| `dot` | `boolean` | — | Green dot indicator for active/unread state. |
| `bordered` | `boolean` | `false` | Adds a border. |

Plus all `<button>` props. `type` defaults to `"button"` but can be overridden.

```tsx
<IconButton
  icon={Bell}
  label={count > 0 ? `Notifications, ${count} unread` : "Notifications, none new"}
  badge={count}
  badgeMax={BADGE_MAX}
/>
```

## LikeButton

Heart toggle with a count, shared by posts and comments. Purely presentational: the caller owns the liked state and persistence.

- **Source:** [src/components/ui/actions/LikeButton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/actions/LikeButton.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/posts/LikePostButton.tsx`, `src/components/ui/comments/CommentItem.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `liked` | `boolean` | — | Current state; fills the heart red. |
| `count` | `number` | — | Like tally, shown compact (`formatCompactCount`). |
| `onToggle` | `() => void` | — | Called on click. |
| `disabled` | `boolean` | `false` | Sets the `disabled` attribute. |
| `inert` | `boolean` | `false` | Non-interactive (`pointer-events-none`, `aria-disabled`) without the disabled look. |
| `size` | `"sm" \| "default"` | `"default"` | `default` for feed rows (icon 20), `sm` for comment threads (icon 16). |
| `subject` | `string` | — | What is being liked, e.g. `"post"`; used in the label and tooltip. |
| `hideZeroCount` | `boolean` | `false` | Omits the count while it is zero. |
| `withTooltip` | `boolean` | `false` | Wraps the button in a tooltip reading "Like/Unlike {subject}". |

Notable behaviour:

- `aria-pressed={liked}`; the `aria-label` includes the count (e.g. "Like post, 3 likes") because the label replaces the visible content.
- A one-shot `heart-pop` animation plays when toggling to liked.
- The count sits in a `<data value={count}>` element with a fixed 3ch slot so the layout does not shift as the number changes.
- The tooltip uses `disableTouch`.

```tsx
<LikeButton
  liked={liked}
  count={count}
  onToggle={handleClick}
  disabled={isPending}
  inert={!user}
  subject="post"
  withTooltip
/>
```

## ButtonGroup

A flex wrapper with `role="group"` for laying out related buttons.

- **Source:** [src/components/ui/actions/ButtonGroup.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/actions/ButtonGroup.tsx)
- **Kind:** Server component
- **Used in:** `src/components/profiles/users/ConnectButton.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | The buttons. |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | `flex-row` or `flex-col`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Gap: `gap-1`, `gap-2`, `gap-3`. |
| `label` | `string` | — | `aria-label` for the group. |
| `className` | `string` | — | Extra classes. |

```tsx
<ButtonGroup size="sm" label="Connection actions">
  <LoadingButton onClick={handleAccept} isLoading={isAcceptLoading} iconLeft={UserCheck}>
    Accept
  </LoadingButton>
  <LoadingButton variant="ghost" onClick={handleDecline} isLoading={isDeclineLoading}>
    Decline
  </LoadingButton>
</ButtonGroup>
```

## index.ts

Barrel exporting `LoadingButton`, `ButtonGroup`, `IconButton`, `LikeButton` and their prop types (`LoadingButtonProps`, `ButtonGroupProps`, `IconButtonProps`, `LikeButtonProps`, `LikeButtonSize`).
