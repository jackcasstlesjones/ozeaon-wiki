---
title: "Environment & Configuration Constants"
sidebar:
  order: 1
---

Centralized, type-safe access to environment variables and shared layout constants for the ozeaon-v2 Next.js application. This page documents `src/config/env.ts` — the single module every other layer reads runtime configuration from — and the closely related constant modules that encode build-time and layout invariants.

## Purpose and Scope

This page covers:

- `src/config/env.ts` — the environment-variable aggregation module, its static-reference pattern, its fail-fast validation, and the exact shape of the exported `env` object.
- The rationale for the `NEXT_PUBLIC_` naming split between browser-visible and server-only secrets.
- `src/components/ui/layout/constants.ts` — shared layout/measurement constants that act as compile-time configuration for the reader and feed grids.
- How the `env` module is consumed downstream (Supabase clients, middleware, cookie security flags).

Intentionally **left to sibling pages**:

- **Logging configuration** (`src/lib/logger/config.ts`, `clientLoggingConfig`, `src/instrumentation.ts`, `src/instrumentation-client.ts`) — the LogTape setup pipeline is a separate concern; only its relationship to configuration loading is referenced here.
- **Build and deployment configuration** (`next.config.ts`, `open-next.config.ts`) — Next.js/OpenNext build wiring and headers/CSP derivation belong to the build & deployment page.
- **Supabase client construction and auth flows** — only the configuration inputs they consume are described here.

## Overview

Next.js applications traditionally scatter `process.env.X` reads across server actions, route handlers, and components. That approach is hard to audit: nothing tells you whether a variable is required, what its fallback is, or whether it is safe to read from the browser.

The ozeaon-v2 repository resolves this by funneling **every** environment read through one module, `src/config/env.ts`. The module is deliberately simple and its design encodes three separate invariants:

1. **Static reference for inlining.** Next.js performs dead-code elimination and text substitution on `process.env.NEXT_PUBLIC_*` only when the reference is statically analyzable. Destructuring `process.env` or using computed keys (`process.env[name]`) breaks that substitution. The module therefore hoists each variable into a module-level `const` with a literal, dotted access path.
2. **Fail-fast on required values.** Variables with no sane default below which the app cannot function (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) throw at module-evaluation time rather than producing confusing downstream runtime failures.
3. **Explicit optionality.** Every non-required variable is coerced with a fallback (`|| ""`, or a concrete default), so the exported object has a stable, non-`undefined` shape that callers can use without null checks.

Key terminology used below:

| Term | Meaning in this codebase |
| --- | --- |
| `NEXT_PUBLIC_` prefix | Variable is substituted into the browser bundle at build time; treat as public. |
| Server-only variable | Variable without the prefix; must only be read in server runtime paths. |
| Fail-fast guard | Top-level `if (!X) throw` executed at import time. |
| Static reference | Module-level `const X = process.env.X` that preserves Next.js inlining. |

## Architecture

The configuration layer sits beneath every runtime layer. Both server-only and browser paths import the same module, but only the `NEXT_PUBLIC_`-derived fields survive into the client bundle.

```mermaid
flowchart TD
    subgraph sg_Source["Process Environment (.env / runtime)"]
        Pub["NEXT_PUBLIC_* variables"]
        Secret["Server-only secrets"]
    end

    subgraph sg_Config["src/config/env.ts"]
        Statics["Module-level const<br/>static process.env references"]
        Guards{"Required value present?"}
        EnvObj["export const env"]
        Statics --> Guards
        Guards -->|"No"| Throw["throw new Error<br/>Missing required environment variable"]
        Guards -->|"Yes"| EnvObj
    end

    subgraph sg_Consumers["Consumers"]
        SBPublic["lib/supabase/public.ts"]
        SBAdmin["lib/supabase/admin.ts"]
        SBMw["lib/supabase/middleware.ts"]
        Cookie["utils/data/active-account.ts"]
    end

    Pub --> Statics
    Secret --> Statics
    EnvObj --> SBPublic
    EnvObj --> SBAdmin
    EnvObj --> SBMw
    Cookie -.->|"reads NODE_ENV directly"| EnvObj
```

The diagram shows the two-input boundary (public vs. secret variables), the guard stage, and the four known consumers. `src/lib/supabase/admin.ts`, `src/lib/supabase/middleware.ts`, and `src/lib/supabase/public.ts` all read `process.env` values for URL and key directly, while `src/utils/data/active-account.ts` reads `NODE_ENV` directly for cookie security — both patterns coexist with the centralized `env` object, which is worth noting as a consistency caveat.

> Source: [env.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts)

## Main Content

### The Static Reference Block and Why It Exists

The module opens with a single comment stating the design contract, then hoists twelve variables into module-scope constants.

```typescript
// Env access with static references so Next.js can inline the NEXT_PUBLIC_ values at build time.
// Server secrets live here too - they stay server-only because nothing without a NEXT_PUBLIC_
// prefix is exposed to the browser bundle. Never read one of them from a client component.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FEATURE_NOTIFICATIONS = process.env.NEXT_PUBLIC_FEATURE_NOTIFICATIONS;
```

> Source: [env.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts#L1-L16)

Design intent: `process.env.NEXT_PUBLIC_SUPABASE_URL` written as a literal dotted member expression is the only form the Next.js compiler can statically replace with a string literal in the browser bundle. Writing `const { NEXT_PUBLIC_SUPABASE_URL } = process.env;` would compile but silently produce `undefined` in client code — a class of bug that is very hard to diagnose. Hoisting into `const`s also gives every downstream reference a single source of truth and one place to change.

### Fail-Fast Validation of Required Variables

Only two variables are treated as hard requirements, guarded immediately after the hoist block:

```typescript
if (!SUPABASE_URL) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL",
  );
}
if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  );
}
```

> Source: [env.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts#L18-L27)

These two are required because Supabase is the data and authentication backbone: without a URL and publishable key, no client can be constructed and essentially no page can render. Throwing at module-evaluation time converts a silent misconfiguration into an immediate, named failure — the error message contains the exact variable name, so the fix is unambiguous.

Note that this guard runs wherever the module is first imported. Because the checks reference `SUPABASE_URL` (already narrowed to `string` by the `if (!...) throw`), the subsequent object literal can assign `url: SUPABASE_URL` without a non-null assertion or type cast.

### The Exported `env` Object: Grouping and Fallbacks

```typescript
export const env = {
  supabase: {
    url: SUPABASE_URL,
    pubKey: SUPABASE_PUBLISHABLE_KEY,
  },
  resend: {
    apiKey: RESEND_API_KEY || "",
    email: RESEND_SENDER_EMAIL || "",
  },
  mailchimp: {
    apiKey: MAILCHIMP_API_KEY || "",
    audienceId: MAILCHIMP_AUDIENCE_ID || "",
  },
  openai: {
    apiKey: OPENAI_API_KEY || "",
  },
  google: {
    clientId: GOOGLE_CLIENT_ID || "",
  },
  features: {
    // Short-lived release toggle, removed with the last notifications ticket.
    // Optional and off when absent, so builds that never set it still pass.
    notifications: FEATURE_NOTIFICATIONS === "true",
  },
  accessToken: ACCESS_TOKEN || "",
  baseUrl: BASE_URL || "http://localhost:3000",
  storageUrl: STORAGE_URL,
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};
```

> Source: [env.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts#L29-L58)

The object is organized into two tiers:

**Vendor-namespaced groups** (`supabase`, `resend`, `mailchimp`, `openai`, `google`) mirror the third-party integrations. This makes call sites read naturally (`env.resend.apiKey`) and groups credentials that routinely change together.

**Flat application-level fields** (`accessToken`, `baseUrl`, `storageUrl`, `features`, `isDevelopment`, `isProduction`) cover concerns that are not tied to a vendor.

Fallback policy is deliberate and worth internalizing when adding new variables:

| Pattern | Applied to | Consequence |
| --- | --- | --- |
| Hard guard (`throw`) | `supabase.url`, `supabase.pubKey` | App refuses to start without it. |
| `\|\| ""` empty-string fallback | `resend.*`, `mailchimp.*`, `openai.apiKey`, `google.clientId`, `accessToken` | Shape is always `string`; feature degrades when unset. |
| Explicit literal default | `baseUrl` → `"http://localhost:3000"` | Local development works with zero configuration. |
| Strict `=== "true"` comparison | `features.notifications` | Anything other than the exact string `"true"` (including unset) is `false`. |
| Derived boolean | `isDevelopment`, `isProduction` | Read from `NODE_ENV`; both can be `false` (e.g. in test). |

The `features.notifications` comment records a decision that is easy to lose track of: it is an intentionally **short-lived release toggle** that should be deleted along with the last notifications ticket. Its `=== "true"` comparison means the toggle is off by default, so CI builds that never define `NEXT_PUBLIC_FEATURE_NOTIFICATIONS` still succeed.

`storageUrl` is the one exported field with **no** fallback — it is assigned the raw `STORAGE_URL` value, so its type is `string | undefined`. Consumers must handle the absent case themselves. This is a deliberate inconsistency worth flagging for anyone adding typed access to it.

### Section-by-Section Field Reference

| Path | Source variable | Fallback | Notes |
| --- | --- | --- | --- |
| `env.supabase.url` | `NEXT_PUBLIC_SUPABASE_URL` | required (throws) | Browser-visible Supabase project URL. |
| `env.supabase.pubKey` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | required (throws) | Publishable (anon) key; safe in the browser. |
| `env.resend.apiKey` | `RESEND_API_KEY` | `""` | Server-only email provider credential. |
| `env.resend.email` | `RESEND_SENDER_EMAIL` | `""` | From-address for outgoing mail. |
| `env.mailchimp.apiKey` | `MAILCHIMP_API_KEY` | `""` | Server-only marketing credential. |
| `env.mailchimp.audienceId` | `MAILCHIMP_AUDIENCE_ID` | `""` | Target list/audience identifier. |
| `env.openai.apiKey` | `OPENAI_API_KEY` | `""` | Server-only AI provider credential. |
| `env.google.clientId` | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `""` | Public OAuth client id for Google sign-in. |
| `env.features.notifications` | `NEXT_PUBLIC_FEATURE_NOTIFICATIONS` | `"true"` → `false` | Release toggle, off unless explicitly `"true"`. |
| `env.accessToken` | `ACCESS_TOKEN` | `""` | Server-only internal/session token. |
| `env.baseUrl` | `NEXT_PUBLIC_BASE_URL` | `"http://localhost:3000"` | Canonical origin; used for absolute links. |
| `env.storageUrl` | `NEXT_PUBLIC_STORAGE_URL` | none (`string \| undefined`) | Asset/object storage origin. |
| `env.isDevelopment` | `NODE_ENV` | derived | `true` only when `NODE_ENV === "development"`. |
| `env.isProduction` | `NODE_ENV` | derived | `true` only when `NODE_ENV === "production"`. |

### Layout Constants: Compile-Time Design Tokens

`src/components/ui/layout/constants.ts` holds the layout invariants shared by the reader and feed grids. These are Tailwind class fragments exported as constants so that multiple components cannot drift apart.

```typescript
/** Reading-measure cap for the content column, shared by the reader and feed grids. */
export const CONTENT_MAX_WIDTH_CLASS = "max-w-[1048px]";

/**
 * Horizontal gutter between the 232px nav rail (and the reader's 232px entity
 * rail, where present) and the content column. Measured rail-box to
 * content-box; each rail supplies its own 24px inner padding on top.
 */
export const CONTENT_GUTTER_CLASS = "px-4 md:px-11";

/**
 * Sticky offset for side rails: below the 3.5rem topbar, capped so the rail
 * never runs under the 3.5rem footer. `ASIDE` pairs with `h-fit` content that
 * scrolls only when it overflows; `NAV` claims the full remaining height.
 */
export const STICKY_ASIDE_CLASS =
  "sticky top-14 z-10 max-h-[calc(100svh-7rem)]";
export const STICKY_NAV_CLASS = "sticky top-14 z-10 h-[calc(100svh-7rem)]";
```

> Source: [constants.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/constants.ts#L1-L18)

These constants document real geometry constraints that are otherwise invisible:

- **`CONTENT_MAX_WIDTH_CLASS`** (`max-w-[1048px]`) is the reading-measure cap. Because the feed grid uses the same constant, a feed card and a reader paragraph always align to the same column — a shared-constant guarantee rather than a duplicated magic number.
- **`CONTENT_GUTTER_CLASS`** (`px-4 md:px-11`) encodes a two-breakpoint gutter (mobile vs. the 232px rail layout at `md` and above) and the measured relationship to the 232px nav rail and 232px entity rail.
- **`STICKY_ASIDE_CLASS`** vs. **`STICKY_NAV_CLASS`** differ only in their height rule: `max-h-…` for `h-fit` content that scrolls only on overflow (sidebars), versus `h-…` for a rail that claims the full remaining height (navigation). Both share `top-14` (below the `3.5rem` topbar) and the `calc(100svh - 7rem)` cap that reserves `3.5rem` for the footer, and both pin `z-10`.

Using `svh` (small viewport height) instead of `vh` keeps the rail correctly sized on mobile browsers where the dynamic toolbar changes the viewport height.

## Core Flow

The following sequence shows what happens the first time any module imports `src/config/env.ts` — in practice, this occurs very early because the Supabase clients and middleware depend on it.

```mermaid
sequenceDiagram
    participant Boot as "Module graph entry"
    participant Env as "src/config/env.ts"
    participant Next as "Next.js bundler"
    participant Consumer as "lib/supabase/public.ts"

    Boot->>Env: import { env }
    activate Env
    Env->>Next: static process.env references
    Next-->>Env: inlined NEXT_PUBLIC_* literals (client) / runtime values (server)
    Env->>Env: hoist 12 module-level consts
    Env->>Env: guard NEXT_PUBLIC_SUPABASE_URL
    alt required value missing
        Env-->>Boot: throw Error("Missing required environment variable: ...")
    else both required values present
        Env->>Env: build env object with group fallbacks
        Env-->>Consumer: env (frozen shape)
    end
    deactivate Env
    Consumer->>Consumer: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!)
```

The critical property is that validation happens **once**, at first import, and the resulting object is referentially stable for the lifetime of the process. There is no re-reading of `process.env` and therefore no possibility of a value changing between requests.

## Usage Examples

### Consuming the `env` Object

The exported object is the intended entry point for configuration:

```typescript
import { env } from "@/config/env";

// Browser-safe values (NEXT_PUBLIC_ derived)
const supabaseUrl = env.supabase.url;
const supabaseKey = env.supabase.pubKey;

// Server-only values — must not be reached from a client component
const resendKey = env.resend.apiKey;
const openaiKey = env.openai.apiKey;

// Derived environment flags
if (env.isProduction) {
  // production-only behaviour
}
```

> Source: [env.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts#L29-L58)

### Feature Toggle Guard

The boolean coercion makes the toggle safe to use directly in conditionals without string comparison at the call site:

```typescript
features: {
  // Short-lived release toggle, removed with the last notifications ticket.
  // Optional and off when absent, so builds that never set it still pass.
  notifications: FEATURE_NOTIFICATIONS === "true",
},
```

> Source: [env.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts#L48-L52)

### Direct `process.env` Reads (Coexisting Pattern)

Several modules bypass the `env` object and read `process.env` directly. These are the actual call sites a maintainer must keep in sync when renaming variables:

```typescript
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
```

> Source: [admin.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/admin.ts#L5-L7)

```typescript
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
```

> Source: [middleware.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/middleware.ts#L11-L13)

```typescript
  return createClient<Database, "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
```

> Source: [public.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/public.ts#L7-L9)

Note that `SUPABASE_SERVICE_ROLE_KEY` is read **only** here and is never surfaced through `env`. That is a meaningful access-control decision: the service-role key bypasses row-level security, so deliberately excluding it from the shared object reduces the chance it is accidentally imported into a bundle. The `!` non-null assertions mean a missing service-role key fails at the Supabase call rather than at import time — the opposite trade-off from the `env.ts` guard strategy.

### Environment-Dependent Cookie Flags

`NODE_ENV` is also read directly where cookie security depends on it:

```typescript
    secure: process.env.NODE_ENV === "production",
```

> Source: [active-account.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/data/active-account.ts#L31)

This mirrors `env.isProduction` but does not use it. Functionally equivalent and correct, but a consistency note for future refactoring.

## Configuration Options

### Required (build/runtime will throw if absent)

| Variable | Scope | Consumed as | Failure behaviour |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | `env.supabase.url` | `throw` at import of `src/config/env.ts` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | `env.supabase.pubKey` | `throw` at import of `src/config/env.ts` |

### Optional (safe to omit; degrade gracefully)

| Variable | Scope | Default | Used by |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Public | `""` | Google OAuth sign-in |
| `NEXT_PUBLIC_BASE_URL` | Public | `"http://localhost:3000"` | Absolute URL construction |
| `NEXT_PUBLIC_STORAGE_URL` | Public | `undefined` | Asset/object storage origin |
| `NEXT_PUBLIC_FEATURE_NOTIFICATIONS` | Public | `false` (unless `"true"`) | Notifications release toggle |
| `RESEND_API_KEY` | Server-only | `""` | Transactional email |
| `RESEND_SENDER_EMAIL` | Server-only | `""` | Email from-address |
| `MAILCHIMP_API_KEY` | Server-only | `""` | Marketing/audience sync |
| `MAILCHIMP_AUDIENCE_ID` | Server-only | `""` | Marketing audience target |
| `OPENAI_API_KEY` | Server-only | `""` | AI features |
| `ACCESS_TOKEN` | Server-only | `""` | Internal token |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | none (asserted `!`) | `lib/supabase/admin.ts` only — never exposed via `env` |
| `NODE_ENV` | Runtime | platform default | `env.isDevelopment`, `env.isProduction`, cookie `secure` flag |

## API Reference

### `env`

A read-only, statically shaped configuration object exported from `src/config/env.ts`.

**Type shape (derived from the source literal):**

```typescript
{
  supabase:  { url: string; pubKey: string };
  resend:    { apiKey: string; email: string };
  mailchimp: { apiKey: string; audienceId: string };
  openai:    { apiKey: string };
  google:    { clientId: string };
  features:  { notifications: boolean };
  accessToken: string;
  baseUrl: string;
  storageUrl: string | undefined;
  isDevelopment: boolean;
  isProduction: boolean;
}
```

**Guarantees:**
- `supabase.url` and `supabase.pubKey` are non-empty when the module successfully loads; otherwise the module throws.
- Every other `string` field is at worst `""` (except `storageUrl`, which may be `undefined`).
- `features.notifications` is `true` only when `NEXT_PUBLIC_FEATURE_NOTIFICATIONS === "true"`.

**Throws:**
- `Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL")` — thrown at module evaluation when the Supabase URL is unset or empty.
- `Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")` — thrown at module evaluation when the publishable key is unset or empty.

> Source: [env.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts#L18-L58)

### `CONTENT_MAX_WIDTH_CLASS`

`const CONTENT_MAX_WIDTH_CLASS: string` — reading-measure cap (`"max-w-[1048px]"`) for the content column, shared by the reader and feed grids.

> Source: [constants.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/constants.ts#L1-L2)

### `CONTENT_GUTTER_CLASS`

`const CONTENT_GUTTER_CLASS: string` — responsive horizontal gutter (`"px-4 md:px-11"`) between the 232px nav rail (and the reader's 232px entity rail) and the content column.

> Source: [constants.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/constants.ts#L4-L9)

### `STICKY_ASIDE_CLASS` / `STICKY_NAV_CLASS`

`const STICKY_ASIDE_CLASS: string` — sticky offset for side rails with `h-fit` content (`"sticky top-14 z-10 max-h-[calc(100svh-7rem)]"`).

`const STICKY_NAV_CLASS: string` — sticky offset for a rail claiming the full remaining height (`"sticky top-14 z-10 h-[calc(100svh-7rem)]"`).

> Source: [constants.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/constants.ts#L11-L18)

## Failure Modes, Edge Cases & Concurrency

**Import-time failure is global and total.** Because the guards live at module top level, a missing required variable fails on the *first* import anywhere in the graph — including during static analysis / build. There is no partial-degradation path: you either have a working Supabase config or the process throws. This is intentional (misconfiguration should be loud), but it means the module must never be imported from a context where throwing is unacceptable.

**Client bundle leakage risk.** The file-level comment states the rule explicitly: *"Never read one of them from a client component."* Nothing in the code enforces this — the type system cannot distinguish `NEXT_PUBLIC_*` from server-only fields on the same object. The safety property depends entirely on the `NEXT_PUBLIC_` prefix convention: variables without that prefix are simply not substituted into the browser bundle, so a client-side read yields `undefined` rather than a secret. Importing `env` into a client component therefore does not leak `resend.apiKey`, but it *does* silently return `""` for it, which can mask bugs.

**`storageUrl` is the only unguarded export.** It is assigned without a fallback, so `env.storageUrl` is `string | undefined`. Callers need their own handling. Every other string field is guaranteed to be a `string`.

**Two `NODE_ENV` read paths.** `env.isProduction` and the cookie's `secure` flag are computed from `NODE_ENV` independently. They agree today; if cookie logic ever needs to treat preview deployments as secure, both sites must change.

**Concurrency is a non-issue by design.** The `env` object is built once at module evaluation and never mutated, so concurrent requests cannot observe differing configuration. There is no caching, no lazy re-read, and no synchronization needed.

**Fallback-triggered silent degradation.** The `|| ""` pattern means a missing `RESEND_API_KEY` produces an empty string, not an error. Integrations must validate at their own boundary; otherwise a misconfigured deployment can start successfully and fail only when an email is sent.

> Sources:
> - [env.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts#L1-L58)
> - [active-account.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/data/active-account.ts#L30-L32)

## Performance & Operational Notes

- **Zero runtime cost.** The module does a fixed amount of work (twelve assignments, two truthiness checks, one object literal) exactly once per process. There is no I/O, no parsing, and no lazy accessor.
- **Bundle-size benefit on the client.** Because only statically referenced `NEXT_PUBLIC_*` values are substituted, the other twelve hoisted constants resolve to `undefined` in client code and are removed by minification. Writing them as static references is what makes this elimination reliable.
- **Operational checklist when adding a variable:** (1) add the hoisted `const` with a literal `process.env.X` reference for inlining; (2) decide the tier — hard guard, `|| ""`, explicit default, or derived boolean; (3) place it in the right vendor group or flat field; (4) document the scope (public vs. server-only) in the naming via the `NEXT_PUBLIC_` prefix; (5) update this page's tables.
- **Secrets discipline.** `SUPABASE_SERVICE_ROLE_KEY` is intentionally reachable only from `src/lib/supabase/admin.ts`. Preserve that isolation when refactoring — do not promote it into the shared `env` object.
- **Build compatibility.** The `features.notifications` comment notes the toggle is designed so "builds that never set it still pass" — a deliberate requirement for CI and preview environments.

## Extension Points

- **Add a new vendor group.** Extend the `env` literal with a new namespaced key (e.g. `analytics: { ... }`) and add the corresponding hoisted `const`s in the same file, keeping the static-reference form.
- **Promote a toggle to permanent.** When the notifications ticket completes, remove `features.notifications`, the `FEATURE_NOTIFICATIONS` hoist, and the `NEXT_PUBLIC_FEATURE_NOTIFICATIONS` variable together — the comment in the source marks this as the intended lifecycle.
- **Replace direct `process.env` reads.** `lib/supabase/admin.ts`, `lib/supabase/middleware.ts`, and `lib/supabase/public.ts` currently bypass `env` and rely on `!` assertions. Routing them through `env` (or a dedicated validated superset) would centralize validation; `SUPABASE_SERVICE_ROLE_KEY` would need a separate, admin-only accessor to preserve the current isolation.
- **Centralize layout tokens.** Additional Tailwind class fragments used by more than one component belong in `src/components/ui/layout/constants.ts` rather than being duplicated, following the `CONTENT_*` / `STICKY_*` precedent.

## Related Links

- [src/config/env.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/config/env.ts) — the environment aggregation module
- [src/components/ui/layout/constants.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/ui/layout/constants.ts) — shared layout constants
- [src/lib/supabase/admin.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/admin.ts) — service-role client (reads `SUPABASE_SERVICE_ROLE_KEY`)
- [src/lib/supabase/middleware.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/middleware.ts) — Supabase session middleware
- [src/lib/supabase/public.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/public.ts) — public/browser Supabase client
- [src/utils/data/active-account.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/utils/data/active-account.ts) — environment-dependent cookie flags
- [src/middleware.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/middleware.ts) — Next.js middleware entry with its route `matcher` configuration
- [src/instrumentation.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/instrumentation.ts) — server instrumentation entry point
- [src/instrumentation-client.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/instrumentation-client.ts) — client instrumentation entry point
- [next.config.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/next.config.ts) — build configuration and headers/CSP derivation
- [open-next.config.ts](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/open-next.config.ts) — OpenNext/Cloudflare deployment configuration
