---
title: "Email & Marketing"
description: "A minimal Resend client for two live security notices, and a Mailchimp client that subscribes every new account to the marketing audience."
sidebar:
  order: 3
---

The platform has two outbound communication concerns: [Resend](https://resend.com) handles account-related security notices and [Mailchimp](https://mailchimp.com) manages the marketing audience. Both are implemented as small edge-compatible clients in [`src/lib/email/`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/email) and [`src/lib/marketing/`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/marketing). General transactional email — notification emails, digests, share-by-email — is on the roadmap and not yet built.

## Overview

**Resend** is used today for two security notices only:

- **Email-change notification** — when a user confirms a new address, the previous address receives a heads-up. Sent in [`settings/actions.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/app/(main)/(dashboard)/settings/actions.ts).
- **Account-deletion confirmation** — the deleted account's email receives a notice after deletion completes. Sent in [`lib/supabase/actions.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/actions.ts).

Sign-up confirmation goes through Supabase Auth (`supabase.auth.signUp`), not Resend. Organization invites are in-app only — the invite email columns were dropped in migration `20260518000003_simplify_org_invites.sql`. `handleSendPost`, `sendBatchEmails`, `resolveUserEmails` and `hasResolvableEmails` are defined in the email library but have no callers in `src`; share-by-email is not a shipped feature.

**Mailchimp** receives every new account via `subscribeToAudience`, called from [`signup()`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/supabase/actions.ts) after a successful auth sign-up. Every new account is subscribed as `pending` (Mailchimp's double opt-in state). Failure is caught and logged; signup still succeeds. Mailchimp is the system of record for subscription state: the marketing module only ever adds addresses; unsubscribes are handled by Mailchimp's own links.

## Architecture

### Resend Client

The Resend client in [`src/lib/email/client.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/email/client.ts) calls the Resend REST API directly with `fetch`. It reads `RESEND_API_KEY` and `RESEND_SENDER_EMAIL` from `env.ts`. The `EMAIL_TEMPLATES` registry maps template names to Resend template UUIDs for `sendTemplateEmail`, though no template sends are called in production today.

Failures throw `EmailError`. Both live callers use `.catch()` to log failures without blocking the user-facing action.

### Mailchimp Audience Client

[`src/lib/marketing/mailchimp.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/marketing/mailchimp.ts) calls the Mailchimp Marketing API v3 endpoint `POST /lists/{audienceId}/members`. The datacenter is derived from the key suffix (everything after the last `-` in `MAILCHIMP_API_KEY`). The request always sets status `pending` so Mailchimp sends its own opt-in email. A `Member Exists` error is treated as a no-op. The call has a 5-second timeout. Missing keys cause fail-fast at startup rather than a runtime error.

## Failure Modes & Edge Cases

- **Resend failures** — both callers wrap `sendEmail` in `.catch()` and log the error. The user action (email change, account deletion) proceeds regardless.
- **Mailchimp failures** — `signup()` wraps `subscribeToAudience` in a try/catch. Failure is logged; signup still succeeds.
- **Member already exists** — treated as a no-op, not an error.
- **Preview environments** — previews use the live Resend and Mailchimp keys. A sign-up in a preview environment adds a real entry to the Mailchimp audience and sends a real Resend email.
- **Missing configuration** — `env.ts` uses fail-fast validation at build time: a missing API key raises at startup rather than silently failing at runtime.

## Operational Notes

Four environment variables govern both integrations:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `RESEND_SENDER_EMAIL` | From address for all sends |
| `MAILCHIMP_API_KEY` | Mailchimp API key (datacenter derived from suffix) |
| `MAILCHIMP_AUDIENCE_ID` | Target audience / list ID |

See [`src/lib/email/index.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/email/index.ts) and [`src/lib/marketing/index.ts`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/lib/marketing/index.ts) for the full exported surface.

## Extension Points

When notification emails and other transactional sends ship, they will go through the Resend client. `sendTemplateEmail` and `sendBatchEmails` already exist in the library and are ready to be wired up. `resolveUserEmails` and `hasResolvableEmails` are helper services for batching emails to sets of users, also unused today.

## Related Links

- [Moderation](../moderation/) — content moderation pipeline
- [Storage (R2)](../storage-r2/) — object storage
- [Notifications](../../features/notifications/) — notification pipeline (in progress)
