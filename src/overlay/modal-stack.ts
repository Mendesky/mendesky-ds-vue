import { readonly, ref } from 'vue';

/**
 * 目前開啟中的 modal／dialog 疊放順序（移植自 Angular 版 ModalStackService）。
 *
 * 浮層都搬到 document.body 底下後，彼此在 DOM 上是兄弟節點，各自監聽 keydown 時
 * stopPropagation 擋不住兄弟。用這個堆疊判斷誰在最上層：只有最上層的回應 Esc。
 * 錯誤提示、浮層定位也用堆疊大小判斷「開啟後是否又開了新的 modal」。
 */
const stack: string[] = [];
const size = ref(0);

export const modalStack = {
  /** 堆疊大小（響應式） */
  stackSize: readonly(size),

  /** modal 開啟時呼叫 */
  register(id: string): void {
    if (!stack.includes(id)) {
      stack.push(id);
      size.value = stack.length;
    }
  },

  /** modal 關閉時呼叫 */
  unregister(id: string): void {
    const idx = stack.lastIndexOf(id);
    if (idx !== -1) {
      stack.splice(idx, 1);
      size.value = stack.length;
    }
  },

  /** 是否為目前最上層 */
  isTopmost(id: string): boolean {
    return stack.length > 0 && stack[stack.length - 1] === id;
  },

  /** 目前是否有任何 modal 開啟中 */
  hasAny(): boolean {
    return stack.length > 0;
  },
};
