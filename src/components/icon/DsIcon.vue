<script lang="ts">
/** 正方形尺寸（px），對應 Figma IconsPlaceHolder；20、28 是勾選框專用 */
export type IconSize = '12' | '16' | '20' | '24' | '28' | '32' | '36' | '48';
</script>

<script setup lang="ts">
/**
 * DsIcon — 通用 SVG 圖示（對應 Angular 版 app-icon）。
 *
 * 用法：<DsIcon name="DownArrow" size="16" />
 * 顏色：透過 CSS color（圖示用 currentColor），例如 <DsIcon name="DownArrow" style="color:#3A9CCD" />
 */
import '@mendesky/ds/styles/components/icon.scss';
import { computed, watchEffect } from 'vue';
import { ICON_REGISTRY } from '@mendesky/ds';

const SIZE_MAP: Record<string, number> = { '12': 12, '16': 16, '20': 20, '24': 24, '28': 28, '32': 32, '36': 36, '48': 48 };

const props = withDefaults(
  defineProps<{
    /** Figma icon 名稱（registry 的 key） */
    name?: string;
    size?: IconSize;
  }>(),
  { name: '', size: '24' },
);

const px = computed(() => SIZE_MAP[props.size] ?? 24);
const paths = computed<string | undefined>(() => ICON_REGISTRY[props.name]);

watchEffect(() => {
  if (props.name && paths.value === undefined && import.meta.env.DEV) {
    console.warn(`[DsIcon] 未知 icon name: "${props.name}"，registry 無此 key，將不顯示。`);
  }
});
</script>

<template>
  <span class="ds-icon" :style="{ width: `${px}px`, height: `${px}px` }">
    <svg
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      v-html="paths ?? ''"
    ></svg>
  </span>
</template>
