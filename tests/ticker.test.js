import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

describe('ticker loop reads as one continuous leftward loop', () => {
  it('keyframes run left-to-right from mid-strip to head, travelling one half', () => {
    const kf = css.match(/@keyframes marquee\{([\s\S]*?)\n\}/);
    assert.ok(kf, 'marquee keyframes must exist');
    assert.match(kf[1], /from\{transform:translateX\(-50%\)/, 'loop starts pre-shifted so head content fills frame one');
    assert.match(kf[1], /to\{transform:translateX\(0/, 'loop drifts right, travelling exactly one half');
  });
  it('strip content is an even count of identical units so -50% aligns', () => {
    const inner = (html.match(/ticker-inner">([\s\S]*?)<\/div>/) || [])[1] || '';
    const units = inner.split('·').map((s) => s.trim()).filter(Boolean);
    assert.ok(units.length >= 2 && units.length % 2 === 0, `even unit count, got ${units.length}`);
    const first = units.slice(0, units.length / 2).join('|');
    const second = units.slice(units.length / 2).join('|');
    assert.equal(first, second, 'halves must be identical for a gapless wrap');
  });
});
