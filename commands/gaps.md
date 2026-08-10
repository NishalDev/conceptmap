---
description: Find concepts this codebase should probably use but does not
---

Run a scan in reverse. Instead of reporting what the codebase demonstrates,
report what is missing.

First understand the shape of the system: what it does, its traffic and data
model, where it touches money, auth, external services and background work.

Then name the concepts a system of this shape would normally rely on but this
one does not. Draw from the registry first, then go beyond it - a real gap that
is not in the registry is worth more than one that is, and should be reported as
a suggested new entry.

For each gap, give:
- the concept and where it would apply - the specific route, table or job
- what actually breaks without it, concretely, not in the abstract
- a verdict: **reasonable omission** (the scale or risk does not justify it) or
  **real hole** (this will bite)

Sort by the verdict, real holes first. Be conservative - an absence is not a
flaw by default, and calling a deliberate simplification a hole makes the whole
report easy to dismiss. Aim for a handful of well-argued items rather than an
exhaustive list.

Do not modify the registry. This command only reports.