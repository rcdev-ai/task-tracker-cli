---
id: PD-0015
type: decision
title: The ttc tickets live in the Ariadne project TTC
status: accepted
revision: 1
owner_role: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
decided_on: 2026-10-31
affects: [INIT-0001]
supersedes: PD-0007
superseded_by:
---

# PD-0015 — The ttc tickets live in the Ariadne project TTC

## Context

`PD-0007` put the `ttc` tickets in the Linear project Task Tracker CLI, team
RC Development. The requester then moved the whole Factory off Linear onto
Ariadne, the local ticket tracker (`~/Desktop/Projects/ariadne`), and retired
the Linear tools from both providers on 2026-10-31. Every existing `ttc`
ticket was imported into Ariadne with its key unchanged. Agents now reach the
tracker only through the Ariadne MCP tools, so a binding that names a Linear
project and team can no longer be followed.

## Decision

1. `ttc` tickets live in the Ariadne project **TTC** (the Factory project key).
   `product/manifest.yaml` binds `external_systems.issue_tracker` as
   `kind: ariadne`, `project: TTC`.
2. Imported tickets keep their `RCDEV-n` keys. New tickets get the project
   prefix (`TTC-n`), which matches `ticket_key_pattern`.
3. Every ticket names the repository `rortegalizardo/task-tracker-cli`, per
   `project/constraints.md` row 9, as before.

## Options considered

| Option | Why not |
| --- | --- |
| Keep `PD-0007` and the Linear project | The requester retired Linear. No agent can reach it, so the binding would block every HANDOFF. |
| One shared Ariadne project for every repository | Ariadne projects map 1:1 to Factory project keys, and `SKILL-create-tickets-from-stories` resolves the project from that key. A shared project would mix `ttc` work with other products. |

## Consequences

**Costs.**

- Old and new tickets carry two key prefixes (`RCDEV-` and `TTC-`).

**Benefits.**

- The binding needs no external lookup: the project key is the product key.

> Once `status: accepted`, this body is never rewritten. A change of mind is a
> new decision with `supersedes: PD-0015`.
