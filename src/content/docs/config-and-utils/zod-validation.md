---
title: "Zod Schemas & Form Validation"
description: How validation schemas are organised under src/zod, the global error-message hook, and the draft/publish split shared by forms and API routes.
sidebar:
  order: 2
---

Every validation contract lives under [`src/zod/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod), with one folder per domain (projects, articles, organizations, auth, comments, posts, profile, events). The same schema validates the form on the client (through `zodResolver`) and the request body in the API route, so limits and messages are declared once. Form wiring is covered in [Forms, Hooks & Validation Patterns](../../design-system/forms-and-validation/).

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

## Domain Schemas

- **Projects:** one file per form step (`step1`–`step11`). Steps follow a naming quartet (`…SchemaObject`, `…Schema`, `…CompleteSchema`, `…PublishSchema`) and are recombined into `projectDraftSchema` and `projectPublishSchema`. Step 7 (documents) has no schema, because uploads are handled outside the form. Step 11 (comments) exports are kept but detached from the form.
- **Articles:** step fragments plus `combined.ts`, recombined into `articleDraftSchema` (title and type required) and `articlePublishSchema`. The article form is a single page, and the "steps" are just schema fragments.
- **Organizations:** `step1`–`step3`, an aggregate `schema.ts`, plus `settings.ts` and `members.ts` for the settings and membership mutations.
- **Auth, comments, posts, profile:** a single module each.
- **Events:** `newEventSchema` is used only by the unmounted `NewEventDialog`. Events are on the roadmap and not built.

Some fields belong to features that aren't built yet. The project funding and donation fields back toggles that render disabled ("Coming soon"); project funding is planned. The article indigenous-knowledge fields exist, but the Indigenous Knowledge Hub is planned.

## Failure Modes & Edge Cases

- **`z.coerce.boolean()` parses the string `"false"` as `true`.** It's used for several article licence flags in `combined.ts`, so pass real booleans.
- **Project SDGs are not required**, even though the step 3 doc comment suggests they are.
- **The article draft's date validation is inert.** `applyDateValidations` checks `start_date`/`end_date`, which articles don't have.
- **Two different tag limits:** article step 2 uses the tag refiner's defaults, while `combined.ts` passes `ARTICLE_FIELD_LIMITS`. Check which one a form actually uses before changing limits.
- **Don't use `safeString` for long-form or geographic text.** Its malicious-content and start-character checks reject legitimate prose.
- **`parent_comment_id` is derived by a trigger.** The client sends only the comment being answered.

## Extension Points

- **New domain:** add `src/zod/<domain>/`, import `z` from `@/zod/z`, and re-export it from the root barrel.
- **New multi-step form:** follow the projects quartet so draft saves and publish gating stay separate.
- **Custom copy for formats or refinements:** pass a `message` on the rule. The global hook doesn't cover those issues.

## Related Links

- [`src/zod/`](https://github.com/ozeaon/ozeaon-v2/tree/0a4f1a95824db87782f1221a4108019d174df3d9/src/zod)
- [Forms, Hooks & Validation Patterns](../../design-system/forms-and-validation/)
- [API Route Structure & Conventions](../../api-layer/api-routes/): server-side `safeParse` and error shaping
- [Environment & Configuration Constants](../config-constants/): `ARTICLE_FIELD_LIMITS` and related constants
