---
title: "UI: Forms"
description: Form layout shells, file/image upload controls and the React Hook Form field wrappers under src/components/ui/forms.
sidebar:
  order: 6
---

Everything needed to build a form: section cards and the sticky section sidebar, drag-and-drop and image upload controls, and a set of React Hook Form (RHF) wrappers that bind shadcn inputs to a field by `name`. Use the wrappers instead of hand-wiring `FormField` + `FormItem` + `FormLabel` + `FormMessage`. They pick up label, description, error message, required asterisk and character count for you.

The RHF wrappers read the form through `useFormContext`, so they must render inside the shadcn `<Form {...form}>` provider in a client component.

## Layout and navigation

### FormSectionCard

A collapsible, numbered form section rendered as a `<fieldset>`. Its `id` is the scroll target for `FormSidebar`.

- **Source:** [src/components/ui/forms/FormSectionCard.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormSectionCard.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/ProjectForm.tsx`, `src/components/articles/form/ArticleForm.tsx`, `src/components/organizations/form/OrganizationForm.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Fieldset id, used as the anchor/scroll target. |
| `number` | `number` | — | Shown in a badge before the title when set. |
| `title` | `string` | — | Section heading; also the content region's `aria-label`. |
| `description` | `string` | — | Muted text under the title. |
| `required` | `boolean` | `false` | Shows a "Required" badge. |
| `disabled` | `boolean` | — | Disables the fieldset. Falls back to the form's `disabled` state when omitted. |
| `control` | `Control<TFormValues>` | — | Passed to `useFormState` to read `disabled`. Uses the form context when omitted. |
| `className` | `string` | — | Extra classes on the fieldset. |
| `children` | `ReactNode` | — | Section content. |

Notable behaviour:

- Opens by default. The whole legend acts as the collapse trigger, and the chevron rotates when the section is closed.
- The content is wrapped in `role="region"` so it shows up as a navigable landmark.
- `scroll-mt-20` leaves room for the sticky header when the section is scrolled into view.

```tsx
<FormSectionCard
  id="section-project-type"
  number={1}
  title="Project Type"
  description="Select the type that best describes your project."
  required
>
  <ProjectTypeSection projectTypes={projectTypes} />
</FormSectionCard>
```

### FormSidebar

A sticky, desktop-only (`lg` and up) list of numbered section buttons, with an optional "Last Saved" timestamp.

- **Source:** [src/components/ui/forms/FormSidebar.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormSidebar.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/ProjectForm.tsx`, `src/components/organizations/form/OrganizationForm.tsx`, `src/components/articles/form/ArticleFormSidebar.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `sections` | `FormSidebarSection[]` | — | `{ id, number, label, disabled? }` per entry. |
| `activeSection` | `string` | — | Id of the highlighted section. |
| `completedSections` | `Record<string, boolean>` | — | A section's number circle turns green when its entry is `true`. |
| `onSectionClick` | `(id: string) => void` | — | Called with the section id on click. |
| `lastSaved` | `Date \| string \| null` | — | Rendered with `DateDisplay` (`short-time`) when set. |

Notable behaviour: a section with `disabled: true` never shows as completed. The `FormSidebarSection` type is exported from the barrel.

```tsx
<FormSidebar
  sections={SIDEBAR_SECTIONS}
  activeSection={activeSection}
  completedSections={completedSections}
  onSectionClick={scrollToSection}
  lastSaved={lastSaved}
/>
```

### FormStepAccordion

A controlled accordion step with a numbered badge (a check mark once completed) and a chevron.

- **Source:** [src/components/ui/forms/FormStepAccordion.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormStepAccordion.tsx)
- **Kind:** No `"use client"` directive (uses the shadcn Collapsible)
- **Used in:** no call sites outside the barrel

| Prop | Type | Default | Description |
|---|---|---|---|
| `stepNumber` | `number` | — | Number shown in the badge. |
| `title` | `string` | — | Step heading (`<h3>`). |
| `isActive` | `boolean` | — | Controls whether the step is open. |
| `isCompleted` | `boolean` | `false` | Replaces the number with a check icon. |
| `onExpand` | `() => void` | — | Called whenever the trigger asks to open or close. |
| `id` | `string` | — | Id on the root element. |
| `children` | `ReactNode` | — | Step content. |

Notable behaviour: the content is `forceMount`ed and hidden with CSS when the step is inactive, so its fields stay registered.

### StepIndicator

A horizontal row of numbered step circles joined by lines.

- **Source:** [src/components/ui/forms/StepIndicator.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/StepIndicator.tsx)
- **Kind:** Server component (no directive, no hooks)
- **Used in:** no call sites outside the barrel

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `Step[]` | — | `{ number, label, status: "completed" \| "current" \| "upcoming" }`. |
| `currentStep` | `number` | — | An `upcoming` step whose number is below this is styled as passed (primary border, primary line). |

Notable behaviour: completed steps show a check icon, and the current step gets a ring. The `Step` type is exported from the barrel.

### TabMenu

A row of route-driven tab buttons, with an optional right-aligned item.

- **Source:** [src/components/ui/forms/TabMenu.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/TabMenu.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** no call sites outside the barrel

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `TabItem[]` | — | `{ value, label, color }`. `color` is not read. |
| `rightItem` | `TabItem` | — | Extra tab pushed to the right edge. |

Notable behaviour:

- The active tab is the last path segment, or the first tab when there is no segment.
- Clicking a tab calls `router.push` to `<first two path segments>/<value>` with `scroll: false`.
- Labels pass through `toTitleCase`.
- The `<nav>` has the hard-coded label `"Project sections navigation"`.

### FilterSection

A `<fieldset>` with a legend label and a "Clear" button, for one group in a filter panel.

- **Source:** [src/components/ui/forms/FilterSection.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FilterSection.tsx)
- **Kind:** Server component (no directive, no hooks)
- **Used in:** `src/components/projects/ProjectsFilterDialog.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Legend text. |
| `onClear` | `() => void` | — | Called by the Clear button. |
| `hasValue` | `boolean` | — | When `false`, Clear is made invisible and non-interactive, but it still takes up space. |
| `children` | `ReactNode` | — | The filter controls. |

```tsx
<FilterSection
  label="Project Type"
  onClear={() => form.setValue("projectTypeIds", [])}
  hasValue={watchedProjectTypeIds.length > 0}
>
  <InputMultiSelect
    name="projectTypeIds"
    label="Project Type"
    labelProps={{ className: "sr-only" }}
    options={projectTypeOptions}
    placeholder="Select type..."
  />
</FilterSection>
```

## File and image upload

### DropzoneSurface

A headless click / keyboard / drag-and-drop file target. It owns a hidden `<input type="file">` and hands the selected `File[]` to `onFiles`. It is the base for `AttachmentDropzone` and `FormImageUpload`.

- **Source:** [src/components/ui/forms/DropzoneSurface.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/DropzoneSurface.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/ui/forms/AttachmentDropzone.tsx`, `src/components/ui/forms/FormImageUpload.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `accept` | `string` | — | Passed to the file input. |
| `multiple` | `boolean` | `false` | Allows selecting several files. |
| `disabled` | `boolean` | `false` | Makes the surface inactive. |
| `busy` | `boolean` | `false` | Also makes it inactive. Passed to render-prop children. |
| `onFiles` | `(files: File[]) => void` | — | Called with dropped or picked files (only when there is at least one). |
| `className` | `string` | — | Extra classes on the surface. |
| `children` | `ReactNode \| ({ isDragging, busy }) => ReactNode` | — | Static content, or a render function. |

Notable behaviour:

- `role="button"`. Enter and Space open the picker.
- `tabIndex` is `-1` and `aria-disabled` is set while inactive.
- The file input's value is reset after each pick, so the same file can be picked again.
- Shows a highlighted border while a file is dragged over it.

### AttachmentDropzone

A styled `DropzoneSurface` with an upload icon (a spinner while busy), a label, and a sublabel or locked message.

- **Source:** [src/components/ui/forms/AttachmentDropzone.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/AttachmentDropzone.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/DocumentsSection.tsx`, `src/components/articles/form/sections/attachments/ArticleAnnexesUpload.tsx`, `src/components/articles/form/sections/attachments/ArticleGalleryUpload.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Main text. Replaced by "Uploading…" when `busy`, and by "Drop files here" while dragging. |
| `sublabel` | `string` | — | Secondary text. Line breaks are preserved. |
| `lockedMessage` | `string` | — | Shown instead of `sublabel` when set. |
| `accept` | `string` | — | File input `accept`. |
| `multiple` | `boolean` | — | Required. |
| `disabled` | `boolean` | — | Required. |
| `busy` | `boolean` | — | Required. |
| `onFiles` | `(files: File[]) => void` | — | Receives the selected files. |
| `className` | `string` | — | Extra classes. |

```tsx
<AttachmentDropzone
  label="Click to upload document"
  accept={DOCUMENT_CONFIG.allowedExtensions.join(",")}
  sublabel={`Max. file size: ${DOCUMENT_CONFIG.maxSizeMB} MB`}
  multiple
  disabled={isUploading || formState.disabled}
  busy={isUploading}
  onFiles={(files) => {
    const file = files[0];
    if (file) void uploadFile(file);
  }}
/>
```

### FormImageUpload

A single-image upload field (logo, cover or section image). It shows a dropzone when empty and an `ImagePreviewTile` once an image is set. It validates, uploads through the moderated image pipeline, and supports re-cropping a stored image.

- **Source:** [src/components/ui/forms/FormImageUpload.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormImageUpload.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/organizations/form/steps/MediaStep.tsx`, `src/components/projects/form/steps/ProjectIdentitySection.tsx`, `src/components/articles/form/sections/attachments/ArticleCoverUpload.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"logo" \| "cover" \| "section"` | — | Picks the max size, aspect class, surface colour, label and default description. |
| `uploadUrl` | `string` | — | Upload endpoint. Used when `onBeforeUpload` is not given. |
| `onBeforeUpload` | `() => Promise<string \| null>` | — | Resolves the upload URL just before uploading (for example after saving a draft). Returning `null` cancels the upload. |
| `initialPreviewUrl` | `string \| null` | — | Image to show. The preview re-syncs whenever this changes. |
| `description` | `string` | per `type` | Overrides the dropzone helper text. |
| `aspectRatio` | `string` | per `type` | Tailwind class overriding the aspect (for example `"h-32"`). |
| `onUploadSuccess` | `(data: Record<string, unknown>) => void` | — | Receives the upload response data. |
| `onRemove` | `() => void \| Promise<void>` | — | Awaited, then the preview is cleared. |
| `disabled` | `boolean` | `false` | Disables the dropzone and locks the preview tile. |
| `className` | `string` | — | Wrapper classes. |
| `imagePath` | `string \| null` | — | R2 key of the saved image. When set, the tile shows an Adjust control. |
| `cropTitle` | `string` | — | Title of the Adjust crop dialog. |
| `cropAspect` | `number` | — | Aspect ratio (width / height) for the Adjust crop. |

Notable behaviour:

- Accepts the MIME types in `IMAGE_CONFIG.allowedMimeTypes`. `logo` uses `IMAGE_CONFIG.maxSizes.avatar` as its size limit; `cover` and `section` use `maxSizes.coverImage`. Validation errors show inline under the control (`role="alert"`).
- Shows a local object-URL preview immediately while the upload runs. On failure it reverts to `initialPreviewUrl`.
- Uploads with `uploadModeratedImage`. If moderation rejects the image, it opens `ModerationRejectedDialog` and adds a "report the issue" link (`MODERATION_REPORT_URL`) to the error.
- It remembers the returned `data.image_url`. When the form echoes that same URL back as `initialPreviewUrl`, the local blob is kept and the image is not re-fetched from R2.
- Adjust reads the stored image through `/api/storage?key=…` (not the public R2 URL, which avoids CORS and canvas tainting). It then opens `AvatarCropModal` with `circularCrop={false}` and uploads the cropped file.

```tsx
<FormImageUpload
  type="logo"
  uploadUrl="/api/organizations/image?type=logo"
  aspectRatio="h-32"
  onUploadSuccess={(data) =>
    form.setValue("logo_image_id", data.imageId as string, { shouldDirty: true })
  }
  onRemove={() => form.setValue("logo_image_id", null, { shouldDirty: true })}
/>
```

### ImagePreviewTile

A `next/image` fill preview with hover controls.

- **Source:** [src/components/ui/forms/ImagePreviewTile.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/ImagePreviewTile.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/posts/create-form/parts/ImagePreviewGrid.tsx`, `src/components/articles/form/sections/attachments/ArticleGalleryUpload.tsx`, `src/components/ui/forms/FormImageUpload.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image URL. |
| `alt` | `string` | — | Alt text. |
| `onRemove` | `() => void` | — | Remove action. |
| `onReplace` | `(file: File) => void` | — | When set, shows the full Adjust / Replace / Remove overlay. Replace opens a hidden file input. |
| `onAdjust` | `() => void` | — | Adds the Adjust (pencil) button. Only shown together with `onReplace`. |
| `replaceAccept` | `string` | — | `accept` for the replace file input. |
| `locked` | `boolean` | `false` | Shows a lock overlay and no actions. |
| `sizes` | `string` | `"(max-width: 640px) 50vw, 25vw"` | `next/image` `sizes`. |
| `className` | `ClassNameValue` | — | Wrapper classes (set the aspect or size here). |

Notable behaviour: the tile has three modes, checked in this order: `locked`, then the `onReplace` overlay, then a small corner X that calls `onRemove`. Controls are always visible at 80% opacity on mobile and fade in on hover from `md` up.

```tsx
<ImagePreviewTile
  src={previewUrl}
  alt={`Selected image ${index + 1}`}
  onRemove={() => onRemove(index)}
  sizes="200px"
  className="aspect-square"
/>
```

### AvatarUpload

A circular image control (avatar or logo) with Adjust, Replace and Remove buttons under the preview. Every incoming file is cropped square before upload.

- **Source:** [src/components/ui/forms/AvatarUpload.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/AvatarUpload.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/account/ProfileSettings.tsx`, `src/components/organizations/form/OrganizationSettingsForm.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `imageUrl` | `string \| null` | — | Current image. When empty, a clickable upload placeholder is shown. |
| `imagePath` | `string \| null` | — | R2 key. Required for Adjust (re-crop). |
| `name` | `string` | — | Accessible name for the `UserAvatar` preview. |
| `label` | `string` | `"image"` | Noun used in action labels, for example `"logo"` gives "Replace logo". |
| `description` | `string` | `"JPG, PNG or WEBP file, up to 2MB"` | Caption under the control. |
| `size` | `UserAvatarSize` | `"xl"` | Preview size. |
| `disabled` | `boolean` | `false` | Disables every action. |
| `maxSizeMB` | `number` | `IMAGE_CONFIG.maxSizes.avatar` | Upload size limit. |
| `cropTitle` | `string` | — | Crop dialog title. |
| `removeTitle` | `string` | — | Remove button label and confirm dialog title. |
| `removeDescription` | `string` | — | Confirm dialog body. |
| `onUpload` | `(file: File) => Promise<boolean \| void>` | — | Receives the cropped file. Return `false` to keep the crop modal open. |
| `onRemove` | `() => Promise<boolean \| void>` | — | Return `false` to keep the confirm dialog open. |

Notable behaviour:

- Rejects files whose type is not in `IMAGE_CONFIG.allowedMimeTypes`, or that exceed `maxSizeMB`, with a toast.
- Adjust is disabled when there is no `imagePath`. Remove is disabled when there is no `imageUrl`.
- Adjust fetches the stored file through `/api/storage?key=…`.
- Remove goes through a destructive `ConfirmDialog`.

```tsx
<AvatarUpload
  imageUrl={getImageUrl(avatarPath)}
  imagePath={avatarPath}
  name={profile.display_name}
  label="profile picture"
  cropTitle="Adjust Profile Photo"
  removeTitle="Remove Profile Picture"
  removeDescription="Are you sure you want to remove your profile picture?"
  onUpload={uploadImage}
  onRemove={removeImage}
  disabled={isSubmitting}
/>
```

### AvatarCropModal

A dialog for cropping an image with `react-image-crop`. It outputs a new `File` of the same name and MIME type.

- **Source:** [src/components/ui/forms/AvatarCropModal.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/AvatarCropModal.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/profiles/users/AvatarOwnerControls.tsx`, `src/components/ui/forms/AvatarUpload.tsx`, `src/components/ui/forms/FormImageUpload.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | — | Dialog open state. |
| `onClose` | `() => void` | — | Called on Cancel, on dismiss, and after a successful crop. |
| `imageFile` | `File \| null` | — | Image to crop. It is read with `FileReader` when the dialog opens. |
| `onCropComplete` | `(croppedFile: File) => Promise<boolean \| void>` | — | Awaited before closing. Return `false` to keep the dialog open. |
| `title` | `string` | `"Adjust Photo"` | Dialog title. |
| `aspect` | `number` | `1` | Crop aspect ratio (width / height). |
| `circularCrop` | `boolean` | `true` | Circular overlay. |

Notable behaviour:

- The initial crop is centred and covers 90% of the image width at `aspect`.
- The crop is drawn on a canvas at natural resolution.
- The dialog cannot be dismissed while the upload is in progress.
- The confirm button is a `LoadingButton` labelled "Crop & Upload".

```tsx
<AvatarCropModal
  isOpen={showCropModal}
  onClose={() => {
    setShowCropModal(false);
    setSelectedFile(null);
  }}
  imageFile={selectedFile}
  onCropComplete={handleCropComplete}
  title="Adjust Profile Photo"
/>
```

## Hook-form wrappers

All of these live in `src/components/ui/forms/hook-form/` and are exported from `@/components/ui/forms/hook-form`, except `InputContent` (see below). Each wrapper takes a `name` and binds itself with `FormField`. Most also accept the shared props below.

### Shared props and types

Defined in [types.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/types.ts):

- `TextFieldPath<T>`: form paths whose value is `string | number | null | undefined`. Used to type `name` on text-like wrappers.
- `BoolFieldPath<T>`: paths whose value is `boolean | null | undefined`.
- `StringArrayFieldPath<T>`: intended for `string[]` paths. Non-matching paths resolve to `string` rather than `never`, so in practice it accepts any string.
- `FieldUpdate`: `{ name: string; map: (value) => unknown; shouldDirty?: boolean }`. Describes a derived write to another field when this one changes.
- `FieldLabelProps`, `FieldMessageProps`, `FieldDescriptionProps`: the props of the shadcn `FormLabel`, `FormMessage` and `FormDescription`.

Shared props accepted by most wrappers (they are not repeated in each table below):

| Prop | Type | Description |
|---|---|---|
| `description` | `string` | Helper text. `FieldWrapper` hides it while the field has an error. |
| `containerClassName` | `string` | Classes on the `FormItem`. |
| `labelProps` | `FieldLabelProps` | Forwarded to the label, for example `{ className: "sr-only" }`. |
| `messageProps` | `FieldMessageProps` | Forwarded to `FormMessage`. |
| `descriptionProps` | `FieldDescriptionProps` | Forwarded to `FormDescription`. |

`updates` is applied by `InputText`, `InputSelect` and `InputRadioTiles`. `InputBoolean`, `InputCheckbox`, `InputTextarea` and `InputTags` accept it in their types but never read it.

### RequiredFieldsProvider / useRequiredFields

A context listing the required field names. `FieldWrapper` labels add a red `*` for fields in the set.

- **Source:** [src/components/ui/forms/hook-form/RequiredFieldsContext.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/RequiredFieldsContext.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/ProjectForm.tsx`, `src/components/articles/form/ArticleForm.tsx`, `src/components/organizations/form/OrganizationForm.tsx`, `src/components/organizations/form/OrganizationSettingsForm.tsx`, `src/components/account/ProfileSettings.tsx`, `src/components/projects/form/parts/ContentSectionCard.tsx` (the provider; `useRequiredFields` is read by `FieldWrapper`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `readonly string[]` | — | Required field names. |
| `children` | `ReactNode` | — | Form content. |

Notable behaviour:

- `useRequiredFields()` returns the `Set<string>`, which is empty outside a provider.
- Array indices in field names are normalised (`items.0.title` matches `items.title`).

```tsx
<RequiredFieldsProvider fields={Object.keys(REQUIRED_FIELD_MESSAGES)}>
  <form noValidate>{/* sections */}</form>
</RequiredFieldsProvider>
```

### FieldWrapper

The common field chrome: a `FormItem` holding the label (with required asterisk and optional action on the right), the control, the description or error message, and an optional character count. It must render inside a `FormField` render function.

- **Source:** [src/components/ui/forms/hook-form/FieldWrapper.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/FieldWrapper.tsx)
- **Kind:** No `"use client"` directive (uses `useFormField`)
- **Used in:** `src/components/projects/form/steps/DocumentsSection.tsx`, `src/components/projects/form/parts/ContentSectionCard.tsx`, plus most wrappers on this page

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | No label is rendered when omitted. |
| `labelAction` | `ReactNode` | — | Rendered on the label row, aligned right. |
| `characterCount` | `ReactNode` | — | Rendered to the right of the description or message. |
| `children` | `ReactNode` | — | The control. |

Plus the shared props.

```tsx
<FieldWrapper label="Upload Project Documents" containerClassName="flex flex-col">
  <AttachmentDropzone /* … */ />
</FieldWrapper>
```

### CharacterCount

A `current/max` counter. When over the limit it shows the overflow as a negative number in the destructive colour.

- **Source:** [src/components/ui/forms/hook-form/CharacterCount.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/CharacterCount.tsx)
- **Kind:** Server component (no directive, no hooks)
- **Used in:** `src/components/projects/form/steps/ContentSection.tsx`, plus `InputText`, `InputTextarea`, `InputTags` and `InputContent`

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `number` | — | Current length. |
| `max` | `number` | — | Limit. |
| `alwaysShow` | `boolean` | — | The counter renders nothing unless this is true. |

Notable behaviour: the counter uses `aria-live="polite"`.

```tsx
<CharacterCount
  current={customSectionName.length}
  max={PROJECT_FIELD_LIMITS.sectionName}
  alwaysShow
/>
```

### InputText

A text input bound to a field. It supports icons, a suffix slot, derived-field updates and cross-field validation.

- **Source:** [src/components/ui/forms/hook-form/InputText.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputText.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/auth/LoginPageForm.tsx`, `src/components/projects/form/steps/ProjectIdentitySection.tsx`, `src/components/events/NewEventDialog.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `Path<TFormValues>` | — | Field path. |
| `label` | `string` | `name` | Label text. |
| `hideLabel` | `boolean` | `false` | Omits the label entirely. |
| `updates` | `FieldUpdate[]` | — | Derived writes on each change, using `setValue`. `shouldDirty` defaults to `true`. |
| `debouncedUpdates` | `boolean` | `false` | Debounces the `updates` writes. |
| `debounceTimeout` | `number` | `300` | Debounce delay in ms. |
| `validates` | `string[]` | — | Other fields to `trigger()` on blur. |
| `showRemaining` | `boolean` | — | Shows the `CharacterCount` (requires `maxLength`). |
| `prefixIcon` | `ComponentType<{ size?; className? }>` | — | Icon inside the left edge. |
| `suffixIcon` | `ComponentType<{ size?; className? }>` | — | Icon inside the right edge. |
| `suffixSlot` | `ReactNode` | — | Element pinned to the right inside the input, for example `InputInlineSelect`. |
| `className` | `string` | — | Classes on the `<input>`. |

Plus the shared props and all `<input>` props.

Notable behaviour:

- With `type="number"`, the field receives `valueAsNumber` (`undefined` when the input is empty or not a number).
- The value falls back to `formState.defaultValues[name]`, then `""`.
- Passing `hidden` hides the whole field container.

```tsx
<InputText
  name="title"
  label="Project Title"
  placeholder="Enter your project title"
  minLength={PROJECT_FIELD_LIMITS.title.min}
  maxLength={PROJECT_FIELD_LIMITS.title.max}
  showRemaining
/>
```

### InputTextarea

A `Textarea` bound to a field, with an optional character count.

- **Source:** [src/components/ui/forms/hook-form/InputTextarea.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputTextarea.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/articles/form/sections/LicensingAccessSection.tsx`, `src/components/projects/form/parts/TeamMemberCard.tsx`, `src/components/projects/form/parts/FAQItemCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `TextFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | — | Label text. |
| `resize` | `boolean` | `true` | Set to `false` to add `resize-none`. |
| `showRemaining` | `boolean` | — | Shows the `CharacterCount` (requires `maxLength`). |
| `updates` | `FieldUpdate[]` | — | Accepted but not read. |
| `className` | `string` | — | Classes on the textarea. |

Plus the shared props and all `<textarea>` props.

```tsx
<InputTextarea
  rows={3}
  resize={false}
  name="jurisdiction_notes"
  label="Legal Notes"
  placeholder="e.g. Governed under EU law, GDPR applies..."
/>
```

### InputPassword

Binds the `PasswordInput` from `@/components/ui/password-input` (a password field with a show/hide toggle) to a form field.

- **Source:** [src/components/ui/forms/hook-form/InputPassword.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputPassword.tsx)
- **Kind:** No `"use client"` directive (uses RHF context)
- **Used in:** `src/components/auth/LoginPageForm.tsx`, `src/components/auth/SignupPageForm.tsx`, `src/components/auth/ResetPasswordPageForm.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `TextFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | `name` | Label text. |
| `labelAction` | `ReactNode` | — | Element on the label row, for example a "Forgot password?" link. |
| `className` | `string` | — | Classes on the input. |

Plus the shared props and all `PasswordInput` props except `name`, `value`, `defaultValue` and `ref`.

```tsx
<InputPassword
  name="password"
  label="Password"
  disabled={isSubmitting}
  labelAction={<Link href="/forgot-password">Forgot password?</Link>}
/>
```

### InputCheckbox

A single checkbox with its label beside it.

- **Source:** [src/components/ui/forms/hook-form/InputCheckbox.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputCheckbox.tsx)
- **Kind:** No `"use client"` directive (uses RHF context)
- **Used in:** `src/components/articles/form/sections/LicensingAccessSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `BoolFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | — | Text beside the checkbox. |
| `className` | `string` | `""` | Classes on the checkbox. |
| `updates` | `FieldUpdate[]` | — | Accepted but not read. |

Plus the shared props and the shadcn `Checkbox` props except `checked`, `defaultChecked`, `onCheckedChange` and `onChange`.

Notable behaviour:

- An `"indeterminate"` value is stored as `false`.
- The label is a plain `FormLabel` rather than the `FieldWrapper` label, so it gets no required asterisk.

```tsx
<InputCheckbox label="Derivative works allowed" name="derivatives_allowed" />
```

### InputCheckboxGroup

A grid of checkboxes that toggles values in a `string[]` field, with a "Clear all" link.

- **Source:** [src/components/ui/forms/hook-form/InputCheckboxGroup.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputCheckboxGroup.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/CategoriesSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `StringArrayFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | — | Group label. |
| `options` | `CheckboxGroupOption[]` | — | `{ value, label, description? }`. Each option is shown as "label: description". |
| `columns` | `1 \| 2 \| 3` | `3` | Number of grid columns (`3` is responsive). |
| `disabled` | `boolean` | — | Combined with the form's `disabled` state. |

Plus `description`, `labelProps`, `messageProps` and `descriptionProps`. `className` and `containerClassName` are in the type but not read.

```tsx
<InputCheckboxGroup
  label="SDG Alignment"
  name="sdgs"
  options={sdgOptions}
  description="Strongly encouraged. Select all that apply."
/>
```

### InputBoolean

A labelled `Switch` toggle row, with an optional description and suffix (for example a badge).

- **Source:** [src/components/ui/forms/hook-form/InputBoolean.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputBoolean.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/ConfigurationSection.tsx`, `src/components/projects/form/steps/CommentsSection.tsx`, `src/components/articles/form/sections/AuthorInput.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `BoolFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | — | Label text. Also the switch's `aria-label`. |
| `labelSuffix` | `ReactNode` | — | Rendered after the label. |
| `validates` | `string[]` | — | Fields to `trigger()` on every toggle. |
| `updates` | `FieldUpdate[]` | — | Accepted but not read. |
| `className` | `ClassNameValue` | — | Accepted but not applied to the switch. |

Plus the shared props and the shadcn `Switch` props except `checked` and `defaultChecked`. Your own `onCheckedChange` runs before the field updates.

Notable behaviour: it renders its own `FormItem` and label rather than `FieldWrapper`, so it gets no required asterisk.

```tsx
<InputBoolean
  name="funding_enabled"
  label="Enable Funding"
  description="Allow funders to contribute to this project"
  labelSuffix={comingSoonBadge}
  disabled
/>
```

### InputDate

A date picker: a button that opens a popover `Calendar`. The value is stored as a `yyyy-MM-dd` string.

- **Source:** [src/components/ui/forms/hook-form/InputDate.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputDate.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/articles/form/sections/LicensingAccessSection.tsx`, `src/components/projects/form/steps/ProjectIdentitySection.tsx`, `src/components/events/NewEventDialog.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `TextFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | — | Label text. |
| `placeholder` | `string` | `"Choose a date"` | Shown when the field is empty. |
| `dateFormat` | `string` | `"dd-MM-yyyy"` | `date-fns` display format. |
| `startMonth` / `endMonth` | `Date` | — | Range of the calendar's month dropdown. |
| `disabled` | `(date: Date) => boolean` | — | Predicate for days that cannot be picked. This is not a boolean. |
| `allowClear` | `boolean` | `false` | Shows a "Clear" link that sets the field to `null`. |
| `srOnlyLabel` | `boolean` | `false` | Visually hides the label. |
| `className` | `string` | `""` | Classes on the trigger button. |

Plus the shared props.

Notable behaviour: the stored value is parsed with `parseISO`. The calendar starts weeks on Monday, hides days outside the month, uses dropdown captions, and closes once a date is picked.

```tsx
<InputDate
  allowClear
  label="Embargo Ending Date"
  name="embargo_end_date"
  placeholder="Pick a date"
  startMonth={new Date()}
  endMonth={monthFromNow(2)}
/>
```

### InputSelect

A single-value shadcn `Select` bound to a field.

- **Source:** [src/components/ui/forms/hook-form/InputSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputSelect.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/articles/form/sections/LicensingAccessSection.tsx`, `src/components/projects/form/steps/ProjectTypeSection.tsx`, `src/components/organizations/members/InviteMemberModal.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `Path<TFormValues>` | — | Field path. |
| `label` | `string` | — | Label text. |
| `options` | `SelectOption[]` | — | `{ value, label?, description?, disabled? }`. The item text falls back to `value`. |
| `placeholder` | `string` | `"Select an option"` | Trigger placeholder. |
| `allowClear` | `boolean` | `false` | Shows an X button that sets the field to `null` (and every `updates` target to `null`). |
| `updates` | `FieldUpdate[]` | — | On change, each target is set to `map(value)`. |
| `disabled` | `boolean` | `false` | Disables the select. |
| `className` | `string` | `""` | Classes on the trigger. |

Plus the shared props.

Notable behaviour: the selected option's `description` replaces the `description` prop. Errors on the field are cleared as soon as a value is picked.

```tsx
<InputSelect
  label="License Type"
  name="license_type_id"
  options={licenseTypeOptions}
  updates={[
    { name: "license_type", map: (id) => licenseTypes.find((t) => t.id === id) },
  ]}
/>
```

### InputInlineSelect

A compact select meant to sit inside another input, for example as `InputText`'s `suffixSlot`. Options map display keys to field values.

- **Source:** [src/components/ui/forms/hook-form/InputInlineSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputInlineSelect.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/ContactSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `Path<TFormValues>` | — | Field path. |
| `options` | `Record<string, PathValue>` | — | `{ key: fieldValue }`, for example `{ public: true, private: false }`. Keys are shown in title case. |
| `className` | `string` | — | Classes on the trigger. |

Notable behaviour:

- Renders nothing when `options` is empty.
- Shows the first key when the field value matches no option.
- The width is fixed to the longest label, so the control never resizes.

```tsx
<InputText
  name="contact_email"
  className="pr-28"
  suffixSlot={
    <InputInlineSelect
      name="contact_is_public"
      options={{ public: true, private: false }}
    />
  }
/>
```

### InputMultiSelect

Binds the `MultiSelect` dropdown from `ui/inputs` to a `string[]` field. Selected values appear as removable badges below it.

- **Source:** [src/components/ui/forms/hook-form/InputMultiSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputMultiSelect.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/CategoriesSection.tsx`, `src/components/projects/ProjectsFilterDialog.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `StringArrayFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | — | Label text. |
| `options` | `MultiSelectOption[]` | — | Options. The type is re-exported from this file. |
| `placeholder` | `string` | `"Select options..."` | Dropdown placeholder. |
| `emptyMessage` | `string` | — | Shown when no option matches. |
| `containerClassName` | `string` | — | Classes on the outer wrapper. |

Plus `description`, `labelProps`, `messageProps` and `descriptionProps`. The `disabled` prop is ignored: disabled state comes only from the form's `formState.disabled`. `className` is not read.

```tsx
<InputMultiSelect
  label="Categories & Subcategories"
  name="subcategories"
  options={categoryOptions}
  placeholder="Select categories..."
  emptyMessage="No categories found."
/>
```

### InputGridSelect

A responsive grid of toggle cards for a `string[]` field. Selections show as removable badges with a "Clear all" link.

- **Source:** [src/components/ui/forms/hook-form/InputGridSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputGridSelect.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** no JSX call sites (mentioned in comments in `src/utils/form/data.ts`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `StringArrayFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | — | Label text. |
| `options` | `{ value; label; description? }[]` | — | Cards. The description is clamped to two lines. |
| `disabled` | `boolean` | — | Disables the option cards. |

Plus `description`, `labelProps`, `messageProps` and `descriptionProps`. `className` and `containerClassName` are not read.

Notable behaviour: this is always multi-select. Each card is a button with `aria-pressed`.

### InputRadioGroup

A radio group styled as pill buttons. The checked pill uses the primary fill.

- **Source:** [src/components/ui/forms/hook-form/InputRadioGroup.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputRadioGroup.tsx)
- **Kind:** No `"use client"` directive (uses RHF context)
- **Used in:** no call sites outside the barrel

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `TextFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | — | Group label. |
| `options` | `RadioGroupOption[]` | — | `{ value, label }`. |
| `disabled` | `boolean` | — | Disables the group. |

Plus the shared props. `className` is in the type but not read.

### InputRadioTiles

A radio group rendered as icon tiles. Each option can be disabled, carry a corner badge, and take its own classes.

- **Source:** [src/components/ui/forms/hook-form/InputRadioTiles.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputRadioTiles.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/ConfigurationSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `TextFieldPath<TFormValues>` | — | Field path. |
| `label` | `string` | — | Group label. |
| `options` | `RadioTileOption[]` | — | `{ value, label, icon: LucideIcon, disabled?, badge?, className? }`. |
| `disabled` | `boolean` | — | Disables every tile. |
| `updates` | `FieldUpdate[]` | — | On change, each target is set to `map(value)`, always with `shouldDirty: true`. |

Plus the shared props.

Notable behaviour: tiles sit in a two-column grid on mobile and wrap in a flex row from `sm` up.

```tsx
<InputRadioTiles
  name="organizationConnectMode"
  label="Connect Organisation"
  options={connectionModeOptions}
  updates={[{ name: "linked_organization_id", map: () => null }]}
/>
```

### InputTags

A free-text tag input. Committed tags show as removable badges.

- **Source:** [src/components/ui/forms/hook-form/InputTags.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputTags.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/CategoriesSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `TextFieldPath<TFormValues>` | — | Field path. Holds a comma-separated string. |
| `label` | `string` | — | Label text. Also the input's `aria-label`. |
| `maxTags` | `number` | `5` | The input is disabled once this many tags exist. |
| `maxTagLength` | `number` | `100` | Longer tags are dropped. |
| `placeholder` | `string` | `"Add tags"` | Hidden once the limit is reached. |
| `updates` | `FieldUpdate[]` | — | Accepted but not read. |
| `className` | `string` | `""` | Classes on the text input. |

Plus the shared props and all `<input>` props except `name`, `value` and `defaultValue`.

Notable behaviour:

- Enter or `,` commits the pending text, and blur commits it too.
- Pasting text that contains commas adds each part.
- Duplicates are ignored.
- While you type, a `CharacterCount` against `maxTagLength` is shown.
- The value is a comma-separated string, so a tag containing a comma will split on read-back.

```tsx
<InputTags
  label="Tags / Keywords"
  name="tags"
  maxTags={PROJECT_FIELD_LIMITS.tags}
  maxTagLength={PROJECT_FIELD_LIMITS.tagLength}
  description="Minimum recommended: 3 tags. Press Enter to add."
/>
```

### InputSearchSelect

An async search-as-you-type single select built on `Command`. Once an item is chosen it shows as a pill with a clear button.

- **Source:** [src/components/ui/forms/hook-form/InputSearchSelect.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputSearchSelect.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/organizations/members/InviteMemberModal.tsx`, `src/components/ui/forms/hook-form/InputSearchLocation.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `Path<TFormValues>` | — | Field path. |
| `label` | `string` | — | Label text. |
| `fetchUrl` | `string` | — | Search endpoint. Called with `q`, `limit=10` and any non-null `searchParams`. It must return `{ data: SearchResult[] }`. |
| `searchParams` | `Record<string, string \| null>` | — | Extra query parameters. |
| `valueKey` | `"id" \| "title"` | `"id"` | Which property of the chosen item is written to the field. |
| `initialTitle` | `string \| null` | — | Label for a pre-existing value. A selection is pre-filled only when the field already has a value and this is set. |
| `onSelect` | `(item: SearchResult<TMeta>) => void` | — | Called after selection. |
| `onClear` | `() => void` | — | Called after clearing. |
| `onBlur` | `() => void` | — | Called when the search input blurs. |
| `allowCustomValue` | `boolean` | — | When nothing is found, offers `Use "<query>"`, which stores the query as both id and title. |
| `prefixIcon` | `ComponentType<{ className? }>` | — | Icon in the input and in the selected pill. |
| `placeholder` | `string` | `"Type to search..."` | Input placeholder. |

Plus the shared props. `className` is not read.

Notable behaviour: search starts at 3 characters and is debounced by 500 ms through `useSearchSelect`. "Nothing found" is shown when a search returns no results.

```tsx
<InputSearchSelect<InviteFormValues>
  name="user_id"
  label="Full Name"
  fetchUrl="/api/users/search"
  placeholder="Enter Name and Last name"
/>
```

### InputSearchSelectWithChip

An async search select that shows the chosen item as a card below the input (avatar, title and optional sub-label) with a remove button.

- **Source:** [src/components/ui/forms/hook-form/InputSearchSelectWithChip.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputSearchSelectWithChip.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/ConfigurationSection.tsx`, `src/components/projects/form/parts/TeamMemberCard.tsx`, `src/components/articles/form/sections/AuthorInput.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `Path<TFormValues>` | — | Field path. |
| `label` | `string` | — | Label text. |
| `fetchUrl` | `string` | — | Search endpoint (same contract as `InputSearchSelect`). |
| `searchParams` | `Record<string, string \| null>` | — | Extra query parameters. |
| `valueKey` | `"id" \| "title"` | `"id"` | Which property of the chosen item is written to the field. |
| `initialTitle` | `string \| null` | — | Title for a pre-existing value. |
| `initialAvatarUrl` | `string \| null` | — | Avatar for a pre-existing value. |
| `onSelect` | `(item: SearchResult<TMeta> \| null) => void` | — | Called on select, and with `null` on remove. |
| `subLabelKey` | `string` | — | A key in `item.meta` shown as a second line. |
| `prefixIcon` | `ComponentType<{ className? }>` | — | Input icon. Also stands in for the avatar when the item has no `meta.avatar_url`. |
| `placeholder` | `string` | `"Type to search..."` | Input placeholder. |
| `containerClassName` | `string` | — | Classes on the outer wrapper. |

Plus `description`, `labelProps`, `messageProps` and `descriptionProps`.

Notable behaviour:

- The input is disabled while an item is selected.
- Clicking or touching outside the component, or pressing Escape, clears the pending search.

```tsx
<InputSearchSelectWithChip
  name="linked_organization_id"
  label="Find Organisation to link to your Project"
  placeholder="Select organisation..."
  fetchUrl="/api/organizations/search"
  initialTitle={initialOrganizationName}
  initialAvatarUrl={initialOrganizationLogoUrl}
/>
```

### InputSearchLocation

An `InputSearchSelect` preset for location search against `/api/locations/search`.

- **Source:** [src/components/ui/forms/hook-form/InputSearchLocation.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputSearchLocation.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/ProjectIdentitySection.tsx`, `src/components/account/ProfileSettings.tsx`, `src/components/organizations/form/OrganizationSettingsForm.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `Path<TFormValues>` | — | Field path. Stores the location title. |
| `label` | `string` | `"Location"` | Label text. |
| `description` | `string` | — | Helper text. |
| `placeholder` | `string` | `"Search for a city..."` | Input placeholder. |
| `layer` | `"country" \| "city"` | `"city"` | Sent as the `layer` search parameter. |
| `onSelect` | `(item: unknown) => void` | — | Replaces the default select handler. |
| `validates` | `string[]` | — | Fields to `trigger()` on blur. |

Notable behaviour:

- Uses `valueKey="title"` and a `MapPin` icon. The current field value is used as `initialTitle`.
- By default, selecting a location writes `meta.latitude` and `meta.longitude` into the form fields named `latitude` and `longitude` (these names are hard-coded).

```tsx
<InputSearchLocation<ProjectFormValues>
  name="location"
  label="Location"
  description="If global or non-applicable, leave blank."
/>
```

### InputContent

A rich-text field: the Tiptap `Editor` from `@/components/tiptap`, driven by `useDocumentEditor`, with server autosave and image uploads. It is wired to the article content routes.

- **Source:** [src/components/ui/forms/hook-form/InputContent.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/InputContent.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/articles/form/sections/ContentSection.tsx`

Not exported from the hook-form barrel (that line is commented out); only `InputContentHandle` is. Import it from `@/components/ui/forms/hook-form/InputContent`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `Path<TFormValues>` | — | Field path. |
| `label` | `string` | `name` | Label text. |
| `objectId` | `string \| null` | — | Article id. Enables server autosave and image uploads. |
| `debounceMs` | `number` | `5000` | Autosave debounce. |
| `maxLength` / `minLength` | `number` | — | Passed to the editor. `maxLength` also turns on an always-visible `CharacterCount` of the trimmed text length. |
| `placeholder` | `string` | — | Editor placeholder. |
| `onChanged` | `(value: string \| null) => void` | — | Called on every edit. |
| `onLoaded` | `(value: unknown, text: string) => void` | — | Called once the document has loaded. |
| `onSaved` | `(value: unknown) => void` | — | Called after an autosave. |
| `onBlur` | input `onBlur` | — | Passed to the editor. |
| `ref` | `Ref<InputContentHandle>` | — | Exposes `save(objectId?)`. |

Plus the shared props.

Notable behaviour:

- The document id is read from the form's `content_file_id` field. Saves go out as `PATCH /api/articles/<objectId>/content`.
- When `objectId` is set, image uploads go to `/api/articles/<objectId>/content/image`: PNG, JPEG or WEBP, 5 MB per file, 50 MB in total, at most 10 uploads.
- `save(id)` flushes pending changes. Pass an id to save against a record created after the editor mounted. With no id available it does nothing.
- Renders the text "Loading content..." until the editor is ready.

```tsx
<InputContent
  ref={richTextRef}
  name="content"
  minLength={ARTICLE_FIELD_LIMITS.content.min}
  maxLength={ARTICLE_FIELD_LIMITS.content.max}
  onChanged={(value) =>
    form.setValue("content_text", value ?? "", { shouldDirty: true })
  }
/>
```

### ShowWhen

Conditionally renders its children based on a watched field. Hidden fields can optionally be reset and unregistered.

- **Source:** [src/components/ui/forms/hook-form/ShowWhen.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/ShowWhen.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/projects/form/steps/ConfigurationSection.tsx`, `src/components/articles/form/sections/LicensingAccessSection.tsx`, `src/components/articles/form/sections/ProvenanceSection.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `field` | `keyof T & string` | — | Field to watch. |
| `check` | `(value: unknown) => boolean` | — | Custom visibility test. When omitted, the test is the truthiness of the value. |
| `invert` | `boolean` | `false` | Inverts the truthiness test. Ignored when `check` is given. |
| `unregisterFields` | `string[]` | `[]` | When the content becomes hidden, these fields are set to `null` (dirty) and then unregistered. |
| `children` | `ReactNode` | — | Conditional content. |

```tsx
<ShowWhen field="organizationConnectMode" check={(v) => v === "connect"}>
  <InputSearchSelectWithChip name="linked_organization_id" /* … */ />
</ShowWhen>
```

### OtpInput

A row of single-digit inputs for one-time codes. It lives in `hook-form/` but is **not** bound to RHF: it keeps its own state and reports the full code through a callback.

- **Source:** [src/components/ui/forms/hook-form/OtpInput.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/OtpInput.tsx)
- **Kind:** Client component (`"use client"`)
- **Used in:** `src/components/auth/OtpVerificationPanel.tsx`, `src/components/account/ChangeEmailDialog.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `length` | `number` | `6` | Number of digits. |
| `onCompleteAction` | `(otp: string) => void` | — | Called once every box is filled. |
| `disabled` | `boolean` | `false` | Disables input. |
| `label` | `string \| false` | — | Label above the boxes. |
| `error` | `string \| string[]` | — | Shown below the boxes (`role="alert"`). Arrays are joined with spaces. |
| `className` | `string` | — | Classes on the row of boxes. |

Notable behaviour:

- Only digits are accepted.
- Focus moves forward on input, and Backspace on an empty box moves back.
- Pasting fills the boxes from the start.

```tsx
<OtpInput
  label="Verification code"
  length={6}
  onCompleteAction={onCompleteAction}
  disabled={isVerifying}
  error={error}
/>
```

### useSearchSelect

The hook behind `InputSearchSelect` and `InputSearchSelectWithChip`. It is not exported from the barrel.

- **Source:** [src/components/ui/forms/hook-form/useSearchSelect.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/hook-form/useSearchSelect.ts)

What it does:

- Takes `{ fetchUrl?, initialTitle?, initialAvatarUrl?, initialValue?, searchParams? }`.
- Returns `{ query, setQuery, results, isLoading, selected, setSelected, clearSearch, searched, setSearched }`.
- Collapses whitespace in the query.
- Once the trimmed query reaches 3 characters, it waits 500 ms and then fetches `fetchUrl` (resolved against `env.baseUrl`) with `q` and `limit=10`. Superseded requests are aborted.
- Failures other than aborts are logged through LogTape.

## Barrels

- `src/components/ui/forms/index.ts` exports `StepIndicator`, `Step`, `FormStepAccordion`, `TabMenu`, `TabItem`, `FormSidebar`, `FormSidebarSection`, `FormImageUpload`, `AvatarUpload`, `AvatarCropModal`, `DropzoneSurface`, `ImagePreviewTile`, `FormSectionCard`, `FilterSection` and `AttachmentDropzone`.
- `src/components/ui/forms/hook-form/index.ts` re-exports everything from `FieldWrapper`, `RequiredFieldsContext`, `OtpInput`, `InputText`, `InputTextarea`, `InputCheckbox`, `InputDate`, `InputBoolean`, `InputGridSelect`, `InputMultiSelect`, `InputSelect`, `InputInlineSelect`, `InputSearchSelect`, `InputSearchSelectWithChip`, `InputSearchLocation`, `InputRadioTiles`, `InputTags`, `ShowWhen`, `InputCheckboxGroup`, `InputPassword` and `InputRadioGroup`. From `InputContent` it exports only the type `InputContentHandle`. `CharacterCount`, `types.ts` and `useSearchSelect` are not re-exported.
