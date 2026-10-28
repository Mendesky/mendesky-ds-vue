// 說明匯出（export-docs.mjs）的測試：本體文字裡的 #元件id 要換成 Vue 元件名稱，
// 使用端（AI 協作索引）讀到的才是 <DsXxx>。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderRefs, findRefs } from '@mendesky/ds/scripts/component-refs.mjs';
import { exportDocs, renderCoreRefs, vueNames, mergeDoc, loadCoreRefs } from './export-docs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('#元件id 換成 Vue 元件名稱；色碼、網址、id 與相關元件欄位不換；Vue 沒有的元件保留原樣', () => {
  const nameOf = vueNames([
    { id: 'button', selector: '<DsButton>' },
    { id: 'label', selector: '<DsLabel>' },
  ]);
  const input = {
    id: 'demo',
    name: '#button 示範',
    when: '選項一律用 #button，標籤用 #label。',
    notes: [{ type: 'info', content: '底色 #fff；見 https://example.com/a#button；#not-in-vue 保留' }, '#button 純字串'],
    customTables: [{ title: '對照', columns: ['元件'], rows: [['#button']] }],
    relatedComponents: ['#button'],
    url: 'https://example.com/#button',
  };
  assert.deepEqual(renderCoreRefs(input, nameOf, renderRefs), {
    id: 'demo',
    name: '#button 示範',
    when: '選項一律用 <DsButton>，標籤用 <DsLabel>。',
    notes: [{ type: 'info', content: '底色 #fff；見 https://example.com/a#button；#not-in-vue 保留' }, '<DsButton> 純字串'],
    customTables: [{ title: '對照', columns: ['元件'], rows: [['<DsButton>']] }],
    relatedComponents: ['#button'],
    url: 'https://example.com/#button',
  });
});

test('規格第 2 版欄位：部位與狀態的 name 是顯示文字，照樣換；元件本身的 name 仍不換', () => {
  const nameOf = vueNames([
    { id: 'button', selector: '<DsButton>' },
    { id: 'label', selector: '<DsLabel>' },
  ]);
  const input = {
    id: 'demo',
    name: '#button 示範',
    anatomy: [{ name: '#label 標籤', description: '用 #label 顯示' }],
    states: [{ name: '#button 停用', description: '同 #button' }],
    a11y: { screenReader: ['改用 #button'], aria: ['#icon-btn 可以設定可讀名稱'] },
    dos: [{ text: '用 #label', story: 'full-width' }],
    donts: [{ text: '不要用 #button' }],
  };
  assert.deepEqual(renderCoreRefs(input, nameOf, renderRefs), {
    id: 'demo',
    name: '#button 示範',
    anatomy: [{ name: '<DsLabel> 標籤', description: '用 <DsLabel> 顯示' }],
    states: [{ name: '<DsButton> 停用', description: '同 <DsButton>' }],
    a11y: { screenReader: ['改用 <DsButton>'], aria: ['#icon-btn 可以設定可讀名稱'] },
    dos: [{ text: '用 <DsLabel>', story: 'full-width' }],
    donts: [{ text: '不要用 <DsButton>' }],
  });
});

test('合併後的說明：元件規格（含第 2 版欄位）、互動原則、token 說明裡沒有留下 Vue 有的 #元件id', async () => {
  const docs = await exportDocs(root);
  const known = new Set(docs.components.map((c) => c.doc.id));
  const button = docs.components.find((c) => c.doc.id === 'button').doc;
  assert.match(JSON.stringify(button.anatomy), /<DsLabel>/);
  assert.doesNotMatch(JSON.stringify(button.anatomy), /#label/);

  // 跟匯出一樣的略過規則：識別字欄位不掃，但部位與狀態的 name 要掃
  const skip = new Set(['id', 'name', 'url', 'references', 'relatedComponents', 'relatedPatterns']);
  const displayedName = /(?:^|\.)(?:anatomy|states)\[\d+\]$/;
  const leftovers = [];
  let scanned = 0;
  const walk = (value, at) => {
    if (typeof value === 'string') {
      scanned++;
      for (const id of findRefs(value)) if (known.has(id)) leftovers.push(`${at}：#${id}`);
    } else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${at}[${i}]`));
    else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        if (skip.has(k) && !(k === 'name' && displayedName.test(at))) continue;
        walk(v, at ? `${at}.${k}` : k);
      }
    }
  };
  docs.components.forEach((c) => walk(c.doc, ''));
  walk(docs.patterns, 'patterns');
  walk(docs.tokens, 'tokens');
  walk(docs.typography, 'typography');
  walk(docs.motion, 'motion');
  // 掃描本身要有讀到東西，避免「什麼都沒讀到所以沒有殘留」
  assert.ok(scanned > 300, `只掃到 ${scanned} 段文字，匯出可能壞了`);
  assert.deepEqual(leftovers, []);
});

test('合併時只換本體的文字：Vue 寫的範例程式碼與注意事項保留 #action 這類插槽寫法', () => {
  const nameOf = vueNames([{ id: 'field', selector: '<DsField>' }, { id: 'action', selector: '<DsAction>' }]);
  const render = (value) => renderCoreRefs(value, nameOf, renderRefs);
  const spec = { id: 'demo', when: '放進 #field。', notes: ['見 #field'] };
  const api = {
    id: 'demo',
    selector: '<DsDemo>',
    usage: [{ label: '右側按鈕', code: '<DsField><template #action>…</template></DsField>' }],
    usageNotes: ['右側按鈕放在具名插槽 #action'],
  };
  const doc = mergeDoc(spec, api, render);
  assert.equal(doc.when, '放進 <DsField>。');
  assert.deepEqual(doc.notes, ['見 <DsField>']);
  assert.equal(doc.usage[0].code, '<DsField><template #action>…</template></DsField>');
  assert.deepEqual(doc.usageNotes, ['右側按鈕放在具名插槽 #action']);
});

test('本體沒有 #元件id 解析（版本太舊或沒裝好）→ 匯出失敗並說明，不能把沒換的 #元件id 交出去', async () => {
  const fakeCore = mkdtempSync(path.join(tmpdir(), 'core-no-refs-'));
  await assert.rejects(() => loadCoreRefs(fakeCore), /component-refs\.mjs[\s\S]*@mendesky\/ds/);
});
