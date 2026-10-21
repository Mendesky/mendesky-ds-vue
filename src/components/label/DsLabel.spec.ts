import { mount, type VueWrapper } from '@vue/test-utils';
import DsLabel from './DsLabel.vue';

// 移植自 Angular 版 label.component.spec.ts（v0.3.0），逐條對應。
// Angular 版直接讀元件的 hostClasses／textClass／iconColorClass 與三張對照表；Vue 版從 wrapper.vm 讀同名的值。
type Vm = {
  hostClasses: Record<string, boolean>;
  textClass: string;
  iconColorClass: string;
  COLOR_CSS: Record<string, string>;
  TEXT_CLASS: Record<string, string>;
  ICON_CLASS: Record<string, string>;
};
const vm = (w: VueWrapper) => w.vm as unknown as Vm;

describe('DsLabel', () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(DsLabel, { attachTo: document.body });
  });
  afterEach(() => wrapper.unmount());

  it('預設不換行：hostClasses 不含 label--wrap', () => {
    expect(vm(wrapper).hostClasses['label--wrap']).toBeFalsy();
  });

  it('wrap=true 時套用 label--wrap，允許長文字折行', async () => {
    await wrapper.setProps({ wrap: true });
    expect(vm(wrapper).hostClasses['label--wrap']).toBe(true);
  });

  it('wrap=true 的 label 實際 computed white-space 不是 nowrap（外框換行修正）', async () => {
    await wrapper.setProps({
      wrap: true,
      text: '使用者回饋：希望下個版本能支援批次匯入與匯出，並保留目前設定好的篩選條件。',
    });
    const labelEl = wrapper.element.querySelector('.label') as HTMLElement;
    expect(getComputedStyle(labelEl).whiteSpace).not.toBe('nowrap');
  });
});

describe('DsLabel — 類別標示 variant（Purple / GreenOutline）', () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(DsLabel, { attachTo: document.body });
  });
  afterEach(() => wrapper.unmount());

  it('Purple：實心紫底白字', async () => {
    await wrapper.setProps({ color: 'Purple' });
    expect(vm(wrapper).hostClasses['label--purple']).toBe(true);
    expect(vm(wrapper).textClass).toBe('text--white');
    expect(vm(wrapper).iconColorClass).toBe('icon--white');
  });

  it('GreenOutline：白底綠框綠字', async () => {
    await wrapper.setProps({ color: 'GreenOutline' });
    expect(vm(wrapper).hostClasses['label--green-outline']).toBe(true);
    expect(vm(wrapper).textClass).toBe('text--green');
    expect(vm(wrapper).iconColorClass).toBe('icon--green');
  });

  it('GreenOutline 的字重 600 由 DS 這一格提供，不需呼叫端補', async () => {
    await wrapper.setProps({ color: 'GreenOutline', size: 'S', text: '精選' });
    const textEl = wrapper.element.querySelector('.label__text') as HTMLElement;
    expect(getComputedStyle(textEl).fontWeight).toBe('600');
  });

  it('GreenOutline 框與字同色（#5a8c2c）', async () => {
    await wrapper.setProps({ color: 'GreenOutline', text: '精選' });
    const labelEl = wrapper.element.querySelector('.label') as HTMLElement;
    const textEl = wrapper.element.querySelector('.label__text') as HTMLElement;
    expect(getComputedStyle(labelEl).borderTopColor).toBe('rgb(90, 140, 44)');
    expect(getComputedStyle(textEl).color).toBe('rgb(90, 140, 44)');
  });

  it('三張顏色對照表的 key 完全一致——新增 variant 只改其中一張會被抓出來', () => {
    const colorKeys = Object.keys(vm(wrapper).COLOR_CSS).sort();
    const textKeys = Object.keys(vm(wrapper).TEXT_CLASS).sort();
    const iconKeys = Object.keys(vm(wrapper).ICON_CLASS).sort();
    expect(textKeys).toEqual(colorKeys);
    expect(iconKeys).toEqual(colorKeys);
  });

  it('每個 variant 都解析得出 class，不會產生 undefined', async () => {
    const colors = Object.keys(vm(wrapper).COLOR_CSS);
    for (const c of colors) {
      await wrapper.setProps({ color: c });
      expect(Object.keys(vm(wrapper).hostClasses)).not.toContain('undefined');
      expect(vm(wrapper).textClass).toBeDefined();
      expect(vm(wrapper).iconColorClass).toBeDefined();
    }
  });
});
