// 冒煙測試腳本本身的測試（需要瀏覽器，所以不放進 `npm run test:scripts`；CI 的 smoke job 會跑）。
// 用法：node --test scripts/smoke-storybook.browser.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { smokeStorybook } from './smoke-storybook.mjs';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), '__fixtures__', 'smoke');

test('每頁都畫出內容、沒有錯誤 → 通過', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'ok'));
  assert.equal(result.visited, 2);
  assert.deepEqual(result.failures, []);
});

test('有一頁丟錯 → 失敗並指出哪一頁', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'bad'), { timeout: 3000 });
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /demo--bad/);
});

test('範例裡有瀏覽器不認得的元素（元件沒註冊）→ 失敗並指出哪一頁、哪個標籤', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'unresolved'));
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /demo--unresolved/);
  assert.match(result.failures[0], /dsicon/);
  assert.match(result.failures[0], /app-icon/);
});

test('一頁都沒有 → 失敗', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'empty'));
  assert.equal(result.visited, 0);
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /0 頁/);
});

// ── 本體文字的 #元件id ─────────────────────────

test('說明頁有沒換掉的 #元件id → 失敗並指出是哪個；程式碼、色碼、網址裡的 # 不算', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'refs'), { refIds: ['button', 'select'] });
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /demo--docs/);
  assert.match(result.failures[0], /#button/);
  assert.doesNotMatch(result.failures[0], /#select|#fff/);
});

test('說明頁的 #元件id 都換掉了 → 通過', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'ok'), { refIds: ['button'] });
  assert.deepEqual(result.failures, []);
});

test('要檢查 #元件id 卻拿不到任何元件 id → 失敗，不能當成沒有殘留', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'ok'), { refIds: [] });
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /元件 id/);
});

// ── 規格第 2 版欄位（部位、狀態、可以／不要這樣做、無障礙） ─────────────

// 每一區至少 2 項（少畫一項才看得出來）；無障礙各分類項數不同（鍵盤 2、ARIA 1），數成分類數（2）而不是項數（3）會被抓到；
// 可以、不要兩欄各有一項有範例、一項沒有，才測得出連結放錯項目
const demoSpec = {
  id: 'demo',
  name: 'Demo',
  notes: [],
  anatomy: [{ name: '外框', description: '可以點的範圍' }, { name: '文字', description: '說明這個操作' }],
  states: [{ name: '預設', description: '藍底' }, { name: '停用', description: '灰底' }],
  a11y: { keyboard: ['Tab 移到元件', 'Enter 觸發'], aria: ['用原生 button'] },
  dos: [{ text: '撐滿寬度用 fullWidth', story: 'full-width' }, { text: '給 loadingText' }],
  donts: [{ text: '不要巢狀', story: 'nested' }, { text: '不要只放圖示' }],
};
// 沒有第 2 版欄位的元件：說明頁不能出現這幾區的標題
const plainSpec = { id: 'plain', name: 'Plain', notes: [] };

test('說明頁每一區的標題、項數、無障礙分類都跟規格一致、「看範例」放在對的項目並連到範例網站裡有的範例 → 通過', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'spec-v2-ok'), { refIds: ['demo', 'plain'], specs: [demoSpec, plainSpec] });
  assert.equal(result.visited, 4);
  assert.deepEqual(result.failures, []);
});

test('說明頁五區各少畫一項 → 失敗並逐區指出哪一頁、哪一區、差幾項', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'spec-v2-missing'), { specs: [demoSpec, plainSpec] });
  assert.equal(result.failures.length, 1, result.failures.join('\n'));
  const [failure] = result.failures;
  assert.match(failure, /^demo--docs：/);
  assert.match(failure, /「部位」規格有 2 項，頁面畫出 1 項/);
  assert.match(failure, /「狀態」規格有 2 項，頁面畫出 1 項/);
  assert.match(failure, /「可以這樣做」規格有 2 項，頁面畫出 1 項/);
  assert.match(failure, /「不要這樣做」規格有 2 項，頁面畫出 1 項/);
  assert.match(failure, /「無障礙」規格有 3 項，頁面畫出 2 項/);
  // 少畫的是 ARIA 那一條：分類也跟著對不上
  assert.match(failure, /「無障礙」的分類跟規格不同：規格是 網頁和 APP 都要做到／鍵盤 2 項、網頁專屬／ARIA 與 HTML 語意 1 項，頁面是 網頁和 APP 都要做到／鍵盤 2 項/);
  // 標題與畫出來的連結都對，不能被誤報
  assert.doesNotMatch(failure, /標題|範例/);
});

test('「看範例」放錯項目、多出來、少了、網址跟代號不一致、連到不存在的範例 → 失敗並逐項指出', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'spec-v2-wrong'), { specs: [demoSpec, plainSpec] });
  assert.equal(result.failures.length, 1, result.failures.join('\n'));
  const [failure] = result.failures;
  assert.match(failure, /^demo--docs：/);
  assert.match(failure, /範例 demo--full-width 的連結網址是 \/story\/demo-full-width，跟 data-story-id 對不上/);
  assert.match(failure, /「可以這樣做」第 2 項規格沒有範例，頁面卻連到 demo--full-widht/);
  assert.match(failure, /「可以這樣做、不要這樣做」連到範例網站沒有的範例 demo--full-widht/);
  assert.match(failure, /「不要這樣做」第 1 項應連到範例 demo--nested，頁面沒有範例連結/);
  assert.match(failure, /「不要這樣做」第 2 項規格沒有範例，頁面卻連到 demo--nested/);
  // 第 1 項的 data-story-id 是對的，不能報成「應連到」；項數都對，不能報項數
  assert.doesNotMatch(failure, /「可以這樣做」第 1 項/);
  assert.doesNotMatch(failure, /頁面畫出/);
});

test('有內容的區塊少了標題、標題文字不對、沒有第 2 版欄位的元件畫了空標題 → 失敗並指出哪一頁哪一區', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'spec-v2-headings'), { specs: [demoSpec, plainSpec] });
  assert.equal(result.failures.length, 2, result.failures.join('\n'));
  const demo = result.failures.find((f) => f.startsWith('demo--docs：'));
  const plain = result.failures.find((f) => f.startsWith('plain--docs：'));
  assert.ok(demo && plain, result.failures.join('\n'));
  assert.match(demo, /規格有「部位」，說明頁卻沒有這一區的標題（h2 data-testid="ds-doc-anatomy"）/);
  assert.match(demo, /「狀態」的標題文字是「狀況」/);
  assert.doesNotMatch(demo, /頁面畫出|範例|可以這樣做、不要這樣做|無障礙|順序/);
  assert.match(plain, /規格沒有「部位」，說明頁卻畫了這一區的標題/);
  assert.doesNotMatch(plain, /狀態|無障礙|可以這樣做/);
});

test('項數都對但內容畫錯（標題不見或文字不對、項目沒有文字、連結網址跟範例對不上、區塊順序不對、無障礙放錯分類）→ 失敗並逐一指出', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'spec-v2-wrong-page'), { specs: [demoSpec] });
  assert.equal(result.failures.length, 1, result.failures.join('\n'));
  const [failure] = result.failures;
  assert.match(failure, /^demo--docs：/);
  assert.match(failure, /規格有「狀態」，說明頁卻沒有這一區的標題（h2 data-testid="ds-doc-states"）/);
  assert.match(failure, /「可以這樣做、不要這樣做」的標題文字是「可以、不要」/);
  assert.match(failure, /「部位」第 2 項沒有文字/);
  assert.match(failure, /範例 demo--full-width 的連結網址是 \/story\/nope--nope，跟 data-story-id 對不上/);
  assert.match(failure, /區塊順序不對：說明頁是 部位 → 可以、不要 → 無障礙 → 範例，應該是 部位 → 可以、不要 → 範例 → 無障礙/);
  assert.match(failure, /「無障礙」的分類跟規格不同：規格是 網頁和 APP 都要做到／鍵盤 2 項、網頁專屬／ARIA 與 HTML 語意 1 項，頁面是 網頁和 APP 都要做到／鍵盤 3 項/);
  // 項數、連結的位置都對，不列
  assert.doesNotMatch(failure, /規格有 \d+ 項，頁面畫出|應連到範例|規格沒有範例/);
});

test('說明頁沒有 data-ds-id（不知道是哪個元件）→ 失敗：畫了第 2 版欄位卻對不到規格，有第 2 版欄位的元件也找不到說明頁', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'spec-v2-no-id'), { specs: [demoSpec] });
  assert.equal(result.failures.length, 2, result.failures.join('\n'));
  assert.match(result.failures[0], /^demo--docs：.*沒有 data-ds-id/);
  assert.match(result.failures[1], /^demo：.*找不到它的說明頁/);
});

test('說明頁的 data-ds-id 在規格裡找不到 → 失敗，不能當成沒有第 2 版欄位', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'spec-v2-ok'), { specs: [demoSpec] });
  assert.equal(result.failures.length, 1, result.failures.join('\n'));
  assert.match(result.failures[0], /^plain--docs：.*plain.*在規格裡找不到/);
});

test('要檢查第 2 版欄位卻拿不到任何規格 → 失敗，不能當成通過', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'spec-v2-ok'), { specs: [] });
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /元件規格/);
});

test('規格裡有第 2 版欄位的元件數為 0 → 失敗，不能當成通過', async () => {
  const result = await smokeStorybook(path.join(fixtures, 'spec-v2-ok'), { specs: [{ id: 'demo', name: 'Demo', notes: [] }, plainSpec] });
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /規格裡沒有任何元件有第 2 版欄位/);
});
