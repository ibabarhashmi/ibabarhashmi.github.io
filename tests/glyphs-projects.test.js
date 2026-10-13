import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const main = fs.readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const pre = fs.readFileSync(new URL('../tools/prerender.js', import.meta.url), 'utf8');

describe('glyph grammar: one external mark, down reserved for scroll', () => {
  it('no rightwards arrow anywhere (external links use ↗ / ext SVG)', () => {
    for (const [name, src] of [['index.html', html], ['main.js', main], ['prerender.js', pre]]) {
      assert.ok(!/→/.test(src), `${name} must not contain →`);
    }
  });
  it('prerender ext marker matches the JS SVG (no hydration pop)', () => {
    assert.ok(/M7 17 17 7M8 7h9v9/.test(pre), 'prerender must inline the ext SVG path');
    assert.ok(/M7 17 17 7M8 7h9v9/.test(main), 'JS ext icon path sanity');
  });
  it('down arrow reserved for the in-page View-work button', () => {
    const n = (main.match(/↓/g) || []).length;
    assert.ok(n <= 1, `↓ must appear at most once (View work), got ${n}`);
  });
});

describe('project names: one face, bold everywhere', () => {
  it('all proj h3 set Bodoni bold', () => {
    const rule = css.match(/\.proj h3\{[^}]*\}/);
    assert.ok(rule, 'missing .proj h3 rule');
    assert.ok(/font-family:\s*var\(--font-display\)/.test(rule[0]), '.proj h3 must use the display face');
    assert.ok(/font-weight:\s*700/.test(rule[0]), '.proj h3 must be bold');
  });
  it('featured keeps the 24px display size', () => {
    assert.ok(/\.proj-feat h3\{[^}]*font-size:\s*24px/.test(css), 'featured h3 stays 24px');
  });
});

describe('project tag headers read as labels, not shouts', () => {
  it('proj-tag is not bold', () => {
    const rule = css.match(/\.proj-tag\{[^}]*\}/);
    assert.ok(rule, 'missing .proj-tag rule');
    assert.ok(!/font-weight:\s*700/.test(rule[0]), 'proj-tag must not be bold');
  });
});
