import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Storybook（範例網站）用的 Vite 設定。單元測試的設定在 vitest.config.ts。
export default defineConfig({
  plugins: [vue()],
});
