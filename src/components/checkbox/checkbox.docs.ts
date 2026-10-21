import type { ComponentApi } from '../../docs/component-doc';

export const checkboxDoc: ComponentApi = {
  id: 'checkbox',
  selector: '<DsCheckbox>',
  summary: 'checked indeterminate · size: s|m|l · label · ariaLabel · disabled · @checked-change · v-model',
  props: [
    {
      name: 'checked',
      type: 'boolean',
      default: 'false',
      desc: '全有',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      desc: '部分；為 true 時優先顯示「部分」，不管 checked 是什麼。只由呼叫端算出來，使用者點不出這個狀態',
    },
    {
      name: 'size',
      type: "'s' | 'm' | 'l'",
      default: "'m'",
      desc: 's（框約 16.7px）／m（框 20px）／l（框約 23.3px）',
    },
    {
      name: 'label',
      type: 'string',
      default: "''",
      desc: '框右邊的文字；點文字也算點勾選框。可省略',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: "''",
      desc: '沒有 label 時一定要給，讀螢幕軟體才唸得出這是什麼（例：「使用者管理 整組檢視」）',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      desc: '停用',
    },
    {
      name: 'v-model',
      type: 'boolean',
      desc: '雙向綁定（Angular 版的 ngModel）。跟 checked 擇一使用',
    },
    {
      name: '@checked-change',
      type: '(value: boolean) => void',
      desc: '使用者點擊後的新值。沒有 → true、全有 → false、部分 → true',
      isOutput: true,
    },
  ],
  usage: [
    {
      label: '分類列（部分勾選由呼叫端算）',
      code: `<DsCheckbox
  :checked="allSelected()"
  :indeterminate="someSelected()"
  label="使用者管理"
  @checked-change="toggleGroup($event)"
></DsCheckbox>`,
    },
    {
      label: '沒有文字時給 ariaLabel',
      code: `<DsCheckbox size="s" v-model="selected" ariaLabel="選取這一列"></DsCheckbox>`,
    },
  ],
};
