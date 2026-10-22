#!/bin/bash
# 把建好的 Vue 範例網站發布到 gh-pages 分支的 <版本>/components/，其他版本原樣保留，並更新根目錄的轉址頁與 versions.json。
# 用法：scripts/publish-pages.sh <建好的網站目錄> <版本：main、vX.Y.Z 或 vX.Y.Z-beta.N>
# 在 GitHub Actions 裡執行（用工作流程的 token 推送）。
set -euo pipefail
BUILD_DIR="$(cd "$1" && pwd)"
VERSION="$2"
TARGET="$VERSION/components"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
# 推送目標：Actions 裡用工作流程的 token
if [ -n "${GH_TOKEN:-}" ] && [ -n "${GITHUB_REPOSITORY:-}" ]; then
  REMOTE="https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
else
  REMOTE="$(git -C "$ROOT" remote get-url origin)"
fi

if git ls-remote --exit-code --heads "$REMOTE" gh-pages >/dev/null 2>&1; then
  git clone --quiet --depth 1 --branch gh-pages "$REMOTE" "$WORK"
else
  git init --quiet "$WORK"
  git -C "$WORK" checkout --quiet --orphan gh-pages
  git -C "$WORK" remote add origin "$REMOTE"
fi
git -C "$WORK" config user.name "github-actions[bot]"
git -C "$WORK" config user.email "41898282+github-actions[bot]@users.noreply.github.com"

rm -rf "${WORK:?}/$TARGET"
mkdir -p "$WORK/$TARGET"
cp -R "$BUILD_DIR/." "$WORK/$TARGET/"
cp "$ROOT/scripts/pages-root.html" "$WORK/index.html"
touch "$WORK/.nojekyll"
[ -f "$WORK/versions.json" ] || echo "[]" > "$WORK/versions.json"

# 範例網站右上角的版本選單讀 versions.json（main 不列，選單自己加）
if [ "$VERSION" != "main" ]; then
  node -e '
    const fs = require("fs"); const file = process.argv[1]; const v = process.argv[2];
    const list = JSON.parse(fs.readFileSync(file, "utf8"));
    // 依版號新到舊；同版號時正式版排在預發布版前面
    const key = (s) => { const [core, beta] = s.slice(1).split("-beta."); return [...core.split(".").map(Number), beta === undefined ? Infinity : Number(beta)]; };
    const desc = (a, b) => { const x = key(a.version), y = key(b.version); for (let i = 0; i < 4; i++) if (x[i] !== y[i]) return y[i] - x[i]; return 0; };
    const next = [{ version: v }, ...list.filter((x) => x.version !== v)].sort(desc);
    fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  ' "$WORK/versions.json" "$VERSION"
fi

cd "$WORK"
git add -A
if git diff --cached --quiet; then
  echo "gh-pages 沒有變化"
  exit 0
fi
git commit --quiet -m "Publish ${TARGET} from ${GITHUB_SHA:-local}"
git push --quiet origin gh-pages
echo "已發布 /${TARGET}/"
