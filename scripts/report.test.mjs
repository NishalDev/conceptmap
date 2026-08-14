// node scripts/report.test.mjs - fails loudly if the aggregation breaks.
import assert from 'node:assert/strict';
import { buildHtml } from './report.mjs';

const html = buildHtml(
  {
    meta: { projects: [{ id: 'billing', root: '/x/billing' }], categories: [{ id: 'db', name: 'Databases' }] },
    concepts: [
      { id: 'db-1', name: 'Locking', categoryId: 'db', score: 3, evidence: [{ project: 'billing', file: 'a.ts' }], lastReviewed: null },
      { id: 'db-2', name: 'Migrations', categoryId: 'db', score: 1, evidence: [{ project: 'ledger', file: 'b.go' }], lastReviewed: '2020-01-01' },
      { id: 'db-3', name: 'JSONB', categoryId: 'db', score: 2, evidence: [{ file: 'old.ts' }] },
      { id: 'db-4', name: 'Sharding', categoryId: 'db', evidence: [] },
    ],
  },
  'reg.json',
);

assert.match(html, /3 project\(s\)/); // billing, ledger from evidence, (no project) bucket
assert.match(html, />ledger</);
assert.match(html, />\(no project\)</);
assert.equal((html.match(/class="hit"/g) ?? []).length, 3); // one per evidence entry, none for db-4
assert.match(html, /db-1<\/code> <b>Locking/); // ready to study: evidence + score 3
assert.doesNotMatch(html, /db-2<\/code> <b>/); // score 1 is not ready to study
assert.match(html, /1 solid/);
assert.match(html, /1 unscored/); // db-4 has no score
assert.ok(html.indexOf('never') < html.indexOf('d ago')); // never-reviewed sorts stalest
assert.doesNotMatch(html, /<script|https?:\/\//); // self-contained, offline
console.log('ok');
