import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('Selected-work filters: symmetric on mobile, 44px everywhere', () => {
  it('filter row is a 2x2 equal grid at 639px (no orphan wrap)', () => {
    assert.match(css, /max-width:\s*639px[\s\S]*?\.filter-row\{[^}]*grid-template-columns:\s*1fr 1fr/);
  });
  it('filter buttons hit 44px min-height', () => {
    const rule = css.match(/\.filter-btn\{[^}]*\}/);
    assert.ok(rule && /min-height:\s*44px/.test(rule[0]), 'buttons must match the 44px system');
  });
  it('result count reads on the ink band (no borrowed gray)', () => {
    const rules = [...css.matchAll(/#filter-count\{[^}]*\}/g)].map((m) => m[0]);
    assert.ok(rules.some((r) => /color:\s*var\(--paper\)/.test(r)), 'count must be paper, not repo-meta gray');
  });
  it('work heading breathing room shrinks on mobile', () => {
    assert.match(css, /max-width:\s*639px[\s\S]*?#work-heading\{[^}]*padding:\s*16px/);
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
  });

  it('four buttons size to content, uncapped', () => {
    const btns = [...base.matchAll(/\.filter-btn\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(btns.length > 0, 'missing base .filter-btn rule');
    assert.ok(/padding:\s*8px 16px/.test(btns), 'desktop buttons keep live padding');
    assert.ok(!/width\s*:\s*100%/.test(btns), 'desktop buttons must not stretch full width');
    assert.ok(!/width\s*:\s*\d+px/.test(btns), 'buttons must not use fixed px width');
  });

  it('count lives only in the 639px override, plain flow on desktop', () => {
    const baseCounts = [...base.matchAll(/#filter-count\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.equal(baseCounts, '', 'desktop must carry no count rule, like live');
    const counts = [...css.matchAll(/#filter-count\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(counts.length > 0, 'missing #filter-count rule');
    assert.ok(!/position\s*:\s*(absolute|fixed|sticky)/.test(counts), 'count must stay in normal flow');
    assert.ok(/color\s*:\s*var\(--paper\)/.test(counts), 'count must stay dim paper');
  });

  it('buttons keep 44px targets', () => {
    const btns = [...base.matchAll(/\.filter-btn\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(
      /min-height\s*:\s*44px/.test(btns) || /min-block-size\s*:\s*44px/.test(btns) || /height\s*:\s*44px/.test(btns),
      'buttons must keep 44px targets',
    );
  });

  it('mobile 639px keeps centered 2x2 equal grid with count in flow', () => {
    assert.ok(media639.length > 0, 'missing 639px media block');
    const baseHeads = [...base.matchAll(/#work-heading\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    const mediaHeads = [...media639.matchAll(/#work-heading\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    const mediaRows = [...media639.matchAll(/\.filter-row\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    const mediaCounts = [...media639.matchAll(/#filter-count\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    const rows = mediaRows;
    assert.ok(/display\s*:\s*grid/.test(rows), 'mobile row must stay grid');
    const grid2 =
      /grid-template-columns\s*:\s*repeat\(\s*2\s*,[^)]*1fr[^)]*\)/.test(rows) ||
      /grid-template-columns\s*:\s*1fr\s+1fr/.test(rows);
    assert.ok(grid2, 'mobile must keep 2x2 equal grid');
    const centered =
      /justify-content\s*:\s*center/.test(rows) ||
      /justify-items\s*:\s*center/.test(rows) ||
      /place-items\s*:\s*center/.test(rows) ||
      /margin(-inline)?\s*:\s*[^;}]*auto/.test(rows) ||
      /text-align\s*:\s*center/.test(mediaRows + mediaHeads + mediaCounts) ||
      /text-align\s*:\s*center/.test(baseHeads) ||
      /align-items\s*:\s*center/.test(baseHeads) ||
      /justify-content\s*:\s*center/.test(mediaHeads);
    assert.ok(centered, 'mobile grid must stay centered');
    const counts = [...css.matchAll(/#filter-count\s*\{[^}]*\}/g)].map((m) => m[0]).join(' ');
    assert.ok(!/position\s*:\s*(absolute|fixed|sticky)/.test(counts + mediaCounts), 'mobile count must stay in flow');
  });
});
