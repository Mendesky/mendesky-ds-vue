/**
 * 焦點圈限：對話框開著時，Tab／Shift+Tab 只在對話框裡面循環（對應 Angular 版 cdkTrapFocus＋cdkTrapFocusAutoCapture）。
 *
 * - activate()：記住目前有焦點的元素，把焦點移到區域內第一個能用 Tab 到的元素
 * - Tab 在最後一個 → 回到第一個；Shift+Tab 在第一個 → 跳到最後一個
 * - deactivate()：把焦點還給開啟前的元素
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

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const list = tabbables(container);
    if (list.length === 0) {
      e.preventDefault();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    const current = document.activeElement;
    if (e.shiftKey && (current === first || !container.contains(current))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (current === last || !container.contains(current))) {
      e.preventDefault();
      first.focus();
    }
  };

  return {
    activate() {
      previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      container.addEventListener('keydown', onKeydown);
      tabbables(container)[0]?.focus();
    },
    deactivate() {
      container.removeEventListener('keydown', onKeydown);
      if (previous && document.contains(previous)) previous.focus();
      previous = null;
    },
  };
}
