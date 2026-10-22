<script lang="ts">
export type InputSize = 'S' | 'M' | 'L';
export type InputMode = 'text' | 'numeric' | 'tel' | 'email' | 'decimal' | 'none';
export type InputSanitize = 'none' | 'digits';
</script>

<script setup lang="ts">
/**
 * DsInput — 單行輸入框（對應 Angular 版 app-input）。
 * 值的傳遞跟 Angular 版相同：initialValue 預填、valueChange 回報每次輸入、blur 回報離開時的值。
 */
import '@mendesky/ds/styles/components/input.scss';
import { computed, ref, watch } from 'vue';
import DsIcon from '../icon/DsIcon.vue';
import { vErrorTooltip } from '../../directives/error-tooltip';

const props = withDefaults(
  defineProps<{
    size?: InputSize;
    placeholder?: string;
    /** 錯誤訊息；有值時切換為錯誤狀態 */
    errorMessage?: string;
    /** 錯誤提示顯示方向 */
    errorPosition?: 'top' | 'bottom';
    disabled?: boolean;
    /** 唯讀：不可編輯，但文字維持正常色、可聚焦選取（展示型欄位用，如分享連結） */
    readonly?: boolean;
    /** 預填值；外部可透過它設定初始值或同步更新 */
    initialValue?: string;
    /** input type（text / date / email / number / password 等） */
    type?: string;
    /** 行動裝置鍵盤型態（透傳至原生 inputmode） */
    inputMode?: InputMode;
    /** 輸入時自動過濾；'digits' = 只保留數字（含貼上） */
    sanitize?: InputSanitize;
  }>(),
  {
    size: 'M',
    placeholder: 'Placeholder',
    errorMessage: '',
    errorPosition: 'bottom',
    disabled: false,
    readonly: false,
    initialValue: '',
    type: 'text',
    inputMode: 'text',
    sanitize: 'none',
  },
);

const emit = defineEmits<{
  valueChange: [value: string];
  blur: [value: string];
}>();

const value = ref(props.initialValue ?? '');
const showPassword = ref(false);
const focused = ref(false);

watch(
  () => props.initialValue,
  (v) => {
    value.value = v ?? '';
  },
);

const effectiveType = computed(() => (props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type));
const hasValue = computed(() => value.value.length > 0);

const wrapClasses = computed<Record<string, boolean>>(() => ({
  [`input-wrap--${props.size.toLowerCase()}`]: true,
  'input-wrap--disabled': props.disabled,
  'input-wrap--readonly': props.readonly && !props.disabled,
  'input-wrap--error': !props.disabled && !!props.errorMessage,
  'input-wrap--focus': !props.disabled && !props.errorMessage && focused.value,
  'input-wrap--actived': !props.disabled && !props.errorMessage && !focused.value && hasValue.value,
}));

function togglePassword(): void {
  showPassword.value = !showPassword.value;
}

function onInput(event: Event): void {
  const inputEl = event.target as HTMLInputElement;
  let raw = inputEl.value;

  if (props.sanitize === 'digits') {
    const cursorPos = inputEl.selectionStart ?? raw.length;
    const nonDigitsBefore = (raw.slice(0, cursorPos).match(/\D/g) ?? []).length;
    const cleaned = raw.replace(/\D/g, '');
    if (cleaned !== raw) {
      inputEl.value = cleaned;
      const newCursor = Math.max(0, cursorPos - nonDigitsBefore);
      inputEl.setSelectionRange(newCursor, newCursor);
    }
    raw = cleaned;
  }

  value.value = raw;
  emit('valueChange', raw);
}

function onFocus(): void {
  focused.value = true;
}

function onBlur(): void {
  focused.value = false;
  emit('blur', value.value);
}

function clearValue(event: MouseEvent): void {
  event.preventDefault();
  value.value = '';
  emit('valueChange', '');
}
</script>

<template>
  <span class="ds-input">
    <div
      class="input-wrap"
      :class="wrapClasses"
      v-error-tooltip="{ message: errorMessage, position: errorPosition, disabled }"
    >
      <div class="input-box">
        <input
          class="input-field"
          :type="effectiveType"
          :inputmode="inputMode"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :value="value"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />

        <div class="input-suffix">
          <button
            v-if="type === 'password'"
            class="input-eye"
            type="button"
            tabindex="-1"
            aria-label="切換密碼顯示"
            @click="togglePassword"
          >
            <DsIcon :name="showPassword ? 'eye-off' : 'eye'" size="16" />
          </button>

          <button
            v-if="focused && hasValue && type !== 'password' && !readonly"
            class="input-clear"
            type="button"
            tabindex="-1"
            aria-label="清除"
            @mousedown="clearValue"
          >
            <DsIcon name="No-X-Cancel" size="16" />
          </button>
        </div>
      </div>
    </div>
  </span>
</template>
