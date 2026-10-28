import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, nextTick, reactive } from 'vue';
import DsInput from './DsInput.vue';
import DsField from '../field/DsField.vue';

// 移植自 Angular 版 input.component.spec.ts（v0.3.0），逐條對應。
describe('DsInput', () => {
  let wrapper: VueWrapper;
  const field = () => wrapper.find('.input-field').element as HTMLInputElement;

  beforeEach(() => {
    wrapper = mount(DsInput, { attachTo: document.body });
  });
  afterEach(() => wrapper.unmount());

  describe('事件 blur', () => {
    it('失去焦點時 emit 當前空字串（初始值）', async () => {
      field().dispatchEvent(new Event('blur'));
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('blur')).toEqual([['']]);
    });

    it('使用者輸入後失去焦點時 emit 最新字串值', async () => {
      field().value = '天母西路 1 號';
      field().dispatchEvent(new Event('input'));
      field().dispatchEvent(new Event('blur'));
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('blur')).toEqual([['天母西路 1 號']]);
    });

    it('initialValue 設定後失去焦點時 emit 初始字串', async () => {
      await wrapper.setProps({ initialValue: '忠孝東路四段' });
      field().dispatchEvent(new Event('blur'));
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('blur')).toEqual([['忠孝東路四段']]);
    });

    it('blur 不影響 valueChange — blur 時不觸發 valueChange', async () => {
      field().dispatchEvent(new Event('blur'));
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('valueChange')).toBeUndefined();
    });
  });
});

// Vue 版補寫：Angular 版沒有測到的行為（依 Angular 版程式）
describe('DsInput — 補寫', () => {
  let wrapper: VueWrapper;
  const field = () => wrapper.find('.input-field').element as HTMLInputElement;
  afterEach(() => wrapper.unmount());

  it("sanitize='digits'：輸入或貼上非數字時自動去掉，只送出數字", async () => {
    wrapper = mount(DsInput, { props: { sanitize: 'digits' }, attachTo: document.body });
    field().value = '12-34ab5';
    field().dispatchEvent(new Event('input'));
    await wrapper.vm.$nextTick();
    expect(field().value).toBe('12345');
    expect(wrapper.emitted('valueChange')).toEqual([['12345']]);
  });

  it('有錯誤訊息時外框變紅、顯示錯誤提示；停用時不顯示', async () => {
    wrapper = mount(DsInput, { props: { errorMessage: '格式不正確' }, attachTo: document.body });
    expect(wrapper.find('.input-wrap').classes()).toContain('input-wrap--error');
    expect(document.querySelector('.ds-form-error')!.textContent!.trim()).toBe('格式不正確');
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('.input-wrap').classes()).not.toContain('input-wrap--error');
    expect(document.querySelector('.ds-form-error')).toBeNull();
    expect(field().disabled).toBe(true);
  });

  it('聚焦且有值時出現清除鈕，按下清空並送出空字串', async () => {
    wrapper = mount(DsInput, { props: { initialValue: 'abc' }, attachTo: document.body });
    expect(wrapper.find('.input-clear').exists()).toBe(false);
    await wrapper.find('.input-field').trigger('focus');
    await wrapper.find('.input-clear').trigger('mousedown');
    expect(field().value).toBe('');
    expect(wrapper.emitted('valueChange')).toEqual([['']]);
  });
});

// ── 報讀名稱與憑證欄位（2026-10-28，對應 Angular 版 input.component.spec.ts 同名段落）──

describe('DsInput — 報讀名稱', () => {
  let wrapper: VueWrapper;
  const state = reactive({ label: '帳號', required: false, ariaLabel: '' });
  const field = () => wrapper.find('.input-field').element as HTMLInputElement;
  /** aria-labelledby 指到的元素文字；沒有 aria-labelledby 時是 null */
  const labelledText = (): string | null => {
    const ids = field().getAttribute('aria-labelledby');
    if (ids === null) return null;
    return ids.split(/\s+/).map((id) => document.getElementById(id)?.textContent?.trim() ?? '').join(' ');
  };

  beforeEach(() => {
    Object.assign(state, { label: '帳號', required: false, ariaLabel: '' });
    wrapper = mount(
      {
        components: { DsField, DsInput },
        setup: () => ({ state }),
        template: `
          <DsField :label="state.label" :required="state.required">
            <DsInput :aria-label="state.ariaLabel" placeholder="請輸入帳號" />
          </DsField>`,
      },
      { attachTo: document.body },
    );
  });
  afterEach(() => wrapper.unmount());

  it('放在有標題的 DsField 裡 → 內層 input 的 aria-labelledby 指到標題「帳號」，外框沒有', () => {
    expect(labelledText()).toBe('帳號');
    expect(field().hasAttribute('aria-label')).toBe(false);
    expect(wrapper.find('.ds-input').attributes('aria-labelledby')).toBeUndefined();
  });

  it('同時設 ariaLabel → 只輸出 aria-label，不輸出 aria-labelledby', async () => {
    state.ariaLabel = '登入帳號';
    await nextTick();
    expect(field().getAttribute('aria-label')).toBe('登入帳號');
    expect(field().hasAttribute('aria-labelledby')).toBe(false);
  });

  it('欄位標題改字 → 名稱跟著變；改成空字串 → aria-labelledby 消失', async () => {
    state.label = '甲';
    await nextTick();
    expect(labelledText()).toBe('甲');
    state.label = '乙';
    await nextTick();
    expect(labelledText()).toBe('乙');
    state.label = '';
    await nextTick();
    expect(field().hasAttribute('aria-labelledby')).toBe(false);
  });

  it('欄位標題一開始是空的、之後才載入 → aria-labelledby 跟著出現', async () => {
    state.label = '';
    await nextTick();
    expect(field().hasAttribute('aria-labelledby')).toBe(false);
    state.label = '帳號';
    await nextTick();
    expect(labelledText()).toBe('帳號');
  });

  it('欄位必填 → aria-required="true"；非必填 → 沒有這個屬性', async () => {
    expect(field().hasAttribute('aria-required')).toBe(false);
    state.required = true;
    await nextTick();
    expect(field().getAttribute('aria-required')).toBe('true');
    state.required = false;
    await nextTick();
    expect(field().hasAttribute('aria-required')).toBe(false);
  });

  it('沒有欄位、ariaLabel 只有空白 → aria-label 與 aria-labelledby 都不輸出', () => {
    const solo = mount(DsInput, { props: { ariaLabel: '   ' } });
    const el = solo.find('.input-field').element;
    expect(el.hasAttribute('aria-label')).toBe(false);
    expect(el.hasAttribute('aria-labelledby')).toBe(false);
    solo.unmount();
  });
});

/** 自己寫的元件，模板裡用了 DsInput（例如行內新增） */
const WrappedInput = defineComponent({
  components: { DsInput },
  template: `<DsInput placeholder="輸入後按 Enter" />`,
});

describe('DsInput — 欄位標題只連直接寫在 DsField 插槽裡的輸入框', () => {
  it('包在別的元件裡 → 不連到外層欄位的標題，也不標必填', () => {
    const w = mount({
      components: { DsField, WrappedInput },
      template: `<DsField label="前所資訊及更換原因" :required="true"><WrappedInput /></DsField>`,
    });
    const el = w.find('.input-field').element;
    expect(el.hasAttribute('aria-labelledby')).toBe(false);
    expect(el.hasAttribute('aria-required')).toBe(false);
    w.unmount();
  });

  it('寫在插槽的 v-if、div 裡 → 照樣連到欄位標題、標必填', () => {
    const w = mount(
      {
        components: { DsField, DsInput },
        template: `<DsField label="帳號" :required="true"><div><DsInput v-if="true" placeholder="" /></div></DsField>`,
      },
      { attachTo: document.body },
    );
    const el = w.find('.input-field').element;
    const title = document.getElementById(el.getAttribute('aria-labelledby') ?? '');
    expect(title?.textContent?.trim()).toBe('帳號');
    expect(el.getAttribute('aria-required')).toBe('true');
    w.unmount();
  });
});

describe('DsInput — 憑證欄位', () => {
  let wrapper: VueWrapper;
  const field = () => wrapper.find('.input-field').element as HTMLInputElement;
  const eye = () => wrapper.find('.input-eye').element as HTMLButtonElement;

  beforeEach(() => {
    wrapper = mount(DsInput, {
      props: { type: 'password', autocomplete: 'new-password', name: 'pw', inputId: 'pw-1', placeholder: '請輸入密碼' },
      attachTo: document.body,
    });
  });
  afterEach(() => wrapper.unmount());

  it('autocomplete、name、inputId 落在內層 input；畫面上 #pw-1 只有一個', () => {
    expect(field().getAttribute('autocomplete')).toBe('new-password');
    expect(field().getAttribute('name')).toBe('pw');
    expect(field().id).toBe('pw-1');
    expect(document.querySelectorAll('#pw-1').length).toBe(1);
  });

  it('inputId 只有空白 → 不輸出 id', () => {
    const solo = mount(DsInput, { props: { inputId: '  ' } });
    expect(solo.find('.input-field').element.hasAttribute('id')).toBe(false);
    solo.unmount();
  });

  it('眼睛按鈕：可用 Tab 移到、名稱「顯示密碼」、aria-pressed 跟著切換', async () => {
    expect(eye().getAttribute('tabindex')).not.toBe('-1');
    expect(eye().getAttribute('aria-label')).toBe('顯示密碼');
    expect(eye().getAttribute('aria-pressed')).toBe('false');
    eye().click();
    await nextTick();
    expect(eye().getAttribute('aria-pressed')).toBe('true');
    expect(field().type).toBe('text');
  });

  it('點眼睛 → passwordVisibilityChange 依序發出 true、false', async () => {
    eye().click();
    await nextTick();
    eye().click();
    await nextTick();
    expect(wrapper.emitted('passwordVisibilityChange')).toEqual([[true], [false]]);
    expect(field().type).toBe('password');
  });
});

describe('DsInput — 開發警告（沒有報讀名稱）', () => {
  let warn: ReturnType<typeof vi.spyOn>;
  const inputWarnings = () => warn.mock.calls.filter((args) => String(args[0]).startsWith('[DsInput]'));

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => warn.mockRestore());

  function renderSolo(props: Record<string, string>): void {
    mount(DsInput, { props }).unmount();
  }

  it('提示文字空白、沒有其他名稱 → 警告一次', () => {
    renderSolo({ placeholder: '' });
    expect(inputWarnings().length).toBe(1);
  });

  it('提示文字是預設的「Placeholder」→ 警告', () => {
    renderSolo({});
    expect(inputWarnings().length).toBe(1);
  });

  it('提示文字有意義（「請輸入」）→ 不警告', () => {
    renderSolo({ placeholder: '請輸入' });
    expect(inputWarnings().length).toBe(0);
  });

  it('日期輸入框只有提示文字 → 警告（瀏覽器不拿日期欄的提示文字當名稱）', () => {
    renderSolo({ type: 'date', placeholder: '請選擇日期' });
    expect(inputWarnings().length).toBe(1);
  });

  it('有 ariaLabel → 不警告', () => {
    renderSolo({ placeholder: '', ariaLabel: '登入帳號' });
    expect(inputWarnings().length).toBe(0);
  });

  it('有 inputId（外面有自己的 label for）→ 不警告', () => {
    renderSolo({ placeholder: '', inputId: 'acct' });
    expect(inputWarnings().length).toBe(0);
  });

  it('放在有標題的 DsField 裡 → 不警告', () => {
    mount({
      components: { DsField, DsInput },
      template: `<DsField label="帳號"><DsInput placeholder="" /></DsField>`,
    }).unmount();
    expect(inputWarnings().length).toBe(0);
  });
});
