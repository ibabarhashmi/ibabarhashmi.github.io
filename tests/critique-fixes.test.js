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
