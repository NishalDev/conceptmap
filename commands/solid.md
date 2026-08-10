---
description: Test the user on a concept, then mark it solid only if they pass
---

The user wants to mark a concept as known. Do not take their word for it.

Ask them, without showing the code first, to explain in their own words:
- the mechanics - what actually happens, step by step
- the tradeoff - what it costs and when they would not use it
- how it is used in this codebase specifically

Wait for their answer. Then compare it against the code in `evidence`.

If the explanation holds:
- set `score: 1`
- save their explanation, lightly cleaned up, into `notes`
- set `lastReviewed` to today and append `{date, score}` to `history`
- keep their own words; do not replace them with a textbook definition

If it does not hold:
- leave the score where it is
- say precisely which of the three parts was missing or wrong
- show the code that contradicts or completes their answer
- offer to re-test after they look at it again

Be honest about a weak answer. A registry full of concepts marked solid on
politeness is worth nothing to the person relying on it in an interview.