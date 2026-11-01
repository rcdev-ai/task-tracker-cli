Verdict: coherent
Initiative: INIT-0007
Story set reviewed: REQ-0016 (rev 3, draft), REQ-0017 (rev 3, draft, `depends_on: [REQ-0016]`)
Authorising decision: PD-0016
Assessment round relied on: 1
Reviewed: 2026-10-31

Mode: PRODUCT-DISCOVERY. Check: SKILL-story-set-technical-coherence, full pass,
round 1 of 2.

Evidence: `assessment.md`, `capability-scan.md`, `impact.md` (this folder,
round 1); `PD-0016`; code at head `9d12abe`. Nothing in `src/`, `test/`,
`bin/`, `README.md`, `package.json` or the CI config changed between the
assessed head `d439134` and `9d12abe`. The CLI was run with `node bin/ttc.js`
in a scratch `TTC_HOME` outside the repository. `ttc due` does not exist yet,
so each fixed text was checked on the command that already uses the same
part: `note`, `postpone`, `rename`, `copy --due`, `add --due`, `list`,
`stats` and `export`.

## Per-story checks

| REQ- id | Independently verifiable? | Sequencing note consistent? | Assumed capability | Result |
| --- | --- | --- | --- | --- |
| REQ-0016 | Yes. `depends_on: [none]`. Every AC starts from an empty or missing `$TTC_HOME`, a literal file, or an earlier AC of the same story, and uses only commands that exist today (`add`, `done`, `list`, `stats`, `export`, `help`). No AC uses `--clear`. | Yes. "On the frontier" matches `impact.md`: one system, and no upstream part changes. The date rule, parser, lock, storage and the parts that read the due date are used as they are. | "Setting an existing task's due date" is `absent` in the scan, and this story creates it. Everything else is `exists` and works as the ACs expect (table below). | Pass |
| REQ-0017 | Yes, given its stated dependency. AC-2 uses the set form, and the command must already exist. Both come from `REQ-0016`, which is named in `depends_on`. There is no hidden prerequisite. | Yes. It extends the command, usage line, oracle, fuzz cases and README section that `REQ-0016` adds (`PD-0016` item 12; assessment N5, R3). It goes in the same direction as `impact.md`. | "Removing a due date" is `absent` in the scan, and this story creates it. The empty value (`null`) is `exists` in every format version. The no-op and `--clear` forms work the way `ttc note` already does (`exists`). | Pass |

### What the fixed texts rely on, checked against today's code

| Story / AC | What it relies on | Today's evidence | Achievable? |
| --- | --- | --- | --- |
| 0016 AC-1, AC-2; 0017 AC-1 | Line format `#<id> [ ] <title> due:<d> +<tag>`. Default view is open tasks in id order. `--no-due` and `No tasks.` | On the AC-1 list, `ttc list` prints `#1 [ ] Pay rent due:… +bills` / `#2 [ ] Call mom +home`. `--no-due` prints only the undated open task, or `No tasks.` when there is none. Leading-zero ids are accepted (`ttc done 002` → `Completed task 2`). | Yes |
| 0016 AC-3; 0017 AC-1, AC-2 | A done task shows no `!overdue`. `--overdue`, `--due-from`, `stats` (exactly three lines) and the CSV columns `id,title,status,due,tags,note` | On a list with exactly the AC-3 end state, the output matched AC-3 line for line. `ttc stats` prints only `open:`, `done:` and `overdue:`. CSV rows for an undated task have an empty `due` field (`2,Call mom,open,,home,`). | Yes |
| 0016 AC-5; 0017 AC-5 | Two JSON exports of an unchanged list are identical, so the only difference is the due value. Token order is `due:` `!overdue` `!important` `+tag` | Two `ttc export <abs>/x.json` runs gave identical files (version, nextId, tasks; no timestamp). `ttc list` prints `#1 [ ] Pay rent due:2000-01-02 !overdue !important +home`. With no due date it prints `#1 [ ] Pay rent !important +home`. | Yes |
| 0016 AC-4; 0017 AC-3, AC-4 | v3 and v1 files are readable. A change rewrites them as version 4 with `note:null` / `important:false` added. A no-op leaves them byte-identical | On the exact AC-4 v3 file, `ttc rename 2 "Pay rent"` writes exactly the version 4 tasks AC-4 lists. On the exact v1 file, `ttc rename 1 "Pay rent"` writes `version` 4, `nextId` 2 and exactly the AC-4 task. On the v3 files, `ttc note 1 --clear` (no-op) and `ttc postpone 1` (refusal) leave them byte-identical. | Yes |
| 0016 AC-6 | Date refusal text `<d>` as typed, in the same cases. The id is checked before the date, and the date before the lookup | `ttc add --due` refuses `2026-02-30`, `2026-1-05`, `10000-01-01` and `tomorrow` with `ttc: invalid date: <d>`. `ttc copy abc --due 2026-02-30` → `invalid task id: abc`. `ttc copy 99 --due 2026-02-30` → `invalid date: 2026-02-30`. `ttc note 0` → `invalid task id: 0`. `ttc note 2099-11-10 x` → `invalid task id: 2099-11-10`. | Yes |
| 0016 AC-7; 0017 AC-6 | Parser texts, reported in the order typed: `missing argument: <id>`, `unexpected argument: <arg>`, `unknown option: <opt>`, `option given twice: --clear` | `ttc note` / `ttc note --clear` → `missing argument: <id>`. `ttc note abc x extra` → `unexpected argument: extra`. `ttc note --bogus abc` → `unknown option: --bogus`. `ttc note 1 x y --clear` → `unexpected argument: y`. `ttc note 1 --clear --clear` → `option given twice: --clear`. `ttc note 1 --clear --bogus` → `unknown option: --bogus`. Combination refusal before the read: `ttc note 1 x --clear` → `note text and --clear cannot be combined`, also on a `not json` file. | Yes |
| 0016 AC-8; 0017 AC-7 | `not json` → `ttc: cannot read <path>: <reason>`, but only after the checks that run before the lock. A missing `$TTC_HOME` → `no task with id 1`, and nothing is created | On a `not json` file: `ttc rename 1 x` / `ttc note 1 --clear` → `ttc: cannot read <path>: not valid JSON`. `ttc copy 1 --due 2026-02-30` → `invalid date`. The file stays byte-identical, and no lock or temp file is left. With a missing folder, `postpone`, `rename`, `note 1 --clear` and `note 1 hi` each print `ttc: no task with id 1`, exit 1, and the folder still does not exist. | Yes |
| 0016 AC-9; 0017 AC-8 | Today's 17 usage lines, with `ttc postpone <id>` directly before `ttc rename <id> "<title>"` | `ttc help` matches AC-9 / AC-8 line for line, apart from the one new line. The `tag`/`note` lines stay next to each other (C4). | Yes |
| 0016 AC-10; 0017 AC-9 | The README has a "Postponing a task" section to put the new one after | It exists (`## Postponing a task`, followed by `## Cleaning out done tasks`). | Yes |
| 0016 AC-11; 0017 AC-10 | Oracle and fuzz files exist. `npm test` runs the unit tests and then the perf guard. CI `test` runs both. Whole-usage files exist. A REQ-0016 fuzz run can avoid `--clear` on `due` | `package.json`: `test` = `test:unit && test:perf`. `ci.yml` job `test` runs both. The whole-usage files are `clean`, `copy`, `important` and `postpone` `.test.js`, plus the oracle `USAGE`. `fuzz-gen.js` borrows another command's tokens only for the `unknown` and `dash-help` labels. `UNKNOWN_OPTIONS` does not contain `--clear`. So the generator for `due` sees `--clear` only if it draws it itself (C5 holds). | Yes |

Verdict drift: none. The set is option A as assessed. The set form, the
`--clear` form and a bare id refused as an argument error (C9) are all here,
with no show form (C8 not bound, correctly). The same-date write (N1 / R4)
and the no-op (N2) are both branches the assessment rated `contained`. There
is no format change (C3) and nothing outside one system.

## Defects

| # | REQ- id | Check failed | Blocking? | Disposition | Resolvable in decomposition? | Note |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | REQ-0016 | Sequencing possibility (check order vs `PD-0016` item 6) | No | open | Yes | REQ-0016 "Arguments" calls `ttc due <id>` with no date "an argument error", and its "Check order" puts argument errors before the id. Read alone, `ttc due abc` reports the bare-id error. `PD-0016` item 6 checks "neither given" after the id, so `ttc due abc` → `ttc: invalid task id: abc`. Today's parser reports a missing positional only after the whole argv is read (`missing argument:`). So "argument error" here does not mean "after the id" unless the story says so. No AC in either story fixes `ttc due abc`. The wording is engineering's, and the fuzz harness checks only the `ttc: ` form. AC-11 already ties the oracle to `PD-0016`, so nothing different gets built or shipped. A clarifying clause would help: the no-date check sits after the id check (`PD-0016` item 6, C9). |

## Questions raised

| Q- id | What it blocks |
| --- | --- |
| none | — |
