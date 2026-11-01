---
id: ACC-INIT-0007
type: acceptance
initiative: INIT-0007
checked_on: 2026-11-01
checkout: origin/main 7779356 (clean worktree, node v26.11.1)
---

# Acceptance — INIT-0007

Each criterion exercised with the real CLI (`node bin/ttc.js`, fresh `$TTC_HOME` per scenario) from a clean checkout of `main` as merged. Observed output is verbatim; CSV lines end `\r\n` as the existing export always does, shown here as line breaks.

Note — REQ-0016 AC-9 names the usage line `ttc due <id> YYYY-MM-DD`; REQ-0017 AC-8 replaces it with `ttc due <id> YYYY-MM-DD | --clear` by design, so the REQ-0016 AC-9 row checks the final-state usage (all other 17 lines identical, in order).

| REQ | criterion | command | observed output | pass/fail |
| --- | --- | --- | --- | --- |
| REQ-0016 | AC-1 | ttc due 1 2099-11-10 | out="Set due date of task 1 to 2099-11-10" err="" rc=0 | pass |
| REQ-0016 | AC-1 | ttc list | out="#1 [ ] Pay rent due:2099-11-10 +bills\n#2 [ ] Call mom +home" err="" rc=0 | pass |
| REQ-0016 | AC-2 | ttc due 002 2099-12-24 | out="Set due date of task 2 to 2099-12-24" err="" rc=0 | pass |
| REQ-0016 | AC-2 | ttc list | out="#1 [ ] Pay rent due:2099-11-10 +bills\n#2 [ ] Call mom due:2099-12-24 +home" err="" rc=0 | pass |
| REQ-0016 | AC-2 | ttc list --no-due | out="No tasks." err="" rc=0 | pass |
| REQ-0016 | AC-2 | ttc due 2 9999-12-31 | out="Set due date of task 2 to 9999-12-31" err="" rc=0 | pass |
| REQ-0016 | AC-3 | ttc due 3 2000-01-02 | out="Set due date of task 3 to 2000-01-02" err="" rc=0 | pass |
| REQ-0016 | AC-3 | ttc list --done | out="#3 [x] Fix bike due:2000-01-02" err="" rc=0 | pass |
| REQ-0016 | AC-3 | ttc due 1 2000-01-02 | out="Set due date of task 1 to 2000-01-02" err="" rc=0 | pass |
| REQ-0016 | AC-3 | ttc list --overdue | out="#1 [ ] Pay rent due:2000-01-02 !overdue +bills" err="" rc=0 | pass |
| REQ-0016 | AC-3 | ttc list --due-from 2099-01-01 | out="#2 [ ] Call mom due:9999-12-31 +home" err="" rc=0 | pass |
| REQ-0016 | AC-3 | ttc stats | out="open: 2\ndone: 1\noverdue: 1" err="" rc=0 | pass |
| REQ-0016 | AC-3 | ttc export --format csv | out="id,title,status,due,tags,note\n1,Pay rent,open,2000-01-02,bills,\n2,Call mom,open,9999-12-31,home,\n3,Fix bike,done,2000-01-02,," err="" rc=0 | pass |
| REQ-0016 | AC-4 | ttc due 1 2099-11-10 | out="Set due date of task 1 to 2099-11-10" err="" rc=0 | pass |
| REQ-0016 | AC-4 | ttc due 2 2099-10-01 | out="Set due date of task 2 to 2099-10-01" err="" rc=0 | pass |
| REQ-0016 | AC-4 | tasks.json after (v3 migration) | {"version":4,"nextId":4,"tasks":[{"id":1,"title":"Call mom","status":"open","due":null,"tags":[],"note":null,"important":false},{"id":2,"title":"Pay rent","status":"open","due":"2099-10-01","tags":["bills"],"note":"by card","important":false},{"id":3,"title":"Fix bike","status":"done","due":null,"tags":["home"],"note":"chain","important":false}]} | pass |
| REQ-0016 | AC-4 | ttc due 1 2099-10-01 | out="Set due date of task 1 to 2099-10-01" err="" rc=0 | pass |
| REQ-0016 | AC-4 | tasks.json after (v1 migration) | {"version":4,"nextId":2,"tasks":[{"id":1,"title":"Pay rent","status":"open","due":"2099-10-01","tags":[],"note":null,"important":false}]} | pass |
| REQ-0016 | AC-5 | export before/after, diff | before==after with date swapped: true | pass |
| REQ-0016 | AC-5 | ttc list | out="#1 [ ] Pay rent due:2000-01-02 !overdue !important +home\n#2 [ ] Buy milk due:2099-06-01" err="" rc=0 | pass |
| REQ-0016 | AC-6 | ttc due 1 2026-02-30 | out="" err="ttc: invalid date: 2026-02-30" rc=1 unchanged=true | pass |
| REQ-0016 | AC-6 | ttc due 1 2026-1-05 | out="" err="ttc: invalid date: 2026-1-05" rc=1 unchanged=true | pass |
| REQ-0016 | AC-6 | ttc due 1 10000-01-01 | out="" err="ttc: invalid date: 10000-01-01" rc=1 unchanged=true | pass |
| REQ-0016 | AC-6 | ttc due 1 tomorrow | out="" err="ttc: invalid date: tomorrow" rc=1 unchanged=true | pass |
| REQ-0016 | AC-6 | ttc due abc 2099-11-10 | out="" err="ttc: invalid task id: abc" rc=1 unchanged=true | pass |
| REQ-0016 | AC-6 | ttc due 0 2099-11-10 | out="" err="ttc: invalid task id: 0" rc=1 unchanged=true | pass |
| REQ-0016 | AC-6 | ttc due 2099-11-10 1 | out="" err="ttc: invalid task id: 2099-11-10" rc=1 unchanged=true | pass |
| REQ-0016 | AC-6 | ttc due 99 2099-11-10 | out="" err="ttc: no task with id 99" rc=1 unchanged=true | pass |
| REQ-0016 | AC-6 | ttc due abc 2026-02-30 | out="" err="ttc: invalid task id: abc" rc=1 unchanged=true | pass |
| REQ-0016 | AC-6 | ttc due 99 2026-02-30 | out="" err="ttc: invalid date: 2026-02-30" rc=1 unchanged=true | pass |
| REQ-0016 | AC-7 | ttc due | out="" err="ttc: missing argument: <id>" rc=1 unchanged=true | pass |
| REQ-0016 | AC-7 | ttc due 1 2099-11-10 2099-11-11 | out="" err="ttc: unexpected argument: 2099-11-11" rc=1 unchanged=true | pass |
| REQ-0016 | AC-7 | ttc due 1 2099-11-10 --bogus | out="" err="ttc: unknown option: --bogus" rc=1 unchanged=true | pass |
| REQ-0016 | AC-7 | ttc due --bogus abc 2026-02-30 | out="" err="ttc: unknown option: --bogus" rc=1 unchanged=true | pass |
| REQ-0016 | AC-7 | ttc due abc 2026-02-30 extra | out="" err="ttc: unexpected argument: extra" rc=1 unchanged=true | pass |
| REQ-0016 | AC-7 | ttc due 1 | out="" err="ttc: no due date change specified" rc=1 unchanged=true | pass |
| REQ-0016 | AC-8 | ttc due 1 2026-02-30 | out="" err="ttc: invalid date: 2026-02-30" rc=1 unchanged=true | pass |
| REQ-0016 | AC-8 | ttc due 1 2099-11-10 | out="" err="ttc: cannot read /Users/ortega/Desktop/Projects/task-tracker-cli/.scratch/home-UW9AWx/tasks.json: not valid JSON" rc=1 unchanged=true | pass |
| REQ-0016 | AC-8 | TTC_HOME missing: ttc due 1 2099-11-10 | out="" err="ttc: no task with id 1" rc=1 folder_exists=false | pass |
| REQ-0016 | AC-9 | ttc help (final state after REQ-0017: `ttc due <id> YYYY-MM-DD \| --clear` replaces the REQ-0016 line, per REQ-0017 AC-8) | help differs from REQ-0016 text only on the due line: true; rc=0 | pass |
| REQ-0016 | AC-10 | README.md "Changing a due date" after "Postponing a task" | section_found=true directly_after_postponing=true missing_phrases=[] | pass |
| REQ-0016 | AC-10 | README mentions: past dates allowed | match=true | pass |
| REQ-0016 | AC-10 | README mentions: same date succeeds | match=true | pass |
| REQ-0016 | AC-10 | README mentions: only due changes | match=true | pass |
| REQ-0017 | AC-1 | ttc due 1 --clear | out="Cleared due date of task 1" err="" rc=0 | pass |
| REQ-0017 | AC-1 | ttc list | out="#1 [ ] Pay rent +bills\n#2 [ ] Call mom +home" err="" rc=0 | pass |
| REQ-0017 | AC-1 | ttc list --no-due | out="#1 [ ] Pay rent +bills\n#2 [ ] Call mom +home" err="" rc=0 | pass |
| REQ-0017 | AC-1 | ttc list --overdue | out="No tasks." err="" rc=0 | pass |
| REQ-0017 | AC-1 | ttc stats | out="open: 2\ndone: 1\noverdue: 0" err="" rc=0 | pass |
| REQ-0017 | AC-2 | ttc due --clear 003 | out="Cleared due date of task 3" err="" rc=0 | pass |
| REQ-0017 | AC-2 | ttc list --done | out="#3 [x] Fix bike" err="" rc=0 | pass |
| REQ-0017 | AC-2 | tasks.json | {"version":4,"nextId":4,"tasks":[{"id":1,"title":"Pay rent","status":"open","due":null,"tags":["bills"],"note":null,"important":false},{"id":2,"title":"Call mom","status":"open","due":null,"tags":["home"],"note":null,"important":false},{"id":3,"title":"Fix bike","status":"done","due":null,"tags":[],"note":null,"important":false}]} | pass |
| REQ-0017 | AC-2 | ttc export --format csv | out="id,title,status,due,tags,note\n1,Pay rent,open,,bills,\n2,Call mom,open,,home,\n3,Fix bike,done,,," err="" rc=0 | pass |
| REQ-0017 | AC-2 | ttc due 1 2099-11-10 | out="Set due date of task 1 to 2099-11-10" err="" rc=0 | pass |
| REQ-0017 | AC-2 | ttc list | out="#1 [ ] Pay rent due:2099-11-10 +bills\n#2 [ ] Call mom +home" err="" rc=0 | pass |
| REQ-0017 | AC-3 | ttc due 2 --clear | out="Task 2 has no due date" err="" rc=0 | pass |
| REQ-0017 | AC-3 | tasks.json unchanged after no-op clear | unchanged=true | pass |
| REQ-0017 | AC-3 | ttc due 1 --clear | out="Task 1 has no due date" err="" rc=0 | pass |
| REQ-0017 | AC-3 | tasks.json (v3) byte-for-byte unchanged | unchanged=true | pass |
| REQ-0017 | AC-4 | ttc due 2 --clear | out="Cleared due date of task 2" err="" rc=0 | pass |
| REQ-0017 | AC-4 | tasks.json after (v3 migration) | {"version":4,"nextId":4,"tasks":[{"id":1,"title":"Call mom","status":"open","due":null,"tags":[],"note":null,"important":false},{"id":2,"title":"Pay rent","status":"open","due":null,"tags":["bills"],"note":"by card","important":false},{"id":3,"title":"Fix bike","status":"done","due":null,"tags":["home"],"note":"chain","important":false}]} | pass |
| REQ-0017 | AC-5 | export before/after, diff | before==after with due "2099-12-30"->null: true | pass |
| REQ-0017 | AC-5 | ttc list | out="#1 [ ] Pay rent !important +home\n#2 [ ] Buy milk due:2099-06-01" err="" rc=0 | pass |
| REQ-0017 | AC-6 | ttc due 3 2099-11-10 --clear | out="" err="ttc: due date and --clear cannot be combined" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due --clear 3 2099-11-10 | out="" err="ttc: due date and --clear cannot be combined" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due 3 2026-02-30 --clear | out="" err="ttc: due date and --clear cannot be combined" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due 99 2099-11-10 --clear | out="" err="ttc: due date and --clear cannot be combined" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due abc 2099-11-10 --clear | out="" err="ttc: invalid task id: abc" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due abc --clear | out="" err="ttc: invalid task id: abc" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due 99 --clear | out="" err="ttc: no task with id 99" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due 1 --clear --clear | out="" err="ttc: option given twice: --clear" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due --clear | out="" err="ttc: missing argument: <id>" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due 1 2099-11-10 x --clear | out="" err="ttc: unexpected argument: x" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due 1 --clear --bogus | out="" err="ttc: unknown option: --bogus" rc=1 unchanged=true | pass |
| REQ-0017 | AC-6 | ttc due 1 | out="" err="ttc: no due date change specified" rc=1 unchanged=true | pass |
| REQ-0017 | AC-7 | ttc due 1 2099-11-10 --clear | out="" err="ttc: due date and --clear cannot be combined" rc=1 unchanged=true | pass |
| REQ-0017 | AC-7 | ttc due 1 --clear | out="" err="ttc: cannot read /Users/ortega/Desktop/Projects/task-tracker-cli/.scratch/home-lFgGY7/tasks.json: not valid JSON" rc=1 unchanged=true | pass |
| REQ-0017 | AC-7 | TTC_HOME missing: ttc due 1 --clear | out="" err="ttc: no task with id 1" rc=1 folder_exists=false | pass |
| REQ-0017 | AC-8 | ttc help | stdout equals the expected 18-line usage exactly | pass |
| REQ-0017 | AC-9 | README section contains `ttc due <id> YYYY-MM-DD \| --clear` | present=true | pass |
| REQ-0017 | AC-9 | README section contains `Cleared due date of task <id>` | present=true | pass |
| REQ-0017 | AC-9 | README section contains `Task <id> has no due date` | present=true | pass |
| REQ-0017 | AC-9 | README section contains `ttc: due date and --clear cannot be combined` | present=true | pass |
| REQ-0017 | AC-9 | README section contains `--no-due` | present=true | pass |
| REQ-0017 | AC-9 | README section contains `--clear` | present=true | pass |
| REQ-0016 | AC-11 | `npm test` at origin/main 7779356 | tests 530 pass 530 fail 0 (unit); perf: tests 4 pass 4 fail 0, ttc add median 89.3 ms, list 71.7 ms, filtered list 70.1 ms (limit 500 ms); rc=0 | pass |
| REQ-0016 | AC-11 | CI `test` check on delivering PRs (`gh pr view`) | #50 test=SUCCESS (integrated T1–T4, TTC-1) | pass |
| REQ-0016 | AC-11 | test files for `ttc due` and oracle/fuzz | test/due.test.js present; `due` in test/support/ttc-model.js and fuzz-gen.js COMMANDS; fuzz-harness.js generic over fuzz-gen. The "no test asserts anything about `--clear` on `ttc due`" clause is superseded by REQ-0017 (test/due-clear.test.js). | pass |
| REQ-0017 | AC-10 | `npm test` at origin/main 7779356 | same run as above: 530/530 unit, 4/4 perf, rc=0; REQ-0016 tests still pass | pass |
| REQ-0017 | AC-10 | CI `test` check on delivering PR | #58 test=SUCCESS | pass |
| REQ-0017 | AC-10 | test files | test/due-clear.test.js present; ttc-model.js has `DUE = new Map([['--clear', {}]])` and usage line with `--clear` | pass |
