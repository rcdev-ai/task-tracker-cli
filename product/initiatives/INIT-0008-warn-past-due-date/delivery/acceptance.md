# Acceptance — INIT-0008

Checked on 2026-11-24 against origin/main at 04b8ff9 (merge of PR #66), clean worktree, real `bin/ttc.js`. No build step (Node built-ins only).

| REQ | criterion | command | observed output | pass/fail |
| --- | --- | --- | --- | --- |
| REQ-0025 | AC-1 add | ttc add "Pay rent" --due 2000-01-02 | stdout="Added task 1\n" stderr="ttc: warning: due date 2000-01-02 is in the past\n" exit=0 version=4 nextId=2 tasks=[{"id":1,"title":"Pay rent","status":"open","due":"2000-01-02","tags":[],"note":null,"important":false}] | pass |
| REQ-0025 | AC-1 list | ttc list | stdout="#1 [ ] Pay rent due:2000-01-02 !overdue\n" stderr="" exit=0 | pass |
| REQ-0025 | AC-2 | ttc add --tag home --due 1999-12-31 "Fix bike" --note "chain" --important | stdout="Added task 2\n" stderr="ttc: warning: due date 1999-12-31 is in the past\n" exit=0 task2={"id":2,"title":"Fix bike","status":"open","due":"1999-12-31","tags":["home"],"note":"chain","important":true} | pass |
| REQ-0025 | AC-3 | ttc add "Pay rent" --due 2099-12-31; ttc add "Call mom" | 1: stdout="Added task 1\n" stderr="" exit=0; 2: stdout="Added task 2\n" stderr="" exit=0 | pass |
| REQ-0025 | AC-4 Pacific/Pago_Pago | TZ=Pacific/Pago_Pago ttc add "Pay rent" --due 2026-11-23; ttc add "Call mom" --due 2026-11-22 | 1: stdout="Added task 1\n" stderr="" exit=0; 2: stdout="Added task 2\n" stderr="ttc: warning: due date 2026-11-22 is in the past\n" exit=0 | pass |
| REQ-0025 | AC-4 Pacific/Kiritimati | TZ=Pacific/Kiritimati ttc add "Pay rent" --due 2026-11-24; ttc add "Call mom" --due 2026-11-23 | 1: stdout="Added task 1\n" stderr="" exit=0; 2: stdout="Added task 2\n" stderr="ttc: warning: due date 2026-11-23 is in the past\n" exit=0 | pass |
| REQ-0025 | AC-5 | ttc add "Pay rent" --due 2000-01-02 --tag "a b" | stdout="" stderr="ttc: invalid tag: a b\n" exit=1 bytes-unchanged=true | pass |
| REQ-0025 | AC-5 | ttc add "" --due 2000-01-02 | stdout="" stderr="ttc: title must be one non-empty line\n" exit=1 bytes-unchanged=true | pass |
| REQ-0025 | AC-5 | ttc add "Pay rent" --due 2000-01-02 --due 2000-01-03 | stdout="" stderr="ttc: option given twice: --due\n" exit=1 bytes-unchanged=true | pass |
| REQ-0025 | AC-5 | ttc add "Pay rent" --due 2000-02-30 | stdout="" stderr="ttc: invalid date: 2000-02-30\n" exit=1 bytes-unchanged=true | pass |
| REQ-0025 | AC-5 corrupt | tasks.json="not json"; ttc add "Pay rent" --due 2000-01-02 | stdout="" stderr="ttc: cannot read /Users/ortega/Desktop/Projects/task-tracker-cli/.scratch/data/s6/data/tasks.json: not valid JSON\n" exit=1 bytes-unchanged=true | pass |
| REQ-0025 | AC-6 | ttc add "Pay rent" --due 2000-01-02 (stdout closed); ttc list | add: stderr="ttc: cannot write output: EPIPE\n" exit=1 signal=null; list: stdout="#1 [ ] Pay rent due:2000-01-02 !overdue\n" exit=0 | pass |
| REQ-0025 | AC-7 | ttc add "Pay rent" --due 2000-01-02 (stderr closed); ttc list; ttc add "Call mom" --due 2099-12-31 (stderr closed) | past: exit=1 signal=null; list: stdout="#1 [ ] Pay rent due:2000-01-02 !overdue\n"; future: stdout="Added task 1\n" exit=0 | pass |
| REQ-0025 | AC-8 | ttc copy 1 --due 2000-01-03 | stdout="Copied task 1 as task 2\n" stderr="" exit=0 | pass |
| REQ-0025 | AC-8 | ttc copy 1 | stdout="Copied task 1 as task 3\n" stderr="" exit=0 | pass |
| REQ-0025 | AC-8 | ttc due 1 1999-01-01 | stdout="Set due date of task 1 to 1999-01-01\n" stderr="" exit=0 | pass |
| REQ-0025 | AC-8 | ttc import /Users/ortega/Desktop/Projects/task-tracker-cli/.scratch/data/s10/x.json | stdout="Imported 1 tasks from /Users/ortega/Desktop/Projects/task-tracker-cli/.scratch/data/s10/x.json\n" stderr="" exit=0 | pass |
| REQ-0025 | AC-9 README "Adding a task" | `grep -n "Adding a task" -A12 README.md`; `grep -n "Exit codes" -A7 README.md` | Section shows `ttc add "<title>" [--due YYYY-MM-DD] [--tag <t>]... [--note "<text>"] [--important]`; states warning `ttc: warning: due date <d> is in the past` on stderr for a date before today (local date), task still added, exit 0, no warning for today or later or no date, `ttc due <id> YYYY-MM-DD` changes the date. Exit codes: "Exit code 0 can come with the one `ttc: warning: due date <d> is in the past` line on stderr for `ttc add`. The exit code, not stderr, tells success from failure." | pass |
| REQ-0025 | AC-10 npm test + CI | `npm test`; `gh pr checks 66` | `ℹ tests 521 ℹ pass 521 ℹ fail 0`; `test pass 42s` (PR #65 required check `test=SUCCESS` in release.md) | pass |
