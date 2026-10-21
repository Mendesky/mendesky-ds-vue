import type { Meta, StoryObj } from '@storybook/vue3';
import { reactive, ref } from 'vue';
import { DsCheckbox } from '../../index';

const CAPTION_STYLE = 'font-size:11px;color:#686868;';

const meta: Meta<typeof DsCheckbox> = {
  title: '互動元件/Checkbox',
  id: 'checkbox',
  component: DsCheckbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '全有',
      table: { defaultValue: { summary: 'false' } },
    },
    indeterminate: {
      control: 'boolean',
      description: '部分；為 true 時優先顯示「部分」，不管 checked 是什麼',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
      description: 's（框約 16.7px）／m（框 20px）／l（框約 23.3px）',
      table: { defaultValue: { summary: 'm' } },
    },
    label: {
      control: 'text',
      description: '框右邊的文字；點文字也算點勾選框。可省略',
    },
    ariaLabel: {
      control: 'text',
      description: '沒有 label 時一定要給，讀螢幕軟體才唸得出這是什麼',
    },
    disabled: {
      control: 'boolean',
      description: '停用',
      table: { defaultValue: { summary: 'false' } },
    },
    onCheckedChange: { action: 'checkedChange' },
  },
};

export default meta;
type Story = StoryObj<typeof DsCheckbox>;

// ── 主範例：可用 Controls 調整狀態、尺寸與文字 ──────────────
// 文字取自 checkbox.docs.ts／checkbox.component.spec.ts 的範例
export const Default: Story = {
  name: '預設',
  args: {
    checked: false,
    indeterminate: false,
    size: 'm',
    label: '使用者管理',
    ariaLabel: '',
    disabled: false,
  },
};

// ── 三態：沒有／全有／部分 ─────────────────────────────────
export const AllStates: Story = {
  name: '三種狀態',
  render: () => ({
    template: `
      <div style="display:flex;gap:32px;align-items:flex-start;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <DsCheckbox :checked="false" ariaLabel="沒有"></DsCheckbox>
          <span style="${CAPTION_STYLE}">沒有</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <DsCheckbox :checked="true" ariaLabel="全有"></DsCheckbox>
          <span style="${CAPTION_STYLE}">全有</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <DsCheckbox :indeterminate="true" ariaLabel="部分"></DsCheckbox>
          <span style="${CAPTION_STYLE}">部分（只能由呼叫端給）</span>
        </div>
      </div>
    `,
    components: { DsCheckbox },
  }),
};

// ── 尺寸 ───────────────────────────────────────────────────
export const Sizes: Story = {
  name: '尺寸',
  render: () => ({
    template: `
      <div style="display:flex;gap:32px;align-items:center;">
        <DsCheckbox size="s" :checked="true" label="s"></DsCheckbox>
        <DsCheckbox size="m" :checked="true" label="m（預設）"></DsCheckbox>
        <DsCheckbox size="l" :checked="true" label="l"></DsCheckbox>
      </div>
    `,
    components: { DsCheckbox },
  }),
};

// ── 停用 ───────────────────────────────────────────────────
export const Disabled: Story = {
  name: '停用',
  render: () => ({
    template: `
      <div style="display:flex;gap:32px;align-items:center;">
        <DsCheckbox :disabled="true" :checked="false" label="沒有"></DsCheckbox>
        <DsCheckbox :disabled="true" :checked="true" label="全有"></DsCheckbox>
        <DsCheckbox :disabled="true" :indeterminate="true" label="部分"></DsCheckbox>
      </div>
    `,
    components: { DsCheckbox },
  }),
};

// ── v-model 雙向綁定（Angular 版是 ngModel；沒有文字時給 ariaLabel） ──────────────
export const WithNgModel: Story = {
  name: 'v-model 雙向綁定',
  render: () => ({
    setup: () => ({ selected: ref(false) }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <DsCheckbox size="s" v-model="selected" ariaLabel="選取這一列"></DsCheckbox>
        <span style="font-size:12px;color:#686868;">目前值：{{ selected }}</span>
      </div>
    `,
    components: { DsCheckbox },
  }),
};

// ── 分類列：「部分」由呼叫端依子項算出來 ─────────────────────
export const GroupWithChildren: Story = {
  name: '分類列（部分勾選）',
  render: () => {
    const items = reactive([
      { label: '選項一', checked: true },
      { label: '選項二', checked: false },
      { label: '選項三', checked: false },
    ]);
    return {
      setup: () => ({
        items,
        allChecked: () => items.every((i) => i.checked),
        someChecked: () => items.some((i) => i.checked) && !items.every((i) => i.checked),
        toggleAll: (v: boolean) => items.forEach((i) => (i.checked = v)),
      }),
      template: `
        <div style="display:flex;flex-direction:column;gap:8px;">
          <DsCheckbox
            label="全選"
            :checked="allChecked()"
            :indeterminate="someChecked()"
            @checked-change="toggleAll($event)">
          </DsCheckbox>
          <div style="display:flex;flex-direction:column;gap:8px;padding-left:28px;">
            <DsCheckbox
              v-for="item in items"
              :key="item.label"
              size="s"
              :label="item.label"
              :checked="item.checked"
              @checked-change="item.checked = $event">
            </DsCheckbox>
          </div>
        </div>
      `,
      components: { DsCheckbox },
    };
  },
};
