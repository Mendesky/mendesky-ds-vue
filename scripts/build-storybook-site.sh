#!/bin/bash
# 建 Vue 版的範例網站（Storybook）：每個元件的說明頁與可操作範例。
# 設計系統的文件網站在本體 repo（mendesky-ds），它會嵌入這裡的範例。
# 用法：scripts/build-storybook-site.sh [輸出資料夾，預設 storybook-static]
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-storybook-static}"
npx storybook build --quiet --output-dir "$OUT" < /dev/null
echo "已建置範例網站 → $OUT"
