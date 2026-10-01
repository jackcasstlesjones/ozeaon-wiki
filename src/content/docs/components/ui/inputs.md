---
title: "UI: Inputs"
description: Standalone (non-form-bound) inputs — a search field with affix slot and a searchable multi-select.
sidebar:
  order: 8
---

Controlled inputs that are not tied to React Hook Form. Use them when you manage state yourself; inside an RHF form use the `hook-form` wrappers documented on the [Forms](../forms/) page (for example `InputMultiSelect` wraps `MultiSelect`).

Barrel: `src/components/ui/inputs/index.ts` exports `SearchInput`, `MultiSelect`, the `MultiSelectOption` type, and re-exports `OtpInput` and everything from `@/components/ui/forms/hook-form`.

`src/components/ui/inputs/README.md` still describes Conform-based `*Field` components; those names do not exist in the current source.

## SearchInput

A shadcn `Input` with a leading magnifier icon and an optional trailing slot for clear buttons, toggles or spinners.

- **Source:** [src/components/ui/inputs/SearchInput.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/inputs/SearchInput.tsx)
- **Kind:** Server component (no directive)
- **Used in:** `src/components/search/SearchBar.tsx`, `src/components/search/MobileSearchBar.tsx`, `src/components/ui/inputs/MultiSelect.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `trailing` | `ReactNode` | — | Content absolutely positioned at the right edge of the field. |
| `inputRef` | `Ref<HTMLInputElement>` | — | Ref to the `<input>` itself. |
| `wrapperClassName` | `string` | — | Classes for the wrapper `<div>`. |
| `className` | `string` | — | Merged onto the input (after `pl-9`). |

Plus all `<input>` props (forwarded to the input).

Notable behaviour:

- The forwarded `ref` points at the **wrapper** `<div>`, not the input, so `PopoverAnchor asChild` measures the whole field. Use `inputRef` to focus or blur the input.
- When using `trailing`, add right padding to the input via `className` (e.g. `pr-9`) so text does not run under it.

```tsx
<SearchInput
  type="search"
  name="q"
  value={value}
  onChange={(event) => setValue(event.target.value)}
  placeholder="Search..."
  aria-label="Search"
  autoComplete="off"
  className="border-transparent pr-9 hover:border-transparent"
  trailing={/* clear button */}
/>
```

## MultiSelect

A searchable select: a `SearchInput` anchors a popover listing options with checkboxes, optionally grouped. Supports multi-select (default) or single-select.

- **Source:** [src/components/ui/inputs/MultiSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/inputs/MultiSelect.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/forms/hook-form/InputMultiSelect.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `MultiSelectOption[]` (`{ value: string; label: string; group?: string }`) | — | Available options. Required. |
| `value` | `string[]` | — | Selected values. Required. |
| `onChange` | `(values: string[]) => void` | — | Called with the new selection. Required. |
| `placeholder` | `string` | `"Select options..."` | Input placeholder. |
| `emptyMessage` | `string` | `"No results found."` | Shown when the search matches nothing. |
| `multiple` | `boolean` | `true` | `false` makes it single-select. |
| `disabled` | `boolean` | `false` | Disables the input and toggle button. |
| `invalid` | `boolean` | `false` | Applies the destructive border and error surface. |
| `className` | `string` | — | Merged onto the input. |
| `name` | `string` | — | Input `name`. |

The forwarded `ref` points at the search `<input>`.

Notable behaviour:

- The input text is a search filter, not the value. Typing or focusing opens the popover; Escape closes it and clears the search.
- Options are grouped with `groupOptions` and filtered with `filterGroupedOptions`. Group headings show only when there is more than one group.
- Multi mode toggles values in and out and keeps the popover open; a clear-all (X) button appears once something is selected. Single mode selects one value (or deselects it), then closes and clears the search.
- The chevron button toggles the popover; clicks on it are ignored by the popover's outside-click handler so it does not close and reopen. The popover does not steal focus on open and matches the anchor's width.
- Selected values are not rendered as chips by this component.

```tsx
<MultiSelect
  name={name}
  ref={field.ref}
  options={options}
  value={selectedValues}
  onChange={field.onChange}
  placeholder={placeholder as string}
  emptyMessage={emptyMessage}
  disabled={disabled}
  invalid={fieldState.invalid}
/>
```
