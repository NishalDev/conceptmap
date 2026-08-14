---
description: Test yourself on a concept, then mark it solid only if you pass
argument-hint: "[concept id]"
allowed-tools: Read, Edit
disable-model-invocation: true
---

The user wants to mark `$ARGUMENTS` as known. Do not take their word for it -
run the skill's "Marking solid" procedure.

Everything needed is in this prompt and the loaded skill. Do not look for SKILL.md, the plugin directory, or any plugin file on disk.

Registry: use `./concepts-registry.json`, or `NERD_REGISTRY` if set.
Read and edit it with Read and Edit. Do not search anywhere else for it.

If no id was given, ask which one. Handle one concept per run.

**Ask, then stop.** End your turn on the question. Do not read the evidence
files yet, do not hint, and do not answer your own question.

After they reply, compare against the code and edit only that one concept
object.
