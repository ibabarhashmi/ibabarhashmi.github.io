# 01-PLAN.md — Revised monochrome + flatten nesting

Goal-backward: page reads one icon language, one accent, no card-in-card, no voids.

## Wave 1 — icons (touches `main.js`, `styles.css:162-168`, `assets/icons/`)

### 01-01: monochrome brand icons inline
- File: `main.js:351-382`
- Replace `brandLink(img src)` with inline SVG strings using real Simple Icons paths for LinkedIn/GitHub/Telegram (single-color `fill=currentColor`, 24x24, `aria-hidden=true`).
- Keep mail button Phosphor-style 1.75 stroke. Keep `aria-label`/`title`. Keep toast copy.
- Add X slot hidden when `SITE.links.x==null` (`data.js:20`).
- Delete `assets/icons/github-light.svg`, `github-dark.svg`, `linkedin.svg`, `telegram.svg`. Remove `only-light/only-dark` swap logic + CSS `styles.css:166-168`.
- Verify: `grep -r "0A66C2\|26A5E4\|only-dark\|assets/icons" main.js styles.css` empty. Light/dark render same glyph, `color:var(--text-2)`, hover `var(--text)`.
- Commit: `feat(01-01): monochrome single-color social icons`

### 01-02: icon affordance + grouping
- File: `styles.css:162-164`
- `.icon-row{gap:8px}` (was 4px). `.icon-link{border:1px solid var(--border);background:var(--surface)}` hover `translateY(-2px)+shadow-hover+border-strong`. Focus-visible intact. Active `scale(.98)`.
- Add `Elsewhere` micro-label above row OR keep row bare (eyebrow budget: now 2, max 4). No brand tint on hover.
- Verify: 44px targets, no wrap, keyboard tab shows ring, no `—`.
- Commit: `feat(01-02): icon targets affordance`

## Wave 2 — nesting + grids (touches `styles.css:107,197-216`)

### 01-03: flatten Experience nesting
- File: `styles.css:197-201`, `main.js:244-262`
- `.tl-item`: drop card look (no inner `background/border-radius/padding/shadow`). Use `border-top` dividers + `padding:14px 0`. Keep `position:sticky;top:76px` + surface bg for stack overlap. Add `box-shadow` only via `[data-stuck]` or keep subtle `stack-in` scale `.98->1`.
- Keep `prefers-reduced-motion` static. No layout props animated.
- Verify: no card-in-card visually, sticky pins under `topbar 64px`, mobile single col ok.
- Commit: `fix(01-03): flatten experience nesting`

### 01-04: impact orphan + project voids
- File: `styles.css:107-109,212-215`
- `.stats`: `repeat(auto-fit,minmax(140px,1fr))` for 5 stats. Keep count-up intact.
- `.proj`: drop `min-height:340px`, drop `.checks{min-height:60px}`. Keep `.chips{margin-top:auto}` baseline.
- Verify: 1080/768/390px no orphan cell, no large void on GoldenHour/Guardrails.
- Commit: `fix(01-04): density orphan void`

## Wave 3 — cleanup + verify

### 01-05: dead code + reveal default
- `index.html:36` + `styles.css:181`: remove `<canvas id="net">` + CSS (dormant, no loop).
- `styles.css:67`: default `.tile` visible; gate `opacity:0/translateY` behind `.js` + IO only when motion allowed. Headless/JS-off still shows content.
- Verify: disable IO (DevTools block) → tiles visible. `grep -r "#net" index.html styles.css main.js` empty.
- Commit: `chore(01-05): drop dormant canvas, safe reveal`

### 01-06: verification gate
- `grep -ri "—\|–" index.html main.js data.js` empty.
- `python3 -m http.server` + check light/dark, 390px, keyboard, `prefers-reduced-motion`.
- Lighthouse: LCP<2.5, CLS<0.1. Contrast AA on contact tile.
- Commit: `docs(01-06): verification log` or append to `XX-VERIFICATION.md`.

Out of scope: font swap, accent change, IA/slug/nav changes, new imagery, X account creation.
