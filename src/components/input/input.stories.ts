import type { Meta, StoryObj } from '@storybook/vue3';
import { DsInput } from '../../index';

const meta: Meta<typeof DsInput> = {
  title: '表單元件/Input',
  id: 'input',
  component: DsInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['S', 'M', 'L'],
      description: '輸入框尺寸',
      table: { defaultValue: { summary: 'L' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder 文字',
      table: { defaultValue: { summary: 'Placeholder' } },
    },
    type: {
      control: 'select',
      options: ['text', 'date', 'email', 'number', 'password', 'tel'],
      description: 'HTML input type',
      table: { defaultValue: { summary: 'text' } },
    },
    initialValue: {
      control: 'text',
      description: '預填值；外部可透過此 Input 同步更新欄位內容',
    },
    errorMessage: {
      control: 'text',
      description: '錯誤訊息（有值時切換 error 狀態）',
    },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    onValueChange: { action: 'valueChange' },
  },
};

export default meta;
type Story = StoryObj<typeof DsInput>;

export const Default: Story = {
  args: {
    size: 'L',
    placeholder: '請輸入文字',
    disabled: false,
  },
};

// ── 三種尺寸 ─────────────────────────────────────────
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:300px;padding:16px;">
        <DsInput size="S" placeholder="S size"></DsInput>
        <DsInput size="M" placeholder="M size"></DsInput>
        <DsInput size="L" placeholder="L size"></DsInput>
      </div>
    `,
    components: { DsInput },
  }),
};

// ── 狀態 ─────────────────────────────────────────────
export const WithError: Story = {
  args: {
    size: 'L',
    placeholder: '請輸入統一編號',
    errorMessage: '格式錯誤，請輸入 8 位數字',
  },
};

export const Disabled: Story = {
  args: {
    size: 'L',
    placeholder: '不可輸入',
    disabled: true,
  },
};

// ── 預填值 ────────────────────────────────────────────
export const Prefilled: Story = {
  args: {
    size: 'L',
    initialValue: '89789944',
    placeholder: '請輸入統一編號',
  },
};

// ── 日期類型 ──────────────────────────────────────────
export const DateType: Story = {
  args: {
    size: 'L',
    type: 'date',
  },
};

// ── 全狀態一覽 ────────────────────────────────────────
export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:300px;padding:16px;">
        <div>
          <div style="font-size:11px;color:#939393;margin-bottom:4px;">Normal</div>
          <DsInput size="L" placeholder="Placeholder"></DsInput>
        </div>
        <div>
          <div style="font-size:11px;color:#939393;margin-bottom:4px;">Error</div>
          <DsInput size="L" placeholder="Placeholder" errorMessage="此欄位為必填"></DsInput>
        </div>
        <div>
          <div style="font-size:11px;color:#939393;margin-bottom:4px;">Disabled</div>
          <DsInput size="L" placeholder="不可輸入" :disabled="true"></DsInput>
        </div>
      </div>
    `,
    components: { DsInput },
  }),
};
