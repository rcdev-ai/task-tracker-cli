---
id: INIT-0008
type: initiative
title: A task added with a due date in the past gets a warning
status: draft
revision: 3
owner_role: ROLE-product-manager
created: 2026-11-24
updated: 2026-11-24
capabilities: [CAP-0001]
requirements: [REQ-0025]
tickets: []
decisions: [PD-0018]
---

# INIT-0008 — A task added with a due date in the past gets a warning

## Outcome

When this is done, a person using `ttc`:

- **O1.** Who adds a task with `ttc add` and gives a due date before today
  still gets the task added exactly as today, and is also told, in one line,
  that the due date is in the past.
- **O2.** Sees everything else as it is today: adding a task with a due date
  of today or later, or with no due date, prints exactly what it prints today
  and nothing on stderr; a failed `ttc add` prints only its one error line;
  no other command, `ttc help` and the data file change.

Source: the request (`product/sources/2026-11-24-requester-request.md`),
Discovery J1, J2 in `product/state.md`.

## Why now

The requester asked for it on 2026-11-24
(`product/sources/2026-11-24-requester-request.md`): "it's usually a typo and
I don't notice." Today `ttc add` with a past due date is silent (Discovery
P1); the only later sign is the task's `!overdue` token, if the person looks
(P2).

## Scope

**In scope.**

- One warning line when `ttc add` is given a due date before today, with the
  task still added (Ambiguity log A2, A3, A6).
- The README documents it.

**Out of scope.**

- Refusing a past due date, or asking the user to confirm it (A3, A4).
- A warning from `ttc copy --due`, `ttc due` or any command other than
  `ttc add` (A1).
- Past dates in a `ttc import` file (A8).
- A flag or setting that turns the warning off (A7).
- Guessing or suggesting a corrected date (A10).
- Checks for other likely typos, such as a date far in the future.
- Any change to stored data, the data file format, `ttc help`, or the output
  of any other command.

## Success measures

1. `ttc add "<title>" --due <d>`, with `<d>` a valid date before today: the
   task is added as today (stdout `Added task <id>`, exit 0, the same task in
   `tasks.json`), and stderr holds exactly one warning line naming `<d>`.
2. `ttc add` with a due date of today or later, or without `--due`: stdout,
   stderr (empty), exit code and `tasks.json` are exactly as today.
3. A `ttc add` that fails, with or without a past due date: exactly one error
   line on stderr and no warning, exit 1, as today. A failure before the save
   prints nothing on stdout and leaves `tasks.json` unchanged; a failure after
   the save (stdout cannot be written) keeps the task (`PD-0008`).
4. Every other command, `ttc help` and the data file behave exactly as before.
5. The README states when the warning appears and what it says.
6. The CI `test` check passes on the pull request that delivers the story
   (`project/constraints.md` row 7, as amended by `PD-0017`).

## Product constraints

`project/constraints.md` rows 1–9 apply unchanged. `PD-0003` items 5 (a past
date is allowed), 6 (today), 10 (one stdout line on success, no confirmation)
and 11 (one stderr line on failure) stay true.

## Requirements

- `REQ-0025` — A task added with a due date in the past gets a one-line
  warning.

## Capabilities affected

- `CAP-0001` — A person tracks their tasks locally from the ttc command line.

## Open questions

None.

## Scope log

| Date | Revision | Change | Reason |
| --- | --- | --- | --- |
| 2026-11-24 | 1 | Created at INTAKE | Triage verdict `new-initiative` |
| 2026-11-24 | 2 | Outcome O1–O2, scope, out of scope (7 items), success measures 1–6, `REQ-0025` | PRODUCT_DEFINITION |
| 2026-11-24 | 3 | `PD-0018`; success measure 3 states the `PD-0008` case (a failure after the save keeps the task) | SOLUTION_CONVERGENCE; architect assumption P4 |
