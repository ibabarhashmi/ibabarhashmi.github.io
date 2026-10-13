import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('Selected-work filters: symmetric on mobile, 44px everywhere', () => {
  it('filter row is a single-line equal flex row at 639px', () => {
    assert.match(css, /max-width:\s*639px[\s\S]*?\.filter-row\{[^}]*display:\s*flex/);
    assert.match(css, /max-width:\s*639px[\s\S]*?\.filter-row\{[^}]*flex-wrap:\s*nowrap/);
  });
  it('filter buttons hit 44px min-height', () => {
    const rule = css.match(/\.filter-btn\{[^}]*\}/);
    assert.ok(rule && /min-height:\s*44px/.test(rule[0]), 'buttons must match the 44px system');
  });
  it('counts read on the buttons, no separate line', () => {
    const rules = [...css.matchAll(/\.fcount\{[^}]*\}/g)].map((m) => m[0]);
    assert.ok(rules.some((r) => /font-size:\s*11px/.test(r)), 'button counts whisper at 11px');
    assert.ok(!/#filter-count\s*\{/.test(css), 'counter rule retired everywhere');
  });
  it('work heading breathing room shrinks on mobile', () => {
    const ms = [...css.matchAll(/max-width:\s*639px[\s\S]*?#work-heading\{[^}]*padding:\s*(\d+)px/g)];
    assert.ok(ms.length > 0, 'mobile band must tighten padding');
    assert.ok(ms.some((m) => Number.parseInt(m[1], 10) <= 16), 'band padding must shrink to fit title plus row');
  });
});

describe('vibe tile: truly centered, proportioned', () => {
  it('tile centers content on both axes (grid stretch safe)', () => {
    const rule = css.match(/#tile-vibe\{[^}]*\}/);
    assert.ok(rule && /display:\s*flex/.test(rule[0]), 'flex centers against row stretch');
    assert.ok(/align-items:\s*center/.test(rule[0]), 'vertical center required');
    assert.ok(/justify-content:\s*center/.test(rule[0]), 'horizontal center required');
  });
  it('vibe line scales down on phones', () => {
    assert.match(css, /vibe-text\{[^}]*clamp\(24px,\s*7vw,\s*32px\)/);
  });
});

describe('masthead: centered symmetric band', () => {
  const stripMedia = (src) => {
    let out = '';
    let i = 0;
    while (i < src.length) {
      const at = src.indexOf('@media', i);
      if (at === -1) { out += src.slice(i); break; }
      out += src.slice(i, at);
      const open = src.indexOf('{', at);
      if (open === -1) break;
      let depth = 1;
      let j = open + 1;
      while (j < src.length && depth > 0) {
        if (src[j] === '{') depth += 1;
        else if (src[j] === '}') depth -= 1;
        j += 1;
      }
      i = j;
    }
    return out;
  };
  const base = stripMedia(css);
  const media639 = (() => {
    const bodies = [];
    let i = 0;
    while (i < css.length) {
      const at = css.indexOf('@media', i);
      if (at === -1) break;
      const open = css.indexOf('{', at);
      if (open === -1) break;
      const header = css.slice(at, open);
      let depth = 1;
      let j = open + 1;
      while (j < css.length && depth > 0) {
        if (css[j] === '{') depth += 1;
        else if (css[j] === '}') depth -= 1;
        j += 1;
      }
      if (/max-width:\s*639px/.test(header)) bodies.push(css.slice(open + 1, j - 1));
      i = j;
    }
    return bodies.join('\n');
  })();

  it('band left-aligns like live (no center axis on desktop)', () => {
    const rules = [...base.matchAll(/#work-heading\s*\{[^}]*\}/g)].map((m) => m[0]);
    assert.ok(rules.length > 0, 'missing base #work-heading rule');
    const h = rules.join(' ');
    assert.ok(!/text-align:\s*center/.test(h), 'desktop band must not center text');
    assert.ok(!/align-items:\s*center/.test(h), 'desktop band must not cross-center');
    assert.ok(!/justify-content:\s*center/.test(h), 'desktop band must not main-center');
    assert.ok(!/display:\s*flex/.test(h), 'desktop band must not be flex like the centered experiment');
  });

  it('button row is a natural flex row under the title', () => {
    const rows = [...base.matchAll(/\.filter-row\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(rows.length > 0, 'missing base .filter-row rule');
    assert.ok(/display:\s*flex/.test(rows), 'desktop row must be flex like live');
    assert.ok(/flex-wrap:\s*wrap/.test(rows), 'desktop row must wrap like live');
    assert.ok(!/display\s*:\s*grid/.test(rows), 'desktop row must not be grid');
    const mt = rows.match(/margin-top\s*:\s*(\d+)px/);
    assert.ok(mt && Number.parseInt(mt[1], 10) >= 12, 'desktop row needs breathing room below the loud title');
  });

  it('four buttons size to content, uncapped', () => {
    const btns = [...base.matchAll(/\.filter-btn\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(btns.length > 0, 'missing base .filter-btn rule');
    assert.ok(/padding:\s*8px 16px/.test(btns), 'desktop buttons keep live padding');
    assert.ok(!/width\s*:\s*100%/.test(btns), 'desktop buttons must not stretch full width');
    assert.ok(!/width\s*:\s*\d+px/.test(btns), 'buttons must not use fixed px width');
  });

  it('no counter element on any viewport', () => {
    const baseCounts = [...base.matchAll(/#filter-count\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.equal(baseCounts, '', 'desktop carries no counter rule');
    assert.ok(!/#filter-count\s*\{/.test(css), 'mobile carries no counter rule either');
  });

  it('buttons keep 44px targets', () => {
    const btns = [...base.matchAll(/\.filter-btn\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(
      /min-height\s*:\s*44px/.test(btns) || /min-block-size\s*:\s*44px/.test(btns) || /height\s*:\s*44px/.test(btns),
      'buttons must keep 44px targets',
    );
  });

  it('mobile 639px keeps a single centered line with count in flow', () => {
    assert.ok(media639.length > 0, 'missing 639px media block');
    const mediaRows = [...media639.matchAll(/\.filter-row\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    const mediaBtns = [...media639.matchAll(/\.filter-btn\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    const mediaCounts = [...media639.matchAll(/#filter-count\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(/display\s*:\s*flex/.test(mediaRows), 'mobile row must be flex');
    assert.ok(/flex-wrap\s*:\s*nowrap/.test(mediaRows), 'mobile row must never stack');
    assert.ok(/flex\s*:\s*1(\s+1\s+0)?\b/.test(mediaBtns), 'mobile buttons split one line equally');
    const counts = [...css.matchAll(/#filter-count\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(!/position\s*:\s*(absolute|fixed|sticky)/.test(counts + mediaCounts), 'mobile count must stay in flow');
  });
});
