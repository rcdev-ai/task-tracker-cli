---
initiative: INIT-0008
type: product-definition-contract
title: Product definition contract — A task added with a due date in the past gets a warning
status: accepted
revision: 1
owner_role: ROLE-product-manager
drafted_by: ROLE-product-manager (inline, size rule §9d.2)
validated_by: ROLE-product-manager
created: 2026-11-24
updated: 2026-11-24
requirements: [REQ-0025]
open_questions: []
decisions: []
raw_sources:
  - initiatives/INIT-0008-warn-past-due-date/product/sources/2026-11-24-requester-request.md
  - initiatives/INIT-0008-warn-past-due-date/product/state.md (Discovery, Ambiguity log)
---

# Product definition contract — INIT-0008

## Problem

The requester says: "When I add a task with a due date that is already in
the past, it's usually a typo and I don't notice. Warn me when that happens.
Keep it simple." (raw request).

## Actors

One person who keeps their own task list with `ttc` on their own machine. No
other actor (`CAP-0001` Boundaries: one user).

## Current behavior

`CAP-0001` covers local task tracking. `ttc add --due <d>` accepts any real
`YYYY-MM-DD` date up to `9999-12-31`, a past date included, and prints only
`Added task <id>`, exit 0, with nothing on stderr (`PD-0003` items 5, 10;
CLI at head `e71f675`; Discovery P1). The only later signs are `!overdue`,
`ttc list --overdue` and the `ttc stats` overdue count (P2). `ttc due` fixes a
date in one command (P3). ttc writes to stderr only on failure (P4).

## Desired outcomes

O1–O2 in `initiative.md` rev 2: `ttc add` with a past due date still adds the
task and says so in one line; nothing else changes.

## Requirements

| REQ- id | Status | One-line statement |
| --- | --- | --- |
| REQ-0025 | draft | A task added with a due date in the past gets a one-line warning |

## Constraints

- `project/constraints.md` rows 1–9 (Node 24, built-in libraries only, no
  network; one JSON file; atomic writes; one-line errors with non-zero exit;
  CLI tests and a passing CI `test` check, as amended by `PD-0017`; CLI only;
  every ticket names its repository).
- `PD-0003` items 5, 6, 10, 11 and `PD-0008`: a past date is allowed; today
  is the local date; one stdout line on success and no confirmation; one
  stderr line on failure; a failure after the save keeps the change.

## Known facts

- The request names one job and one quality: notice a past due date when
  adding a task (J1), kept simple (J2). Source: raw request.
- "In the past" means before today, the overdue test of `PD-0003` item 6 (A2).
- A due date is also typed in `ttc copy --due` and `ttc due` (P5); the request
  names only adding a task.

## Rejected assumptions

- "A past due date should be refused." Not taken: the request says "Warn me",
  and `PD-0003` item 5 allows it (A3).
- "The user should confirm the date." Not taken: no command asks for
  confirmation (`PD-0003` item 10) and the request says "Keep it simple" (A4).
- "`ttc copy --due` and `ttc due` should warn too." Not taken: the request
  names adding a task; a later ask can extend the same line to them (A1).

## Open questions

none.

## Decisions already made

None yet for this initiative. The ambiguity log rows A1–A12
(`product/state.md`) are PM-resolvable; A1, A5, A6, A10 and A12 are recorded
in the chosen-option `PD-` at SOLUTION_CONVERGENCE.

## Raw-source citations

- `initiatives/INIT-0008-warn-past-due-date/product/sources/2026-11-24-requester-request.md`
- `initiatives/INIT-0008-warn-past-due-date/product/state.md` — Discovery and Ambiguity log

## Non-goals

The out-of-scope list in `initiative.md` rev 2: no refusal or confirmation;
no warning from other commands; no import check; no switch to turn it off; no
guessed corrections; no other typo checks; no other change.
