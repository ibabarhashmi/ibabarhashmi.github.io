import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

describe('asset cache-busting: edited assets must ship a fresh ?v=', () => {
  it('styles.css version is newer than the stale-cached 20261007a', () => {
    const m = html.match(/styles\.css\?v=([a-z0-9]+)/);
    assert.ok(m, 'versioned stylesheet link must exist');
    assert.notEqual(m[1], '20261007a', 'browsers cache by URL; unchanged ?v= serves stale CSS');
  });
  it('main.js and data.js versions match the fresh tag', () => {
    const mv = html.match(/main\.js\?v=([a-z0-9]+)/);
    const dv = html.match(/data\.js\?v=([a-z0-9]+)/);
    const sv = html.match(/styles\.css\?v=([a-z0-9]+)/);
    assert.ok(mv && dv && sv, 'all three assets versioned');
    assert.equal(mv[1], sv[1], 'single tag across assets');
    assert.equal(dv[1], sv[1], 'single tag across assets');
  });
});
