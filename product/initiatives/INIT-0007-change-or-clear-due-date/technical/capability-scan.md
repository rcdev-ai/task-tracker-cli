---
initiative: INIT-0007
type: technical-assessment
title: Platform capability scan — A task's due date is changed or removed in one short command
status: authoritative
revision: 1
owner_role: ROLE-planner
mode: PRODUCT-DISCOVERY
phase_at_assessment: SOLUTION_EXPLORATION
round: 1
assessed_on: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
verdicts: []
constraints: []
questions: []
updated_by_role: ROLE-planner
---

Mode: PRODUCT-DISCOVERY
Initiative: INIT-0007
Scanned: 2026-10-31
Systems scanned: `rortegalizardo/task-tracker-cli` at head `d439134` (last `src/` change `fc42749`) — `src/args.js`, `src/rules.js`, `src/storage.js`, `src/lock.js`, `src/cli.js`, `src/commands/` (`note.js`, `postpone.js`, `rename.js`, `important.js`, `status.js`, `tag.js`, `add.js`, `copy.js`, `help.js`, `index.js`), `test/` (unit, `test/support/` oracle and fuzz, `test/perf/`), `README.md`

All paths are relative to the repository root. ttc is one system: a single
Node.js CLI process over one local JSON file. No service, network or
third-party component exists (`project/constraints.md` rows 1–4, 8).

## Relevant platform capabilities

| Area | Verdict (exists/partial/absent) | Where it lives (source) | Gap, if partial |
| --- | --- | --- | --- |
| Setting an existing task's due date to a chosen date | absent | No command does it. `ttc due 1 2026-11-10`, `ttc due 1 --clear` and `ttc due` all fail with `ttc: unknown command: due (see ttc help)`, exit 1 (checked on the CLI at head `d439134`). `ttc postpone` moves a date by its own rule and refuses a task with no date (`src/commands/postpone.js`); `ttc copy --due` dates a new task only (`src/commands/copy.js`). | Nothing in the platform sets or removes an existing task's due date. |
| Removing a due date | absent | Nothing writes a `null` due value except `ttc add` without `--due` (`src/commands/add.js`); `ttc copy` keeps the original's value (`src/commands/copy.js`). | — |
| "No due date" as stored data | exists | `src/storage.js` layout comment and read check: every task in format versions 1–4 holds `due` as `null` or a valid `YYYY-MM-DD`. Any other value (for example `""`) makes the whole file unreadable (`ttc: cannot read <path>: <reason>`; PD-0004 item 8). | — |
| One due-date rule | exists | `src/rules.js` `isValidDate`: `YYYY-MM-DD`, a real Gregorian date, past allowed; the four-digit form caps it at `9999-12-31` (PD-0011 item 6). Used as-is by `ttc add --due` and `ttc copy --due`, both refusing with `ttc: invalid date: <d>`, `<d>` as typed. Checked: `ttc copy 1 --due 10000-01-01` → `ttc: invalid date: 10000-01-01`; `ttc add t --due 0000-01-01` is accepted. | — |
| A value form plus a `--clear` form on one command | exists | `src/commands/note.js`: `ttc note <id> ["<text>" \| --clear]`. Value and `--clear` together → `ttc: note text and --clear cannot be combined`; `ttc note <id>` alone shows the note (read-only, no lock, no write). Set writes unconditionally and prints `Set note on task <id>`; `--clear` on a task with no note prints `Task <id> has no note`, exit 0, no write. | — |
| An either-or required argument in a usage line | exists | `src/commands/tag.js`: `ttc tag <id> +<t> \| -<t>` (no brackets: one of the two is required). `ttc tag 1` → `ttc: missing argument: +<t>\|-<t>`. | — |
| Same-value precedents | exists | Value-setting forms write and print the normal success line even when nothing differs: `ttc rename` to the same title (PD-0003 item 9; `src/commands/rename.js`) and `ttc note <id> "<text>"` with the same text (`src/commands/note.js`). On/off and membership forms check first and never write on a no-op: `done`/`reopen`, `important`/`unimportant`, `tag +/-`, `note --clear` (`src/commands/status.js`, `important.js`, `tag.js`, `note.js`). | — |
| No-op and older files | exists | Checked on a version 3 file: `ttc note 2 --clear` (no note) leaves it version 3, byte-identical; `ttc rename 1 "<same title>"` rewrites it as version 4 (PD-0010 items 1, 4). | — |
| Changing-command skeleton | exists | `parseArgs` (argv-order errors) → `parseId` → value checks → `withLock` (`src/lock.js`; busy after a 10-second wait) → `readList` → task lookup (`ttc: no task with id <id>`) → change → `writeList` (atomic, owner-only) → one stdout line; `src/cli.js` buffers stdout so nothing prints on failure (PD-0003 items 2, 10, 11; PD-0004 items 2–4, 7; PD-0008). Checked: with no `tasks.json` and no folder, `ttc postpone 1` and `ttc note 1 --clear` print `ttc: no task with id 1`, exit 1, and create nothing. | — |
| Argument parser | exists | `src/args.js`: only an argument starting with `--` is an option, so a typed date is always a positional; exact option names; `[<name>]` positionals are optional, others required (`missing argument: <name>`); an extra positional → `unexpected argument: <arg>`. It cannot express "one of a positional or an option is required": `note` and any "date or `--clear`" form need a command-level check. | — |
| What follows from the due date | exists | Computed from the stored value on every read: `due:` and `!overdue` tokens (`src/commands/list.js`, `src/overdue.js`), `--overdue`, `--due-from`, `--due-to`, `--no-due` (`src/filter.js`), `ttc stats` overdue count, export `due` (PD-0003 items 6, 8; PD-0011 item 9; PD-0014). Nothing caches it. | — |
| Help usage | exists | `src/commands/help.js` prints exactly one usage line per registry entry, in registry order (`src/commands/index.js`; PD-0003 item 12). 17 lines today; `ttc postpone <id>` sits between `ttc unimportant <id>` and `ttc rename <id> "<title>"`. | — |
| Tests that assert usage text | exists | Whole usage, verbatim and in order: `test/clean.test.js`, `copy.test.js`, `important.test.js`, `postpone.test.js` and the oracle's `USAGE` (`test/support/ttc-model.js`). `test/cli.test.js` asserts the `note` line directly follows the `tag` line. README shows each command's line in its section. | — |
| Model-based robustness tests | exists | `test/support/ttc-model.js` restates every command from the PD text and never requires `src/`; `test/support/fuzz-gen.js` holds a `COMMANDS` list (17 names) driving both argument cases and damaged-file cases, a per-command argv generator, and `UNKNOWN_NAMES` (does not contain `due`). `test/support/fuzz-harness.js` compares exit status, stdout and files; stderr is checked as one `ttc: ` line unless a focused case fixes the text. No test asserts that `ttc due` is an unknown command. | — |
| Perf guard | exists | `test/perf/add-list.perf.js`: median `ttc add`, `ttc list`, filtered `ttc list` on 10,000 tasks under 500 ms. | — |

## CAP- reconciliation

| CAP- id | Registry says | System says | Agrees? | Note |
| --- | --- | --- | --- | --- |
| CAP-0001 | `draft`, rev 1; "Behavior today: None yet" | The CLI ships notes, search, the important mark, postpone, clean, copy, `--no-due` and the write lock. No command sets or removes an existing task's due date (agrees: none claimed). | No | Same drift as reported in INIT-0002 to INIT-0006. Reported to the PM; not corrected here. |

## Extension points

| Seam | What it accepts today | Source |
| --- | --- | --- |
| Command registry | One module per command, one usage line each, in registry order | `src/commands/index.js`, `help.js` |
| Argument parser | Required / optional positionals, named options with value / no-value flags | `src/args.js` |
| Due-date rule | One shared validity check for a typed date | `src/rules.js` |
| Stored list | Whole-list read, whole-list atomic write under the lock | `src/storage.js`, `src/lock.js` |
| Test oracle and fuzz generators | Independent restatement per command; per-command argv generators | `test/support/ttc-model.js`, `fuzz-gen.js` |

## Data already held

| Data class | Where | Sensitivity (none/personal/financial/regulated) |
| --- | --- | --- |
| Task titles, notes, tags, due dates (or none), status, important mark, ids, next id | `$TTC_HOME/tasks.json` (default `~/.ttc`), owner-only | personal (the user's own task data) |
