---
initiative: INIT-0008
type: technical-assessment
title: System impact map — A task added with a due date in the past gets a warning
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
Mapped: 2026-11-24
Options mapped: A (warning on stderr, `ttc: warning: due date <d> is in the past`; stdout exactly `Added task <id>`), B (warning as a second stdout line, `Warning: due date <d> is in the past`; stderr empty)

Both options live in one system: the `ttc` CLI in `rcdev-ai/task-tracker-cli`
(head `b3945a4`). Rows are components of that one program plus the test
suite that gates CI. Sources are in `capability-scan.md`.

## Per option

### Option A — warning on stderr

| System / component | Current responsibility (source) | What this option requires of it |
| --- | --- | --- |
| `ttc add` | Validates, saves, prints `Added task <id>` (`src/commands/add.js`) | Must decide "before today" from the validated date with the existing local-date rule, and produce the warning only for a task that was saved. |
| Local today / overdue test | One local-date rule (`src/overdue.js`; PD-0003 item 6) | Used as-is; no second rule. |
| Output path (buffered stdout, direct stderr) | stdout all-or-nothing after success; stderr direct (`src/cli.js`) | Must not let the warning appear when the command then fails, and (if the PD fixes an order) must put it after the confirmation. Today a stderr line written during the command comes out before the confirmation and before the outcome of the stdout write is known (measured). |
| Process-level failure handling | ≤1 failure line; exit 1 on any stdout/stderr stream error (`bin/ttc.js`; PD-0008) | Must keep "exactly one stderr line" on a failure after the save: measured with a prototype, stdout closed + past date gives two stderr lines (warning, then `ttc: cannot write output: EPIPE`). With stderr closed, the existing handler turns the unwritable warning into exit 1 with the task saved (measured); the PD must accept or change that (N2). Every command passes through this component. |
| Other commands (`copy --due`, `due`, `import`, all others) | Own code; no stderr on success | No change (scope A1, A8). |
| Help, stored data, data format | — | No change. |
| Test suite (CI `test`) | 519 tests pass at head | 17 tests in 7 files assert empty stderr after adding a task with a past date and change (measured: `add` 3, `copy` 2, `due-clear` 4, `export` 2, `important` 3, `list` 2, `postpone` 1). |
| README | No "Adding a task" section; "Exit codes" lists only failure lines on stderr | Must document the warning, and say that exit 0 can come with this one stderr line. |

| Dependency | Direction (upstream/downstream) | Kind (internal/third-party/human) | Note |
| --- | --- | --- | --- |
| System clock and `TZ` | upstream | human/operational | Read by `ttc add` for the first time (today only by `list`, filters, `stats`). |
| Scripts or wrappers that read `ttc add` stderr, or treat any stderr output as failure | downstream | human/operational | Unknown outside the repo; inside it, only tests. Exit code stays the success signal. |
| Scripts that read `ttc add` stdout | downstream | human/operational | Unchanged. |
| CI `test` check (Node 24, Linux) | downstream gate | internal | Lint + unit tests only; nothing assumes stderr is empty except per-test helpers. |

| Data crossing a boundary | Class | Regime note |
| --- | --- | --- |
| The due date the user typed, echoed on stderr | personal | The user's own value, echoed as `ttc: invalid date: <d>` already does; no new datum, no file change, no network. |

### Option B — warning as a second stdout line

| System / component | Current responsibility (source) | What this option requires of it |
| --- | --- | --- |
| `ttc add` | As in A | As in A, writing the second line through the existing buffered stdout. |
| Local today / overdue test | As in A | As in A. |
| Output path | As in A | No change: both lines are written together after the command succeeds, or neither is (measured). |
| Process-level failure handling | As in A | No change: stdout closed → PD-0008 exactly as today (one failure line, exit 1, task saved); stderr closed → exit 0, nothing lost (measured). |
| Other commands, help, stored data, format | As in A | As in A. |
| Test suite (CI `test`) | As in A | 7 tests in 2 files assert the exact stdout `Added task <id>\n` after a past date and change (measured: `add` 3, `due-clear` 4). |
| README | As in A | Must document the warning; "Exit codes" unchanged. |
| Success-output rule | One stdout line per changing command (PD-0003 item 10) | Amended for `ttc add` with a past date (two lines). |

| Dependency | Direction (upstream/downstream) | Kind (internal/third-party/human) | Note |
| --- | --- | --- | --- |
| System clock and `TZ` | upstream | human/operational | As in A. |
| Scripts that read `ttc add` stdout (take the id, count lines, compare the line) | downstream | human/operational | Unknown outside the repo; they get two lines for a past date. |
| CI `test` check | downstream gate | internal | As in A. |

| Data crossing a boundary | Class | Regime note |
| --- | --- | --- |
| The due date the user typed, echoed on stdout | personal | As in A, on stdout. |

## Not impacted

| System | Why a reader might expect it | Why it is not impacted |
| --- | --- | --- |
| `ttc copy --due`, `ttc due` | They take a typed date under the same rule | Own command code; out of scope (A1). They share only the date check. |
| `ttc import` | Can load past dates | Out of scope (A8); own code path. |
| `ttc list`, filters, `stats`, `export` | Show `!overdue` | Read the stored value as today; the warning stores nothing. |
| Stored format, lock, atomic write, permissions | — | Nothing stored changes; the save happens exactly as today. |
| `ttc help` | — | Usage line unchanged (no new option). |
| Network, other users, other OS | — | None exist (constraints 3, 8; PD-0004 item 5). |
