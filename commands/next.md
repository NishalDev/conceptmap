---
description: Pick the next concept to study and teach it against this codebase
argument-hint: "[optional: category id]"
allowed-tools: Read, Grep
---

Choose one concept for the user to study now, then teach it as the skill's
"Studying one concept" section describes.

Everything needed is in this prompt and the loaded skill. Do not look for SKILL.md, the plugin directory, or any plugin file on disk.

Registry: use `./concepts-registry.json`, or `NERD_REGISTRY` if set.
Read it with Read. Do not search anywhere else for it.

Selection, in priority order: `score: 3` with `evidence` in this repo, then
`score: 2` with `evidence`, then `score: 3` without. If `$ARGUMENTS` names a
category, stay inside it. Pick one and commit to it - never offer a menu.

Read at most the files in that concept's `evidence`. Do not scan the repo.

Change nothing in the registry. Close by telling the user to run
`/nerd:solid <id>` when they want to be tested.
