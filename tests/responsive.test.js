import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const main = fs.readFileSync(new URL('../main.js', import.meta.url), 'utf8');

describe('ticker survives every viewport', () => {
  it('JS doubles strip until it covers 2x viewport (no ultrawide gap)', () => {
    assert.match(main, /ticker-inner/);
    assert.match(main, /scrollWidth/);
    assert.match(main, /innerWidth/);
  });
  it('ticker pauses when scrolled offscreen', () => {
    assert.match(main, /IntersectionObserver/);
    assert.match(main, /animationPlayState/);
  });
});

describe('small phones 360-639px', () => {
  it('mobile stamp scales with viewport width to span the band', () => {
    assert.match(css, /\.work-title\{[^}]*18vw/);
  });
  it('mobile filter grid spans full band width, no inset cap', () => {
    const rules = [...css.matchAll(/#work-heading \.filter-row\{[^}]*grid-template-columns:\s*1fr 1fr[^}]*\}/g)].map((m) => m[0]);
    assert.ok(rules.length > 0, 'mobile 2-col grid must exist');
    assert.ok(rules.every((r) => /width:\s*100%/.test(r)), 'grid spans full width');
    assert.ok(rules.every((r) => !/max-width/.test(r)), 'no inset cap');
  });
  it('hero and contact buttons sit side-by-side, equal halves', () => {
    assert.match(css, /max-width:\s*639px[\s\S]*?\.actions\{[^}]*flex-wrap:\s*nowrap/);
    assert.match(css, /max-width:\s*639px[\s\S]*?\.actions \.btn\{[^}]*flex:\s*1 1 0/);
  });
  it('side-by-side buttons keep labels on one fitting line', () => {
    assert.match(css, /max-width:\s*639px[\s\S]*?\.actions \.btn\{[^}]*font-size:\s*13px/);
  });
  it('availability clocks stack vertically, not side-by-side', () => {
    assert.match(css, /max-width:\s*639px[\s\S]*?avail-rows\{[^}]*flex-direction:\s*column/);
  });
  it('timezone select is 16px (no iOS auto-zoom)', () => {
    const rule = css.match(/\.avail-select\{[^}]*\}/);
    assert.ok(rule && /font-size:\s*16px/.test(rule[0]), 'select must be 16px');
  });
  it('ticker slims down to protect viewport height', () => {
    assert.match(css, /max-width:\s*639px[\s\S]*?\.ticker-inner\{[^}]*font-size:\s*11px/);
  });
});

describe('mobile hero: avatar row, bio below', () => {
  const blocks639 = (() => {
    const out = [];
    const re = /@media[^{]*max-width:\s*639px[^{]*\{/g;
    let m;
    while ((m = re.exec(css)) !== null) {
      let depth = 1;
      let i = m.index + m[0].length;
      while (i < css.length && depth > 0) {
        if (css[i] === '{') depth += 1;
        else if (css[i] === '}') depth -= 1;
        i += 1;
      }
      out.push(css.slice(m.index + m[0].length, i - 1));
    }
    return out;
  })();
  const mobile = blocks639.join('\n');
  const rulesOf = (sel) =>
    [...mobile.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter((r) => sel.test(r[1]));
  const heroRules = rulesOf(/profile|hero-grid|hero-avail|avatar|#h-name|name-btn/);

  it('avatar shares a row with the name block (grid re-parents or wrappers dissolve)', () => {
    const twoCol = heroRules.some((r) => {
      const v = r[2].match(/grid-template-columns\s*:\s*([^;]+);?/);
      if (!v) return false;
      const tracks = v[1].trim();
      return /repeat\s*\(/.test(tracks) || tracks.split(/\s+/).filter(Boolean).length >= 2;
    });
    const dissolved = heroRules.some((r) => /display\s*:\s*contents/.test(r[2]));
    const rowFlex = heroRules.some(
      (r) => /profile|hero-grid/.test(r[1]) && /flex-direction\s*:\s*row/.test(r[2]),
    );
    assert.ok(twoCol || dissolved || rowFlex, '639px block must place avatar beside the name block');
  });
  it('bio spans full width below the avatar row', () => {
    const bio = rulesOf(/(^|[^\w-])\.bio\b/);
    assert.ok(bio.length > 0, '639px block must restyle .bio');
    assert.ok(
      bio.some(
        (r) =>
          /grid-column\s*:\s*1\s*\/\s*(-1|span\s*2|3)/.test(r[2]) || /width\s*:\s*100%/.test(r[2]),
      ),
      '.bio must span full width in the 639px block',
    );
  });
  it('actions span full width below the avatar row', () => {
    const acts = rulesOf(/\.actions/)
      .filter((r) => r[1].split(',').some((s) => /\.actions\s*(::?[a-z-]+|\[[^\]]*\])?\s*$/.test(s.trim())));
    assert.ok(acts.length > 0, '639px block must restyle .actions itself');
    assert.ok(
      acts.some(
        (r) =>
          /grid-column\s*:\s*1\s*\/\s*(-1|span\s*2|3)/.test(r[2]) || /width\s*:\s*100%/.test(r[2]),
      ),
      '.actions must span full width in the 639px block',
    );
  });
  it('name uses a fluid vw-based size capped small', () => {
    const names = rulesOf(/h1\b|h-name|name-btn|(\.profile[^{}]*\.title)/);
    const fluids = [];
    for (const r of names) {
      const f = r[2].match(/font-size\s*:\s*(?:clamp|min)\(([^;()]*(?:\([^;()]*\)[^;()]*)*)\)/);
      if (f && /vw/.test(f[1])) fluids.push(f[1]);
    }
    assert.ok(fluids.length > 0, 'name must use a vw-based fluid size in the 639px block');
    for (const f of fluids) {
      const cap = f.split(',').pop();
      const rem = cap.match(/([\d.]+)\s*rem/);
      assert.ok(rem && Number(rem[1]) <= 3.5, `fluid name cap must be a small rem value, got: ${cap.trim()}`);
    }
  });
  it('all mobile hero overrides live in the 639px block', () => {
    assert.ok(blocks639.length > 0, '639px media block must exist');
    const avatarRow = heroRules.some((r) => {
      const v = r[2].match(/grid-template-columns\s*:\s*([^;]+);?/);
      const twoCol = v && (/repeat\s*\(/.test(v[1]) || v[1].trim().split(/\s+/).filter(Boolean).length >= 2);
      return (
        twoCol ||
        /display\s*:\s*contents/.test(r[2]) ||
        (/profile|hero-grid/.test(r[1]) && /flex-direction\s*:\s*row/.test(r[2]))
      );
    });
    const fullWidth = rulesOf(/(^|[^\w-])\.(bio|actions)\b/).some((r) =>
      /grid-column\s*:\s*1\s*\/\s*(-1|span\s*2|3)/.test(r[2]),
    );
    const fluidName = rulesOf(/h1\b|h-name|name-btn/).some((r) =>
      /font-size\s*:\s*(?:clamp|min)\([^;]*vw[^;]*\)/.test(r[2]),
    );
    assert.ok(
      avatarRow && fullWidth && fluidName,
      '639px block must carry the avatar-row, full-width, and fluid-name overrides together',
    );
  });
});

describe('mobile hero: e2e name tier', () => {
  const css639 = (() => {
    const out = [];
    const re = /@media[^{]*max-width:\s*639px[^{]*\{/g;
    let m;
    while ((m = re.exec(css)) !== null) {
      let depth = 1;
      let i = m.index + m[0].length;
      while (i < css.length && depth > 0) {
        if (css[i] === '{') depth += 1;
        else if (css[i] === '}') depth -= 1;
        i += 1;
      }
      out.push(css.slice(m.index + m[0].length, i - 1));
    }
    return out.join('\n');
  })();
  const tier = [...css639.matchAll(/([^{}]+)\{([^{}]*)\}/g)];

  it('hero-grid becomes the two-column stage', () => {
    const hg = tier.filter((r) => /(^|[^\w-])\.hero-grid\b/.test(r[1]));
    assert.ok(hg.length > 0, '639px block must restyle .hero-grid');
    assert.ok(
      hg.some((r) => {
        const v = r[2].match(/grid-template-columns\s*:\s*([^;]+);?/);
        return v && v[1].trim().split(/\s+/).filter(Boolean).length >= 2;
      }),
      '.hero-grid must carry two tracks in the 639px block (avatar owns this grid, not .profile-statement)',
    );
  });
  it('statement wrapper dissolves so text joins the hero grid', () => {
    const ps = tier.filter((r) => /\.profile-statement\b/.test(r[1]));
    assert.ok(ps.length > 0, '639px block must restyle .profile-statement');
    assert.ok(
      ps.some((r) => /display\s*:\s*contents/.test(r[2])),
      '.profile-statement must dissolve so name/title/pills become hero-grid items beside the avatar',
    );
  });
  it('availability panel spans full width below the stack', () => {
    const ap = tier.filter((r) => /\.hero-avail\b/.test(r[1]));
    const full = ap.filter((r) => /grid-column\s*:\s*1\s*\/\s*(-1|span\s*2|3)/.test(r[2]));
    assert.ok(full.length > 0, '.hero-avail must span full width or it docks beside the title');
  });
  it('CSS grid assumptions match the JS-built DOM', () => {
    assert.match(main, /grid\.append\(\s*img/, 'avatar must be a direct hero-grid child in main.js');
    assert.match(main, /wrap\.append\(\s*main\)/, 'profile-main must hang under profile-statement in main.js');
    const hg = tier.filter((r) => /(^|[^\w-])\.hero-grid\b/.test(r[1]));
    assert.ok(
      hg.some((r) => /grid-template-columns\s*:\s*auto/.test(r[2])),
      'hero-grid tracks must start with the avatar column',
    );
  });
  it('name width is measured-fit to the title text, not breakpoint-guessed', () => {
    assert.match(main, /fitNameToTitle/, 'main.js must fit the name to measured title width');
    assert.match(main, /1023/, 'fit must scope to tablet-and-below');
    assert.ok(
      /createRange|getBoundingClientRect/.test(main),
      'fit must measure rendered text width',
    );
    assert.ok(
      /addEventListener\(\s*["']resize["']/.test(main) || /ResizeObserver/.test(main),
      'fit must re-run on size changes',
    );
  });
  it('avatar anchors tall left, matching the stack height', () => {
    const av = tier.filter((r) => /(^|[^\w-])\.avatar\b/.test(r[1]));
    assert.ok(av.length > 0, '639px block must place .avatar explicitly');
    assert.ok(
      av.some((r) => /grid-row\s*:\s*1\s*\/\s*span\s*3|grid-row\s*:\s*1\s*\/\s*4/.test(r[2])),
      '.avatar must span the name, title and pill rows',
    );
    assert.ok(
      av.some((r) => /width\s*:\s*13[02]px/.test(r[2])),
      '.avatar must size to the right-block height (130-132px)',
    );
  });
  it('name and title stack in column 2, rows 1-2', () => {
    const cell = (re) => tier.filter((r) => re.test(r[1]));
    const h1 = cell(/(^|[^\w-])h1\b|h-name|name-btn/);
    const t = cell(/\.title\b/);
    assert.ok(h1.length > 0 && t.length > 0, '639px block must place name and title');
    for (const [rules, name] of [[h1, 'name'], [t, 'title']]) {
      assert.ok(
        rules.some((r) => /grid-column\s*:\s*2\b/.test(r[2])),
        `${name} must sit in column 2 beside the avatar`,
      );
    }
    assert.ok(h1.some((r) => /grid-row\s*:\s*1\b/.test(r[2])), 'name must sit row 1');
    assert.ok(t.some((r) => /grid-row\s*:\s*2\b/.test(r[2])), 'title must sit row 2');
  });
  it('pills share column 2 row 3 in equal containers', () => {
    assert.match(main, /pill-row/, 'main.js must wrap badge and location in a pill row');
    assert.match(main, /append\(badge,\s*meta\)/, 'pill row must hold availability then location');
    const rows = tier.filter((r) => /(^|[},])\s*\.pill-row\b/.test(r[1]));
    assert.ok(rows.length > 0, '639px block must style .pill-row');
    assert.ok(
      rows.some((r) => /grid-column\s*:\s*2\b/.test(r[2])),
      '.pill-row must sit inside column 2 beside the avatar',
    );
    assert.ok(
      rows.some((r) => /grid-row\s*:\s*3\b/.test(r[2]) && /display\s*:\s*flex/.test(r[2])),
      '.pill-row must sit row 3 as a flex row',
    );
    const kids = tier.filter((r) => /\.pill-row\b[^,{]*\.(badge|meta-row)/.test(r[1]));
    assert.ok(kids.length > 0, '639px block must size both pills');
    assert.ok(
      kids.every((r) => /flex\s*:\s*1(\s+1\s+0)?\b/.test(r[2])),
      'both pills must take equal halves',
    );
    const bio = tier.filter((r) => /(^|[^\w-])\.bio\b/.test(r[1]));
    assert.ok(bio.some((r) => /grid-row\s*:\s*4\b/.test(r[2])), 'bio must follow the pill row at row 4');
    const acts = tier.filter((r) => /\.actions\s*(::?[a-z-]+|\[[^\]]*\])?\s*$/.test(r[1].split(',').pop().trim()));
    assert.ok(acts.some((r) => /grid-row\s*:\s*5\b/.test(r[2])), 'actions must follow bio at row 5');
  });
  it('stack aligns left', () => {
    const h1 = tier.filter((r) => /(^|[^\w-])h1\b/.test(r[1]) || /h-name|name-btn/.test(r[1]));
    const t = tier.filter((r) => /\.title\b/.test(r[1]));
    for (const [rules, name] of [[h1, 'name'], [t, 'title']]) {
      assert.ok(
        rules.some((r) => /text-align\s*:\s*left/.test(r[2])),
        `${name} must left-align with the avatar edge`,
      );
    }
  });
  it('name fills the space right of avatar to the corner', () => {
    const h1 = tier.filter((r) => /(^|[^\w-])h1\b/.test(r[1]) || /h-name|name-btn/.test(r[1]));
    assert.ok(h1.length > 0, '639px block must restyle the name');
    assert.ok(
      h1.some((r) => /grid-column\s*:\s*2\b/.test(r[2])),
      'name must sit in column 2 beside the avatar, stretching to the corner',
    );
    assert.ok(
      h1.some((r) => /font-size\s*:\s*(?:clamp|min)\([^;]*vw[^;]*\)/.test(r[2])),
      'name must stay viewport-fluid in the 639px block',
    );
    assert.ok(
      h1.some((r) => /font-size\s*:[^;]*calc\([^;]*vw[^;]*px[^;]*\)/.test(r[2])),
      'name width must track the column via vw-minus-gutter calc, not bare vw',
    );
    assert.ok(
      h1.some((r) => /min-width\s*:\s*0|max-width\s*:\s*100%|overflow\s*:\s*hidden/.test(r[2])),
      'nowrap name must carry an overflow guard so column 2 never blows out at 360px',
    );
  });
  it('location pill takes the second equal half', () => {
    const sub = tier.filter((r) => /\.pill-row\b[^,{]*\.meta-row/.test(r[1]));
    assert.ok(sub.length > 0, '639px block must style the location pill inside .pill-row');
    assert.ok(
      sub.every((r) => /flex\s*:\s*1(\s+1\s+0)?\b/.test(r[2])),
      'location pill must take an equal half',
    );
  });
  it('bio opens with the mockup divider', () => {
    const bio = tier.filter((r) => /(^|[^\w-])\.bio\b/.test(r[1]));
    assert.ok(bio.length > 0, '639px block must restyle .bio');
    assert.ok(
      bio.some((r) => /border-top\s*:/.test(r[2])),
      '.bio must carry the hairline divider below the header stack',
    );
  });
});
