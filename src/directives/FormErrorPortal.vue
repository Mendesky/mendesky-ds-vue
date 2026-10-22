<script setup lang="ts">
// 錯誤提示框：由 vErrorTooltip 建立並掛到 document.body，避免被外層的 overflow: hidden、transform 裁掉。
// 移植自 Angular 版 FormErrorPortalComponent（v0.3.0）。
import '@mendesky/ds/styles/components/form-error.scss';
import { computed } from 'vue';

const props = defineProps<{
  errorMessage: string | string[];
  errorPosition: 'top' | 'bottom';
}>();

const isMultiLine = computed(() => Array.isArray(props.errorMessage) && props.errorMessage.length > 1);
const textContent = computed(() =>
  Array.isArray(props.errorMessage) ? props.errorMessage[0] || '' : props.errorMessage,
);
const listItems = computed(() => (Array.isArray(props.errorMessage) ? props.errorMessage : []));
</script>

<template>
  <div
    class="ds-form-error"
    :class="{
      'form-error-portal--bottom': errorPosition === 'bottom',
      'form-error-portal--top': errorPosition === 'top',
    }"
  >
    <div v-if="errorPosition === 'bottom'" class="form-error-tooltip__arrow--up"></div>
    <div class="form-error-tooltip__box">
      <ul v-if="isMultiLine" class="form-error-tooltip__list">
        <li v-for="(item, i) in listItems" :key="i">{{ item }}</li>
      </ul>
      <template v-else>{{ textContent }}</template>
    </div>
    <div v-if="errorPosition === 'top'" class="form-error-tooltip__arrow--down"></div>
  </div>
</template>
