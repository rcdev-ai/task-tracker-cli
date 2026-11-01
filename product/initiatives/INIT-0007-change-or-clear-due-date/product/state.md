---
id: PSTATE-INIT-0007
type: product-state
title: Product definition state for INIT-0007
status: authoritative
revision: 9
owner_role: ROLE-product-manager
created: 2026-10-31
updated: 2026-10-31
updated_by_role: ROLE-product-manager
initiative: INIT-0007
phase: HANDOFF
phase_entered: 2026-10-31
requester: "the requester (repository owner, rortegalizardo), via the driving session, 2026-10-31"
next_action: "ROLE-product-manager: HANDOFF — create the Ariadne tickets for REQ-0016 and REQ-0017 (TTC), REQ-0017 blocked by REQ-0016, and write delivery/tickets.md"
blocked_by: []
converged: true
readiness_verdict: READY   # none | READY | READY-with-known-issues | NOT READY | void
stories: [REQ-0016, REQ-0017]
design_refs: []
decisions: [PD-0016]
---

# Product definition state — INIT-0007

`phase` above is the authority for where this work stands on the product side.
Delivery stage lives in `delivery/state.md` and is owned by `ROLE-orchestrator`;
these two files never describe the same thing and never share a writer.

## Where this stands

HANDOFF. Handoff packet assembled; `delivery/manifest.md` issued at `band_owner: product` against `READY@2026-10-31`; INIT-0007 `active`; both stories `engineering-ready`. Tickets pending.

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

ROLE-product-manager: HANDOFF — create the Ariadne tickets for REQ-0016 and REQ-0017 (TTC), REQ-0017 blocked by REQ-0016, and write delivery/tickets.md.

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

**Target user.** One person who keeps their own task list with `ttc` on their
own machine: the requester. ttc has one user and no shared list
(`CAP-0001` Boundaries; INIT-0001 out of scope). Source: S1 below.

**Jobs and problems, with sources.**

| # | Job or problem | Source |
| --- | --- | --- |
| J1 | Change a task's due date to a date they choose, after the task was added ("A person can change a task's due date ... after the task was added"). | Request, verbatim (`sources/2026-10-31-requester-request.md`) |
| J2 | Remove a task's due date after the task was added ("or remove it"). | Request, verbatim (same file) |
| J3 | Do each in one short command ("in one short command, e.g. `ttc due <id> YYYY-MM-DD` and `ttc due <id> --clear`"). | Request, verbatim (same file) |
| P1 | `ttc postpone <id>` only moves a due date to one day after the later of the due date and today, and refuses a task with no due date. A date several days ahead takes one run per day; an earlier date cannot be reached at all. | `PD-0011` items 3, 5; README "Postponing a task"; checked on the CLI at head `1084f0a` (`ttc postpone 2` on a task with no due date: `ttc: task 2 has no due date`, exit 1) |
| P2 | `ttc copy <id> --due <d>` gives the date to a new task with a new id; the original keeps its date, and copying then deleting changes the task's id. | `PD-0013` items 1, 3, 13 and Consequences (R4); README "Copying a task" |
| P3 | No command removes a due date: `ttc copy --due` cannot give "no date" (`PD-0013` item 3), and `ttc due 1 2026-11-10` and `ttc due 1 --clear` fail with `ttc: unknown command: due (see ttc help)`, exit 1. | `PD-0003` Consequences ("No way to change a due date"); checked on the CLI at head `1084f0a` |
| P4 | `ttc note <id> ["<text>" \| --clear]` already sets or removes one optional value of a task: a value form, a `--clear` form, and `--clear` on a task with no note is a no-op that prints `Task <id> has no note` and exits 0. | README "Task notes"; `src/commands/note.js` at head `1084f0a` |

**Current-state capability mapping (S2).** `CAP-0001` — local task tracking
from the `ttc` command line. This initiative extends it. `CAP-0001` is still
`draft` and does not describe everything that shipped; the current-state
evidence is the code and README at head `1084f0a`:

- A task's due date is a `YYYY-MM-DD` string or empty (`null`) in
  `tasks.json` version 4 (README "Data file format"). It is given only by
  `ttc add --due`, which takes a real calendar date, allows a past date and
  nothing later than `9999-12-31`, else `ttc: invalid date: <d>` (`PD-0003`
  item 5; `PD-0011` item 6).
- What follows from the due date: the `due:<date>` and `!overdue` tokens of a
  `ttc list` line, `--overdue`, `--due-from`, `--due-to`, `--no-due`, the
  `ttc stats` overdue count and the due value in `ttc export` (`PD-0003`
  items 6, 8; `PD-0014`).
- Every changing command checks its arguments and id before the lock, then
  under the lock reads the list, finds the task (`ttc: no task with id <id>`),
  writes atomically, prints one line and exits 0; a refusal writes nothing; a
  failure after the save exits 1 and keeps the change (`PD-0003` items 2, 10,
  11; `PD-0004` items 2–4; `PD-0008`).
- `ttc help` prints 17 usage lines; `ttc postpone <id>` sits after
  `ttc unimportant <id>` and before `ttc rename <id> "<title>"`.

**Success signals (S3).**

1. A user gives an existing task, open or done, with or without a due date,
   any valid due date with one short command; `ttc list` then shows
   `due:<that date>` on its line.
2. A user removes a task's due date with one short command; `ttc list` then
   shows its line with no `due:` token, and `ttc list --no-due` includes it.
3. Only that task's due date changes: its title, status, tags, note,
   important mark and id, and every other task, stay as they are.
4. Everything else is unchanged: every command typed as it can be typed
   today gives the same output, apart from the new usage in `ttc help`, and
   data files written by older ttc still work.

**Known non-goals.** Relative dates ("tomorrow", "+3d") (A11); changing
several tasks in one command (A10); any change to `ttc postpone` or
`ttc copy` (A12); due times or time zones beyond today's rule; reminders;
sorting by due date.

Sources: S1 = the request file above; INIT-0001 `initiative.md` out of scope;
S2/S3 = the code and README at head `1084f0a`.

## Options

| Option | User-visible difference | Feasibility verdict | Cost / risk | Trade-off |
| --- | --- | --- | --- | --- |
| A — `ttc due <id> YYYY-MM-DD` and `ttc due <id> --clear` | Exactly the request's two commands. `ttc due <id>` with nothing else is an argument error | `feasible-with-constraints`, band `contained` (`technical/assessment.md`, round 1) | Constraints C1–C7, C9, C10; R1–R4. No stored-format change | Two forms, nothing else to learn; a look at one task's date stays `ttc list` |
| B — `ttc due <id> [YYYY-MM-DD \| --clear]`, like `ttc note` | The same two forms as A, plus `ttc due <id>` alone prints the task's due date and changes nothing | `feasible-with-constraints`, band `contained` (`technical/assessment.md`, round 1) | Constraints C1–C8, C10; R1–R5 (R5: the show form must stay read-only). No stored-format change | A third form the request did not ask for (A7); it repeats what every `ttc list` line already shows (`PD-0003` item 8) |

_Recommended option and why:_ **A.** The request names the two commands
itself: "e.g. `ttc due <id> YYYY-MM-DD` and `ttc due <id> --clear`". A is
exactly that, and serves O1–O3 in full. B adds a show form the request never
asked for (A7); unlike a note, a due date is already on every `ttc list`
line, so the form adds nothing a user lacks. Choosing the option that keeps
the stated outcome intact without an unasked addition is the PM's call
(§4.1; escalation-policy §3 route 2), so no requester question is raised.
B is a superset of A with the same meaning where they overlap, so a later
move to B forecloses nothing (assessment, "Option choice"). The architect's
N1–N6 are taken as recommended: setting the date a task already has is a
normal success that writes, like a same-title `rename` (N1; the R4 side
effect on older files is stated in the `PD-`); `--clear` on a task with no
due date prints `Task <id> has no due date`, exit 0, writes nothing (N2);
one usage line after `ttc postpone <id>`, `ttc due <id> YYYY-MM-DD` from
`REQ-0016`, extended to `ttc due <id> YYYY-MM-DD | --clear` by `REQ-0017`
(N3); `note`'s check order with the date check in place of the text check
(N4); the two-story split kept, with `REQ-0016` asserting nothing about
`--clear` and no fixed bare-id text (N5, R3); no stored-format change (N6).

_Chosen (SOLUTION_CONVERGENCE, 2026-10-31):_ **A**, `PD-0016`. B rejected for the
reasons in `PD-0016` "Options considered". N1–N6 settled as the architect
recommended (`PD-0016` items 1–16). No option is left under consideration.

## Consultation log

| Date | Delegate role | Question | Answer / verdict | Recorded as |
| --- | --- | --- | --- | --- |
| 2026-10-31 | ROLE-planner (PRODUCT-DISCOVERY) | Feasibility verdict, constraints, risks and band for options A and B, plus recommendations on N1–N6 (one dispatch: capability scan, impact, assessment; §9d.1) | A `feasible-with-constraints`, `contained`; B `feasible-with-constraints`, `contained`; constraints C1–C10 (C8 B only, C9 A only); risks R1–R5 (R5 B only); assumptions P1–P6 all narrowing, none blocking or costly; no stored-format change (C3, N6). N1 normal success line that writes (R4: an older file becomes version 4); N2 `Task <id> has no due date`, exit 0, no write; N3 one usage line after `ttc postpone <id>`, extended by `REQ-0017`; N4 `note`'s check order, date check last before the lock; N5 split sound, `REQ-0016` must not assert the `--clear` refusal and must fix no bare-id text; N6 no format change. Registry note: `CAP-0001` out of date (as in INIT-0002..0006), left for initiative close | `technical/capability-scan.md`, `technical/impact.md`, `technical/assessment.md` (round 1); this row; C1–C7, C9, C10, N1–N6 go to the convergence `PD-`. Vendor claude, model opus |
| 2026-10-31 | ROLE-planner (PRODUCT-DISCOVERY) | Story-set technical coherence, full pass, on the draft set `REQ-0016` rev 3 and `REQ-0017` rev 3 against `PD-0016` and `technical/assessment.md` round 1; declared round 1 of 2, terminal unless it reports a blocking defect (§9d.3, §9a.1) | `coherent`; one non-blocking defect D1 (`REQ-0016` check order read alone puts the no-date error before the id check, against `PD-0016` item 6; no AC fixes `ttc due abc`); no `Q-`. Independence, sequencing, assumed capability and verdict drift all pass; every AC text and check order resting on today's behaviour checked against `node bin/ttc.js` at head `9d12abe`. Round 1 terminal: no round 2. D1 `fixed` inline by the PM (`REQ-0016` rev 4, Behavior "Check order" states the no-date check comes after the id), no re-review (§9d.3) | `technical/coherence.md` (round 1); this row. Vendor claude, model opus |

Dispatch log: `phase | delegate | vendor | model | tokens-scale | ledger run | artifact produced`

- `SOLUTION_EXPLORATION | ROLE-planner | claude | opus | L (subagent reported 118,819 tokens, 27 tool uses, 297 s) | a280b3f2c9fb135f8 | technical/capability-scan.md, impact.md, assessment.md`
- `DECOMPOSITION | ROLE-planner | claude | opus | L (subagent reported 102,797 tokens, 21 tool uses, 232 s) | a035d5bba65351af1 | technical/coherence.md (round 1)`
- `READINESS | ROLE-product-readiness-reviewer | claude | sonnet | M (subagent reported 86,335 tokens, 17 tool uses, 86 s) | adff31148a2cb4421 | Readiness log row 1 (READY)`

## Escalation log

| Date | Question | `Q-` | Asked of | Answer | Recorded as |
| --- | --- | --- | --- | --- | --- |

## Stories

| `REQ-` | Title | Status | `CAP-` | `DES-` | Sequencing note |
| --- | --- | --- | --- | --- | --- |
| REQ-0016 | A task's due date is set to a chosen date in one short command | accepted (rev 4) | CAP-0001 | none — no user-facing visual surface | none — on the frontier |
| REQ-0017 | A task's due date is removed in one short command | accepted (rev 3) | CAP-0001 | none — no user-facing visual surface | after REQ-0016 (adds the removing form to the command REQ-0016 introduces) |

## Coverage validation

`SKILL-validate-requirement-coverage`, full mode, run by ROLE-product-manager on
2026-10-31 against the set on disk (iteration 1: zero defects). Story-set digest:
`(REQ-0016, 4, 2026-10-31), (REQ-0017, 3, 2026-10-31)`; `INIT-0007` revision 3.

Traceability map: O1 (`initiative.md` Outcome) -> `REQ-0016`; O2 -> `REQ-0017`;
O3 -> both (each `outcome_element` names it) -> `CAP-0001` (resolves) -> no `DES-`
(no visual surface, `PD-0016` item 14) -> `PD-0003`, `PD-0004`, `PD-0008`,
`PD-0010`, `PD-0011`, `PD-0013`, `PD-0014`, `PD-0016` (all `accepted`, all
indexed) -> no `Q-` open -> no tickets yet.

| Rule | Result | Evidence |
| --- | --- | --- |
| R1 | pass | O1 -> accepted `REQ-0016` (AC-1 open task with a due date, AC-2 a task with none, AC-3 a done task and a past date, AC-4 the same date); O2 -> accepted `REQ-0017` (AC-1 open task, AC-2 done task, AC-3 nothing to remove); O3 -> both (`REQ-0016` AC-3, AC-5 and `REQ-0017` AC-1, AC-2, AC-5 only the due date changes and what follows from it; AC-4 older files; AC-9 / AC-8 help changes only by the `ttc due` line) |
| R2 | pass | `REQ-0016`, `REQ-0017`: id = filename = index row (`requirements/index.md`, `accepted`); counter `requirement: 17`; no renumbering; edits are pre-freeze plain edits |
| R3 | pass | each `outcome_element` names its O-elements; `CAP-0001` resolves in `capabilities/index.md` |
| R4 | pass | No user-facing visual surface (`PD-0016` item 14); `design_refs: []` on both; no `DES-` on the initiative |
| R5 | pass | `REQ-0016` 11 and `REQ-0017` 10 acceptance entries, each a command trigger and exact output, exit code or file state; the README and `npm test`/CI entries name observable content |
| R6 | pass | `REQ-0016` `depends_on: [none]`; `REQ-0017` `depends_on: [REQ-0016]`, resolves |
| R7 | pass | Stories table: `REQ-0016` `none — on the frontier`, `REQ-0017` `after REQ-0016`; graph `REQ-0016 -> REQ-0017`, acyclic |
| R8 | pass | No `blocker` `Q-`; Ambiguity log A1–A13 all `pm-resolvable`; no contradiction found between either story and an accepted `PD-` or `constraints.md` (flag-only) |
| R9 | pass | `PD-0016` cites `feasible-with-constraints`; coherence verdict `coherent` recorded in the Consultation log, round 1 terminal (no blocking defect); its one non-blocking defect D1 dispositioned `fixed` |
| R10 | pass | Every `decisions:` entry is `accepted`; `REQ-0017` depends on accepted `REQ-0016`; no open `Q-` |
| R11 | pass | Out of scope has 6 items; both stories' Non-goals mirror them; no AC exercises excluded behaviour (`REQ-0016` AC-6 checks `tomorrow` is refused; no AC changes `ttc add`, `ttc postpone` or `ttc copy`, sorts by due date, or changes several tasks) |
| R12 | pass | `INIT-0007`, `REQ-0016`, `REQ-0017`, `CAP-0001`, `PD-0003/0004/0008/0010/0011/0013/0014/0016` resolve through their indexes; file, `id`, frontmatter and index rows agree |

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
| 2026-10-31 | 1 | READY | none | ROLE-product-readiness-reviewer (claude, sonnet-5-5) | `(REQ-0016, 4, 2026-10-31), (REQ-0017, 3, 2026-10-31)`; `INIT-0007` revision 3 (matches the Coverage validation digest and the convergence row) | 0 findings. Judged band: R13 pass (every AC states a command, exact stdout/stderr, exit code and file state; dates used are fixed 2000-01-02 or 2099+, so no clock dependence); R14 pass (one outcome per story, set vs remove; both Non-goals mirror the initiative's out-of-scope); R15 pass (no `DES-`, `design_refs: []`, no visual surface per `PD-0016` item 14); R16 pass (no design, nothing implicit); R17 pass (success lines, no-op line, combination refusal, usage line, check order, leading-zero ids, same-date write, older-file behaviour all fixed; the only unfixed text is the `ttc due <id>` argument-error wording, which `PD-0003` item 2 assigns to engineering and both stories bound to "one line starting `ttc: `", exit 1, no write); R18 pass (`PD-0016`, `technical/assessment.md` C1-C10, the raw request and the cited code paths resolve). Flag-only: R8 no contradiction with an accepted `PD-` or `constraints.md` rows 1-9; R9 `feasible-with-constraints` and `coherent` (round 1, terminal) still describe the set: the verdict's date precedes `REQ-0016` rev 4 but the only change is the D1 clarifying clause, no substantive mismatch. B10: not applicable (no `DES-`). R1-R12 not re-run (validator report, matching digest, is the precondition). | none |

## Readiness findings

Written by `ROLE-product-readiness-reviewer` only, one block per round producing
at least one finding. Finding ids are `RF-<INIT-nnnn>-<round>-<n>`, scoped to
this file: they bump no counter and appear in no index. A `NOT READY` verdict
with no findings rows is invalid output.

| Finding | Criterion | Artifact | What is wrong | Route phase | Route role |
| --- | --- | --- | --- | --- | --- |

## Handoff packet

Assembled 2026-10-31 at ENGINEERING_READY by `ROLE-product-manager` against the `READY` verdict of 2026-10-31 (Readiness log, round 1; digest `(REQ-0016, 4, 2026-10-31), (REQ-0017, 3, 2026-10-31)`, INIT-0007 rev 3, unchanged on disk). Drafted inline under the size rule (§9d.2): a transcription of existing records.

- **Repository:** `rortegalizardo/task-tracker-cli` (`~/Desktop/Projects/task-tracker-cli`), default branch `main` (`project/constraints.md` row 9).
- **Outcome:** A person using `ttc` can give an existing task, open or done, with or without a due date, a due date they choose, with one short command; remove an existing task's due date with one short command; and keep everything else as it is today: only that task's due date changes, every command typed as it can be typed today gives the same output apart from the new usage that `ttc help` prints, and data files written by older ttc still work (`initiative.md` `## Outcome`, O1–O3).
- **Stories, in suggested sequence:**
  1. `REQ-0016` — set a due date (`ttc due <id> YYYY-MM-DD`); `depends_on: [none]`, on the frontier.
  2. `REQ-0017` — remove a due date (`ttc due <id> --clear`); `depends_on: [REQ-0016]`: it adds the removing form to the command `REQ-0016` introduces.
- **Design references and export paths:** none — no user-facing visual surface (`PD-0016` item 14; `project/constraints.md` row 8).
- **Decisions in force:** `PD-0003`, `PD-0004`, `PD-0008`, `PD-0010`, `PD-0011`, `PD-0013`, `PD-0014`, `PD-0016` (chosen option A: `ttc due <id> YYYY-MM-DD` sets the due date, `ttc due <id> --clear` removes it; fixed success, no-op and refusal texts, check order, usage line and README section).
- **Binding technical constraints** (all from `technical/assessment.md`, round 1; carried in each story's `## Technical constraints`; C8 does not apply, option B only; C2 binds `REQ-0016`):
  - C1 — every changing-command rule applies unchanged: checks before the lock, read and find under it, one atomic write, a refusal writes nothing and creates no folder, the busy failure, a failure after the save keeps the change; open and done tasks.
  - C2 — the typed date follows the one existing `ttc add --due` rule; no second date rule; no clock read.
  - C3 — only that task's `due` changes; a removed due date is stored as `null`; no stored-format change, version stays 4; an older file is rewritten as version 4 only by a change.
  - C4 — one usage line, after `ttc postpone <id>`, asserted verbatim by the whole-usage tests and the oracle; not between the `tag` and `note` lines.
  - C5 — the test oracle (`test/support/ttc-model.js`) and the argument fuzzing (`fuzz-gen.js`, `fuzz-harness.js`) gain `due`, written from `PD-0016`, not from the new code; for `REQ-0016` no `--clear` is drawn.
  - C6 — the check order of `PD-0016` item 6 is test-asserted wherever a message is fixed.
  - C7 — the perf guard (10,000 tasks, median < 500 ms) must still pass.
  - C9 — `ttc due <id>` alone is an argument error, checked after the id, before the lock; its wording is engineering's.
  - C10 — the `due:` and `!overdue` tokens, the due filters, the `ttc stats` overdue count and the export due value follow the new stored value.
- **Explicitly out of scope** (copied from `initiative.md` `## Scope`, Out of scope):
  - Relative dates ("tomorrow", "+3d") or any date form other than `YYYY-MM-DD`.
  - Changing the due date of several tasks in one command.
  - Any change to `ttc add`, `ttc postpone` or `ttc copy`.
  - Due times; reminders or notifications.
  - Sorting tasks by due date.
  - Any change to the output of a command typed as it can be typed today, other than the new usage in `ttc help`.
  - Also excluded by `PD-0016` item 13: a form that shows a task's due date (option B).
- **Open questions (non-blocking):** none. The verdict carries no conditions or known issues.
- **Note for delivery:** `REQ-0017` changes the `ttc due` usage line that `REQ-0016` AC-9 asserts; "the `REQ-0016` tests still pass" in `REQ-0017` AC-10 means with the whole-usage assertions carrying the new line (`REQ-0017` AC-8, `PD-0016` items 10, 12).
- **Delivery manifest:** `product/initiatives/INIT-0007-change-or-clear-due-date/delivery/manifest.md`
- **Tickets** (Ariadne project TTC, `PD-0015`; mapping authority `delivery/tickets.md`): written at HANDOFF.

## Handoff log

| Date | Receiving role | Packet digest | Note |
| --- | --- | --- | --- |

## Phase log

Dates are UTC timestamps.

| Date | From | To | Role | Trigger | Outcome | `context_digest` |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-11-01T03:24:00Z | — | BOOTSTRAP | ROLE-product-manager | Raw request relayed by the driving session | Packet: `readiness: ready`, `scope.initiative: null`, profile S, no areas, no open `Q-` (`Q-0001` answered). `neighbouring` read in full: `CAP-0001` (draft) has no command that sets or removes an existing task's due date; no `PD-` (accepted or rejected) decides against one; `PD-0003` items 2, 5, 6, 9–12, `PD-0004`, `PD-0008`, `PD-0010`, `PD-0011` (postpone), `PD-0013` (copy `--due`) and `PD-0014` (`--no-due`) bind or neighbour it; `PD-0003` Consequences "No way to change a due date" and the out-of-scope lines of INIT-0001/0003/0005/0006 are scope boundaries, not a rejected decision. INIT-0001..INIT-0006 are not touched. Advisory, carried: `CAP-0001` is still draft and predates shipped behaviour (code and README at head `1084f0a` are the current-state evidence); `delivery/tickets.md` mirror `synced_on` 2026-10-21 is stale; the working tree has an uncommitted edit to `INIT-0005/delivery/tickets.md` owned by another session, left alone. Tracker bound to Ariadne project TTC (`PD-0015`). Hooks: HOOK-canonical-root pass, HOOK-hydrate pass | `fb6dac4630751802`, head `1084f0a` |
| 2026-11-01T03:28:21Z | BOOTSTRAP | INTAKE | ROLE-product-manager | Packet emitted, scope resolved to none | Triage verdict `new-initiative`: not `satisfied-by CAP-0001` (no command sets or removes an existing task's due date; `ttc due` is an unknown command at head `1084f0a`); no `PD-` settles it (A13); no constraint forbids it; no initiative covers it (INIT-0001 base commands, INIT-0002 important mark, INIT-0003 postpone, INIT-0004 clean, INIT-0005 copy, INIT-0006 `--no-due`; each lists changing or clearing a due date out of scope), so not a duplicate; one outcome named. Raw request committed verbatim. `INIT-0007` allocated (counter 6 -> 7, checked against `origin/main` `1084f0a`). Size: small (≤3 stories expected; the driving session asks for one or two). Hooks: HOOK-initiative-resolved pass, HOOK-phase-entry pass | `fb6dac4630751802`, head `1084f0a` |
| 2026-11-01T03:33:00Z | INTAKE | DISCOVERY | ROLE-product-manager | INTAKE exit criteria met: one initiative, one problem, one named requester, ambiguity rows A1–A13 all classified (`pm-resolvable`) | Entry precondition (`lifecycle-hooks.md` §3.4.1 DISCOVERY) holds: `initiative.md` at `status: draft`; state at INTAKE with requester, problem statement and a classified ambiguity log. Discovery written (J1–J3, P1–P4, S2 `CAP-0001`, S3 signals 1–4, non-goals). No delegate consulted (optional, read-only; the code and README answer the current state). No `Q-` raised. Hooks: HOOK-phase-entry pass | `fb6dac4630751802`, head `aceeb99` |
| 2026-11-01T03:34:00Z | DISCOVERY | PRODUCT_DEFINITION | ROLE-product-manager | DISCOVERY exit criteria met: problem, user, current state and success signals stated with sources; no open escalation-class ambiguity | Entry precondition (`lifecycle-hooks.md` §3.4.1 PRODUCT_DEFINITION) holds: Discovery has the target user, jobs J1–J3 and problems P1–P4 each with a source (S1), mapping `CAP-0001` (S2), success signals 1–4 (S3) and known non-goals. Hooks: HOOK-phase-entry pass | `fb6dac4630751802`, head `429444c` |
| 2026-11-01T03:40:00Z | PRODUCT_DEFINITION | SOLUTION_EXPLORATION | ROLE-product-manager | PRODUCT_DEFINITION exit criteria met: outcome O1–O3, out of scope (6 items), success measures 1–6, draft `REQ-0016` and `REQ-0017` covering O1–O3, Product Definition Contract citing the raw request | Entry precondition (`lifecycle-hooks.md` §3.4.1 SOLUTION_EXPLORATION) holds: F1 `initiative.md` rev 2 has an outcome and a non-empty out-of-scope section; two `status: draft` `REQ-`; F2 draft-mode coverage (inline, deterministic): J1 -> `REQ-0016` Requirement ("give an existing task a due date they type"), J2 -> `REQ-0017` Requirement ("remove an existing task's due date"), J3 -> both ("one short command"); no `R1` defect. Story split (§4.1): one testable outcome each; `REQ-0017` `depends_on: [REQ-0016]` (it adds the removing form to the command `REQ-0016` introduces). `requirement` counter 15 -> 17, checked against `origin/main`. No scope `PD-` needed yet: A1, A4–A8 and A13 are recorded in the chosen-option `PD-`. Hooks: HOOK-phase-entry pass | `fb6dac4630751802`, head `5e0468d` |
| 2026-11-01T03:52:00Z | SOLUTION_EXPLORATION | SOLUTION_CONVERGENCE | ROLE-product-manager | SOLUTION_EXPLORATION exit criteria met: options A and B recorded, each with a feasibility verdict (`feasible-with-constraints`) and a user-visible trade-off; PM recommends A with reasons | Entry precondition (`lifecycle-hooks.md` §3.4.1 SOLUTION_CONVERGENCE) holds: X1 two distinguishable options; X2 each verdict in the closed set (`technical/assessment.md` round 1); one Consultation log row for the one delegate response. No design dispatch: no visual surface (`project/constraints.md` row 8, `PD-0001` item 3; to be recorded in the convergence `PD-`, §9d.5). Hooks: HOOK-phase-entry pass | `fb6dac4630751802`, head `d439134` |
| 2026-11-01T04:05:00Z | SOLUTION_CONVERGENCE | DECOMPOSITION | ROLE-product-manager | SOLUTION_CONVERGENCE exit criteria met: one accepted `PD-0016` naming option A, B and five other shapes rejected with reasons, consequences accepted; indexed in the same commit; draft `REQ-0016`/`REQ-0017` rev 2 consistent with it; no option left under consideration; Solution Contract cites `PD-0016` and records no design concept (no visual surface, `PD-0016` item 14) | Entry precondition (`lifecycle-hooks.md` §3.4.1 DECOMPOSITION) holds: exactly one `status: accepted` chosen-option `PD-` citing a non-`infeasible` verdict (`feasible-with-constraints`, `technical/assessment.md` round 1). HOOK-decision-capture R1 (index row, same commit), R3 (rejected options non-empty), D11 (decision counter 16 matches the highest id; `origin/main` at 15, no `PD-0016` there) pass. No escalation-class question: the option choice is settled by the request (escalation-policy §3 route 2, §4.1). Hooks: HOOK-phase-entry pass | `fb6dac4630751802`, head `c7e34b5` |
| 2026-11-01T04:30:00Z | DECOMPOSITION | READINESS | ROLE-product-manager | DECOMPOSITION exit criteria met: O1 -> accepted `REQ-0016` rev 4, O2 -> accepted `REQ-0017` rev 3, O3 -> both; each meets the nine points of §10.3 (accepted, one testable outcome, 11 and 10 pass/fail ACs, `CAP-0001`, no visual surface so no `DES-`, independently verifiable with `REQ-0017` `depends_on: [REQ-0016]` stated, no `blocker` `Q-`, no contradiction, indexed in the same commit); coherence round 1 (terminal) left no open blocking defect; convergence declared (`converged: true`) | Entry precondition (`lifecycle-hooks.md` §3.4.1 READINESS) holds: `converged: true`; `HOOK-traceability` zero defects (Coverage validation, iteration 1); `technical/coherence.md` verdict `coherent`, round 1 terminal under §9d.3, D1 non-blocking and `fixed`; no user-facing story, so no `DES-` needed. AC texts for today's behaviour checked by the PM and by the architect on `node bin/ttc.js` at head `9d12abe`. Review budget this session: 1 of 6. Hooks: HOOK-phase-entry pass | `fb6dac4630751802` (carried), head `3e90bc7` |
| 2026-11-01T04:40:00Z | READINESS | ENGINEERING_READY | ROLE-product-manager | READINESS exit criteria met: `READY` recorded by ROLE-product-readiness-reviewer, round 1 of 2 declared terminal unless blocking; no conditions or known issues to record as `Q-`/`PD-` | Coverage validation zero defects ran before the dispatch (not a review dispatch; set unchanged since). Review budget used this session: 2 of 6 (coherence 1, readiness 1). `readiness_verdict: READY` set by the PM from the reviewer's Readiness log row (the dispatch limited its writes to the log row). Entry precondition (`lifecycle-hooks.md` §3.4.1 ENGINEERING_READY) holds: verdict `READY`, not `void`, digest `(REQ-0016, 4, 2026-10-31), (REQ-0017, 3, 2026-10-31)`; INIT-0007 rev 3 matches disk. Reviewer's non-finding note (`REQ-0017` AC-10 "the `REQ-0016` tests still pass" beside the usage line `REQ-0017` changes) is covered by `PD-0016` item 12 and `REQ-0017` AC-8/AC-10; carried as a handoff note, no story edit. Hooks: HOOK-readiness pass, HOOK-phase-entry pass | `fb6dac4630751802` (carried), head `6c76dbc` |
| 2026-11-01T04:50:00Z | ENGINEERING_READY | HANDOFF | ROLE-product-manager | ENGINEERING_READY exit criteria met: handoff packet self-contained (outcome, stories in sequence, no `DES-`, decisions, C1–C7, C9, C10, out of scope, no open questions, manifest path); `delivery/manifest.md` at `band_owner: product`, `issued_from_verdict: READY@2026-10-31`, digest `REQ-0016@4/2026-10-31; REQ-0017@3/2026-10-31; INIT-0007@3`, M1–M8 hold (graph `REQ-0016 -> REQ-0017` acyclic, waves 0 and 1, every identifier resolves, no plan or estimate); INIT-0007 `status: active` (index too); `REQ-0016`, `REQ-0017` `readiness: engineering-ready` | Entry precondition (`lifecycle-hooks.md` §3.4.1 HANDOFF) holds: H7 every packet bullet populated or explicit empty form; H12 manifest issued against the same verdict and digest. No story changed since the verdict (readiness field only, no revision change). Hooks: HOOK-phase-entry pass | `fb6dac4630751802` (carried), head `02ef7d2` |

> Every product-side session updates this file before ending — **including
> sessions that failed**, which record the failure in `next_action` and do not
> advance `phase`.
