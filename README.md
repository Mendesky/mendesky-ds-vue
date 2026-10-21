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

元件放在 `src/components/<id>/`：`Ds<名稱>.vue`、`Ds<名稱>.spec.ts`、`<id>.docs.ts`（Vue 用法）、`<id>.stories.ts`（範例，id 與 Angular 版相同）。

## 版本

每個版本是一個 git tag（`vX.Y.Z`、預發布 `vX.Y.Z-beta.N`）。推 tag 時自動把該版的範例網站發布到 gh-pages。

## 授權

Copyright (c) 2026 嘉威聯合會計師事務所. All rights reserved. 見 [LICENSE](./LICENSE)。
