---
initiative: INIT-0008
type: solution-contract
title: Solution contract — A task added with a due date in the past gets a warning
status: accepted
revision: 1
owner_role: ROLE-product-manager
drafted_by: ROLE-product-manager (inline, size rule §9d.2)
validated_by: ROLE-product-manager
created: 2026-11-24
updated: 2026-11-24
chosen_decision: PD-0018
design_refs: []
---

# Solution contract — INIT-0008

> Cites `PD-0018` and `technical/assessment.md` round 1. A drift between this
> contract and those records is a defect in this contract.

## Chosen concept

Option A (`PD-0018`): `ttc add "<title>" --due <d>` with `<d>` before today
adds the task exactly as today (stdout `Added task <id>`, exit 0, the same
stored task) and also prints one line on stderr,
`ttc: warning: due date <d> is in the past`. "Before today" is the overdue
rule. Only `ttc add` changes; no other command, `ttc help`, stored data or
the data file format changes. Delivered as one story, `REQ-0025`.

## Key journeys

Examples assume the local date is 2026-11-24.

1. **A typo is caught.** `ttc add "Pay rent" --due 2025-12-01` prints
   `Added task 8` on stdout and
   `ttc: warning: due date 2025-12-01 is in the past` on stderr, and exits 0.
   Task 8 is stored with due date `2025-12-01` (`PD-0018` items 4–6). The
   user fixes it with `ttc due 8 2026-12-01` (README "Adding a task").
2. **A good date stays silent.** `ttc add "Pay rent" --due 2026-12-01`,
   `--due 2026-11-24` (today) and no `--due` each print only
   `Added task <id>`, stderr empty, exit 0, exactly as today (item 3).
3. **A failure says only the failure.**
   `ttc add "Pay rent" --due 2020-01-01 --tag "a b"` prints only
   `ttc: invalid tag: a b` on stderr, nothing on stdout, exits 1 and changes
   nothing (item 6, `PD-0003` item 11).
4. **Output that cannot be written.** With stdout closed,
   `ttc add "Pay rent" --due 2020-01-01` saves the task, prints exactly one
   stderr line, `ttc: cannot write output: <code>`, no warning, and exits 1
   (item 6, `PD-0008`). With stderr closed, it saves the task, prints
   `Added task <id>` and exits 1 silently (item 7).

## UX behavior

- Which command: `PD-0018` item 2. "Before today": item 3. The task is added
  as today: item 4. The warning text: item 5.
- When it prints, and every failure: item 6. stderr unwritable: item 7.
  Warning vs error and the exit code: item 8.
- README: item 9. Nothing else changes: item 10. Tests: item 11.

## Visual direction

None. ttc is "CLI only, no UI" (`project/constraints.md` row 8); no design
concept exists and none is needed (`PD-0018` item 12). The terminal text
above is the whole surface.

## Accepted trade-offs

- One successful case now writes a `ttc: warning:` line on stderr; a wrapper
  that treats any stderr as failure misreads it. The exit code stays the
  signal and the README says so (`PD-0018` Consequences; C5, R3).
- Keeping one stderr line on a failure after the save touches the output
  handling every command shares (band `multi-component`, C3).
- With stderr closed, a past-dated add exits 1 with the task added, where
  today it exits 0 (C4).
- 17 existing tests in 7 files change their expected stderr (N4).
- Fixed text that tests assert (Consequences).

## Unresolved risks

- R1 (`technical/assessment.md`): the warning written straight to stderr as
  the command runs, so a failure after the save prints two lines. Covered by
  `PD-0018` item 6 and an acceptance criterion with stdout closed.
- R2: the warning shown before `Added task <id>` on one terminal. Covered by
  item 6 ("after `Added task <id>` has been written").
- R5: a test that computes today without pinning `TZ` flakes across
  midnight. Covered by item 11 (pinned-`TZ`, midnight-retry pattern).

## DES- references

None: no user-facing visual surface (`PD-0018` item 12).
