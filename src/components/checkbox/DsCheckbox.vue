<script lang="ts">
export type CheckboxSize = 's' | 'm' | 'l';
export type CheckboxState = 'off' | 'on' | 'mixed';
</script>

<script setup lang="ts">
/**
 * DsCheckbox — 三態勾選框：沒有 / 全有 / 部分（對應 Angular 版 app-checkbox）。
 *
 * 「部分」只由呼叫端算出來（indeterminate），使用者點不出來：
 * 沒有 → 全有、全有 → 沒有、部分 → 全有。點擊後元件先自己清掉部分，之後以呼叫端傳入的值為準。
 * 值可以用 checked＋checkedChange，或 v-model（對應 Angular 版的 ngModel）。
 *
 * 框的大小跟著圖示尺寸走：s＝20 號圖示（框約 16.7px）、m＝24 號（框 20px）、l＝28 號（框約 23.3px）。
 */
import '@mendesky/ds/styles/components/checkbox.scss';
import { computed, ref, watch } from 'vue';
import DsIcon from '../icon/DsIcon.vue';

const ICON_SIZE: Record<CheckboxSize, '20' | '24' | '28'> = { s: '20', m: '24', l: '28' };
const ICON_NAME: Record<CheckboxState, string> = { off: 'CheckBox', on: 'CheckBoxOn', mixed: 'CheckBoxMixed' };

const props = withDefaults(
  defineProps<{
    /** 全有 */
    checked?: boolean;
    /** v-model 的值（跟 checked 擇一使用） */
    modelValue?: boolean;
    /** 部分；為 true 時優先顯示「部分」，不管 checked 是什麼 */
    indeterminate?: boolean;
    size?: CheckboxSize;
    /** 框右邊的文字；點文字也算點勾選框。可省略 */
    label?: string;
    /** 沒有 label 時一定要給，讀螢幕軟體才唸得出這是什麼 */
    ariaLabel?: string;
    disabled?: boolean;
  }>(),
  { checked: false, modelValue: undefined, indeterminate: false, size: 'm', label: '', ariaLabel: '', disabled: false },
);

const emit = defineEmits<{
  /** 使用者點擊後的新值（部分被點一律是 true） */
  checkedChange: [value: boolean];
  'update:modelValue': [value: boolean];
}>();

const isChecked = ref(!!(props.modelValue ?? props.checked));
const isIndeterminate = ref(!!props.indeterminate);

watch(() => props.checked, (v) => (isChecked.value = !!v));
watch(() => props.modelValue, (v) => {
  if (v !== undefined) isChecked.value = !!v;
});
watch(() => props.indeterminate, (v) => (isIndeterminate.value = !!v));

const state = computed<CheckboxState>(() => (isIndeterminate.value ? 'mixed' : isChecked.value ? 'on' : 'off'));
const ariaChecked = computed(() => (state.value === 'mixed' ? 'mixed' : state.value === 'on' ? 'true' : 'false'));
const iconName = computed(() => ICON_NAME[state.value]);
const iconSize = computed(() => ICON_SIZE[props.size] ?? ICON_SIZE.m);

function toggle(): void {
  if (props.disabled) return;
  const next = isIndeterminate.value || !isChecked.value;
  isIndeterminate.value = false;
  isChecked.value = next;
  emit('update:modelValue', next);
  emit('checkedChange', next);
}
</script>

<template>
  <span class="ds-checkbox">
    <button
      type="button"
      role="checkbox"
      class="checkbox"
      :class="{ 'checkbox--on': state === 'on', 'checkbox--mixed': state === 'mixed', 'checkbox--labeled': !!label }"
      :aria-checked="ariaChecked"
      :aria-label="label ? undefined : ariaLabel || undefined"
      :disabled="disabled"
      @click="toggle"
    >
      <DsIcon class="checkbox__icon" :name="iconName" :size="iconSize" />
      <span v-if="label" class="checkbox__label">{{ label }}</span>
    </button>
  </span>
</template>
