---
initiative: INIT-0008
type: technical-assessment
title: Technical assessment — A task added with a due date in the past gets a warning
status: authoritative
revision: 1
owner_role: ROLE-planner
mode: PRODUCT-DISCOVERY
phase_at_assessment: SOLUTION_EXPLORATION
round: 1
assessed_on: 2026-11-24
created: 2026-11-24
updated: 2026-11-24
verdicts:
  - { option: A, verdict: feasible-with-constraints, band: multi-component }
  - { option: B, verdict: feasible-with-constraints, band: contained }
constraints: [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]
questions: []
updated_by_role: ROLE-planner
---

Mode: PRODUCT-DISCOVERY
Initiative: INIT-0008
Phase at assessment: SOLUTION_EXPLORATION
Assessed: 2026-11-24
Round: 1

Evidence: `capability-scan.md` and `impact.md` (this folder, same date), code
at head `b3945a4` (last `src/`/`bin/` change `8bd11ce`), CLI checks in a
scratch `TTC_HOME`, a throwaway prototype of each option run against the full
suite on a scratch copy (never in the repository), `project/constraints.md`
rows 1–9, PD-0003 items 5, 6, 10, 11, PD-0004, PD-0008, PD-0017, PD-0013,
PD-0016, `initiative.md` rev 2, draft REQ-0025, the Product Definition
Contract, `product/state.md` Ambiguity log A1–A12, Discovery P1–P5 and the
Options table, `product/sources/2026-11-24-requester-request.md`.

## Verdicts

| Option | Requirements served | Verdict | Complexity band | One-line basis |
| --- | --- | --- | --- | --- |
| A — warning on stderr | REQ-0025 (O1–O2) | feasible-with-constraints | multi-component | The decision is one comparison with the existing local-date rule, but keeping PD-0003 item 11 and PD-0008 true needs the shared output and failure handling every command passes through, not only `ttc add` (C3, C4); C1, C2, C5, C8–C10. |
| B — warning as a second stdout line | REQ-0025 (O1–O2) | feasible-with-constraints | contained | The existing buffered stdout already gives "both lines or the PD-0008 failure"; only `ttc add`, README and test expectations change. Needs PD-0003 item 10 amended (C6); C1, C2, C7–C10. |

Band basis (`impact.md`): one system; no contract, schema or data change in
either option. B touches one component (`ttc add`) plus README and test
expectations. A touches `ttc add` and the process-level output/failure
handling that all commands share (measured: a naive A prints two stderr
lines when stdout is closed after the save), so it is `multi-component` at
the lower edge. A drops to `contained` only if the PD accepts two stderr
lines in that case, which contradicts PD-0003 item 11.

## Constraints

| # | Option | Constraint | permanent / initiative-local | Source | PD- candidate? |
| --- | --- | --- | --- | --- | --- |
| C1 | A, B | "In the past" is decided with the one existing local-date rule and the overdue comparison (due before today, string order on `YYYY-MM-DD`, local time zone; today is not past). No second notion of today. A new task is always open, so the warning appears exactly when that task would show `!overdue` on the same local date. | permanent | `src/overdue.js`; PD-0003 item 6 | Yes — state in the convergence PD (any later warning on `copy --due`/`due` reuses it). |
| C2 | A, B | The warning comes only with a task that was saved. Every failure before the save (arguments, title, date, tag, note, unreadable or invalid file, busy lock, no task id left, failed write) prints its one `ttc: <message>` line, nothing on stdout, exit 1, file unchanged, and never the warning. Holds by construction today: every check and the save finish before any output. | permanent | `src/commands/add.js`; PD-0003 item 11; PD-0004 items 2, 7; PD-0008 item 1 | Yes — "a warning only accompanies a completed change". |
| C3 | A | On a failure after the save (stdout cannot be written, PD-0008), stderr must still hold exactly one line. A stderr warning written as the command runs goes out before the stdout outcome is known: measured, stdout closed + past date gives `ttc: warning: …` then `ttc: cannot write output: EPIPE`, exit 1. The platform reports a stdout write failure asynchronously, so meeting this involves the shared output/failure handling, not only `ttc add`. The existing "at most one `ttc: ` line" check covers this case once a past-date variant exists. | initiative-local | `bin/ttc.js`; `src/cli.js`; PD-0003 item 11; PD-0008 item 2 | Yes — N1/N2 rule. |
| C4 | A | When stderr cannot be written, today's process handling turns the unwritten warning into exit 1, silently, with the task saved and `Added task <id>` already printed (measured). Today the same command exits 0. Either the PD accepts this as the PD-0008 form, or ttc must ignore a failed warning write, a special case in the shared handler. | initiative-local | `bin/ttc.js`; README "Exit codes"; PD-0008 | Yes — N2. |
| C5 | A | The warning line has the exact form of a failure line (`ttc: <message>`, PD-0003 item 11): the existing test pattern for one failure line matches it. Error and warning are told apart only by the exit code (and the word `warning:`). README "Exit codes" lists only failure lines on stderr and needs one sentence saying exit 0 may come with this line. This is the first non-failure stderr output; any later warning would follow it. | permanent | PD-0003 item 11; `test/exit-codes.test.js` failure pattern; README "Exit codes" | Yes — "stderr may carry a `ttc: warning:` line on exit 0; the exit code decides success". |
| C6 | B | B breaks PD-0003 item 10 ("A command that changes data prints one line to stdout") for `ttc add` with a past date, and the PM's own bound in Ambiguity A5 and success measure 1 ("stdout `Added task <id>` … stderr holds exactly one warning line"). B needs PD-0003 item 10 amended and success measure 1 rewritten. Technically nothing else blocks it. | permanent | PD-0003 item 10; `initiative.md` rev 2 success measure 1; `product/state.md` A5 | Yes — amend PD-0003 item 10 if B is chosen. |
| C7 | B | Both stdout lines are written together after the command succeeds, or neither is. stdout closed → PD-0008 unchanged (one failure line, exit 1, task saved); stderr closed → exit 0, nothing lost (measured). No change to process-level handling. | initiative-local | `src/cli.js`; `bin/ttc.js`; PD-0008 | No — already PD-0008. |
| C8 | A, B | Only `ttc add` changes. `copy --due`, `due`, `import`, help, stored data and the data format stay; they share only the date check, not `add`'s code. Under A, no other command starts writing to stderr on success. | initiative-local | `src/commands/copy.js`, `due.js`, `import.js`; scope A1, A8 | No — scope already set. |
| C9 | A, B | PD-0017: no new suite, oracle, fuzz or perf. Existing tests that add a past-dated task and assert today's output change (measured): A — 17 tests in 7 files; B — 7 tests in 2 files (N4). The new behaviour is checkable with the existing TZ-pinned, midnight-retrying pattern in `postpone.test.js`/`stats.test.js`. | initiative-local | PD-0017; `capability-scan.md` "Test gate" | No |
| C10 | A, B | A fixed test date that is "not past" today becomes past later: `2026-10-01` in `test/add.test.js` criteria 3–4 was future when written and now triggers the warning under both options. A "no warning" check must use a far-future date (e.g. `2099-…`) or a test-computed date, never a near fixed date. | permanent | `test/add.test.js` lines 88, 96 | No — note for acceptance criteria. |

## Architectural risks

| # | Option | Risk | What it threatens | What would resolve it |
| --- | --- | --- | --- | --- |
| R1 | A | The warning is written where it is convenient (inside `ttc add`, straight to stderr); a failure after the save then prints two stderr lines. | PD-0003 item 11, PD-0008 item 2, success measure 3 | C3; an acceptance criterion with a past date and stdout closed: exactly one stderr line, exit 1, task saved. |
| R2 | A | On one terminal the warning prints before `Added task <id>` (measured), because stdout is held until the command ends. If the PD expects confirmation first, the naive build reads backwards. | O1 readability; any AC fixing the combined order | The PD states whether order on a shared terminal is fixed; resolving C3 also fixes it (warning after the confirmation). |
| R3 | A | Wrappers or scripts that treat any stderr output as failure misread a successful add. None exist in the repo or CI; outside use is unknown. | Users' scripts; README "Exit codes" reading | C5: README sentence; exit code stays the only success signal. |
| R4 | B | Scripts that read `ttc add` stdout (take the id from the single line, count lines) get two lines for a past date. | PD-0003 item 10 consumers | C6: the PD amends item 10 explicitly; README says it. |
| R5 | A, B | The warning reads the clock once at add time; a later `ttc list` can disagree across midnight or a `TZ` change. Tests that compute today without pinning `TZ` or retrying across midnight flake. | Verifying N3/N6 | Use the existing pinned-`TZ` + retry pattern; fixed past/future dates for everything except the today boundary (C10). |

## Security / data / compliance implications

| Option | Data class | Implication | Source row in impact.md |
| --- | --- | --- | --- |
| A | personal | Echoes the date the user typed on stderr, as `ttc: invalid date: <d>` already does; nothing stored changes; no network. | Option A, "Data crossing a boundary" |
| B | personal | As A, on stdout. | Option B, "Data crossing a boundary" |

## Product assumptions that conflict with the platform

| # | Assumption (and where it is stated) | Platform fact | Class (blocking/narrowing/costly) | Raised as |
| --- | --- | --- | --- | --- |
| P1 | Option B as framed vs success measure 1 and A5 ("stdout stays exactly `Added task <id>`", PD-0003 item 10) | B puts a second line on stdout; it cannot meet success measure 1 as written. | blocking (for B, unless PD-0003 item 10 and success measure 1 are amended) | C6; PM's call in the convergence PD (PD-0001 delegation; no `Q-`). |
| P2 | A9 / success measure 3: "the warning only comes with a task that was added"; a failed add prints only its one error line | Under A, the PD-0008 case (saved, then stdout fails) is both "added" and "failed"; naively it prints the warning and the failure line. Under B it prints only the failure line. | narrowing (A) | C3, R1; N1/N2. |
| P3 | P4 / A12: "ttc writes to stderr only when a command fails" | Ends under A for this one case; stays true under B. | narrowing (A) | C5; N5. |
| P4 | Success measure 3: "a `ttc add` that fails … `tasks.json` unchanged" | Already untrue today for the PD-0008 case (failure after the save keeps the task); the measure holds for every failure before the save. | narrowing | State the PD-0008 exception in the convergence PD. |

No assumption is `costly`. Verified as holding in both options: the local
today/overdue rule exists and is reusable (C1); the warning can be tied to
a saved task (C2); no other command, help or the data format changes (C8);
CI and `npm test` assume nothing about stderr beyond individual tests (N4).

## Recommendations to the PM (not decided here)

- **N1 — when the warning is printed.** Guaranteeable in both options:
  every check and the save finish before any output (C2). Recommend the rule
  "the warning is printed only when `ttc add` exits 0", so every exit 1 —
  including the PD-0008 case — prints exactly one stderr line and no
  warning. B gets this for free (C7); A needs it as an obligation (C3, R1).
  If order on a shared terminal matters, state "after `Added task <id>`".
- **N2 — the warning line cannot be written.** Simplest consistent rule:
  treat it as PD-0008 — the task stays saved, exit 1, and at most one
  failure line if any stream still works. Under A with stderr closed that is
  exit 1 silently, which is exactly today's process behaviour (C4); under B,
  stdout closed is PD-0008 unchanged. One rule, no special case: "a line ttc
  cannot print makes the command exit 1; a saved change is kept".
- **N3 — today.** Reuse the existing local-date rule and the overdue
  comparison (C1): warning ⇔ the new task shows `!overdue` on the same
  local date; a date equal to today gives no warning.
- **N4 — test impact.** Measured on a scratch prototype, full suite 519
  tests. A: 17 tests in 7 files — `test/add.test.js` 3,
  `test/copy.test.js` 2, `test/due-clear.test.js` 4,
  `test/export.test.js` 2, `test/important.test.js` 3,
  `test/list.test.js` 2, `test/postpone.test.js` 1 (all assert empty stderr
  after a past-dated add). B: 7 tests in 2 files — `test/add.test.js` 3,
  `test/due-clear.test.js` 4 (exact stdout). Both include `add.test.js`
  criteria 3–4, whose `2026-10-01` has become past (C10). No suite or tool
  assumes stderr is empty on every exit 0: `test/exit-codes.test.js`
  asserts empty stderr only on its own success rows (its `add` row has no
  due date, unaffected); CI runs lint + `test:unit`; `npm test` =
  `test:unit`.
- **N5 — README.** Add a short "Adding a task" section (none exists) saying
  when the warning appears, its exact text, that the task is still added,
  and that `ttc due <id> YYYY-MM-DD` fixes the date (PD-0016). Under A, add
  one sentence to "Exit codes": exit 0 can come with this one
  `ttc: warning: …` line on stderr; the exit code, not stderr, tells success
  from failure. Under B, "Exit codes" is unchanged, but the README should
  not keep any wording implying one stdout line for every change.
- **N6 — one story.** Independently verifiable as one story: fixed
  `2000-01-02` (warns), `2099-…` and no `--due` (today's exact output),
  a test-computed local today with `TZ` pinned and the existing
  midnight-retry pattern (no warning), a failing add with a past date (one
  error line, no warning), and under A a past date with stdout closed
  (one stderr line, exit 1, task saved). No new suite (PD-0017).
- **Option choice, platform view only.** B is cheaper (`contained`, 7 test
  changes, no shared-component change) but needs PD-0003 item 10 amended and
  success measure 1 rewritten (C6, P1). A keeps stdout and every
  stdout-reading script intact and matches the initiative text as written,
  at `multi-component` with C3–C5 to state in the PD and 17 test changes. The
  choice is the PM's.
- **Registry note.** CAP-0001 (`draft`) still predates shipped behaviour
  (`capability-scan.md`). Reported for the PM's registry upkeep, as in
  INIT-0002 to INIT-0007.

## Open questions raised

| Q- id | What it blocks |
| --- | --- |
| none | — |
