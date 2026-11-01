---
id: REQ-0017
type: requirement
title: A task's due date is removed in one short command
status: draft
revision: 1
owner_role: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
initiative: INIT-0007
outcome_element: "O2 and O3 (initiative.md): one short command removes an existing task's due date; only that task's due date changes and nothing else does"
acceptance: []
capabilities: [CAP-0001]
design_refs: []
decisions: []
depends_on: [REQ-0016]
constraints: []
observability: []
rollout: none
readiness: not-assessed
tickets: []
supersedes:
superseded_by:
---

# REQ-0017 — A task's due date is removed in one short command

> **Draft (PRODUCT_DEFINITION).** Requirement, scope and non-goals only.
> Behavior and acceptance criteria are written at DECOMPOSITION, after the
> chosen-option decision.

## Requirement

A user can remove an existing task's due date with one short command naming
the task. It works on open and done tasks. Afterwards the task has no due
date: its `ttc list` line has no `due:` token and `ttc list --no-due` shows
it. On a task that has no due date it changes nothing and exits 0. Only that
task's due date changes. An unknown id or a malformed command is refused with
one line on stderr, exit 1, and nothing changes. Every command typed as it
can be typed today behaves as before.

## Scope

- The new command form that removes a due date, its success output, its
  no-op case and its errors.
- Working on data files written by older ttc.
- The `ttc help` usage and the README.
- Repository: `rortegalizardo/task-tracker-cli` (`project/constraints.md` row 9).

## Non-goals

- Setting a due date: `REQ-0016`.
- Several tasks in one command, any change to `ttc add`, `ttc postpone` or
  `ttc copy`, reminders, sorting by due date, any other output change: all
  out of scope in `initiative.md`.

## Behavior

_Written at DECOMPOSITION._

## Acceptance criteria

_Written at DECOMPOSITION._

## Sequencing

After `REQ-0016`: it adds the removing form to the command `REQ-0016`
introduces.

## Technical constraints

_Written at DECOMPOSITION, from `technical/assessment.md`._

## Observability

none.

## Rollout

`none`.

## Notes

none.
