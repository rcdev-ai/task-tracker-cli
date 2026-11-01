---
id: PD-0017
type: decision
title: Trim the inherited ttc test obligations (fuzz, reference model, perf gate, repeated whole-help checks, storage-format unit tests) together with the requirements that demanded them
status: accepted
revision: 1
owner_role: ROLE-product-manager
created: 2026-11-01
updated: 2026-11-01
decided_on: 2026-11-01
affects: [CAP-0001, INIT-0002, INIT-0003, INIT-0004, INIT-0005, INIT-0006, INIT-0007, REQ-0011, REQ-0012, REQ-0013, REQ-0014, REQ-0015, REQ-0016, REQ-0017]
supersedes:
superseded_by:
---

# PD-0017 — Trim the inherited ttc test obligations together with the requirements that demanded them

## Context

The requester (the owner) asked for no over-testing. TTC still grew to
7,352 lines of tests against 1,658 lines of source (333 `it`/`test` calls in
`test/**/*.js`). Parley room Factory M3, agreed handoff #64 (2026-11-01),
found why: two earlier obligations were treated as standing requester asks
and every new story carried them forward:

- the spec line "Every command has node:test tests"
  (`initiatives/INIT-0001-ttc-command-line-task-tracker/product/sources/2026-10-20-requester-spec.md:20`,
  `project/constraints.md` row 7);
- the "harden ttc" engineering ask (`docs/engineering-log.md`, entry
  2026-10-21; RCDEV-833 fuzz suites with 10,000 generated cases each and a
  reference model, RCDEV-834 perf gate).

So each story extended the reference model, the fuzz generators, the perf
gate and an identical whole-help check copied into 6 test files (for example
`REQ-0016` AC-11). The repeated help checks broke split PRs and made review
re-run the full suite on 4 branches (`TTC-2/review/review-002.md:86`).

The owner approved the room's cleanup list, and only that list. In this
session the owner also chose, after being told what the nightly bug finder
would lose, that M4's nightly bugfind catches regressions in the fixed CLI
tests only, and that 5 of the 6 whole-help copies go.

## Decision

1. **Constraint row 7 is amended.** "Every command has node:test tests; the
   CI `test` check must pass" means: every command's behaviour is covered by
   the repository's CLI tests, and the CI `test` check must pass. It is not
   a standing order for a new story to add tests per change, extend an
   earlier suite, or meet a coverage target. A new story adds a test only
   for behaviour the existing tests cannot check, or for a regression.
2. **The "harden ttc" generated tests and perf gate are withdrawn.** The
   two fuzz suites (`test/fuzz-args.test.js`, `test/fuzz-data.test.js`), the
   reference model and generators (`test/support/`), the perf gate
   (`test/perf/add-list.perf.js`, the `test:perf` script and its CI step)
   are removed. The behaviour they probed stays a product rule and stays
   covered by the CLI tests: one `ttc: ` line and exit 1 on bad input, never
   a stack trace, and an unchanged file after a failed operation. The CI
   syntax check from the same ask (RCDEV-832) stays.
3. **The whole `ttc help` output is specified once**, by `REQ-0024` AC-8,
   and checked by one test (`test/due-clear.test.js`). The whole-help ACs of
   the other stories are withdrawn. A later story that changes the help
   updates that one AC and test (through supersession), and adds no copy.
4. **The 4 storage-format unit tests rewritten by RCDEV-856**
   (`test/storage-format.test.js`: registry ends at 4, `migrateV3ToV4`,
   `parseList` of versions 1–4, `serializeList` writes 4) are removed. The
   CLI tests already check the same behaviour (`test/import.test.js`
   versions 1–3 stored as 4, `test/format-v3.test.js` next write is 4). The
   file's 4 older tests are outside the approved list and stay.
5. **Stories superseded**, each successor identical to its predecessor except
   that the clauses below are withdrawn. The shipped code already meets
   every successor; none needs a ticket or new delivery work.

   | Old | New | Withdrawn |
   | --- | --- | --- |
   | `REQ-0011` | `REQ-0018` | AC-15 (whole help); AC-17 range now AC-1 to AC-14; C6 (oracle, fuzz, format unit tests); C7 (perf) |
   | `REQ-0012` | `REQ-0019` | AC-12 (whole help); AC-14 range now AC-1 to AC-11; C7 oracle clause; C8 (perf) |
   | `REQ-0013` | `REQ-0020` | AC-10 (whole help); AC-12 range now AC-1 to AC-9; C4 (oracle, fuzz); C5 (perf) |
   | `REQ-0014` | `REQ-0021` | AC-13 (whole help); AC-15 oracle/fuzz clause, range now AC-1 to AC-12; C6 (oracle, fuzz, whole-usage copies); C7 (perf) |
   | `REQ-0015` | `REQ-0022` | AC-10 (whole help); AC-12 oracle/fuzz/perf clauses, range now AC-1 to AC-9; C4 file counts; C6 (oracle, fuzz); C7 (perf) |
   | `REQ-0016` | `REQ-0023` | AC-9 (whole help); AC-11 oracle/fuzz/whole-usage/perf clauses, range now AC-1 to AC-8; C4 whole-usage files; C5 (oracle, fuzz); C6 fuzz clause; C7 (perf) |
   | `REQ-0017` | `REQ-0024` | AC-10 oracle/fuzz/whole-usage/perf clauses; C4 whole-usage files; C5 (oracle, fuzz); C6 fuzz clause; C7 (perf). AC-8 (whole help) is kept as the one help check |

6. **Not changed.** `REQ-0001`–`REQ-0010`: their "`npm test` runs
   `node:test` tests covering every criterion above" ACs demand none of the
   removed suites, and the remaining CLI tests still meet them. The
   requester's spec file stays verbatim (it is a source, and this decision
   amends how it is read). No product behaviour and no source code changes.
7. **Bug finder.** M4's nightly bugfind (`factory bugfind`, which runs
   `npm run test:unit`) catches regressions in the fixed, named CLI tests
   only. It no longer runs random-input or damaged-file generation. The one
   recorded fingerprint, `bugfp-2af741ad4fa4` (RCDEV-869, all in
   `test/leftover-temp.test.js`), is unaffected.

## Rationale

The owner's direction was no over-testing. Core's testing policy already
says not to invent fuzz, generated-case or perf ACs the requester did not
ask for, and to add a check only for a real regression or missing
behaviour. Deleting the tests and leaving their ACs would bring them back
with the next story, so the tests and their ACs change together.

## Consequences

- 333 → 318 test calls and 7,352 → 5,233 test lines (`it`/`test` calls in
  `test/**/*.js`); `npm test` now equals `npm run test:unit`.
- Input combinations nobody wrote a case for are no longer probed, and
  performance at 10,000 tasks is no longer checked by CI. If either matters
  later, it is a new requester ask, not an inherited obligation.
- Superseded stories stay readable in `product/archive/requirements/`.

## Source

Parley room Factory M3, agreed handoff #64, approved by the owner;
the bugfind and help-check choices were made by the owner in the TTC
test-trim session, 2026-11-01.
