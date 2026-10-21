<script lang="ts">
import type { LabelColor, LabelSize } from '../label/DsLabel.vue';

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'ghost' | 'elevated';
export type ButtonColor = 'primary' | 'success' | 'danger' | 'neutral';
export type ButtonSize = 'XXS' | 'XS' | 'S' | 'M' | 'L';

/** 按鈕內嵌標籤的設定 */
export interface BtnLabelConfig {
  text: string;
  color: LabelColor;
  size?: LabelSize;
}
</script>

<script setup lang="ts">
/**
 * DsButton — 任何可點擊操作（對應 Angular 版 app-button）。
 * 沒有 text 時顯示預設插槽的內容（例如要放粗體字的按鈕）。
 */
import '@mendesky/ds/styles/components/button.scss';
import { computed, ref, watch } from 'vue';
import DsIcon, { type IconSize } from '../icon/DsIcon.vue';
import DsLabel from '../label/DsLabel.vue';
import { vErrorTooltip } from '../../directives/error-tooltip';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    text?: string;
    leftIcon?: string;
    rightIcon?: string;
    /** leftIcon 之後、文字之前的標籤（null＝隱藏） */
    leftLabel?: BtnLabelConfig | null;
    /** leftLabel 之後、文字之前的第二個標籤 */
    centerLabel?: BtnLabelConfig | null;
    /** 文字之後、rightIcon 之前的標籤 */
    rightLabel?: BtnLabelConfig | null;
    disabled?: boolean;
    fullWidth?: boolean;
    loading?: boolean;
    loadingText?: string;
    /** 雙行模式：名稱下方的說明文字。有值時按鈕變 auto height、文字靠左 */
    description?: string;
    /** 鍵盤快速鍵提示文字（例如「⌘N」），只顯示提示，不負責綁定快速鍵 */
    shortcut?: string;
    /** true 時用 aria-disabled 取代原生 disabled，讓點擊仍能觸發 disabledClick */
    clickableWhenDisabled?: boolean;
    /** 停用狀態下點擊後，顯示在按鈕正上方的提示。單條傳 string，多條傳 string[] */
    disabledMessage?: string | string[];
  }>(),
  {
    variant: 'filled',
    color: 'primary',
    size: 'M',
    text: '',
    leftIcon: '',
    rightIcon: '',
    leftLabel: null,
    centerLabel: null,
    rightLabel: null,
    disabled: false,
    fullWidth: false,
    loading: false,
    loadingText: '',
    description: '',
    shortcut: '',
    clickableWhenDisabled: false,
    disabledMessage: () => [],
  },
);

const emit = defineEmits<{
  btnClick: [];
  /** clickableWhenDisabled=true 且 disabled=true 時，點擊觸發 */
  disabledClick: [];
}>();

const disabledClickedOnce = ref(false);

const ICON_PX: Record<ButtonSize, number> = { XXS: 12, XS: 12, S: 14, M: 16, L: 24 };
const iconSizeStr = computed<IconSize>(() => {
  const px = ICON_PX[props.size];
  if (px <= 14) return '12';
  if (px <= 20) return '16';
  if (px <= 28) return '24';
  if (px <= 34) return '32';
  if (px <= 42) return '36';
  return '48';
});
const labelSize = computed<LabelSize>(() => ({ XXS: 'S', XS: 'S', S: 'S', M: 'M', L: 'M' } as const)[props.size]);
const sizeClass = computed(() => `btn--${props.size.toLowerCase()}`);
const variantClass = computed(() => (props.variant === 'elevated' ? 'btn--elevated' : `btn--${props.variant}-${props.color}`));

// 從停用變回可用時，重設「已點過一次」
watch(
  () => props.disabled,
  (cur, prev) => {
    if (prev === true && cur === false) disabledClickedOnce.value = false;
  },
);

const disabledTooltip = computed<string | string[]>(() => {
  if (!props.clickableWhenDisabled || !props.disabled) return '';
  if (!disabledClickedOnce.value) return '';
  return props.disabledMessage;
});

function onClick(): void {
  if (props.loading) return;
  if (props.disabled) {
    if (props.clickableWhenDisabled) {
      disabledClickedOnce.value = true;
      emit('disabledClick');
    }
    return;
  }
  emit('btnClick');
}
</script>

<template>
  <span class="ds-button">
    <button
      class="btn"
      :class="[sizeClass, variantClass, fullWidth ? 'btn--full' : '', loading ? 'btn--loading' : '', description ? 'btn--has-desc' : '']"
      :disabled="(disabled && !clickableWhenDisabled) || loading"
      :aria-disabled="clickableWhenDisabled && disabled ? 'true' : undefined"
      v-error-tooltip="{ message: disabledTooltip, position: 'top' }"
      type="button"
      @click="onClick"
    >
      <span v-if="loading" class="btn__spinner"></span>
      <DsIcon v-if="!loading && leftIcon" :name="leftIcon" :size="iconSizeStr" style="color: currentColor; flex-shrink: 0" />
      <DsLabel v-if="!loading && leftLabel" :text="leftLabel.text" :color="leftLabel.color" :size="leftLabel.size || labelSize" />
      <DsLabel v-if="!loading && centerLabel" :text="centerLabel.text" :color="centerLabel.color" :size="centerLabel.size || labelSize" />
      <span v-if="loading && loadingText" class="btn__text">{{ loadingText }}</span>
      <span v-if="!loading && text" class="btn__text">{{ text }}</span>
      <!-- 投影內容：只在沒給 text 時啟用；沒有內容時 :empty 隱藏，icon-only 按鈕不多出間距 -->
      <span v-if="!loading && !text" class="btn__slot"><slot /></span>
      <span v-if="!loading && description" class="btn__desc">{{ description }}</span>
      <DsLabel v-if="!loading && rightLabel" :text="rightLabel.text" :color="rightLabel.color" :size="rightLabel.size || labelSize" />
      <DsIcon v-if="!loading && rightIcon" :name="rightIcon" :size="iconSizeStr" style="color: currentColor; flex-shrink: 0" />
      <span v-if="!loading && shortcut" class="btn__shortcut">{{ shortcut }}</span>
    </button>
  </span>
</template>
