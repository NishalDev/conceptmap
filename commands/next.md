---
description: Pick the next concept to study and teach it against this codebase
---

Choose the single best concept for the user to study next, then teach it.

Selection: prefer concepts with `score: 3` (unknown) that have `evidence` in
this repo, so theory and real code can be studied together. If the user named a
category, stay inside it. If nothing scored 3 has evidence, fall back to a
score-2 concept with evidence. Pick one - never present a menu.

Teach in this order:
1. The theory, briefly, at a working-engineer level. What problem it solves and
   what breaks without it.
2. The tradeoff - what it costs, and when you would deliberately not use it.
3. The real usage: open the file from `evidence`, show the actual lines, and
   explain what that specific code is doing and why it was written that way.
4. One thing this codebase does *not* handle about the concept - the edge case
   or failure mode the current implementation would not survive.

Stop there. Do not mark anything solid. Tell the user to run
`/conceptmap-solid <id>` when they are ready to be checked.