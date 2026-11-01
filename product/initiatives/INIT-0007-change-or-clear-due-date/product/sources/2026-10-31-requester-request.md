# Raw request — INIT-0007

Received 2026-10-31 from the requester (repository owner, rortegalizardo),
relayed verbatim by the driving session for project TTC. Committed before any
triage synthesis (`SKILL-triage-product-request` step 7). Nothing below is
paraphrased.

## The request (verbatim)

"A person can change a task's due date, or remove it, after the task was added — in one short command, e.g. `ttc due <id> YYYY-MM-DD` and `ttc due <id> --clear`. Today the only ways to touch a due date after `ttc add` are `ttc postpone` and `ttc copy --due`."

## Framing relayed with the request (verbatim)

"Raw product ask for task-tracker-cli (repo /Users/ortega/Desktop/Projects/task-tracker-cli, Factory project TTC):"

## Instructions relayed with the request (verbatim)

- "Keep the initiative tiny: one or two stories. If the stories have an ordering, record it as depends_on so the tickets get real blockedBy/blocks relations in Ariadne."
- "The requester (the owner) is reachable only through me. When a phase needs a requester decision (for example the requester choice at SOLUTION_EXPLORATION), stop and return the batched questions per escalation-policy §4 (options by effect, your recommendation first). I relay the answer verbatim and resume you."
- "The owner has approved pushing product checkpoints to TTC `main` for this run (§12.7/§12.9/§12.10 push-and-verify)."
- "Leave alone the uncommitted change to product/initiatives/INIT-0005-copy-a-task/delivery/tickets.md: it belongs to another session. Never stage it."
- "Do not start engineering delivery (no orchestrator or batch-fanout dispatch). Stop after HANDOFF and report: the INIT id, the ticket keys with their relations, and the pushed commit."

## Run limits

None beyond the instructions above.
