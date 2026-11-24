---
id: DM-INIT-0008
type: delivery-manifest
title: Delivery manifest for INIT-0008
status: authoritative
revision: 1
owner_role: ROLE-orchestrator
created: 2026-11-24
updated: 2026-11-24
updated_by_role: ROLE-product-manager
initiative: INIT-0008
manifest_version: 1
band_owner: product
issued_on: 2026-11-24
issued_from_verdict: READY@2026-11-24
story_set_digest: "REQ-0025@5/2026-11-24; INIT-0008@3"
accepted_on: none
dispatch_unit: ticket
max_parallelism: 5
completion: pending
stories: [REQ-0025]
---

# Delivery manifest — INIT-0008

> Schema: `product/schemas/delivery-manifest.md`. Consumption:
> `product/architecture/delivery-fanout.md`.
> Product band (Identity → Ordering constraints) is written once by
> `ROLE-product-manager` and frozen at acceptance. Execution band (Dispatch
> units → Completion) is written only by `ROLE-orchestrator` at initiative scope.

## Identity

- Initiative: `INIT-0008` — A task added with a due date in the past gets a warning
- Outcome: A person using `ttc` who adds a task with `ttc add` and a due date before today still gets the task added exactly as today, and is also told in one line that the due date is in the past; adding a task with a due date of today or later, or with no due date, prints exactly what it prints today and nothing on stderr; a failed `ttc add` prints only its one error line; no other command, `ttc help` and the data file change (`initiative.md` `## Outcome`, O1–O2).
- Handoff packet: [`../product/state.md`](../product/state.md) `## Handoff packet`

## Shared references

- Design references: none — no user-facing surface
- Decisions in force: `PD-0003`, `PD-0008`, `PD-0017`, `PD-0018`
- Binding technical constraints:
  - C1 — "before today" uses the one existing local-date rule: due date before today in string order on `YYYY-MM-DD`, local time zone; today is not past; no second notion of today; boundary per `PD-0018` item 3 and AC-4 — `technical/assessment.md` round 1
  - C2 — the warning comes only with a task that was saved; every check and the save finish before any output — `technical/assessment.md` round 1
  - C3 — a failure after the save (stdout cannot be written) leaves at most one stderr line, never the warning; touches the shared output and failure handling, not only `ttc add` — `technical/assessment.md` round 1
  - C4 — stderr unwritable: exit 1 silently, task saved; no special case — `technical/assessment.md` round 1
  - C5 — the warning has the `ttc: ` form of a failure line; README "Exit codes" gains one sentence — `technical/assessment.md` round 1
  - C8 — only `ttc add` changes; `copy --due`, `due`, `import`, help, stored data and the data format stay — `technical/assessment.md` round 1
  - C9 — `PD-0017`: no new suite, oracle, fuzz or perf check; existing past-date tests updated (17 tests in 7 files measured); pinned-`TZ`, midnight-retry pattern for today — `technical/assessment.md` round 1
  - C10 — a "not past" test date is `2099-` or later or computed by the test; `2026-10-01` in `test/add.test.js` is now past — `technical/assessment.md` round 1
- Explicitly out of scope: [`../initiative.md`](../initiative.md) `## Scope`, Out of scope
- Open questions (non-blocking): none

## Stories

| REQ- | Title | Status | Readiness | Depends on | Blocked by | Wave (planned) |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-0025 | A task added with a due date in the past gets a one-line warning | accepted | engineering-ready | none | none | 0 |

## Ordering constraints

none — dependencies are the only ordering

---

## Dispatch units

| Unit | Stories | Depends on | State | Attempts | Last outcome | Dispatch ref | Wave | Updated |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Waves

| Wave | Units | Eligible-now count |
| --- | --- | --- |

## Dispatch ledger

| Date | Unit | Event | Detail |
| --- | --- | --- | --- |

## Completion

_Computed per schema §5.8. `pending` until every unit is `complete`._
