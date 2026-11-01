---
initiative: INIT-0007
type: product-definition-contract
title: Product definition contract — A task's due date is changed or removed in one short command
status: accepted
revision: 1
owner_role: ROLE-product-manager
drafted_by: ROLE-product-manager (inline, size rule §9d.2)
validated_by: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
requirements: [REQ-0016, REQ-0017]
open_questions: []
decisions: []
raw_sources:
  - initiatives/INIT-0007-change-or-clear-due-date/product/sources/2026-10-31-requester-request.md
  - initiatives/INIT-0007-change-or-clear-due-date/product/state.md (Discovery, Ambiguity log)
---

# Product definition contract — INIT-0007

## Problem

The requester asks that "A person can change a task's due date, or remove it,
after the task was added — in one short command", gives
`ttc due <id> YYYY-MM-DD` and `ttc due <id> --clear` as an example, and notes
"Today the only ways to touch a due date after `ttc add` are `ttc postpone`
and `ttc copy --due`" (raw request).

## Actors

One person who keeps their own task list with `ttc` on their own machine. No
other actor (`CAP-0001` Boundaries: one user).

## Current behavior

`CAP-0001` covers local task tracking. A due date is given only by
`ttc add --due`. `ttc postpone <id>` moves it one day past the later of the
due date and today and refuses a task with no due date; `ttc copy <id> --due`
dates a new task and leaves the original as it is; nothing removes a due
date, and `ttc due` is an unknown command (`PD-0003` Consequences,
`PD-0011` items 3, 5, `PD-0013` items 1, 3, 13, README, head `1084f0a`;
Discovery P1–P3). `ttc note <id> ["<text>" | --clear]` already sets or
removes one optional value of a task (Discovery P4).

## Desired outcomes

O1–O3 in `initiative.md` rev 2: one short command gives an existing task a
chosen due date; one short command removes it; nothing else changes.

## Requirements

| REQ- id | Status | One-line statement |
| --- | --- | --- |
| REQ-0016 | draft | A task's due date is set to a chosen date in one short command |
| REQ-0017 | draft | A task's due date is removed in one short command (after `REQ-0016`) |

## Constraints

- `project/constraints.md` rows 1–9 (Node 24, built-in libraries only, no
  network; one JSON file; atomic writes; one-line errors with non-zero exit;
  `node:test` tests and a passing CI `test` check; CLI only; repository
  `rortegalizardo/task-tracker-cli`).
- `PD-0003`, `PD-0004`, `PD-0008`, `PD-0010`: the existing argument, id,
  date, no-op, message, help, file, lock and format rules every changing
  command follows; `PD-0011` item 6: no due date later than `9999-12-31`.

## Known facts

- The request names two jobs and one quality: change a task's due date after
  it was added (J1), remove it (J2), each in one short command (J3).
  Source: raw request.
- "change a task's due date" covers a task that has none (Ambiguity log A1).
- A due date follows one rule wherever it is typed (`PD-0003` item 5;
  `PD-0013` item 3), and a no-op succeeds and exits 0 (`PD-0003` item 9).

## Rejected assumptions

- "Only tasks that already have a due date can be given a new one." Not
  taken: that is `ttc postpone`'s rule, and the ask is to change the due
  date to a chosen one (A1).
- "`ttc postpone` or `ttc copy --due` should change." Not taken: the request
  names them as today's ways; they stay as they are (A12).
- "Relative dates are wanted." Not taken: the request names `YYYY-MM-DD`
  (A11).

## Open questions

none.

## Decisions already made

None yet for this initiative. The ambiguity log rows A1–A13
(`product/state.md`) are PM-resolvable; A1, A4–A8 and A13 are recorded in
the chosen-option `PD-` at SOLUTION_CONVERGENCE.

## Raw-source citations

- `initiatives/INIT-0007-change-or-clear-due-date/product/sources/2026-10-31-requester-request.md`
- `initiatives/INIT-0007-change-or-clear-due-date/product/state.md` — Discovery and Ambiguity log

## Non-goals

The out-of-scope list in `initiative.md` rev 2: no relative dates, no several
tasks at once, no change to `ttc add`, `ttc postpone` or `ttc copy`, no due
times or reminders, no sorting by due date, no other output change.
