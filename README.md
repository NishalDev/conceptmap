<p align="center">
  <img src="assets/logo.png" alt="the nerd" width="250">
</p>


<h1 align="center">Nerd</h1>

<p align="center"><em>He actually read the docs. He won't let you say you know it until you've said it out loud.</em></p>

<p align="center">
You know him. Sat two desks down. Answers a question about connection pooling with three follow-up questions of his own. Asks "okay, but what happens when the pool is exhausted?" and then waits, while you find out live that you don't know.
</p>

<p align="center">
  <em>Nerd puts himself inside your codebase.</em>
</p>


## The problem

You can read a codebase for a month and still not be able to say which ideas it rests on. And you can read about idempotency keys for an hour and still not recognise one in a diff. The two halves never meet: the theory has no code attached and the code has no name attached.

nerd holds both ends. It finds where each concept actually lives in your repo, teaches it against those exact lines and then makes you explain it back before it writes anything down.

## Before / after

Without him, you finish a feature and move on.

With him:

```
> /nerd:solid db-021

Explain three things, no peeking:
  1. What SELECT ... FOR UPDATE actually does to the row and to other txns
  2. What it costs you
  3. Where this codebase uses it and why there

> uh, it locks the row so nobody else can read it

Not quite. Other transactions can still read it - that's the whole point of
MVCC. What's blocked is another FOR UPDATE on the same row. Look at
refreshSession: two parallel refreshes with the same token, one waits and the
loser finds revokedAt already set. That's the behaviour you'd have missed.

  db-021 stays at 3.
```

He is not being difficult. He is being accurate, which sometimes looks the same.

## Install

```
/plugin marketplace add NishalDev/nerd
```

```
/plugin install nerd@nerd
```

Two separate messages. He'd tell you that himself, in a tone.

## Quick start

Copy `registry-starter.json` into your repo as `concepts-registry.json`, then:

```
/nerd:scan db
```

Real output, from a Node + Postgres API:

| id | name | file |
| --- | --- | --- |
| db-002 | Junction tables | `src/db/schema/profiles.ts` |
| db-008 | Migrations | `src/db/migrate.ts`, `scripts/bootstrap-roles.sql` |
| db-021 | Row locking & concurrency control | `src/modules/auth/auth.service.ts` |
| db-023 | Atomic operations | `src/modules/auth/auth.service.ts` |

Unmatched: 1 (db-005 JSONB - no jsonb columns in this repo).

Every row is written back into the registry with a note. `db-008` came with:
*bootstrap-roles.sql is kept out of migrations because it needs superuser and would break the migration role.* That's the sentence you'd want in front of you in an interview and it isn't in any textbook - it's in your repo.

## Commands

| Command | What he does |
| --- | --- |
| `/nerd:scan [category\|path]` | Reads your code, tells you which concepts are actually in it and where |
| `/nerd:next [category]` | Picks what you should learn next. One thing. He is not giving you a menu |
| `/nerd:solid <id>` | The oral exam. Pass and it's marked. Don't and it isn't |
| `/nerd:gaps [category\|path]` | Tells you what a codebase like yours usually has and yours doesn't |

`/nerd:gaps` is the uncomfortable one. A scan lists what you already touched - your comfort zone, rendered as a table. Gaps lists what you skipped and sorts it by whether it's going to bite.

## He does not flatter you

The registry is only worth something if the scores are true. So:

- Nothing is marked solid because you asked nicely. You explain it first.
- A wrong answer gets named specifically, not smoothed over.
- Scores only ever move through `/nerd:solid`. A scan never quietly promotes you.
- If the code doesn't really demonstrate a concept, it goes in the unmatched pile. An import is not evidence.

## Your registry stays yours

It fills up with your file paths, notes on how your system works and your own words about what you don't understand yet. Nothing leaves your machine - no server, no network calls - but it will land in git if you let it.

```
# .gitignore
concepts-registry.json
```

Keeping one registry across several repos, or working in a repo you don't control? Put it anywhere and point him at it:

```bash
export NERD_REGISTRY="$HOME/dev/concepts-registry.json"
```

He checks `./concepts-registry.json`, then that variable and nowhere else. He does not go rummaging through your home directory.

## Keeping runs cheap

Scan one category at a time - `/nerd:scan db` weighs 35 concepts, not 258 and costs a fraction. Evidence is written to disk as it goes, so a fresh session per category is cheaper than one long one and loses nothing. `scan` is mostly retrieval and does fine at `/effort medium`; `gaps` and `solid` are judgement calls and deserve `high` or `xhigh`.

## Registry format

```json
{
  "meta": {
    "scoreRubric": { "1": "solid", "2": "shaky", "3": "unknown" },
    "categories": [{ "id": "db", "name": "Databases & Data Modeling" }]
  },
  "concepts": [
    {
      "id": "db-021",
      "name": "Row locking & concurrency control",
      "categoryId": "db",
      "score": 3,
      "target": 1,
      "notes": "",
      "evidence": [{ "file": "src/modules/auth/auth.service.ts", "note": "SELECT ... FOR UPDATE on refresh" }],
      "history": [],
      "lastReviewed": null
    }
  ]
}
```

Scores run **1 = solid, 2 = shaky, 3 = unknown**. Lower is better, which annoys people and he does not care. `notes` holds your explanation in your own words - not a definition copied from anywhere, because a definition you copied proves nothing.

The starter ships 66 concepts across 12 categories. Rename them, delete them, add your own. It's meant to become yours.

## FAQ

**Can I just mark everything solid?** You can edit the JSON by hand. He'll never know. You will.

**Why does it refuse to guess on some concepts?** Because you study from this file. A scan that over-claims sends you into an interview certain about something you never actually did.

**Does it work on a codebase I didn't write?** That's the best case. Point it at an unfamiliar repo and it becomes an onboarding map with a quiz attached.

**Why "nerd"?** Because that's who you want reviewing what you think you know.

## License

MIT