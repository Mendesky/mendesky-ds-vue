// 外觀比對（試做報告用，不在 CI 跑）：Angular 版與 Vue 版的範例網站，同一個 story id 各截一張圖，逐像素比對。
//
// 用法：node scripts/compare/visual.mjs [Angular 範例網站網址] [Vue 範例網站目錄]
//   預設 Angular：https://mendesky.github.io/mendesky-ds-angular/v0.3.0/components/
//   預設 Vue：storybook-static（先跑 bash scripts/build-storybook-site.sh）
// 輸出：compare-output/visual/<story id>-{angular,vue,diff}.png 與 report.json；終端機印出每支範例的差異比例。
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { chromium, webkit } from '@playwright/test';

// COMPARE_BROWSER=webkit 時改用 Safari 的引擎（WebKit）跑
const engine = process.env.COMPARE_BROWSER === 'webkit' ? webkit : chromium;
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const ANGULAR = process.argv[2] ?? 'https://mendesky.github.io/mendesky-ds-angular/v0.3.0/components/';
const VUE_DIR = path.resolve(process.argv[3] ?? 'storybook-static');
const OUT = path.resolve('compare-output', process.env.COMPARE_BROWSER ?? 'chromium', 'visual');
const IDS = ['icon', 'label', 'button', 'input', 'field', 'checkbox', 'select', 'dialog'];
const VIEWPORT = { width: 900, height: 700 };

function serve(dir) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const server = createServer((req, res) => {
    let file = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function shoot(page, base, id) {
  await page.goto(`${base}iframe.html?id=${encodeURIComponent(id)}&viewMode=story`);
  await page.waitForSelector('#storybook-root > *', { state: 'attached', timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  // 進場動畫（對話框、錯誤提示 300ms）跑完再截
  await page.waitForTimeout(900);
  return PNG.sync.read(await page.screenshot());
}

const server = await serve(VUE_DIR);
const VUE = `http://127.0.0.1:${server.address().port}/`;
mkdirSync(OUT, { recursive: true });
const index = JSON.parse(readFileSync(path.join(VUE_DIR, 'index.json'), 'utf8'));
const ids = Object.values(index.entries)
  .filter((e) => e.type === 'story' && IDS.includes(e.id.split('--')[0]))
  .map((e) => e.id);

const browser = await engine.launch();
const results = [];
try {
  const angular = await browser.newPage({ viewport: VIEWPORT });
  const vue = await browser.newPage({ viewport: VIEWPORT });
  for (const id of ids) {
    const a = await shoot(angular, ANGULAR, id);
    const v = await shoot(vue, VUE, id);
    const diff = new PNG({ width: a.width, height: a.height });
    const pixels = pixelmatch(a.data, v.data, diff.data, a.width, a.height, { threshold: 0.1 });
    const ratio = pixels / (a.width * a.height);
    results.push({ id, pixels, ratio });
    if (pixels > 0) {
      writeFileSync(path.join(OUT, `${id}-angular.png`), PNG.sync.write(a));
      writeFileSync(path.join(OUT, `${id}-vue.png`), PNG.sync.write(v));
      writeFileSync(path.join(OUT, `${id}-diff.png`), PNG.sync.write(diff));
    }
    console.log(`${pixels === 0 ? '相同' : '不同'}\t${id}\t${pixels} px（${(ratio * 100).toFixed(3)}%）`);
  }
} finally {
  await browser.close();
  server.close();
}
writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(results, null, 2) + '\n');
const same = results.filter((r) => r.pixels === 0).length;
console.log(`\n${results.length} 支範例：${same} 支逐像素相同，${results.length - same} 支有差異（差異圖在 ${OUT}）`);
