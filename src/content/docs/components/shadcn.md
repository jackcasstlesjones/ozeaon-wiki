---
title: "shadcn Primitives"
description: The vendored shadcn/ui primitives in src/components/shadcn, with the project's variants, added props and token styling.
---

`src/components/shadcn/` holds the shadcn/ui primitives, built on Radix, `cmdk`, `vaul`, `react-day-picker` and `sonner`. They are vendored with the project's design tokens in place of shadcn's default Tailwind utilities. A few components add behaviour: `Button` (icon props), `Tooltip` (touch support), `CollapsibleContent` (animated re-measuring) and `CommandInput` (custom icon). This page lists project-specific notes; for base API and props see the upstream link for each primitive. For how these primitives are composed into field components and overlays, see [UI Primitives](../../design-system/ui-primitives/).

There is no barrel file: import each primitive from `@/components/shadcn/<name>`. Feature code should use the wrappers in `src/components/ui/` when one exists (especially the React Hook Form inputs in `ui/forms/hook-form/` and the overlays in `ui/overlays/`). Add new shadcn components with the CLI (`pnpm dlx shadcn@latest add <name>`), not by hand.

## Button

Adds project-specific variants, sizes and icon props (`iconLeft`, `iconRight`) to the base shadcn button. Pass icons as component references through `iconLeft`/`iconRight`, not as JSX children. The icon `className` props (`iconLeftClassName`, `iconRightClassName`) are applied only when `asChild` is set; without `asChild` they are silently ignored.

**Source:** [src/components/shadcn/button.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/button.tsx) — **Upstream:** [ui.shadcn.com/docs/components/button](https://ui.shadcn.com/docs/components/button)

## Badge

Pill label with project-specific variants including `scrim` (translucent backdrop-blur chip for use over images) and `keyword` (green-pastel outline tag).

**Source:** [src/components/shadcn/badge.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/badge.tsx) — **Upstream:** [ui.shadcn.com/docs/components/badge](https://ui.shadcn.com/docs/components/badge)

## Tooltip

Extends Radix Tooltip with tap-to-toggle support on touch devices. Pass `disableTouch` for controls whose label already explains them. On touch devices the component manages its own open state; pass `open` to control it from outside.

**Source:** [src/components/shadcn/tooltip.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/tooltip.tsx) — **Upstream:** [ui.shadcn.com/docs/components/tooltip](https://ui.shadcn.com/docs/components/tooltip)

## Collapsible

Standard Radix Collapsible. `CollapsibleContent` adds an opt-in `animated` prop that re-measures its content after mount: it watches each child with a `ResizeObserver` and the child list with a `MutationObserver`, and rewrites `--radix-collapsible-content-height` from `scrollHeight` so content that arrives later (fetched threads, editors) animates to the correct height.

**Source:** [src/components/shadcn/collapsible.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/collapsible.tsx) — **Upstream:** [ui.shadcn.com/docs/components/collapsible](https://ui.shadcn.com/docs/components/collapsible)

## Form

React Hook Form bindings restyled with project typography. `FormControl` sets `data-error="true"` when the field has an error, which wrappers can target. `useFormField` throws if used outside `<FormField>` or `<FormItem>`.

**Source:** [src/components/shadcn/form.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/form.tsx) — **Upstream:** [ui.shadcn.com/docs/components/form](https://ui.shadcn.com/docs/components/form)

## Calendar

`react-day-picker` styled with project tokens. Wrapped by `InputDate`.

**Source:** [src/components/shadcn/calendar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/calendar.tsx) — **Upstream:** [ui.shadcn.com/docs/components/calendar](https://ui.shadcn.com/docs/components/calendar)

## Command

`cmdk` command menu primitives. `CommandInput` accepts a custom `icon` prop (defaults to the Lucide `Search`) and a `wrapperClassName` for the bordered wrapper.

**Source:** [src/components/shadcn/command.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/command.tsx) — **Upstream:** [ui.shadcn.com/docs/components/command](https://ui.shadcn.com/docs/components/command)

## Dialog

Radix Dialog with project styling. Content and overlay sit at `z-60`, above sheets and drawers at `z-50`. For confirmation prompts, always use `ConfirmDialog` from `ui/overlays/`, never `window.confirm()`.

**Source:** [src/components/shadcn/dialog.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/dialog.tsx) — **Upstream:** [ui.shadcn.com/docs/components/dialog](https://ui.shadcn.com/docs/components/dialog)

## Sheet

Radix Dialog shown as a side panel, with `cva` variants for the `side` prop. Wrapped by `ui/sidebar.tsx`.

**Source:** [src/components/shadcn/sheet.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/sheet.tsx) — **Upstream:** [ui.shadcn.com/docs/components/sheet](https://ui.shadcn.com/docs/components/sheet)

## Drawer

Vaul bottom drawer, sitting at `z-52`. Not imported anywhere in `src/`; unused.

**Source:** [src/components/shadcn/drawer.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/drawer.tsx) — **Upstream:** [ui.shadcn.com/docs/components/drawer](https://ui.shadcn.com/docs/components/drawer)

## DropdownMenu

Radix Dropdown Menu with project styling. Content scrolls vertically, capped at the available viewport height.

**Source:** [src/components/shadcn/dropdown-menu.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/dropdown-menu.tsx) — **Upstream:** [ui.shadcn.com/docs/components/dropdown-menu](https://ui.shadcn.com/docs/components/dropdown-menu)

## Select

Radix Select styled to match `Input`. Wrapped by `InputSelect` and `InputInlineSelect`.

**Source:** [src/components/shadcn/select.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/select.tsx) — **Upstream:** [ui.shadcn.com/docs/components/select](https://ui.shadcn.com/docs/components/select)

## Input

Styled text `<input>` used as the base of the text-field wrappers. Wrapped by `InputText`, `SearchInput` and others.

**Source:** [src/components/shadcn/input.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/input.tsx) — **Upstream:** [ui.shadcn.com/docs/components/input](https://ui.shadcn.com/docs/components/input)

## Textarea

Styled `<textarea>` that matches `Input`. Wrapped by `InputTextarea`.

**Source:** [src/components/shadcn/textarea.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/textarea.tsx) — **Upstream:** [ui.shadcn.com/docs/components/textarea](https://ui.shadcn.com/docs/components/textarea)

## Label

Radix Label. Wrapped by `FormLabel` and the radio/OTP inputs.

**Source:** [src/components/shadcn/label.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/label.tsx) — **Upstream:** [ui.shadcn.com/docs/components/label](https://ui.shadcn.com/docs/components/label)

## Checkbox

Radix Checkbox. Wrapped by `InputCheckbox` and `InputCheckboxGroup`.

**Source:** [src/components/shadcn/checkbox.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/checkbox.tsx) — **Upstream:** [ui.shadcn.com/docs/components/checkbox](https://ui.shadcn.com/docs/components/checkbox)

## RadioGroup

Radix Radio Group. Wrapped by `InputRadioGroup` and `InputRadioTiles`.

**Source:** [src/components/shadcn/radio-group.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/radio-group.tsx) — **Upstream:** [ui.shadcn.com/docs/components/radio-group](https://ui.shadcn.com/docs/components/radio-group)

## Switch

Radix Switch. Wrapped by `InputBoolean`.

**Source:** [src/components/shadcn/switch.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/switch.tsx) — **Upstream:** [ui.shadcn.com/docs/components/switch](https://ui.shadcn.com/docs/components/switch)

## Popover

Radix Popover. Content defaults to `align="center"` and `sideOffset={4}`. Wrapped by `MultiSelect` and `InputDate`.

**Source:** [src/components/shadcn/popover.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/popover.tsx) — **Upstream:** [ui.shadcn.com/docs/components/popover](https://ui.shadcn.com/docs/components/popover)

## Card

Container with header, title, description, content and footer slots.

**Source:** [src/components/shadcn/card.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/card.tsx) — **Upstream:** [ui.shadcn.com/docs/components/card](https://ui.shadcn.com/docs/components/card)

## Avatar

Radix Avatar (40 px circle) with a `bg-bg-subtle` fallback.

**Source:** [src/components/shadcn/avatar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/avatar.tsx) — **Upstream:** [ui.shadcn.com/docs/components/avatar](https://ui.shadcn.com/docs/components/avatar)

## Accordion

Radix Accordion with a rotating chevron trigger. Used in `FAQsSection`.

**Source:** [src/components/shadcn/accordion.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/accordion.tsx) — **Upstream:** [ui.shadcn.com/docs/components/accordion](https://ui.shadcn.com/docs/components/accordion)

## Separator

Radix Separator, 1 px, `bg-border`. Decorative by default.

**Source:** [src/components/shadcn/separator.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/separator.tsx) — **Upstream:** [ui.shadcn.com/docs/components/separator](https://ui.shadcn.com/docs/components/separator)

## Skeleton

Pulsing `rounded-md bg-bg-subtle` block for loading placeholders. Also re-exported from the `@/components/ui` barrel.

**Source:** [src/components/shadcn/skeleton.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/skeleton.tsx) — **Upstream:** [ui.shadcn.com/docs/components/skeleton](https://ui.shadcn.com/docs/components/skeleton)

## Toaster

Sonner toaster, mounted once in the root layout. Feature code calls `toast` from `sonner` directly. The theme is fixed to `"light"` with no `next-themes` lookup.

**Source:** [src/components/shadcn/sonner.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/sonner.tsx) — **Upstream:** [ui.shadcn.com/docs/components/sonner](https://ui.shadcn.com/docs/components/sonner)

## Breadcrumb

Breadcrumb navigation parts. Not imported anywhere in `src/`; unused.

**Source:** [src/components/shadcn/breadcrumb.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/breadcrumb.tsx) — **Upstream:** [ui.shadcn.com/docs/components/breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb)

## ScrollArea

Radix Scroll Area. Not imported anywhere in `src/`; unused.

**Source:** [src/components/shadcn/scroll-area.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/scroll-area.tsx) — **Upstream:** [ui.shadcn.com/docs/components/scroll-area](https://ui.shadcn.com/docs/components/scroll-area)

## Tags (shadcn-io)

A tag picker vendored under `shadcn-io/tags/`. Not imported anywhere in `src/`; unused — use `InputTags` from `ui/forms/hook-form/` instead.

**Source:** [src/components/shadcn/shadcn-io/tags/index.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/shadcn/shadcn-io/tags/index.tsx)
