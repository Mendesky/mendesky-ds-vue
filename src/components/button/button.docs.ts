import type { ComponentApi } from '../../docs/component-doc';

export const buttonDoc: ComponentApi = {
  id: 'button',
  selector: '<DsButton>',
  summary: 'variant: filled|tonal|outlined|ghost|elevated · color: primary|success|danger|neutral · size: XXS|XS|S|M|L · leftIcon/rightIcon · disabled fullWidth loading · clickableWhenDisabled disabledMessage · ariaLabel ariaPressed ariaCurrent · @btn-click @disabled-click',
  props: [
    {
      name: 'variant',
      type: 'ButtonVariant',
      default: "'filled'",
      desc: 'filled | tonal | outlined | ghost | elevated',
    },
    {
      name: 'color',
      type: 'ButtonColor',
      default: "'primary'",
      desc: 'primary | success | danger | neutral（elevated 不需指定）',
    },
    {
      name: 'size',
      type: 'ButtonSize',
      default: "'M'",
      desc: 'XXS(17px) | XS(24px) | S(32px) | M(36px) | L(40px)',
    },
    {
      name: 'text',
      type: 'string',
      default: "''",
      desc: '按鈕文字',
    },
    {
      name: 'leftIcon',
      type: 'string',
      desc: '左側 icon 名稱（icon registry）',
    },
    {
      name: 'rightIcon',
      type: 'string',
      desc: '右側 icon 名稱',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      desc: '禁用狀態',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      default: 'false',
      desc: '撐滿父容器寬度',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      desc: '載入中狀態；底色不變，spinner 取代 icon，點擊無效',
    },
    {
      name: 'loadingText',
      type: 'string',
      default: "''",
      desc: 'loading=true 時顯示的替換文字（選填）',
    },
    {
      name: 'description',
      type: 'string',
      default: "''",
      desc: '雙行模式：名稱下方的說明文字。有值時 height:auto、文字靠左，適合 action-menu 列表項目',
    },
    {
      name: 'shortcut',
      type: 'string',
      default: "''",
      desc: '鍵盤快速鍵提示（e.g. "⌘N"），顯示在按鈕右側。主要用於 action-menu 選項，參考 Fluent UI secondaryContent 模式。只顯示提示，不綁定快速鍵行為。',
    },
    {
      name: 'clickableWhenDisabled',
      type: 'boolean',
      default: 'false',
      desc: 'true 時改用 aria-disabled 取代原生 disabled，讓點擊事件仍可穿透。適用於「需顯示 disabled 原因」的主動作按鈕。',
    },
    {
      name: 'disabledMessage',
      type: 'string | string[]',
      default: '[]',
      desc: 'clickableWhenDisabled=true 且 disabled=true 時，點擊按鈕上方顯示的 tooltip 訊息。單條傳 string，多條傳 string[]（以 bullet list 呈現）。',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: "''",
      desc: '報讀軟體念的名稱，套在內層 button 的 aria-label。只有圖示、沒有文字時必填；沒填時開發模式會在 console 警告。寫成 aria-label 屬性也會被當成這個 prop，落在內層 button。',
    },
    {
      name: 'ariaPressed',
      type: 'boolean | null',
      default: 'null',
      desc: '切換鈕的按下／未按下狀態，套在內層 button 的 aria-pressed。null 表示不是切換鈕，不輸出。',
    },
    {
      name: 'ariaCurrent',
      type: 'ButtonAriaCurrent | null',
      default: 'null',
      desc: "清單或導覽中的「目前這一項」，套在內層 button 的 aria-current。值為 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'；null 不輸出。",
    },
    {
      name: '@btn-click',
      type: '() => void',
      desc: '正常點擊事件輸出',
      isOutput: true,
    },
    {
      name: '@disabled-click',
      type: '() => void',
      desc: 'clickableWhenDisabled=true 且 disabled=true 時，點擊觸發。父層監聽後可執行 scroll 到第一個欄位錯誤等操作。',
      isOutput: true,
    },
    {
      name: 'leftLabel',
      type: 'BtnLabelConfig | null',
      default: 'null',
      desc: 'leftIcon 之後、文字之前的 DsLabel；null 為不顯示。格式 { text, color, size? }',
    },
    {
      name: 'centerLabel',
      type: 'BtnLabelConfig | null',
      default: 'null',
      desc: 'leftLabel 之後、文字之前的第二個 DsLabel；null 為不顯示',
    },
    {
      name: 'rightLabel',
      type: 'BtnLabelConfig | null',
      default: 'null',
      desc: '文字之後、rightIcon 之前的 DsLabel；null 為不顯示',
    },
  ],
  usage: [
    {
      label: '基本用法',
      code: `<DsButton
  variant="filled"
  color="primary"
  size="M"
  text="確認"
  leftIcon="Done-OK"
  :disabled="false"
  :fullWidth="false"
  @btn-click="onConfirm()"
></DsButton>`,
    },
    {
      label: '只有圖示時給名稱',
      code: `<DsButton
  variant="outlined"
  color="neutral"
  size="XS"
  leftIcon="LeftArrow"
  ariaLabel="上一頁"
  @btn-click="goToPrevPage()"
></DsButton>`,
    },
  ],
};
