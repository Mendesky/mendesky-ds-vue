// 說明檢查（Vue）：確認元件的 Vue 用法說明（*.docs.ts）跟程式碼一致，並跟本體的元件規格對得上。
//
// 檢查：
//   1. 每個公開元件（src/components/<id>/Ds*.vue，內部子元件除外）旁邊都有說明檔
//   2. 說明檔列的屬性名稱，跟元件的 defineProps／defineEmits 完全一致
//      命名：屬性寫原名（text）、事件寫 @ 加 kebab-case（@btn-click）、modelValue＋update:modelValue 合寫成 v-model
//   3. 說明檔能正確載入（語法錯誤直接算失敗，不略過）
//   4. 說明檔只放 Vue 用法；何時用、注意事項等規格欄位屬於本體 @mendesky/ds
//   5. 每份說明都有對應的本體規格（Vue 版試做中，本體規格不必每份都有 Vue 說明）
// 一個元件都沒掃到也算失敗，避免「沒東西可查所以全過」。
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

// 規格欄位：屬於本體，不得出現在 Vue 說明檔
const SPEC_ONLY_KEYS = ['name', 'group', 'when', 'description', 'notes', 'customTables'];

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

export async function checkDocs(root) {
  const failures = [];
  const componentsDir = path.join(root, 'src', 'components');
  const vueFiles = walk(componentsDir).filter((f) => /\/Ds\w+\.vue$/.test(f));
  const publicFiles = vueFiles.filter((f) => !INTERNAL_COMPONENTS.includes(path.basename(f, '.vue')));
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
    process.exit(1);
  }
  console.log(`說明檢查通過：${checked} 個元件的 Vue 說明與程式碼一致，也都對得上本體的元件規格`);
}
