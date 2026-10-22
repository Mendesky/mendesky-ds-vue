// Mendesky Design System — Vue 版（試做中）
// 本體（色彩、字型、圖示資料、工具程式、元件規格）一併轉出，使用端只要從這裡 import。
export * from '@mendesky/ds';

export { default as DsIcon } from './components/icon/DsIcon.vue';
export type { IconSize } from './components/icon/DsIcon.vue';
export { vErrorTooltip, type ErrorTooltipValue } from './directives/error-tooltip';
export { modalStack } from './overlay/modal-stack';
export { positioning, type Placement, type CloseReason, type AttachOptions, type PortalOverlayRef } from './overlay/positioning';
export { default as DsLabel } from './components/label/DsLabel.vue';
export type { LabelColor, LabelSize } from './components/label/DsLabel.vue';
export { default as DsButton } from './components/button/DsButton.vue';
export type { ButtonVariant, ButtonColor, ButtonSize, BtnLabelConfig } from './components/button/DsButton.vue';
export { default as DsField } from './components/field/DsField.vue';
export { default as DsInput } from './components/input/DsInput.vue';
export type { InputSize, InputMode, InputSanitize } from './components/input/DsInput.vue';
export { default as DsCheckbox } from './components/checkbox/DsCheckbox.vue';
export type { CheckboxSize, CheckboxState } from './components/checkbox/DsCheckbox.vue';
export { default as DsSelect } from './components/select/DsSelect.vue';
export type { SelectOption } from './components/select/DsSelect.vue';
export { default as DsDialog } from './components/dialog/DsDialog.vue';
