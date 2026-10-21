import type { Preview } from '@storybook/vue3';
import '@mendesky/ds/styles/core.scss';
import { DsDocsPage } from './ds-docs-page';

// 分類與順序跟 Angular 版的範例網站相同
const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: { expanded: true },
    docs: { page: DsDocsPage },
    options: {
      storySort: { order: ['互動元件', '表單元件', '浮層元件', '展示元件', '工具', '基礎', ['色彩與 token', '字型', '動效', '圖示'], '互動原則'] },
    },
  },
};

export default preview;
