---
id: REQ-0025
type: requirement
title: A task added with a due date in the past gets a one-line warning
status: draft
revision: 2
owner_role: ROLE-product-manager
created: 2026-11-24
updated: 2026-11-24
initiative: INIT-0008
outcome_element: "O1 and O2 (initiative.md): ttc add with a due date before today still adds the task and says in one line that the due date is in the past; everything else stays as it is"
acceptance: []
capabilities: [CAP-0001]
design_refs: []
decisions: [PD-0003, PD-0008, PD-0017, PD-0018]
depends_on: [none]
constraints: []
observability: []
rollout: none
readiness: not-assessed
tickets: []
supersedes:
superseded_by:
---

# REQ-0025 — A task added with a due date in the past gets a one-line warning

## Requirement

When a user adds a task with `ttc add` and gives a due date before today, the
task is still added exactly as today, and ttc also prints one line saying the
due date is in the past. A due date of today or later, or no due date, gives
exactly today's output. A failed `ttc add` prints only its one error line.
Nothing else changes. Built as option A of `PD-0018`: the warning is one
stderr line and stdout stays exactly `Added task <id>`.

## Scope

- The warning on `ttc add --due <d>` when `<d>` is before today.
- The README.
- Repository: `rcdev-ai/task-tracker-cli` (`~/Desktop/Projects/task-tracker-cli`).

## Non-goals

All out of scope in `initiative.md`: refusing or confirming a past date; a
warning from `ttc copy --due`, `ttc due` or any other command; `ttc import`;
a switch to turn the warning off; guessed corrections; other typo checks; any
change to stored data, the data file format, `ttc help` or other output.

## Behavior

_Written at DECOMPOSITION, from the convergence `PD-`._

## Acceptance criteria

_Written at DECOMPOSITION._

## Sequencing

None: the only story of INIT-0008, on the frontier.

## Technical constraints

_From `technical/assessment.md`, at DECOMPOSITION._

## Observability

none — a local, offline command; its stdout/stderr lines and exit code are the
whole operable signal (`project/constraints.md` row 3).

## Rollout

`none`.

## Notes

- Raw request: `product/sources/2026-11-24-requester-request.md`.
- Rev 2 (SOLUTION_CONVERGENCE): cites `PD-0018`.
