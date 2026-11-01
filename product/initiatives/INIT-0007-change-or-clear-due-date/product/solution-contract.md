---
initiative: INIT-0007
type: solution-contract
title: Solution contract — A task's due date is changed or removed after it was added, in one short command
status: accepted
revision: 1
owner_role: ROLE-product-manager
drafted_by: ROLE-product-manager (inline, size rule §9d.2)
validated_by: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
chosen_decision: PD-0016
design_refs: []
---

# Solution contract — INIT-0007

> Cites `PD-0016` and `technical/assessment.md` round 1. A drift between this
> contract and those records is a defect in this contract.

## Chosen concept

Option A (`PD-0016`): `ttc due <id> YYYY-MM-DD` sets a task's due date and
`ttc due <id> --clear` removes it, on open and done tasks, with or without a
due date. The date follows the `ttc add --due` rule. Only that task's due
date changes; there is no stored-format change. Removing a due date that is
not there is a no-op that succeeds. Delivered as two stories: `REQ-0016`
(set), then `REQ-0017` (remove).

## Key journeys

1. **Move a deadline.** Open task 7 `Pay rent` due `2026-11-01`.
   `ttc due 7 2026-11-10` prints `Set due date of task 7 to 2026-11-10` and
   exits 0; `ttc list` then shows `due:2026-11-10` on its line (`PD-0016`
   items 2, 4, 8).
2. **Give a task a deadline it never had.** Open task 2 `Call mom` with no due
   date. `ttc due 2 2026-12-24` prints
   `Set due date of task 2 to 2026-12-24` and exits 0 (item 2).
3. **Drop a deadline.** `ttc due 7 --clear` prints
   `Cleared due date of task 7` and exits 0; the task's line loses its `due:`
   token and the task now matches `ttc list --no-due` (items 4, 8).
4. **Drop it again.** A second `ttc due 7 --clear` prints
   `Task 7 has no due date`, exits 0 and writes nothing (item 5).
5. **A wrong date is told, not stored.** `ttc due 7 2026-02-30` prints
   `ttc: invalid date: 2026-02-30` to stderr, exits 1 and leaves `tasks.json`
   byte-identical (items 2, 6).
6. **Both at once is refused.** `ttc due 7 2026-11-10 --clear` prints
   `ttc: due date and --clear cannot be combined` and exits 1 (item 6).

## UX behavior

- The command and its argument rules: `PD-0016` item 1. Setting: item 2.
  The same date again: item 3. Success lines: item 4. The no-op: item 5.
- Check order and refusals: item 6. Shared changing-command rules: item 7.
- What changes and what does not: item 8. Storage and older files: item 9.
- Help: item 10. README: item 11. The two-story split: item 12.
  Out of scope: item 13.

## Visual direction

None. ttc is "CLI only, no UI" (`project/constraints.md` row 8); no design
concept exists and none is needed (`PD-0016` item 14). The terminal text above
is the whole surface.

## Accepted trade-offs

- Setting the date the task already has writes the file, so a file written by
  older ttc becomes version 4 (`PD-0016` item 3, Consequences; R4).
- `REQ-0017` re-touches the usage line, its assertions, the test oracle, the
  fuzz cases and the README that `REQ-0016` wrote (item 12, Consequences).
- `Task <id> has no due date` (stdout, exit 0) shares words with
  `ttc postpone`'s refusal; the prefix, stream and exit code tell them apart
  (Consequences).
- Fixed text that tests assert (Consequences).

## Unresolved risks

- R1 (`technical/assessment.md`): an oracle copied from the new code. Covered
  by C5, which binds both stories.
- R2: a removed due date stored as something other than `null`, making the
  file unreadable. Covered by `PD-0016` item 9 and an acceptance criterion
  that reads the file back after removal.
- R3: `REQ-0016` tests that assert the `--clear` refusal or fix the bare-id
  error text. Covered by `PD-0016` item 12.

## DES- references

None: no user-facing visual surface (`PD-0016` item 14).
