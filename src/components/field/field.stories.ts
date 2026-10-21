import type { Meta, StoryObj } from '@storybook/vue3';
import { DsField } from '../../index';

const INPUT_STYLE =
  'width:100%;padding:8px 12px;border:1px solid #d0d0d0;border-radius:6px;font-size:14px;outline:none;box-sizing:border-box;';

const meta: Meta<typeof DsField> = {
  title: '表單元件/Field',
  id: 'field',
  component: DsField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: '欄位標題文字；空字串時不顯示 label row',
      table: { defaultValue: { summary: '' } },
    },
    required: {
      control: 'boolean',
      description: '顯示「必填」badge（優先於 optional）',
      table: { defaultValue: { summary: 'false' } },
    },
    emphasis: {
      control: 'boolean',
      description: '強調樣式：label 加粗 + 標題色 + 下方分隔線；用於唯讀展示區塊',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DsField>;

// ── 預設（有 label，無 badge）──────────────────────────
export const Default: Story = {
  render: () => ({
    template: `
      <div style="width:320px;padding:24px;">
        <DsField label="姓名">
          <input style="${INPUT_STYLE}" placeholder="請輸入姓名" />
        </DsField>
      </div>
    `,
    components: { DsField },
  }),
};

// ── 必填 ──────────────────────────────────────────────
export const Required: Story = {
  render: () => ({
    template: `
      <div style="width:320px;padding:24px;">
        <DsField label="編號" :required="true">
          <input style="${INPUT_STYLE}" placeholder="請輸入編號" />
        </DsField>
      </div>
    `,
    components: { DsField },
  }),
};

// ── 選填 ──────────────────────────────────────────────
export const Optional: Story = {
  render: () => ({
    template: `
      <div style="width:320px;padding:24px;">
        <DsField label="備註" :optional="true">
          <input style="${INPUT_STYLE}" placeholder="選填備註內容" />
        </DsField>
      </div>
    `,
    components: { DsField },
  }),
};

// ── 強調（唯讀展示區塊）────────────────────────────────
export const Emphasis: Story = {
  render: () => ({
    template: `
      <div style="width:360px;padding:24px;display:flex;flex-direction:column;gap:16px;">
        <DsField label="收件人" :emphasis="true">
          <div style="padding:8px 0;font-size:14px;color:#333;">王小明</div>
        </DsField>
        <DsField label="說明" :emphasis="true" :required="true">
          <div style="padding:8px 0;font-size:14px;color:#333;white-space:pre-wrap;">本次申請用於更新聯絡資料，送出後會寄送確認信到您的信箱。</div>
        </DsField>
      </div>
    `,
    components: { DsField },
  }),
};

// ── 實際表單情境（多欄位）────────────────────────────
export const WithInput: Story = {
  render: () => ({
    template: `
      <div style="width:360px;padding:24px;display:flex;flex-direction:column;gap:16px;">
        <DsField label="顯示名稱" :required="true">
          <input style="${INPUT_STYLE}" placeholder="請輸入顯示名稱" />
        </DsField>
        <DsField label="開始日期" :required="true">
          <input style="${INPUT_STYLE}" type="date" />
        </DsField>
        <DsField label="電子郵件" :optional="true">
          <input style="${INPUT_STYLE}" type="email" placeholder="example@mail.com" />
        </DsField>
        <DsField label="備註">
          <input style="${INPUT_STYLE}" placeholder="其他補充說明" />
        </DsField>
      </div>
    `,
    components: { DsField },
  }),
};
