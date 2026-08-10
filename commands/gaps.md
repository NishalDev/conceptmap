---
description: Find concepts this codebase should probably use but does not
argument-hint: "[optional: category id or subdirectory]"
allowed-tools: Read, Glob, Grep
---

Run a scan in reverse: report what is missing, not what is present. 

Everything needed is in this prompt and the loaded skill. Do not look for SKILL.md, the plugin directory, or any plugin file on disk.

Registry: use `./concepts-registry.json`, or `NERD_REGISTRY` if set.
Read and edit it with Read and Edit. Do not search anywhere else for it..

First understand the shape of the system - what it does, its data model, and
where it touches money, auth, external services, user input and background work.
Use Glob and Grep; read sparingly. Scope to `$ARGUMENTS` if given.

Then name the concepts a system of this shape would normally rely on but this
one does not. Draw from the registry first, then beyond it - a real gap that is
not in the registry is worth more than one that is, and should be flagged as a
suggested new entry.

For each gap give: the concept and exactly where it would apply (the route,
table or job), what concretely breaks without it, and a verdict -
**reasonable omission** (the scale or risk does not justify it) or **real hole**
(this will bite). Real holes first.

Be conservative. An absence is not a flaw by default, and calling a deliberate
simplification a hole makes the whole report easy to dismiss. Six well-argued
items beat thirty weak ones.

Report only. Never modify the registry.