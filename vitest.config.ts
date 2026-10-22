import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// 元件測試跑在真的 Chromium：版面量測、焦點、浮層定位都需要真瀏覽器。
export default defineConfig({
  plugins: [vue()],
  // 測試裡的宿主元件用 template 字串寫，需要含編譯器的 Vue（Storybook 也是）
  resolve: { alias: { vue: 'vue/dist/vue.esm-bundler.js' } },
  test: {
    globals: true,
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/testing/setup.ts'],
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [{ browser: 'chromium' }],
      screenshotFailures: false,
    },
  },
});
