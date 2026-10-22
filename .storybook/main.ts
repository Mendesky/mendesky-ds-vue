import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/vue3-vite', options: {} },
  docs: { defaultName: '說明' },
  core: { disableTelemetry: true },
};

export default config;
