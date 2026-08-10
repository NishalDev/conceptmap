---
name: conceptmap
description: Use when the user wants to learn the engineering concepts behind a codebase, asks what concepts a project uses, wants to study a concept against real code, or mentions their concept registry. Triggers on "what concepts does this use", "map this repo", "what should I learn next here", "mark this solid".
---

# Concept mapping

The user keeps a registry file (`concepts-registry.json` by default) tracking
engineering concepts and how well they know each one.

## Registry shape

Each concept: `id`, `name`, `category`, `score` (1 unknown, 2 shaky, 3 solid),
`evidence` (array of `{file, note}`), `note` (their own words, written from memory).

If no registry exists, offer to copy `registry-starter.json` into the repo.

## Scanning a repo

Read the registry first. Then explore the codebase entry points, schema,
config, the busiest modules. Do not read every file; sample enough to judge.

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
answer to the code. If it holds, set score 3 and save their words as `note`.
If it doesn't, say which part was missing and leave the score where it is.

## Finding gaps

When asked for gaps, do the inverse of a scan: given the shape of this system,
name the concepts a codebase like it would normally rely on but this one does
not and say whether each absence is a reasonable choice or a real hole.