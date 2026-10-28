// 規格第 2 版欄位（部位、狀態、無障礙、可以／不要這樣做）屬於本體，不該出現在 Vue 說明檔
export const thingDoc = {
  id: 'button',
  selector: '<DsThing>',
  props: [
    { name: 'text', type: 'string' },
    { name: 'v-model', type: 'boolean' },
    { name: '@btn-click', type: '() => void', isOutput: true },
  ],
  usage: [],
  anatomy: [{ name: '外框', description: '可以點的範圍' }],
  states: [{ name: '停用', description: '灰底灰字' }],
  a11y: { keyboard: ['Tab 移到元件'] },
  dos: [{ text: '給 loadingText' }],
  donts: [{ text: '不要巢狀' }],
};
