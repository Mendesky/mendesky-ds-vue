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
