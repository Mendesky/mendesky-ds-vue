/**
 * 焦點圈限：對話框開著時，Tab／Shift+Tab 只在對話框裡循環（對應 Angular 版 cdkTrapFocus＋cdkTrapFocusAutoCapture）。
 *
 * 做法跟 Angular CDK 相同：在區域前後各放一個能 Tab 到的哨兵（tabindex=0、讀螢幕軟體不唸），
 * 焦點一落到後哨兵就回到區域內第一個、落到前哨兵就跳到最後一個。
 * 不攔 Tab 鍵本身：Safari 預設按 Tab 不停在按鈕上，攔鍵的做法在 Safari 會讓焦點跑出對話框。
 *
 * - activate()：記住目前有焦點的元素、放哨兵，把焦點移到區域內第一個能用 Tab 到的元素
 * - deactivate()：移除哨兵，把焦點還給開啟前的元素
 */
const TABBABLE = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'iframe',
  '[tabindex]',
  '[contenteditable=""]',
  '[contenteditable="true"]',
].join(',');

function isTabbable(el: HTMLElement): boolean {
  if ((el as HTMLButtonElement).disabled) return false;
  if (el.tabIndex < 0) return false;
  if (el instanceof HTMLInputElement && el.type === 'hidden') return false;
  // 看不見（display: none、沒有版面）的不算
  return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
}

export function tabbables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE)).filter(isTabbable);
}

export interface FocusTrap {
  activate(): void;
  deactivate(): void;
}

export function createFocusTrap(container: HTMLElement): FocusTrap {
  let previous: HTMLElement | null = null;
  let anchors: HTMLElement[] = [];

  const makeAnchor = (toLast: boolean): HTMLElement => {
    const anchor = document.createElement('div');
    anchor.tabIndex = 0;
    anchor.setAttribute('aria-hidden', 'true');
    anchor.className = 'ds-focus-trap-anchor';
    anchor.addEventListener('focus', () => {
      const list = tabbables(container);
      (toLast ? list[list.length - 1] : list[0])?.focus();
    });
    return anchor;
  };

  return {
    activate() {
      previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const start = makeAnchor(true);
      const end = makeAnchor(false);
      container.before(start);
      container.after(end);
      anchors = [start, end];
      tabbables(container)[0]?.focus();
    },
    deactivate() {
      anchors.forEach((a) => a.remove());
      anchors = [];
      if (previous && document.contains(previous)) previous.focus();
      previous = null;
    },
  };
}
