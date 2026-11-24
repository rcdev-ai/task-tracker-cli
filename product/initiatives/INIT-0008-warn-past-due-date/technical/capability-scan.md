---
initiative: INIT-0008
type: technical-assessment
title: Platform capability scan — A task added with a due date in the past gets a warning
status: authoritative
revision: 1
owner_role: ROLE-planner
mode: PRODUCT-DISCOVERY
phase_at_assessment: SOLUTION_EXPLORATION
round: 1
assessed_on: 2026-11-24
created: 2026-11-24
updated: 2026-11-24
verdicts: []
constraints: []
questions: []
updated_by_role: ROLE-planner
---

Mode: PRODUCT-DISCOVERY
Initiative: INIT-0008
Scanned: 2026-11-24
Systems scanned: `rcdev-ai/task-tracker-cli` at head `b3945a4` (last `src/`/`bin/` change `8bd11ce`) — `bin/ttc.js`, `src/cli.js`, `src/errors.js`, `src/overdue.js`, `src/rules.js`, `src/commands/` (`add.js`, `copy.js`, `due.js`, `import.js`), `test/` (29 files, 519 tests), `.github/workflows/ci.yml`, `package.json`, `README.md`

All paths are relative to the repository root. ttc is one system: a single
Node.js CLI process over one local JSON file. No service, network or
third-party component exists (`project/constraints.md` rows 1–4, 8).

Checks marked "measured" were run on the CLI with a scratch `TTC_HOME`, on a
scratch copy of the tree with a throwaway prototype of each option (never in
the repository), and by running the full suite on each copy.

## Relevant platform capabilities

| Area | Verdict (exists/partial/absent) | Where it lives (source) | Gap, if partial |
| --- | --- | --- | --- |
| A warning, or any non-failure line on stderr | absent | No command writes to stderr. stderr is reached only by the failure path: `src/cli.js` (unknown command, caught error) and `bin/ttc.js` (`fail()` for stdout errors and uncaught exceptions). Commands receive a stderr handle and none uses it. Measured: `ttc add x --due 2000-01-02` prints `Added task 1`, exit 0, empty stderr. | Nothing in the platform prints a warning. |
| "Today" and "before today" | exists | `src/overdue.js`: one local-date function (local calendar date in the process's time zone, not UTC) and the overdue test "open, has a due date, due before today", by `YYYY-MM-DD` string order (PD-0003 item 6). Used by `list`, filters and `stats`. | — |
| Due-date validation on `add` | exists | `src/commands/add.js` with `src/rules.js` `isValidDate`: real `YYYY-MM-DD` date, past allowed, nothing above `9999-12-31` (PD-0003 item 5; PD-0011 item 6). Checked before the lock. | — |
| `ttc add` order of work | exists | Parse arguments → title → date → tags → note → lock → read → "no task id is left" check → append → atomic write → one stdout line. Every failure before the write throws and prints one `ttc: <message>` line, nothing on stdout, file unchanged (PD-0003 item 11; PD-0004 items 2, 7; PD-0008 item 1). | — |
| Success output is all-or-nothing | exists | `src/cli.js` buffers everything a command writes to stdout and writes it once, after the command returns without error. A failure therefore never prints a partial or success line. | stderr is not buffered: a command writing to stderr writes straight to the process stream, during the command. |
| Failure after the save (PD-0008) | exists | `bin/ttc.js`: a stdout write error (for example EPIPE) becomes `ttc: cannot write output: <code>`, exit 1, at most one failure line (a guard stops a second failure line). Measured: `ttc add x --due 2000-01-02` with stdout closed → stderr `ttc: cannot write output: EPIPE`, exit 1, task saved. | The guard counts only failure lines; it does not know of any other stderr line. |
| stderr that cannot be written | exists | `bin/ttc.js`: any stderr stream error sets exit 1, silently (README "Exit codes": "If stderr itself cannot be written, ttc exits 1 silently"). Measured today: `ttc add x --due 2000-01-02` with stderr closed → `Added task 1`, exit 0 (nothing is written to stderr, so no error). | — |
| stdout and stderr ordering on one terminal | exists (as a fact) | Because stdout is flushed after the command and stderr is not, a stderr line written during a command appears before the stdout line when both go to one terminal or pipe. Measured with a prototype of option A: `ttc: warning: …` then `Added task 1`. | — |
| Other commands that take a typed date | exists | `ttc copy <id> --due` (`src/commands/copy.js`) and `ttc due <id> <date>` (`src/commands/due.js`) use the same `isValidDate` but their own command code; `ttc import` reads a file (`src/commands/import.js`). None shares `add`'s code path. | — |
| Test gate | exists | `package.json`: `npm test` = `npm run test:unit` = `node --test "test/**/*.test.js"`. CI (`.github/workflows/ci.yml`, Node 24, Linux, PRs) runs `npm run lint` (syntax check) then `npm run test:unit`. No oracle, fuzz or perf suite remains (PD-0017). Baseline measured: 519 tests, 519 pass. | — |
| Tests that assert empty stderr or exact stdout after `ttc add` | exists | Per-file helpers (for example `ok`, `assertOk`, `expectOk`) assert `stderr === ''` and/or the exact `Added task <id>\n`. `test/exit-codes.test.js` asserts empty stderr on its success rows (its only `add` success row has no due date) and "at most one `ttc: ` line" on its stdout-closed rows. Nothing outside individual tests (CI step, `npm` script, lint) inspects stderr. | — |
| Tests that add tasks with past due dates | exists | Fixed past dates `2000-01-01`, `2000-01-02`, `2020-01-01` (add, copy, due-clear, export, important, list, postpone, stats), and `2026-10-01` in `test/add.test.js` criteria 3–4, which was in the future when written and has been past since 2026-10-02. Computed dates: `stats.test.js` and `overdue.test.js` add tasks due "yesterday" with `TZ` pinned. | — |
| Time-zone-pinned "today" in tests | exists | `test/postpone.test.js`, `test/stats.test.js`: run the child with `TZ` set, compute today in that zone, and repeat the body if the date changed during the run. `test/overdue.test.js` pins `TZ` per case. | — |
| README coverage of `ttc add` | partial | No "Adding a task" section; `add` appears only through help and the intro. "Exit codes" says exit 1 comes with exactly one stderr line and does not say stderr is empty on exit 0, but every listed stderr line is a failure. "Changing a due date" documents `ttc due <id> YYYY-MM-DD`. | Nowhere to document the warning without a new paragraph or section. |

## CAP- reconciliation

| CAP- id | Registry says | System says | Agrees? | Note |
| --- | --- | --- | --- | --- |
| CAP-0001 | `draft`; predates shipped behaviour | The CLI ships due dates, overdue, `copy --due`, `due` and the rest; no warning on a past due date (agrees: none claimed). | No | Same drift as reported in INIT-0002 to INIT-0007. Reported to the PM; not corrected here. |

## Extension points

| Seam | What it accepts today | Source |
| --- | --- | --- |
| Command context | Each command gets a stdout (buffered) and a stderr (direct) handle | `src/cli.js` |
| Local today / overdue test | One function each, shared by every reader | `src/overdue.js` |
| Process-level output failure handling | One failure line at most; exit 1 on any stdout or stderr stream error | `bin/ttc.js` |
