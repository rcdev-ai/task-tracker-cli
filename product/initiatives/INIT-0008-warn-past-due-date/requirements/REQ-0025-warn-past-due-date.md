---
id: REQ-0025
type: requirement
title: A task added with a due date in the past gets a one-line warning
status: draft
revision: 4
owner_role: ROLE-product-manager
created: 2026-11-24
updated: 2026-11-24
initiative: INIT-0008
outcome_element: "O1 and O2 (initiative.md): ttc add with a due date before today still adds the task and says in one line that the due date is in the past; everything else stays as it is"
acceptance:
  - "AC-1. Empty `$TTC_HOME`, then `ttc add \"Pay rent\" --due 2000-01-02` → stdout is exactly the line `Added task 1`, stderr is exactly the line `ttc: warning: due date 2000-01-02 is in the past`, exit code 0; `tasks.json` parsed as JSON then has `version` 4, `nextId` 2 and exactly the task `{\"id\":1,\"title\":\"Pay rent\",\"status\":\"open\",\"due\":\"2000-01-02\",\"tags\":[],\"note\":null,\"important\":false}`; `ttc list` then prints exactly `#1 [ ] Pay rent due:2000-01-02 !overdue`, stderr empty, exit code 0"
  - "AC-2. After AC-1: `ttc add --tag home --due 1999-12-31 \"Fix bike\" --note \"chain\" --important` → stdout is exactly `Added task 2`, stderr is exactly `ttc: warning: due date 1999-12-31 is in the past`, exit code 0, and `tasks.json` parsed as JSON then holds task 1 unchanged followed by task 2 exactly as `{\"id\":2,\"title\":\"Fix bike\",\"status\":\"open\",\"due\":\"1999-12-31\",\"tags\":[\"home\"],\"note\":\"chain\",\"important\":true}`"
  - "AC-3. Empty `$TTC_HOME`, then `ttc add \"Pay rent\" --due 2099-12-31` → stdout is exactly `Added task 1`; then `ttc add \"Call mom\"` → stdout is exactly `Added task 2`; each with stderr empty and exit code 0"
  - "AC-4. For each of `TZ=Pacific/Pago_Pago` and `TZ=Pacific/Kiritimati`, with `<today>` the current date in that zone and `<yesterday>` the day before it, both computed by the test (run once more if the date in that zone changes while it runs): empty `$TTC_HOME`, then `ttc add \"Pay rent\" --due <today>` → stdout is exactly `Added task 1`, stderr is empty, exit code 0; then `ttc add \"Call mom\" --due <yesterday>` → stdout is exactly `Added task 2`, stderr is exactly `ttc: warning: due date <yesterday> is in the past`, exit code 0"
  - "AC-5. `$TTC_HOME` after `ttc add \"Call mom\"`, then each of the following → stderr is exactly the line given (no warning line), stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged: `ttc add \"Pay rent\" --due 2000-01-02 --tag \"a b\"` → `ttc: invalid tag: a b`; `ttc add \"\" --due 2000-01-02` → `ttc: title must be one non-empty line`; `ttc add \"Pay rent\" --due 2000-01-02 --due 2000-01-03` → `ttc: option given twice: --due`; `ttc add \"Pay rent\" --due 2000-02-30` → `ttc: invalid date: 2000-02-30`. `tasks.json` holding the text `not json`: `ttc add \"Pay rent\" --due 2000-01-02` → stderr is one line starting `ttc: cannot read `, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged"
  - "AC-6. Empty `$TTC_HOME`, stdout closed before ttc writes (as in `test/exit-codes.test.js`), then `ttc add \"Pay rent\" --due 2000-01-02` → exit code 1, no signal; stderr holds at most one line, that line starts `ttc: ` and is not the warning; then `ttc list` prints exactly `#1 [ ] Pay rent due:2000-01-02 !overdue`, exit code 0"
  - "AC-7. Empty `$TTC_HOME`, stderr closed before ttc writes: `ttc add \"Pay rent\" --due 2000-01-02` → exit code 1, no signal; then `ttc list` prints exactly `#1 [ ] Pay rent due:2000-01-02 !overdue`. Empty `$TTC_HOME`, stderr closed before ttc writes: `ttc add \"Call mom\" --due 2099-12-31` → stdout is exactly `Added task 1`, exit code 0"
  - "AC-8. Empty `$TTC_HOME`, then `ttc add \"Pay rent\" --due 2000-01-02` and `ttc export <dir>/x.json` (`<dir>` an existing folder given as an absolute path), then each of the following, in this order → stdout is exactly the line given, stderr is empty, exit code 0: `ttc copy 1 --due 2000-01-03` → `Copied task 1 as task 2`; `ttc copy 1` → `Copied task 1 as task 3`; `ttc due 1 1999-01-01` → `Set due date of task 1 to 1999-01-01`; `ttc import <dir>/x.json` → `Imported 1 tasks from <dir>/x.json`"
  - "AC-9. README.md → a section \"Adding a task\" shows `ttc add \"<title>\" [--due YYYY-MM-DD] [--tag <t>]... [--note \"<text>\"] [--important]` and states: that a due date before today (the local date of the machine) prints `ttc: warning: due date <d> is in the past` on stderr; that the task is still added and the command exits 0; that a due date of today or later, or no due date, prints no warning; and that `ttc due <id> YYYY-MM-DD` changes the date. The \"Exit codes\" section states that exit code 0 can come with this one `ttc: warning:` line on stderr, and that the exit code, not stderr, tells success from failure"
  - "AC-10. `npm test` runs `node:test` tests covering AC-1 to AC-8, with the existing tests that add a task with a past due date updated to expect the warning, and every date a test means as \"not past\" either `2099-` or later or computed by the test → all pass; the pull request delivering this story → the CI `test` check passes"
capabilities: [CAP-0001]
design_refs: []
decisions: [PD-0003, PD-0008, PD-0017, PD-0018]
depends_on: [none]
constraints: ["C1 (technical/assessment.md, round 1)", "C2 (technical/assessment.md, round 1)", "C3 (technical/assessment.md, round 1)", "C4 (technical/assessment.md, round 1)", "C5 (technical/assessment.md, round 1)", "C8 (technical/assessment.md, round 1)", "C9 (technical/assessment.md, round 1)", "C10 (technical/assessment.md, round 1)"]
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

The rules are `PD-0018`; this section states what the user sees.

- **When it warns.** `ttc add "<title>" --due <d>` where `<d>` is before
  today. Today is the date on the user's machine in its local time zone; a
  date equal to today is not before today (`PD-0018` item 3, `PD-0003`
  item 6).
- **The task is added as today.** stdout is exactly `Added task <id>`, the
  exit code is 0, and the stored task is the one ttc stores today for the
  same command. No question is asked (item 4).
- **The warning.** stderr holds exactly one line,
  `ttc: warning: due date <d> is in the past`, with `<d>` as typed. It is
  printed after `Added task <id>` has been written (items 5, 6).
- **No warning otherwise.** A due date of today or later, or no `--due`,
  prints exactly today's output: `Added task <id>`, stderr empty, exit 0
  (item 3).
- **A failure prints only the failure.** Every failure before the save
  (arguments, title, date, tag, note, unreadable or invalid file, busy lock,
  no task id left, failed write) prints its one `ttc: <message>` line,
  nothing on stdout, exits 1 and changes nothing, as today. If stdout cannot
  be written after the save, the task stays saved, stderr holds at most that
  one failure line and no warning, and the exit code is 1 (`PD-0008`;
  item 6).
- **stderr cannot be written.** The task stays saved and ttc exits 1
  silently, as README "Exit codes" already states (item 7).
- **Nothing else changes.** `ttc copy` (with or without `--due`),
  `ttc due`, `ttc import` and every other command print exactly what they
  print today and never this warning. `ttc help`, stored data and the data
  file format are unchanged (items 2, 10).
- **README.** A new "Adding a task" section, and one sentence in "Exit
  codes" (item 9).

## Acceptance criteria

- [ ] AC-1. Empty `$TTC_HOME`, then `ttc add "Pay rent" --due 2000-01-02` → stdout is exactly the line `Added task 1`, stderr is exactly the line `ttc: warning: due date 2000-01-02 is in the past`, exit code 0; `tasks.json` parsed as JSON then has `version` 4, `nextId` 2 and exactly the task `{"id":1,"title":"Pay rent","status":"open","due":"2000-01-02","tags":[],"note":null,"important":false}`; `ttc list` then prints exactly `#1 [ ] Pay rent due:2000-01-02 !overdue`, stderr empty, exit code 0
- [ ] AC-2. After AC-1: `ttc add --tag home --due 1999-12-31 "Fix bike" --note "chain" --important` → stdout is exactly `Added task 2`, stderr is exactly `ttc: warning: due date 1999-12-31 is in the past`, exit code 0, and `tasks.json` parsed as JSON then holds task 1 unchanged followed by task 2 exactly as `{"id":2,"title":"Fix bike","status":"open","due":"1999-12-31","tags":["home"],"note":"chain","important":true}`
- [ ] AC-3. Empty `$TTC_HOME`, then `ttc add "Pay rent" --due 2099-12-31` → stdout is exactly `Added task 1`; then `ttc add "Call mom"` → stdout is exactly `Added task 2`; each with stderr empty and exit code 0
- [ ] AC-4. For each of `TZ=Pacific/Pago_Pago` and `TZ=Pacific/Kiritimati`, with `<today>` the current date in that zone and `<yesterday>` the day before it, both computed by the test (run once more if the date in that zone changes while it runs): empty `$TTC_HOME`, then `ttc add "Pay rent" --due <today>` → stdout is exactly `Added task 1`, stderr is empty, exit code 0; then `ttc add "Call mom" --due <yesterday>` → stdout is exactly `Added task 2`, stderr is exactly `ttc: warning: due date <yesterday> is in the past`, exit code 0
- [ ] AC-5. `$TTC_HOME` after `ttc add "Call mom"`, then each of the following → stderr is exactly the line given (no warning line), stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged: `ttc add "Pay rent" --due 2000-01-02 --tag "a b"` → `ttc: invalid tag: a b`; `ttc add "" --due 2000-01-02` → `ttc: title must be one non-empty line`; `ttc add "Pay rent" --due 2000-01-02 --due 2000-01-03` → `ttc: option given twice: --due`; `ttc add "Pay rent" --due 2000-02-30` → `ttc: invalid date: 2000-02-30`. `tasks.json` holding the text `not json`: `ttc add "Pay rent" --due 2000-01-02` → stderr is one line starting `ttc: cannot read `, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged
- [ ] AC-6. Empty `$TTC_HOME`, stdout closed before ttc writes (as in `test/exit-codes.test.js`), then `ttc add "Pay rent" --due 2000-01-02` → exit code 1, no signal; stderr holds at most one line, that line starts `ttc: ` and is not the warning; then `ttc list` prints exactly `#1 [ ] Pay rent due:2000-01-02 !overdue`, exit code 0
- [ ] AC-7. Empty `$TTC_HOME`, stderr closed before ttc writes: `ttc add "Pay rent" --due 2000-01-02` → exit code 1, no signal; then `ttc list` prints exactly `#1 [ ] Pay rent due:2000-01-02 !overdue`. Empty `$TTC_HOME`, stderr closed before ttc writes: `ttc add "Call mom" --due 2099-12-31` → stdout is exactly `Added task 1`, exit code 0
- [ ] AC-8. Empty `$TTC_HOME`, then `ttc add "Pay rent" --due 2000-01-02` and `ttc export <dir>/x.json` (`<dir>` an existing folder given as an absolute path), then each of the following, in this order → stdout is exactly the line given, stderr is empty, exit code 0: `ttc copy 1 --due 2000-01-03` → `Copied task 1 as task 2`; `ttc copy 1` → `Copied task 1 as task 3`; `ttc due 1 1999-01-01` → `Set due date of task 1 to 1999-01-01`; `ttc import <dir>/x.json` → `Imported 1 tasks from <dir>/x.json`
- [ ] AC-9. README.md → a section "Adding a task" shows `ttc add "<title>" [--due YYYY-MM-DD] [--tag <t>]... [--note "<text>"] [--important]` and states: that a due date before today (the local date of the machine) prints `ttc: warning: due date <d> is in the past` on stderr; that the task is still added and the command exits 0; that a due date of today or later, or no due date, prints no warning; and that `ttc due <id> YYYY-MM-DD` changes the date. The "Exit codes" section states that exit code 0 can come with this one `ttc: warning:` line on stderr, and that the exit code, not stderr, tells success from failure
- [ ] AC-10. `npm test` runs `node:test` tests covering AC-1 to AC-8, with the existing tests that add a task with a past due date updated to expect the warning, and every date a test means as "not past" either `2099-` or later or computed by the test → all pass; the pull request delivering this story → the CI `test` check passes

## Sequencing

None: the only story of INIT-0008, on the frontier. `depends_on: [none]`.

Note for delivery, not a story dependency: CI runs only on pull requests,
and a branch from `main` at `b290dc7` or later fails 6 existing overdue tests
(4 in `test/overdue.test.js`, 2 in `test/stats.test.js`). PR #63 changed
`isOverdue` in `src/overdue.js` from `<` to `<=`; its PR body says the change
is deliberate, for a separate trial. Both clauses of AC-10, the local
`npm test` run and the CI `test` check, can pass only once `main` no longer
has those failures. This story does not change the overdue rule of
`ttc list`, `ttc stats` or any other command.

## Technical constraints

From `technical/assessment.md`, round 1 (C6 and C7 apply to option B only and
do not apply here, `PD-0018` item 1):

- **C1**: "before today" uses the one existing local-date rule (`localToday()` in `src/overdue.js`): the due date is before today in string order on `YYYY-MM-DD`, in the local time zone; today is not past. No second notion of today. The boundary is `PD-0018` item 3 and AC-4, not whatever `isOverdue` returns: at `b290dc7`, `isOverdue` also counts a task due today (see Sequencing).
- **C2**: the warning comes only with a task that was saved. Every check and the save finish before any output, as today.
- **C3**: on a failure after the save (stdout cannot be written, `PD-0008`), stderr still holds at most one line, and it is not the warning. A warning written to stderr as the command runs would go out before the stdout result is known. Meeting this touches the shared output and failure handling (`bin/ttc.js`, `src/cli.js`), not only `ttc add`.
- **C4**: when stderr cannot be written, the existing handling turns the unwritten warning into exit 1, silently, with the task saved. This is the accepted rule (`PD-0018` item 7); no special case is added.
- **C5**: the warning has the form of a failure line (`ttc: ...`); only the exit code and the word `warning:` tell them apart. README "Exit codes" gains one sentence.
- **C8**: only `ttc add` changes. `copy --due`, `due`, `import`, help, stored data and the data format stay. No other command writes to stderr on success.
- **C9**: `PD-0017`: no new suite, oracle, fuzz or perf check. The existing tests that add a task with a past due date and expect an empty stderr are updated (measured at round 1: 17 tests in 7 files). The today boundary uses the existing pinned-`TZ`, midnight-retry pattern (`test/postpone.test.js`, `test/stats.test.js`).
- **C10**: a fixed test date meant as "not past" becomes past later: `2026-10-01` in `test/add.test.js` (criteria 3–4) is now past. A "no warning" check uses `2099-` or later, or a date computed by the test.

## Observability

none — a local, offline command; its stdout/stderr lines and exit code are the
whole operable signal (`project/constraints.md` row 3).

## Rollout

`none`.

## Notes

- Raw request: `product/sources/2026-11-24-requester-request.md`.
- Rev 2 (SOLUTION_CONVERGENCE): cites `PD-0018`.
- Rev 3 (DECOMPOSITION): Behavior, AC-1 to AC-10 and technical constraints from `PD-0018` and `technical/assessment.md` round 1. Outputs of other commands checked on the CLI at `b290dc7`.
- Rev 4 (DECOMPOSITION): coherence round 1 D1 fixed inline: the Sequencing note names both AC-10 clauses and says CI runs on pull requests (`technical/coherence.md`).
- `ttc help` is not asserted again here: the whole help is checked once, by `REQ-0024` AC-8 (`PD-0017`).
