---
description: Map your concept registry onto this codebase
argument-hint: "[optional: category id or subdirectory]"
allowed-tools: Read, Edit, Glob, Grep, Bash(git rev-parse:*)
---

Scan this repository against the user's concept registry and record where each
concept appears, by the scanning and writing rules in the loaded skill.

Everything needed is in this prompt and the loaded skill. Do not look for
SKILL.md, the plugin directory, or any plugin file on disk.

Registry: use `./concepts-registry.json`, or `NERD_REGISTRY` if set. Read
and edit it with Read and Edit. Do not search anywhere else for it. If neither
location has one, say so and stop - do not create or copy a registry in this
turn.

Scope: `$ARGUMENTS`. If it names a `categoryId` from the registry (`db`, `auth`,
`async`...), only consider concepts in that category. If it looks like a path,
only scan under it. If empty, scan the whole repo against all concepts. State
how many concepts are in scope before you start.
