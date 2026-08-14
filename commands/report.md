---
description: Render the registry as a single offline HTML report
argument-hint: "[optional: output path]"
allowed-tools: Bash(node:*)
---

Render the user's registry as one self-contained HTML file.

Everything needed is in this prompt and the loaded skill. Do not look for SKILL.md, the plugin directory, or any plugin file on disk.

Registry: use `./concepts-registry.json`, or `NERD_REGISTRY` if set. Do not read
it, do not edit it, do not search anywhere else for it - pass its path to the
script and let the script parse it.

Output path: `$ARGUMENTS` if given, otherwise `nerd-report.html` in the current
directory.

Run exactly:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/report.mjs" <registry> <output>
```

The script prints the file it wrote. Report that path and nothing else - no
summary of the report's contents, no counts, no advice on what to study.
