<script setup lang="ts">
withDefaults(defineProps<{ text?: string; modelValue?: boolean }>(), { text: "" });
defineEmits<{ btnClick: []; "update:modelValue": [value: boolean] }>();
</script>
<template><span></span></template>
