---
title: "Sections, Progress & Completion"
description: How the editor forms are split into numbered sections, how the sidebar decides a section is complete, and how the active section is tracked.
sidebar:
  order: 4
---

Every editor form renders all of its sections at once, as a column of [`FormSectionCard`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormSectionCard.tsx)s, with a [`FormSidebar`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/forms/FormSidebar.tsx) beside them. The sidebar is purely presentational. It takes three inputs, and each form computes them differently:

- `sections`: the list of `{ id, number, label }`
- `completedSections`: a map from section id to `true` when the section's circle should turn green
- `activeSection`: the id to highlight

Clicking a sidebar entry scrolls to the element whose DOM `id` matches. The section card's `id`, the sidebar entry's `id` and the `completedSections` key must all be the same string.

## The Sections

**Projects** ([`ProjectForm`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/projects/form/ProjectForm.tsx), `SIDEBAR_SECTIONS`): Project Type, Identity, Categories/SDGs/Tags, Configuration, Content, Team, Documents, FAQ, Contact Information, Related Content, Comments Settings. Section numbers match the Zod step files (`step1.ts` … `step11.ts`). Step 7 (Documents) has no schema because uploads go straight to storage.

**Articles** ([`ArticleFormSidebar`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/articles/form/ArticleFormSidebar.tsx), `ALL_SECTIONS`): Type & Identity, Body, Categories/SDGs/Tags, Authors, Access & Licensing, Provenance, Comments Settings, and Deletion. Deletion has `requiresArticle: true` and only appears once the article has been saved. The section ids are positional (`section-1` … `section-8`), so inserting a section means renumbering. The article step files (`step1.ts` … `step6.ts`) do **not** line up with section numbers.

**Organisations** ([`OrganizationForm`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/organizations/form/OrganizationForm.tsx)): Identity, Media, Links, matching `step1`–`step3`.

### Sections That Depend on Other Fields

The project Content section is a field array of content blocks (`sections[]`), and which blocks exist depends on the project type. [`ContentSection`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/projects/form/steps/ContentSection.tsx) has a hard-coded `SECTION_VISIBILITY` map (for example `roadmap` and `tokenomics` only for `dao-experiment`). When `project_type_id` changes it rebuilds the array with `replace()`:

- system blocks allowed for the new type are kept or added, carrying over any text already written for the same slug
- blocks no longer allowed are dropped, along with their text
- custom blocks the author added are always kept at the end

On first mount with a loaded draft it skips the rebuild so the saved order survives. Only `overview` is required (`REQUIRED_SECTIONS`).

Within articles, whole groups of fields appear or disappear with [`ShowWhen`](../field-wrappers/#conditional-fields-with-showwhen) depending on article type and access level. The section cards themselves never hide.

## Completion Ticks

A green circle means "this section has what it needs". It does not block saving or publishing, which use the draft and publish schemas instead. Each form decides completion its own way.

### Projects and Organisations: Live, Schema-Backed

`useProjectForm` and `useOrganizationForm` subscribe to every value with `useWatch` and rebuild `completedSections` on each render:

- The first few sections use their step's `…CompleteSchema.safeParse(values).success`. These schemas exist only to drive the ticks. For example `projectStep2CompleteSchema` requires a title and tagline.
- The remaining sections use inline checks in the hook. Projects: Configuration is complete when an organisation is linked, Content when the overview block has both intro and body, and Team/Documents/FAQ/Related when their arrays are non-empty. Organisations: Media is complete with a logo or cover, Links with any link.

Ticks update as you type.

### Articles: Hand-Written Rules, Only After a Save

`ArticleFormSidebar` calls `validateSection(code, getValues())` from [`useArticleValidation`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/hooks/use-article-validation.ts). That is a `switch` of hand-written rules per section code (`core_identity`, `content`, `alignment`, `authorship`, `access_license`), not Zod. Sections with no case (`provenance`, `comments`, `deletion`) always count as complete once saved.

:::caution[Article ticks lag behind the form]
The article `completedSections` is memoised on `lastSaved`, and also requires it to be set. Ticks are therefore all grey on a new article and only change after a save. They show the state as of the last save, not the current values.
:::

The rules in `useArticleValidation` overlap with `articlePublishSchema` but aren't the same. Both check a minimum content length, each in its own way. Only the sidebar requires a linked project for Project Log articles, so that section can stay grey while publishing still succeeds. When you change an article publish requirement, check both.

## Active Section Tracking

Projects and articles track the active section differently:

| Form | How the active section is chosen |
| --- | --- |
| Projects, Organisations | Document-level `focusin` and `pointerdown` listeners. The target's `closest()` section id becomes active. Clicks inside Radix portals (dropdowns, popovers) don't match any section, so the highlight stays put. Scrolling alone doesn't change it. |
| Articles | An `IntersectionObserver` with a `-20%` top and bottom root margin picks the section with the highest visible ratio. A scroll listener forces the last section active at the bottom of the page. |

Clicking a sidebar entry sets the active section immediately, then smooth-scrolls. The article version subtracts a 72px offset for the top bar. The others rely on the card's `scroll-mt-20`.

## Required Badges vs Required Markers

These look related but are wired separately:

- **The section "Required" badge** is the `required` prop on `FormSectionCard`. It's a static flag set in JSX.
- **The field-level required marker** on a label comes from [`RequiredFieldsProvider`](../field-wrappers/#required-field-markers). Projects pass `Object.keys(REQUIRED_FIELD_MESSAGES)` and organisations pass `ORG_REQUIRED_FIELDS`.

Neither reads the Zod schema. If a field becomes required in the schema, update the provider's list and, if needed, the section badge.

## Failure Modes & Edge Cases

- **Mismatched ids.** A section whose card `id` doesn't match its sidebar entry can't be scrolled to. A section missing from `completedSections` never turns green. Nothing warns about either.
- **Changing project type deletes content.** Text in a block that the new type doesn't allow is dropped from form state immediately. It only reaches the database if the author saves.
- **Article ticks after a failed save.** `lastSaved` only moves on success, so ticks keep showing the previous good save.
- **No mobile progress.** `FormSidebar` is `hidden lg:block`.

## Extension Points

- **New section:** add the `FormSectionCard` with a stable `id`, the sidebar entry, and a `completedSections` rule. For projects and organisations, prefer a `…CompleteSchema` in the step file over another inline check.
- **New project content block type:** add a row to `project_section_types`. If it should only appear for some project types, add it to `SECTION_VISIBILITY`.
- **Sharing tracking logic:** the three active-section implementations are a good candidate for a single hook. If you write one, migrate all three forms rather than adding a fourth variant.

## Related Links

- [Form Architecture](../form-architecture/)
- [Zod Schemas](../zod-schemas/): the step `Complete` schemas
- [Forms components catalogue](../../components/ui/forms/): `FormSidebar` and `FormSectionCard` props
