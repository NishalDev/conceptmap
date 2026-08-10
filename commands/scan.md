---
description: Map your concept registry onto this codebase
argument-hint: "[optional: category id or subdirectory]"
allowed-tools: Read, Edit, Glob, Grep
---

Scan this repository against the user's concept registry and record where each
concept actually appears.

Scope: `$ARGUMENTS`. If it names a `categoryId` from the registry (`db`, `auth`,
`async`...), only consider concepts in that category. If it looks like a path,
only scan under it. If empty, scan the whole repo against all concepts.

Follow the scanning section of the `conceptmap:conceptmap` skill: grep for
signals in parallel first, read only what the greps point at, stay near the file
budget, and write matches into `evidence` without touching any `score`.

End with the compact table and the unmatched count. Nothing else.