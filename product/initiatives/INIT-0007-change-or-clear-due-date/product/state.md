---
id: PSTATE-INIT-0007
type: product-state
title: Product definition state for INIT-0007
status: authoritative
revision: 1
owner_role: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
updated_by_role: ROLE-product-manager
initiative: INIT-0007
phase: INTAKE
phase_entered: 2026-10-31
requester: "the requester (repository owner, rortegalizardo), via the driving session, 2026-10-31"
next_action: "ROLE-product-manager: SKILL-advance-product-phase INTAKE -> DISCOVERY (write the Discovery section)"
blocked_by: []
converged: false
readiness_verdict: none   # none | READY | READY-with-known-issues | NOT READY | void
stories: []
design_refs: []
decisions: []
---

# Product definition state — INIT-0007

`phase` above is the authority for where this work stands on the product side.
Delivery stage lives in `delivery/state.md` and is owned by `ROLE-orchestrator`;
these two files never describe the same thing and never share a writer.

## Where this stands

INTAKE. Triage verdict `new-initiative`; `INIT-0007` allocated; raw request
committed verbatim; ambiguities A1–A13 classified, all `pm-resolvable`.

## Problem statement

Once a task is added, its due date cannot be set to a date the person
chooses, and cannot be removed. The requester wants one short command for
each. Source: `sources/2026-10-31-requester-request.md` (verbatim).

Today a due date is given only by `ttc add --due`. Afterwards,
`ttc postpone <id>` moves it to one day after the later of the due date and
today, and refuses a task with no due date (`PD-0011` items 3, 5);
`ttc copy <id> --due <d>` gives the date to a new task with a new id and
leaves the original as it is (`PD-0013` items 1, 3, 13). No command sets or
removes the due date of an existing task: `ttc due 1 2026-11-10` and
`ttc due 1 --clear` both fail with `ttc: unknown command: due (see ttc help)`,
exit 1 (checked on the CLI at head `1084f0a`). `PD-0003` Consequences records
this gap as an accepted cost ("No way to change a due date").

## Next action

ROLE-product-manager: SKILL-advance-product-phase INTAKE -> DISCOVERY (write the Discovery section).

## Blocked by

Nothing.

## Ambiguity log

All rows are `pm-resolvable`: each is a clarification of the stated outcome,
an equivalent expression of it, a story-level detail, or already decided
(`product-manager-orchestrator` §4.1; escalation-policy §3 route 2). The
request's own words settle the ties: "change a task's due date, or remove
it", "in one short command" and its two example commands. No row changes the
outcome, the user or a success measure, and no row drops or narrows a stated
need (§4.2), so no `Q-` is raised.

| Date | Ambiguity | Class (`pm-resolvable` / `escalation`) | Resolution or `Q-` |
| --- | --- | --- | --- |
| 2026-10-31 | A1. Does setting a date also give one to a task that has none? | pm-resolvable | Yes. "change a task's due date" read plainly covers a task with no due date (from none to a date); refusing it would add a rule the request never asked for and narrow the stated need (§4.2). Unlike `ttc postpone`, which only moves an existing date (`PD-0011` item 5). Recorded in the convergence `PD-`. |
| 2026-10-31 | A2. Which dates are accepted? | pm-resolvable | Already decided: the `ttc add --due` rule, `YYYY-MM-DD`, a real calendar date, a past date allowed, nothing later than `9999-12-31`, else `ttc: invalid date: <d>` (`PD-0003` item 5; `PD-0011` item 6; `PD-0013` item 3). |
| 2026-10-31 | A3. Open tasks only, or done tasks too? | pm-resolvable | Both, with the same rules, as for `ttc postpone`, `ttc important` and `ttc note` (`PD-0011` item 8; `PD-0009` item 3). |
| 2026-10-31 | A4. Removing the due date of a task that has none? | pm-resolvable | Already decided in kind: a no-op succeeds, changes nothing and exits 0 (`PD-0003` item 9), as `ttc note <id> --clear` does on a task with no note (README "Task notes"). Exact text fixed in the convergence `PD-`. |
| 2026-10-31 | A5. Setting the date the task already has? | pm-resolvable | A story-level detail under `PD-0003` item 9 (no-op message, or success like a same-title `rename`). Decided at SOLUTION_CONVERGENCE after the architect's input. |
| 2026-10-31 | A6. The command's name and form. | pm-resolvable | An equivalent expression of the same outcome (§4.1). The request gives an example, `ttc due <id> YYYY-MM-DD` and `ttc due <id> --clear`; it is the default. Options at SOLUTION_EXPLORATION, recorded in the convergence `PD-`. |
| 2026-10-31 | A7. Does the command with only an id show the due date, as `ttc note <id>` shows the note? | pm-resolvable | Not asked. Decided at SOLUTION_CONVERGENCE between the options; the due date already shows on every `ttc list` line (`PD-0003` item 8), unlike a note (README "Task notes"). |
| 2026-10-31 | A8. What the command prints on success. | pm-resolvable | An equivalent expression (§4.1), in the form of `PD-0003` item 10. Fixed text in the convergence `PD-`. |
| 2026-10-31 | A9. What follows from the new or removed date. | pm-resolvable | Already decided: the task's `!overdue` token, `--overdue`, `--due-from`, `--due-to`, `--no-due`, the `ttc stats` overdue count and the due value in `ttc export` follow the stored date (`PD-0003` item 6; `PD-0011` item 9; `PD-0014`). |
| 2026-10-31 | A10. Several tasks in one command? | pm-resolvable | Out of scope: "a task's due date" asks for one task per command. |
| 2026-10-31 | A11. Relative dates ("tomorrow", "+3d")? | pm-resolvable | Out of scope: the request names `YYYY-MM-DD`, the format every ttc date uses (`PD-0003` item 5). |
| 2026-10-31 | A12. Do `ttc postpone` or `ttc copy --due` change? | pm-resolvable | Out of scope: the request names them as today's ways; they stay as they are. |
| 2026-10-31 | A13. Does the ask reopen an earlier decision? | pm-resolvable | No. `PD-0003` Consequences records "No way to change a due date" as a cost ("adding one would be an eleventh story"), and INIT-0001, INIT-0003, INIT-0005 (`PD-0013` item 13) and INIT-0006 list it out of their scope. Those are scope boundaries of earlier initiatives, not a rejected decision, so §7.3 does not apply; the requester now asks for it. The convergence `PD-` records that it adds to `PD-0003`. |

## Discovery

_Written at DISCOVERY._

## Options

_Written at SOLUTION_EXPLORATION._

## Consultation log

| Date | Delegate role | Question | Answer / verdict | Recorded as |
| --- | --- | --- | --- | --- |

Dispatch log: `phase | delegate | vendor | model | tokens-scale | ledger run | artifact produced`

## Escalation log

| Date | Question | `Q-` | Asked of | Answer | Recorded as |
| --- | --- | --- | --- | --- | --- |

## Stories

| `REQ-` | Title | Status | `CAP-` | `DES-` | Sequencing note |
| --- | --- | --- | --- | --- | --- |

## Readiness log

Written by `ROLE-product-readiness-reviewer` only. One row per review round,
appended — a prior row is never edited, withdrawn, or overwritten. `Verdict` is
one of `READY`, `READY-with-known-issues`, or `NOT READY`; the first two open
the handoff gate, the third shuts it. Conditions and known issues live in their
own column and never in the verdict. `Story-set digest` is the ordered list of
`(REQ- id, revision, updated)` triples plus the initiative `revision`, and is
what makes the verdict void when the set moves.

| Date | Round | Verdict | Conditions | Reviewer | Story-set digest | Findings | Finding ids |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Readiness findings

Written by `ROLE-product-readiness-reviewer` only, one block per round producing
at least one finding. Finding ids are `RF-<INIT-nnnn>-<round>-<n>`, scoped to
this file: they bump no counter and appear in no index. A `NOT READY` verdict
with no findings rows is invalid output.

| Finding | Criterion | Artifact | What is wrong | Route phase | Route role |
| --- | --- | --- | --- | --- | --- |

## Handoff packet

_Assembled at ENGINEERING_READY._

## Handoff log

| Date | Receiving role | Packet digest | Note |
| --- | --- | --- | --- |

## Phase log

Dates are UTC timestamps.

| Date | From | To | Role | Trigger | Outcome | `context_digest` |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-11-01T03:24:00Z | — | BOOTSTRAP | ROLE-product-manager | Raw request relayed by the driving session | Packet: `readiness: ready`, `scope.initiative: null`, profile S, no areas, no open `Q-` (`Q-0001` answered). `neighbouring` read in full: `CAP-0001` (draft) has no command that sets or removes an existing task's due date; no `PD-` (accepted or rejected) decides against one; `PD-0003` items 2, 5, 6, 9–12, `PD-0004`, `PD-0008`, `PD-0010`, `PD-0011` (postpone), `PD-0013` (copy `--due`) and `PD-0014` (`--no-due`) bind or neighbour it; `PD-0003` Consequences "No way to change a due date" and the out-of-scope lines of INIT-0001/0003/0005/0006 are scope boundaries, not a rejected decision. INIT-0001..INIT-0006 are not touched. Advisory, carried: `CAP-0001` is still draft and predates shipped behaviour (code and README at head `1084f0a` are the current-state evidence); `delivery/tickets.md` mirror `synced_on` 2026-10-21 is stale; the working tree has an uncommitted edit to `INIT-0005/delivery/tickets.md` owned by another session, left alone. Tracker bound to Ariadne project TTC (`PD-0015`). Hooks: HOOK-canonical-root pass, HOOK-hydrate pass | `fb6dac4630751802`, head `1084f0a` |
| 2026-11-01T03:28:21Z | BOOTSTRAP | INTAKE | ROLE-product-manager | Packet emitted, scope resolved to none | Triage verdict `new-initiative`: not `satisfied-by CAP-0001` (no command sets or removes an existing task's due date; `ttc due` is an unknown command at head `1084f0a`); no `PD-` settles it (A13); no constraint forbids it; no initiative covers it (INIT-0001 base commands, INIT-0002 important mark, INIT-0003 postpone, INIT-0004 clean, INIT-0005 copy, INIT-0006 `--no-due`; each lists changing or clearing a due date out of scope), so not a duplicate; one outcome named. Raw request committed verbatim. `INIT-0007` allocated (counter 6 -> 7, checked against `origin/main` `1084f0a`). Size: small (≤3 stories expected; the driving session asks for one or two). Hooks: HOOK-initiative-resolved pass, HOOK-phase-entry pass | `fb6dac4630751802`, head `1084f0a` |

> Every product-side session updates this file before ending — **including
> sessions that failed**, which record the failure in `next_action` and do not
> advance `phase`.
