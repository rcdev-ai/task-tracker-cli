---
initiative: INIT-0007
type: technical-assessment
title: System impact map — A task's due date is changed or removed in one short command
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
Mapped: 2026-10-31
Options mapped: A (`ttc due <id> YYYY-MM-DD` and `ttc due <id> --clear`; the id alone is an argument error), B (as A, plus `ttc due <id>` alone shows the due date and changes nothing, like `ttc note <id>`)

Both options live in one system: the `ttc` CLI in `rortegalizardo/task-tracker-cli`
(head `d439134`). "System / component" rows are components of that one
program plus the stored file and the test suite that gates CI. Sources are in
`capability-scan.md`.

## Per option

### Option A — set form and `--clear` form; the id alone is an error

| System / component | Current responsibility (source) | What this option requires of it |
| --- | --- | --- |
| Command set | 17 commands; `due` is unknown today (`src/commands/index.js`, `src/cli.js`) | Must gain one changing command, `due`, under every changing-command rule: arguments, id and date checked before the lock; lock; read; task lookup; atomic write; refusal writes nothing; failure after the save exits 1 and keeps the change (PD-0008). Works on open and done tasks. |
| Set form | — | Must store the typed date as the task's due value, on a task with or without one. Must decide, per N1, whether the same date is a no-op (no write) or a normal success (writes). |
| `--clear` form | — | Must store the empty due value (`null`, exactly the value every reader accepts); on a task with none, a no-op that writes nothing (N2). |
| Bare `ttc due <id>` | — | Must be refused as an argument error. The parser cannot require "a date or `--clear`", so the command must check it itself (C9). |
| Due-date rule | One shared check (`src/rules.js`) | Used as-is; no new rule. |
| Argument parser | Exact-name options, positionals (`src/args.js`) | Used as-is. |
| Stored list, read checks, format versions | Format 4; v1–v3 read, upgraded on the next change (`src/storage.js`, PD-0010 item 1) | No change. An older file is rewritten as version 4 by a change, left as it is by a no-op or a refusal. |
| Dependents of the due value | `list` tokens and filters, `stats`, `export` (`src/commands/list.js`, `src/filter.js`, `src/overdue.js`, `stats.js`, `export.js`) | No change: they read the stored value. |
| Help | One line per command (`src/commands/help.js`, `index.js`) | One new line; changes again when the `--clear` story lands (N3, N5). |
| Tests that assert usage text | 4 whole-usage unit files and the oracle; `cli.test.js` adjacency of `tag`/`note` (`capability-scan.md`) | Must gain the line, once per story that changes it. |
| Test oracle and fuzz generators | Per-command restatement and argv generators (`test/support/ttc-model.js`, `fuzz-gen.js`) | Must gain `due` (model, `COMMANDS` list, argv generator with date, bad date, `--clear`, both, neither), written from the PD text. Adding it to `COMMANDS` also puts it into the damaged-file cases. |
| Perf guard | 10,000-task timing of add and list (`test/perf/add-list.perf.js`) | Unaffected; no new case. |
| README | One section per feature | Must gain a section for `ttc due`. |

| Dependency | Direction (upstream/downstream) | Kind (internal/third-party/human) | Note |
| --- | --- | --- | --- |
| `tasks.json` written by older ttc (v1–3) | upstream | human/operational | Read; a change rewrites it as version 4 (one-way, PD-0010 item 4); a no-op or refusal leaves it byte-identical. |
| Missing `tasks.json` / folder | upstream | human/operational | Read as an empty list: `ttc: no task with id <id>`, exit 1, nothing created (checked for `postpone` and `note`). |
| Another ttc holding the lock | upstream | internal | The existing busy failure after 10 seconds; nothing written. |
| Scripts that parse `ttc help` | downstream | human/operational | One new line; lines below it shift down. |
| Scripts that run `ttc due ...` | downstream | human/operational | Today an unknown command, exit 1; afterwards a real command. No other invocation changes. |
| CI `test` check (Node 24, Linux) | downstream gate | internal | Unit, fuzz and perf suites must pass (constraint 7). |
| System clock and `TZ` | upstream | human/operational | Not read by `ttc due`. Read later by `!overdue`, `--overdue` and `stats`, as today. |

| Data crossing a boundary | Class | Regime note |
| --- | --- | --- |
| The user's own task data in `tasks.json` (one due value changed) | personal | Same file, same owner-only permissions, same atomic write as every changing command; no network (constraint 3). |

### Option B — as A, plus `ttc due <id>` shows the due date

| System / component | Current responsibility (source) | What this option requires of it |
| --- | --- | --- |
| Command set | As in A | As in A. |
| Set form | As in A | As in A. |
| `--clear` form | As in A | As in A. |
| Bare `ttc due <id>` | — | Must print the task's due date (`YYYY-MM-DD`) or a "has no due date" line, exit 0, through a read-only path: no lock, no write, no folder created, an older file left as it is, an unreadable file failing as today, a missing task `ttc: no task with id <id>` — exactly as `ttc note <id>` (C8). |
| Due-date rule, parser, stored list, dependents | As in A | As in A. |
| Help | As in A | One new line with the date in brackets (N3). |
| Tests that assert usage text | As in A | As in A. |
| Test oracle and fuzz generators | As in A | As in A, plus the show form (read-only, no write on any file version). |
| Perf guard | As in A | As in A. |
| README | As in A | As in A, plus the show form. |

| Dependency | Direction (upstream/downstream) | Kind (internal/third-party/human) | Note |
| --- | --- | --- | --- |
| `tasks.json` written by older ttc (v1–3) | upstream | human/operational | As in A; the show form never rewrites it. |
| Missing `tasks.json` / folder | upstream | human/operational | As in A, for the show form too. |
| Another ttc holding the lock | upstream | internal | Set and clear as in A. The show form takes no lock, so it never waits or reports busy; it reads a whole old or whole new file (atomic replace). |
| Scripts that parse `ttc help` | downstream | human/operational | As in A. |
| Scripts that run `ttc due ...` | downstream | human/operational | As in A; `ttc due <id>` prints a value scripts may parse. |
| CI `test` check | downstream gate | internal | As in A. |
| System clock and `TZ` | upstream | human/operational | As in A. |

| Data crossing a boundary | Class | Regime note |
| --- | --- | --- |
| The user's own task data in `tasks.json` (one due value changed) | personal | As in A. |
| One task's due date on stdout | personal | A value `ttc list` already prints; no new datum. |

## Not impacted

| System | Why a reader might expect it | Why it is not impacted |
| --- | --- | --- |
| Stored format | "Does the format change?" (N6) | The existing `due` field already holds a date or `null` in every version; no new field, so no new version (PD-0010 item 1). |
| `ttc add`, `ttc copy`, `ttc postpone` | They give or move due dates | Out of scope (A12); they keep their rules. `due` uses the same date check, not a copy of it. |
| `ttc list`, filters, `ttc stats`, `ttc export` | They show or use the due date | They read the stored value on every run; a changed value flows through with no code change (PD-0003 item 6; PD-0011 item 9; PD-0014). |
| `ttc import` | Reads export files | Unchanged; a list with changed or removed dates exports and imports as any list does. |
| Write lock, atomic write, permissions | — | Used as every changing command uses them; nothing new. |
| Network, other users, other OS | — | None exist (constraints 3, 8; PD-0004 item 5). |
