<script lang="ts">
export type InputSize = 'S' | 'M' | 'L';
export type InputMode = 'text' | 'numeric' | 'tel' | 'email' | 'decimal' | 'none';
export type InputSanitize = 'none' | 'digits';

/** placeholder 的預設值；沒改過時不算有意義的提示文字 */
const DEFAULT_PLACEHOLDER = 'Placeholder';

/** 瀏覽器會拿提示文字當名稱的 type；日期、時間類不會 */
const HINT_NAMED_TYPES = new Set(['text', 'search', 'url', 'tel', 'email', 'password', 'number']);
</script>

<script setup lang="ts">
/**
 * DsInput — 單行輸入框（對應 Angular 版 app-input）。
 * 值的傳遞跟 Angular 版相同：initialValue 預填、valueChange 回報每次輸入、blur 回報離開時的值。
 */
import '@mendesky/ds/styles/components/input.scss';
import { computed, getCurrentInstance, inject, onMounted, ref, watch } from 'vue';
import DsIcon from '../icon/DsIcon.vue';
import { vErrorTooltip } from '../../directives/error-tooltip';
import { FIELD_CONTEXT } from '../field/field-context';

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
    /**
     * 報讀軟體念的名稱，落在內層 input 的 aria-label。
     * 直接寫在有標題的 DsField 裡不用設（會念欄位標題）；沒有欄位標題、或包在別的元件裡時才設。設了就只念它，不念欄位標題。
     */
    ariaLabel?: string;
    /** 透傳到內層 input 的 autocomplete（如 username、current-password、new-password、off）；空字串不輸出 */
    autocomplete?: string;
    /** 透傳到內層 input 的 name；空字串不輸出 */
    name?: string;
    /**
     * 內層 input 的 id，給外面自己寫的 label for 指向。
     * 不叫 id：寫在 DsInput 上的 id 會落在外框上，指向它的 label 連不到輸入框。
     */
    inputId?: string;
  }>(),
  {
    size: 'M',
    placeholder: DEFAULT_PLACEHOLDER,
    errorMessage: '',
    errorPosition: 'bottom',
    disabled: false,
    readonly: false,
    initialValue: '',
    type: 'text',
    inputMode: 'text',
    sanitize: 'none',
    ariaLabel: '',
    autocomplete: '',
    name: '',
    inputId: '',
  },
);

const emit = defineEmits<{
  valueChange: [value: string];
  blur: [value: string];
  /** 按眼睛按鈕切換密碼顯示時發出；true＝切成明文 */
  passwordVisibilityChange: [visible: boolean];
}>();

/**
 * 外層的 DsField；它的標題自動成為這個輸入框的報讀名稱。
 * 只連直接寫在 DsField 插槽裡的（上一層元件就是那個 DsField）。包在別的元件裡（例如行內新增）不連，
 * 不然那個元件裡的輸入框會念外層標題、被標成必填。
 */
const fieldContext = inject(FIELD_CONTEXT, null);
const field = fieldContext && getCurrentInstance()?.parent?.uid === fieldContext.ownerUid ? fieldContext : null;

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
  emit('passwordVisibilityChange', showPassword.value);
}

/** ariaLabel 去掉前後空白；只有空白時當成沒設 */
const labelText = computed(() => (props.ariaLabel ?? '').trim());
/** 指向欄位標題的 id；有 ariaLabel 或欄位沒有標題時不輸出（同一時間只輸出一種名稱屬性） */
const labelledBy = computed(() => (labelText.value || !field?.labelText.value ? undefined : field.labelId));
const ariaRequired = computed(() => (field?.required.value ? 'true' : undefined));
/** inputId 去掉前後空白；只有空白當成沒設 */
const idText = computed(() => (props.inputId ?? '').trim());

/** inputId 有值時當作外面有自己的 label 指向它 */
function hasAccessibleName(): boolean {
  if (labelText.value || field?.labelText.value || idText.value) return true;
  if (!HINT_NAMED_TYPES.has(props.type)) return false;
  const hint = (props.placeholder ?? '').trim();
  return hint !== '' && hint !== DEFAULT_PLACEHOLDER;
}

// 只看第一次渲染：完全沒有名稱時，報讀軟體只會念「編輯文字」
onMounted(() => {
  if (!import.meta.env.DEV || hasAccessibleName()) return;
  console.warn('[DsInput] 輸入框沒有報讀名稱。請放進有 label 的 DsField，或設定 ariaLabel；外面有自己的 label 時設定 inputId。');
});

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
          :id="idText || undefined"
          :name="name || undefined"
          :autocomplete="autocomplete || undefined"
          :aria-label="labelText || undefined"
          :aria-labelledby="labelledBy"
          :aria-required="ariaRequired"
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
            aria-label="顯示密碼"
            :aria-pressed="showPassword ? 'true' : 'false'"
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
