import type { ComponentApi } from '../../docs/component-doc';

export const selectDoc: ComponentApi = {
  id: 'select',
  selector: '<DsSelect>',
  summary: 'options: SelectOption[] · placeholder size: S|M|L · clearable errorMessage errorPosition: top|bottom · v-model 控制值 · disabled',
  props: [
    {
      name: 'v-model',
      type: 'unknown',
      desc: '選中的值（選項的 value；沒選是 null）。Angular 版用 ngModel／表單控制項',
    },
    {
      name: 'options',
      type: 'SelectOption[]',
      default: '[]',
      desc: '選項列表：{ value, label, disabled? }',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "'請選擇'",
      desc: '未選中時的佔位文字',
    },
    {
      name: 'size',
      type: "'S' | 'M' | 'L'",
      default: "'L'",
      desc: 'L=40px、M=36px、S=32px（觸發框高度）',
    },
    {
      name: 'errorMessage',
      type: 'string',
      default: "''",
      desc: '錯誤訊息；有值時切換 error 狀態',
    },
    {
      name: 'errorPosition',
      type: "'top' | 'bottom'",
      default: "'bottom'",
      desc: '錯誤 tooltip 顯示方向（浮動，不佔版面）',
    },
    {
      name: 'clearable',
      type: 'boolean',
      default: 'false',
      desc: '為 true 時，select 有選中值的情況下右側顯示清除 icon（No-X-Cancel 16px）；點擊清除會將值設為 null',
    },
    {
      name: 'searchable',
      type: 'boolean',
      default: 'false',
      desc: '觸發區改成可輸入的搜尋框，邊打字邊篩選選項',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      desc: '停用；停用時不能開啟下拉',
    },
  ],
  usage: [
    {
      label: '搭配 DsField 使用',
      code: `<DsField label="部門" :required="true">
  <DsSelect
    :options="departmentOptions"
    placeholder="請選擇部門"
    :errorMessage="form.departmentError"
    v-model="form.department"
  ></DsSelect>
</DsField>`,
    },
    {
      label: 'options 格式',
      code: `// <script setup lang="ts">
const departmentOptions: SelectOption[] = [
  { value: 'design',      label: '設計部' },
  { value: 'engineering', label: '工程部' },
  { value: 'admin',       label: '行政部', disabled: true },
];`,
    },
  ],
};
