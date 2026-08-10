---
description: Pick the next concept to study and teach it against this codebase
argument-hint: "[optional: category id]"
allowed-tools: Read, Grep
---

Choose one concept for the user to study now, then teach it. Use the
`conceptmap:conceptmap` skill.

Selection, in priority order: `score: 3` with `evidence` in this repo, then
`score: 2` with `evidence`, then `score: 3` without. If `$ARGUMENTS` names a
category, stay inside it. Pick one and commit to it - never offer a menu.

Read the registry and, at most, the files listed in that concept's `evidence`.
Do not scan the repo.

Teach in this order:
1. The theory, briefly - the problem it solves, what breaks without it.
2. The tradeoff - what it costs, and when you would deliberately skip it.
3. The real usage - the actual lines from `evidence`, and why they were written
   that way.
4. One thing this codebase does not handle about the concept: the edge case or
   failure mode the current implementation would not survive.

Change nothing in the registry. Close by telling the user to run
`/conceptmap:solid <id>` when they want to be tested.