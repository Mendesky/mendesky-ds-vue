// 行為比對（試做報告用，不在 CI 跑）：在 Angular 版與 Vue 版的範例網站執行同一組滑鼠、鍵盤操作，
// 記下每一步的結果（焦點在哪、aria 狀態、值、面板開關、提示文字），兩邊逐項比對；互動後的畫面也逐像素比對。
//
// 用法：node scripts/compare/behavior.mjs [Angular 範例網站網址] [Vue 範例網站目錄]
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import path from 'node:path';
import { chromium } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const ANGULAR = process.argv[2] ?? 'https://mendesky.github.io/mendesky-ds-angular/v0.3.0/components/';
const VUE_DIR = path.resolve(process.argv[3] ?? 'storybook-static');
const OUT = path.resolve('compare-output', 'behavior');

function serve(dir) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
  const server = createServer((req, res) => {
    let file = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// ── 觀察用的小工具（兩邊共用的 class 名稱）──
const focused = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return 'body';
    return `${el.tagName.toLowerCase()}${el.getAttribute('role') ? `[role=${el.getAttribute('role')}]` : ''}「${(el.textContent || el.getAttribute('aria-label') || '').trim()}」`;
  });
const count = (page, sel) => page.locator(sel).count();
const text = (page, sel) => page.locator(sel).first().textContent().then((t) => t?.trim() ?? null).catch(() => null);
const attr = (page, sel, name) => page.locator(sel).first().getAttribute(name).catch(() => null);
const settle = (page, ms = 120) => page.waitForTimeout(ms);
const shot = async (page) => PNG.sync.read(await page.screenshot());

/** 每個情境：在一個頁面上操作並回傳觀察紀錄（陣列），與要比對的截圖 */
const SCENARIOS = [
  {
    name: '按鈕：滑過、Tab 聚焦的外觀；停用不能按',
    story: 'button--with-left-icon',
    async run(page, rec, shots) {
      await page.locator('button.btn').hover();
      await settle(page, 250);
      shots.push(['滑過', await shot(page)]);
      await page.mouse.move(890, 690);
      await page.keyboard.press('Tab');
      await settle(page, 250);
      rec.push(['Tab 後焦點', await focused(page)]);
      shots.push(['Tab 聚焦', await shot(page)]);
    },
  },
  {
    name: '按鈕：停用',
    story: 'button--disabled',
    async run(page, rec) {
      rec.push(['原生 disabled', await page.locator('button.btn').isDisabled()]);
      await page.keyboard.press('Tab');
      rec.push(['Tab 後焦點', await focused(page)]);
    },
  },
  {
    name: '勾選框：Tab、空白鍵、Enter、點擊',
    story: 'checkbox--default',
    async run(page, rec, shots) {
      await page.keyboard.press('Tab');
      rec.push(['Tab 後焦點', await focused(page)]);
      shots.push(['Tab 聚焦', await shot(page)]);
      for (const key of ['Space', 'Enter']) {
        await page.keyboard.press(key);
        await settle(page);
        rec.push([`按 ${key} 後 aria-checked`, await attr(page, 'button[role=checkbox]', 'aria-checked')]);
      }
      await page.locator('button[role=checkbox]').first().click();
      await settle(page);
      rec.push(['點擊後 aria-checked', await attr(page, 'button[role=checkbox]', 'aria-checked')]);
      await page.locator('button[role=checkbox]').first().hover();
      await settle(page, 250);
      shots.push(['滑過', await shot(page)]);
    },
  },
  {
    name: '勾選框：停用的不能 Tab 到',
    story: 'checkbox--disabled',
    async run(page, rec) {
      const order = [];
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('Tab');
        order.push(await focused(page));
      }
      rec.push(['連按 4 次 Tab 的焦點', order]);
    },
  },
  {
    name: '勾選框：部分勾選的分類列',
    story: 'checkbox--group-with-children',
    async run(page, rec) {
      const states = () => page.locator('button[role=checkbox]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-checked')));
      rec.push(['初始', await states()]);
      await page.locator('button[role=checkbox]').first().click();
      await settle(page);
      rec.push(['點「全選」後', await states()]);
      await page.locator('button[role=checkbox]').nth(2).click();
      await settle(page);
      rec.push(['取消一個子項後', await states()]);
    },
  },
  {
    name: '輸入框：聚焦、輸入、清除鈕、Tab 離開',
    story: 'input--default',
    async run(page, rec, shots) {
      await page.locator('.input-field').click();
      await page.keyboard.type('天母西路 1 號');
      await settle(page);
      rec.push(['輸入後的值', await page.locator('.input-field').inputValue()]);
      rec.push(['清除鈕數量', await count(page, '.input-clear')]);
      shots.push(['聚焦且有值', await shot(page)]);
      await page.locator('.input-clear').dispatchEvent('mousedown');
      await settle(page);
      rec.push(['按清除後的值', await page.locator('.input-field').inputValue()]);
      await page.keyboard.type('abc');
      await page.keyboard.press('Tab');
      await settle(page);
      rec.push(['Tab 離開後外框狀態', await page.locator('.input-wrap').getAttribute('class')]);
      shots.push(['離開後（有值）', await shot(page)]);
    },
  },
  {
    name: '輸入框：錯誤提示的位置與文字',
    story: 'input--with-error',
    async run(page, rec) {
      await settle(page, 400);
      rec.push(['提示文字', await text(page, '.form-error-tooltip__box')]);
      const pos = await page.evaluate(() => {
        const box = document.querySelector('.input-box').getBoundingClientRect();
        const tip = document.querySelector('.form-error-tooltip__box').getBoundingClientRect();
        return { 提示在框下方: tip.top >= box.bottom, 左緣對齊: Math.round(tip.left - box.left) };
      });
      rec.push(['提示位置', pos]);
    },
  },
  {
    name: '輸入框：停用不能輸入',
    story: 'input--disabled',
    async run(page, rec) {
      rec.push(['原生 disabled', await page.locator('.input-field').isDisabled()]);
      await page.keyboard.press('Tab');
      rec.push(['Tab 後焦點', await focused(page)]);
    },
  },
  {
    name: '下拉選單：鍵盤操作',
    story: 'select--default',
    async run(page, rec, shots) {
      const panelOpen = () => count(page, '.panel-option');
      await page.keyboard.press('Tab');
      await settle(page);
      rec.push(['Tab 後焦點', await focused(page)]);
      rec.push(['Tab 後外框', await page.locator('.select-wrap').getAttribute('class')]);
      await page.keyboard.press('ArrowDown');
      await settle(page, 250);
      rec.push(['↓ 後面板選項數', await panelOpen()]);
      rec.push(['↓ 後目前項目', await text(page, '.panel-option--active')]);
      shots.push(['↓ 開啟面板', await shot(page)]);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await settle(page);
      rec.push(['再按兩次 ↓ 後目前項目', await text(page, '.panel-option--active')]);
      await page.keyboard.press('ArrowUp');
      await settle(page);
      rec.push(['↑ 後目前項目', await text(page, '.panel-option--active')]);
      await page.keyboard.press('Enter');
      await settle(page, 250);
      rec.push(['Enter 後面板選項數', await panelOpen()]);
      rec.push(['Enter 後顯示文字', await text(page, '.select-field')]);
      rec.push(['Enter 後焦點', await focused(page)]);
      await page.keyboard.press('ArrowDown');
      await settle(page);
      rec.push(['再開啟時目前項目（停在已選的）', await text(page, '.panel-option--active')]);
      await page.keyboard.press('Escape');
      await settle(page, 250);
      rec.push(['Esc 後面板選項數', await panelOpen()]);
      rec.push(['Esc 後焦點', await focused(page)]);
      rec.push(['Esc 後顯示文字', await text(page, '.select-field')]);
    },
  },
  {
    name: '下拉選單：滑鼠點選、點外面關閉',
    story: 'select--default',
    async run(page, rec, shots) {
      await page.locator('.select-wrap').click();
      await settle(page, 250);
      rec.push(['點開後面板選項數', await count(page, '.panel-option')]);
      await page.locator('.panel-option').nth(1).hover();
      await settle(page, 250);
      shots.push(['滑過選項', await shot(page)]);
      await page.locator('.panel-option').nth(1).click();
      await settle(page, 250);
      rec.push(['點選後顯示文字', await text(page, '.select-field')]);
      rec.push(['點選後面板選項數', await count(page, '.panel-option')]);
      await page.locator('.select-wrap').click();
      await settle(page, 250);
      await page.mouse.click(880, 680);
      await settle(page, 250);
      rec.push(['點外面後面板選項數', await count(page, '.panel-option')]);
      rec.push(['點外面後顯示文字', await text(page, '.select-field')]);
    },
  },
  {
    name: '下拉選單：停用選項會被跳過',
    story: 'select--disabled-option',
    async run(page, rec) {
      await page.keyboard.press('Tab');
      const seq = [];
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowDown');
        await settle(page);
        seq.push(await text(page, '.panel-option--active'));
      }
      rec.push(['連按 5 次 ↓ 的目前項目', seq]);
      await page.locator('.panel-option').nth(1).click({ force: true });
      await settle(page, 250);
      rec.push(['點停用選項後面板選項數', await count(page, '.panel-option')]);
    },
  },
  {
    name: '下拉選單：選項很多時的高度與捲動',
    story: 'select--many-options',
    async run(page, rec, shots) {
      await page.keyboard.press('Tab');
      await page.keyboard.press('ArrowUp');
      await settle(page, 400);
      rec.push(['↑ 開啟時目前項目', await text(page, '.panel-option--active')]);
      const m = await page.evaluate(() => {
        const s = document.querySelector('.panel-scroll');
        const a = document.querySelector('.panel-option--active').getBoundingClientRect();
        const r = s.getBoundingClientRect();
        return { 可視高度: s.clientHeight, 已捲到目前項目: a.top >= r.top && a.bottom <= r.bottom + 1 };
      });
      rec.push(['面板', m]);
      shots.push(['↑ 開啟', await shot(page)]);
    },
  },
  {
    name: '對話框：開啟、焦點圈限、Esc、焦點歸還',
    story: 'dialog--interactive',
    async run(page, rec, shots) {
      const opener = page.locator('#storybook-root button').first();
      await opener.focus();
      await page.keyboard.press('Enter');
      await settle(page, 500);
      rec.push(['開啟後對話框數', await count(page, '.dialog-card')]);
      rec.push(['開啟後焦點', await focused(page)]);
      shots.push(['開啟', await shot(page)]);
      const order = [];
      for (const k of ['Tab', 'Tab', 'Shift+Tab']) {
        await page.keyboard.press(k);
        order.push(await focused(page));
      }
      rec.push(['Tab、Tab、Shift+Tab 的焦點', order]);
      await page.keyboard.press('Escape');
      await settle(page, 100);
      rec.push(['Esc 後退場中', await count(page, '.dialog-card--leaving')]);
      await settle(page, 400);
      rec.push(['Esc 後對話框數', await count(page, '.dialog-card')]);
      rec.push(['關閉後焦點', await focused(page)]);
      await page.keyboard.press('Enter');
      await settle(page, 500);
      await page.locator('.dialog-actions button').nth(1).click();
      await settle(page, 500);
      rec.push(['按確認後對話框數', await count(page, '.dialog-card')]);
    },
  },
];

const server = await serve(VUE_DIR);
const VUE = `http://127.0.0.1:${server.address().port}/`;
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const report = [];
try {
  for (const sc of SCENARIOS) {
    const sides = {};
    for (const [side, base] of [['angular', ANGULAR], ['vue', VUE]]) {
      const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
      await page.goto(`${base}iframe.html?id=${encodeURIComponent(sc.story)}&viewMode=story`);
      await page.waitForSelector('#storybook-root > *', { state: 'attached', timeout: 15000 });
      await page.evaluate(() => document.fonts.ready);
      await settle(page, 400);
      const rec = [];
      const shots = [];
      await sc.run(page, rec, shots);
      sides[side] = { rec, shots };
      await page.close();
    }
    const steps = sides.angular.rec.map(([label, a], i) => {
      const v = sides.vue.rec[i]?.[1];
      return { label, angular: a, vue: v, same: isDeepStrictEqual(a, v) };
    });
    const pics = sides.angular.shots.map(([label, a], i) => {
      const v = sides.vue.shots[i][1];
      const diff = new PNG({ width: a.width, height: a.height });
      const pixels = pixelmatch(a.data, v.data, diff.data, a.width, a.height, { threshold: 0.1 });
      if (pixels) {
        const base = `${sc.story}-${label}`.replace(/[\\/:*?"<>|\s]/g, '_');
        writeFileSync(path.join(OUT, `${base}-angular.png`), PNG.sync.write(a));
        writeFileSync(path.join(OUT, `${base}-vue.png`), PNG.sync.write(v));
        writeFileSync(path.join(OUT, `${base}-diff.png`), PNG.sync.write(diff));
      }
      return { label, pixels };
    });
    const ok = steps.every((s) => s.same) && pics.every((p) => p.pixels === 0);
    report.push({ name: sc.name, story: sc.story, ok, steps, pics });
    console.log(`${ok ? '一致' : '不一致'}\t${sc.name}`);
    for (const s of steps) console.log(`  ${s.same ? '✓' : '✗'} ${s.label}：${JSON.stringify(s.angular)}${s.same ? '' : ` ≠ Vue ${JSON.stringify(s.vue)}`}`);
    for (const p of pics) console.log(`  ${p.pixels === 0 ? '✓' : '✗'} 畫面「${p.label}」${p.pixels === 0 ? '逐像素相同' : `差 ${p.pixels} px`}`);
  }
} finally {
  await browser.close();
  server.close();
}
writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const ok = report.filter((r) => r.ok).length;
console.log(`\n${report.length} 個情境：${ok} 個完全一致，${report.length - ok} 個有差異`);
