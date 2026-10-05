---
title: "PR and Ticket Rules"
description: "What the Monday automation needs from a pull request: Closes lines, the no-ticket label, and linking several tickets."
sidebar:
  order: 6
---

A pull request now moves its Monday ticket by itself. What that asks of you.

- One approval sends it to QA, not two. Make the review thorough — if QA bounces it, you are reviewing the same PR again.
- Put `Closes TOZN-123` in the PR title or description. Not the branch name, not a commit message — those link nothing.
- No closes line means a failed check. Chores, CI and docs get the `no-ticket` label instead.
- Move your ticket to Dev In Progress when you pick it up. If you forget, opening the PR catches it from Ready for Dev — but a ticket parked in Backlog, Stuck or Change Request moves nothing and nobody finds out.
- Merging sets it to Done or Fixed. You do not need to touch the board again.
- A QA failure comes back to you as Dev In Progress. Nothing automates that move — QA does it by hand.

## Linking more than one ticket

Repeat the keyword. Every id needs its own `Closes`, on its own line or separated by a comma:

```
Closes TOZN-402
Closes TOZN-403
Closes BOZN-235
```

`Closes TOZN-402 and TOZN-403` links only the first. `Closes: TOZN-402` with a colon links nothing at all.

Tickets from both boards can go on one PR. Each moves on its own board, and the PR gets a single comment listing where they all landed.

## One ticket across several PRs

Put the closes line on the last PR only. An earlier PR carrying it sends the ticket to Code Review before the work is done. Name it in backticks on the others — `TOZN-402` — to keep the reference visible without moving anything.

## Where the detail lives

[`docs/workflows.md`](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/docs/workflows.md) in ozeaon-v2 covers what moves on which event, and which statuses the automation refuses to touch. For how the sync is implemented, see [CI/CD Workflows](/ozeaon-wiki/operations/ci-cd-workflows/) in the developer docs.
