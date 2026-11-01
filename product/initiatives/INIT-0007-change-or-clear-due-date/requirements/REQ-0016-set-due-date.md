---
id: REQ-0016
type: requirement
title: A task's due date is set to a chosen date in one short command
status: draft
revision: 2
owner_role: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
initiative: INIT-0007
outcome_element: "O1 and O3 (initiative.md): one short command gives an existing task, open or done, with or without a due date, the date the user types; only that task's due date changes and nothing else does"
acceptance: []
capabilities: [CAP-0001]
design_refs: []
decisions: [PD-0016]
depends_on: [none]
constraints: []
observability: []
rollout: none
readiness: not-assessed
tickets: []
supersedes:
superseded_by:
---

# REQ-0016 — A task's due date is set to a chosen date in one short command

> **Draft (SOLUTION_CONVERGENCE).** Requirement, scope and non-goals, consistent with `PD-0016`.
> Behavior and acceptance criteria are written at DECOMPOSITION, after the
> chosen-option decision (`PD-0016`).

## Requirement

A user can give an existing task a due date they type, with one short
command naming the task and the date. It works on open and done tasks, and
on a task with or without a due date. The date follows the rule
`ttc add --due` follows. Only that task's due date changes. An invalid date,
an unknown id or a malformed command is refused with one line on stderr,
exit 1, and nothing changes. Every command typed as it can be typed today
behaves as before.

## Scope

- The new command `ttc due <id> YYYY-MM-DD` (`PD-0016` items 1–4), its
  success output and its errors (item 6). Setting the date the task already
  has is a normal success (item 3), so this form has no no-op case.
- Working on data files written by older ttc.
- The `ttc help` usage line and the README.
- Repository: `rortegalizardo/task-tracker-cli` (`project/constraints.md` row 9).

## Non-goals

- Removing a due date, `--clear` and the refusal of a date and `--clear`
  together: `REQ-0017` (`PD-0016` item 12).
- A form that shows a task's due date (option B, `PD-0016` item 13).
- Relative dates, several tasks in one command, any change to `ttc add`,
  `ttc postpone` or `ttc copy`, due times, reminders, sorting by due date,
  any other output change: all out of scope in `initiative.md`.

## Behavior

_Written at DECOMPOSITION._

## Acceptance criteria

_Written at DECOMPOSITION._

## Sequencing

none — on the frontier.

## Technical constraints

_Written at DECOMPOSITION, from `technical/assessment.md`._

## Observability

none.

## Rollout

`none`.

## Notes

none.
