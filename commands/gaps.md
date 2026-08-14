---
description: Find concepts this codebase should probably use but does not
argument-hint: "[optional: category id or subdirectory]"
allowed-tools: Read, Glob, Grep
---

A scan in reverse: report what is missing, not what is present.

Everything needed is in this prompt and the loaded skill. Do not look for SKILL.md, the plugin directory, or any plugin file on disk.

Registry: use `./concepts-registry.json`, or `NERD_REGISTRY` if set.
Read it with Read. Do not search anywhere else for it.

Scope to `$ARGUMENTS` if given. Work from the shape of the system - data model,
money, auth, external services, user input, background work. Draw gaps from the
registry first, then beyond it - flag a real gap that is not in the registry as
a suggested new entry, those are worth most.

For each gap: the concept, exactly where it would apply (the route, table or
job), what concretely breaks without it, and a verdict - **reasonable omission**
(scale or risk does not justify it) or **real hole** (this will bite). Real
holes first. Be conservative; six well-argued items beat thirty weak ones.

Report only. Never modify the registry.
