---
title: "Inputs"
description: Standalone (non-form-bound) inputs — a search field with affix slot and a searchable multi-select.
sidebar:
  order: 8
---

Controlled inputs that aren't tied to React Hook Form. Use them when you manage state yourself. Inside an RHF form, use the `hook-form` wrappers on the [Forms](../forms/) page (e.g. `InputMultiSelect` wraps `MultiSelect`). The `@/components/ui/inputs` barrel also re-exports the hook-form wrappers. See also [UI Primitives](../../../design-system/ui-primitives/).

`src/components/ui/inputs/README.md` is stale: it describes Conform-based `*Field` components that no longer exist.

## SearchInput

A shadcn `Input` with a leading search icon and an optional `trailing` slot for clear buttons or spinners. Gotchas:

- The forwarded `ref` points at the **wrapper**, so popovers anchor to the whole field. Use `inputRef` to focus the input itself.
- Add right padding via `className` when you use `trailing`.

**Source:** [src/components/ui/inputs/SearchInput.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/inputs/SearchInput.tsx)

## MultiSelect

A searchable select: a `SearchInput` anchors a popover of checkbox options, optionally grouped. Multi mode is the default, and there is a single mode.

- The input text is a filter, not the value.
- The component doesn't render the selected values as chips, so callers show them.
- The forwarded `ref` points at the search input.

**Source:** [src/components/ui/inputs/MultiSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/inputs/MultiSelect.tsx)
