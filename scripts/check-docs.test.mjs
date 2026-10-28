// 說明檢查（check-docs.mjs）的測試。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDocs, checkSnippets } from './check-docs.mjs';

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

test('說明檔放了規格第 2 版欄位（部位、狀態、無障礙、可以／不要這樣做）→ 失敗並逐項指出', async () => {
  const { failures } = await checkDocs(path.join(fixtures, 'spec-v2-in-docs'));
  assert.equal(failures.length, 1, failures.join('\n'));
  assert.match(failures[0], /thing\.docs\.ts：說明檔只放 Vue 用法；anatomy、states、a11y、dos、donts 屬於本體的元件規格/);
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

// ── Vue 專屬注意事項（usageNotes） ─────────────────────────

test('usageNotes 格式不對 → 失敗，指出第幾筆', async () => {
  const { failures } = await checkDocs(path.join(fixtures, 'usage-notes-bad'));
  assert.equal(failures.length, 1, failures.join('\n'));
  assert.match(failures[0], /thing\.docs\.ts：usageNotes 第 1、2 筆格式不對/);
});

// ── 指南範例的 Vue 程式碼（本體的 check:guides 呼叫） ─────────────

const snippets = (code) => checkSnippets(path.join(fixtures, 'snippets'), [{ where: '指南 a.md 第 1 段', code }]);

test('指南範例用的元件、屬性、事件都存在 → 通過', () => {
  const code = `<DsThing text="嗨" :auto-close="true" :autoClose="x" v-model="checked" v-model:open="isOpen"
    @btn-click="go" @btnClick="go" @click.stop="b" v-on:btn-click="go" v-bind:text="t"
    class="a" :class="{ on }" style="x" key="1" ref="r" aria-label="x" data-id="1" v-if="ok" v-for="i in list" #default="{ item }" ... />
  <ds-thing text="kebab 標籤" @update:open="set"></ds-thing>
  <DsThing>
    <template #footer>內容</template>
  </DsThing>`;
  assert.deepEqual(snippets(code), []);
});

test('指南範例用了不存在的元件 → 失敗', () => {
  assert.deepEqual(snippets('<DsThingy text="x" />'), ['指南 a.md 第 1 段：<DsThingy> 不是 Vue 版的元件']);
});

test('指南範例的屬性名寫錯（:綁定或直接寫值）→ 失敗', () => {
  assert.deepEqual(snippets('<DsThing :txt="a" auto-closee="true" v-model:shut="x" />'), [
    '指南 a.md 第 1 段：<DsThing> 沒有屬性 txt',
    '指南 a.md 第 1 段：<DsThing> 沒有屬性 auto-closee',
    '指南 a.md 第 1 段：<DsThing> 不能 v-model:shut',
  ]);
});

test('指南範例的事件名寫錯 → 失敗', () => {
  assert.deepEqual(snippets('<DsThing @btn-clik="go" />'), ['指南 a.md 第 1 段：<DsThing> 沒有事件 btn-clik']);
});

test('元件沒有 v-model 卻用了 → 失敗', () => {
  const errors = checkSnippets(path.join(fixtures, 'snippets-no-model'), [{ where: 'x', code: '<DsThing v-model="a" />' }]);
  assert.deepEqual(errors, ['x：<DsThing> 不能 v-model']);
});

test('讀不到任何 Vue 元件（檢查本身失效）→ 失敗，不得當成通過', () => {
  const errors = checkSnippets(path.join(fixtures, 'empty'), [{ where: 'x', code: '<DsThing />' }]);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /讀不到任何 Vue 元件/);
});
