---
name: conceptmap
description: Use when the user wants to learn the engineering concepts behind a codebase, asks what concepts a project uses, wants to study a concept against real code, or mentions their concept registry. Triggers on "what concepts does this use", "map this repo", "what should I learn next here", "mark this solid".
---

# Concept mapping

The user keeps a registry file tracking engineering concepts and how well they
know each one.

## Finding the registry

Look in exactly two places, in order, and stop at the first hit:

1. `./concepts-registry.json` in the current working directory
2. the path in the `CONCEPTMAP_REGISTRY` environment variable, if set

Do not search the filesystem. Do not look in home directories, Desktop,
Downloads, or the plugin cache. If neither location has a registry, stop and ask
the user for the path, offering to copy `registry-starter.json` from
`${CLAUDE_PLUGIN_ROOT}` into the repo instead.

Read and write it with the Read and Edit tools, never by shelling out to node
or python.

## Registry shape

`meta.scoreRubric` defines the scale. It runs **1 = solid, 2 = shaky,
3 = unknown** - lower is better. Never assume the opposite.

Each concept has: `id`, `name`, `category`, `categoryId`, `detail`, `score`,
`target`, `notes` (the user's own words), `evidence` (array of `{file, note}`),
`resources`, `history` (array of `{date, score}`), `lastReviewed`.

Older registries may lack `evidence` - add the key when first writing to it.

## Scanning a repo

Read the registry, then explore the codebase: entry points, schema, config, the
busiest modules. Do not read every file; sample enough to judge.

For each concept genuinely demonstrated, record the file and one line on how it
is used. Be strict: a concept counts only if the code really shows it. An
incidental import is not evidence. Report unmatched concepts separately.

## Studying one concept

Explain the theory first, briefly, at a working engineer's level. Then open the
file where it appears in this codebase and walk through the actual usage,
including the tradeoff that decision implies.

## Marking solid

Never mark a concept solid on request alone. First ask the user to explain the
mechanics and the tradeoff in their own words, without looking. Compare their
answer to the code. If it holds, set `score` to 1, save their words as `notes`,
set `lastReviewed` to today, and append `{date, score}` to `history`. If it
doesn't, say which part was missing and leave the score where it is.

## Finding gaps

When asked for gaps, do the inverse of a scan: given the shape of this system,
name the concepts a codebase like it would normally rely on but this one does
not, and say whether each absence is a reasonable choice or a real hole.