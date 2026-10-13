import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('masthead classic guards: no corner pins, no forced flex share', () => {
  it('buttons size to labels, no forced equal share', () => {
    const rules = [...css.matchAll(/#work-heading \.filter-row \.filter-btn\{[^}]*\}/g)].map((m) => m[0]);
    assert.ok(rules.length > 0, 'button rule must exist');
    assert.ok(rules.every((r) => !/(^|[;{])flex:\s*1/.test(r)), 'no equal-share flex');
  });
  it('count stays in flow, never corner-pinned', () => {
    const rules = [...css.matchAll(/#filter-count\{[^}]*\}/g)].map((m) => m[0]);
    assert.ok(rules.length > 0, 'count rule must exist');
    assert.ok(rules.every((r) => !/position:\s*absolute/.test(r)), 'count must stay in flow');
  });
});
