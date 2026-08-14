---
description: Find concepts in code written since the last scan
argument-hint: "[optional: category id]"
allowed-tools: Read, Edit, Grep, Bash(git diff:*), Bash(git rev-parse:*)
---

Catch the registry up on this project: scan only what changed since it was last
scanned, and propose evidence before writing any.

Everything needed is in this prompt and the loaded skill. Do not look for SKILL.md, the plugin directory, or any plugin file on disk.

Registry: use `./concepts-registry.json`, or `NERD_REGISTRY` if set. Read and
edit it with Read and Edit. Do not search anywhere else for it. If neither
location has one, say so and stop.

Project id: the basename of `git rev-parse --show-toplevel`, lowercased. Find
its entry in `meta.projects`.

Files: `git diff --name-only <lastScanCommit>..HEAD` from that entry. If
`lastScanCommit` is absent or the range errors, use
`git diff --name-only HEAD~20..HEAD` and say which range you used. Scan only
those files - never the whole repo. If the range is empty, say so and stop.

Scope: `$ARGUMENTS`, if given, narrows to that `categoryId`.

**Propose, then stop.** Print a table - concept id, name, file, note - and ask
whether to write it. Change nothing in this turn, not even `meta`.

On yes: write the evidence by the skill's writing rules, then set that project's
`lastScanCommit` to `git rev-parse HEAD` (appending its `meta.projects` entry
first if it has none). Never touch a `score`.
