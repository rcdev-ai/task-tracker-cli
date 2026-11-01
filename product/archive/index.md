# Archive index

Superseded and historical artifacts. **Everything under `product/archive/` is
non-authoritative by position**, whatever its frontmatter says. Agents may read
these for rationale and history, and must never cite one as current.

Identifiers are preserved and are still never reused. Files are immutable once
archived.

| ID | Title | Type | Superseded by | Archived on | Path |
| --- | --- | --- | --- | --- | --- |
| PD-0002 | Fix the user-visible behaviour rules the ttc spec leaves open | decision | PD-0003 | 2026-10-20 | [../decisions/PD-0002-ttc-behaviour-rules.md](../decisions/PD-0002-ttc-behaviour-rules.md) |
| REQ-0011 | Important tasks are marked from the ttc command line and listed first | requirement | REQ-0018 | 2026-11-01 | [requirements/REQ-0011-mark-important-list-first.md](requirements/REQ-0011-mark-important-list-first.md) |
| REQ-0012 | A task is postponed from the ttc command line in one short command | requirement | REQ-0019 | 2026-11-01 | [requirements/REQ-0012-postpone-task.md](requirements/REQ-0012-postpone-task.md) |
| REQ-0013 | Finished tasks are cleaned out of the list in one short command | requirement | REQ-0020 | 2026-11-01 | [requirements/REQ-0013-clean-done-tasks.md](requirements/REQ-0013-clean-done-tasks.md) |
| REQ-0014 | A new task is made from an existing one in one short command | requirement | REQ-0021 | 2026-11-01 | [requirements/REQ-0014-copy-a-task.md](requirements/REQ-0014-copy-a-task.md) |
| REQ-0015 | Tasks with no due date are listed on their own in one short command | requirement | REQ-0022 | 2026-11-01 | [requirements/REQ-0015-list-tasks-without-due-date.md](requirements/REQ-0015-list-tasks-without-due-date.md) |
| REQ-0016 | A task's due date is set to a chosen date in one short command | requirement | REQ-0023 | 2026-11-01 | [requirements/REQ-0016-set-due-date.md](requirements/REQ-0016-set-due-date.md) |
| REQ-0017 | A task's due date is removed in one short command | requirement | REQ-0024 | 2026-11-01 | [requirements/REQ-0017-remove-due-date.md](requirements/REQ-0017-remove-due-date.md) |

Decisions are the deliberate exception: superseded decisions stay in
`product/decisions/` rather than moving here, because their reasoning is read
constantly and their `status: superseded` plus `superseded_by` is sufficient
warning. They are still listed here for completeness when superseded.
