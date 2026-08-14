#!/usr/bin/env node
// Renders a concept registry as one self-contained HTML file. No dependencies,
// no CDN links, no JS in the output - it must open offline from disk.
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const UNSCOPED = '(no project)';
const SCORES = [
  { key: 1, label: 'solid', cls: 's1' },
  { key: 2, label: 'shaky', cls: 's2' },
  { key: 3, label: 'unknown', cls: 's3' },
  { key: 0, label: 'unscored', cls: 's0' },
];

const esc = (v) =>
  String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const bucket = (c) => (SCORES.some((s) => s.key === c.score) && c.score ? c.score : 0);

const daysSince = (iso) => {
  const t = Date.parse(iso ?? '');
  return Number.isNaN(t) ? null : Math.max(0, Math.floor((Date.now() - t) / 86400000));
};

// Project columns: meta.projects order first, then any project seen only in
// evidence, then the pre-scoping bucket if some evidence has no project.
function projectsOf(registry, concepts) {
  const ids = (registry.meta?.projects ?? []).map((p) => p.id).filter(Boolean);
  let unscoped = false;
  for (const c of concepts)
    for (const e of c.evidence ?? []) {
      if (!e.project) unscoped = true;
      else if (!ids.includes(e.project)) ids.push(e.project);
    }
  return unscoped ? [...ids, UNSCOPED] : ids;
}

const evidenceIn = (concept, project) =>
  (concept.evidence ?? []).filter((e) => (e.project || UNSCOPED) === project);

function tally(concepts) {
  const counts = Object.fromEntries(SCORES.map((s) => [s.key, 0]));
  for (const c of concepts) counts[bucket(c)]++;
  return counts;
}

function barHtml(counts, total) {
  if (!total) return '<div class="bar"></div>';
  const seg = SCORES.filter((s) => counts[s.key])
    .map(
      (s) =>
        `<span class="${s.cls}" style="width:${((counts[s.key] / total) * 100).toFixed(2)}%" ` +
        `title="${counts[s.key]} ${s.label}"></span>`,
    )
    .join('');
  return `<div class="bar">${seg}</div>`;
}

const countsHtml = (counts) =>
  SCORES.filter((s) => counts[s.key])
    .map((s) => `<span class="tag ${s.cls}">${counts[s.key]} ${s.label}</span>`)
    .join(' ');

function categoryRows(concepts, categories) {
  const seen = [...new Set(concepts.map((c) => c.categoryId ?? '?'))];
  const named = new Map((categories ?? []).map((c) => [c.id, c.name]));
  return seen.map((id) => ({
    id,
    name: named.get(id) ?? id,
    concepts: concepts.filter((c) => (c.categoryId ?? '?') === id),
  }));
}

export function buildHtml(registry, registryPath = '') {
  const concepts = registry.concepts ?? [];
  const projects = projectsOf(registry, concepts);
  const cats = categoryRows(concepts, registry.meta?.categories);
  const overall = tally(concepts);

  const perCategory = cats
    .map(
      (cat) => `<tr><th>${esc(cat.name)}</th><td class="barcell">${barHtml(tally(cat.concepts), cat.concepts.length)}</td>
      <td class="nums">${countsHtml(tally(cat.concepts))}</td></tr>`,
    )
    .join('\n');

  const gridHead = projects.map((p) => `<th class="rot"><span>${esc(p)}</span></th>`).join('');
  const gridBody = cats
    .map((cat) => {
      const rows = cat.concepts
        .map((c) => {
          const cells = projects
            .map((p) => {
              const hits = evidenceIn(c, p);
              return hits.length
                ? `<td class="hit" title="${esc(hits.map((h) => h.file).join('\n'))}">●</td>`
                : '<td></td>';
            })
            .join('');
          return `<tr><th class="cid"><code>${esc(c.id)}</code> ${esc(c.name)}</th>
        <td class="sc ${SCORES.find((s) => s.key === bucket(c)).cls}">${bucket(c) || '-'}</td>${cells}</tr>`;
        })
        .join('\n');
      return `<tr class="catrow"><th colspan="${projects.length + 2}">${esc(cat.name)}</th></tr>\n${rows}`;
    })
    .join('\n');

  const ready = concepts.filter((c) => (c.evidence ?? []).length && c.score === 3);
  const readyHtml = ready.length
    ? `<ul class="ready">${ready
        .map(
          (c) => `<li><code>${esc(c.id)}</code> <b>${esc(c.name)}</b>
        <div class="ev">${(c.evidence ?? [])
          .map((e) => `<span>${esc(e.project || UNSCOPED)}: ${esc(e.file)}</span>`)
          .join('')}</div></li>`,
        )
        .join('')}</ul>`
    : '<p class="empty">Nothing with evidence is still unknown. Scan another repo.</p>';

  const stale = [...concepts].sort((a, b) => {
    const [x, y] = [daysSince(a.lastReviewed), daysSince(b.lastReviewed)];
    if (x === null && y === null) return a.id.localeCompare(b.id);
    if (x === null) return -1;
    if (y === null) return 1;
    return y - x;
  });
  const staleHtml = stale
    .map(
      (c) => `<tr><td><code>${esc(c.id)}</code></td><td>${esc(c.name)}</td>
      <td class="sc ${SCORES.find((s) => s.key === bucket(c)).cls}">${bucket(c) || '-'}</td>
      <td class="age">${daysSince(c.lastReviewed) === null ? 'never' : `${daysSince(c.lastReviewed)}d ago`}</td></tr>`,
    )
    .join('\n');

  return `<!doctype html>
<meta charset="utf-8">
<title>nerd report</title>
<style>
:root{--bg:#fff;--fg:#16181d;--dim:#6b7280;--line:#e5e7eb;--card:#fafafa;
--c1:#1f9d55;--c2:#d99a00;--c3:#d1493f;--c0:#9ca3af}
@media(prefers-color-scheme:dark){:root{--bg:#111317;--fg:#e6e8ec;--dim:#9aa1ad;--line:#272b33;--card:#181b21}}
*{box-sizing:border-box}
body{margin:0;padding:2rem 1.25rem 4rem;background:var(--bg);color:var(--fg);
font:15px/1.5 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:1100px;margin:0 auto}
h1{font-size:1.5rem;margin:0}
h2{font-size:1.05rem;margin:2.5rem 0 .75rem;padding-bottom:.35rem;border-bottom:1px solid var(--line)}
.sub{color:var(--dim);margin:.35rem 0 0;font-size:.85rem}
code{font:12px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--dim)}
table{border-collapse:collapse;width:100%;font-size:.85rem}
th{text-align:left;font-weight:600}
td,th{padding:.3rem .5rem;border-bottom:1px solid var(--line);vertical-align:middle}
.bar{display:flex;height:14px;border-radius:7px;overflow:hidden;background:var(--card);min-width:180px}
.bar span{display:block}
.barcell{width:45%}
.nums{white-space:nowrap}
.tag{display:inline-block;padding:.05rem .4rem;border-radius:10px;font-size:.72rem;color:#fff;margin-right:.2rem}
.s1,.tag.s1{background:var(--c1)}.s2,.tag.s2{background:var(--c2)}
.s3,.tag.s3{background:var(--c3)}.s0,.tag.s0{background:var(--c0)}
.grid{overflow-x:auto}
.grid table{width:auto;min-width:100%}
.grid .cid{font-weight:400;max-width:26rem}
.grid td{text-align:center}
.hit{color:var(--c1);font-size:1rem}
.sc{color:#fff;text-align:center;width:2rem;border-radius:3px;background:var(--c0)}
.catrow th{padding-top:1.1rem;color:var(--dim);text-transform:uppercase;font-size:.7rem;letter-spacing:.06em}
.rot{font-size:.75rem;white-space:nowrap;vertical-align:bottom}
.ready{list-style:none;padding:0;margin:0;display:grid;gap:.6rem}
.ready li{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:.6rem .75rem}
.ev{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.3rem}
.ev span{font:12px ui-monospace,monospace;color:var(--dim);background:var(--bg);border:1px solid var(--line);
border-radius:4px;padding:.05rem .35rem}
.age{white-space:nowrap;color:var(--dim);text-align:right}
.empty{color:var(--dim)}
</style>
<main>
<h1>nerd report</h1>
<p class="sub">${concepts.length} concepts · ${projects.length} project(s) · ${esc(registryPath)} · generated ${new Date().toISOString().slice(0, 10)}</p>

<h2>Scores</h2>
${barHtml(overall, concepts.length)}
<p class="sub">${countsHtml(overall)}</p>
<table>${perCategory}</table>

<h2>Coverage by project</h2>
<div class="grid"><table>
<tr><th>concept</th><th>score</th>${gridHead}</tr>
${gridBody}
</table></div>

<h2>Ready to study <span class="sub">(evidence, still unknown)</span></h2>
${readyHtml}

<h2>Longest since review</h2>
<table>${staleHtml}</table>
</main>
`;
}

function main() {
  const [registryPath, outArg] = process.argv.slice(2);
  if (!registryPath) {
    console.error('usage: node report.mjs <registry.json> [output.html]');
    process.exit(1);
  }
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  let out = outArg || 'nerd-report.html';
  if (existsSync(out) && statSync(out).isDirectory()) out = join(out, 'nerd-report.html');
  writeFileSync(out, buildHtml(registry, registryPath), 'utf8');
  console.log(resolve(out));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
