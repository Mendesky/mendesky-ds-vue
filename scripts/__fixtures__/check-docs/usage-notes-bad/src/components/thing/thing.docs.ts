export const thingDoc = {
  id: 'button',
  selector: '<DsThing>',
  props: [
    { name: 'text', type: 'string' },
    { name: 'v-model', type: 'boolean' },
    { name: '@btn-click', type: '() => void', isOutput: true },
  ],
  usage: [],
  usageNotes: [{ type: 'tip', content: 1 }, 2],
};
