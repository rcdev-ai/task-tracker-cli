---
id: DM-INIT-0007
type: delivery-manifest
title: Delivery manifest for INIT-0007
status: authoritative
revision: 1
owner_role: ROLE-orchestrator
created: 2026-10-31
updated: 2026-10-31
updated_by_role: ROLE-orchestrator
initiative: INIT-0007
manifest_version: 1
band_owner: delivery
issued_on: 2026-10-31
issued_from_verdict: READY@2026-10-31
story_set_digest: "REQ-0016@4/2026-10-31; REQ-0017@3/2026-10-31; INIT-0007@3"
accepted_on: 2026-10-31
dispatch_unit: ticket
max_parallelism: 5
completion: pending
stories: [REQ-0016, REQ-0017]
---

# Delivery manifest — INIT-0007

> Schema: `product/schemas/delivery-manifest.md`. Consumption:
> `product/architecture/delivery-fanout.md`.
> Product band (Identity → Ordering constraints) is written once by
> `ROLE-product-manager` and frozen at acceptance. Execution band (Dispatch
> units → Completion) is written only by `ROLE-orchestrator` at initiative scope.

## Identity

- Initiative: `INIT-0007` — A task's due date is changed or removed in one short command
- Outcome: A person using `ttc` can give an existing task, open or done, with or without a due date, a due date they choose, with one short command; remove an existing task's due date with one short command; and keep everything else as it is today: only that task's due date changes, every command typed as it can be typed today gives the same output apart from the new usage that `ttc help` prints, and data files written by older ttc still work (`initiative.md` `## Outcome`, O1–O3).
- Handoff packet: [`../product/state.md`](../product/state.md) `## Handoff packet`

## Shared references

- Design references: none — no user-facing surface
- Decisions in force: `PD-0003`, `PD-0004`, `PD-0008`, `PD-0010`, `PD-0011`, `PD-0013`, `PD-0014`, `PD-0016`
- Binding technical constraints:
  - C1 — every changing-command rule applies unchanged (checks before the lock, atomic write, a refusal writes nothing, busy failure, failure after the save keeps the change) — `technical/assessment.md` round 1
  - C2 — the typed date follows the one existing `ttc add --due` rule — `technical/assessment.md` round 1
  - C3 — only `due` changes; a removed due date is `null`; no stored-format change — `technical/assessment.md` round 1
  - C4 — one usage line, after `ttc postpone <id>`, asserted verbatim — `technical/assessment.md` round 1
  - C5 — the test oracle and the argument fuzzing gain `due`, from the decided rules — `technical/assessment.md` round 1
  - C6 — the decided check order is test-asserted — `technical/assessment.md` round 1
  - C7 — the perf guard must still pass — `technical/assessment.md` round 1
  - C9 — `ttc due <id>` alone is an argument error, checked after the id — `technical/assessment.md` round 1
  - C10 — everything that follows from the due date follows the new value — `technical/assessment.md` round 1
- Explicitly out of scope: [`../initiative.md`](../initiative.md) `## Scope`, Out of scope
- Open questions (non-blocking): none

## Stories

| REQ- | Title | Status | Readiness | Depends on | Blocked by | Wave (planned) |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-0016 | A task's due date is set to a chosen date in one short command | accepted | engineering-ready | none | none | 0 |
| REQ-0017 | A task's due date is removed in one short command | accepted | engineering-ready | REQ-0016 | none | 1 |

## Ordering constraints

- `REQ-0017` after `REQ-0016`: it adds the removing form to the command `REQ-0016` introduces, and extends its usage line, tests, oracle, fuzz cases and README section.

---

## Dispatch units

| Unit | Stories | Depends on | State | Attempts | Last outcome | Dispatch ref | Wave | Updated |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TTC-1 | REQ-0016 | none | eligible | 0 | none | none | 0 | 2026-10-31 |
| TTC-2 | REQ-0017 | TTC-1 | not-eligible | 0 | none | none | 1 | 2026-10-31 |

## Waves

| Wave | Units | Eligible-now count |
| --- | --- | --- |
| 0 | TTC-1 | 1 |
| 1 | TTC-2 | 0 |

## Dispatch ledger

| Date | Unit | Event | Detail |
| --- | --- | --- | --- |
| 2026-10-31 | INIT-0007 | accepted | band_owner delivery; cap 5 (manifest max_parallelism) |

## Completion

_Computed per schema §5.8. `pending` until every unit is `complete`._
