---
title: "shadcn Primitives"
description: The vendored shadcn/ui primitives in src/components/shadcn, with the project's variants, added props and token styling, and the ui wrappers built on them.
---

`src/components/shadcn/` holds the shadcn/ui primitives, built on Radix, `cmdk`, `vaul`, `react-day-picker` and `sonner`. They're vendored with the project's design tokens: typography utilities such as `font-body`, `font-mono-lg` and `font-h3`, and colour tokens such as `text-primary`, `bg-bg-surface` and `border-border-focus` in place of shadcn's default Tailwind utilities. A few components also add behaviour: `Button` (variants and icon props), `Tooltip` (touch support), `CollapsibleContent` (animated re-measuring) and `CommandInput` (custom icon). This page covers only what's project-specific. For each component's base API, follow the upstream link.

Feature code mostly reaches these primitives through wrappers in `src/components/ui/`, especially the React Hook Form inputs in `ui/forms/hook-form/` and the overlays in `ui/overlays/`. Use a wrapper when one exists. The only re-export from the `@/components/ui` barrel is `Skeleton`.

The project's `docs/component-library.md` says to add new shadcn components with the CLI (`pnpm dlx shadcn@latest add <name>`), not by hand.

There's no barrel file: import each primitive from `@/components/shadcn/<name>`.

## Button

The base button, built with `cva` and Radix `Slot`. It has project-specific variants, sizes and icon props.

- **Source:** [src/components/shadcn/button.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/button.tsx)
- **Kind:** No directive (server-safe)
- **Exports:** `Button`, `buttonVariants`, `ButtonProps`
- **Wrapped by:** `ui/actions/LoadingButton.tsx`, `ui/actions/LikeButton.tsx`, `ui/overlays/ConfirmDialog.tsx`, `ui/overlays/ConfirmDeleteDialog.tsx`, `ui/comments/CommentToggle.tsx`, `ui/sidebar.tsx`, plus most hook-form inputs
- **Used in:** `src/components/projects/ProjectsFilterDialog.tsx`, `src/components/auth/ResetPasswordPageForm.tsx`, `src/components/auth/OtpVerificationPanel.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/button](https://ui.shadcn.com/docs/components/button)

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default" \| "primary" \| "destructive" \| "error-subtle" \| "outline" \| "secondary" \| "ghost" \| "link" \| "icon" \| "lavender" \| "charcoal" \| "ozeaon" \| "sunken" \| "subtle" \| "filter"` | `"default"` | Visual style; see the notes below. |
| `size` | `"auto" \| "default" \| "sm" \| "lg" \| "icon"` | `"default"` | `auto` adds no size classes. `default` is `h-9 px-3`, 15px medium. `sm` is `px-2 py-1 h-auto`, 13px. `lg` is `h-10 px-8`. `icon` is `h-9 w-9`. |
| `asChild` | `boolean` | `false` | Render through Radix `Slot` onto the single child element. |
| `iconLeft` | `React.ComponentType<{ size?: number; className?: string }>` | — | Icon component (not JSX) rendered before the children. |
| `iconLeftSize` | `number` | `16` when `size="sm"`, else `20` | Left icon size. |
| `iconLeftClassName` | `string` | — | Extra classes for the left icon. **Only applied when `asChild` is set.** |
| `iconRight` | `React.ComponentType<{ size?: number; className?: string }>` | — | Icon component rendered after the children. |
| `iconRightSize` | `number` | `16` | Right icon size. |
| `iconRightClassName` | `string` | — | Extra classes for the right icon. **Only applied when `asChild` is set.** |

Also accepts all `<button>` attributes.

Notable behaviour:

- The base classes use `font-body text-secondary`, and focus uses `ring-border-focus`.
- Colour variants map to tokens: `default` (`btn-default-*`), `primary` (`btn-primary-*`), `destructive` (`btn-destructive-*`), `secondary` (`btn-secondary-*`), `error-subtle` (`error-surface` / `text-error`), `ozeaon` (`bg-ozeaon-blue`), `charcoal` (`bg-bg-inverse`), `lavender`, `sunken` and `subtle`. `icon` is a borderless `text-secondary → text-primary` hover. `link` uses `text-brand`.
- `filter` is a tab-style button: `font-h4`, no horizontal padding, and a bottom border that shows on hover and when `data-active="true"`.
- Compound variants: `variant="default"` with `size="sm"` switches to the `btn-sm-*` tokens.
- With `asChild`, the icons are injected *inside* the child element, around its existing children, so `<Button asChild iconLeft={X}><Link …>Text</Link></Button>` works.
- Pass icons through `iconLeft` and `iconRight`, not as JSX children (see `docs/component-library.md`). Without `asChild`, the icon `className` props are ignored. `CommentToggle` targets its chevron with `[&>svg:last-child]` for this reason.

```tsx
<Button type="submit" variant="ozeaon" iconLeft={Check}>
  Apply Filters
</Button>
```

## Badge

A pill label built on `cva`, with project-specific variants.

- **Source:** [src/components/shadcn/badge.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/badge.tsx)
- **Kind:** No directive (server-safe)
- **Exports:** `Badge`, `badgeVariants`, `BadgeVariant` (type), `BadgeProps`
- **Wrapped by:** `ui/display/Tags.tsx`, `ui/layout/NavTabs.tsx`, `ui/layout/FilterTabs.tsx`, `ui/forms/FormSectionCard.tsx`, `ui/forms/hook-form/InputTags.tsx`, `ui/forms/hook-form/InputMultiSelect.tsx`
- **Used in:** `src/components/projects/page/HeroCategoryBadges.tsx` (via `badgeVariants({ variant: "scrim" })`), `src/config/constants/projects.ts` (`BadgeVariant` type for status badges), `src/components/projects/page/ProjectHeroSection.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/badge](https://ui.shadcn.com/docs/components/badge)

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default" \| "selected" \| "subtle" \| "outline" \| "success" \| "error" \| "warning" \| "info" \| "destructive" \| "parchment" \| "old-lace" \| "sunken" \| "frosted" \| "green-pastel" \| "keyword" \| "scrim"` | `"default"` | Colour and typography preset. |
| `ref` | `React.Ref<HTMLDivElement>` | — | `ref` as a prop (React 19 style). The component isn't wrapped in `forwardRef`. |

Notable behaviour:

- The base is `rounded-full border px-3 py-1 font-body-semibold`. `default` is `bg-bg-cold text-muted`.
- The status variants `success`, `error`, `warning` and `info` use the matching `*-surface` background with matching text.
- `old-lace`, `green-pastel`, `keyword` and `scrim` switch to `font-label-sm`. `keyword` has a `border-green-pastel` outline. `scrim` is a translucent, `backdrop-blur-md` chip for use over images.

```tsx
<Badge key={tag} variant="keyword" role="listitem">
  {tag}
</Badge>
```

## Tooltip

A Radix tooltip extended with tap-to-toggle support on touch devices and project styling.

- **Source:** [src/components/shadcn/tooltip.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/tooltip.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`
- **Wrapped by:** `ui/display/ChipOverflowTooltip.tsx`, `ui/display/SDGs.tsx`, `ui/actions/LikeButton.tsx`, `ui/comments/CommentToggle.tsx`, `ui/cards/CollapsibleCard.tsx`, `ui/sidebar.tsx`
- **Used in:** `src/app/layout.tsx` (`TooltipProvider` wraps the app), `src/components/posts/RepostButton.tsx`, `src/components/articles/pages/parts/LicenseTypeBadge.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/tooltip](https://ui.shadcn.com/docs/components/tooltip)

`Tooltip` accepts the Radix `Root` props plus:

| Prop | Type | Default | Description |
|---|---|---|---|
| `disableTouch` | `boolean` | `false` | When true, a tap on a touch device never opens the tooltip. Use it for controls whose icon or label already explains them. |

Notable behaviour:

- Touch detection uses `matchMedia("(pointer: coarse)")` and updates when the media query changes. Radix ignores touch pointers, so on touch devices `Tooltip` manages its own `open` state. Pass `open` to control it instead.
- On touch devices, `TooltipTrigger` calls `preventDefault` on `pointerdown` and `focus`, and toggles open on `click`. `TooltipContent` ignores pointer-down-outside events that land on the trigger, so a single tap doesn't close and reopen the tooltip.
- `delayDuration` defaults to `0`.
- `TooltipContent` defaults to `side="bottom"`, `align="start"` and `sideOffset={4}`. It always renders in a portal with a white `TooltipArrow` (16 × 20, drop shadow), uses `bg-background font-label-sm text-primary shadow-tooltip`, and is capped at `max-w-screen`.
- `Tooltip` is declared with `forwardRef`, but it ignores the ref.

```tsx
<Tooltip disableTouch>
  <TooltipTrigger asChild>
    <Button variant="icon" size="auto" onClick={onToggle} aria-label={label} iconLeft={CommentLightIcon} />
  </TooltipTrigger>
  <TooltipContent>{label}</TooltipContent>
</Tooltip>
```

## Collapsible

Radix Collapsible. `CollapsibleContent` adds an opt-in animated reveal that keeps re-measuring its content.

- **Source:** [src/components/shadcn/collapsible.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/collapsible.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`
- **Wrapped by:** `ui/comments/CardComments.tsx`, `ui/cards/CollapsibleCard.tsx`, `ui/forms/FormSectionCard.tsx`, `ui/forms/FormStepAccordion.tsx`
- **Used in:** `src/components/nav/SideNav.tsx`, `src/components/articles/form/sections/AuthorInput.tsx`, `src/components/articles/pages/parts/Authors.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/collapsible](https://ui.shadcn.com/docs/components/collapsible)

`CollapsibleContent` accepts the Radix `CollapsibleContent` props plus:

| Prop | Type | Default | Description |
|---|---|---|---|
| `animated` | `boolean` | `false` | Adds the `collapsible-content` class (defined in `src/styles/collapsible-content.css`), which animates height to `--radix-collapsible-content-height`. Without it, panels open instantly. |

Notable behaviour:

- Radix measures the content height only once, at mount. When `animated` is set, the component watches each child with a `ResizeObserver` and the child list with a `MutationObserver`. It rewrites `--radix-collapsible-content-height` from `scrollHeight`, so content that arrives later (fetched threads, editors, search results) animates to the correct height, even mid-animation.
- `forceMount` disables both the animation class and the re-measuring. Those callers manage presence and height themselves.

```tsx
<Collapsible open={open} className={cn("z-10 relative", className)}>
  <CollapsibleContent animated className="p-0.5">
    <div className="mt-4">{children}</div>
  </CollapsibleContent>
</Collapsible>
```

## Form

The shadcn React Hook Form bindings, restyled with project typography.

- **Source:** [src/components/shadcn/form.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/form.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Form` (`FormProvider`), `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`
- **Wrapped by:** every input in `ui/forms/hook-form/`, including `FieldWrapper.tsx`, `InputText.tsx`, `InputPassword.tsx`, `InputTextarea.tsx`, `InputBoolean.tsx`, `InputCheckbox.tsx` and `InputTags.tsx`
- **Used in:** `src/components/auth/LoginPageForm.tsx`, `src/components/projects/form/ProjectForm.tsx`, `src/components/projects/ProjectsFilterDialog.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/form](https://ui.shadcn.com/docs/components/form)

Notable behaviour:

- `FormItem` is `space-y-2 relative`.
- `FormLabel` adds `ps-2 block` and switches to `text-destructive` when the field has an error.
- `FormControl` sets `id`, `aria-describedby` and `aria-invalid`. It also sets `data-error="true"` when the field has an error, which wrappers can target.
- `FormDescription` uses `font-caption text-subtle px-2 -mt-1`. `FormMessage` uses `font-caption text-destructive px-2 -mt-1`, with `role="alert"` and `aria-live="polite"`. It renders nothing when there's no error and no children.
- `useFormField` throws if it's used outside `<FormField>` or `<FormItem>`.

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4" noValidate>
    <InputText name="email" label="Email" type="email" />
  </form>
</Form>
```

## Calendar

A `react-day-picker` calendar styled with project tokens. Its nav buttons use `buttonVariants`, and day cells use `Button variant="secondary" size="icon"`.

- **Source:** [src/components/shadcn/calendar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/calendar.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Calendar`, `CalendarDayButton`
- **Wrapped by:** `ui/forms/hook-form/InputDate.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/calendar](https://ui.shadcn.com/docs/components/calendar)

| Prop | Type | Default | Description |
|---|---|---|---|
| `buttonVariant` | `ButtonProps["variant"]` | `"ghost"` | Variant for the previous and next month buttons. |
| `showOutsideDays` | `boolean` | `true` | Passed to `DayPicker`. |
| `captionLayout` | `DayPicker` caption layout | `"label"` | Passed to `DayPicker`. Month dropdown labels are formatted with `{ month: "short" }`. |

Also accepts all other `DayPicker` props. Single selection uses `bg-brand text-inverse`, today is tinted `bg-brand/15`, and the cell size comes from `--cell-size: 2rem`.

```tsx
<Calendar
  captionLayout="dropdown"
  mode="single"
  className="rounded-lg"
  selected={dateValue}
  showOutsideDays={false}
  weekStartsOn={1}
/>
```

## Command

`cmdk` command menu primitives. `CommandInput` accepts a custom leading icon.

- **Source:** [src/components/shadcn/command.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/command.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`
- **Wrapped by:** `ui/inputs/MultiSelect.tsx`, `ui/forms/hook-form/InputSearchSelect.tsx`, `ui/forms/hook-form/InputSearchSelectWithChip.tsx`, `shadcn-io/tags`
- **Used in:** `src/components/projects/form/steps/RelatedSection.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/command](https://ui.shadcn.com/docs/components/command)

`CommandInput` adds two props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `React.ComponentType<{ className?: string }>` | `Search` (Lucide) | Leading icon. |
| `wrapperClassName` | `string` | `""` | Classes for the bordered wrapper `div` around the icon and input. |

`CommandList` caps at `max-h-75`. `CommandItem` uses `cursor-pointer` with `bg-accent` when selected. Group headings use `font-label-sm text-muted`.

## Dialog

Radix Dialog with project styling.

- **Source:** [src/components/shadcn/dialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/dialog.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogTrigger`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`
- **Wrapped by:** `ui/overlays/ConfirmDialog.tsx`, `ui/overlays/ConfirmDeleteDialog.tsx`, `ui/overlays/ModerationRejectedDialog.tsx`, `ui/images/ZoomableImage.tsx`, `ui/forms/AvatarCropModal.tsx`, `ui/comments/DeleteComment.tsx`, `shadcn/command.tsx` (`CommandDialog`)
- **Used in:** `src/components/projects/ProjectsFilterDialog.tsx`, `src/components/nav/components/AccountSwitcherModal.tsx`, `src/components/organizations/members/InviteMemberModal.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/dialog](https://ui.shadcn.com/docs/components/dialog)

The overlay and content sit at `z-60`, above sheets and drawers at `z-50`. The overlay is `bg-overlay-scrim backdrop-blur-sm`. Content is `w-[calc(100%-2rem)] max-w-lg rounded-md`. The close button uses a 20 px `X`, placed after the children. `DialogTitle` uses `font-h3 text-primary`, and `DialogDescription` uses `font-body text-muted`. For confirmation prompts, use `ConfirmDialog` and never `window.confirm()`.

## Sheet

A Radix Dialog shown as a side panel, with `cva` variants for `side`.

- **Source:** [src/components/shadcn/sheet.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/sheet.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Sheet`, `SheetPortal`, `SheetOverlay`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`
- **Wrapped by:** `ui/sidebar.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/sheet](https://ui.shadcn.com/docs/components/sheet)

`SheetContent` takes `side?: "top" | "bottom" | "left" | "right"` (default `"right"`). Padding is `p-3`, the overlay uses `bg-overlay-scrim`, and `SheetTitle` uses `font-body-lg-semibold`.

## Drawer

A `vaul` bottom drawer.

- **Source:** [src/components/shadcn/drawer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/drawer.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerTrigger`, `DrawerClose`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`
- **Used in:** not imported anywhere in `src/`
- **Upstream:** [ui.shadcn.com/docs/components/drawer](https://ui.shadcn.com/docs/components/drawer)

`DrawerContent` is pinned from the top, with `mt-[5dvh]` and `max-h-[95dvh]`, at `z-52`. It wraps children in a centred `max-w-md` column with the drag handle. `DrawerTitle` still uses raw `text-lg font-semibold`, not a typography token.

## DropdownMenu

Radix Dropdown Menu with project styling.

- **Source:** [src/components/shadcn/dropdown-menu.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/dropdown-menu.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuGroup`, `DropdownMenuPortal`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuRadioGroup`
- **Used in:** `src/components/tiptap/toolbar/Toolbar.tsx`, `src/components/nav/DashboardSidebar.tsx`, `src/components/nav/SideNav.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/dropdown-menu](https://ui.shadcn.com/docs/components/dropdown-menu)

`DropdownMenuContent` uses `rounded-lg border-border bg-background text-primary shadow-md`. It scrolls vertically, capped at `--radix-dropdown-menu-content-available-height`. Items use `font-body` with 16 px icons, labels use `font-body-sm-semibold`, and `inset` on items, labels and sub-triggers adds `pl-8`.

## Select

Radix Select, styled to match `Input`.

- **Source:** [src/components/shadcn/select.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/select.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`
- **Wrapped by:** `ui/forms/hook-form/InputSelect.tsx`, `ui/forms/hook-form/InputInlineSelect.tsx`
- **Used in:** `src/components/organizations/cards/MemberCard.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/select](https://ui.shadcn.com/docs/components/select)

`SelectTrigger` uses the same field treatment as `Input`: `h-9 rounded-sm`, `font-mono-lg` (`font-mono` from `md`), `text-placeholder` for the placeholder, and `border-border-strong` on hover. It gets `border-border-focus` on focus or when open, `bg-bg-cold` when disabled, and `bg-error-surface` when `aria-invalid`. The chevron is a 20 px `ChevronDown` with stroke width 1. `SelectContent` defaults to `position="popper"`. The selected item's check mark is `text-brand` and sits on the right.

## Input

A styled text `<input>`, used as the base of the text-field wrappers.

- **Source:** [src/components/shadcn/input.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/input.tsx)
- **Kind:** No directive (server-safe)
- **Exports:** `Input`
- **Wrapped by:** `ui/forms/hook-form/InputText.tsx`, `ui/forms/hook-form/OtpInput.tsx`, `ui/forms/hook-form/InputTags.tsx`, `ui/forms/hook-form/InputContent.tsx`, `ui/inputs/SearchInput.tsx`, `ui/password-input.tsx`
- **Used in:** `src/components/account/ProfileSettings.tsx`, `src/components/account/ChangeEmailDialog.tsx`, `src/components/posts/create-form/AttachModal.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/input](https://ui.shadcn.com/docs/components/input)

`type` defaults to `"text"`. Styling uses `bg-bg-surface` and `font-mono-lg` (`font-mono` from `md`), with `text-secondary`, a `text-placeholder` / `font-mono-sm` placeholder, and `border-border-strong` on hover. It gets `border-border-focus` on focus, `bg-error-surface` when `aria-invalid`, `bg-bg-cold` when disabled, and no shadow.

## Textarea

A styled `<textarea>` that matches `Input`.

- **Source:** [src/components/shadcn/textarea.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/textarea.tsx)
- **Kind:** No directive (server-safe)
- **Exports:** `Textarea`
- **Wrapped by:** `ui/forms/hook-form/InputTextarea.tsx`
- **Used in:** `src/components/posts/create-form/parts/ComposerTextarea.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/textarea](https://ui.shadcn.com/docs/components/textarea)

Like `Input`, but with `bg-background`, `p-3`, `min-h-15` and `resize-y`.

## Label

Radix Label using `font-label text-secondary`.

- **Source:** [src/components/shadcn/label.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/label.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Label`
- **Wrapped by:** `shadcn/form.tsx` (`FormLabel`), `ui/forms/hook-form/OtpInput.tsx`, `ui/forms/hook-form/InputRadioGroup.tsx`, `ui/forms/hook-form/InputRadioTiles.tsx`
- **Used in:** `src/components/account/ChangePasswordDialog.tsx`, `src/components/projects/form/steps/ProjectIdentitySection.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/label](https://ui.shadcn.com/docs/components/label)

## Checkbox

A Radix Checkbox. When checked it uses `bg-brand border-brand text-inverse`, with a stroke-3 `Check`.

- **Source:** [src/components/shadcn/checkbox.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/checkbox.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Checkbox`
- **Wrapped by:** `ui/forms/hook-form/InputCheckbox.tsx`, `ui/forms/hook-form/InputCheckboxGroup.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/checkbox](https://ui.shadcn.com/docs/components/checkbox)

## RadioGroup

A Radix Radio Group. When checked, the item uses `border-brand` with a `fill-brand` dot.

- **Source:** [src/components/shadcn/radio-group.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/radio-group.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `RadioGroup`, `RadioGroupItem`
- **Wrapped by:** `ui/forms/hook-form/InputRadioGroup.tsx`, `ui/forms/hook-form/InputRadioTiles.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/radio-group](https://ui.shadcn.com/docs/components/radio-group)

## Switch

A Radix Switch, 20 × 32. It's `bg-brand` when checked and `bg-subtle` when unchecked.

- **Source:** [src/components/shadcn/switch.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/switch.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Switch`
- **Wrapped by:** `ui/forms/hook-form/InputBoolean.tsx`
- **Used in:** `src/components/posts/create-form/parts/PostOptionsToggles.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/switch](https://ui.shadcn.com/docs/components/switch)

## Popover

Radix Popover. Content defaults to `align="center"` and `sideOffset={4}`, with `w-72 p-4` and no shadow.

- **Source:** [src/components/shadcn/popover.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/popover.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`
- **Wrapped by:** `ui/inputs/MultiSelect.tsx`, `ui/forms/hook-form/InputDate.tsx`, `shadcn-io/tags`
- **Used in:** `src/components/nav/components/NotificationBellButton.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/popover](https://ui.shadcn.com/docs/components/popover)

## Card

A container (`rounded-lg border-border bg-background text-primary`) with header, title, description, content and footer slots. `CardTitle` uses `font-h3`, and `CardDescription` uses `font-body text-muted`.

- **Source:** [src/components/shadcn/card.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/card.tsx)
- **Kind:** No directive (server-safe)
- **Exports:** `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`, `CardContent`
- **Used in:** `src/components/projects/cards/ProjectCard.tsx`, `src/components/projects/cards/MyProjectCard.tsx`, `src/components/users/UserGridCard.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/card](https://ui.shadcn.com/docs/components/card)

## Avatar

A Radix Avatar (40 px circle). The fallback uses `bg-bg-subtle`.

- **Source:** [src/components/shadcn/avatar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/avatar.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Avatar`, `AvatarImage`, `AvatarFallback`
- **Used in:** `src/components/organizations/cards/UserMembershipCard.tsx`, `src/components/organizations/cards/UserJoinRequestCard.tsx`, `src/components/organizations/cards/UserInviteCard.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/avatar](https://ui.shadcn.com/docs/components/avatar)

## Accordion

A Radix Accordion. The trigger uses `font-body font-medium` with a `text-muted` chevron that rotates when open.

- **Source:** [src/components/shadcn/accordion.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/accordion.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- **Used in:** `src/components/projects/page/sections/FAQsSection.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/accordion](https://ui.shadcn.com/docs/components/accordion)

## Separator

A Radix Separator, 1 px, `bg-border`. It's decorative by default.

- **Source:** [src/components/shadcn/separator.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/separator.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Separator`
- **Wrapped by:** `ui/sidebar.tsx`
- **Used in:** `src/components/nav/SideNav.tsx`, `src/components/projects/page/sections/ProposalSection.tsx`, `src/components/articles/pages/ArticleContentSection.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/separator](https://ui.shadcn.com/docs/components/separator)

## Skeleton

A pulsing `rounded-md bg-bg-subtle` block for loading placeholders.

- **Source:** [src/components/shadcn/skeleton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/skeleton.tsx)
- **Kind:** No directive (server-safe)
- **Exports:** `Skeleton`, also re-exported from the `@/components/ui` barrel
- **Wrapped by:** `ui/skeletons/PostSkeleton.tsx`, `ui/skeletons/NavSkeleton.tsx`, `ui/skeletons/SkeletonCard.tsx`, `ui/sidebar.tsx`
- **Used in:** `src/components/projects/cards/SmallProjectSkeletonCard.tsx`, `src/components/articles/cards/SmallArticleSkeletonCard.tsx`, `src/components/notifications/NotificationRowSkeleton.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/skeleton](https://ui.shadcn.com/docs/components/skeleton)

## Toaster (sonner)

The `sonner` toaster, mounted once in the root layout. Feature code calls `toast` from `sonner` directly.

- **Source:** [src/components/shadcn/sonner.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/sonner.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Toaster`
- **Used in:** `src/app/layout.tsx`
- **Upstream:** [ui.shadcn.com/docs/components/sonner](https://ui.shadcn.com/docs/components/sonner)

The theme is fixed to `"light"`, with no `next-themes` lookup. Toasts use `bg-background border-border shadow-lg`, the action button uses `bg-brand text-inverse`, and the cancel button uses `bg-bg-subtle text-muted`. Accepts all `sonner` `Toaster` props.

## Breadcrumb

Breadcrumb navigation parts. The list uses `font-body-sm text-muted`, and the separator defaults to `ChevronRight`.

- **Source:** [src/components/shadcn/breadcrumb.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/breadcrumb.tsx)
- **Kind:** No directive (server-safe)
- **Exports:** `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`
- **Used in:** not imported anywhere in `src/`
- **Upstream:** [ui.shadcn.com/docs/components/breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb)

## ScrollArea

A Radix Scroll Area with a `bg-border` thumb.

- **Source:** [src/components/shadcn/scroll-area.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/scroll-area.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `ScrollArea`, `ScrollBar`
- **Used in:** not imported anywhere in `src/`
- **Upstream:** [ui.shadcn.com/docs/components/scroll-area](https://ui.shadcn.com/docs/components/scroll-area)

## Tags (shadcn-io)

A tag picker vendored under `shadcn-io/tags/`, composed from `Popover`, `Command`, `Badge` and `Button`.

- **Source:** [src/components/shadcn/shadcn-io/tags/index.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/shadcn-io/tags/index.tsx)
- **Kind:** Client component (`"use client"`)
- **Exports:** `Tags`, `TagsTrigger`, `TagsValue`, `TagsContent`, `TagsInput`, `TagsList`, `TagsEmpty`, `TagsGroup`, `TagsItem`
- **Used in:** not imported anywhere in `src/`. Tag inputs use `ui/forms/hook-form/InputTags.tsx` instead.

`Tags` props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Stored in context for children. |
| `setValue` | `(value: string) => void` | — | Stored in context for children. |
| `open` | `boolean` | — | Controlled open state. Falls back to internal state when omitted. |
| `onOpenChange` | `(open: boolean) => void` | — | Controlled open handler. |
| `className` | `string` | — | Classes for the `relative w-full` wrapper. |
| `modal` | `boolean` | `false` | Passed to `Popover`. |

Notable behaviour:

- `Tags` measures its wrapper with a `ResizeObserver`, and `TagsContent` sets the popover width to match.
- `TagsTrigger` is an outline `Button` with `role="combobox"`. It shows "Select labels" when empty and a plus icon otherwise. Pass `hasValue` to override the empty check.
- `TagsValue` is a `Badge`. Passing `onRemove` renders a clickable `X`, which is a `div`, not a button.
- `TagsEmpty` defaults to "No tags found." and ignores `className`.
