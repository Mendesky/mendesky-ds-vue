import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { vErrorTooltip } from './error-tooltip';
import { modalStack } from '../overlay/modal-stack';

// Angular 版的錯誤提示沒有自己的測試（由各表單元件間接驗）；這裡依它的程式行為補上。
const message = ref<string | string[]>('');
const position = ref<'top' | 'bottom'>('bottom');
const disabled = ref(false);

const Host = defineComponent({
  directives: { errorTooltip: vErrorTooltip },
  setup: () => ({ message, position, disabled }),
  template: `<div class="wrap" style="width:200px;height:30px;margin-top:200px"
    v-error-tooltip="{ message, position, disabled }">欄位</div>`,
});

const portal = () => document.querySelector('.ds-form-error') as HTMLElement | null;
const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));

describe('vErrorTooltip', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    message.value = '';
    position.value = 'bottom';
    disabled.value = false;
    wrapper = mount(Host, { attachTo: document.body });
  });

  afterEach(() => {
    wrapper.unmount();
    modalStack.unregister('test-modal');
  });

  it('沒有訊息時不顯示提示', () => {
    expect(portal()).toBeNull();
    expect(wrapper.find('.wrap').classes()).not.toContain('has-error-tooltip');
  });

  it('有訊息時把提示掛到 body，並貼在欄位下方', async () => {
    message.value = '必填';
    await nextTick();
    await frame();
    const el = portal();
    expect(el).not.toBeNull();
    expect(el!.parentElement!.parentElement).toBe(document.body);
    expect(el!.textContent!.trim()).toBe('必填');
    expect(el!.querySelector('.form-error-tooltip__arrow--up')).not.toBeNull();
    const field = wrapper.find('.wrap').element.getBoundingClientRect();
    expect(el!.getBoundingClientRect().top).toBeGreaterThanOrEqual(field.bottom);
    expect(wrapper.find('.wrap').classes()).toContain('has-error-tooltip');
  });

  it('position=top：貼在欄位上方、箭頭朝下', async () => {
    position.value = 'top';
    message.value = '必填';
    await nextTick();
    await frame();
    const el = portal()!;
    expect(el.querySelector('.form-error-tooltip__arrow--down')).not.toBeNull();
    const field = wrapper.find('.wrap').element.getBoundingClientRect();
    expect(el.getBoundingClientRect().bottom).toBeLessThanOrEqual(field.top);
  });

  it('多條訊息顯示成清單；一條時顯示文字', async () => {
    message.value = ['第一條', '第二條'];
    await nextTick();
    expect(portal()!.querySelectorAll('li').length).toBe(2);
    message.value = ['只有一條'];
    await nextTick();
    expect(portal()!.querySelector('li')).toBeNull();
    expect(portal()!.textContent!.trim()).toBe('只有一條');
  });

  it('訊息清空或停用時收起提示', async () => {
    message.value = '必填';
    await nextTick();
    expect(portal()).not.toBeNull();
    disabled.value = true;
    await nextTick();
    expect(portal()).toBeNull();
    expect(wrapper.find('.wrap').classes()).not.toContain('has-error-tooltip');
    disabled.value = false;
    await nextTick();
    expect(portal()).not.toBeNull();
    message.value = '';
    await nextTick();
    expect(portal()).toBeNull();
  });

  it('開了新的 modal 時暫時收起，modal 關掉後重新顯示', async () => {
    message.value = '必填';
    await nextTick();
    expect(portal()).not.toBeNull();
    modalStack.register('test-modal');
    await nextTick();
    expect(portal()).toBeNull();
    modalStack.unregister('test-modal');
    await nextTick();
    expect(portal()).not.toBeNull();
  });

  it('元件移除時一併移除提示', async () => {
    message.value = '必填';
    await nextTick();
    wrapper.unmount();
    expect(portal()).toBeNull();
    wrapper = mount(Host, { attachTo: document.body });
  });
});
