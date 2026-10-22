import type { Meta, StoryObj } from '@storybook/vue3';
import { DsLabel } from '../../index';

const meta: Meta<typeof DsLabel> = {
  title: '展示元件/Label',
  id: 'label',
  component: DsLabel,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        'White', 'Transparent', 'GreyOutline', 'LightWhite',
        'SoftBlue', 'Red', 'Salmon', 'Green',
        'Grey25', 'Blue', 'SeaGreen', 'Grey70',
        'Grey16', 'Error', 'GreenAll', 'Golden',
      ],
      description: '顏色語意',
      table: { defaultValue: { summary: 'LightWhite' } },
    },
    size: {
      control: 'select',
      options: ['S', 'M', 'L'],
      description: '尺寸',
      table: { defaultValue: { summary: 'L' } },
    },
    text: {
      control: 'text',
      description: 'Label 文字',
    },
    showLeftIcon: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    showRightIcon: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    showNumberedList: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DsLabel>;

export const Default: Story = {
  args: { color: 'SoftBlue', size: 'L', text: '標籤' },
};

// ── 全色票 ───────────────────────────────────────────
export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px;background:#f8f9fa;">
        <DsLabel color="LightWhite"  size="L" text="LightWhite"></DsLabel>
        <DsLabel color="White"       size="L" text="White"></DsLabel>
        <DsLabel color="GreyOutline" size="L" text="GreyOutline"></DsLabel>
        <DsLabel color="SoftBlue"    size="L" text="SoftBlue"></DsLabel>
        <DsLabel color="Blue"        size="L" text="Blue"></DsLabel>
        <DsLabel color="SeaGreen"    size="L" text="SeaGreen"></DsLabel>
        <DsLabel color="GreenAll"    size="L" text="GreenAll"></DsLabel>
        <DsLabel color="Green"       size="L" text="Green"></DsLabel>
        <DsLabel color="Golden"      size="L" text="Golden"></DsLabel>
        <DsLabel color="Salmon"      size="L" text="Salmon"></DsLabel>
        <DsLabel color="Grey70"      size="L" text="Grey70"></DsLabel>
        <DsLabel color="Grey25"      size="L" text="Grey25"></DsLabel>
        <DsLabel color="Grey16"      size="L" text="Grey16"></DsLabel>
        <DsLabel color="Red"         size="L" text="Red（回補）"></DsLabel>
        <DsLabel color="Error"       size="L" text="Error"></DsLabel>
        <DsLabel color="Transparent" size="L" text="Transparent"></DsLabel>
      </div>
    `,
    components: { DsLabel },
  }),
};

// ── 類別標籤（實際使用場景）────────────────────────────
export const CaseTypeTags: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:6px;flex-wrap:wrap;padding:12px;">
        <DsLabel color="Grey70"    size="L" text="一般"></DsLabel>
        <DsLabel color="SoftBlue"  size="L" text="群組 (3)"></DsLabel>
        <DsLabel color="SeaGreen"  size="L" text="新成員"></DsLabel>
        <DsLabel color="Golden"    size="L" text="VIP"></DsLabel>
        <DsLabel color="Red"       size="L" text="優先"></DsLabel>
      </div>
    `,
    components: { DsLabel },
  }),
};

// ── 三種尺寸 ─────────────────────────────────────────
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;align-items:center;padding:12px;">
        <DsLabel color="SoftBlue" size="S" text="S size"></DsLabel>
        <DsLabel color="SoftBlue" size="M" text="M size"></DsLabel>
        <DsLabel color="SoftBlue" size="L" text="L size"></DsLabel>
      </div>
    `,
    components: { DsLabel },
  }),
};
