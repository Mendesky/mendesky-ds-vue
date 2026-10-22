export const thingDoc = {
  id: 'button',
  selector: '<DsThing>',
  props: [
    { name: 'text', type: 'string' },
    { name: 'v-model', type: 'boolean' },
    { name: '@btn-click', type: '() => void', isOutput: true },
  ],
  usage: [],
  usageNotes: ['只有 Vue 才有的注意事項', { type: 'warn', content: '用 v-model 綁值' }],
};
