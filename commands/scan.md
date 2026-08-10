---
description: Map your concept registry onto this codebase
argument-hint: "[optional: category id or subdirectory]"
allowed-tools: Read, Edit, Glob, Grep
---

Scan this repository against the user's concept registry and record where each
concept actually appears.

Everything needed is in this prompt and the loaded skill. Do not look for
SKILL.md, the plugin directory, or any plugin file on disk.

Registry: use `./concepts-registry.json`, or `CONCEPTMAP_REGISTRY` if set. Read
and edit it with Read and Edit. Do not search anywhere else for it. If neither
location has one, say so and stop - do not create or copy a registry in this
turn.

Scope: `$ARGUMENTS`. If it names a `categoryId` from the registry (`db`, `auth`,
`async`...), only consider concepts in that category. If it looks like a path,
only scan under it. If empty, scan the whole repo against all concepts. State
how many concepts are in scope before you start.

Method - budget roughly 25 file reads:
1. Map the repo with Glob: entry points, routes, schema and migrations, config,
   jobs and workers, middleware.
2. Grep for concept signals before reading anything - library names, function
   and decorator names, SQL keywords, config keys. Issue these searches in
   parallel in a single message, not one at a time.
3. Read only the files the greps point at, densest first.

A concept counts only if the code genuinely demonstrates it. An import, a
dependency in `package.json`, or a mention in a comment is not evidence. When in
doubt leave it unmatched - the user studies from this, so over-claiming is worse
than under-claiming.

Write matches into `evidence` as `{file, note}`, path relative to the repo root,
one line on how it is used. Edit only the concept objects that changed. Never
touch any `score`, never reorder concepts, never rewrite the whole file.

End with the compact table - id, name, file - and the unmatched count. Nothing
else: no registry dump, no codebase summary.