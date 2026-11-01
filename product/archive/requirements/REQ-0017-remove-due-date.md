---
id: REQ-0017
type: requirement
title: A task's due date is removed in one short command
status: superseded
revision: 3
owner_role: ROLE-product-manager
created: 2026-10-31
updated: 2026-11-01
initiative: INIT-0007
outcome_element: "O2 and O3 (initiative.md): one short command removes an existing task's due date; only that task's due date changes and nothing else does"
acceptance:
  - "AC-1. Empty `$TTC_HOME`, then `ttc add \"Pay rent\" --due 2000-01-02 --tag bills`, `ttc add \"Call mom\" --tag home`, `ttc add \"Fix bike\" --due 2099-06-01` and `ttc done 3`, then `ttc due 1 --clear` → stdout is exactly the line `Cleared due date of task 1`, stderr is empty, exit code 0; `ttc list` then prints exactly `#1 [ ] Pay rent +bills` and `#2 [ ] Call mom +home`, in that order; `ttc list --no-due` prints the same two lines; `ttc list --overdue` prints exactly `No tasks.`; `ttc stats` prints exactly `open: 2`, `done: 1` and `overdue: 0`; each exit code 0"
  - "AC-2. After AC-1: `ttc due --clear 003` → stdout is exactly `Cleared due date of task 3`, exit code 0; `ttc list --done` then prints exactly `#3 [x] Fix bike`; `tasks.json` parsed as JSON then has `version` 4, `nextId` 4 and exactly the tasks `{\"id\":1,\"title\":\"Pay rent\",\"status\":\"open\",\"due\":null,\"tags\":[\"bills\"],\"note\":null,\"important\":false}`, `{\"id\":2,\"title\":\"Call mom\",\"status\":\"open\",\"due\":null,\"tags\":[\"home\"],\"note\":null,\"important\":false}` and `{\"id\":3,\"title\":\"Fix bike\",\"status\":\"done\",\"due\":null,\"tags\":[],\"note\":null,\"important\":false}`, in that order; `ttc export --format csv` prints exactly `id,title,status,due,tags,note`, `1,Pay rent,open,,bills,`, `2,Call mom,open,,home,` and `3,Fix bike,done,,,`, exit code 0; then `ttc due 1 2099-11-10` → stdout is exactly `Set due date of task 1 to 2099-11-10`, exit code 0, and `ttc list` prints exactly `#1 [ ] Pay rent due:2099-11-10 +bills` and `#2 [ ] Call mom +home`"
  - "AC-3. After AC-1: `ttc due 2 --clear`, on a task with no due date → stdout is exactly `Task 2 has no due date`, stderr is empty, exit code 0, and `tasks.json` is byte-for-byte unchanged. `tasks.json` in format version 3 holding exactly `{\"version\":3,\"nextId\":2,\"tasks\":[{\"id\":1,\"title\":\"Call mom\",\"status\":\"open\",\"due\":null,\"tags\":[],\"note\":null}]}`, then `ttc due 1 --clear` → stdout is exactly `Task 1 has no due date`, exit code 0, and `tasks.json` is byte-for-byte unchanged"
  - "AC-4. `tasks.json` in format version 3 holding exactly `{\"version\":3,\"nextId\":4,\"tasks\":[{\"id\":1,\"title\":\"Call mom\",\"status\":\"open\",\"due\":null,\"tags\":[],\"note\":null},{\"id\":2,\"title\":\"Pay rent\",\"status\":\"open\",\"due\":\"2099-10-01\",\"tags\":[\"bills\"],\"note\":\"by card\"},{\"id\":3,\"title\":\"Fix bike\",\"status\":\"done\",\"due\":null,\"tags\":[\"home\"],\"note\":\"chain\"}]}`, then `ttc due 2 --clear` → stdout is exactly `Cleared due date of task 2`, exit code 0, and `tasks.json` parsed as JSON then has `version` 4, `nextId` 4 and exactly the tasks `{\"id\":1,\"title\":\"Call mom\",\"status\":\"open\",\"due\":null,\"tags\":[],\"note\":null,\"important\":false}`, `{\"id\":2,\"title\":\"Pay rent\",\"status\":\"open\",\"due\":null,\"tags\":[\"bills\"],\"note\":\"by card\",\"important\":false}` and `{\"id\":3,\"title\":\"Fix bike\",\"status\":\"done\",\"due\":null,\"tags\":[\"home\"],\"note\":\"chain\",\"important\":false}`, in that order"
  - "AC-5. Empty `$TTC_HOME`, then `ttc add \"Pay rent\" --due 2099-12-30 --tag home --note \"by card\" --important` and `ttc add \"Buy milk\" --due 2099-06-01`, then `ttc export <dir>/before.json`, `ttc due 1 --clear` and `ttc export <dir>/after.json`, `<dir>` an existing folder given as an absolute path → the two export files are identical except that task 1's due date is `2099-12-30` in `before.json` and `null` in `after.json`; `ttc list` then prints exactly `#1 [ ] Pay rent !important +home` and `#2 [ ] Buy milk due:2099-06-01`, in that order, exit code 0"
  - "AC-6. After the commands of AC-1, each of the following → stderr is exactly the line given, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged: `ttc due 3 2099-11-10 --clear` → `ttc: due date and --clear cannot be combined`; `ttc due --clear 3 2099-11-10` → `ttc: due date and --clear cannot be combined`; `ttc due 3 2026-02-30 --clear` → `ttc: due date and --clear cannot be combined`; `ttc due 99 2099-11-10 --clear` → `ttc: due date and --clear cannot be combined`; `ttc due abc 2099-11-10 --clear` → `ttc: invalid task id: abc`; `ttc due abc --clear` → `ttc: invalid task id: abc`; `ttc due 99 --clear` → `ttc: no task with id 99`; `ttc due 1 --clear --clear` → `ttc: option given twice: --clear`; `ttc due --clear` → `ttc: missing argument: <id>`; `ttc due 1 2099-11-10 x --clear` → `ttc: unexpected argument: x`; `ttc due 1 --clear --bogus` → `ttc: unknown option: --bogus`. `ttc due 1` → stderr is one line starting `ttc: `, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged"
  - "AC-7. `tasks.json` holding the text `not json`: `ttc due 1 2099-11-10 --clear` → stderr is exactly `ttc: due date and --clear cannot be combined`; `ttc due 1 --clear` → stderr is one line starting `ttc: cannot read `; each with stdout empty, exit code 1, and `tasks.json` byte-for-byte unchanged. `$TTC_HOME` names a folder that does not exist, then `ttc due 1 --clear` → stderr is exactly `ttc: no task with id 1`, stdout is empty, exit code 1, and afterwards neither `tasks.json` nor the `$TTC_HOME` folder exists"
  - "AC-8. `ttc help` → stdout is exactly `Usage:` followed by these lines, each indented two spaces, in this order: `ttc help`; `ttc add \"<title>\" [--due YYYY-MM-DD] [--tag <t>]... [--note \"<text>\"] [--important]`; `ttc copy <id> [--due YYYY-MM-DD]`; `ttc list [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]`; `ttc done <id>`; `ttc reopen <id>`; `ttc important <id>`; `ttc unimportant <id>`; `ttc postpone <id>`; `ttc due <id> YYYY-MM-DD | --clear`; `ttc rename <id> \"<title>\"`; `ttc delete <id>`; `ttc clean`; `ttc tag <id> +<t> | -<t>`; `ttc note <id> [\"<text>\" | --clear]`; `ttc export [<file>] [--format json|csv] [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]`; `ttc import <file>`; `ttc stats`; exit code 0"
  - "AC-9. README.md → the \"Changing a due date\" section shows `ttc due <id> YYYY-MM-DD | --clear` and, on top of what `REQ-0016` documents, states: that `--clear` removes the task's due date, on open and done tasks; the success line `Cleared due date of task <id>`; that on a task with no due date it prints `Task <id> has no due date`, changes nothing and exits 0; that a date and `--clear` together are refused with `ttc: due date and --clear cannot be combined`; and that a task without a due date shows in `ttc list --no-due`"
  - "AC-10. `npm test` runs `node:test` tests covering AC-1 to AC-8; the `REQ-0016` tests still pass; the test oracle (`test/support/ttc-model.js`) and the argument fuzzing (`fuzz-gen.js`, `fuzz-harness.js`) cover `ttc due` with a valid date, an invalid date, `--clear`, a date and `--clear` together, neither, and an extra argument, and the place of each check in the order, written from `PD-0016`, not from the new code (C5); the tests that assert the whole usage carry the new line; and the perf guard (10,000 tasks, median under 500 ms) runs → all pass; the pull request delivering this story → the CI `test` check passes"
capabilities: [CAP-0001]
design_refs: []
decisions: [PD-0003, PD-0004, PD-0008, PD-0010, PD-0011, PD-0014, PD-0016]
depends_on: [REQ-0016]
constraints: ["C1 (technical/assessment.md, round 1)", "C3 (technical/assessment.md, round 1)", "C4 (technical/assessment.md, round 1)", "C5 (technical/assessment.md, round 1)", "C6 (technical/assessment.md, round 1)", "C7 (technical/assessment.md, round 1)", "C9 (technical/assessment.md, round 1)", "C10 (technical/assessment.md, round 1)"]
observability: []
rollout: none
readiness: void
tickets: []
supersedes:
superseded_by: REQ-0024
archived_on: 2026-11-01
---

# REQ-0017 — A task's due date is removed in one short command

## Requirement

A user can remove an existing task's due date with one short command naming
the task. It works on open and done tasks. Afterwards the task has no due
date: its `ttc list` line has no `due:` token and `ttc list --no-due` shows
it. On a task that has no due date it changes nothing and exits 0. Only that
task's due date changes. An unknown id or a malformed command, including a
date and the removal together, is refused with one line on stderr, exit 1,
and nothing changes. Every command typed as it can be typed today behaves as
before, apart from the `ttc due` usage line in `ttc help`.

## Scope

- The new form `ttc due <id> --clear` (`PD-0016` items 1, 4), its success
  output, its no-op case (item 5) and its errors, including a date and
  `--clear` given together (item 6).
- Working on data files written by older ttc.
- The `ttc help` usage and the README.
- Repository: `rortegalizardo/task-tracker-cli` (`project/constraints.md` row 9).

## Non-goals

- Setting a due date: `REQ-0016`.
- A form that shows a task's due date (option B, `PD-0016` item 13).
- Several tasks in one command, any change to `ttc add`, `ttc postpone` or
  `ttc copy`, reminders, sorting by due date, any other output change: all
  out of scope in `initiative.md`.

## Behavior

The rules are `PD-0016`; this section states what the user sees.

- **Remove.** `ttc due <id> --clear` removes the task's due date, prints
  `Cleared due date of task <id>` (`<id>` without leading zeros) and exits
  0. It works on open and done tasks. `--clear` may come before or after the
  id, at most once (`PD-0016` items 1, 4).
- **Nothing to remove.** On a task with no due date it prints
  `Task <id> has no due date` to stdout, changes nothing, writes nothing and
  exits 0 (item 5).
- **Both or neither.** A date and `--clear` together are refused:
  `ttc: due date and --clear cannot be combined`, exit 1. `ttc due <id>` with
  neither stays an argument error: one line starting `ttc: `, exit 1, nothing
  changed (items 1, 6).
- **Check order.** Before the lock and the read: argument errors, in the
  order typed; the id (`ttc: invalid task id: <arg>`); a date and `--clear`
  together; neither given; the date (`ttc: invalid date: <d>`). Then under the
  lock: read the list (`ttc: cannot read <path>: <reason>`), find the task
  (`ttc: no task with id <id>`), then set, remove or the no-op. The first
  failing check is reported (item 6).
- **Refusals write nothing.** Every refusal prints one line to stderr, exits
  1, and leaves `tasks.json` byte-identical; a file written by older ttc keeps
  its version; a missing `tasks.json` stays missing and no folder is created
  (item 6).
- **Shared rules.** The lock and its busy failure, one atomic write, and a
  failure after the save exits 1 and keeps the change, as for every changing
  command (item 7).
- **Only the due date changes.** Title, status, tags, note, important mark,
  id, every other task and the `ttc list` order stay as they are. The task's
  line loses its `due:` and `!overdue` tokens; it now matches `--no-due` and
  no longer `--overdue`, `--due-from` or `--due-to`; the `ttc stats` overdue
  count and the export due value follow (item 8).
- **Data file.** No format change; `tasks.json` stays version 4. A removed due
  date is stored as the empty value a task added without `--due` has
  (`null`). A removal writes the file as version 4; the no-op and every
  refusal leave an older file as it is (item 9).
- **Help.** The `ttc due` usage line becomes
  `ttc due <id> YYYY-MM-DD | --clear`, in the same place (item 10).
- **README.** The "Changing a due date" section gains removal (item 11).
- **Setting is unchanged.** Every `ttc due <id> <d>` behaviour of `REQ-0016`
  stays as it is.

## Acceptance criteria

- [ ] AC-1. Empty `$TTC_HOME`, then `ttc add "Pay rent" --due 2000-01-02 --tag bills`, `ttc add "Call mom" --tag home`, `ttc add "Fix bike" --due 2099-06-01` and `ttc done 3`, then `ttc due 1 --clear` → stdout is exactly the line `Cleared due date of task 1`, stderr is empty, exit code 0; `ttc list` then prints exactly `#1 [ ] Pay rent +bills` and `#2 [ ] Call mom +home`, in that order; `ttc list --no-due` prints the same two lines; `ttc list --overdue` prints exactly `No tasks.`; `ttc stats` prints exactly `open: 2`, `done: 1` and `overdue: 0`; each exit code 0
- [ ] AC-2. After AC-1: `ttc due --clear 003` → stdout is exactly `Cleared due date of task 3`, exit code 0; `ttc list --done` then prints exactly `#3 [x] Fix bike`; `tasks.json` parsed as JSON then has `version` 4, `nextId` 4 and exactly the tasks `{"id":1,"title":"Pay rent","status":"open","due":null,"tags":["bills"],"note":null,"important":false}`, `{"id":2,"title":"Call mom","status":"open","due":null,"tags":["home"],"note":null,"important":false}` and `{"id":3,"title":"Fix bike","status":"done","due":null,"tags":[],"note":null,"important":false}`, in that order; `ttc export --format csv` prints exactly `id,title,status,due,tags,note`, `1,Pay rent,open,,bills,`, `2,Call mom,open,,home,` and `3,Fix bike,done,,,`, exit code 0; then `ttc due 1 2099-11-10` → stdout is exactly `Set due date of task 1 to 2099-11-10`, exit code 0, and `ttc list` prints exactly `#1 [ ] Pay rent due:2099-11-10 +bills` and `#2 [ ] Call mom +home`
- [ ] AC-3. After AC-1: `ttc due 2 --clear`, on a task with no due date → stdout is exactly `Task 2 has no due date`, stderr is empty, exit code 0, and `tasks.json` is byte-for-byte unchanged. `tasks.json` in format version 3 holding exactly `{"version":3,"nextId":2,"tasks":[{"id":1,"title":"Call mom","status":"open","due":null,"tags":[],"note":null}]}`, then `ttc due 1 --clear` → stdout is exactly `Task 1 has no due date`, exit code 0, and `tasks.json` is byte-for-byte unchanged
- [ ] AC-4. `tasks.json` in format version 3 holding exactly `{"version":3,"nextId":4,"tasks":[{"id":1,"title":"Call mom","status":"open","due":null,"tags":[],"note":null},{"id":2,"title":"Pay rent","status":"open","due":"2099-10-01","tags":["bills"],"note":"by card"},{"id":3,"title":"Fix bike","status":"done","due":null,"tags":["home"],"note":"chain"}]}`, then `ttc due 2 --clear` → stdout is exactly `Cleared due date of task 2`, exit code 0, and `tasks.json` parsed as JSON then has `version` 4, `nextId` 4 and exactly the tasks `{"id":1,"title":"Call mom","status":"open","due":null,"tags":[],"note":null,"important":false}`, `{"id":2,"title":"Pay rent","status":"open","due":null,"tags":["bills"],"note":"by card","important":false}` and `{"id":3,"title":"Fix bike","status":"done","due":null,"tags":["home"],"note":"chain","important":false}`, in that order
- [ ] AC-5. Empty `$TTC_HOME`, then `ttc add "Pay rent" --due 2099-12-30 --tag home --note "by card" --important` and `ttc add "Buy milk" --due 2099-06-01`, then `ttc export <dir>/before.json`, `ttc due 1 --clear` and `ttc export <dir>/after.json`, `<dir>` an existing folder given as an absolute path → the two export files are identical except that task 1's due date is `2099-12-30` in `before.json` and `null` in `after.json`; `ttc list` then prints exactly `#1 [ ] Pay rent !important +home` and `#2 [ ] Buy milk due:2099-06-01`, in that order, exit code 0
- [ ] AC-6. After the commands of AC-1, each of the following → stderr is exactly the line given, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged: `ttc due 3 2099-11-10 --clear` → `ttc: due date and --clear cannot be combined`; `ttc due --clear 3 2099-11-10` → `ttc: due date and --clear cannot be combined`; `ttc due 3 2026-02-30 --clear` → `ttc: due date and --clear cannot be combined`; `ttc due 99 2099-11-10 --clear` → `ttc: due date and --clear cannot be combined`; `ttc due abc 2099-11-10 --clear` → `ttc: invalid task id: abc`; `ttc due abc --clear` → `ttc: invalid task id: abc`; `ttc due 99 --clear` → `ttc: no task with id 99`; `ttc due 1 --clear --clear` → `ttc: option given twice: --clear`; `ttc due --clear` → `ttc: missing argument: <id>`; `ttc due 1 2099-11-10 x --clear` → `ttc: unexpected argument: x`; `ttc due 1 --clear --bogus` → `ttc: unknown option: --bogus`. `ttc due 1` → stderr is one line starting `ttc: `, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged
- [ ] AC-7. `tasks.json` holding the text `not json`: `ttc due 1 2099-11-10 --clear` → stderr is exactly `ttc: due date and --clear cannot be combined`; `ttc due 1 --clear` → stderr is one line starting `ttc: cannot read `; each with stdout empty, exit code 1, and `tasks.json` byte-for-byte unchanged. `$TTC_HOME` names a folder that does not exist, then `ttc due 1 --clear` → stderr is exactly `ttc: no task with id 1`, stdout is empty, exit code 1, and afterwards neither `tasks.json` nor the `$TTC_HOME` folder exists
- [ ] AC-8. `ttc help` → stdout is exactly `Usage:` followed by these lines, each indented two spaces, in this order: `ttc help`; `ttc add "<title>" [--due YYYY-MM-DD] [--tag <t>]... [--note "<text>"] [--important]`; `ttc copy <id> [--due YYYY-MM-DD]`; `ttc list [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]`; `ttc done <id>`; `ttc reopen <id>`; `ttc important <id>`; `ttc unimportant <id>`; `ttc postpone <id>`; `ttc due <id> YYYY-MM-DD | --clear`; `ttc rename <id> "<title>"`; `ttc delete <id>`; `ttc clean`; `ttc tag <id> +<t> | -<t>`; `ttc note <id> ["<text>" | --clear]`; `ttc export [<file>] [--format json|csv] [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]`; `ttc import <file>`; `ttc stats`; exit code 0
- [ ] AC-9. README.md → the "Changing a due date" section shows `ttc due <id> YYYY-MM-DD | --clear` and, on top of what `REQ-0016` documents, states: that `--clear` removes the task's due date, on open and done tasks; the success line `Cleared due date of task <id>`; that on a task with no due date it prints `Task <id> has no due date`, changes nothing and exits 0; that a date and `--clear` together are refused with `ttc: due date and --clear cannot be combined`; and that a task without a due date shows in `ttc list --no-due`
- [ ] AC-10. `npm test` runs `node:test` tests covering AC-1 to AC-8; the `REQ-0016` tests still pass; the test oracle (`test/support/ttc-model.js`) and the argument fuzzing (`fuzz-gen.js`, `fuzz-harness.js`) cover `ttc due` with a valid date, an invalid date, `--clear`, a date and `--clear` together, neither, and an extra argument, and the place of each check in the order, written from `PD-0016`, not from the new code (C5); the tests that assert the whole usage carry the new line; and the perf guard (10,000 tasks, median under 500 ms) runs → all pass; the pull request delivering this story → the CI `test` check passes

## Sequencing

After `REQ-0016`: it adds the removing form to the command `REQ-0016`
introduces, and extends its usage line, tests, oracle, fuzz cases and README
section. `depends_on: [REQ-0016]`.

## Technical constraints

From `technical/assessment.md`, round 1 (C2 is `REQ-0016`'s date rule, kept
unchanged here; C8 does not apply: it is option B only, `PD-0016` item 15):

- **C1**: every changing-command rule applies unchanged: arguments and id checked before the lock; under the lock read the list, find the task (`ttc: no task with id <id>`), change, write atomically, print one line, exit 0. A refusal leaves `tasks.json` byte-identical and creates no folder when none exists. The lock's busy failure applies. A failure after the save exits 1 and keeps the change (`PD-0008`). Works on open and done tasks.
- **C3**: only that task's `due` changes; title, status, tags, note, mark, id, other tasks and list order stay. The clear form stores the empty value every reader accepts (`null`); any other "empty" (for example `""`) makes the whole file unreadable for every command (`PD-0004` item 8). No stored-format change: version stays 4. A file of versions 1–3 is rewritten as version 4 by a change and left as it is by a no-op or a refusal (`PD-0010` items 1, 4).
- **C4**: help prints exactly one usage line per command. The changed line is asserted verbatim, in order, by 4 whole-usage unit files and the oracle, and shown in the README; this story re-touches all of them. `test/cli.test.js` asserts the `note` line directly follows the `tag` line.
- **C5**: the CI `test` check gates on the test-owned oracle and fuzz generators. Both gain the clear form (argv generator covering a date, a bad date, `--clear`, both, neither, an extra argument), written from `PD-0016`, not from the new code. Listing `due` there also covers it in the damaged-file fuzz cases.
- **C6**: the check order is stated (`PD-0016` item 6) and test-asserted wherever a message is fixed. Wording of argument errors is engineering's unless the PD fixes it (`PD-0003` item 2); the fuzz harness checks only the `ttc: ` form.
- **C7**: the perf guard (10,000 tasks, median < 500 ms) is not threatened: one task changed per run. No new case.
- **C9**: `ttc due <id>` alone stays an argument error, a command-level check placed with the other argument checks, before the lock, after the combination check (`PD-0016` items 1, 6).
- **C10**: everything that follows from the due date follows the new stored value with no change to those parts: `due:` and `!overdue` tokens, `--overdue`, `--due-from`, `--due-to`, `--no-due`, the `ttc stats` overdue count, the export `due` value.

## Observability

none — a local, offline command; its stdout/stderr lines and exit code are the
whole operable signal, and the requester ruled out network
(`project/constraints.md` row 3).

## Rollout

`none`. No format change (C3).

## Notes

- Raw request: `product/sources/2026-10-31-requester-request.md`.
- `Task <id> has no due date` (stdout, exit 0) shares words with
  `ttc postpone`'s refusal `ttc: task <id> has no due date` (stderr, exit 1);
  the prefix, stream and exit code tell them apart (`PD-0016` Consequences).
