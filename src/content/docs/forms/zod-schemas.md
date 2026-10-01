---
title: "Zod Schemas"
description: How validation schemas are organised under src/zod, the global error-message hook, the step-file quartet, and the draft/publish split shared by forms and API routes.
sidebar:
  order: 3
---

Every validation contract lives under [`src/zod/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod), with one folder per domain (projects, articles, organisations, auth, comments, posts, profile, events). The same schema validates the form on the client (through `zodResolver`) and the request body in the API route, so limits and messages are declared once. How the forms use these schemas is covered in [Drafts, Saving & Publishing](../saving-and-publishing/) and [Sections, Progress & Completion](../sections-and-progress/).

## Overview

- **Import `z` from `@/zod/z`**, not from `zod`. That module registers the global error-message hook.
- **Large forms are split into step files and recombined** into a lenient draft schema (saving early) and a strict publish schema (final submission).
- **Shared field builders** live in [`validators.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod/validators.ts): `urlField`, `requiredUrlField`, `emailField`, `uuidField`, `orcidField`, `yearField`, `noSpacesField`, `jsonArrayField` and the `applyDateValidations` / `applyRequiredValidations` wrappers. String hardening (`safeString`, the tag refiner, malicious-content and profanity checks) lives in [`strings.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod/strings.ts).

## The Global Error Hook

[`src/zod/z.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod/z.ts) calls `z.config({ customError })` once at module load. It rewrites three issue types into readable copy built from the field's leaf key:

| Issue | Message |
| --- | --- |
| Missing or `null` value | "Please enter a/an {label}" |
| String too long | "{Label} cannot exceed N characters" |
| String too short | "{Label} must be at least N characters" |

Everything else (formats, enums, number or array sizes, custom refinements) keeps Zod's default or the schema's own message. Labels come from `toLabel` on the key, so the key name shapes the copy.

`z.config` mutates global Zod state. Once `z.ts` has been evaluated, the hook applies to every schema, including ones that import `zod` directly. The only risk is a bundle where `z.ts` is never imported, which is why every schema file imports the local `z`.

## Step Files

The large forms split their schema into one file per form section, then recombine them. The pieces are easy to mix up, so here is what each export is for.

### The Project Quartet

Each [`src/zod/projects/stepN.ts`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod/projects) exports four schemas:

| Export | What it is | Used by |
| --- | --- | --- |
| `projectStepNSchemaObject` | The bare `z.object` with field rules, no cross-field refinements | `draft.ts` and `publish.ts`, which `.extend()` all of them together |
| `projectStepNSchema` | `.partial()` of the object | nothing in the forms today |
| `projectStepNCompleteSchema` | The object plus a `superRefine` saying when the section counts as done | `useProjectForm` completion ticks, for steps 1–3 only |
| `projectStepNPublishSchema` | The object plus that step's publish requirements | nothing outside `src/zod`. `publish.ts` re-declares the requirements itself. |

[`draft.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod/projects/draft.ts) and [`publish.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod/projects/publish.ts) both build one **flat** object by chaining `.extend(stepN.shape)`. The draft makes it `.partial()` and requires only title and tagline. The publish keeps the shape and adds a `superRefine` for type, title, tagline, subcategories and tags. Both apply `applyDateValidations`. The flat shape is deliberate: `.and()` intersections would make field access in the API routes awkward to type.

:::caution[Publish requirements live in two places]
A step's `…PublishSchema` and the `superRefine` in `publish.ts` state the same rules separately. Only `publish.ts` is enforced. If you change a publish requirement, change `publish.ts`. Update the step file too, or it becomes misleading.
:::

Step numbers match project form section numbers. Step 7 (documents) has no file, because uploads bypass the form. Step 11 (comments) is still composed into both schemas although the comments section is detached ("TODO: rewire after phase 0").

### Articles

[`src/zod/articles/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod/articles) has `step1`–`step6`, each exporting a `SchemaObject` and a `PublishSchema` (step 6 also has a `CompleteSchema`, unused). The article step numbers **don't** match the form's section numbers.

- `articleDraftSchema` (`draft.ts`): flat `.extend()` of the six objects, `.partial()`, with title and type required, plus `refineContentText`.
- `articlePublishSchema` (`publish.ts`): the six step `PublishSchema`s joined with **`.and()`**, unlike projects. Here the step publish schemas *are* the enforced rules.
- `combined.ts`: `articleCombinedSchema`, the `isResearchOrIP`/`isVolunteeringOrField` helpers used by `ShowWhen`, and `articleTextFieldsSchema` for the extra text-field check on submit.

### Organisations

`step1`–`step3` plus an aggregate `schema.ts` (`organizationSchema`, used as both resolver and create check). `settings.ts` and `members.ts` cover the settings form and membership mutations. Only `organizationStep1CompleteSchema` drives a completion tick.

### Everything Else

Auth, comments, posts and profile each have a single module. `newEventSchema` is only used by the unmounted `NewEventDialog`. Events are on the roadmap and not built.

Some fields belong to features that aren't built yet. The project funding and donation fields back toggles that render disabled ("Coming soon"); project funding is planned. The article indigenous-knowledge fields exist, but the Indigenous Knowledge Hub is planned. `token_gated` is a valid access level in the schema, but token-gating is planned and not wired in the UI.

## Failure Modes & Edge Cases

- **`z.coerce.boolean()` parses the string `"false"` as `true`.** It's used for several article licence flags in `combined.ts`, so pass real booleans.
- **Project SDGs are not required**, even though the step 3 doc comment suggests they are.
- **The article draft's date validation is inert.** `applyDateValidations` checks `start_date`/`end_date`, which articles don't have.
- **Two different tag limits:** article step 2 uses the tag refiner's defaults, while `combined.ts` passes `ARTICLE_FIELD_LIMITS`. Check which one a form actually uses before changing limits.
- **Don't use `safeString` for long-form or geographic text.** Its malicious-content and start-character checks reject legitimate prose.
- **`parent_comment_id` is derived by a trigger.** The client sends only the comment being answered.

## Extension Points

- **New domain:** add `src/zod/<domain>/`, import `z` from `@/zod/z`, and re-export it from the root barrel.
- **New multi-section form:** follow the projects layout (flat `.extend()` of step objects into draft and publish schemas). Only add `Complete` schemas for sections whose tick should come from the schema.
- **Custom copy for formats or refinements:** pass a `message` on the rule. The global hook doesn't cover those issues.

## Related Links

- [`src/zod/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod)
- [Field Wrappers & Conditional Fields](../field-wrappers/)
- [Drafts, Saving & Publishing](../saving-and-publishing/)
- [API Route Structure & Conventions](../../api-layer/api-routes/): server-side `safeParse` and error shaping
- [Environment & Configuration Constants](../../config-and-utils/config-constants/): `ARTICLE_FIELD_LIMITS` and related constants
