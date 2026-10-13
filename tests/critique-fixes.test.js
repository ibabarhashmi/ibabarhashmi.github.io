import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const main = fs.readFileSync(new URL('../main.js', import.meta.url), 'utf8');

describe('P0 GitHub tile: no anti-proof counts', () => {
  it('ships no gh-stats counts row', () => {
    assert.ok(!/gh-stats/.test(html), 'counts row must go');
    assert.ok(!/gh-stats/.test(main), 'JS builder must not render counts');
  });
  it('leads with repo descriptions', () => {
    assert.match(html, /repo-desc/);
  });
});

describe('P0 featured cards: one outcome line, visual slot', () => {
  it('featured cards render single outcome line, not 3-check list', () => {
    assert.match(html, /proj-outcome/);
    assert.match(main, /proj-outcome/);
  });
  it('featured cards support a visual slot when data provides one', () => {
    assert.match(main, /proj-visual/);
  });
});

describe('P1 single primary CTA per tile', () => {
  it('CV link uses ghost style in builders and prerender', () => {
    assert.ok(/btn--ghost/.test(main), 'JS must demote CV to ghost');
    assert.ok(/btn--ghost/.test(html), 'prerender must demote CV to ghost');
  });
});

describe('P1 stack: daily-driver signal, no silent loss', () => {
  it('stack tile marks a small daily-driver subset', () => {
    const data = fs.readFileSync(new URL('../data.js', import.meta.url), 'utf8');
    const daily = (data.match(/stackDaily:\s*\[([^\]]*)\]/) || [])[1] || '';
    const expected = (daily.match(/"/g) || []).length / 2;
    const stack = (html.match(/id="tile-stack"[\s\S]*?<\/section>/) || [])[0] || '';
    const marked = (stack.match(/chip-accent/g) || []).length;
    assert.equal(marked, expected, `stack tile marks exactly the daily set (${expected}), got ${marked}`);
    assert.ok(marked >= 3 && marked <= 8, 'daily set stays small');
  });
});

describe('stack AI/ML chips: Devtools highlighted, LLM plain, no Custom', () => {
  const data = fs.readFileSync(new URL('../data.js', import.meta.url), 'utf8');
  const stack = (html.match(/id="tile-stack"[\s\S]*?<\/section>/) || [])[0] || '';
  it('data lists Devtools, drops Custom agent frameworks', () => {
    assert.ok(/"Devtools"/.test(data), 'data must list Devtools');
    assert.ok(!/"Custom agent frameworks"/.test(data), 'Custom agent frameworks must go');
  });
  it('daily set highlights Devtools, not LLM fine-tuning', () => {
    const daily = (data.match(/stackDaily:\s*\[([^\]]*)\]/) || [])[1] || '';
    assert.ok(/"Devtools"/.test(daily), 'Devtools must be daily (black)');
    assert.ok(!/"LLM fine-tuning"/.test(daily), 'LLM fine-tuning must be plain white');
  });
  it('rendered tile accents Devtools only', () => {
    assert.ok(/chip-accent">Devtools/.test(stack), 'Devtools chip must carry accent');
    assert.ok(!/chip-accent">LLM fine-tuning/.test(stack), 'LLM chip must not carry accent');
    assert.ok(!/Custom agent frameworks/.test(stack), 'stack tile must not mention Custom agent frameworks');
  });
});

describe('P2 eyebrows only on Impact + Contact', () => {
  it('tile-title is not uppercase-tracked section grammar', () => {
    const rule = css.match(/\.tile-title\{[^}]*\}/);
    assert.ok(rule && !/text-transform\s*:\s*uppercase/.test(rule[0]), 'tile-title must read as plain title');
  });
  it('vibe tile ships no label', () => {
    assert.ok(!/h-vibe/.test(html) && !/h-vibe/.test(main), 'vibe line needs no label');
  });
});

describe('minors: dead code out', () => {
  it('no dead theme-toggle code', () => {
    assert.ok(!/theme-toggle/.test(main), 'dead theme IIFE must go');
  });
  it('no duplicate profile title rule', () => {
    const n = (css.match(/\.profile \.title\{/g) || []).length;
    assert.ok(n <= 2, `base plus at most one responsive override, got ${n}`);
    assert.match(css, /max-width:\s*639px[\s\S]*?\.profile \.title\{[^}]*font-size:\s*15px/);
  });
  it('palette opens with suggestions, not blank', () => {
    assert.ok(!/render\(\[\]\)/.test(main), 'open must render suggestions');
  });
});

describe('location pill: structured two-liner, no pipe slop', () => {
  it('JS builder splits location into primary + sub spans', () => {
    assert.match(main, /loc-primary/, 'meta-row must carry a primary span');
    assert.match(main, /loc-sub/, 'meta-row must carry a sub span');
    assert.ok(!/SITE\.location\|\|""\) \+ " \| " \+/.test(main), 'pipe-joined location must go');
  });
  it('prerender mirrors the span split for no-JS parity', () => {
    const pre = fs.readFileSync(new URL('../tools/prerender.js', import.meta.url), 'utf8');
    assert.match(pre, /loc-primary/);
    assert.match(pre, /loc-sub/);
    assert.match(html, /loc-primary/);
    assert.match(html, /loc-sub/);
  });
  it('sub reads as muted caption, not twin shout', () => {
    const rules = [...css.matchAll(/\.loc-sub\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(rules.length > 0, 'missing .loc-sub rule');
    assert.ok(/font-size\s*:\s*11px/.test(rules), 'sub must sit at 11px caption');
    assert.ok(/font-weight\s*:\s*400/.test(rules), 'sub must drop to regular weight');
  });
  it('stack keeps a gap so words never jam on desktop', () => {
    const rules = [...css.matchAll(/\.loc-stack\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(/column-gap\s*:\s*6px|gap\s*:\s*[^;}]*6px/.test(rules), 'stack must hold primary off sub');
  });
  it('mobile work title fits the band, tracking button-row width', () => {
    const m = css.match(/@media\(max-width:639px\)\{#work-heading \.work-title\{[^}]*?(\d+(?:\.\d+)?)vw/);
    assert.ok(m, 'canonical 639px block must fluid-size the work title');
    const vw = Number.parseFloat(m[1]);
    assert.ok(vw >= 12 && vw <= 14, `title vw must fit band inner width, got ${vw}vw`);
  });
  it('mobile filter row tracks title width, not full bleed', () => {
    const ms = [...css.matchAll(/#work-heading \.filter-row\{[^}]*\}/g)];
    assert.ok(ms.some((m) => /display:\s*flex/.test(m[0]) && /flex-wrap:\s*nowrap/.test(m[0])), 'row must be one flex line');
    assert.ok(ms.some((m) => /gap:\s*6px/.test(m[0])), 'single line stays tight at 6px gaps');
  });
  it('mobile count line retired into buttons', () => {
    assert.ok(!/#filter-count\s*\{/.test(css), 'no counter rule may remain');
    assert.ok(!/id="filter-count"/.test(html), 'no counter element may remain');
  });
  it('filter buttons carry live counts, no separate counter line', () => {
    assert.match(main, /fcount/, 'JS buttons must embed a count span');
    assert.ok(!/filter-count/.test(main), 'counter element must go from the builder');
    const pre = fs.readFileSync(new URL('../tools/prerender.js', import.meta.url), 'utf8');
    assert.match(pre, /fcount/, 'prerender must mirror button counts');
    assert.ok(!/filter-count/.test(pre), 'prerender must drop the counter line');
    assert.match(html, /fcount/, 'static HTML must ship button counts');
    assert.ok(!/id="filter-count"/.test(html), 'static HTML must drop the counter line');
  });
  it('count span reads quiet, counter rule retired', () => {
    const rules = [...css.matchAll(/\.fcount\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(/font-size\s*:\s*11px/.test(rules), 'count span must whisper at 11px');
    assert.ok(!/#filter-count\s*\{/.test(css), 'no counter rule may remain');
  });
  it('button head and number breathe, never jam', () => {
    const rules = [...css.matchAll(/\.filter-btn\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(/column-gap\s*:\s*[4-9]px|gap\s*:\s*[4-9]px/.test(rules), 'flex gap must separate label from count');
  });
  it('mobile project cards read compact', () => {
    const ms = [...css.matchAll(/\.proj-feat h3\{[^}]*font-size:\s*(\d+)px/g)];
    assert.ok(ms.some((m) => Number.parseInt(m[1], 10) <= 20), 'a 639px override must shrink card titles');
  });
});

describe('name fits column width wall-to-wall', () => {
  it('fit measures the column box, not title text', () => {
    assert.match(main, /clientWidth/, 'fit must measure rendered column width');
  });
});

describe('phase1 copy: no restated bullets, no generic summaries', () => {
  const data = fs.readFileSync(new URL('../data.js', import.meta.url), 'utf8');
  it('MEP highlights add signal beyond the summary', () => {
    assert.ok(/Live AWS inference API/.test(data), 'MEP needs an outcome-shaped highlight');
    assert.ok(!/Open-set detection with GroundingDINO/.test(data), 'must not restate the summary');
  });
  it('Guardrails and Vuln-Detector summaries read specific', () => {
    const g = (data.match(/"Guardrails"[\s\S]*?highlights/) || [''])[0];
    const v = (data.match(/"Vuln-Detector"[\s\S]*?highlights/) || [''])[0];
    assert.ok(/CI|firewall/i.test(g), 'Guardrails must name where it runs');
    assert.ok(/baseline/i.test(v), 'Vuln-Detector must name its role');
  });
  it('contact looks forward with response time', () => {
    const contact = (html.match(/id="tile-contact"[\s\S]*?<\/section>/) || [''])[0];
    assert.ok(/replies within a day/i.test(contact), 'contact must set response expectation');
    assert.ok(!/open to relocation/i.test(contact), 'contact must not echo the hero pill a third time');
  });
  it('stack accent carries a legend, not mystery blacks', () => {
    const stack = (html.match(/id="tile-stack"[\s\S]*?<\/section>/) || [''])[0];
    assert.ok(/daily driver/i.test(stack), 'stack must explain its black chips');
    assert.match(main, /daily driver/i, 'JS builder must ship the legend');
  });
  it('filter changes announce through a hidden live status', () => {
    assert.match(main, /filter-status/, 'JS must ship a live status element');
    assert.match(main, /role.*status|status.*role/, 'status must carry its role');
    const pre = fs.readFileSync(new URL('../tools/prerender.js', import.meta.url), 'utf8');
    assert.match(pre, /filter-status/, 'prerender must mirror the status element');
    assert.match(html, /filter-status/, 'static HTML must ship the status element');
  });
  it('fixed footer never covers page content', () => {
    const m = css.match(/body\{[^}]*padding-bottom:\s*(\d+)px/);
    assert.ok(m, 'body must clear the fixed footer');
    assert.ok(Number.parseInt(m[1], 10) >= 64, 'clearance must fit footer height');
  });
  it('zero star counts never advertise', () => {
    assert.ok(/stars\s*>\s*[01]/.test(main), 'JS must gate stars on nonzero (single stars hidden)');
    const pre = fs.readFileSync(new URL('../tools/prerender.js', import.meta.url), 'utf8');
    assert.ok(/stars\s*>\s*[01]/.test(pre), 'prerender must gate stars on nonzero');
    assert.ok(!/Stars 0/.test(html), 'static HTML must show no zero counts');
    assert.ok(!/Stars 1/.test(html), 'static HTML must not advertise a single star');
  });
});
