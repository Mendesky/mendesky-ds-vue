import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import DsSelect, { type SelectOption } from './DsSelect.vue';

// 移植自 Angular 版 select.component.spec.ts（v0.3.0），逐條對應。
// Angular 版直接讀元件內部的 _options／filteredOptions／displayLabel 與呼叫 open()；Vue 版從 wrapper.vm 讀同名的值。
type Vm = {
  _options: SelectOption[];
  filteredOptions: SelectOption[];
  displayLabel: string;
  open: () => void;
};
const vm = (w: VueWrapper) => w.vm as unknown as Vm;

describe('DsSelect — options equality（防重複更新回歸）', () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(DsSelect, { attachTo: document.body });
  });
  afterEach(() => wrapper.unmount());

  it('TC-EQ1: 相同內容不同引用的 options 不應更新內部選項（避免連帶重算）', async () => {
    const a: SelectOption[] = [{ value: 'tw', label: '台灣' }, { value: 'jp', label: '日本' }];
    const b: SelectOption[] = [{ value: 'tw', label: '台灣' }, { value: 'jp', label: '日本' }];

    await wrapper.setProps({ options: a });
    const refAfterA = vm(wrapper)._options;

    await wrapper.setProps({ options: b });
    const refAfterB = vm(wrapper)._options;

    expect(refAfterB).toBe(refAfterA); // 內部選項未更新，引用相同
  });

  it('TC-EQ2: 內容不同的 options 仍應更新內部選項', async () => {
    const a: SelectOption[] = [{ value: 'tw', label: '台灣' }];
    const b: SelectOption[] = [{ value: 'jp', label: '日本' }];

    await wrapper.setProps({ options: a });
    const refAfterA = vm(wrapper)._options;

    await wrapper.setProps({ options: b });
    const refAfterB = vm(wrapper)._options;

    expect(refAfterB).not.toBe(refAfterA);
    expect(refAfterB[0].value).toBe('jp');
  });
});

describe('DsSelect — dynamic options reactivity', () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(DsSelect, { attachTo: document.body });
  });
  afterEach(() => wrapper.unmount());

  it('TC1: filteredOptions 應在 options 動態更新後反映新值', async () => {
    await wrapper.setProps({ options: [{ value: 'a', label: 'A' }] });
    await wrapper.setProps({ options: [{ value: 'b', label: 'B' }] });

    const filtered = vm(wrapper).filteredOptions;
    expect(filtered.length).toBe(1);
    expect(filtered[0].value).toBe('b');
  });

  it('TC2: displayLabel 應在 options 換為含相同 value 但不同 label 的新陣列後更新', async () => {
    await wrapper.setProps({ options: [{ value: 'tn', label: '台南市' }], modelValue: 'tn' });
    expect(vm(wrapper).displayLabel).toBe('台南市');

    await wrapper.setProps({
      options: [
        { value: 'tn', label: '台南' },
        { value: 'tp', label: '台北' },
      ],
    });

    expect(vm(wrapper).displayLabel).toBe('台南');
  });

  it('TC3: options 切換為空陣列後 filteredOptions 應為空', async () => {
    await wrapper.setProps({ options: [{ value: 'a', label: 'A' }] });
    await wrapper.setProps({ options: [] });
    expect(vm(wrapper).filteredOptions.length).toBe(0);
  });
});

// ── 下拉面板寬度必須等於 trigger ──────────────────
// 面板只設 min-width 時，position:fixed 的寬度是 shrink-to-fit＝min(max-content, 可用寬)，
// 選項一長面板就往外長、手機上貼齊螢幕兩側。
describe('DsSelect — 下拉面板寬度對齊 trigger', () => {
  const LONG: SelectOption[] = [
    { value: 'a', label: '豆類加工食品（豆腐、豆乾、豆皮、豆腐乳、豆豉、豆漿除外）製造' },
    { value: 'b', label: '稻作栽培' },
  ];
  let wrapper: VueWrapper;

  afterEach(() => wrapper.unmount());

  it('長選項 → 面板不得超過 trigger 寬度', async () => {
    wrapper = mount(DsSelect, { props: { options: LONG }, attachTo: document.body });
    const host = wrapper.element as HTMLElement;
    host.style.display = 'block';
    host.style.width = '366px';

    vm(wrapper).open();
    await nextTick();
    await nextTick();

    const panel = document.querySelector('.ds-select-panel') as HTMLElement | null;
    expect(panel, '面板應已開啟').toBeTruthy();
    const trigger = host.querySelector('.select-box') as HTMLElement;
    const tw = trigger.getBoundingClientRect().width;
    const pw = panel!.getBoundingClientRect().width;
    expect(pw, `面板 ${pw.toFixed(1)}px 比 trigger ${tw.toFixed(1)}px 寬`).toBeLessThanOrEqual(tw);
  });
});

// Vue 版補寫：鍵盤、點外面、停用、清除（依 Angular 版程式行為）
describe('DsSelect — 操作', () => {
  const OPTS: SelectOption[] = [
    { value: 'tw', label: '台灣' },
    { value: 'jp', label: '日本', disabled: true },
    { value: 'kr', label: '韓國' },
  ];
  let wrapper: VueWrapper;
  const panel = () => document.querySelector('.ds-select-panel') as HTMLElement | null;
  const active = () => panel()?.querySelector('.panel-option--active')?.textContent?.trim();
  const trigger = () => wrapper.find('[role="combobox"]');
  const settle = async () => {
    await nextTick();
    await nextTick();
  };

  beforeEach(() => {
    wrapper = mount(DsSelect, { props: { options: OPTS, 'onUpdate:modelValue': (v: unknown) => wrapper.setProps({ modelValue: v }) }, attachTo: document.body });
  });
  afterEach(() => wrapper.unmount());

  it('↓ 開啟面板並停在第一項；再按 ↓ 跳過停用的選項', async () => {
    await trigger().trigger('keydown', { key: 'ArrowDown' });
    await settle();
    expect(panel()).not.toBeNull();
    expect(active()).toBe('台灣');
    await trigger().trigger('keydown', { key: 'ArrowDown' });
    await settle();
    expect(active()).toBe('韓國');
  });

  it('Enter 選定目前項目並關閉面板', async () => {
    await trigger().trigger('keydown', { key: 'ArrowDown' });
    await trigger().trigger('keydown', { key: 'ArrowDown' });
    await trigger().trigger('keydown', { key: 'Enter' });
    await settle();
    expect(wrapper.emitted('update:modelValue')).toEqual([['kr']]);
    expect(panel()).toBeNull();
    expect(trigger().text()).toBe('韓國');
  });

  it('Esc 關閉面板、不改值', async () => {
    await trigger().trigger('keydown', { key: 'ArrowDown' });
    await settle();
    await trigger().trigger('keydown', { key: 'Escape' });
    await settle();
    expect(panel()).toBeNull();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('點選項選定；點面板外面關閉', async () => {
    await wrapper.find('.select-wrap').trigger('click');
    await settle();
    (panel()!.querySelectorAll('.panel-option')[0] as HTMLElement).click();
    await settle();
    expect(wrapper.emitted('update:modelValue')).toEqual([['tw']]);
    expect(panel()).toBeNull();

    await wrapper.find('.select-wrap').trigger('click');
    await settle();
    expect(panel()).not.toBeNull();
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await settle();
    expect(panel()).toBeNull();
  });

  it('停用時點了不開、不能用 Tab 移到', async () => {
    await wrapper.setProps({ disabled: true });
    await wrapper.find('.select-wrap').trigger('click');
    await settle();
    expect(panel()).toBeNull();
    expect(trigger().attributes('tabindex')).toBeUndefined();
    expect(trigger().attributes('aria-disabled')).toBe('true');
  });

  it('clearable：有值時出現清除鈕，按下清成 null', async () => {
    await wrapper.setProps({ clearable: true, modelValue: 'tw' });
    await wrapper.find('[data-testid="select-clear"]').trigger('mousedown');
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]]);
    expect(trigger().text()).toBe('請選擇');
  });

  it('searchable：輸入文字過濾選項，沒有符合時顯示「無符合結果」', async () => {
    await wrapper.setProps({ searchable: true });
    const input = wrapper.find('input.select-field');
    (input.element as HTMLInputElement).value = '韓';
    await input.trigger('input');
    await settle();
    expect(Array.from(panel()!.querySelectorAll('.panel-option')).map((b) => b.textContent!.trim())).toEqual(['韓國']);
    (input.element as HTMLInputElement).value = '美';
    await input.trigger('input');
    await settle();
    expect(panel()!.querySelector('.panel-empty')!.textContent!.trim()).toBe('無符合結果');
  });
});

// 行為比對（scripts/compare/behavior.mjs）抓到的差異：選項很多時按 ↑ 開啟，
// Angular 版面板一出現就捲到目前項目（最後一項），Vue 版原本沒有捲。
describe('DsSelect — 面板一開啟就捲到目前項目', () => {
  const MANY: SelectOption[] = Array.from({ length: 22 }, (_, i) => ({ value: i, label: `選項 ${i + 1}` }));
  let wrapper: VueWrapper;
  afterEach(() => wrapper.unmount());

  it('↑ 開啟（目前項目＝最後一項）→ 最後一項在面板可見範圍內', async () => {
    wrapper = mount(DsSelect, { props: { options: MANY }, attachTo: document.body });
    await wrapper.find('[role="combobox"]').trigger('keydown', { key: 'ArrowUp' });
    await nextTick();
    await new Promise((r) => setTimeout(r, 50));
    const scroll = document.querySelector('.ds-select-panel .panel-scroll') as HTMLElement;
    const active = document.querySelector('.ds-select-panel .panel-option--active') as HTMLElement;
    expect(active.textContent!.trim()).toBe('選項 22');
    const s = scroll.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    expect(a.top >= s.top && a.bottom <= s.bottom + 1, `目前項目 ${a.top}-${a.bottom} 不在 ${s.top}-${s.bottom} 內`).toBe(true);
  });
});
