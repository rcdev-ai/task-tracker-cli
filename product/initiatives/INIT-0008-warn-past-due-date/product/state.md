---
id: PSTATE-INIT-0008
type: product-state
title: Product definition state for INIT-0008
status: authoritative
revision: 1
owner_role: ROLE-product-manager
created: 2026-11-24
updated: 2026-11-24
updated_by_role: ROLE-product-manager
initiative: INIT-0008
phase: INTAKE
phase_entered: 2026-11-24
requester: "the requester (repository owner), via the driving session, 2026-11-24"
next_action: "ROLE-product-manager: SKILL-advance-product-phase (INTAKE -> DISCOVERY), write the Discovery section"
blocked_by: []
converged: false
readiness_verdict: none   # none | READY | READY-with-known-issues | NOT READY | void
stories: []
design_refs: []
decisions: []
---

# Product definition state — INIT-0008

`phase` above is the authority for where this work stands on the product side.
Delivery stage lives in `delivery/state.md` and is owned by `ROLE-orchestrator`;
these two files never describe the same thing and never share a writer.

## Where this stands

INTAKE. Triage verdict `new-initiative`; raw request committed verbatim; every
ambiguity classified `pm-resolvable`.

## Problem statement

When a person adds a task with `ttc add "<title>" --due <d>` and `<d>` is
before today, `ttc` adds the task without a word: it prints `Added task <id>`,
exits 0 and prints nothing on stderr (checked on the CLI at head `e71f675`
with `--due 2020-01-01`). The requester says such a date "is usually a typo
and I don't notice", and asks to be warned when it happens, kept simple.
Source: `sources/2026-11-24-requester-request.md` (verbatim).

A past due date is allowed (`PD-0003` item 5) and stays allowed: the ask is a
warning, not a refusal.

## Next action

ROLE-product-manager: SKILL-advance-product-phase (INTAKE -> DISCOVERY), write the Discovery section.

## Blocked by

Nothing.

## Ambiguity log

All rows are `pm-resolvable`: each is a clarification of the stated outcome,
an equivalent expression of it, a story-level detail, or already decided
(`product-manager-orchestrator` §4.1; escalation-policy §3 route 2). The
request's own words settle the ties: "When I add a task", "Warn me" and "Keep
it simple". No row changes the outcome, the user or a success measure, and no
row drops or narrows a stated need (§4.2), so no `Q-` is raised.

| Date | Ambiguity | Class (`pm-resolvable` / `escalation`) | Resolution or `Q-` |
| --- | --- | --- | --- |
| 2026-11-24 | A1. Which commands warn? `ttc add --due` is named. `ttc copy <id> --due <d>` and `ttc due <id> <d>` also take a typed date. | pm-resolvable | Options at SOLUTION_EXPLORATION: `ttc add` only, or every command that takes a typed due date. The request names adding a task; choosing the option that keeps the stated outcome without an unasked addition is the PM's call (§4.1). Recorded in the convergence `PD-`. |
| 2026-11-24 | A2. What is "in the past"? | pm-resolvable | Already decided: before today, where today is the date on the user's machine in its local time zone; a date equal to today is not past (`PD-0003` item 6, the overdue test). A task added with a past due date is exactly a task that is overdue from the start. |
| 2026-11-24 | A3. Warn, or refuse the date? | pm-resolvable | Warn. The request says "Warn me"; a past date stays allowed (`PD-0003` item 5) and the task is still added. Refusing would change `PD-0003` item 5, which nobody asked for. |
| 2026-11-24 | A4. Ask for confirmation first? | pm-resolvable | No. "No command asks for confirmation" (`PD-0003` item 10), and a question breaks scripted use; "Keep it simple". |
| 2026-11-24 | A5. Where the warning goes and its exact text. | pm-resolvable | An equivalent expression of the same outcome (§4.1). Bound: stdout stays exactly `Added task <id>` (`PD-0003` item 10). Fixed text in the convergence `PD-` after the architect's input. |
| 2026-11-24 | A6. Exit code when the warning is shown. | pm-resolvable | 0: the task was added, so the command did what was asked (README "Exit codes"; `PD-0003` items 10, 11). A warning is not an error (`project/constraints.md` row 6 governs errors). |
| 2026-11-24 | A7. A flag or setting to turn the warning off? | pm-resolvable | Out of scope: not asked, and "Keep it simple". |
| 2026-11-24 | A8. Does `ttc import` warn about past dates in a file? | pm-resolvable | Out of scope: import replaces the whole list from a file (`PD-0003` item 14); it is not adding a task, and an export of a real list holds past dates by nature. |
| 2026-11-24 | A9. A `ttc add` with a past date that fails for another reason (bad tag, unreadable file, busy file). | pm-resolvable | Already decided: a failure prints exactly one line on stderr and changes nothing (`PD-0003` item 11), so no warning then. The warning only comes with a task that was added. |
| 2026-11-24 | A10. Should the warning suggest a fix or a corrected date? | pm-resolvable | No guessed date: out of scope. Whether the README points at `ttc due <id> YYYY-MM-DD` (`PD-0016`) is a wording detail, fixed in the convergence `PD-`. |
| 2026-11-24 | A11. Copying a task whose stored due date is past, with no `--due`. | pm-resolvable | Out of scope: no date is typed, so there is no typo to catch. |
| 2026-11-24 | A12. Does the ask reopen an earlier decision? | pm-resolvable | No. `PD-0003` item 5 ("A date in the past is allowed") stays true. The warning adds a new kind of output: today ttc prints on stderr only when it fails (README "Exit codes"; `PD-0003` item 11). The convergence `PD-` records that it adds to `PD-0003`. No `rejected` `PD-` matches. |

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

## Coverage validation

_Written at DECOMPOSITION._

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
| 2026-11-24T07:40:00Z | — | BOOTSTRAP | ROLE-product-manager | Raw request relayed by the driving session | Packet: `readiness: ready`, `scope.initiative: null`, profile S, no areas, no open `Q-` (`Q-0001` answered). `neighbouring` read in full: `CAP-0001` (draft) gives tasks due dates and shows overdue ones, with no warning on a past date; `PD-0003` items 5 (a past date is allowed), 6 (today and overdue), 10 (success output, no confirmation), 11 (errors) bind it; `PD-0004`, `PD-0008`, `PD-0013` (`ttc copy --due`), `PD-0016` (`ttc due`), `PD-0017` (test obligations) and `PD-0015` (Ariadne) neighbour it; no `rejected` `PD-` matches. Ariadne project TTC (56 tickets) has no ticket about warning on a past due date; TTC-865 (`ttc -h`) and TTC-866 (`ttc list --count`) are in progress and do not touch `ttc add`. Advisory, carried: `CAP-0001` is still draft and predates shipped behaviour (code and README at head `e71f675` are the current-state evidence); the working tree has an uncommitted edit to `INIT-0005/delivery/tickets.md` owned by another session, left alone; `project/constraints.md` row 9 names `rortegalizardo/task-tracker-cli`, while `origin` and the driving session name `rcdev-ai/task-tracker-cli` (same local path). Hooks: HOOK-canonical-root pass, HOOK-hydrate pass | `4e3902b0918715b5`, head `e71f675` |
| 2026-11-24T07:42:00Z | BOOTSTRAP | INTAKE | ROLE-product-manager | Packet emitted, scope resolved to none | Triage verdict `new-initiative`: not `satisfied-by CAP-0001` (`ttc add --due 2020-01-01` prints only `Added task 1`, exit 0, empty stderr at head `e71f675`); not `settled-by` a `PD-` (A12); no constraint forbids it; no initiative or ticket covers it, so not a duplicate; one outcome named. Raw request committed verbatim. `INIT-0008` allocated by `factory init-id --project TTC --after 7` (counter 7 -> 8; `origin/main` `e71f675` at 7). Size: small (≤3 stories expected; the driving session asks for one). Hooks: HOOK-initiative-resolved pass, HOOK-phase-entry pass | `4e3902b0918715b5`, head `e71f675` |

> Every product-side session updates this file before ending — **including
> sessions that failed**, which record the failure in `next_action` and do not
> advance `phase`.
