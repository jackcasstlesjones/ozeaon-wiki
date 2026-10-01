---
title: "Forms"
description: Form layout shells, file and image upload controls, and React Hook Form field wrappers under src/components/ui/forms.
sidebar:
  order: 6
---

Everything needed to build a form: collapsible section cards and the sticky section sidebar, drag-and-drop and image upload controls, and a set of React Hook Form (RHF) wrappers that bind shadcn inputs to a field by `name`. Import layout and upload components from `@/components/ui/forms`; import RHF wrappers from `@/components/ui/forms/hook-form`. The wrappers read the form through `useFormContext` and must render inside a `<Form {...form}>` provider in a client component. `InputContent` is not in the hook-form barrel — import it from `@/components/ui/forms/hook-form/InputContent` directly.

See also: [Forms & Validation](../../../design-system/forms-and-validation/) in the design system.

## Layout and Navigation

### FormSectionCard

Collapsible, numbered form section rendered as a `<fieldset>`. Its `id` is the scroll target for `FormSidebar`. Opens by default; the legend acts as the collapse trigger. `scroll-mt-20` leaves room for the sticky topbar.

**Source:** [src/components/ui/forms/FormSectionCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormSectionCard.tsx)

### FormSidebar

Sticky, desktop-only (lg and up) list of numbered section buttons with an optional "Last Saved" timestamp. A disabled section never shows as completed.

**Source:** [src/components/ui/forms/FormSidebar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormSidebar.tsx)

### FormStepAccordion

Controlled accordion step with a numbered badge (check mark once completed). Content is `forceMount`ed and hidden with CSS when the step is inactive, so its fields stay registered with RHF.

**Source:** [src/components/ui/forms/FormStepAccordion.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormStepAccordion.tsx)

### StepIndicator

Horizontal row of numbered step circles joined by lines. Completed steps show a check icon; the current step gets a ring.

**Source:** [src/components/ui/forms/StepIndicator.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/StepIndicator.tsx)

### TabMenu

Row of route-driven tab buttons with an optional right-aligned item. The active tab is the last path segment; clicking calls `router.push`. The `<nav>` has the hard-coded `aria-label` `"Project sections navigation"`.

**Source:** [src/components/ui/forms/TabMenu.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/TabMenu.tsx)

### FilterSection

`<fieldset>` with a legend label and a "Clear" button for one group in a filter panel. When `hasValue` is false, Clear is invisible and non-interactive but still takes up space, keeping the layout stable.

**Source:** [src/components/ui/forms/FilterSection.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FilterSection.tsx)

## File and Image Upload

### DropzoneSurface

Headless click / keyboard / drag-and-drop file target. It owns a hidden `<input type="file">` and hands the selected `File[]` to `onFiles`. The file input's value is reset after each pick, so the same file can be re-selected.

**Source:** [src/components/ui/forms/DropzoneSurface.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/DropzoneSurface.tsx)

### AttachmentDropzone

Styled `DropzoneSurface` with an upload icon (spinner while busy), a label and a sublabel or locked message. The base for document and gallery upload zones.

**Source:** [src/components/ui/forms/AttachmentDropzone.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/AttachmentDropzone.tsx)

### FormImageUpload

Single-image upload field (logo, cover or section image). Shows a dropzone when empty and an `ImagePreviewTile` once an image is set; validates, uploads through the moderated image pipeline, and supports re-cropping a stored image via `AvatarCropModal`. Adjust reads the stored image through `/api/storage?key=…` to avoid CORS and canvas tainting.

**Source:** [src/components/ui/forms/FormImageUpload.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormImageUpload.tsx)

### ImagePreviewTile

`next/image` fill preview with hover controls. Three modes are checked in order: `locked` (lock overlay, no actions), `onReplace` overlay (Adjust / Replace / Remove), or a corner X that calls `onRemove`.

**Source:** [src/components/ui/forms/ImagePreviewTile.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/ImagePreviewTile.tsx)

### AvatarUpload

Circular image control (avatar or logo) with Adjust, Replace and Remove buttons. Every incoming file is cropped square before upload. Rejects files not in `IMAGE_CONFIG.allowedMimeTypes` or over the size limit with a toast.

**Source:** [src/components/ui/forms/AvatarUpload.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/AvatarUpload.tsx)

### AvatarCropModal

Dialog for cropping an image with `react-image-crop`. Outputs a new `File` of the same name and MIME type. The initial crop is centred at 90% of the image width; the dialog cannot be dismissed while an upload is in progress.

**Source:** [src/components/ui/forms/AvatarCropModal.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/AvatarCropModal.tsx)

## Hook-Form Wrappers

Most wrappers accept shared props for helper text, container class, and forwarded label / message / description props; these are not repeated in each entry. Two gotchas that apply across the group: `updates` is accepted by `InputBoolean`, `InputCheckbox`, `InputTextarea` and `InputTags` but never read. `StringArrayFieldPath<T>` (in [types.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/types.ts)) is intended for `string[]` paths but resolves to `string` for non-matching paths rather than `never`, so in practice it accepts any string.

### RequiredFieldsProvider / useRequiredFields

Context listing required field names. `FieldWrapper` labels add a red `*` for fields in the set. Array indices in field names are normalised (`items.0.title` matches `items.title`). Returns an empty set outside a provider.

**Source:** [src/components/ui/forms/hook-form/RequiredFieldsContext.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/RequiredFieldsContext.tsx)

### FieldWrapper

The common field chrome: a `FormItem` holding the label (with required asterisk and optional right action), the control, and the description or error message with optional character count. Must render inside a `FormField` render function.

**Source:** [src/components/ui/forms/hook-form/FieldWrapper.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/FieldWrapper.tsx)

### CharacterCount

A `current/max` counter. Shows the overflow as a negative number in the destructive colour when over the limit. Uses `aria-live="polite"`.

**Source:** [src/components/ui/forms/hook-form/CharacterCount.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/CharacterCount.tsx)

### InputText

Text input bound to a field. Supports icons, a suffix slot (`InputInlineSelect` fits here), derived-field `updates` and cross-field validation on blur. With `type="number"`, the field receives `valueAsNumber` (`undefined` when empty or not a number).

**Source:** [src/components/ui/forms/hook-form/InputText.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputText.tsx)

### InputTextarea

`Textarea` bound to a field with an optional character count. The `updates` prop is accepted but not read.

**Source:** [src/components/ui/forms/hook-form/InputTextarea.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputTextarea.tsx)

### InputPassword

Binds the `PasswordInput` show/hide toggle input to a form field. Supports a `labelAction` slot (e.g. a "Forgot password?" link).

**Source:** [src/components/ui/forms/hook-form/InputPassword.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputPassword.tsx)

### InputCheckbox

Single checkbox with its label beside it. Uses a plain `FormLabel` rather than `FieldWrapper`'s label, so it gets no required asterisk. An `"indeterminate"` value is stored as `false`.

**Source:** [src/components/ui/forms/hook-form/InputCheckbox.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputCheckbox.tsx)

### InputCheckboxGroup

Grid of checkboxes that toggles values in a `string[]` field, with a "Clear all" link.

**Source:** [src/components/ui/forms/hook-form/InputCheckboxGroup.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputCheckboxGroup.tsx)

### InputBoolean

Labelled `Switch` toggle row with optional description and suffix slot. Renders its own `FormItem` rather than using `FieldWrapper`, so it gets no required asterisk.

**Source:** [src/components/ui/forms/hook-form/InputBoolean.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputBoolean.tsx)

### InputDate

Date picker button that opens a popover `Calendar`. The value is stored as a `yyyy-MM-dd` string. The `disabled` prop is a `(date: Date) => boolean` predicate for days that cannot be picked, not a boolean.

**Source:** [src/components/ui/forms/hook-form/InputDate.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputDate.tsx)

### InputSelect

Single-value shadcn `Select` bound to a field. The selected option's `description` replaces the `description` prop. Errors on the field are cleared as soon as a value is picked.

**Source:** [src/components/ui/forms/hook-form/InputSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputSelect.tsx)

### InputInlineSelect

Compact select meant to sit inside another input (pass it as `InputText`'s `suffixSlot`). Maps display keys to field values. The width is fixed to the longest label so the control never resizes; renders nothing when `options` is empty.

**Source:** [src/components/ui/forms/hook-form/InputInlineSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputInlineSelect.tsx)

### InputMultiSelect

Binds the `MultiSelect` dropdown to a `string[]` field. Selected values appear as removable badges below it. The `disabled` prop is ignored; disabled state comes only from `formState.disabled`.

**Source:** [src/components/ui/forms/hook-form/InputMultiSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputMultiSelect.tsx)

### InputGridSelect

Responsive grid of toggle cards for a `string[]` field. Selections show as removable badges with a "Clear all" link. Each card is a button with `aria-pressed`. No active JSX call sites.

**Source:** [src/components/ui/forms/hook-form/InputGridSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputGridSelect.tsx)

### InputRadioGroup

Radio group styled as pill buttons; the checked pill uses the primary fill. No active call sites.

**Source:** [src/components/ui/forms/hook-form/InputRadioGroup.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputRadioGroup.tsx)

### InputRadioTiles

Radio group rendered as icon tiles. Each option can be disabled, carry a corner badge, and carry extra classes. Tiles sit in a two-column grid on mobile and wrap in a flex row from `sm` up.

**Source:** [src/components/ui/forms/hook-form/InputRadioTiles.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputRadioTiles.tsx)

### InputTags

Free-text tag input; committed tags show as removable badges. Enter, comma or blur commits the pending text; pasting splits on commas; duplicates are ignored. The field value is a comma-separated string, so a tag that contains a comma will split on read-back.

**Source:** [src/components/ui/forms/hook-form/InputTags.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputTags.tsx)

### InputSearchSelect

Async search-as-you-type single select built on `Command`. Search starts at 3 characters and is debounced 500 ms. Once an item is chosen it shows as a pill with a clear button.

**Source:** [src/components/ui/forms/hook-form/InputSearchSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputSearchSelect.tsx)

### InputSearchSelectWithChip

Async search select that shows the chosen item as a card (avatar, title, optional sub-label) with a remove button. The input is disabled while an item is selected.

**Source:** [src/components/ui/forms/hook-form/InputSearchSelectWithChip.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputSearchSelectWithChip.tsx)

### InputSearchLocation

`InputSearchSelect` preset for `/api/locations/search`. By default, selecting a location writes `meta.latitude` and `meta.longitude` into the form fields named `latitude` and `longitude` (these field names are hard-coded).

**Source:** [src/components/ui/forms/hook-form/InputSearchLocation.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputSearchLocation.tsx)

### InputContent

Rich-text field using the Tiptap editor with server autosave and image uploads, wired to the article content routes. Not exported from the hook-form barrel — import from `@/components/ui/forms/hook-form/InputContent` directly. Call `save(id)` to flush pending changes; pass an id when saving against a record created after the editor mounted.

**Source:** [src/components/ui/forms/hook-form/InputContent.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputContent.tsx)

### ShowWhen

Conditionally renders children based on a watched field. Hidden fields can optionally be reset and unregistered via `unregisterFields`.

**Source:** [src/components/ui/forms/hook-form/ShowWhen.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/ShowWhen.tsx)

### OtpInput

Row of single-digit inputs for one-time codes. Despite living in `hook-form/`, this is not RHF-bound — it keeps its own state and reports the full code through an `onCompleteAction` callback.

**Source:** [src/components/ui/forms/hook-form/OtpInput.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/OtpInput.tsx)

### useSearchSelect

The hook behind `InputSearchSelect` and `InputSearchSelectWithChip`. Not exported from the barrel. Debounces 500 ms after the trimmed query reaches 3 characters, then fetches with `q` and `limit=10`; superseded requests are aborted.

**Source:** [src/components/ui/forms/hook-form/useSearchSelect.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/useSearchSelect.ts)
