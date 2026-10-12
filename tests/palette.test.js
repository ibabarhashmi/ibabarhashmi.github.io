import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('palette rows: label left, meta right', () => {
  it('rows use flex with gap', () => {
    const rule = css.match(/#palette-results li\{[^}]*\}/);
    assert.ok(rule && /display\s*:\s*flex/.test(rule[0]), 'row must be flex');
    assert.ok(/gap\s*:\s*\d+px/.test(rule[0]), 'row needs breathing gap');
  });
  it('meta pushes right and truncates instead of jamming', () => {
    const rule = css.match(/#palette-results li \.palette-meta\{[^}]*\}/);
    assert.ok(rule && /margin-left\s*:\s*auto/.test(rule[0]), 'meta must sit right');
    assert.ok(/text-overflow\s*:\s*ellipsis/.test(rule[0]), 'meta must truncate, not wrap');
  });
  it('selected row keeps meta readable on ink', () => {
    assert.match(css, /aria-selected[^\{]*\.palette-meta\{[^}]*color/);
  });
});
