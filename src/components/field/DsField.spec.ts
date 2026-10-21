import { mount, type VueWrapper } from '@vue/test-utils';
import DsField from './DsField.vue';

// 移植自 Angular 版 field.component.spec.ts（v0.3.0），逐條對應。
// Angular 版用宿主元件包住 app-field；這裡用同樣的 template 字串。

/**
 * `.field-header` 的排版不變式：空間不足時**換行**，不得壓縮標籤文字。
 * 中文可以逐字斷行 → 文字的 min-content 只有 1 個字寬，flex 容器在空間不足時
 * 可以把標籤壓成「一字一行」而完全不溢出。`flex-wrap: wrap` 讓「放不下就換行」優先於「壓縮文字」。
 */
describe('DsField — header 排版（放不下要換行，不得壓縮標籤）', () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(
      {
        components: { DsField },
        template: `
          <div class="host-box" style="width: 366px">
            <DsField label="通知信寄送頻率" hint="（每週寄送、每月寄送）" :required="true">
              <template #action><button style="width: 230px">從 過往通知信寄送頻率 匯入設定</button></template>
              <div style="height: 36px">控制項</div>
            </DsField>
          </div>`,
      },
      { attachTo: document.body },
    );
  });
  afterEach(() => wrapper.unmount());

  it('容器窄 + 長 action → 標籤仍維持單行（不被壓成一字一行）', () => {
    const label = wrapper.element.querySelector('.field-label') as HTMLElement;
    const hint = wrapper.element.querySelector('.field-hint') as HTMLElement;
    expect(label, '.field-label 應存在').toBeTruthy();
    const labelH = label.getBoundingClientRect().height;
    const hintH = hint.getBoundingClientRect().height;
    // 單行高度 = 14px × line-height 1.4 ≈ 19.6px；壓成多行會是它的 2 倍以上
    expect(labelH, `標籤被壓成多行（高 ${labelH.toFixed(1)}px）`).toBeLessThan(30);
    expect(hintH, `hint 被壓成多行（高 ${hintH.toFixed(1)}px）`).toBeLessThan(30);
  });

  it('header 不得水平溢出容器', () => {
    const header = wrapper.element.querySelector('.field-header') as HTMLElement;
    expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
  });
});

/**
 * 空的 `.field-action` 不得佔位：它寬 0，但前面的 6px gap 在 flex 換行計算時仍計入 →
 * 窄欄位會為了這個 0 寬元素多換一行、header 憑空多 6px。
 */
describe('DsField — 空 action 不得造成多餘換行', () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(
      {
        components: { DsField },
        template: `
          <div style="width: 98px">
            <DsField label="鄉鎮市區" :required="true">
              <div style="height: 36px">控制項</div>
            </DsField>
          </div>`,
      },
      { attachTo: document.body },
    );
  });
  afterEach(() => wrapper.unmount());

  it('欄寬 98px（介於「含空 span 需 100.5px」與「不含需 94.5px」之間）→ header 維持單行', () => {
    const header = wrapper.element.querySelector('.field-header') as HTMLElement;
    const h = header.getBoundingClientRect().height;
    // 單行 = 19.6px；空 span 佔位時會多一個 flex 行 → 19.6 + 6(row-gap) = 25.6px
    expect(h, `header 多換了一行（高 ${h.toFixed(1)}px，單行應為 19.6）`).toBeLessThan(22);
  });
});

/** 標題與說明的層級：標題中粗 500、說明（hint）一般 400、emphasis 標題 700。 */
describe('DsField — 標題與說明的字重', () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(
      {
        components: { DsField },
        template: `
          <div>
            <DsField label="資產總額" hint="（元）"><div>控制項</div></DsField>
            <DsField label="群組標題" :emphasis="true"><div>控制項</div></DsField>
          </div>`,
      },
      { attachTo: document.body },
    );
  });
  afterEach(() => wrapper.unmount());

  it('標題中粗 500，說明一般 400', () => {
    const fields = wrapper.element.querySelectorAll('.ds-field');
    const label = fields[0].querySelector('.field-label') as HTMLElement;
    const hint = fields[0].querySelector('.field-hint') as HTMLElement;
    expect(getComputedStyle(label).fontWeight).toBe('500');
    expect(getComputedStyle(hint).fontWeight).toBe('400');
  });

  it('emphasis 標題維持 700', () => {
    const fields = wrapper.element.querySelectorAll('.ds-field');
    const label = fields[1].querySelector('.field-label') as HTMLElement;
    expect(getComputedStyle(label).fontWeight).toBe('700');
  });
});
