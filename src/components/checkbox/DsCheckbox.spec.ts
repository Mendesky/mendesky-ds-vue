import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick, reactive } from 'vue';
import { ICON_REGISTRY } from '@mendesky/ds';
import DsCheckbox, { type CheckboxSize } from './DsCheckbox.vue';

/**
 * 移植自 Angular 版 checkbox.component.spec.ts（v0.3.0），逐條對應。
 * - 三態：沒有 / 全有 / 部分，aria-checked 分別是 false / true / mixed。
 * - 「部分」只由呼叫端給，使用者點不出來：部分 → 全有、全有 → 沒有、沒有 → 全有。
 * - Angular 版的 ngModel 雙向綁定，在 Vue 是 v-model。
 */
describe('DsCheckbox', () => {
  let wrapper: VueWrapper;
  const host = reactive({
    checked: false,
    indeterminate: false,
    size: 'm' as CheckboxSize,
    disabled: false,
    label: '',
    model: false,
    changes: [] as boolean[],
  });

  const button = (sel = '.ctl') => wrapper.element.querySelector(`${sel} button`) as HTMLButtonElement;
  const icon = (sel = '.ctl') => wrapper.element.querySelector(`${sel} .ds-icon`) as HTMLElement;
  const iconName = (sel = '.ctl') =>
    (wrapper.findAllComponents({ name: 'DsIcon' }).find((c) => c.element.closest(sel))!.props('name') as string);

  async function render(patch: Partial<typeof host> = {}): Promise<void> {
    Object.assign(host, patch);
    await nextTick();
  }

  beforeEach(() => {
    Object.assign(host, { checked: false, indeterminate: false, size: 'm', disabled: false, label: '', model: false, changes: [] });
    wrapper = mount(
      {
        components: { DsCheckbox },
        setup: () => ({ host }),
        template: `
          <div>
            <DsCheckbox class="ctl" :checked="host.checked" :indeterminate="host.indeterminate" :size="host.size"
              :disabled="host.disabled" :label="host.label" ariaLabel="使用者管理 整組檢視"
              @checked-change="host.changes.push($event)" />
            <DsCheckbox class="model" v-model="host.model" ariaLabel="綁 v-model" />
          </div>`,
      },
      { attachTo: document.body },
    );
  });
  afterEach(() => wrapper.unmount());

  describe('三種狀態', () => {
    it('沒有：aria-checked="false"、CheckBox 圖示', async () => {
      await render({ checked: false, indeterminate: false });
      expect(button().getAttribute('role')).toBe('checkbox');
      expect(button().getAttribute('aria-checked')).toBe('false');
      expect(iconName()).toBe('CheckBox');
    });

    it('全有：aria-checked="true"、CheckBoxOn 圖示', async () => {
      await render({ checked: true });
      expect(button().getAttribute('aria-checked')).toBe('true');
      expect(iconName()).toBe('CheckBoxOn');
    });

    it('部分：aria-checked="mixed"、CheckBoxMixed 圖示，而且不管 checked 是什麼都顯示部分', async () => {
      await render({ checked: false, indeterminate: true });
      expect(button().getAttribute('aria-checked')).toBe('mixed');
      expect(iconName()).toBe('CheckBoxMixed');
      await render({ checked: true, indeterminate: true });
      expect(button().getAttribute('aria-checked')).toBe('mixed');
    });

    it('沒有＝灰（text/body），全有、部分＝深一階的綠（Color/Green/80）', async () => {
      await render({ checked: false });
      expect(getComputedStyle(icon()).color).toBe('rgb(104, 104, 104)');
      await render({ checked: true });
      expect(getComputedStyle(icon()).color).toBe('rgb(90, 140, 44)');
      await render({ checked: false, indeterminate: true });
      expect(getComputedStyle(icon()).color).toBe('rgb(90, 140, 44)');
    });
  });

  describe('點擊', () => {
    it('沒有 → 全有，送出 true', async () => {
      await render({ checked: false });
      button().click();
      await nextTick();
      expect(host.changes).toEqual([true]);
      expect(button().getAttribute('aria-checked')).toBe('true');
    });

    it('全有 → 沒有，送出 false', async () => {
      await render({ checked: true });
      button().click();
      await nextTick();
      expect(host.changes).toEqual([false]);
      expect(button().getAttribute('aria-checked')).toBe('false');
    });

    it('部分 → 全有，送出 true（checked 原本是 true 也一樣，不會變成沒有）', async () => {
      await render({ checked: true, indeterminate: true });
      button().click();
      await nextTick();
      expect(host.changes).toEqual([true]);
      expect(button().getAttribute('aria-checked')).toBe('true');
    });

    it('點文字也算點勾選框', async () => {
      await render({ label: '檢視' });
      (wrapper.element.querySelector('.ctl .checkbox__label') as HTMLElement).click();
      expect(host.changes).toEqual([true]);
    });
  });

  describe('停用', () => {
    it('點了不送出、狀態不變', async () => {
      await render({ disabled: true, checked: false });
      button().click();
      await nextTick();
      expect(host.changes).toEqual([]);
      expect(button().getAttribute('aria-checked')).toBe('false');
    });

    it('用原生 disabled：不能用 Tab 移到它', async () => {
      await render({ disabled: true });
      expect(button().disabled).toBe(true);
    });

    it('整個元件 45% 透明度', async () => {
      await render({ disabled: true });
      expect(getComputedStyle(button()).opacity).toBe('0.45');
    });
  });

  describe('大小', () => {
    const cases: [CheckboxSize, number][] = [['s', 20], ['m', 24], ['l', 28]];
    for (const [size, px] of cases) {
      it(`${size} 用 ${px} 號圖示`, async () => {
        await render({ size });
        const box = icon().getBoundingClientRect();
        expect(box.width).toBe(px);
        expect(box.height).toBe(px);
      });
    }

    it('可點範圍都大於 24px（WCAG 2.5.8）', async () => {
      for (const [size] of cases) {
        await render({ size });
        const box = button().getBoundingClientRect();
        expect(box.width, size).toBeGreaterThanOrEqual(24);
        expect(box.height, size).toBeGreaterThanOrEqual(24);
      }
    });
  });

  describe('讀螢幕軟體', () => {
    it('沒有 label 時用 ariaLabel', async () => {
      await render({ label: '' });
      expect(button().getAttribute('aria-label')).toBe('使用者管理 整組檢視');
    });

    it('有 label 時用 label 文字，不再另外給 aria-label', async () => {
      await render({ label: '檢視' });
      expect(button().getAttribute('aria-label')).toBeNull();
      expect(button().textContent!.trim()).toBe('檢視');
    });
  });

  it('支援 v-model 雙向綁定', async () => {
    host.model = true;
    await nextTick();
    expect(button('.model').getAttribute('aria-checked')).toBe('true');

    button('.model').click();
    await nextTick();
    expect(host.model).toBe(false);
  });
});

/**
 * 圖示契約：CheckBoxOn / CheckBoxMixed 要能跟 CheckBox / CheckedBox 直接互換。
 * 所以框必須畫在同一個位置，而且只能用 currentColor。
 */
describe('ICON_REGISTRY — 三態勾選框圖示', () => {
  let holder: HTMLDivElement;

  beforeEach(() => {
    holder = document.createElement('div');
    document.body.appendChild(holder);
  });
  afterEach(() => holder.remove());

  function bbox(name: string): DOMRect {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.innerHTML = `<g>${ICON_REGISTRY[name]}</g>`;
    holder.appendChild(svg);
    return (svg.firstElementChild as SVGGraphicsElement).getBBox();
  }

  for (const name of ['CheckBoxOn', 'CheckBoxMixed']) {
    it(`${name} 存在，而且只用 currentColor`, () => {
      const svg = ICON_REGISTRY[name];
      expect(svg).toBeTruthy();
      const colors = svg.match(/(?:fill|stroke)="([^"]+)"/g) ?? [];
      for (const c of colors) {
        expect(c.endsWith('"currentColor"') || c.endsWith('"none"'), c).toBe(true);
      }
    });

    it(`${name} 的框跟 CheckBox 同位置（viewBox 中間 20 格）`, () => {
      const ref = bbox('CheckBox');
      const box = bbox(name);
      expect(box.x).toBeCloseTo(ref.x, 1);
      expect(box.y).toBeCloseTo(ref.y, 1);
      expect(box.width).toBeCloseTo(ref.width, 1);
      expect(box.height).toBeCloseTo(ref.height, 1);
      expect(ref.width).toBeCloseTo(20, 1);
    });
  }
});
