// Prerender static content into index.html so crawlers / no-JS see real copy.
// JS builders clear roots and rebuild the full interactive version on load.
// Run: node tools/prerender.js   (local only, never deployed by this script)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dir, '..');
const dataSrc = fs.readFileSync(path.join(rootDir, 'data.js'), 'utf8');
const htmlPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const window = {};
eval(dataSrc.replace('window.SITE', 'window.SITE'));
const SITE = window.SITE;
if (!SITE || !SITE.name) throw new Error('SITE failed to load from data.js');

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
const attr = (s) => esc(s).replace(/'/g, '&#39;');

// Depth-aware inner replace: works on empty shells and re-runs alike.
function setSection(id, tag, inner) {
  const openRe = new RegExp(`<${tag}([^>]*id="${id}"[^>]*)>`, 'g');
  const m = openRe.exec(html);
  if (!m) throw new Error(`<${tag}#${id}> not found`);
  const start = m.index + m[0].length;
  const openTag = new RegExp(`<${tag}(\\s|>)`, 'g');
  const closeTag = new RegExp(`</${tag}>`, 'g');
  let depth = 1, pos = start, nextOpen, nextClose;
  openTag.lastIndex = start; closeTag.lastIndex = start;
  while (depth > 0) {
    nextOpen = openTag.exec(html);
    nextClose = closeTag.exec(html);
    if (!nextClose) throw new Error(`unbalanced <${tag}#${id}>`);
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++;
      openTag.lastIndex = nextOpen.index + 1; closeTag.lastIndex = nextOpen.index + 1;
      pos = nextClose.index;
    } else {
      depth--;
      pos = nextClose.index;
      openTag.lastIndex = nextClose.index + 1; closeTag.lastIndex = nextClose.index + 1;
    }
  }
  html = html.slice(0, start) + inner + html.slice(pos);
}

const profile = `
<div class="profile profile-statement"><img class="avatar" src="${attr(SITE.avatar)}" alt="Portrait of ${attr(SITE.name)}" width="168" height="168" fetchpriority="high" decoding="async">`
  + `<div class="profile-main"><h1 id="h-name">${esc(SITE.name)}</h1>`
  + `<p class="title">${esc(SITE.title)}</p>`
  + `<p class="meta-row">${esc(SITE.location)} · ${esc(SITE.availability)}</p>`
  + `<p class="bio">${esc(SITE.bio)}</p>`
  + `<div class="actions"><a class="btn btn--primary" href="${attr(SITE.links.book)}" target="_blank" rel="noopener noreferrer">Book a call<span class="btn-glyph" aria-hidden="true">↗</span></a>`
  + (SITE.resume ? `<a class="btn btn--ghost" href="${attr(SITE.resume)}" target="_blank" rel="noopener noreferrer">Download CV</a>` : '')
  + `</div></div></div>`;

const now = `<h2 class="tile-title" id="h-now">Now</h2><p style="font-size:17px;font-weight:500;margin:0">${esc(SITE.now)}</p>`;

const impact = `<h2 class="eyebrow" id="h-impact">IMPACT</h2><div class="stats">`
  + SITE.impact.map((s) => `<div class="stat"><div class="stat-value">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></div>`).join('')
  + `</div><p class="muted cached-note">${esc(SITE.impactNote)}</p>`;

const fb = SITE.githubFallback;
const github = `<h2 class="tile-title" id="h-github">GitHub</h2>`
  + `<div class="gh-head"><img src="${attr(fb.avatar)}" alt="GitHub avatar of ibabarhashmi" width="40" height="40" decoding="async" loading="lazy"><a href="https://github.com/ibabarhashmi" target="_blank" rel="noopener noreferrer">@ibabarhashmi</a></div>`
  + fb.recent.slice(0, 4).map((r) => `<div class="repo"><a class="repo-name" href="${attr(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>`
    + (r.description ? `<div class="repo-desc">${esc(r.description)}</div>` : '')
    + `<div class="repo-meta">${esc([r.language, 'Stars ' + r.stars].filter(Boolean).join(' - '))}</div></div>`).join('')
  + `<div class="cached-note">Showing cached data — live stats load in the browser.</div>`
  + `<a class="view-all" href="https://github.com/ibabarhashmi?tab=repositories" target="_blank" rel="noopener noreferrer">View all on GitHub →</a>`;

const exp = `<h2 class="tile-title" id="h-exp">Experience</h2><div class="timeline">`
  + SITE.experience.map((j) => `<div class="tl-item"><div class="tl-top"><h3 class="tl-role">${esc(j.role)}</h3><span class="tl-dates">${esc(j.start)} - ${esc(j.end)}</span></div>`
    + `<div class="tl-org">${esc(j.org)}</div><ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`).join('')
  + `</div>`;

const counts = { all: SITE.projects.length, agents: 0, security: 0, cv: 0 };
SITE.projects.forEach((p) => { if (counts[p.cat] != null) counts[p.cat]++; });
const filters = [['all', 'All'], ['agents', 'Agents'], ['security', 'Security'], ['cv', 'Applied CV']];
const workHeading = `<h2 class="work-title" id="work-title">Selected work</h2>`
  + `<div class="filter-row" role="group" aria-label="Filter projects">`
  + filters.map(([v, label]) => `<button class="filter-btn${v === 'all' ? ' on' : ''}" type="button" data-filter="${v}" aria-pressed="${v === 'all' ? 'true' : 'false'}">${label}</button>`).join('')
  + `</div><p id="filter-count" role="status" aria-live="polite" class="repo-meta">Showing ${counts.all} of ${counts.all} projects</p>`;

const projects = SITE.projects.map((p) => {
  const cls = p.featured ? 'tile span-4 proj proj-feat tile-linked' : 'tile span-2 proj tile-linked';
  const open = p.repo
    ? `<a class="${cls}" href="${attr(p.repo)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${attr(p.name)} repository" data-cat="${attr(p.cat || 'all')}">`
    : `<article class="${cls}" data-cat="${attr(p.cat || 'all')}">`;
  const close = p.repo ? '</a>' : '</article>';
  return open
    + `<p class="proj-tag">${esc(p.tag || 'Project')}</p>`
    + (p.repo ? '<span class="ext" aria-hidden="true">↗</span>' : '')
    + (p.visual ? `<figure class="proj-visual"><img src="${attr(p.visual)}" alt="Screenshot of ${attr(p.name)}" loading="lazy" decoding="async"></figure>` : '')
    + `<h3>${esc(p.name)}</h3><p class="muted">${esc(p.summary)}</p>`
    + (p.featured && p.highlights?.length ? `<p class="proj-outcome">${esc(p.highlights[0])}</p>`
      : (p.highlights?.length ? `<ul class="checks">${p.highlights.slice(0, 3).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''))
    + `<div class="chips">${(p.stack || []).map((s) => `<span class="chip">${esc(s)}</span>`).join('')}`
    + (!p.repo ? '<span class="chip chip-accent">Private / work project</span>' : '') + `</div>`
    + close;
}).join('');

const stack = `<h2 class="tile-title" id="h-stack">Stack</h2>`
  + `<p class="stack-lede">PyTorch and fine-tuned LLMs up front, AWS and vLLM behind them, TypeScript holding the SDK together.</p>`
  + Object.entries(SITE.stack).map(([g, items]) => `<div class="stack-group"><div class="stack-name">${esc(g)}</div>`
    + `<div class="chips" style="margin:0">${items.map((s) => `<span class="chip${(SITE.stackDaily || []).indexOf(s) >= 0 ? ' chip-accent' : ''}">${esc(s)}</span>`).join('')}</div></div>`).join('');

const certs = `<h2 class="tile-title" id="h-certs">Certifications</h2>`
  + SITE.certifications.map((c) => `<div class="cert-row"><p class="cert-name">${esc(c.name)}</p><p class="cert-meta">${esc(c.issuer)} - ${esc(c.date)}</p></div>`).join('');

const domains = `<h2 class="tile-title" id="h-domains">Domains</h2><div class="chips" style="margin:0">`
  + SITE.domains.map((x) => `<span class="chip">${esc(x)}</span>`).join('') + `</div>`;

const vibe = `<p class="vibe-text">${esc(SITE.vibe)}</p>`;

const contact = `<h2 class="eyebrow" id="h-contact">Contact</h2><p class="contact-title">Let&apos;s build something.</p>`
  + `<p>Available remote - globally. Based in Bangalore, open to relocation. Grab the CV or just say hi.</p>`
  + `<div class="actions"><a class="btn btn--primary" href="${attr(SITE.links.book)}" target="_blank" rel="noopener noreferrer">Book a call<span class="btn-glyph" aria-hidden="true">↗</span></a>`
  + (SITE.resume ? `<a class="btn btn--ghost" href="${attr(SITE.resume)}" target="_blank" rel="noopener noreferrer">Download CV</a>` : '') + `</div>`
  + `<div class="icon-row"><a class="icon-link" href="${attr(SITE.links.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" title="LinkedIn profile">in</a>`
  + `<a class="icon-link" href="${attr(SITE.links.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" title="GitHub profile">gh</a>`
  + `<a class="icon-link" href="${attr(SITE.links.telegram)}" target="_blank" rel="noopener noreferrer" aria-label="Telegram chat" title="Telegram chat">tg</a>`
  + `<a class="icon-link" href="mailto:${attr(SITE.email)}" aria-label="Email ${attr(SITE.email)}" title="Email">mail</a></div>`;

setSection('tile-profile', 'section', profile);
setSection('tile-now', 'section', now);
setSection('tile-impact', 'section', impact);
setSection('tile-github', 'section', github);
setSection('tile-exp', 'section', exp);
setSection('work-heading', 'div', workHeading);
setSection('projects-slot', 'div', projects);
setSection('tile-stack', 'section', stack);
setSection('tile-certs', 'section', certs);
setSection('tile-domains', 'section', domains);
setSection('tile-vibe', 'section', vibe);
setSection('tile-contact', 'section', contact);

fs.writeFileSync(htmlPath, html);
console.log('prerendered 12 sections into index.html');
