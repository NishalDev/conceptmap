---
description: Test yourself on a concept, then mark it solid only if you pass
argument-hint: "[concept id]"
allowed-tools: Read, Edit
disable-model-invocation: true
---

The user wants to mark `$ARGUMENTS` as known. Do not take their word for it.

Everything needed is in this prompt and the loaded skill. Do not look for SKILL.md, the plugin directory, or any plugin file on disk.

Registry: use `./concepts-registry.json`, or `CONCEPTMAP_REGISTRY` if set.
Read and edit it with Read and Edit. Do not search anywhere else for it..

If no id was given, ask which one. Handle one concept per run.

**First turn - ask, then stop.** Without showing them any code, ask them to
explain in their own words:
- the mechanics: what actually happens, step by step
- the tradeoff: what it costs, and when they would not use it
- how it is used in this codebase specifically

End your turn there. Do not read the evidence files yet, do not hint, and do not
answer your own question.

**After they reply**, read the files in that concept's `evidence` and compare.

If the explanation holds: set `score` to 1, save their words as `notes` lightly
cleaned up, set `lastReviewed` to today, append `{date, score}` to `history`.
Keep their phrasing - do not replace it with a textbook definition.

If it does not hold: leave the score as it is, name precisely which of the three
parts was missing or wrong, show the code that completes it, and offer to
re-test. A weak answer marked solid is worse than no registry at all.

Edit only that one concept object.