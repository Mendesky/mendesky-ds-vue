import { mount, type VueWrapper } from '@vue/test-utils';
import { userEvent } from '@vitest/browser/context';
import { nextTick } from 'vue';
import DsDialog from './DsDialog.vue';
import { modalStack } from '../../overlay/modal-stack';

// Angular 版的 dialog 沒有單元測試；以下依本體元件規格（dialog）與 Angular 版程式行為補寫。
const overlay = () => document.querySelector('.dialog-overlay') as HTMLElement | null;
const card = () => document.querySelector('.dialog-card') as HTMLElement | null;
const buttons = () => Array.from(document.querySelectorAll('.dialog-actions .ds-button')) as HTMLElement[];
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('DsDialog — 開關', () => {
  let wrapper: VueWrapper;
  afterEach(() => wrapper.unmount());

  it('isOpen=false 不顯示；true 時顯示在 body 最上層、宣告為對話框', async () => {
    wrapper = mount(DsDialog, { props: { isOpen: false, header: '刪除項目', content: '刪除後無法復原。' }, attachTo: document.body });
    expect(overlay()).toBeNull();
    await wrapper.setProps({ isOpen: true });
    expect(overlay()).not.toBeNull();
    expect(overlay()!.closest('.ds-dialog')!.parentElement).toBe(document.body);
    expect(card()!.getAttribute('role')).toBe('dialog');
    expect(card()!.getAttribute('aria-modal')).toBe('true');
    expect(document.querySelector('.dialog-header-title')!.textContent).toBe('刪除項目');
    expect(document.querySelector('.dialog-content')!.textContent).toBe('刪除後無法復原。');
  });

  it('關閉時先播退場動畫（約 250ms）再移除', async () => {
    wrapper = mount(DsDialog, { props: { isOpen: true }, attachTo: document.body });
    await wrapper.setProps({ isOpen: false });
    expect(overlay()!.classList).toContain('dialog-overlay--leaving');
    expect(card()!.classList).toContain('dialog-card--leaving');
    await wait(300);
    expect(overlay()).toBeNull();
  });
});

describe('DsDialog — 按鈕', () => {
  let wrapper: VueWrapper;
  afterEach(() => wrapper.unmount());

  it('預設 Warning：取消（elevated）＋紅色確認、帶 Trash-Del 圖示', () => {
    wrapper = mount(DsDialog, { props: { isOpen: true }, attachTo: document.body });
    const [cancel, confirm] = buttons();
    expect(cancel.textContent!.trim()).toBe('取消並關閉');
    expect(cancel.querySelector('.btn')!.classList).toContain('btn--elevated');
    expect(confirm.textContent!.trim()).toBe('確認封存');
    expect(confirm.querySelector('.btn')!.classList).toContain('btn--filled-danger');
    expect(confirm.querySelector('.ds-icon')).not.toBeNull();
  });

  it("confirmIcon='' 拿掉圖示但仍是紅色；Normal 是藍色、沒有圖示", async () => {
    wrapper = mount(DsDialog, { props: { isOpen: true, confirmIcon: '' }, attachTo: document.body });
    expect(buttons()[1].querySelector('.ds-icon')).toBeNull();
    expect(buttons()[1].querySelector('.btn')!.classList).toContain('btn--filled-danger');
    await wrapper.setProps({ propClass: 'Normal', confirmIcon: 'Trash-Del' });
    expect(buttons()[1].querySelector('.btn')!.classList).toContain('btn--filled-primary');
    expect(buttons()[1].querySelector('.ds-icon')).toBeNull();
  });

  it('showCancel=false 只剩確認鈕（錯誤提示 alert）', () => {
    wrapper = mount(DsDialog, { props: { isOpen: true, showCancel: false }, attachTo: document.body });
    expect(buttons()).toHaveLength(1);
  });

  it('點取消送出 cancel、點確認送出 confirm', async () => {
    wrapper = mount(DsDialog, { props: { isOpen: true }, attachTo: document.body });
    (buttons()[0].querySelector('button') as HTMLButtonElement).click();
    (buttons()[1].querySelector('button') as HTMLButtonElement).click();
    await nextTick();
    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(wrapper.emitted('confirm')).toHaveLength(1);
  });

  it('loading：確認鈕顯示讀取中、點擊無效', async () => {
    wrapper = mount(DsDialog, { props: { isOpen: true, loading: true }, attachTo: document.body });
    expect(buttons()[1].querySelector('.btn__spinner')).not.toBeNull();
    (buttons()[1].querySelector('button') as HTMLButtonElement).click();
    await nextTick();
    expect(wrapper.emitted('confirm')).toBeUndefined();
  });
});

describe('DsDialog — 鍵盤與焦點', () => {
  let wrapper: VueWrapper;
  let opener: HTMLButtonElement;
  beforeEach(() => {
    opener = document.createElement('button');
    opener.textContent = '開啟';
    document.body.appendChild(opener);
    opener.focus();
  });
  afterEach(() => {
    wrapper.unmount();
    opener.remove();
  });

  it('開啟後焦點移到對話框第一個按鈕；Tab 只在對話框裡循環', async () => {
    wrapper = mount(DsDialog, { props: { isOpen: false }, attachTo: document.body });
    await wrapper.setProps({ isOpen: true });
    await nextTick();
    const [cancel, confirm] = buttons().map((b) => b.querySelector('button')!);
    expect(document.activeElement).toBe(cancel);
    await userEvent.tab();
    expect(document.activeElement).toBe(confirm);
    await userEvent.tab();
    expect(document.activeElement).toBe(cancel);
  });

  it('關閉後焦點回到開啟前的元素', async () => {
    wrapper = mount(DsDialog, { props: { isOpen: false }, attachTo: document.body });
    await wrapper.setProps({ isOpen: true });
    await nextTick();
    await wrapper.setProps({ isOpen: false });
    await wait(300);
    expect(document.activeElement).toBe(opener);
  });

  it('Esc 送出 cancel；疊了兩層時只有最上層回應', async () => {
    wrapper = mount(
      {
        components: { DsDialog },
        data: () => ({ a: false, b: false, log: [] as string[] }),
        template: `<div>
          <DsDialog :isOpen="a" header="A" @cancel="log.push('A')" />
          <DsDialog :isOpen="b" header="B" @cancel="log.push('B')" />
        </div>`,
      },
      { attachTo: document.body },
    );
    const vm = wrapper.vm as unknown as { a: boolean; b: boolean; log: string[] };
    vm.a = true;
    await nextTick();
    vm.b = true;
    await nextTick();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(vm.log).toEqual(['B']);
    vm.b = false;
    await nextTick();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(vm.log).toEqual(['B', 'A']);
    vm.a = false;
    await nextTick();
    expect(modalStack.hasAny()).toBe(false);
  });
});

describe('DsDialog — Dual-Blur 視覺規格', () => {
  let wrapper: VueWrapper;
  afterEach(() => wrapper.unmount());

  it('遮罩黑 20%＋模糊 8px；卡片白 80%＋模糊 10px；標題 --text/title', () => {
    wrapper = mount(DsDialog, { props: { isOpen: true }, attachTo: document.body });
    const backdrop = getComputedStyle(document.querySelector('.dialog-backdrop')!);
    const c = getComputedStyle(card()!);
    expect(backdrop.backgroundColor).toBe('rgba(0, 0, 0, 0.2)');
    expect(backdrop.backdropFilter).toBe('blur(8px)');
    expect(c.backgroundColor).toBe('rgba(255, 255, 255, 0.8)');
    expect(c.backdropFilter).toBe('blur(10px)');
    expect(getComputedStyle(document.querySelector('.dialog-header-title')!).color).toBe('rgb(28, 28, 46)');
  });
});
