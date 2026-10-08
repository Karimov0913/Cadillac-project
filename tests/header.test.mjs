// Регрессия закреплённой шапки и безопасных отступов при переходах по меню.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const css = fs.readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const header = css.match(/\.nav-shell\s*\{([^}]*)\}/)[1];
test('header stays above the page and uses translucent liquid glass', () => {
  assert.match(header, /position:\s*sticky/);
  assert.match(header, /top:\s*0/);
  assert.match(header, /z-index:\s*50/);
  assert.match(header, /backdrop-filter:\s*blur\(24px\)/);
  assert.match(header, /-webkit-backdrop-filter:/);
  assert.match(header, /var\(--nav-glass\)/);
});
test('anchors, story labels and local preview account for header height', () => {
  assert.match(css, /scroll-padding-top:\s*calc\(var\(--nav-height\) \+ 24px\)/);
  assert.match(css, /--nav-height:\s*76px/);
  assert.match(css, /top:\s*calc\(var\(--nav-height\) \+ 8px\)/);
});
