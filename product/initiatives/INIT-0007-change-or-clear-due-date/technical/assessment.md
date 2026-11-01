---
initiative: INIT-0007
type: technical-assessment
title: Technical assessment — A task's due date is changed or removed in one short command
status: authoritative
revision: 1
owner_role: ROLE-planner
mode: PRODUCT-DISCOVERY
phase_at_assessment: SOLUTION_EXPLORATION
round: 1
assessed_on: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
verdicts:
  - { option: A, verdict: feasible-with-constraints, band: contained }
  - { option: B, verdict: feasible-with-constraints, band: contained }
constraints: [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]
questions: []
updated_by_role: ROLE-planner
---

Mode: PRODUCT-DISCOVERY
Initiative: INIT-0007
Phase at assessment: SOLUTION_EXPLORATION
Assessed: 2026-10-31
Round: 1

Evidence: `capability-scan.md` and `impact.md` (this folder, same date), code
at head `d439134` (last `src/` change `fc42749`), CLI checks in a scratch
`TTC_HOME`, `project/constraints.md` rows 1–9, PD-0003 items 2, 5, 6, 9–13,
PD-0004 items 2–4, 7, 8, PD-0008, PD-0010 items 1, 4, PD-0011 items 6, 7, 9,
10, PD-0013 item 3, PD-0014, CAP-0001, REQ-0016 and REQ-0017 rev 1 (draft),
`initiative.md` rev 2, `product/state.md` Ambiguity log A1–A13 and Discovery
P1–P4, `product/sources/2026-10-31-requester-request.md`.

## Verdicts

| Option | Requirements served | Verdict | Complexity band | One-line basis |
| --- | --- | --- | --- | --- |
| A — set form and `--clear` form; the id alone is an error | REQ-0016, REQ-0017 (O1–O3) | feasible-with-constraints | contained | One new changing command over a field every task already holds, built from existing parts (date rule, parser, lock, atomic write); no format change; C1–C7, C9, C10. |
| B — as A, plus `ttc due <id>` shows the date | REQ-0016, REQ-0017 (O1–O3) | feasible-with-constraints | contained | As A, plus one read-only form copied in kind from `ttc note <id>` (C8); C9 does not apply. |

Band basis (`impact.md`): one system; no contract, schema or data-migration
change; the change is one new command plus its help line, README section
and tests. Nothing that reads the due value changes. B adds one form, its
tests and README text, not a component. Both stay `contained`.

## Constraints

| # | Option | Constraint | permanent / initiative-local | Source | PD- candidate? |
| --- | --- | --- | --- | --- | --- |
| C1 | A, B | Every changing-command rule applies unchanged: arguments, id and date checked before the lock; under the lock read the list, find the task (`ttc: no task with id <id>`), change, write atomically, print one line, exit 0. A refusal leaves `tasks.json` byte-identical and creates no folder when none exists (checked today for `postpone` and `note`). The lock's busy failure applies. A failure after the save exits 1 and keeps the change (PD-0008). Works on open and done tasks. | permanent | `src/lock.js`, `src/storage.js`, `src/cli.js`; PD-0003 items 2, 10, 11; PD-0004 items 2–4, 7; PD-0008 | No — already decided; cite it as PD-0011 item 7 does. |
| C2 | A, B | The typed date follows the one existing rule, the same check `ttc add --due` and `ttc copy --due` use: `YYYY-MM-DD`, a real calendar date, past allowed, nothing later than `9999-12-31` (inherent in the four-digit form), else `ttc: invalid date: <d>` with `<d>` as typed. No second date rule. The command reads no clock or `TZ`. | permanent | `src/rules.js` `isValidDate`; PD-0003 item 5; PD-0011 item 6; PD-0013 item 3 | No — already decided. |
| C3 | A, B | Only that task's `due` changes; title, status, tags, note, mark, id, other tasks and list order stay. The set form stores the date as typed; the clear form stores the empty value every reader accepts. Any other "empty" (for example `""`) makes the whole file unreadable for every command (PD-0004 item 8). No stored-format change: version stays 4. A file of versions 1–3 is rewritten as version 4 by a change and left as it is by a no-op or a refusal (PD-0010 items 1, 4). | initiative-local | `src/storage.js` layout and read check; PD-0004 item 8; PD-0010 items 1, 4; PD-0011 item 10 | Yes — fold into the convergence PD, as PD-0011 item 10. |
| C4 | A, B | Help prints exactly one usage line per command (PD-0003 item 12; the help mechanism builds one line per command). The new line is asserted verbatim, in order, by 4 whole-usage unit files and the oracle, and shown in the README. `test/cli.test.js` asserts the `note` line directly follows the `tag` line, so the new line must not go between them. Each story that changes the line re-touches all of these. | initiative-local | `src/commands/help.js`, `index.js`; `capability-scan.md` "Tests that assert usage text" | Yes — the exact line(s) and place in the convergence PD. |
| C5 | A, B | The CI `test` check gates on the test-owned oracle and fuzz generators. Both must gain `due` (model, command list, argv generator covering a date, a bad date, `--clear`, both, neither, an extra argument), written from the PD text, not from the new code. Listing `due` there also covers it in the damaged-file fuzz cases. `due` is not among the fuzz unknown command names and no test asserts it is unknown, so no existing case flips. | initiative-local | `test/support/ttc-model.js`, `fuzz-gen.js`, `fuzz-harness.js` | Yes — as PD-0014 item 10. |
| C6 | A, B | The check order must be stated and is test-asserted wherever a message is fixed (N4). Wording of argument errors is engineering's unless the PD fixes it (PD-0003 item 2); the fuzz harness checks only the `ttc: ` form. | initiative-local | `src/args.js`; `src/commands/note.js`; PD-0003 item 2 | Yes — the order in the convergence PD. |
| C7 | A, B | The perf guard (10,000 tasks, median < 500 ms) is not threatened: one task changed per run, the same read and write cost as `ttc add` (already measured). No new case. | initiative-local | `test/perf/add-list.perf.js` | No |
| C8 | B | The show form is read-only, exactly as `ttc note <id>`: no lock (never busy), no write, no folder created, a version 1–3 file left as it is, an unreadable file `ttc: cannot read <path>: <reason>`, a missing task or missing file `ttc: no task with id <id>`, exit 1. It prints the stored date as `YYYY-MM-DD`, or one fixed line when there is none, exit 0. | initiative-local | `src/commands/note.js`; PD-0003 item 13; PD-0010 item 1 | Yes — fold into the convergence PD. |
| C9 | A | `ttc due <id>` alone is an argument error. The parser can require a positional but not "a date or `--clear`", so this is a command-level check placed with the other argument checks, before the lock (as `note` checks text with `--clear`). Its wording is engineering's (PD-0003 item 2) unless the PD fixes it; if fixed, it must stay true after both stories (N5). | initiative-local | `src/args.js`; `src/commands/note.js`, `tag.js` | Yes — if the PM fixes the text. |
| C10 | A, B | Everything that follows from the due date follows the new stored value with no change to those parts: `due:` and `!overdue` tokens, `--overdue`, `--due-from`, `--due-to`, `--no-due`, the `ttc stats` overdue count, the export `due` value. Overdue is judged on the local date when those run (PD-0003 item 6). | permanent | `src/commands/list.js`, `src/filter.js`, `src/overdue.js`, `stats.js`, `export.js`; PD-0011 item 9; PD-0014 | No — already decided; cite as PD-0011 item 9. |

## Architectural risks

| # | Option | Risk | What it threatens | What would resolve it |
| --- | --- | --- | --- | --- |
| R1 | A, B | The oracle is updated by reusing the new code, so the fuzz suite confirms whatever was built. | Verifying O1–O3 | C5: the oracle is written from the PD text. |
| R2 | A, B | The clear form writes an "empty" due value other than the one the reader accepts. The write succeeds, then every command fails with `ttc: cannot read` on the next run. | Every command, success measure 2 | C3; acceptance criteria re-read the list after a clear (`ttc list --all` and `ttc list --all --no-due`), on a version 4 and a version 1–3 file. |
| R3 | A, B | Between the two stories, `ttc due <id> --clear` is `ttc: unknown option: --clear` and the usage line lacks `--clear`. If REQ-0016's tests assert that refusal, or fix a bare-id message that mentions only the date, REQ-0017 must rewrite them. | Rework in REQ-0017; a test encoding a transient behaviour | N5: REQ-0016 does not assert the `--clear` refusal; any fixed bare-id text is valid after both stories. |
| R4 | A, B | N1's choice has a storage side effect that is easy to miss: as a normal success, setting the same date writes the file, so a version 1–3 file becomes version 4 (older ttc then refuses it), as a same-title `rename` does today (checked). As a no-op, nothing is written. | Success measure 5; PD-0010 item 1 ("a no-op leaves an older file as it is") | The convergence PD states which class it is and whether it writes. |
| R5 | B | The show form is built on the changing path, so a plain look takes the lock (can fail busy) or writes (upgrades an older file). | C8; success measure 5 | Acceptance criteria: show on a version 1–3 file leaves it byte-identical; show with no folder creates none. |

## Security / data / compliance implications

| Option | Data class | Implication | Source row in impact.md |
| --- | --- | --- | --- |
| A | personal | One due value of the user's own task changes in the owner-only file, under today's atomic write; no new datum, no network. | Option A, "Data crossing a boundary" |
| B | personal | As A, plus one due date printed to stdout, a value `ttc list` already prints. | Option B, "Data crossing a boundary" |

## Product assumptions that conflict with the platform

| # | Assumption (and where it is stated) | Platform fact | Class (blocking/narrowing/costly) | Raised as |
| --- | --- | --- | --- | --- |
| P1 | O3 / success measure 4 "every command typed as it can be typed today gives the same output ... apart from the new usage in `ttc help`" | Holds. `ttc due ...` is `ttc: unknown command: due`, exit 1, today; only those invocations and `ttc help` change. In help, the lines after the new one shift down one place. | narrowing | Recommendation: state both in the PD. |
| P2 | Success measure 5 "a `tasks.json` written by older ttc works with both commands" | Holds; a change rewrites it as version 4 and older ttc then refuses it (PD-0010 item 4); a no-op, a refusal and (B) the show form leave it as it is. | narrowing | C3, R4; state in the PD as PD-0011 item 10 does. |
| P3 | Option A: "`ttc due <id>` with nothing else is an argument error (missing argument)" | Holds, but the parser cannot express it; it is a command-level check (C9). | narrowing | N4. |
| P4 | Option B: "prints the task's due date ... and changes nothing" | Holds if built as `ttc note <id>` is (C8, R5). | narrowing | C8. |
| P5 | A5: "PD-0003 item 9 no-op line, or success like a same-title rename" | Both hold; they differ in whether the file is written (R4). | narrowing | N1. |
| P6 | REQ-0017: "On a task that has no due date it changes nothing and exits 0" | Holds, with no write (as `note --clear`). | narrowing | N2. |

No assumption was found `blocking` or `costly`. Verified as holding in both
options: no stored-format change (C3, N6); the date rule exists and is
shared (C2); dependents follow the stored value with no change (C10); no
existing test asserts `ttc due` is unknown (C5); nothing is created when
`tasks.json` is missing (C1).

## Recommendations to the PM (not decided here)

- **N1 — setting the date the task already has.** Platform view: the normal
  success line, like a same-title `rename` (PD-0003 item 9) and like
  `ttc note <id> "<text>"` with the same text. Every value-setting form in
  ttc behaves this way; the no-op family (`done`/`reopen`,
  `important`/`unimportant`, `tag`, `note --clear`) is for on/off and
  membership. It needs no comparison and no extra fixed message. Cost: it
  writes, so a version 1–3 file becomes version 4 (R4); the PD must say so.
  The no-op alternative (for example `Task <id> is already due <date>`, no
  write) is equally `contained` and keeps older files untouched, at the
  price of one more fixed message and one more case in tests and oracle.
- **N2 — `--clear` on a task with no due date.** No reason against: print
  `Task <id> has no due date`, exit 0, write nothing, as
  `ttc note <id> --clear` does. The words match `ttc postpone`'s refusal
  (`ttc: task <id> has no due date`, stderr, exit 1); the channel, prefix
  and exit code tell them apart, and the overlap is harmless. Under B, use
  the same line for the show form on a task with no date, as `note` does.
- **N3 — usage.** One line: help prints one line per command (C4), and a
  second line would break PD-0003 item 12 and the help mechanism. Precedents:
  `ttc tag <id> +<t> | -<t>` for a required either-or (A) and
  `ttc note <id> ["<text>" | --clear]` for an optional one (B).
  - A: REQ-0016 adds `ttc due <id> YYYY-MM-DD`; REQ-0017 changes it to
    `ttc due <id> YYYY-MM-DD | --clear`.
  - B: REQ-0016 adds `ttc due <id> [YYYY-MM-DD]`; REQ-0017 changes it to
    `ttc due <id> [YYYY-MM-DD | --clear]`.
  - Place: directly after `ttc postpone <id>` and before
    `ttc rename <id> "<title>"`, next to the other due-date command. This
    keeps `tag` and `note` adjacent (C4).
  - Success lines (A8, PM's text), in the form of existing lines: for example
    `Set due date of task <id> to <date>` and `Cleared due date of task <id>`
    (cf. `Set note on task <id>`, `Postponed task <id> to <date>`).
- **N4 — check order and error cases.** In this order, all before the lock
  and the read: (1) parser errors in argv order: unknown option, option
  given twice, unexpected argument (a second positional), missing `<id>`;
  (2) the id (`ttc: invalid task id: <arg>`); (3) a date and `--clear`
  together, refused in `note`'s form (for example
  `ttc: due date and --clear cannot be combined`), before the date is
  checked, so `ttc due 1 2026-02-30 --clear` reports the combination;
  (4) A only: neither given, an argument error (C9; B shows instead);
  (5) the date (`ttc: invalid date: <d>`). Then under the lock: read
  (`ttc: cannot read ...`), find the task (`ttc: no task with id <id>`),
  then set, clear or the no-op. Under B the show form runs after (1)–(2)
  with no lock. This is `note`'s order, with the date check in place of the
  note-text check.
- **N5 — the story split.** Sound. REQ-0016 is verifiable alone (set, then
  `ttc list --all` shows `due:<date>`; errors; older file); REQ-0017 alone
  (clear, then no `due:` token and `ttc list --all --no-due` shows it; the
  no-op). Clear needs the command to exist, so the order is right. REQ-0017
  re-touches: the usage line in 4 whole-usage unit files, the oracle `USAGE`,
  the README section and the new command's own help assertions; the oracle
  model and fuzz generator for `due` (add `--clear`, both-given, and under A
  the bare-id case if its text changes); README. One story would save that
  mechanical second pass and one PR/CI/review cycle; it is cheaper but not
  materially, and both stay `contained`. Platform view: keep the split if
  the PM values two small, separately verifiable steps; either is fine. With
  the split, REQ-0016 should not assert `--clear` as an unknown option, and
  any fixed bare-id text must be true after REQ-0017 too (R3).
- **N6 — storage.** No stored-format change: `due` is already `null` or a
  `YYYY-MM-DD` string in format version 4 and in versions 1–3 (C3). A change
  writes version 4; a no-op, a refusal and the B show form leave an older
  file byte-identical.
- **Option choice, platform view only.** Both are `contained` and share
  C1–C7 and C10. A adds C9 (a command-level "date or `--clear`" check). B
  adds C8 and R5 (a read-only path with its own tests and README text) and
  answers A7, which the request did not ask for. B accepts a superset of
  A's commands with the same meaning where they overlap, so a later move
  from A to B forecloses nothing (`ttc due <id>` goes from an error to a
  result). The choice is the PM's.
- **Registry note.** CAP-0001 (`draft`) still says "Behavior today: None
  yet" (`capability-scan.md`). Reported for the PM's registry upkeep, as in
  INIT-0002 to INIT-0006.

## Open questions raised

| Q- id | What it blocks |
| --- | --- |
| none | — |
