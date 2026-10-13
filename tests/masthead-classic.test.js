import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('masthead classic guards: no corner pins, no forced flex share', () => {
  it('desktop buttons size to labels, no forced equal share', () => {
    const base = css.replace(/@media[^{]*\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/g, '');
    const rules = [...base.matchAll(/#work-heading \.filter-row \.filter-btn\{[^}]*\}/g)].map((m) => m[0]);
    assert.ok(rules.length > 0, 'desktop button rule must exist');
    assert.ok(rules.every((r) => !/(^|[;{])flex:\s*1/.test(r)), 'desktop keeps content-sized buttons; equal share is mobile-only');
  });
  it('no counter line ships anywhere', () => {
    const rules = [...css.matchAll(/#filter-count\{[^}]*\}/g)].map((m) => m[0]);
    assert.equal(rules.length, 0, 'counter retired: counts live in buttons');
  });
});
