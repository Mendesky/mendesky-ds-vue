<script setup lang="ts">
withDefaults(defineProps<{ text?: string; autoClose?: boolean; modelValue?: boolean; open?: boolean }>(), { text: "" });
defineEmits<{ btnClick: []; "update:modelValue": [value: boolean]; "update:open": [value: boolean] }>();
</script>
<template><span></span></template>
