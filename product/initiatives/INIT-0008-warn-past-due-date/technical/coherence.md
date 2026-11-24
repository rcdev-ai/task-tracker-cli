Verdict: coherent
Initiative: INIT-0008
Story set reviewed: REQ-0025 (rev 3, draft, `depends_on: [none]`)
Authorising decision: PD-0018
Assessment round relied on: 1
Reviewed: 2026-11-24

Mode: PRODUCT-DISCOVERY. Check: SKILL-story-set-technical-coherence, full pass,
round 1 of 2.

Evidence: `assessment.md`, `capability-scan.md`, `impact.md` (this folder,
round 1, assessed at `b3945a4`); `PD-0018`; `initiative.md` rev 3;
`product/solution-contract.md`; code at head `e24972c`. Between `b3945a4` and
`e24972c`, `bin/`, `src/cli.js`, `src/errors.js`, `src/rules.js` and
`src/commands/` `add`, `copy`, `due`, `import`, `export` are unchanged. Two
code changes landed: PR #62 (`ttc list --count`, README, help-line tests) and
PR #63 (`isOverdue` in `src/overdue.js` from `<` to `<=`). The commits after
`b290dc7` touch only `product/`. The CLI was run with `node bin/ttc.js` in a
scratch `TTC_HOME` outside the repository. C3, C4 and C9 were measured again
with a throwaway naive option-A prototype on a scratch copy of `e24972c`.
The prototype was never in the repository.

## Per-story checks

| REQ- id | Independently verifiable? | Sequencing note consistent? | Assumed capability | Result |
| --- | --- | --- | --- | --- |
| REQ-0025 | Yes for AC-1 to AC-9, and for AC-10's test content. Every AC starts from an empty `$TTC_HOME`, a literal file or an earlier AC of the same story, and uses only commands that exist today. AC-10's "all pass" / CI clause also needs `main` to be green again. That is an external condition, not another story, and the Sequencing note states it (D1). | Yes. "On the frontier" matches `impact.md`: one system. The clock and `TZ` dependency is upstream and exists. Nothing downstream has to change first. The red-CI note is accurate (table below). It is stated, so it is not a hidden prerequisite. | "A non-failure line on stderr" is `absent` in the scan, and this story creates it (AC-1, AC-2, AC-4). Holding the warning until the stdout outcome is known (C3) works on the shared output handling, which exists. This story extends it, and AC-6 verifies it. README "Adding a task" is `partial`, and AC-9 creates it. Local today, the pinned-`TZ` midnight guard, the stdout-closed test pattern and stderr-unwritable → exit 1 all `exist`. | Pass |

### Constraints restated in REQ-0025, at `e24972c`

| # | Holds? | Evidence at `e24972c` |
| --- | --- | --- |
| C1 | Yes, as restated | `localToday()` is unchanged: one local-date rule. `isOverdue` now uses `<=`, so at this head a task due today shows `!overdue` (measured: `TZ=Pacific/Kiritimati`, `ttc add … --due <today>`, then `ttc list` → `… !overdue`). The restated C1 already ties the boundary to `PD-0018` item 3 / `PD-0003` item 6 and AC-4, not to `isOverdue`'s current return value. AC-4 asserts nothing about `ttc list`, so it does not depend on the regression. While PR #63 stays in, `PD-0018` item 3's "exactly when the task would show `!overdue`" is untrue for a date equal to today. That comes from PR #63, not from the story. |
| C3 | Yes | `bin/ttc.js` and `src/cli.js` are unchanged. Measured again on the naive prototype with stdout closed and a past date: stderr is `ttc: warning: …` then `ttc: cannot write output: EPIPE`, exit 1, task saved. That is two lines, so it fails AC-6 as intended. stdout is still buffered until the command returns, and stderr is still direct. |
| C4 | Yes | Measured again on the prototype with stderr closed and a past date: stdout `Added task 1`, exit 1, no signal, task saved. With a `2099-12-31` date: exit 0. This matches AC-7. |
| C9 | Yes | Measured again: the naive prototype fails 23 of 519 tests. Without the change, 6 of them already fail on `main` (below). The other 17 are in 7 files, with the same spread as round 1: `add` 3, `copy` 2, `due-clear` 4, `export` 2, `important` 3, `list` 2, `postpone` 1. PR #62 changed none of these tests' stderr expectations. The midnight guard still exists (`test/stats.test.js` 53–55, `test/postpone.test.js` 66–68). `Pacific/Pago_Pago` / `Pacific/Kiritimati` are already used in `overdue.test.js` and `stats.test.js`. |
| C10 | Yes | `2026-10-01` is still in `test/add.test.js` lines 88, 96 (now past). Lines 193, 195 use it only in failure cases, which print no warning. |
| C2, C5, C8 (not asked, checked anyway) | Yes | `add.js` still finishes every check and the save before any output. No other command writes to stderr on success (`list --count` writes stdout only). `copy`, `due` and `import` are unchanged. |

### AC texts checked on the CLI at `e24972c`

| AC | What it relies on today | Measured | Match? |
| --- | --- | --- | --- |
| AC-1 | `Added task 1`; stored `version` 4, `nextId` 2, the 7-key task; `ttc list` line | Exactly as written (the warning is not there yet) | Yes |
| AC-2 | Options before the title; tags, note, important stored | `{"id":2,"title":"Fix bike","status":"open","due":"1999-12-31","tags":["home"],"note":"chain","important":true}`, task 1 unchanged | Yes |
| AC-3, AC-4 | `Added task <n>`, empty stderr, exit 0 | As written in both zones | Yes |
| AC-5 | The four error lines and their order of checks; `not json` → `ttc: cannot read …` | `ttc: invalid tag: a b`, `ttc: title must be one non-empty line`, `ttc: option given twice: --due`, `ttc: invalid date: 2000-02-30`, `ttc: cannot read <path>: not valid JSON`. Each exits 1 with empty stdout, and the file is byte-identical. | Yes |
| AC-6 | Stdout closed → one `ttc: ` failure line, exit 1, no signal, task saved | `ttc: cannot write output: EPIPE`, exit 1, no signal; `ttc list` → `#1 [ ] Pay rent due:2000-01-02 !overdue` | Yes |
| AC-7 | Stderr closed: task saved; with a future date, exit 0 | Saved; the future date gives `Added task 1`, exit 0. The past-date exit 1 is the new behaviour (C4). | Yes |
| AC-8 | `Copied task 1 as task 2`, `Copied task 1 as task 3`, `Set due date of task 1 to 1999-01-01`, `Imported 1 tasks from <dir>/x.json` | Exactly as written, empty stderr, exit 0 | Yes |
| AC-9 | No "Adding a task" section yet; "Exit codes" and "Changing a due date" exist | Still true. PR #62 changed only "Testing" and "Listing and filtering tasks". | Yes |

### Sequencing note on the red CI

| Statement in REQ-0025 | At `e24972c` | Accurate? |
| --- | --- | --- |
| PR #63 changed `isOverdue` from `<` to `<=` | Yes (`6032fdf`, merged in `b290dc7`) | Yes |
| 6 existing overdue tests fail | `npm test`: 519 tests, 513 pass, 6 fail. 4 are in `overdue.test.js` and 2 in `stats.test.js`, and all 6 test the overdue rule. | Yes |
| The PR body says it is deliberate, for a separate trial | The PR body says it is a deliberate regression for a trial, merged red. PR #63's `test` check: FAILURE. | Yes |
| The CI `test` check is red on `main` at `b290dc7` | CI runs on `pull_request` only, so `main` itself has no check run. Any PR based on `b290dc7` or `e24972c` (same code) inherits the 6 failures. | Yes in effect. The wording is loose (D1). |
| AC-10's CI criterion can pass only once `main` is green again | True. AC-10's `npm test` "all pass" clause has the same precondition. | Accurate, but covers only part of AC-10 (D1) |
| This story does not change the overdue rule | Consistent with `PD-0018` items 2 and 10 and the Non-goals | Yes |

This is a stated external condition. It is not a hidden prerequisite, and no
story in this set can or should remove it.

### Verdict drift

None. The set is option A exactly: stderr warning, stdout unchanged,
`multi-component` because of C3 (AC-6) and C4 (AC-7). Constraints C6 and C7
(option B) are excluded. PRs #62 and #63 add no work to this story and change
no constraint it relies on.

## Defects

| # | REQ- id | Check failed | Blocking? | Disposition | Resolvable in decomposition? | Note |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | REQ-0025 | Independence (rule 2): precision of the stated sequencing note | non-blocking | open | Yes | The note names only AC-10's CI criterion as waiting for a green `main`. AC-10's local `npm test` "all pass" clause waits for it too: 6 overdue tests fail on a branch from `e24972c` whatever this story does. "Red on `main`" means "red for any PR based on `main`", because CI runs only on pull requests. This changes nothing that gets built or shipped. The "does not change the overdue rule" sentence already stops anyone from fixing PR #63 inside this story. |

## Questions raised

| Q- id | What it blocks |
| --- | --- |
| none | — |
