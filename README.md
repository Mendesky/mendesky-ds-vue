# @mendesky/ds-vue（試做中）

Mendesky Design System 的 Vue 3 版。目前是**試做**：挑 8 個元件（icon、label、button、input、field、checkbox、select、dialog）驗證「加一個框架＝開一個 repo」的做法，還沒有專案安裝使用。

- 色彩、字型、圖示資料、工具程式、元件規格：來自本體套件 [`@mendesky/ds`](https://github.com/Mendesky/mendesky-ds)，本 repo 不另存一份
- 元件樣式：本體的 `styles/components/<元件>.scss`（整份包在 `.ds-<元件>` 底下），元件的根元素加上這個 class
- 元件行為：對照 Angular 版 [`mendesky-ds-angular`](https://github.com/Mendesky/mendesky-ds-angular) v0.3.0 逐一移植，測試也逐條翻過來
- 文件網站：https://mendesky.github.io/mendesky-ds/ （元件頁的 Vue 分頁）
- 範例網站（Storybook）：`https://mendesky.github.io/mendesky-ds-vue/<版本>/components/`

## 跟 Angular 版的對應

| Angular 版 | Vue 版 |
|---|---|
| `<app-button>` | `<DsButton>` |
| `[text]="x"`、`text="x"` | `:text="x"`、`text="x"`（屬性名稱相同） |
| `(btnClick)="f()"` | `@btn-click="f()"`（事件名稱相同） |
| `[(ngModel)]="v"`、表單控制項 | `v-model="v"`（checkbox、select） |
| `<span field-action>` 投影 | `<template #action>` 具名插槽（field） |
| `[appErrorTooltip]` | `v-error-tooltip="{ message, position, disabled }"` |
| `PortalPositioningService` | `positioning`（同一套定位邏輯，只用 DOM） |
| `ModalStackService` | `modalStack` |

## 開發

```bash
npm ci
npm run typecheck      # vue-tsc
npm test               # 元件單元測試（Vitest，真的 Chromium）
npm run test:scripts   # 檢查腳本自身的測試
npm run check:docs     # 說明檔與元件的 defineProps／defineEmits 一致、對得上本體規格
npm run storybook      # 範例網站（http://localhost:6007）
```

元件放在 `src/components/<id>/`：`Ds<名稱>.vue`、`Ds<名稱>.spec.ts`、`<id>.docs.ts`（Vue 用法；用到 Vue 寫法的注意事項寫在 `usageNotes`，跨框架的內容——注意事項、部位、狀態、無障礙、可以／不要這樣做——寫在本體的元件規格）、`<id>.stories.ts`（範例，id 與 Angular 版相同；本體規格「可以／不要這樣做」指到的範例代號要在這裡有）。

本體規格用 `#元件id` 指其他元件，範例網站的說明頁與 `scripts/export-docs.mjs` 的 `exportDocs` 會換成 Vue 元件名稱（`#button` → `<DsButton>`；Vue 還沒有的元件保留 `#元件id`）。

說明頁的區塊順序（與 Angular 版相同）：名稱與元件名稱 → 何時用 → 部位 → 狀態 → 可以這樣做、不要這樣做 → 範例 → 屬性 → 程式碼範例 →
Vue 注意事項 → 無障礙 → 說明與注意事項 → 其他變體。部位、狀態、可以／不要這樣做、無障礙來自本體規格的第 2 版欄位，沒寫的元件不出現這些區塊。

範例網站的冒煙測試（`node --test scripts/smoke-storybook.browser.mjs` 是它自身的測試）：

```bash
npm run build-storybook-site storybook-static
npm run smoke storybook-static
```

逐頁確認有畫出內容、沒有錯誤、沒有 Vue 警告與沒註冊的元件、沒留下 `#元件id`；說明頁再對照它標的元件（最外層的 `data-ds-id`）的規格檢查：
有內容的區塊要有標題、沒內容的不能有；各區標題的先後順序照上面；每一區畫出的項數跟規格一樣、每一項都有文字；無障礙每個分類畫在對的組；
「看範例」要掛在規格寫了範例代號的那一項，連到的範例（story id `<元件id>--<代號>`）要在範例網站裡、網址也要連到同一個範例；
有第 2 版欄位的元件都要找得到說明頁。
另外，dos／donts 引用的 story 會嵌進本體文件網站半欄寬的框裡，最窄約 240px。所以範例外框別寫死寬度，改用 `max-width`；
冒煙測試會用 240px 寬再開一次這些 story，出現橫向捲軸就失敗。

## 版本

每個版本是一個 git tag（`vX.Y.Z`、預發布 `vX.Y.Z-beta.N`）。推 tag 時自動把該版的範例網站發布到 gh-pages。

## 授權

Copyright (c) 2026 嘉威聯合會計師事務所. All rights reserved. 見 [LICENSE](./LICENSE)。
