---
title: "Preview Environments"
description: "QA on each pull request's own preview: getting the link, test accounts, how the ticket moves, and the traps."
sidebar:
  order: 7
---

QA happens on the pull request's own preview environment.

Every pull request into `main` gets its own deployed copy of the site with its own database. That copy is where the ticket is reviewed and QA'd. Only once it passes does the work merge, and merging deploys to production - so the preview is the last point at which a change can be caught before users see it.

Ideally a ticket has exactly one pull request, so every ticket has a preview to look at and every preview answers a single ticket. Some pull requests have no ticket behind them - refactors, dependency bumps, infrastructure, tidying. Those still get a preview, but they merge on code review alone and do not need QA approval. That is fine and expected. QA approval gates the tickets, not every single PR.

A ticketless pull request needs the `no-ticket` label, which is how the developer says the omission is deliberate rather than forgotten. With neither a `Closes` line nor that label, the Ticket ID check goes red. It does not block the merge - `main` has no required status checks - so treat a red Ticket ID check as a question about which of the two is missing, not as a wall.

The point of the change is that a ticket is now tested in isolation. Previously everything queued up on staging together, so a failure could belong to any of the changes sitting there and a rejected ticket had to be unpicked from the others. On a preview, the only thing that has changed is the ticket in front of you.

## Getting the link

The URL is posted as a comment on the pull request in GitHub, and takes the form:

```
https://pr-123-app-ozeaon.joseph-400.workers.dev
```

The number is the pull request number. You do not have to go looking for it - the link is posted onto the Monday ticket when the pull request opens, so the ticket is the starting point either way.

It takes roughly seven minutes from the pull request opening for the URL to work.

## Test accounts

|          |                                                                      |
| -------- | -------------------------------------------------------------------- |
| Email    | `alpha@ozeaon.com` through to `tango@ozeaon.com` (the NATO alphabet) |
| Password | `ozeaon-preview`                                                     |

Each preview is seeded with the same fixture: twenty accounts, three organisations, projects, articles, posts, and imagery. That means a known starting state on every ticket, which staging never gave you. Test data you create lives and dies with that preview.

## How the ticket moves

The Monday ticket follows the pull request. Nobody drags it between columns by hand.

- The developer writes `Closes TOZN-123` in the pull request title or description. That line is what ties the two together - a ticket number anywhere else, including in the branch name, links nothing.
- Opening the pull request moves the ticket to Code Review and posts the preview link onto it.
- **One approval moves the ticket to QA.** A single approval is enough, and the ticket arriving in your column is the signal to start. You do not need to watch the pull request yourself.
- Merging moves the ticket to Done, or to Fixed on the Bugs Queue.
- Putting the pull request back into draft returns the ticket to Dev In Progress.

Sending a failed ticket back to Dev In Progress is the one move still made by hand, and QA make it.

Two things the automation does not account for:

- **A ticket in QA is not necessarily a mergeable pull request.** One approval moves it regardless. A pull request touching both `/src/` and `/.github/workflows/` needs a second approval from a different code owner, and an approval from someone who is not a code owner does not count towards merging at all.
- **An approval is not withdrawn when the developer pushes again.** If a fix lands after you have started, the ticket sits in QA while the code underneath it changes, and nothing moves to tell you.

## What this changes for QA

- Test the ticket on its own preview and record the result on the Monday ticket before it merges. A failure goes back to the developer on the same pull request.
- QA starts when the ticket lands in the QA column. The preview is live before that, but anything that comes out of review rebuilds it and voids an earlier pass.
- The preview is destroyed when the pull request merges or closes. Capture screenshots for anything that needs to live on the ticket.
- If the developer pushes a fix after you have tested, the code updates but the sample data does not. Data-related fixes need the pull request closed and reopened to reseed — ask the developer to confirm they have done that before retesting.

## Two traps

**Previews send real email.** Sign-ups and invitations produce real messages to whatever address is typed. Use a made-up address unless you are specifically testing that an email arrives.

**Uploaded images persist after the preview is destroyed.** Nothing confidential.

## When the preview itself is broken

Empty pages, missing content across the board, or a URL that never appears are build failures, not defects in the ticket. They belong back with the developer rather than in a QA report. Everything else is fair game.

## Under the hood

For how previews are built, seeded and torn down, see [CI/CD Workflows](/ozeaon-wiki/operations/ci-cd-workflows/) in the developer docs.
