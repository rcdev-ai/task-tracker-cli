---
id: INIT-0007
type: initiative
title: A task's due date is changed or removed in one short command
status: draft
revision: 2
owner_role: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
capabilities: [CAP-0001]
requirements: [REQ-0016, REQ-0017]
tickets: []
decisions: []
---

# INIT-0007 — A task's due date is changed or removed in one short command

## Outcome

When this is done, a person using `ttc` can:

- **O1.** Give an existing task, open or done, with or without a due date,
  a due date they choose, with one short command.
- **O2.** Remove an existing task's due date with one short command.
- **O3.** Keep everything else as it is today: only that task's due date
  changes; every command typed as it can be typed today gives the same
  output, apart from the new usage that `ttc help` prints; and data files
  written by older ttc still work.

Source: the request (`product/sources/2026-10-31-requester-request.md`),
Discovery J1–J3 in `product/state.md`.

## Why now

The requester asked for it on 2026-10-31
(`product/sources/2026-10-31-requester-request.md`): "Today the only ways to
touch a due date after `ttc add` are `ttc postpone` and `ttc copy --due`."
Neither sets an existing task's due date to a chosen date, and nothing
removes one (Discovery P1–P3).

## Scope

**In scope.**

- One short way to set an existing task's due date to a date the user types,
  including a task with no due date (Ambiguity log A1).
- One short way to remove an existing task's due date.
- Their errors and no-op cases, under the rules every changing command
  follows.
- `ttc help` lists the new usage, and the README documents it.

**Out of scope.**

- Relative dates ("tomorrow", "+3d") or any date form other than
  `YYYY-MM-DD` (Ambiguity log A11).
- Changing the due date of several tasks in one command (A10).
- Any change to `ttc add`, `ttc postpone` or `ttc copy` (A12).
- Due times; reminders or notifications.
- Sorting tasks by due date.
- Any change to the output of a command typed as it can be typed today,
  other than the new usage in `ttc help`.

## Success measures

1. With one short command, an existing task, open or done, with or without a
   due date, gets the typed date and the command exits 0; `ttc list --all`
   then shows `due:<date>` on its line.
2. With one short command, an existing task's due date is removed and the
   command exits 0; its line in `ttc list --all` then has no `due:` token,
   and `ttc list --all --no-due` shows it.
3. An invalid date, an unknown id or a malformed command is refused with one
   line on stderr and exit 1, and `tasks.json` is not changed.
4. Only that task's due date changes; every command typed as it can be typed
   today gives the same output as before, apart from the new usage in
   `ttc help`.
5. A `tasks.json` written by older ttc works with both commands.
6. The CI `test` check passes on every pull request that delivers a story
   (`project/constraints.md` row 7).

## Product constraints

`project/constraints.md` rows 1–9 apply unchanged.

## Requirements

- `REQ-0016` — A task's due date is set to a chosen date in one short
  command.
- `REQ-0017` — A task's due date is removed in one short command.

## Capabilities affected

- `CAP-0001` — A person tracks their tasks locally from the ttc command line.

## Open questions

None.

## Scope log

| Date | Revision | Change | Reason |
| --- | --- | --- | --- |
| 2026-10-31 | 1 | Created at INTAKE | Triage verdict `new-initiative` |
| 2026-10-31 | 2 | Outcome O1–O3, scope, out of scope (6 items), success measures 1–6, `REQ-0016`, `REQ-0017` | PRODUCT_DEFINITION |
