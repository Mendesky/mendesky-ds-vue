import { mount } from '@vue/test-utils';
import DsIcon from './DsIcon.vue';

/**
 * 移植自 Angular 版 icon.component.spec.ts（v0.3.0）。
 * 聚焦「未知 icon name 不再靜默失效」的防呆行為。
 * 三態：已知 name 不誤報 / 未知 name 必 warn / 空 name（初始化）不誤報。
 */
describe('DsIcon — 未知 name 開發模式警告', () => {
  afterEach(() => vi.restoreAllMocks());

  it('已知 name（Close）：不應 console.warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(DsIcon, { props: { name: 'Close' } });
    expect(warn).not.toHaveBeenCalled();
  });

  it('未知 name（Info，正是本次誤用值）：應 console.warn 一次且訊息含該 name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(DsIcon, { props: { name: 'Info' } });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.lastCall![0])).toContain('Info');
  });

  it('空 name（初始化未賦值）：不應誤報 warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(DsIcon, { props: { name: '' } });
    expect(warn).not.toHaveBeenCalled();
  });
});

// Vue 版補寫：確認畫出 registry 的圖形、尺寸跟著 size 走（Angular 版靠範例網站目測）
describe('DsIcon — 畫面', () => {
  it('畫出 registry 的圖形，寬高等於 size', () => {
    const wrapper = mount(DsIcon, { props: { name: 'Close', size: '16' }, attachTo: document.body });
    const root = wrapper.element as HTMLElement;
    expect(root.querySelector('svg')!.innerHTML).toContain('<path');
    const box = root.getBoundingClientRect();
    expect(box.width).toBe(16);
    expect(box.height).toBe(16);
    wrapper.unmount();
  });
});
