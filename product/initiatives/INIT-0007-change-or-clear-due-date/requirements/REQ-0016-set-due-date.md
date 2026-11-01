---
id: REQ-0016
type: requirement
title: A task's due date is set to a chosen date in one short command
status: accepted
revision: 4
owner_role: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
initiative: INIT-0007
outcome_element: "O1 and O3 (initiative.md): one short command gives an existing task, open or done, with or without a due date, the date the user types; only that task's due date changes and nothing else does"
acceptance:
  - "AC-1. Empty `$TTC_HOME`, then `ttc add \"Pay rent\" --due 2099-11-01 --tag bills`, `ttc add \"Call mom\" --tag home`, `ttc add \"Fix bike\" --due 2099-06-01` and `ttc done 3`, then `ttc due 1 2099-11-10` → stdout is exactly the line `Set due date of task 1 to 2099-11-10`, stderr is empty, exit code 0; `ttc list` then prints exactly `#1 [ ] Pay rent due:2099-11-10 +bills` and `#2 [ ] Call mom +home`, in that order, exit code 0"
  - "AC-2. After AC-1: `ttc due 002 2099-12-24` → stdout is exactly `Set due date of task 2 to 2099-12-24`, exit code 0; `ttc list` then prints exactly `#1 [ ] Pay rent due:2099-11-10 +bills` and `#2 [ ] Call mom due:2099-12-24 +home`, in that order, and `ttc list --no-due` prints exactly `No tasks.`; then `ttc due 2 9999-12-31` → stdout is exactly `Set due date of task 2 to 9999-12-31`, exit code 0"
  - "AC-3. After AC-2: `ttc due 3 2000-01-02` → stdout is exactly `Set due date of task 3 to 2000-01-02`, exit code 0, and `ttc list --done` then prints exactly `#3 [x] Fix bike due:2000-01-02`; `ttc due 1 2000-01-02` → stdout is exactly `Set due date of task 1 to 2000-01-02`, exit code 0. Then `ttc list --overdue` → exactly `#1 [ ] Pay rent due:2000-01-02 !overdue +bills`; `ttc list --due-from 2099-01-01` → exactly `#2 [ ] Call mom due:9999-12-31 +home`; `ttc stats` → exactly `open: 2`, `done: 1` and `overdue: 1`; `ttc export --format csv` → exactly `id,title,status,due,tags,note`, `1,Pay rent,open,2000-01-02,bills,`, `2,Call mom,open,9999-12-31,home,` and `3,Fix bike,done,2000-01-02,,`; each exit code 0"
  - "AC-4. After AC-1: `ttc due 1 2099-11-10`, the date task 1 already has → stdout is exactly `Set due date of task 1 to 2099-11-10`, exit code 0. `tasks.json` in format version 3 holding exactly `{\"version\":3,\"nextId\":4,\"tasks\":[{\"id\":1,\"title\":\"Call mom\",\"status\":\"open\",\"due\":null,\"tags\":[],\"note\":null},{\"id\":2,\"title\":\"Pay rent\",\"status\":\"open\",\"due\":\"2099-10-01\",\"tags\":[\"bills\"],\"note\":\"by card\"},{\"id\":3,\"title\":\"Fix bike\",\"status\":\"done\",\"due\":null,\"tags\":[\"home\"],\"note\":\"chain\"}]}`, then `ttc due 2 2099-10-01` → stdout is exactly `Set due date of task 2 to 2099-10-01`, exit code 0, and `tasks.json` parsed as JSON then has `version` 4, `nextId` 4 and exactly the tasks `{\"id\":1,\"title\":\"Call mom\",\"status\":\"open\",\"due\":null,\"tags\":[],\"note\":null,\"important\":false}`, `{\"id\":2,\"title\":\"Pay rent\",\"status\":\"open\",\"due\":\"2099-10-01\",\"tags\":[\"bills\"],\"note\":\"by card\",\"important\":false}` and `{\"id\":3,\"title\":\"Fix bike\",\"status\":\"done\",\"due\":null,\"tags\":[\"home\"],\"note\":\"chain\",\"important\":false}`, in that order. `tasks.json` in format version 1 holding exactly `{\"nextId\":2,\"tasks\":[{\"id\":1,\"title\":\"Pay rent\",\"status\":\"open\",\"due\":null,\"tags\":[]}]}`, then `ttc due 1 2099-10-01` → stdout is exactly `Set due date of task 1 to 2099-10-01`, exit code 0, and `tasks.json` parsed as JSON then has `version` 4, `nextId` 2 and exactly the task `{\"id\":1,\"title\":\"Pay rent\",\"status\":\"open\",\"due\":\"2099-10-01\",\"tags\":[],\"note\":null,\"important\":false}`"
  - "AC-5. Empty `$TTC_HOME`, then `ttc add \"Pay rent\" --due 2099-12-30 --tag home --note \"by card\" --important` and `ttc add \"Buy milk\" --due 2099-06-01`, then `ttc export <dir>/before.json`, `ttc due 1 2000-01-02` and `ttc export <dir>/after.json`, `<dir>` an existing folder given as an absolute path → the two export files are identical except that task 1's due date is `2099-12-30` in `before.json` and `2000-01-02` in `after.json`; `ttc list` then prints exactly `#1 [ ] Pay rent due:2000-01-02 !overdue !important +home` and `#2 [ ] Buy milk due:2099-06-01`, in that order, exit code 0"
  - "AC-6. After the commands of AC-1, each of the following → stderr is exactly the line given, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged: `ttc due 1 2026-02-30` → `ttc: invalid date: 2026-02-30`; `ttc due 1 2026-1-05` → `ttc: invalid date: 2026-1-05`; `ttc due 1 10000-01-01` → `ttc: invalid date: 10000-01-01`; `ttc due 1 tomorrow` → `ttc: invalid date: tomorrow`; `ttc due abc 2099-11-10` → `ttc: invalid task id: abc`; `ttc due 0 2099-11-10` → `ttc: invalid task id: 0`; `ttc due 2099-11-10 1` → `ttc: invalid task id: 2099-11-10`; `ttc due 99 2099-11-10` → `ttc: no task with id 99`; `ttc due abc 2026-02-30` → `ttc: invalid task id: abc`; `ttc due 99 2026-02-30` → `ttc: invalid date: 2026-02-30`"
  - "AC-7. After the commands of AC-1, each of the following → stderr is exactly the line given, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged: `ttc due` → `ttc: missing argument: <id>`; `ttc due 1 2099-11-10 2099-11-11` → `ttc: unexpected argument: 2099-11-11`; `ttc due 1 2099-11-10 --bogus` → `ttc: unknown option: --bogus`; `ttc due --bogus abc 2026-02-30` → `ttc: unknown option: --bogus`; `ttc due abc 2026-02-30 extra` → `ttc: unexpected argument: extra`. `ttc due 1` → stderr is one line starting `ttc: `, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged"
  - "AC-8. `tasks.json` holding the text `not json`: `ttc due 1 2026-02-30` → stderr is exactly `ttc: invalid date: 2026-02-30`; `ttc due 1 2099-11-10` → stderr is one line starting `ttc: cannot read `; each with stdout empty, exit code 1, and `tasks.json` byte-for-byte unchanged. `$TTC_HOME` names a folder that does not exist, then `ttc due 1 2099-11-10` → stderr is exactly `ttc: no task with id 1`, stdout is empty, exit code 1, and afterwards neither `tasks.json` nor the `$TTC_HOME` folder exists"
  - "AC-9. `ttc help` → stdout is exactly `Usage:` followed by these lines, each indented two spaces, in this order: `ttc help`; `ttc add \"<title>\" [--due YYYY-MM-DD] [--tag <t>]... [--note \"<text>\"] [--important]`; `ttc copy <id> [--due YYYY-MM-DD]`; `ttc list [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]`; `ttc done <id>`; `ttc reopen <id>`; `ttc important <id>`; `ttc unimportant <id>`; `ttc postpone <id>`; `ttc due <id> YYYY-MM-DD`; `ttc rename <id> \"<title>\"`; `ttc delete <id>`; `ttc clean`; `ttc tag <id> +<t> | -<t>`; `ttc note <id> [\"<text>\" | --clear]`; `ttc export [<file>] [--format json|csv] [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]`; `ttc import <file>`; `ttc stats`; exit code 0"
  - "AC-10. README.md → a \"Changing a due date\" section right after \"Postponing a task\" shows `ttc due <id> YYYY-MM-DD` and states: that it sets the due date of an open or done task, with or without a due date; the date rule (`YYYY-MM-DD`, a real calendar date, past dates allowed, nothing later than `9999-12-31`) and its refusal `ttc: invalid date: <d>`; the success line `Set due date of task <id> to <d>` with one example; that setting the date the task already has succeeds the same way; and that only the due date changes"
  - "AC-11. `npm test` runs `node:test` tests covering AC-1 to AC-9; the test oracle (`test/support/ttc-model.js`) and the argument fuzzing (`fuzz-gen.js`, `fuzz-harness.js`) cover `ttc due` with a valid date, an invalid date, no date and an extra argument, and its place in the check order, written from `PD-0016`, not from the new code (C5); no test asserts anything about `--clear` on `ttc due` and none fixes the text of the `ttc due <id>` error (`PD-0016` item 12); the tests that assert the whole usage carry the new line; and the perf guard (10,000 tasks, median under 500 ms) runs → all pass; the pull request delivering this story → the CI `test` check passes"
capabilities: [CAP-0001]
design_refs: []
decisions: [PD-0003, PD-0004, PD-0008, PD-0010, PD-0011, PD-0013, PD-0014, PD-0016]
depends_on: [none]
constraints: ["C1 (technical/assessment.md, round 1)", "C2 (technical/assessment.md, round 1)", "C3 (technical/assessment.md, round 1)", "C4 (technical/assessment.md, round 1)", "C5 (technical/assessment.md, round 1)", "C6 (technical/assessment.md, round 1)", "C7 (technical/assessment.md, round 1)", "C9 (technical/assessment.md, round 1)", "C10 (technical/assessment.md, round 1)"]
observability: []
rollout: none
readiness: not-assessed
tickets: []
supersedes:
superseded_by:
---

# REQ-0016 — A task's due date is set to a chosen date in one short command

## Requirement

A user can give an existing task a due date they type, with one short
command naming the task and the date. It works on open and done tasks, and
on a task with or without a due date. The date follows the rule
`ttc add --due` follows. Only that task's due date changes. An invalid date,
an unknown id or a malformed command is refused with one line on stderr,
exit 1, and nothing changes. Every command typed as it can be typed today
behaves as before, apart from the new `ttc help` usage line.

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

The rules are `PD-0016`; this section states what the user sees.

- **Set.** `ttc due <id> <d>` makes `<d>` the task's due date, prints
  `Set due date of task <id> to <d>` (`<id>` without leading zeros, `<d>` as
  `YYYY-MM-DD`) and exits 0. It works on open and done tasks, and on a task
  with or without a due date (`PD-0016` items 2, 4).
- **The date.** The `ttc add --due` rule, unchanged: `YYYY-MM-DD`, a real
  calendar date, a past date allowed, nothing later than `9999-12-31`;
  anything else is `ttc: invalid date: <d>`, `<d>` as typed (item 2).
- **The same date again.** Setting the date the task already has is a normal
  success: the same line, exit 0, and the file is written (item 3).
- **Arguments.** Exactly one `<id>` and one date. A missing id, an extra
  argument or an unknown option is an argument error. `ttc due <id>` with no
  date is an argument error too: one line starting `ttc: `, exit 1, nothing
  changed; this story fixes no wording for it (items 1, 12).
- **Check order.** Before the lock and the read: argument errors, in the
  order typed; the id (`ttc: invalid task id: <arg>`); no date given (the
  `ttc due <id>` error above, checked after the id, so `ttc due abc` reports
  the id); the date (`ttc: invalid date: <d>`). Then under the lock: read the list
  (`ttc: cannot read <path>: <reason>`), find the task
  (`ttc: no task with id <id>`), set. The first failing check is reported
  (item 6).
- **Refusals write nothing.** Every refusal prints one line to stderr, exits
  1, and leaves `tasks.json` byte-identical; a file written by older ttc keeps
  its version; a missing `tasks.json` stays missing and no folder is created
  (item 6).
- **Shared rules.** The lock and its busy failure, one atomic write, and a
  failure after the save exits 1 and keeps the change, as for every changing
  command (item 7).
- **Only the due date changes.** Title, status, tags, note, important mark,
  id, every other task and the `ttc list` order stay as they are. The `due:`
  and `!overdue` tokens, `--overdue`, `--due-from`, `--due-to`, `--no-due`,
  the `ttc stats` overdue count and the export due value follow the new date
  (item 8).
- **Data file.** No format change; `tasks.json` stays version 4. A successful
  set writes the file as version 4, as every changing command does, also when
  the date is the one the task already had; a refusal leaves an older file as
  it is (item 9).
- **Help.** `ttc due <id> YYYY-MM-DD` comes right after `ttc postpone <id>`
  and before `ttc rename <id> "<title>"` (item 10).
- **README.** A "Changing a due date" section right after "Postponing a
  task" (item 11).

## Acceptance criteria

- [ ] AC-1. Empty `$TTC_HOME`, then `ttc add "Pay rent" --due 2099-11-01 --tag bills`, `ttc add "Call mom" --tag home`, `ttc add "Fix bike" --due 2099-06-01` and `ttc done 3`, then `ttc due 1 2099-11-10` → stdout is exactly the line `Set due date of task 1 to 2099-11-10`, stderr is empty, exit code 0; `ttc list` then prints exactly `#1 [ ] Pay rent due:2099-11-10 +bills` and `#2 [ ] Call mom +home`, in that order, exit code 0
- [ ] AC-2. After AC-1: `ttc due 002 2099-12-24` → stdout is exactly `Set due date of task 2 to 2099-12-24`, exit code 0; `ttc list` then prints exactly `#1 [ ] Pay rent due:2099-11-10 +bills` and `#2 [ ] Call mom due:2099-12-24 +home`, in that order, and `ttc list --no-due` prints exactly `No tasks.`; then `ttc due 2 9999-12-31` → stdout is exactly `Set due date of task 2 to 9999-12-31`, exit code 0
- [ ] AC-3. After AC-2: `ttc due 3 2000-01-02` → stdout is exactly `Set due date of task 3 to 2000-01-02`, exit code 0, and `ttc list --done` then prints exactly `#3 [x] Fix bike due:2000-01-02`; `ttc due 1 2000-01-02` → stdout is exactly `Set due date of task 1 to 2000-01-02`, exit code 0. Then `ttc list --overdue` → exactly `#1 [ ] Pay rent due:2000-01-02 !overdue +bills`; `ttc list --due-from 2099-01-01` → exactly `#2 [ ] Call mom due:9999-12-31 +home`; `ttc stats` → exactly `open: 2`, `done: 1` and `overdue: 1`; `ttc export --format csv` → exactly `id,title,status,due,tags,note`, `1,Pay rent,open,2000-01-02,bills,`, `2,Call mom,open,9999-12-31,home,` and `3,Fix bike,done,2000-01-02,,`; each exit code 0
- [ ] AC-4. After AC-1: `ttc due 1 2099-11-10`, the date task 1 already has → stdout is exactly `Set due date of task 1 to 2099-11-10`, exit code 0. `tasks.json` in format version 3 holding exactly `{"version":3,"nextId":4,"tasks":[{"id":1,"title":"Call mom","status":"open","due":null,"tags":[],"note":null},{"id":2,"title":"Pay rent","status":"open","due":"2099-10-01","tags":["bills"],"note":"by card"},{"id":3,"title":"Fix bike","status":"done","due":null,"tags":["home"],"note":"chain"}]}`, then `ttc due 2 2099-10-01` → stdout is exactly `Set due date of task 2 to 2099-10-01`, exit code 0, and `tasks.json` parsed as JSON then has `version` 4, `nextId` 4 and exactly the tasks `{"id":1,"title":"Call mom","status":"open","due":null,"tags":[],"note":null,"important":false}`, `{"id":2,"title":"Pay rent","status":"open","due":"2099-10-01","tags":["bills"],"note":"by card","important":false}` and `{"id":3,"title":"Fix bike","status":"done","due":null,"tags":["home"],"note":"chain","important":false}`, in that order. `tasks.json` in format version 1 holding exactly `{"nextId":2,"tasks":[{"id":1,"title":"Pay rent","status":"open","due":null,"tags":[]}]}`, then `ttc due 1 2099-10-01` → stdout is exactly `Set due date of task 1 to 2099-10-01`, exit code 0, and `tasks.json` parsed as JSON then has `version` 4, `nextId` 2 and exactly the task `{"id":1,"title":"Pay rent","status":"open","due":"2099-10-01","tags":[],"note":null,"important":false}`
- [ ] AC-5. Empty `$TTC_HOME`, then `ttc add "Pay rent" --due 2099-12-30 --tag home --note "by card" --important` and `ttc add "Buy milk" --due 2099-06-01`, then `ttc export <dir>/before.json`, `ttc due 1 2000-01-02` and `ttc export <dir>/after.json`, `<dir>` an existing folder given as an absolute path → the two export files are identical except that task 1's due date is `2099-12-30` in `before.json` and `2000-01-02` in `after.json`; `ttc list` then prints exactly `#1 [ ] Pay rent due:2000-01-02 !overdue !important +home` and `#2 [ ] Buy milk due:2099-06-01`, in that order, exit code 0
- [ ] AC-6. After the commands of AC-1, each of the following → stderr is exactly the line given, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged: `ttc due 1 2026-02-30` → `ttc: invalid date: 2026-02-30`; `ttc due 1 2026-1-05` → `ttc: invalid date: 2026-1-05`; `ttc due 1 10000-01-01` → `ttc: invalid date: 10000-01-01`; `ttc due 1 tomorrow` → `ttc: invalid date: tomorrow`; `ttc due abc 2099-11-10` → `ttc: invalid task id: abc`; `ttc due 0 2099-11-10` → `ttc: invalid task id: 0`; `ttc due 2099-11-10 1` → `ttc: invalid task id: 2099-11-10`; `ttc due 99 2099-11-10` → `ttc: no task with id 99`; `ttc due abc 2026-02-30` → `ttc: invalid task id: abc`; `ttc due 99 2026-02-30` → `ttc: invalid date: 2026-02-30`
- [ ] AC-7. After the commands of AC-1, each of the following → stderr is exactly the line given, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged: `ttc due` → `ttc: missing argument: <id>`; `ttc due 1 2099-11-10 2099-11-11` → `ttc: unexpected argument: 2099-11-11`; `ttc due 1 2099-11-10 --bogus` → `ttc: unknown option: --bogus`; `ttc due --bogus abc 2026-02-30` → `ttc: unknown option: --bogus`; `ttc due abc 2026-02-30 extra` → `ttc: unexpected argument: extra`. `ttc due 1` → stderr is one line starting `ttc: `, stdout is empty, exit code 1, and `tasks.json` is byte-for-byte unchanged
- [ ] AC-8. `tasks.json` holding the text `not json`: `ttc due 1 2026-02-30` → stderr is exactly `ttc: invalid date: 2026-02-30`; `ttc due 1 2099-11-10` → stderr is one line starting `ttc: cannot read `; each with stdout empty, exit code 1, and `tasks.json` byte-for-byte unchanged. `$TTC_HOME` names a folder that does not exist, then `ttc due 1 2099-11-10` → stderr is exactly `ttc: no task with id 1`, stdout is empty, exit code 1, and afterwards neither `tasks.json` nor the `$TTC_HOME` folder exists
- [ ] AC-9. `ttc help` → stdout is exactly `Usage:` followed by these lines, each indented two spaces, in this order: `ttc help`; `ttc add "<title>" [--due YYYY-MM-DD] [--tag <t>]... [--note "<text>"] [--important]`; `ttc copy <id> [--due YYYY-MM-DD]`; `ttc list [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]`; `ttc done <id>`; `ttc reopen <id>`; `ttc important <id>`; `ttc unimportant <id>`; `ttc postpone <id>`; `ttc due <id> YYYY-MM-DD`; `ttc rename <id> "<title>"`; `ttc delete <id>`; `ttc clean`; `ttc tag <id> +<t> | -<t>`; `ttc note <id> ["<text>" | --clear]`; `ttc export [<file>] [--format json|csv] [--open|--done|--all|--overdue] [--no-due] [--tag <t>] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--search <text>]`; `ttc import <file>`; `ttc stats`; exit code 0
- [ ] AC-10. README.md → a "Changing a due date" section right after "Postponing a task" shows `ttc due <id> YYYY-MM-DD` and states: that it sets the due date of an open or done task, with or without a due date; the date rule (`YYYY-MM-DD`, a real calendar date, past dates allowed, nothing later than `9999-12-31`) and its refusal `ttc: invalid date: <d>`; the success line `Set due date of task <id> to <d>` with one example; that setting the date the task already has succeeds the same way; and that only the due date changes
- [ ] AC-11. `npm test` runs `node:test` tests covering AC-1 to AC-9; the test oracle (`test/support/ttc-model.js`) and the argument fuzzing (`fuzz-gen.js`, `fuzz-harness.js`) cover `ttc due` with a valid date, an invalid date, no date and an extra argument, and its place in the check order, written from `PD-0016`, not from the new code (C5); no test asserts anything about `--clear` on `ttc due` and none fixes the text of the `ttc due <id>` error (`PD-0016` item 12); the tests that assert the whole usage carry the new line; and the perf guard (10,000 tasks, median under 500 ms) runs → all pass; the pull request delivering this story → the CI `test` check passes

## Sequencing

none — on the frontier. `depends_on: [none]`. It builds on the commands at
head `c7e34b5` (INIT-0001 to INIT-0006). `REQ-0017` follows it and extends
the command it adds.

## Technical constraints

From `technical/assessment.md`, round 1 (C8 does not apply: it is option B
only, `PD-0016` item 15):

- **C1**: every changing-command rule applies unchanged: arguments, id and date checked before the lock; under the lock read the list, find the task (`ttc: no task with id <id>`), change, write atomically, print one line, exit 0. A refusal leaves `tasks.json` byte-identical and creates no folder when none exists. The lock's busy failure applies. A failure after the save exits 1 and keeps the change (`PD-0008`). Works on open and done tasks.
- **C2**: the typed date follows the one existing rule, the check `ttc add --due` and `ttc copy --due` use (`src/rules.js` `isValidDate`): `YYYY-MM-DD`, a real calendar date, past allowed, nothing later than `9999-12-31`, else `ttc: invalid date: <d>` with `<d>` as typed. No second date rule. The command reads no clock or `TZ`.
- **C3**: only that task's `due` changes; title, status, tags, note, mark, id, other tasks and list order stay. The set form stores the date as typed. No stored-format change: version stays 4. A file of versions 1–3 is rewritten as version 4 by a change and left as it is by a refusal (`PD-0010` items 1, 4).
- **C4**: help prints exactly one usage line per command. The new line is asserted verbatim, in order, by 4 whole-usage unit files and the oracle, and shown in the README. `test/cli.test.js` asserts the `note` line directly follows the `tag` line, so the new line must not go between them (`PD-0016` item 10 places it after `ttc postpone <id>`).
- **C5**: the CI `test` check gates on the test-owned oracle and fuzz generators. Both gain `due` (model, command list, argv generator covering a date, a bad date, neither, an extra argument), written from `PD-0016`, not from the new code. For this story the generator draws no `--clear` for `ttc due` (`PD-0016` item 12). `due` is not among the fuzz unknown command names and no test asserts it is unknown, so no existing case flips.
- **C6**: the check order is stated (`PD-0016` item 6) and test-asserted wherever a message is fixed. Wording of argument errors is engineering's unless the PD fixes it (`PD-0003` item 2); the fuzz harness checks only the `ttc: ` form.
- **C7**: the perf guard (10,000 tasks, median < 500 ms) is not threatened: one task changed per run. No new case.
- **C9**: `ttc due <id>` alone is an argument error, a command-level check placed with the other argument checks, before the lock. Its wording is engineering's, and must stay true once `REQ-0017` adds `--clear` (`PD-0016` items 1, 12).
- **C10**: everything that follows from the due date follows the new stored value with no change to those parts: `due:` and `!overdue` tokens, `--overdue`, `--due-from`, `--due-to`, `--no-due`, the `ttc stats` overdue count, the export `due` value. Overdue is judged on the local date when those run (`PD-0003` item 6).

## Observability

none — a local, offline command; its stdout/stderr lines and exit code are the
whole operable signal, and the requester ruled out network
(`project/constraints.md` row 3).

## Rollout

`none`. No format change (C3).

## Notes

- Raw request: `product/sources/2026-10-31-requester-request.md`.
- Until `REQ-0017` ships, `--clear` on `ttc due` is an unknown option, by the
  shared argument rules; this story asserts nothing about it (`PD-0016`
  item 12).
- Setting the date the task already has rewrites a file written by older ttc
  as version 4, as a same-title `ttc rename` does (`PD-0016` Consequences).
