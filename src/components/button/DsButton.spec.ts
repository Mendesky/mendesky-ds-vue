import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import DsButton from './DsButton.vue';

// Angular 版的 button 沒有單元測試；以下依本體元件規格（button）與 Angular 版程式行為補寫。
const btn = (w: VueWrapper) => w.find('button.btn').element as HTMLButtonElement;
const tooltip = () => document.querySelector('.ds-form-error') as HTMLElement | null;

describe('DsButton — 點擊', () => {
  let wrapper: VueWrapper;
  afterEach(() => wrapper.unmount());

  it('點擊送出 btnClick', async () => {
    wrapper = mount(DsButton, { props: { text: '儲存' }, attachTo: document.body });
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('btnClick')).toHaveLength(1);
  });

  it('停用：用原生 disabled，點擊不送出', async () => {
    wrapper = mount(DsButton, { props: { text: '儲存', disabled: true }, attachTo: document.body });
    expect(btn(wrapper).disabled).toBe(true);
    btn(wrapper).click();
    await nextTick();
    expect(wrapper.emitted('btnClick')).toBeUndefined();
  });

  it('loading：spinner 取代 icon、顯示 loadingText、點擊無效', async () => {
    wrapper = mount(DsButton, {
      props: { text: '儲存', leftIcon: 'Plus', loading: true, loadingText: '儲存中' },
      attachTo: document.body,
    });
    expect(wrapper.find('.btn__spinner').exists()).toBe(true);
    expect(wrapper.find('.ds-icon').exists()).toBe(false);
    expect(wrapper.find('.btn__text').text()).toBe('儲存中');
    expect(btn(wrapper).disabled).toBe(true);
    btn(wrapper).click();
    expect(wrapper.emitted('btnClick')).toBeUndefined();
  });
});

describe('DsButton — 停用但可點（clickableWhenDisabled）', () => {
  let wrapper: VueWrapper;
  afterEach(() => wrapper.unmount());

  it('用 aria-disabled 取代原生 disabled，點擊送出 disabledClick 而不是 btnClick', async () => {
    wrapper = mount(DsButton, {
      props: { text: '送出', disabled: true, clickableWhenDisabled: true },
      attachTo: document.body,
    });
    expect(btn(wrapper).disabled).toBe(false);
    expect(btn(wrapper).getAttribute('aria-disabled')).toBe('true');
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('disabledClick')).toHaveLength(1);
    expect(wrapper.emitted('btnClick')).toBeUndefined();
  });

  it('第一次點擊後才在按鈕上方顯示 disabledMessage；重新啟用後收起', async () => {
    wrapper = mount(DsButton, {
      props: { text: '送出', disabled: true, clickableWhenDisabled: true, disabledMessage: ['請先填寫名稱', '請先選擇日期'] },
      attachTo: document.body,
    });
    expect(tooltip()).toBeNull();
    await wrapper.find('button').trigger('click');
    expect(tooltip()).not.toBeNull();
    expect(tooltip()!.classList).toContain('form-error-portal--top');
    expect(tooltip()!.querySelectorAll('li')).toHaveLength(2);
    await wrapper.setProps({ disabled: false });
    expect(tooltip()).toBeNull();
    // 再停用：要重新點過才會顯示
    await wrapper.setProps({ disabled: true });
    expect(tooltip()).toBeNull();
  });
});

describe('DsButton — 外觀', () => {
  let wrapper: VueWrapper;
  afterEach(() => wrapper.unmount());

  it('預設 filled＋primary＋M；elevated 不分顏色', async () => {
    wrapper = mount(DsButton, { props: { text: 'A' }, attachTo: document.body });
    expect(btn(wrapper).classList).toContain('btn--filled-primary');
    expect(btn(wrapper).classList).toContain('btn--m');
    await wrapper.setProps({ variant: 'elevated', color: 'danger' });
    expect(btn(wrapper).classList).toContain('btn--elevated');
  });

  it('icon 尺寸跟著按鈕尺寸：XXS/XS/S → 12、M → 16、L → 24', async () => {
    wrapper = mount(DsButton, { props: { text: 'A', leftIcon: 'Plus' }, attachTo: document.body });
    const cases: [string, number][] = [['XXS', 12], ['XS', 12], ['S', 12], ['M', 16], ['L', 24]];
    for (const [size, px] of cases) {
      await wrapper.setProps({ size });
      const icon = wrapper.find('.ds-icon').element.getBoundingClientRect();
      expect(icon.width, size).toBe(px);
    }
  });

  it('icon 顏色跟文字同步（currentColor），不會留灰色', () => {
    wrapper = mount(DsButton, { props: { text: '新增', leftIcon: 'Plus' }, attachTo: document.body });
    const icon = wrapper.find('.ds-icon').element as HTMLElement;
    expect(getComputedStyle(icon).color).toBe(getComputedStyle(btn(wrapper)).color);
    expect(getComputedStyle(btn(wrapper)).color).toBe('rgb(241, 243, 245)');
  });

  it('沒有 text 時顯示投影內容；有 text 時不顯示', async () => {
    wrapper = mount(DsButton, { slots: { default: '<strong>粗體</strong>' }, attachTo: document.body });
    expect(wrapper.find('.btn__slot strong').text()).toBe('粗體');
    await wrapper.setProps({ text: '文字' });
    expect(wrapper.find('.btn__slot').exists()).toBe(false);
  });

  it('description：雙行模式，名稱下方顯示說明文字', () => {
    wrapper = mount(DsButton, { props: { text: '名稱', description: '說明' }, attachTo: document.body });
    expect(btn(wrapper).classList).toContain('btn--has-desc');
    expect(wrapper.find('.btn__desc').text()).toBe('說明');
  });

  it('左中右標籤與快速鍵提示依序出現', () => {
    wrapper = mount(DsButton, {
      props: {
        text: '選項',
        leftLabel: { text: '01', color: 'Grey16' },
        rightLabel: { text: 'New', color: 'SoftBlue', size: 'XS' },
        shortcut: '⌘N',
      },
      attachTo: document.body,
    });
    const labels = wrapper.findAll('.ds-label');
    expect(labels.map((l) => l.text())).toEqual(['01', 'New']);
    expect(labels[0].find('.label').classes()).toContain('label--m');
    expect(labels[1].find('.label').classes()).toContain('label--xs');
    expect(wrapper.find('.btn__shortcut').text()).toBe('⌘N');
  });
});

// 報讀契約（2026-10-28，與 Angular 版 app-button 同步）：
// ariaLabel／ariaPressed／ariaCurrent 落在內層原生 button；沒設就不輸出屬性。
// 內層 button 沒有任何文字、也沒有 ariaLabel 時，開發模式印一次 console.warn（載入中除外）。
describe('DsButton — 報讀名稱與狀態', () => {
  let wrapper: VueWrapper;
  afterEach(() => wrapper.unmount());

  it('ariaLabel 有設時落在內層 button 的 aria-label', () => {
    wrapper = mount(DsButton, { props: { leftIcon: 'LeftArrow', ariaLabel: '上一頁' } });
    expect(btn(wrapper).getAttribute('aria-label')).toBe('上一頁');
  });

  it('ariaLabel 沒設時沒有 aria-label，也不會落在外層', () => {
    wrapper = mount(DsButton, { props: { text: '確認' } });
    expect(btn(wrapper).hasAttribute('aria-label')).toBe(false);
    expect(wrapper.find('.ds-button').attributes('aria-label')).toBeUndefined();
  });

  it('ariaPressed 的 true／false 都照實輸出', async () => {
    wrapper = mount(DsButton, { props: { text: '粗體', ariaPressed: true } });
    expect(btn(wrapper).getAttribute('aria-pressed')).toBe('true');
    await wrapper.setProps({ ariaPressed: false });
    expect(btn(wrapper).getAttribute('aria-pressed')).toBe('false');
  });

  it('ariaPressed 沒設時沒有 aria-pressed', () => {
    wrapper = mount(DsButton, { props: { text: '粗體' } });
    expect(btn(wrapper).hasAttribute('aria-pressed')).toBe(false);
  });

  it('ariaCurrent 有設時輸出；沒設時沒有', async () => {
    wrapper = mount(DsButton, { props: { text: '2026-10-24 版', ariaCurrent: 'true' } });
    expect(btn(wrapper).getAttribute('aria-current')).toBe('true');
    await wrapper.setProps({ ariaCurrent: null });
    expect(btn(wrapper).hasAttribute('aria-current')).toBe(false);
  });
});

describe('DsButton — 沒有名稱的警告（開發模式）', () => {
  let wrapper: VueWrapper;
  let warn: ReturnType<typeof vi.spyOn>;
  const buttonWarns = () => warn.mock.calls.filter((args) => String(args[0]).startsWith('[DsButton]'));

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    wrapper.unmount();
    warn.mockRestore();
  });

  it('只有圖示、沒有文字也沒有 ariaLabel → 警告一次', async () => {
    wrapper = mount(DsButton, { props: { leftIcon: 'LeftArrow' } });
    await wrapper.setProps({ size: 'S' });
    expect(buttonWarns()).toHaveLength(1);
  });

  it('有文字 → 不警告', () => {
    wrapper = mount(DsButton, { props: { leftIcon: 'Plus', text: '新增' } });
    expect(buttonWarns()).toHaveLength(0);
  });

  it('有 ariaLabel → 不警告', () => {
    wrapper = mount(DsButton, { props: { leftIcon: 'LeftArrow', ariaLabel: '上一頁' } });
    expect(buttonWarns()).toHaveLength(0);
  });

  it('載入中 → 不警告', () => {
    wrapper = mount(DsButton, { props: { loading: true } });
    expect(buttonWarns()).toHaveLength(0);
  });

  it('沒有 text 但插槽有文字 → 不警告', () => {
    wrapper = mount(DsButton, { props: { leftIcon: 'Plus' }, slots: { default: '<span>自訂內容</span>' } });
    expect(buttonWarns()).toHaveLength(0);
  });
});
