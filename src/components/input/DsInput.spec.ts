import { mount, type VueWrapper } from '@vue/test-utils';
import DsInput from './DsInput.vue';

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
