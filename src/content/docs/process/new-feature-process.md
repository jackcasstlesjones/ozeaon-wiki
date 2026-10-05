---
title: "New Feature Process"
description: "How a brand new feature moves from idea to Ready for Dev through discovery: BRD, design and spec loop, signoff."
sidebar:
  order: 2
---

How a brand new feature moves from an idea into the kanban board. Discovery, in other words.

> This is a future flow we are working towards for **brand new features** only. It is not ready to be applied to existing features yet. The first features we plan to run through it are Notifications and Payments.

Every brand new feature goes through discovery before it appears in [Kanban](/ozeaon-wiki/process/kanban/) as Ready for Dev. The output of discovery is a signed-off BRD, signed-off designs, and a team-facing PRD (functional specification). Without all three, the feature does not enter the dev track.

Roles in this phase: Joseph (product), Olena (BA/PM), Roman (design).

## 1. BRD

Joseph and Olena write the Business Requirements Document together. It captures the problem, the target users, the goals, and the constraints. It does not describe screens, flows, or components.

The BRD is signed off before any design or spec work begins. It is the anchor for everything that follows.

## 2. Design and spec loop

Once the BRD is signed off, two workstreams start in parallel and feed each other.

- Joseph and Olena work with Roman on UX and UI. Roman explores flows, layouts, and states in Figma, then produces finished designs. Joseph and Olena feed in constraints from the BRD and push back on decisions where needed.
- Olena writes the team-facing PRD, the functional specification. It captures behaviour, states, transitions, validation, permissions, and side effects. It follows the same split as [Documentation Conventions](/ozeaon-wiki/process/documentation-conventions/): behaviour lives in the PRD, visuals live in the Figma.

The two loop. A design decision often clarifies a spec question, and a spec question often surfaces a design gap. Expect several passes back and forth before either side is stable.

## 3. Refinement and signoff

The loop closes when:

- Roman has produced finished designs, signed off and ready to build against.
- Olena has delivered a finished functional specification aligned with those designs.
- Joseph is satisfied that both reflect the BRD.

At this point discovery is done. Because the designs and spec are already finished and signed off, the feature skips the design track entirely. Dev tickets are created straight from the spec and designs and land in Ready for Dev on the kanban board. From there they pick up the flow described in [Kanban](/ozeaon-wiki/process/kanban/).

## After discovery

Once discovery is done, the BRD, PRD, and designs are the reference for everything downstream. Any change to them follows [Change Requests](/ozeaon-wiki/process/change-requests/).
