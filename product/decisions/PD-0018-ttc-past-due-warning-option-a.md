---
id: PD-0018
type: decision
title: Build INIT-0008 as option A, ttc add warns on stderr when the due date is before today and still adds the task
status: accepted
revision: 1
owner_role: ROLE-product-manager
created: 2026-11-24
updated: 2026-11-24
decided_on: 2026-11-24
affects: [INIT-0008, REQ-0025, CAP-0001]
supersedes:
superseded_by:
---

# PD-0018 — Build INIT-0008 as option A, ttc add warns on stderr when the due date is before today and still adds the task

## Context

The requester said: "When I add a task with a due date that is already in the
past, it's usually a typo and I don't notice. Warn me when that happens. Keep
it simple."
(`initiatives/INIT-0008-warn-past-due-date/product/sources/2026-11-24-requester-request.md`).
Today `ttc add --due <d>` with a past date prints only `Added task <id>`,
exits 0 and prints nothing on stderr; a past date is allowed (`PD-0003`
item 5), and ttc writes to stderr only when a command fails (`PD-0003`
item 11; README "Exit codes"). The ambiguity log
(`initiatives/INIT-0008-warn-past-due-date/product/state.md`, A1–A12) is all
`pm-resolvable`, and scope is `ttc add` only (A1, `initiative.md` rev 2).

The architect assessed two shapes
(`initiatives/INIT-0008-warn-past-due-date/technical/assessment.md`, round 1):
option A, the warning as one stderr line with stdout unchanged,
`feasible-with-constraints`, band `multi-component`; option B, the warning as
a second stdout line, `feasible-with-constraints`, band `contained`. B breaks
`PD-0003` item 10 ("A command that changes data prints one line to stdout")
and success measure 1 (C6, P1). A keeps every accepted rule and every
stdout-reading script intact; its extra cost is that a failure after the save
must still print exactly one stderr line (C3, R1).

The choice is the PM's (`product-manager-orchestrator` §4.1;
escalation-policy §3 route 2): A is the option that keeps the stated outcome
and every accepted decision intact. B would contradict an accepted `PD-`,
which is escalation-class (§4.2), for a cheaper build only.

## Decision

1. **Chosen option: A.** `ttc add` warns on stderr when it is given a due date
   before today. The task is still added exactly as today.
2. **Which command.** Only `ttc add --due <d>`. `ttc copy <id> --due <d>`,
   `ttc due <id> <d>`, `ttc import` and every other command are unchanged and
   print no warning (A1, A8, A11; C8).
3. **"Before today".** Today is the date on the user's machine in its local
   time zone, and the test is the overdue test of `PD-0003` item 6 (C1,
   N3): the warning appears exactly when the new task would show `!overdue`
   that day. A date equal to today, a later date, and no `--due` give no
   warning.
4. **The task is added as today.** The date rule is unchanged: a past date is
   allowed (`PD-0003` item 5). stdout is exactly `Added task <id>` and the
   exit code is 0 (`PD-0003` item 10). The stored task is the same as it
   would be without the warning. No question is asked (`PD-0003` item 10).
5. **The warning.** stderr holds exactly one line:
   `ttc: warning: due date <d> is in the past`, where `<d>` is the date as
   typed (a valid `YYYY-MM-DD` date, so the same as stored). Fixed text.
6. **Only with an add that succeeds.** The warning is printed only when
   `ttc add` exits 0, after `Added task <id>` has been written (N1, C3). Every
   failure prints exactly one `ttc: <message>` line on stderr and never the
   warning: a failure before the save (arguments, title, date, tag, note,
   unreadable or invalid file, busy lock, no task id left, failed write)
   changes nothing (`PD-0003` item 11); a failure after the save (stdout
   cannot be written) keeps the task and exits 1 (`PD-0008`).
7. **When the warning cannot be written.** If stderr cannot be written, ttc
   exits 1 silently and the task stays added, as README "Exit codes" already
   states for stderr and as `PD-0008` does for a saved change (N2, C4). No
   special case is added.
8. **A warning is not an error.** The exit code tells success from failure.
   This line is the only stderr output a successful ttc command prints; it
   adds to `PD-0003` item 11, which stays true for every failure (C5).
9. **README.** A short "Adding a task" section shows the `ttc add` usage and
   states when the warning appears, its exact text, that the task is still
   added, and that `ttc due <id> YYYY-MM-DD` changes the date. The "Exit
   codes" section gains one sentence: exit 0 can come with this one
   `ttc: warning:` line on stderr; the exit code, not stderr, tells success
   from failure (N5).
10. **Nothing else changes.** `ttc help`, stored data, the data file format
    and the output of every other command stay as they are (C8).
11. **Tests.** Under `PD-0017`: no new suite, oracle, fuzz or perf check. The
    existing tests that add a task with a past due date and expect an empty
    stderr are updated to expect the warning (17 tests in 7 files measured,
    N4, C9). A date meant to be "not past" is far in the future (`2099-…`)
    or computed by the test, never a near fixed date (C10); the today
    boundary uses the existing pinned-`TZ`, midnight-retry pattern (R5).
12. **No visual surface.** ttc is CLI only (`project/constraints.md` row 8).
    No design role is dispatched and the story carries `design_refs: []`;
    its acceptance criteria state the exact text, streams and exit codes
    (§9d.5).

## Options considered

| Option | Why not |
| --- | --- |
| B — the warning as a second stdout line, `Warning: due date <d> is in the past` | Breaks `PD-0003` item 10 (one stdout line for a change) and success measure 1; amending an accepted decision is a requester call (§4.2) for a cheaper build only. Scripts that read the single `Added task <id>` line would get two lines (C6, R4) |
| Refuse a past due date, or refuse it unless a flag is given | The request says "Warn me"; a past date stays allowed (`PD-0003` item 5); refusing changes what `ttc add` accepts (A3) |
| Ask the user to confirm the date | No command asks for confirmation (`PD-0003` item 10); a question breaks scripted use; "Keep it simple" (A4) |
| Also warn on `ttc copy --due` and `ttc due` | The request names adding a task; two more commands nobody asked about (A1). A later ask can reuse this line and rule 3 unchanged |
| Put the fix in the line (`…; change it with ttc due <id> YYYY-MM-DD`) or show today's date in it | A longer line for a rare case; "Keep it simple". The README carries the fix (A10) |
| A flag or environment setting that turns the warning off | Not asked; "Keep it simple" (A7) |
| Ignore a warning that cannot be written and exit 0 | A special case in the output handling every command shares; today's rule (stderr unwritable → exit 1, saved change kept) already covers it (C4) |
| Print the warning as soon as the date is checked | A failure after the save would then print two stderr lines, against `PD-0003` item 11 (C3, R1) |

## Consequences

**Costs.**

- **Fixed text.** The warning line is fixed; changing it later needs a record
  that supersedes this one. Tests assert it.
- **stderr is no longer empty on every success.** One successful case now
  writes a `ttc: warning:` line on stderr. A wrapper that treats any stderr
  output as failure would misread it; the exit code stays the signal and the
  README says so (C5, R3).
- **Shared output handling.** Keeping one stderr line on a failure after the
  save touches the output and failure handling every command passes through,
  not only `ttc add` (band `multi-component`, C3).
- **stderr closed means exit 1.** `ttc add` with a past date and stderr
  closed exits 1 with the task added, where today it exits 0 (C4).
- **Tests move.** 17 existing tests in 7 files change their expected stderr
  (N4).

**Benefits.**

- The typo is visible at the moment it is made, in one short line.
- stdout, the exit code and the stored task are exactly as today, so scripts
  that read `Added task <id>` keep working.
- No new command, option, rule for dates, or data format change.
- The same line and rule 3 can be reused if a later ask extends the warning
  to `ttc copy --due` or `ttc due`.

## Provenance

Decided by `ROLE-product-manager` at SOLUTION_CONVERGENCE of INIT-0008;
`context_digest` `4e3902b0918715b5`, head `b3945a4`.

> Once `status: accepted`, this body is never rewritten. A change of mind is a
> new decision with `supersedes: PD-0018`.
