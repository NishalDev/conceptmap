---
name: conceptmap
description: Use when the user wants to learn the engineering concepts behind a codebase, asks what concepts a project uses or is missing, wants to study a concept against real code, or mentions their concept registry. Triggers on "what concepts does this use", "map this repo", "what should I learn next here", "mark this solid", "what's missing here".
---

# Concept mapping

The user keeps a registry of engineering concepts and how well they know each
one. This skill maps those concepts onto real code and manages the registry.

## Finding the registry

Look in exactly two places, in order, and stop at the first hit:

1. `./concepts-registry.json` in the current working directory
2. the path in `CONCEPTMAP_REGISTRY`, if that variable is set

Do not search the filesystem. Do not look in home directories, Desktop,
Downloads, or the plugin cache. If neither location has a registry, stop and ask
for the path, offering to copy `${CLAUDE_PLUGIN_ROOT}/registry-starter.json`
into the repo instead. `${CLAUDE_PLUGIN_ROOT}` is already set - use it as-is in
a path, never try to resolve or locate it. If you offer to copy the starter,
wait for an explicit yes; never copy it in and carry on in the same turn.

Read and write the registry with Read and Edit. Never shell out to node,
python, jq or cat for it - those break on Windows paths and waste turns.

## Reading the registry efficiently

Registries get large - hundreds of concepts, well over 100KB. Never Read one in
full. Slice it instead:

1. Grep for the ids in scope with one line of trailing context, e.g. `"id": "db-`
   with `-n -A 1`, which returns the id and name of every concept in that
   category along with its line numbers.
2. When you need a concept's full object - to check `evidence` or `score` - Read
   with `offset` and `limit` around the line numbers grep gave you, not the
   whole file.
3. Grep for `scoreRubric` rather than reading `meta` wholesale.

If no scope was given, grep the id prefixes one category at a time rather than
pulling everything into context at once.

## Registry shape

`meta.scoreRubric` defines the scale: **1 = solid, 2 = shaky, 3 = unknown**.
Lower is better. Never assume the reverse, and never infer the scale from
anything but this file.

Each concept has `id`, `name`, `category`, `categoryId`, `detail`, `score`,
`target`, `notes` (the user's own words), `evidence` (`[{file, note}]`),
`resources`, `history` (`[{date, score}]`), `lastReviewed`.

Registries written before this plugin may lack `evidence` - add the key on
first write. Preserve every other key exactly as found, including ones not
listed here.

## Writing to the registry

Edit only the concept objects that changed. Never rewrite or reformat the whole
file, never reorder concepts, never touch `meta`. Only `/conceptmap:solid`
changes a `score`; scanning never does.

## Scanning a repo

Budget: roughly 25 file reads. Spend them deliberately rather than exhaustively.

1. Slice the registry for the concepts in scope, as above. State how many are in
   scope before starting.
2. Map the repo structure with Glob - entry points, routes, schema and
   migrations, config, jobs and workers, middleware.
3. Use Grep for concept signals before reading anything: library names, decorator
   and function names, SQL keywords, config keys. Issue these searches in
   parallel in a single message, not one at a time.
4. Read only the files the greps point at, densest first.

A concept counts only if the code genuinely demonstrates it. An import, a
dependency in `package.json`, or a passing mention in a comment is not
evidence. When in doubt, leave it unmatched - a scan that over-claims is worse
than one that under-claims, because the user studies from it.

Write matches into `evidence` as `{file, note}` with a path relative to the repo
root and one line on how it is used.

Report as a compact table - id, name, file - grouped by category, then a single
line counting what went unmatched. Do not print the registry back, do not list
every unmatched concept unless asked, and do not summarise the codebase.

## Studying one concept

Theory first, briefly, at a working-engineer level: the problem it solves and
what breaks without it. Then the tradeoff - its cost, and when not to use it.
Then open the file from `evidence` and walk through the real lines. Finish with
one thing this codebase does not handle about the concept.

## Marking solid

Never mark a concept solid on request alone. Ask the user to explain, without
looking, the mechanics, the tradeoff, and the usage in this codebase. Stop and
wait for their answer.

Then compare it against the code. If it holds: set `score` to 1, save their
words as `notes`, set `lastReviewed` to today, append `{date, score}` to
`history`. If it does not: leave the score untouched and say precisely which
part was missing.

Be honest about a weak answer. A registry marked solid out of politeness is
worthless to the person relying on it in an interview.

## Finding gaps

The inverse of a scan: given the shape of this system, name the concepts a
codebase like it would normally rely on but this one does not. Report, never
write. Details in the `/conceptmap:gaps` command.