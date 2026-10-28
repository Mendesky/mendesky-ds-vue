<script setup lang="ts">
/**
 * DsField — 表單欄位外框：標題、必填標記、補充說明、右側動作（對應 Angular 版 app-field）。
 * 預設插槽放控制項；具名插槽 action 放標題列最右邊的動作（Angular 版的 [field-action]）。
 */
import '@mendesky/ds/styles/components/field.scss';
import { computed, getCurrentInstance, provide, useId } from 'vue';
import DsLabel from '../label/DsLabel.vue';
import { FIELD_CONTEXT } from './field-context';

const props = withDefaults(
  defineProps<{
    /** 欄位標題文字；不傳則不顯示標題列。非空白時也是直接寫在插槽裡的 DsInput 的報讀名稱 */
    label?: string;
    /** 顯示「必填」標記；直接寫在插槽裡的 DsInput 同時帶 aria-required="true" */
    required?: boolean;
    /** 標題後方的灰字補充說明（如「（每週寄送、每月寄送）」） */
    hint?: string;
    /** 強調樣式：標題加粗 + 標題色 + 下方分隔線；用於唯讀展示區塊 */
    emphasis?: boolean;
  }>(),
  { label: '', required: false, hint: '', emphasis: false },
);

/** 標題元素的 id；裡面的 DsInput 用 aria-labelledby 指向它 */
const labelId = `ds-field-label-${useId()}`;

provide(FIELD_CONTEXT, {
  labelId,
  labelText: computed(() => (props.label ?? '').trim()),
  required: computed(() => !!props.required),
  ownerUid: getCurrentInstance()!.uid,
});
</script>

<template>
  <span class="ds-field">
    <div class="field-wrap">
      <div v-if="label" class="field-header" :class="{ 'field-header--emphasis': emphasis }">
        <span :id="labelId" class="field-label" :class="{ 'field-label--emphasis': emphasis }">{{ label }}</span>
        <span v-if="hint" class="field-hint">{{ hint }}</span>
        <DsLabel v-if="required" color="SoftBlue" size="XXS" text="必填" />
        <span class="field-action"><slot name="action" /></span>
      </div>

      <slot />
    </div>
  </span>
</template>
