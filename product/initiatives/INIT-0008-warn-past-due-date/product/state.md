---
id: PSTATE-INIT-0008
type: product-state
title: Product definition state for INIT-0008
status: authoritative
revision: 7
owner_role: ROLE-product-manager
created: 2026-11-24
updated: 2026-11-24
updated_by_role: ROLE-product-manager
initiative: INIT-0008
phase: DECOMPOSITION
phase_entered: 2026-11-24
requester: "the requester (repository owner), via the driving session, 2026-11-24"
next_action: "ROLE-product-manager: run coverage validation (full), accept REQ-0025 and declare convergence"
blocked_by: []
converged: false
readiness_verdict: none   # none | READY | READY-with-known-issues | NOT READY | void
stories: [REQ-0025]
design_refs: []
decisions: [PD-0018]
---

# Product definition state — INIT-0008

`phase` above is the authority for where this work stands on the product side.
Delivery stage lives in `delivery/state.md` and is owned by `ROLE-orchestrator`;
these two files never describe the same thing and never share a writer.

## Where this stands

DECOMPOSITION. Option A chosen and recorded as `PD-0018`; Solution Contract
written (`product/solution-contract.md`); `initiative.md` rev 3, draft
`REQ-0025` rev 2 cite it.

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

ROLE-product-manager: run coverage validation (full), accept REQ-0025 and declare convergence.

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
| 2026-11-24 | A1. Which commands warn? `ttc add --due` is named. `ttc copy <id> --due <d>` and `ttc due <id> <d>` also take a typed date. | pm-resolvable | `ttc add` only, set as scope at PRODUCT_DEFINITION (`initiative.md` out of scope). The request names adding a task ("When I add a task"); keeping the stated outcome without an unasked addition to two more commands is the PM's call (§4.1), and "Keep it simple" points the same way. A later ask can extend the same line to `ttc copy --due` and `ttc due`. Recorded in the convergence `PD-`. |
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

**Target user.** One person who keeps their own task list with `ttc` on their
own machine: the requester. ttc has one user and no shared list
(`CAP-0001` Boundaries; INIT-0001 out of scope). Source: S1 below.

**Jobs and problems, with sources.**

| # | Job or problem | Source |
| --- | --- | --- |
| J1 | Notice, when adding a task, that the due date they typed is already in the past ("When I add a task with a due date that is already in the past, it's usually a typo and I don't notice. Warn me when that happens."). | Request, verbatim (`sources/2026-11-24-requester-request.md`) |
| J2 | Keep it simple ("Keep it simple."). | Request, verbatim (same file) |
| P1 | `ttc add` with a past due date is silent: `ttc add "Pay rent" --due 2020-01-01` prints `Added task 1`, exits 0 and prints nothing on stderr. `ttc add` only checks that the date is a valid `YYYY-MM-DD` date (`PD-0003` item 5: "A date in the past is allowed"). | Checked on the CLI at head `e71f675`; `src/commands/add.js` at the same head |
| P2 | The only later signs are the task's `!overdue` token in `ttc list`, `ttc list --overdue` and the `ttc stats` overdue count, and only if the person looks. A task added with a past due date is overdue from the start. | `PD-0003` items 6, 8, 15; README "Listing and filtering tasks" |
| P3 | Once noticed, the date is fixed in one command, `ttc due <id> YYYY-MM-DD`. What is missing is noticing, not fixing. | `PD-0016`; README "Changing a due date" |
| P4 | Today ttc writes to stderr only when a command fails; a command that exits 0 prints nothing on stderr. A warning is a new kind of output. | README "Exit codes"; `PD-0003` item 11; `src/cli.js`, `bin/ttc.js` at head `e71f675` (the only stderr writes are failure lines) |
| P5 | A due date is typed in three commands, all under one date rule that allows past dates: `ttc add --due`, `ttc copy <id> --due` and `ttc due <id> YYYY-MM-DD`. The request names only adding a task. | README "Copying a task", "Changing a due date"; `PD-0013` item 3; `PD-0016` |

**Current-state capability mapping (S2).** `CAP-0001` — local task tracking
from the `ttc` command line. This initiative extends it. `CAP-0001` is still
`draft` and does not describe everything that shipped; the current-state
evidence is the code and README at head `e71f675`:

- `ttc add "<title>" [--due YYYY-MM-DD] [--tag <t>]... [--note "<text>"] [--important]`
  adds an open task and prints `Added task <id>`, exit 0 (`PD-0003` item 10).
  `--due` takes a real calendar date, a past date allowed, nothing later
  than `9999-12-31`, else `ttc: invalid date: <d>` (`PD-0003` item 5;
  `PD-0011` item 6).
- "Today" is the local date on the user's machine; a task is overdue when it
  is open and its due date is before today (`PD-0003` item 6;
  `src/overdue.js`).
- Every failure prints exactly one `ttc: <message>` line on stderr, nothing on
  stdout, exits 1 and changes nothing; a failure after the save exits 1 and
  keeps the change; if stderr cannot be written, ttc exits 1 silently
  (`PD-0003` item 11; `PD-0008`; README "Exit codes").

**Success signals (S3).**

1. A user who adds a task with a due date before today sees one line saying
   the due date is in the past; the task is added exactly as today
   (`Added task <id>`, exit 0).
2. A due date of today or later, or no due date, gives exactly today's
   output, with nothing on stderr.
3. A failed `ttc add` prints only its one error line, as today.
4. Nothing else changes: every other command, `ttc help` and the data file
   stay as they are.

**Known non-goals.** Refusing a past due date (A3); asking for confirmation
(A4); a switch to turn the warning off (A7); `ttc import` (A8); guessing a
corrected date (A10); `ttc copy` without `--due` (A11); checks for other
likely typos.

Sources: S1 = the request file above; INIT-0001 `initiative.md` out of scope;
S2/S3 = the code and README at head `e71f675`.

## Options

Framed by the PM at SOLUTION_EXPLORATION entry; verdicts from the architect
(`technical/assessment.md`, round 1). Both options keep the task added exactly as today, exit 0, and
warn only on `ttc add` with a due date before today (`initiative.md` scope).

| Option | User-visible difference | Feasibility verdict | Cost / risk | Trade-off |
| --- | --- | --- | --- | --- |
| A — the warning on stderr | stdout stays exactly `Added task <id>`; stderr holds one line, `ttc: warning: due date <d> is in the past` | `feasible-with-constraints`, band `multi-component` (`technical/assessment.md`, round 1) | Constraints C1–C5, C8–C10; R1–R3, R5. Keeping one stderr line on a failure after the save touches the output handling every command shares (C3). 17 existing tests in 7 files change their expected stderr (N4). No stored-format change | stdout and every script reading it unchanged; stderr is no longer empty on every exit 0 |
| B — the warning on stdout | stdout holds `Added task <id>` and then a second line, `Warning: due date <d> is in the past`; stderr stays empty | `feasible-with-constraints`, band `contained` (`technical/assessment.md`, round 1) | Constraints C1, C2, C6–C10; R4, R5. Needs `PD-0003` item 10 amended and success measure 1 rewritten (C6, P1). 7 existing tests in 2 files change (N4). No stored-format change | stderr stays for failures only; a changing command no longer prints exactly one stdout line (`PD-0003` item 10) |

_Recommended option and why:_ **A.** It is the option that keeps the stated
outcome and every accepted decision intact: stdout stays exactly
`Added task <id>` (`PD-0003` item 10, the A5 bound, success measure 1), and
scripts that read that line keep working. B is cheaper (`contained`, 7 test
changes) but needs `PD-0003` item 10 amended (C6, P1); contradicting an
accepted `PD-` is escalation-class (§4.2) and the only gain is build cost, so
choosing A is the PM's call (§4.1; escalation-policy §3 route 2) and no
requester question is raised. The architect's N1–N6 are taken as
recommended: the warning is printed only when `ttc add` exits 0, after
`Added task <id>` (N1, C3, R2); a warning that cannot be written is treated
as `PD-0008`, which under A is today's "stderr unwritable → exit 1 silently",
task kept (N2, C4); today is the overdue rule (N3, C1); the measured test
impact stays within `PD-0017` (N4, C9, C10); the README gets an "Adding a
task" section and one "Exit codes" sentence (N5, C5); one story (N6).
Success measure 3 gets the `PD-0008` exception (P4) at convergence.

_Chosen (SOLUTION_CONVERGENCE, 2026-11-24):_ **A**, `PD-0018`. B and six
other shapes rejected for the reasons in `PD-0018` "Options considered".
N1–N6 settled as the architect recommended (`PD-0018` items 2–12). No option
is left under consideration.

## Consultation log

| Date | Delegate role | Question | Answer / verdict | Recorded as |
| --- | --- | --- | --- | --- |
| 2026-11-24 | ROLE-planner (PRODUCT-DISCOVERY) | Feasibility verdict, constraints, risks and band for options A and B, plus recommendations on when the warning prints, an unwritable warning, today, test impact, README and the story split (one dispatch: capability scan, impact, assessment; §9d.1) | A `feasible-with-constraints`, `multi-component`; B `feasible-with-constraints`, `contained`; constraints C1–C10 (C3–C5 A only, C6–C7 B only); risks R1–R5 (R1–R3 A only, R4 B only); assumptions P1 blocking for B only, P2–P4 narrowing; no stored-format change. N1 warn only when `ttc add` exits 0, after `Added task <id>`; N2 an unwritable line is `PD-0008` (exit 1, task kept); N3 the overdue rule; N4 A 17 tests in 7 files, B 7 in 2, both inside `PD-0017`, `2026-10-01` in `test/add.test.js` now past (C10); N5 README "Adding a task" plus one "Exit codes" sentence; N6 one story. No `Q-`. Registry note: `CAP-0001` out of date (as in INIT-0002..0007) | `technical/capability-scan.md`, `technical/impact.md`, `technical/assessment.md` (round 1); Options table; this row |
| 2026-11-24 | ROLE-planner (PRODUCT-DISCOVERY) | Story-set technical coherence, full pass, on the draft set `REQ-0025` rev 3 against `PD-0018` and `technical/assessment.md` round 1, at head `e24972c` (after PR #62 `ttc list --count` and PR #63 `isOverdue` `<=`); declared round 1 of 2, terminal unless it reports a blocking defect (§9d.3, §9a.1) | `coherent`; one non-blocking defect D1 (the Sequencing note names only AC-10's CI clause as waiting for a green `main`; the local `npm test` clause waits too, and CI runs only on pull requests); no `Q-`. C1, C3, C4, C9, C10 re-measured and still hold (C9: 17 tests in 7 files, on top of the 6 already failing); every AC text resting on today's behaviour matches `node bin/ttc.js` at `e24972c`; the red-CI note is accurate and not a hidden prerequisite; the set still matches option A. Side note: while PR #63 stays, `PD-0018` item 3's "exactly when the task would show `!overdue`" is false for a date equal to today; REQ-0025 C1 and AC-4 bind the boundary to `PD-0003` item 6, so the story is unaffected. Round 1 terminal: no round 2. D1 `fixed` inline by the PM (`REQ-0025` rev 4, Sequencing note), no re-review (§9d.3) | `technical/coherence.md` (round 1); this row |

Dispatch log: `phase | delegate | vendor | model | tokens-scale | ledger run | artifact produced`

- `SOLUTION_EXPLORATION | ROLE-planner | claude | opus | L (subagent reported 109,580 tokens, 31 tool uses, 491 s) | aaef3ab929c58bfa8 | technical/capability-scan.md, impact.md, assessment.md`
- `DECOMPOSITION | ROLE-planner | claude | opus | L (subagent reported 90,133 tokens, 24 tool uses, 316 s) | a1fd2241b2517480e | technical/coherence.md (round 1)`

## Escalation log

| Date | Question | `Q-` | Asked of | Answer | Recorded as |
| --- | --- | --- | --- | --- | --- |

## Stories

| `REQ-` | Title | Status | `CAP-` | `DES-` | Sequencing note |
| --- | --- | --- | --- | --- | --- |
| REQ-0025 | A task added with a due date in the past gets a one-line warning | draft (rev 4) | CAP-0001 | none — no user-facing visual surface | none — on the frontier |

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
| 2026-11-24T07:46:00Z | INTAKE | DISCOVERY | ROLE-product-manager | INTAKE exit criteria met: one initiative, one problem, one named requester, ambiguity rows A1–A12 all classified (`pm-resolvable`) | Entry precondition (`lifecycle-hooks.md` §3.4.1 DISCOVERY) holds: `initiative.md` at `status: draft`; state at INTAKE with requester, problem statement and a classified ambiguity log. Discovery written (J1, J2, P1–P5, S2 `CAP-0001`, S3 signals 1–4, non-goals). No delegate consulted (optional, read-only; the code and README answer the current state). No `Q-` raised. Hooks: HOOK-phase-entry pass | `4e3902b0918715b5`, head `281c20c` |
| 2026-11-24T07:48:00Z | DISCOVERY | PRODUCT_DEFINITION | ROLE-product-manager | DISCOVERY exit criteria met: problem, user, current state and success signals stated with sources; no open escalation-class ambiguity | Entry precondition (`lifecycle-hooks.md` §3.4.1 PRODUCT_DEFINITION) holds: Discovery has the target user, jobs J1–J2 and problems P1–P5 each with a source (S1), mapping `CAP-0001` (S2), success signals 1–4 (S3) and known non-goals. Hooks: HOOK-phase-entry pass | `4e3902b0918715b5`, head `e8d0ff5` |
| 2026-11-24T07:55:00Z | PRODUCT_DEFINITION | SOLUTION_EXPLORATION | ROLE-product-manager | PRODUCT_DEFINITION exit criteria met: outcome O1–O2, out of scope (7 items), success measures 1–6, draft `REQ-0025` covering O1–O2, Product Definition Contract citing the raw request | Entry precondition (`lifecycle-hooks.md` §3.4.1 SOLUTION_EXPLORATION) holds: F1 `initiative.md` rev 2 has an outcome and a non-empty out-of-scope section; one `status: draft` `REQ-`; F2 draft-mode coverage (inline, deterministic): J1 -> `REQ-0025` Requirement ("ttc also prints one line saying the due date is in the past"), J2 -> `REQ-0025` (one line, no confirmation, no switch); O1, O2 -> `REQ-0025` `outcome_element`; no `R1` defect. One story (size rule). `requirement` counter 24 -> 25, checked against `origin/main`. Scope choice A1 (`ttc add` only) set in `initiative.md`; recorded in the convergence `PD-`. Hooks: HOOK-phase-entry pass | `4e3902b0918715b5`, head `e8d0ff5` |
| 2026-11-24T07:58:00Z | SOLUTION_EXPLORATION | SOLUTION_CONVERGENCE | ROLE-product-manager | SOLUTION_EXPLORATION exit criteria met: options A and B recorded, each with a feasibility verdict (`feasible-with-constraints`) and a user-visible trade-off; PM recommends A with reasons | Entry precondition (`lifecycle-hooks.md` §3.4.1 SOLUTION_CONVERGENCE) holds: X1 two distinguishable options (stderr line vs second stdout line); X2 each verdict in the closed set (`technical/assessment.md` round 1); one Consultation log row for the one delegate response. One architect dispatch (§9d.1), routed by `product.planner` = claude, opus. No design dispatch: no visual surface (`project/constraints.md` row 8; recorded in the convergence `PD-`, §9d.5). Hooks: HOOK-phase-entry pass | `4e3902b0918715b5`, head `b3945a4` |
| 2026-11-24T08:02:00Z | SOLUTION_CONVERGENCE | DECOMPOSITION | ROLE-product-manager | SOLUTION_CONVERGENCE exit criteria met: one accepted `PD-0018` naming option A, B and six other shapes rejected with reasons, consequences (costs first) accepted; indexed in the same commit; `initiative.md` rev 3 and draft `REQ-0025` rev 2 consistent with it (success measure 3 states the `PD-0008` case, P4); no option left under consideration; Solution Contract cites `PD-0018` and records no design concept (no visual surface, `PD-0018` item 12) | Entry precondition (`lifecycle-hooks.md` §3.4.1 DECOMPOSITION) holds: exactly one `status: accepted` chosen-option `PD-` citing a non-`infeasible` verdict (`feasible-with-constraints`, `technical/assessment.md` round 1). HOOK-decision-capture R1 (index row, same commit), R3 (rejected options non-empty), D11 (decision counter 18 matches the highest id; `origin/main` at 17, no `PD-0018` there) pass. No escalation-class question: A keeps every accepted decision, B would amend `PD-0003` item 10 for build cost only (§4.1; escalation-policy §3 route 2). Hooks: HOOK-phase-entry pass | `4e3902b0918715b5`, head `2e39e7d` |

> Every product-side session updates this file before ending — **including
> sessions that failed**, which record the failure in `next_action` and do not
> advance `phase`.
