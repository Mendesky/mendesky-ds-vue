<script setup lang="ts">
/**
 * 下拉選單的選項面板（DsSelect 內部使用，對應 Angular 版 app-select-panel）。
 * 由 DsSelect 用 Teleport 掛到 body；位置與 z-index 由浮層定位負責，寬度鎖在觸發框寬度。
 */
import '@mendesky/ds/styles/components/select-panel.scss';
import { ref, watch } from 'vue';
import type { SelectOption } from './DsSelect.vue';

const props = withDefaults(
  defineProps<{
    options?: SelectOption[];
    activeIndex?: number;
    /** min-width／max-width 對齊觸發框寬度（px）；0 表示還沒量到，不設寬度 */
    width?: number;
  }>(),
  { options: () => [], activeIndex: -1, width: 0 },
);

const emit = defineEmits<{ optionSelected: [value: unknown] }>();

const optionEls = ref<HTMLButtonElement[]>([]);

// 鍵盤移動時把目前選項捲進可見範圍
watch(
  () => props.activeIndex,
  (idx) => {
    if (idx >= 0) setTimeout(() => optionEls.value[idx]?.scrollIntoView({ block: 'nearest' }));
  },
);

function select(option: SelectOption): void {
  if (option.disabled) return;
  emit('optionSelected', option.value);
}
</script>

<template>
  <div
    class="ds-select-panel"
    :style="{ position: 'fixed', minWidth: `${width}px`, maxWidth: width ? `${width}px` : undefined }"
  >
    <div class="panel">
      <div class="panel-scroll">
        <button
          v-for="(opt, i) in options"
          :key="i"
          ref="optionEls"
          class="panel-option"
          type="button"
          :class="{ 'panel-option--disabled': opt.disabled, 'panel-option--active': i === activeIndex }"
          :disabled="opt.disabled"
          @mousedown.prevent
          @click="select(opt)"
        >
          {{ opt.label }}
        </button>

        <div v-if="options.length === 0" class="panel-empty">無符合結果</div>
      </div>

      <!-- inset border -->
      <div class="panel-inset-border"></div>
    </div>
  </div>
</template>
