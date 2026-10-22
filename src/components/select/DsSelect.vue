<script lang="ts">
export interface SelectOption {
  value: unknown;
  label: string;
  disabled?: boolean;
}

function optionsEqual(a: SelectOption[], b: SelectOption[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].value !== b[i].value || a[i].label !== b[i].label || a[i].disabled !== b[i].disabled) return false;
  }
  return true;
}
</script>

<script setup lang="ts">
/**
 * DsSelect — 下拉選單（對應 Angular 版 app-select）。值用 v-model（Angular 版的 ngModel／表單控制項）。
 *
 * 面板用 Teleport 掛到 body，用浮層定位貼在觸發框下方（空間不足時翻到上方）；點外面關閉。
 * 鍵盤：↓／↑ 開啟或移動、Enter／空白鍵 開啟或選定、Tab 選定並離開、Esc 關閉。
 */
import '@mendesky/ds/styles/components/select.scss';
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import DsIcon from '../icon/DsIcon.vue';
import DsSelectPanel from './DsSelectPanel.vue';
import { vErrorTooltip } from '../../directives/error-tooltip';
import { positioning, type PortalOverlayRef } from '../../overlay/positioning';

const props = withDefaults(
  defineProps<{
    modelValue?: unknown;
    options?: SelectOption[];
    placeholder?: string;
    errorMessage?: string;
    size?: 'S' | 'M' | 'L';
    errorPosition?: 'top' | 'bottom';
    /** 可輸入文字過濾選項（會叫出手機鍵盤，需要時才開） */
    searchable?: boolean;
    clearable?: boolean;
    disabled?: boolean;
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    placeholder: '請選擇',
    errorMessage: '',
    size: 'M',
    errorPosition: 'bottom',
    searchable: false,
    clearable: false,
    disabled: false,
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>();

/* ── 內部狀態 ── */
// 內容相同的新陣列不更新，避免連帶重算與重畫面板
const _options = shallowRef<SelectOption[]>(props.options ?? []);
watch(
  () => props.options,
  (val) => {
    const next = val ?? [];
    if (!optionsEqual(_options.value, next)) _options.value = next;
  },
);

const value = ref<unknown>(props.modelValue ?? null);
watch(
  () => props.modelValue,
  (v) => (value.value = v ?? null),
);
const isDisabled = computed(() => props.disabled);
const isOpen = ref(false);
const inputText = ref('');
const activeIndex = ref(-1);
const isFocused = ref(false);
const panelWidth = ref(0);

const triggerWrap = ref<HTMLDivElement | null>(null);
const triggerInput = ref<HTMLInputElement | null>(null);
const triggerDiv = ref<HTMLDivElement | null>(null);
const panel = ref<InstanceType<typeof DsSelectPanel> | null>(null);

/** 已選項目的顯示文字 */
const displayLabel = computed(() => _options.value.find((o) => o.value === value.value)?.label ?? '');
/** 是否有選中值 */
const hasValue = computed(() => value.value !== null && value.value !== undefined);
const hasError = computed(() => !!props.errorMessage);
const inputDisplayValue = computed(() => (isOpen.value ? inputText.value : displayLabel.value));
const inputPlaceholder = computed(() => (isOpen.value ? displayLabel.value || props.placeholder : props.placeholder));
const filteredOptions = computed(() => {
  const q = inputText.value.trim().toLowerCase();
  return q ? _options.value.filter((o) => o.label.toLowerCase().includes(q)) : _options.value;
});

/** 目前的觸發元素（div 或 input，由 searchable 決定） */
const triggerEl = () => (props.searchable ? triggerInput.value : triggerDiv.value);

function setValue(v: unknown): void {
  value.value = v;
  emit('update:modelValue', v);
}

function clearValue(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  setValue(null);
}

/* ── 事件處理 ── */

/** 滑鼠點擊時，focus 與 click 的先後不影響開關（click 才決定） */
let pointerIsDown = false;

function onWrapPointerdown(e: PointerEvent): void {
  e.stopPropagation();
  pointerIsDown = true;
}

function onWrapClick(): void {
  pointerIsDown = false;
  if (isDisabled.value) return;
  if (isOpen.value) close();
  else open();
}

/** focus（Tab 進入或滑鼠點擊）不自動開面板，只標記 isFocused */
function onTriggerFocus(): void {
  isFocused.value = true;
}
function onTriggerBlur(): void {
  isFocused.value = false;
}

function onInput(e: Event): void {
  inputText.value = (e.target as HTMLInputElement).value;
  if (!isOpen.value) open();
  activeIndex.value = -1;
}

function onKeydown(e: KeyboardEvent): void {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (!isOpen.value) {
        open();
        if (activeIndex.value === -1) activeIndex.value = 0;
      } else {
        moveActive(1);
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      if (!isOpen.value) {
        open();
        if (activeIndex.value === -1) activeIndex.value = filteredOptions.value.length - 1;
      } else {
        moveActive(-1);
      }
      break;
    case 'Enter':
    case ' ':
      if (isOpen.value) {
        e.preventDefault();
        e.stopPropagation();
        confirmActive();
      } else if (!isDisabled.value) {
        e.preventDefault();
        e.stopPropagation();
        open();
        if (activeIndex.value === -1) activeIndex.value = 0;
      }
      break;
    case 'Tab':
      if (isOpen.value) confirmActive();
      break;
    case 'Escape':
      if (isOpen.value) e.stopPropagation();
      close();
      triggerEl()?.blur();
      break;
  }
}

function moveActive(dir: 1 | -1): void {
  const opts = filteredOptions.value;
  if (opts.length === 0) return;
  const current = activeIndex.value;
  let next = current === -1 ? (dir === 1 ? 0 : opts.length - 1) : (current + dir + opts.length) % opts.length;
  let attempts = 0;
  while (opts[next]?.disabled && attempts < opts.length) {
    next = (next + dir + opts.length) % opts.length;
    attempts++;
  }
  activeIndex.value = next;
}

function confirmActive(): void {
  const idx = activeIndex.value;
  const opts = filteredOptions.value;
  if (idx >= 0 && idx < opts.length && !opts[idx].disabled) setValue(opts[idx].value);
  close();
}

function onOptionSelected(val: unknown): void {
  setValue(val);
  close();
  // iOS Safari 安全網：補回焦點，讓之後真正離開時的 focusout 能正常觸發
  triggerEl()?.focus();
}

/* ── 面板開關 ── */
let overlayRef: PortalOverlayRef | null = null;

function open(): void {
  if (isOpen.value || isDisabled.value || !triggerWrap.value) return;
  panelWidth.value = triggerWrap.value.getBoundingClientRect().width;
  activeIndex.value = filteredOptions.value.findIndex((o) => o.value === value.value);
  isOpen.value = true;
  triggerEl()?.focus();
  // 面板在下一次畫面更新才出現在 body，之後再交給浮層定位
  nextTick(() => {
    const panelEl = panel.value?.$el as HTMLElement | undefined;
    if (!isOpen.value || !panelEl || !triggerWrap.value) return;
    overlayRef = positioning.attach(triggerWrap.value, panelEl, {
      placement: 'bottom-start',
      gap: 4,
      trackScroll: true,
      scrollContainerStrategy: 'document',
      closeOnClickOutside: true,
      closeOnEscape: false,
      onClose: (reason) => {
        if (reason === 'manual') return;
        close();
      },
    });
  });
}

function close(): void {
  if (!isOpen.value) return;
  const ref = overlayRef;
  overlayRef = null;
  ref?.detach();
  inputText.value = '';
  activeIndex.value = -1;
  isOpen.value = false;
}

onBeforeUnmount(close);

defineExpose({ open, close });
</script>

<template>
  <span class="ds-select">
    <div
      ref="triggerWrap"
      class="select-wrap"
      v-error-tooltip="{ message: errorMessage, position: errorPosition, disabled: isDisabled }"
      :class="{
        'select-wrap--m': size === 'M',
        'select-wrap--s': size === 'S',
        'select-wrap--open': isOpen,
        'select-wrap--focused': isFocused && !isOpen && !isDisabled,
        'select-wrap--actived': hasValue && !isOpen,
        'select-wrap--error': hasError,
        'select-wrap--disabled': isDisabled,
      }"
      @click="onWrapClick"
      @pointerdown="onWrapPointerdown"
    >
      <div class="select-box">
        <!-- 不可輸入模式（預設）：div 觸發，聚焦時不叫出虛擬鍵盤 -->
        <div
          v-if="!searchable"
          ref="triggerDiv"
          class="select-field select-field--readonly"
          :tabindex="isDisabled ? undefined : 0"
          role="combobox"
          :aria-expanded="isOpen"
          :aria-disabled="isDisabled || undefined"
          :class="{ 'select-field--placeholder': !hasValue }"
          @focus="onTriggerFocus"
          @blur="onTriggerBlur"
          @keydown="onKeydown"
        >
          {{ hasValue ? displayLabel : placeholder }}
        </div>

        <!-- 可輸入模式（需明確加 searchable） -->
        <input
          v-else
          ref="triggerInput"
          class="select-field"
          type="text"
          autocomplete="off"
          :placeholder="inputPlaceholder"
          :value="inputDisplayValue"
          :disabled="isDisabled"
          @focus="onTriggerFocus"
          @blur="onTriggerBlur"
          @input="onInput"
          @keydown="onKeydown"
        />

        <div class="select-suffix">
          <button
            v-if="clearable && hasValue && !isDisabled"
            type="button"
            class="select-clear"
            data-testid="select-clear"
            tabindex="-1"
            aria-label="清除"
            @mousedown="clearValue"
            @click.stop
          >
            <DsIcon name="No-X-Cancel" size="16" />
          </button>
          <DsIcon
            name="DownArrow"
            size="16"
            class="select-arrow"
            :class="{ 'select-arrow--open': isOpen }"
            style="color: var(--text/disabled)"
          />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <DsSelectPanel
        v-if="isOpen"
        ref="panel"
        :options="filteredOptions"
        :active-index="activeIndex"
        :width="panelWidth"
        @option-selected="onOptionSelected"
      />
    </Teleport>
  </span>
</template>
