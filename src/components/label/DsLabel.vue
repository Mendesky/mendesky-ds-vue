<script lang="ts">
export type LabelColor =
  | 'White' | 'Transparent' | 'GreyOutline' | 'LightWhite'
  | 'SoftBlue' | 'Red' | 'Salmon' | 'Green'
  | 'Grey25' | 'Blue' | 'SeaGreen' | 'Grey70'
  | 'Grey16' | 'Error' | 'GreenAll' | 'Golden'
  | 'Purple' | 'GreenOutline'
  | 'KanbanDraft' | 'KanbanOpened' | 'KanbanDealClosed' | 'KanbanArchiving' | 'KanbanArchived';

export type LabelSize = 'M' | 'S' | 'L' | 'XS' | 'XXS';
</script>

<script setup lang="ts">
/**
 * DsLabel — 狀態、分類標籤（對應 Angular 版 app-label）。
 * 三張對照表（底色、文字色、圖示色）與 Angular 版相同；新增顏色三張都要加。
 */
import '@mendesky/ds/styles/components/label.scss';
import { computed } from 'vue';
import DsIcon from '../icon/DsIcon.vue';

const props = withDefaults(
  defineProps<{
    color?: LabelColor;
    size?: LabelSize;
    text?: string;
    showLeftIcon?: boolean;
    /** 指定左側 icon 名稱（registry key）；設定時以 DsIcon 渲染此 icon，覆蓋內建打勾。 */
    leftIconName?: string;
    showRightIcon?: boolean;
    showNumberedList?: boolean;
    truncate?: boolean;
    /** 長文字折行：預設 nowrap（短標籤）；自由文字內容設 true 讓 label 像外框一樣自動換行 */
    wrap?: boolean;
  }>(),
  {
    color: 'LightWhite',
    size: 'L',
    text: 'Label',
    showLeftIcon: false,
    leftIconName: '',
    showRightIcon: false,
    showNumberedList: false,
    truncate: false,
    wrap: false,
  },
);

const COLOR_CSS: Record<LabelColor, string> = {
  LightWhite:  'label--light-white',
  White:       'label--white',
  Transparent: 'label--transparent',
  GreyOutline: 'label--grey-outline',
  SoftBlue:    'label--soft-blue',
  Red:         'label--red',
  Salmon:      'label--salmon',
  Green:       'label--green',
  Grey25:      'label--grey25',
  Blue:        'label--blue',
  SeaGreen:    'label--sea-green',
  Grey70:      'label--grey70',
  Grey16:      'label--grey16',
  Error:       'label--error',
  GreenAll:    'label--green-all',
  Golden:      'label--golden',
  Purple:       'label--purple',
  GreenOutline: 'label--green-outline',
  KanbanDraft:      'label--kanban-draft',
  KanbanOpened:     'label--kanban-opened',
  KanbanDealClosed: 'label--kanban-dealclosed',
  KanbanArchiving:  'label--kanban-archiving',
  KanbanArchived:   'label--kanban-archived',
};

// text color token per color variant (from Figma node 2:27162)
const TEXT_CLASS: Record<LabelColor, string> = {
  LightWhite:  'text--light',   // #939393
  White:       'text--body',    // #686868
  Transparent: 'text--body',    // #686868
  GreyOutline: 'text--body',    // #686868
  Grey16:      'text--body',    // #686868（淺灰底，深字）
  Grey25:      'text--body',    // #686868（淺灰底，深字）
  Green:       'text--body',    // #686868（白底綠框，深字）
  Red:         'text--error',   // #cc5252（白底紅框，紅字）
  SoftBlue:    'text--white',   // white（藍底）
  Blue:        'text--white',   // white（藍底）
  SeaGreen:    'text--white',   // white（綠底）
  Salmon:      'text--white',   // white（橙底）
  Grey70:      'text--white',   // white（深灰底）
  Golden:      'text--white',   // white（金底）
  GreenAll:    'text--white',   // white（淺綠底）
  Error:       'text--white',   // white（紅底）
  Purple:       'text--white',   // white（紫底）
  GreenOutline: 'text--green',   // #5a8c2c 加粗（白底綠框，分類標記）
  KanbanDraft:      'text--body',    // #686868（淺灰 #d3d3d3 底，深字）
  KanbanOpened:     'text--body',    // #686868（CornflowerBlue/30 #bac6fd 底，深字）
  KanbanDealClosed: 'text--white',   // white（CornflowerBlue/50 #8293da 底，白字）
  KanbanArchiving:  'text--white',   // white（CornflowerBlue/70 #5866a0 底，白字）
  KanbanArchived:   'text--white',   // white（CornflowerBlue/90 #333d66 底，白字）
};

const ICON_CLASS: Record<LabelColor, string> = {
  LightWhite:  'icon--light',
  White:       'icon--body',
  Transparent: 'icon--body',
  GreyOutline: 'icon--body',
  Grey16:      'icon--body',
  Grey25:      'icon--body',
  Green:       'icon--body',
  Red:         'icon--error',   // #cc5252
  SoftBlue:    'icon--white',
  Blue:        'icon--white',
  SeaGreen:    'icon--white',
  Salmon:      'icon--white',
  Grey70:      'icon--white',
  Golden:      'icon--white',
  GreenAll:    'icon--white',
  Error:       'icon--white',
  Purple:       'icon--white',
  GreenOutline: 'icon--green',
  KanbanDraft:      'icon--body',
  KanbanOpened:     'icon--body',
  KanbanDealClosed: 'icon--white',
  KanbanArchiving:  'icon--white',
  KanbanArchived:   'icon--white',
};

const hostClasses = computed<Record<string, boolean>>(() => ({
  [`label--${props.size.toLowerCase()}`]: true,
  [COLOR_CSS[props.color]]: true,
  'label--truncate': props.truncate,
  'label--wrap': props.wrap,
}));
const textClass = computed(() => TEXT_CLASS[props.color]);
const iconColorClass = computed(() => ICON_CLASS[props.color]);
</script>

<template>
  <span class="ds-label">
    <div class="label" :class="hostClasses">
      <!-- 左側 icon：leftIconName 設定時用 DsIcon（registry），否則內建 Done-OK 打勾 -->
      <span v-if="showLeftIcon || leftIconName" class="label__icon" :class="iconColorClass">
        <DsIcon v-if="leftIconName" :name="leftIconName" size="16" />
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2.5 8.5L5.5 12L13.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      <!-- Numbered List Badge -->
      <div v-if="showNumberedList" class="label__number-badge">01</div>

      <!-- Text -->
      <span class="label__text" :class="textClass">{{ text }}</span>

      <!-- Right Icon (More dots) -->
      <span v-if="showRightIcon" class="label__icon" :class="iconColorClass">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="4" cy="8" r="1.3" fill="currentColor" />
          <circle cx="8" cy="8" r="1.3" fill="currentColor" />
          <circle cx="12" cy="8" r="1.3" fill="currentColor" />
        </svg>
      </span>
    </div>
  </span>
</template>
