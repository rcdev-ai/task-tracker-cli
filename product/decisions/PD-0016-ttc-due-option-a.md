---
id: PD-0016
type: decision
title: Build INIT-0007 as option A, ttc due sets a task's due date to a typed date or removes it with --clear
status: accepted
revision: 1
owner_role: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
decided_on: 2026-10-31
affects: [INIT-0007, REQ-0016, REQ-0017, CAP-0001]
supersedes:
superseded_by:
---

# PD-0016 — Build INIT-0007 as option A, ttc due sets a task's due date to a typed date or removes it with --clear

## Context

The requester said: "A person can change a task's due date, or remove it,
after the task was added — in one short command, e.g.
`ttc due <id> YYYY-MM-DD` and `ttc due <id> --clear`. Today the only ways to
touch a due date after `ttc add` are `ttc postpone` and `ttc copy --due`."
(`initiatives/INIT-0007-change-or-clear-due-date/product/sources/2026-10-31-requester-request.md`).
`PD-0003` Consequences recorded the gap as a cost ("No way to change a due
date"); earlier initiatives kept it out of their scope, and no decision
rejected it (Ambiguity log A13 in
`initiatives/INIT-0007-change-or-clear-due-date/product/state.md`). The
ambiguity log there (A1–A13) is all `pm-resolvable`. The architect found
option A (the request's two commands) and option B (the same, plus
`ttc due <id>` showing the date, like `ttc note <id>`) both
`feasible-with-constraints`, band `contained`, with constraints C1–C10
(C8 B only, C9 A only), risks R1–R5 and narrowing points P1–P6, none
blocking or costly, and no stored-format change in either
(`initiatives/INIT-0007-change-or-clear-due-date/technical/assessment.md`,
round 1).

The choice between A and B is settled by the request itself
(escalation-policy §3 route 2): it names the two commands, and A is exactly
them. B adds a show form nobody asked for, and a due date already shows on
every `ttc list` line (`PD-0003` item 8). Choosing the option that keeps the
stated outcome without an unasked addition is the PM's call
(`product-manager-orchestrator` §4.1); no stated need is dropped or narrowed
(§4.2).

## Decision

1. **The command (A6, C9).** `ttc due <id> YYYY-MM-DD` sets a task's due
   date; `ttc due <id> --clear` removes it. One task per command. The
   existing argument rules apply (`PD-0003` item 2): `--clear` may come
   before or after the id, at most once; a missing id, an extra argument or
   an unknown option is an error. `ttc due <id>` with neither a date nor
   `--clear` is an argument error: one line `ttc: <message>` on stderr,
   exit 1, nothing changed; its wording is engineering's (`PD-0003` item 2).
2. **Setting (A1–A3, C2).** `ttc due <id> <d>` makes `<d>` the task's due
   date. It works on open and done tasks, and on a task with or without a
   due date. `<d>` follows the `ttc add --due` rule exactly: `YYYY-MM-DD`, a
   real calendar date, a past date allowed, nothing later than `9999-12-31`,
   and `ttc: invalid date: <d>` otherwise, `<d>` as typed (`PD-0003` item 5,
   `PD-0011` item 6, `PD-0013` item 3).
3. **Setting the date the task already has (A5, N1, R4).** A normal
   success, like a same-title `rename` (`PD-0003` item 9): the same success
   line, and the file is written.
4. **Success lines (A8; adds to `PD-0003` item 10).**
   `Set due date of task <id> to <d>` after setting, and
   `Cleared due date of task <id>` after removing a due date, each with
   `<id>` without leading zeros and `<d>` as `YYYY-MM-DD`, then exit 0.
   Example: `ttc due 007 2026-11-10` prints
   `Set due date of task 7 to 2026-11-10`.
5. **Removing a due date that is not there (A4, N2; adds to `PD-0003`
   item 9).** `ttc due <id> --clear` on a task with no due date prints
   `Task <id> has no due date` to stdout, changes nothing, writes nothing
   and exits 0, as `ttc note <id> --clear` does on a task with no note.
6. **Check order and errors (N4, C6).** Before the lock and the read, in
   this order: argument errors, in the order typed; the id
   (`ttc: invalid task id: <arg>`); a date and `--clear` given together
   (`ttc: due date and --clear cannot be combined`); neither given (item 1);
   the date (`ttc: invalid date: <d>`). Then under the lock: read the list
   (`ttc: cannot read <path>: <reason>`), find the task
   (`ttc: no task with id <id>`), then set, remove or the no-op. The first
   failing check is the one reported. Every refusal prints one line to
   stderr, exits 1 and writes nothing: `tasks.json` stays byte-identical, a
   file written by older ttc keeps its version, and a missing `tasks.json`
   stays missing, with no file or folder created (`PD-0003` items 11, 13,
   `PD-0004` item 7).
7. **Shared rules (C1).** Every existing changing-command rule applies
   unchanged: the lock and its busy failure, one atomic write, and a failure
   after the save exits 1 and keeps the change (`PD-0004` items 3–4,
   `PD-0008`).
8. **What changes and what does not (O3, C3, C10).** Only that task's due
   date changes. Its title, status, tags, note, important mark and id, every
   other task, and the order of `ttc list` stay as they are. What follows
   from the due date follows from the new one: the `due:` and `!overdue`
   tokens of its `ttc list` line, `--overdue`, `--due-from`, `--due-to`,
   `--no-due`, the `ttc stats` overdue count and the due value in
   `ttc export` (`PD-0003` item 6, `PD-0011` item 9, `PD-0014`).
9. **Storage (C3, N6).** No format change: `tasks.json` stays version 4. A
   removed due date is stored as the empty value a task added without
   `--due` has (`null`), so every reader accepts it (R2). A successful set
   or removal writes the file as version 4, as every changing command does,
   including setting the date the task already has (`PD-0010` items 1, 4);
   the no-op of item 5 and every refusal leave an older file as it is.
10. **Help (N3, C4; adds to `PD-0003` item 12).** One usage line, after
    `ttc postpone <id>` and before `ttc rename <id> "<title>"`:
    `ttc due <id> YYYY-MM-DD | --clear`. `REQ-0016` adds it as
    `ttc due <id> YYYY-MM-DD`; `REQ-0017` extends it to the full line.
11. **README.** The README gains a "Changing a due date" section after
    "Postponing a task", in its style: the usage, the date rule, the success
    lines, the no-op, the refusals, and that only the due date changes.
12. **Two stories (N5, R3).** `REQ-0016` delivers the set form, the usage
    line `ttc due <id> YYYY-MM-DD`, the README section and its tests.
    `REQ-0017`, after it, adds `--clear`, the no-op of item 5, the
    combination refusal of item 6, the full usage line and the README text
    for removing. Until `REQ-0017` ships, `--clear` is an unknown option;
    `REQ-0016` asserts nothing about `--clear` and fixes no text for the
    item 1 argument error.
13. **Out of scope (A7, A10–A12).** No form that shows a task's due date
    (option B); no relative dates; one task per command; `ttc add`,
    `ttc postpone` and `ttc copy` do not change.
14. **No visual surface.** ttc is "CLI only, no UI" (`project/constraints.md`
    row 8; `PD-0001` item 3). No design role is dispatched and no `DES-` is
    made; the stories carry `design_refs: []`, and their acceptance criteria
    state the exact command output and exit codes.
15. **The architect's constraints.** C1–C7, C9 and C10 of
    `technical/assessment.md` (round 1) bind the stories. C8 applied only to
    option B and does not apply.
16. **How this record relates to earlier ones.** It adds to `PD-0003`
    items 9, 10 and 12 and closes the gap `PD-0003` Consequences names
    ("No way to change a due date"), without editing that record. It changes
    nothing already decided in `PD-0003`, `PD-0011` or `PD-0013`.

## Options considered

| Option | Why not |
| --- | --- |
| B — `ttc due <id> [YYYY-MM-DD \| --clear]`, where `ttc due <id>` alone shows the due date | A third form the request did not ask for (A7). A due date already shows on every `ttc list` line, unlike a note, so the form adds nothing a user lacks, and it brings its own read-only rules and tests (C8, R5). It remains an additive later change: B accepts every A command with the same meaning |
| Setting the date the task already has as a no-op (`Task <id> is already due <d>`, nothing written) | One more fixed message and test case. Every value-setting form in ttc (`rename`, `note "<text>"`) succeeds on the same value; the no-op family is for on/off and membership (N1) |
| `--clear` on a task with no due date as a refusal (exit 1), like `ttc postpone` | The asked-for end state (no due date) already holds; `PD-0003` item 9 and `ttc note <id> --clear` make that a no-op that succeeds (N2) |
| Two usage lines, one per form | Help prints one line per command (`PD-0003` item 12, C4); `ttc tag <id> +<t> \| -<t>` is the precedent for a required either-or |
| One story for both forms | Slightly cheaper (one PR instead of two), but two small, separately verifiable steps were asked for ("one or two stories"), and the architect found the split sound (N5) |
| `--due <d>` and `--no-due` options on a new `ttc edit` command | Not the requester's words; "due" is the request's own command name and `--clear` the existing removal option (`ttc note`) |
| Relative dates or several tasks per command | Not asked (A10, A11) |

## Consequences

**Costs.**

- **One more command** and **fixed text**: the two success lines, the no-op
  line, the combination refusal and the usage line are fixed; changing one
  later needs a record that supersedes this one. Tests assert them.
- **Setting the same date writes.** It rewrites a file written by older ttc
  as version 4, which older ttc then refuses, as a same-title `rename` does
  today (R4; `PD-0010` item 4).
- **Two passes over the usage line.** `REQ-0017` re-touches the usage
  assertions, the test oracle, the fuzz cases and the README that `REQ-0016`
  wrote (N5).
- **Same words, two meanings.** `Task <id> has no due date` (stdout, exit 0,
  item 5) shares words with `ttc postpone`'s refusal
  `ttc: task <id> has no due date` (stderr, exit 1); the prefix, the stream
  and the exit code tell them apart.
- **Tests move.** The test oracle and the argument fuzzing gain the command,
  written from this record, not from the new code (C5, R1).

**Benefits.**

- The request's own two commands, nothing else to learn.
- Any due date can be reached in one run, and a due date can be removed,
  without a new task or a new id.
- No format change, no migration, and no change to any other command's
  output beyond what follows from the new date.
- The command behaves like the existing changing commands and like
  `ttc note`, so no new kind of rule is needed.

## Provenance

Decided by `ROLE-product-manager` at SOLUTION_CONVERGENCE of INIT-0007;
`context_digest` `fb6dac4630751802`, head `c7e34b5`.

> Once `status: accepted`, this body is never rewritten. A change of mind is a
> new decision with `supersedes: PD-0016`.
