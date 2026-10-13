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

describe('button glyphs: one shared SVG family', () => {
  it('no bare text arrows inside btn-glyph spans (all sources)', () => {
    for (const [name, src] of [['index.html', html], ['main.js', main], ['prerender.js', pre]]) {
      assert.ok(!/btn-glyph"[^>]*>[↗↓]</.test(src), `${name}: btn-glyph must wrap SVG, not a text arrow`);
    }
  });
  it('every btn-glyph span opens an inline SVG (main + static shell)', () => {
    for (const [name, src] of [['index.html', html], ['main.js', main]]) {
      const total = (src.match(/btn-glyph"[^>]*>/g) || []).length;
      const withSvg = (src.match(/btn-glyph"[^>]*><svg/g) || []).length;
      assert.ok(total > 0 && total === withSvg, `${name}: ${withSvg}/${total} btn-glyph spans open SVG`);
    }
  });
  it('prerender buttons reuse the shared EXT_SVG const', () => {
    const total = (pre.match(/btn-glyph"[^>]*>/g) || []).length;
    const shared = (pre.match(/btn-glyph"[^>]*>\$\{EXT_SVG\}/g) || []).length;
    assert.ok(total > 0 && total === shared, `prerender: ${shared}/${total} btn-glyph spans use EXT_SVG`);
  });
  it('View-work scroll cue is a down SVG in the same stroke family', () => {
    assert.ok(/M12 5v14/.test(main), 'main.js must define a down-arrow path for View work');
    assert.ok((main.match(/stroke-width="1\.75"/g) || []).length >= 2, 'down arrow must share the 1.75 icon stroke');
  });
  it('button glyph SVGs scale to a uniform 14px via CSS', () => {
    assert.ok(/\.btn-glyph svg\{[^}]*14px/.test(css), 'CSS must size .btn-glyph svg uniformly');
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
