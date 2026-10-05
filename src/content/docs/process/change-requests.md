---
title: "Change Requests"
description: "How to change anything after Design Done: log, prioritise, analyse, decide, route, apply. Includes internal feedback and bug intake."
sidebar:
  order: 4
---

A change request is any change to a feature after column 6, Design Done. This covers design tweaks, spec corrections, dev-initiated changes, and bugs. The same flow applies regardless of who triggers it - designer, developer, Joseph, QA, or BA.

Adjustments made anywhere in columns 1 to 5, before the design is frozen, do not need a change request. That is the point of the design track: the spec is written first and the design is built against it, so adjustments to either one to keep the two in sync are expected. Once the ticket reaches Design Done, any further change needs a change request.

Every change request needs a ticket. Discussion in chat does not count as a request and will not be picked up by the dev team. BA owns the change request process end to end: intake, spec updates, coordination with Designer, and confirmation that spec and design are aligned before the ticket returns to Ready for Dev.

## Internal feedback

Joseph and other internal stakeholders send feedback directly to BA/PM. Not to the dev channel, not to designers, not scattered across chat threads. BA/PM triages: what is a bug, what is an improvement, what is out of scope, what is already covered. Only after that triage does anything reach dev or design, and only via a ticket.

The point is to protect the dev and design teams from unstructured, in-flight commentary. If something needs to change, it becomes a ticket. If it does not, it stops with BA/PM. Devs and designers should only ever see filtered, actionable input.

## Bugs

The [bug report form](https://docs.google.com/forms/d/e/1FAIpQLSc3XCR9CQah3jCu-Uw6a-htuVCTXGMmMmYtrG9QQacyI_EhDQ/viewform) is the intake channel for bug reports from users and external testers. It is not the channel for internal team members. Internal bug reports go to BA/PM under the internal feedback flow above.

Bugs raised in dev or design chat will be ignored. This is not a courtesy rule, it is how the dev team keeps the queue coherent.

## The flow

Every change request moves through the same six steps. No exceptions.

### 1. Log

Every change request is logged as a ticket in the **Change Requests** column on the Monday Tasks board. The BA is the assignee on every change request. Anyone on the team may raise one.

Each ticket must contain enough to understand:

- what exactly should change;
- why the change is needed and what value it provides.

Where available, include:

- links to the current specification;
- links to the current design;
- screenshots or examples of the current and desired state.

### 2. Prioritise

The person raising the change request assigns an initial priority.

| Priority | Criteria |
| --- | --- |
| **Critical** | Production is broken or users are blocked from completing a core use case. |
| **High** | The team is blocked or there is a significant risk of delaying development. |
| **Medium** | Affects the agreed scope, but no one is currently blocked. |
| **Low** | Improvement, enhancement, or new idea. Nothing is broken and no work is blocked. |

Critical and High skip the Decide step and move directly to Analyse and Route. Same-day turnaround is the default for both.

### 3. Analyse

BA owns this step and pulls in the PM, Designer, developers, QA, or other stakeholders as needed. The output is a short analysis attached to the ticket, covering:

- **Cost**: estimated Design, Development, and QA effort. Estimates come from the people doing the work, not from the BA alone.
- **Value**: the outcome if we do it, and the cost if we do not.
- **Impact**: affected spec, Figma, live functionality, and any tickets already in progress.
- **Recommendation**: the BA's recommended course of action.

For Critical and High requests, the BA focuses only on identifying impact and agreeing on the fastest viable solution. Skip unnecessary analysis.

### 4. Decide

Medium and Low change requests need a decision from Joseph before they proceed. Joseph reviews the analysis and picks one of four outcomes:

- **Approved**: proceed to Route.
- **On Hold**: goes to the backlog with a reason and a review date. An item without a review date should be treated as rejected, not on hold.
- **Rejected**: the ticket is archived with a reason. The reason should be clear enough that the same request does not resurface repeatedly.
- **Needs More Information**: returned to BA with additional questions.

Critical and High requests skip this step.

### 5. Route

The next steps depend on the type of change.

#### Design update or design fix

Once a ticket reaches Design Done, the developer-facing Figma is the reference for dev. Do not edit it directly. The flow for any change after freeze:

1. Designer explores the change in a playground or draft file. The developer-facing Figma is not touched. Devs and BA can view the playground and give implementation feedback.
2. BA reviews and marks the ticket as either **Needs spec update** or **No spec update needed**. If the spec needs updating, BA updates it before moving on.
3. BA and PM sign-off. BA moves the ticket to Create Dev Tickets and tags the Designer to permit the developer-facing Figma update.
4. Designer updates the developer-facing Figma to match the signed-off direction.
5. Dev delivers to prod.

This applies to every change, including ones that feel mechanical. Correcting an avatar component, adjusting a card height, swapping an icon: these all go through the flow above. The developer-facing Figma does not get edited ad-hoc. If it is worth changing, it is worth a ticket.

#### Specification update

1. BA updates the specification.
2. If the change affects the user interface or behaviour visible to users, the Designer updates Figma to match.
3. If code changes are required, the ticket moves to Ready for Dev.
4. Notify the team if the change may affect work already in progress.

#### Dev-initiated changes

Two situations, depending on whether the dev has already filled a gap or is blocked by a spec/design mismatch.

**Design omission**. For small gaps the dev filled in-flight - missing states, unspecified affordances, obvious micro-interactions - follow [Design Omissions](/ozeaon-wiki/process/design-omissions/).

**Dev-blocked**. The dev spots a spec/design mismatch that stops them from implementing. They open a change request ticket and flag it as Critical. BA owns the decision, syncs with Designer if needed, and unblocks the dev. Same-day turnaround is the default.

In both cases the ticket is the record. No silent edits to spec or design without a ticket, and no PR merged against the spec without a ticket to explain the divergence.

#### New idea

A new idea is not a change request against an existing feature. It is a candidate for the discovery flow described in [New Feature Process](/ozeaon-wiki/process/new-feature-process/). Close the change request ticket with a link to the discovery ticket once it exists.

### 6. Apply and Close

Dev tickets created from the change request continue through the standard delivery workflow in [Kanban](/ozeaon-wiki/process/kanban/). If the change requires no code update, the ticket goes straight to Done.

Any change that results in a code update must be logged in the [Change Registry](https://docs.google.com/spreadsheets/d/1LBRRCja_DsP0km7x8lVGHrjzRuzPdGNJzRv5Pw50w1o/edit?gid=1257745505#gid=1257745505).

## Post-delivery changes

Once a feature is delivered, the original spec becomes historical documentation of the decision. Future changes are new change requests against the current behaviour.
