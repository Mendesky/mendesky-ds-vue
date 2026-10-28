// 說明檢查（Vue）：確認元件的 Vue 用法說明（*.docs.ts）跟程式碼一致，並跟本體的元件規格對得上。
//
// 檢查：
//   1. 每個公開元件（src/components/<id>/Ds*.vue，內部子元件除外）旁邊都有說明檔
//   2. 說明檔列的屬性名稱，跟元件的 defineProps／defineEmits 完全一致
//      命名：屬性寫原名（text）、事件寫 @ 加 kebab-case（@btn-click）、modelValue＋update:modelValue 合寫成 v-model
//   3. 說明檔能正確載入（語法錯誤直接算失敗，不略過）
//   4. 說明檔只放 Vue 用法；何時用、注意事項、部位、狀態、無障礙、可以／不要這樣做等規格欄位屬於本體 @mendesky/ds
//   5. 每份說明都有對應的本體規格（Vue 版試做中，本體規格不必每份都有 Vue 說明）
//   6. 說明檔的 usageNotes（Vue 專屬注意事項）每筆是文字或 { type, content }
// 一個元件都沒掃到也算失敗，避免「沒東西可查所以全過」。
//
// 另外匯出 checkSnippets(root, snippets)：本體的指南檢查（check:guides）用它驗證指南裡 Vue 分頁的程式碼。
//
// 用法：node scripts/check-docs.mjs [repo 根目錄]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadDocFile, coreRoot } from './export-docs.mjs';

const require = createRequire(import.meta.url);
const ts = require('typescript');

// 只在母元件內部使用、不給外部直接用的子元件：不需要說明檔
export const INTERNAL_COMPONENTS = ['DsSelectPanel'];

// 規格欄位：屬於本體，不得出現在 Vue 說明檔（後五個是規格第 2 版的部位、狀態、無障礙、可以／不要這樣做）
const SPEC_ONLY_KEYS = ['name', 'group', 'when', 'description', 'notes', 'customTables', 'anatomy', 'states', 'a11y', 'dos', 'donts'];

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function memberNames(typeNode) {
  if (!typeNode || !ts.isTypeLiteralNode(typeNode)) return [];
  return typeNode.members
    .filter((m) => m.name)
    .map((m) => (ts.isStringLiteral(m.name) ? m.name.text : m.name.getText()));
}

/** 從 .vue 的 <script setup> 取 defineProps／defineEmits 宣告的名稱 */
export function componentApiNames(vueFile) {
  const source = readFileSync(vueFile, 'utf8');
  const match = source.match(/<script setup[^>]*>([\s\S]*?)<\/script>/);
  if (!match) throw new Error(`${vueFile}：找不到 <script setup>`);
  const sf = ts.createSourceFile(vueFile + '.ts', match[1], ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
  const props = [];
  const emits = [];
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const fn = node.expression.text;
      if (fn === 'defineProps') props.push(...memberNames(node.typeArguments?.[0]));
      if (fn === 'defineEmits') emits.push(...memberNames(node.typeArguments?.[0]));
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  const names = new Set();
  for (const p of props) names.add(p === 'modelValue' ? 'v-model' : p);
  for (const e of emits) names.add(e === 'update:modelValue' ? 'v-model' : `@${kebab(e)}`);
  return names;
}

const NOTE_TYPES = ['info', 'warn', 'warning'];
const isNote = (n) => typeof n === 'string' || (n && typeof n === 'object' && NOTE_TYPES.includes(n.type) && typeof n.content === 'string');

/** 注意事項清單格式不對的筆數位置（從 1 起算）；不是陣列回傳 null */
function badNoteIndexes(list) {
  if (!Array.isArray(list)) return null;
  return list.map((n, i) => (isNote(n) ? null : i + 1)).filter((i) => i !== null);
}

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pascal = (s) => camel(s).replace(/^./, (c) => c.toUpperCase());

/** 任何元件都能直接寫的屬性（Vue 保留字與 HTML 共通屬性） */
const GLOBAL_ATTRS = new Set(['class', 'style', 'key', 'ref', 'is', 'id', 'role', 'title', 'tabindex', 'hidden', 'lang', 'dir', 'name', 'slot']);
/** 沒宣告也能聽的 DOM 事件（Vue 會把沒宣告的監聽交給元件的根元素） */
const DOM_EVENTS = new Set([
  'click', 'dblclick', 'contextmenu', 'focus', 'blur', 'focusin', 'focusout', 'keydown', 'keyup', 'keypress',
  'input', 'change', 'submit', 'reset', 'paste', 'copy', 'cut', 'scroll', 'wheel',
  'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'mousemove',
  'pointerdown', 'pointerup', 'pointerenter', 'pointerleave', 'pointermove', 'touchstart', 'touchend', 'touchmove',
  'dragstart', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'drop', 'compositionstart', 'compositionend',
]);
/** 不檢查的寫法：流程指令、具名插槽（#x）、範例裡「其餘屬性省略」的 ... */
const SKIP_ATTR = /^(v-(if|else|else-if|for|show|slot|html|text|once|memo|cloak|pre)(:|$)|#|v-bind$|v-on$|\.\.\.$|…$)/;

const ATTR = /\s+([^\s=/>"']+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>"']+))?/g;
const TAG = /<([a-zA-Z][\w-]*)((?:\s+[^\s=/>"']+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>"']+))?)*)\s*\/?>/g;

/** 一段 template 程式碼裡寫錯的元件、屬性、事件（依出現順序）。elements：元件名（DsXxx）→ componentApiNames 的結果 */
function snippetProblems(code, elements) {
  const out = [];
  for (const [, rawTag, attrs] of code.matchAll(TAG)) {
    if (!/^Ds[A-Z]|^ds-/.test(rawTag)) continue;
    const tag = rawTag.startsWith('ds-') ? pascal(rawTag) : rawTag;
    const names = elements.get(tag);
    if (!names) {
      out.push(`<${tag}> 不是 Vue 版的元件`);
      continue;
    }
    const hasProp = (n) => names.has(camel(n)) || GLOBAL_ATTRS.has(n) || /^(aria|data)-/.test(n);
    for (const [, raw] of attrs.matchAll(ATTR)) {
      if (SKIP_ATTR.test(raw)) continue;
      let m;
      if (raw === 'v-model' || raw.startsWith('v-model.')) {
        if (!names.has('v-model')) out.push(`<${tag}> 不能 v-model`);
      } else if ((m = raw.match(/^v-model:([^.]+)/))) {
        if (!names.has(camel(m[1])) || !names.has(`@update:${kebab(camel(m[1]))}`)) out.push(`<${tag}> 不能 v-model:${m[1]}`);
      } else if ((m = raw.match(/^(?::|v-bind:)([^.]+)/))) {
        if (!hasProp(m[1])) out.push(`<${tag}> 沒有屬性 ${m[1]}`);
      } else if ((m = raw.match(/^(?:@|v-on:)([^.]+)/))) {
        if (!names.has(`@${kebab(m[1])}`) && !DOM_EVENTS.has(m[1])) out.push(`<${tag}> 沒有事件 ${m[1]}`);
      } else if (raw.startsWith('v-')) {
        continue; // 自訂指令不在這裡檢查
      } else if (!hasProp(raw)) {
        out.push(`<${tag}> 沒有屬性 ${raw}`);
      }
    }
  }
  return out;
}

function publicComponentFiles(root) {
  return walk(path.join(root, 'src', 'components'))
    .filter((f) => /\/Ds\w+\.vue$/.test(f))
    .filter((f) => !INTERNAL_COMPONENTS.includes(path.basename(f, '.vue')));
}

/**
 * 驗證別處（本體的指南文章）寫的 Vue 範例：元件要存在，屬性、事件、v-model 要是元件有的。
 * snippets：[{ where: 出處說明, code: 程式碼 }]。回傳錯誤訊息陣列；讀不到任何元件時回傳一則「檢查沒有執行」。
 */
export function checkSnippets(root, snippets) {
  const elements = new Map(publicComponentFiles(root).map((f) => [path.basename(f, '.vue'), componentApiNames(f)]));
  if (elements.size === 0) return [`讀不到任何 Vue 元件（${path.join(root, 'src', 'components')}），指南範例檢查沒有執行`];
  const errors = [];
  for (const { where, code } of snippets) for (const problem of snippetProblems(code, elements)) errors.push(`${where}：${problem}`);
  return [...new Set(errors)];
}

export async function checkDocs(root) {
  const failures = [];
  const componentsDir = path.join(root, 'src', 'components');
  const publicFiles = publicComponentFiles(root);
  if (publicFiles.length === 0) return { checked: 0, failures: [`${componentsDir} 裡沒有任何元件`] };

  let specIds = null;
  try {
    const core = coreRoot(root);
    const { exportCoreDocs } = await import(pathToFileURL(path.join(core, 'scripts', 'export-docs.mjs')).href);
    specIds = new Set(exportCoreDocs(core).specs.map(({ spec }) => spec.id));
  } catch (e) {
    failures.push(`讀不到本體的元件規格：${e.message}`);
  }

  for (const vueFile of publicFiles) {
    const rel = path.relative(root, vueFile);
    const dir = path.dirname(vueFile);
    const docFiles = readdirSync(dir).filter((f) => f.endsWith('.docs.ts'));
    if (docFiles.length !== 1) {
      failures.push(`${rel}：同一個資料夾要剛好有一份說明檔（*.docs.ts），實際 ${docFiles.length} 份`);
      continue;
    }
    const docRel = path.relative(root, path.join(dir, docFiles[0]));
    let doc;
    try {
      doc = loadDocFile(path.join(dir, docFiles[0]));
    } catch (e) {
      failures.push(e.message);
      continue;
    }
    const extra = SPEC_ONLY_KEYS.filter((k) => k in doc);
    if (extra.length) failures.push(`${docRel}：說明檔只放 Vue 用法；${extra.join('、')} 屬於本體的元件規格`);
    if ('usageNotes' in doc) {
      const bad = badNoteIndexes(doc.usageNotes);
      if (bad === null) failures.push(`${docRel}：usageNotes 要是陣列`);
      else if (bad.length) failures.push(`${docRel}：usageNotes 第 ${bad.join('、')} 筆格式不對（要是文字，或 { type: 'info'｜'warn'｜'warning', content: 文字 }）`);
    }
    if (specIds && !specIds.has(doc.id)) failures.push(`${docRel}：本體沒有 id 為「${doc.id}」的元件規格`);
    const expectedSelector = `<${path.basename(vueFile, '.vue')}>`;
    if (doc.selector !== expectedSelector) failures.push(`${docRel}：selector 應為 ${expectedSelector}，實際 ${doc.selector}`);

    const actual = componentApiNames(vueFile);
    const documented = new Set((doc.props ?? []).map((p) => p.name));
    const missing = [...actual].filter((n) => !documented.has(n));
    const unknown = [...documented].filter((n) => !actual.has(n));
    if (missing.length) failures.push(`${docRel}：說明檔漏了 ${missing.join('、')}`);
    if (unknown.length) failures.push(`${docRel}：說明檔多了元件沒有的 ${unknown.join('、')}`);
  }
  return { checked: publicFiles.length, failures };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
  const { checked, failures } = await checkDocs(root);
  if (failures.length) {
    console.error('說明檢查失敗：');
    for (const f of failures) console.error(`  - ${f}`);
    // 用 exitCode 而不是 process.exit：輸出接到管線時，process.exit 會截斷還沒寫完的訊息
    process.exitCode = 1;
  } else {
    console.log(`說明檢查通過：${checked} 個元件的 Vue 說明與程式碼一致，也都對得上本體的元件規格`);
  }
}
