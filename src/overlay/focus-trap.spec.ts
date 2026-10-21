import { userEvent } from '@vitest/browser/context';
import { createFocusTrap } from './focus-trap';

describe('createFocusTrap', () => {
  let opener: HTMLButtonElement;
  let box: HTMLDivElement;

  beforeEach(() => {
    opener = document.createElement('button');
    opener.textContent = '開啟';
    document.body.appendChild(opener);
    box = document.createElement('div');
    box.innerHTML = `
      <button class="a">第一個</button>
      <button class="hidden" style="display:none">看不見</button>
      <button class="off" disabled>停用</button>
      <input class="b" />
      <button class="c">最後一個</button>`;
    document.body.appendChild(box);
    opener.focus();
  });

  afterEach(() => {
    opener.remove();
    box.remove();
  });

  it('啟用時焦點移到第一個能用 Tab 到的元素', () => {
    const trap = createFocusTrap(box);
    trap.activate();
    expect(document.activeElement).toBe(box.querySelector('.a'));
    trap.deactivate();
  });

  it('Tab 跳過看不見與停用的元素；在最後一個按 Tab 回到第一個', async () => {
    const trap = createFocusTrap(box);
    trap.activate();
    await userEvent.tab();
    expect(document.activeElement).toBe(box.querySelector('.b'));
    await userEvent.tab();
    expect(document.activeElement).toBe(box.querySelector('.c'));
    await userEvent.tab();
    expect(document.activeElement).toBe(box.querySelector('.a'));
    trap.deactivate();
  });

  it('在第一個按 Shift+Tab 跳到最後一個', async () => {
    const trap = createFocusTrap(box);
    trap.activate();
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(box.querySelector('.c'));
    trap.deactivate();
  });

  it('停用時把焦點還給開啟前的元素', () => {
    const trap = createFocusTrap(box);
    trap.activate();
    trap.deactivate();
    expect(document.activeElement).toBe(opener);
  });
});

// WebKit（Safari）預設按 Tab 不會停在按鈕上，只靠攔 Tab 鍵時焦點會跑出對話框（行為比對在 WebKit 抓到）。
// 改用跟 Angular 版 cdkTrapFocus 相同的做法：在區域前後各放一個能 Tab 到的哨兵，焦點一落到哨兵就導回區域內。
describe('createFocusTrap — 前後哨兵', () => {
  let box: HTMLDivElement;
  beforeEach(() => {
    box = document.createElement('div');
    box.innerHTML = '<button class="a">第一個</button><button class="c">最後一個</button>';
    document.body.appendChild(box);
  });
  afterEach(() => box.remove());

  const anchors = () => [box.previousElementSibling as HTMLElement, box.nextElementSibling as HTMLElement];

  it('啟用時在區域前後各放一個 tabindex=0 的哨兵，讀螢幕軟體不唸', () => {
    const trap = createFocusTrap(box);
    trap.activate();
    const [start, end] = anchors();
    for (const a of [start, end]) {
      expect(a.getAttribute('tabindex')).toBe('0');
      expect(a.getAttribute('aria-hidden')).toBe('true');
    }
    trap.deactivate();
  });

  it('焦點落到後哨兵 → 回到第一個；落到前哨兵 → 跳到最後一個', () => {
    const trap = createFocusTrap(box);
    trap.activate();
    const [start, end] = anchors();
    end.focus();
    expect(document.activeElement).toBe(box.querySelector('.a'));
    start.focus();
    expect(document.activeElement).toBe(box.querySelector('.c'));
    trap.deactivate();
  });

  it('停用時移除哨兵', () => {
    const trap = createFocusTrap(box);
    trap.activate();
    trap.deactivate();
    expect(box.previousElementSibling).toBeNull();
    expect(box.nextElementSibling).toBeNull();
  });
});
