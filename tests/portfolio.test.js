import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const main = fs.readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const data = fs.readFileSync(new URL('../data.js', import.meta.url), 'utf8');

describe('A: prerender + skeletons (no blank shell)', () => {
  it('index.html ships prerendered H1, not empty tile-profile', () => {
    assert.match(html, /<h1[^>]*>.*Babar Hashmi/s);
    assert.ok(!/<section class="tile span-4" id="tile-profile"[^>]*><\/section>/.test(html),
      'tile-profile must not ship empty');
  });
  it('impact stats prerendered in HTML', () => {
    assert.match(html, /\+25%/);
    assert.match(html, /100K\+/);
  });
  it('work heading + projects prerendered with filter buttons', () => {
    assert.match(html, /Selected work/);
    assert.match(html, /filter-btn/);
    assert.match(html, /Financial Strategy Risk Scoring Engine/);
  });
  it('no opacity-0 gate that hides prerendered tiles', () => {
    assert.ok(!/\.js \.tile:not\(\.in\)\{opacity:0\}/.test(css),
      'must not hide tiles with opacity:0 before JS');
  });
});

describe('B: mobile stack + ticker pause', () => {
  it('ticker pauses on hover/focus', () => {
    assert.match(css, /animation-play-state\s*:\s*paused/);
  });
  it('ticker disabled under reduced-motion', () => {
    assert.match(css, /prefers-reduced-motion\s*:\s*reduce[\s\S]*?ticker-inner[\s\S]*?animation\s*:\s*none/);
  });
  it('639px breakpoint stacks span-2 full width', () => {
    assert.match(css, /max-width\s*:\s*639px[\s\S]*?\.span-2\{grid-column:1\/-1/);
  });
});

describe('C: proof + filters', () => {
  it('impact methodology note exists (no naked numbers)', () => {
    assert.ok(/methodology|measured on|eval:/i.test(html) || /methodology|measured on|eval:/i.test(data),
      'impact needs methodology/eval context');
  });
  it('no fabricated testimonials shipped as fact', () => {
    assert.ok(!/testimonial.*John Doe|Jane Doe|CEO, Example/i.test(html + data),
      'must not ship placeholder testimonials');
  });
  it('filter buttons announce live counts', () => {
    assert.ok(/fcount/.test(html), 'buttons must ship count spans');
    assert.ok(!/id="filter-count"/.test(html), 'no separate counter line');
  });
  it('filter buttons support arrow-key navigation', () => {
    assert.match(main, /ArrowRight|ArrowLeft/);
  });
});
