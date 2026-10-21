// 說明檢查（check-docs.mjs）的測試。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDocs } from './check-docs.mjs';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), '__fixtures__', 'check-docs');

test('屬性、事件、v-model 都跟元件一致 → 通過', async () => {
  const { checked, failures } = await checkDocs(path.join(fixtures, 'ok'));
  assert.equal(checked, 1);
  assert.deepEqual(failures, []);
});

test('說明檔漏了事件、多了元件沒有的屬性、放了規格欄位 → 失敗並逐項指出', async () => {
  const { failures } = await checkDocs(path.join(fixtures, 'mismatch'));
  const text = failures.join('\n');
  assert.match(text, /漏了 @btn-click/);
  assert.match(text, /多了元件沒有的 foo/);
  assert.match(text, /when 屬於本體的元件規格/);
});

test('元件旁邊沒有說明檔 → 失敗', async () => {
  const { failures } = await checkDocs(path.join(fixtures, 'nodoc'));
  assert.equal(failures.length, 1);
  assert.match(failures[0], /DsThing\.vue/);
});

test('一個元件都沒有 → 失敗', async () => {
  const { checked, failures } = await checkDocs(path.join(fixtures, 'empty'));
  assert.equal(checked, 0);
  assert.equal(failures.length, 1);
});
