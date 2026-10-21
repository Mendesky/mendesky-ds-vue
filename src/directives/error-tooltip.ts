import { h, render, watch, type Directive, type WatchStopHandle } from 'vue';
import FormErrorPortal from './FormErrorPortal.vue';
import { positioning, type Placement, type PortalOverlayRef } from '../overlay/positioning';
import { modalStack } from '../overlay/modal-stack';

/**
 * v-error-tooltip — 表單元件的錯誤提示（移植自 Angular 版 ErrorTooltipDirective，v0.3.0）。
 *
 * 用法：在表單元件的外框加上
 *   v-error-tooltip="{ message: errorMessage, position: errorPosition, disabled }"
 *
 * 有訊息、而且沒停用時，提示框掛到 document.body，用浮層定位貼在外框下方（或上方）；
 * 空間不足會翻面、箭頭跟著翻。開了新的 modal 時暫時收起，modal 關掉後再打開。
 * 提示期間外框加上 has-error-tooltip class。
 */
export interface ErrorTooltipValue {
  message: string | string[];
  position?: 'top' | 'bottom';
  disabled?: boolean;
}

interface State {
  value: ErrorTooltipValue;
  container: HTMLElement | null;
  overlay: PortalOverlayRef | null;
  /** 目前畫的方向（翻面後會跟設定的方向不同） */
  shownPosition: 'top' | 'bottom';
  hiddenForModal: boolean;
  openedAtStackSize: number;
  stopWatch: WatchStopHandle;
}

const states = new WeakMap<HTMLElement, State>();

const hasMessage = (v: ErrorTooltipValue) => (Array.isArray(v.message) ? v.message.length > 0 : !!v.message);
const active = (v: ErrorTooltipValue) => hasMessage(v) && !v.disabled;
const placementOf = (v: ErrorTooltipValue): Placement => (v.position === 'top' ? 'top-start' : 'bottom-start');

function renderPortal(st: State): void {
  if (!st.container) return;
  render(h(FormErrorPortal, { errorMessage: st.value.message, errorPosition: st.shownPosition }), st.container);
}

function open(el: HTMLElement, st: State): void {
  st.openedAtStackSize = modalStack.stackSize.value;
  st.shownPosition = st.value.position ?? 'bottom';
  st.container = document.createElement('div');
  document.body.appendChild(st.container);
  renderPortal(st);
  const panel = st.container.firstElementChild as HTMLElement;
  st.overlay = positioning.attach(el, panel, {
    placement: placementOf(st.value),
    gap: 4,
    trackScroll: true,
    scrollContainerStrategy: 'nearest',
    closeOnModalOpen: true,
    closeOnClickOutside: false,
    closeOnEscape: false,
    onClose: (reason) => {
      if (reason === 'manual') return;
      if (reason === 'modal-open') st.hiddenForModal = true; // 等 modal 關掉後再打開
      close(st);
    },
    onPlacementChange: (p) => {
      // 翻面後同步箭頭方向
      st.shownPosition = p.startsWith('top') ? 'top' : 'bottom';
      renderPortal(st);
    },
  });
}

function close(st: State): void {
  const ref = st.overlay;
  st.overlay = null;
  ref?.detach(); // 浮層定位已經自己關掉時（開新 modal），這裡不會重複處理
  if (!st.container) return;
  render(null, st.container);
  st.container.remove();
  st.container = null;
}

function sync(el: HTMLElement, st: State, prev: ErrorTooltipValue | null): void {
  el.classList.toggle('has-error-tooltip', active(st.value));
  if (active(st.value)) {
    if (st.overlay) {
      renderPortal(st);
      if (prev && prev.position !== st.value.position) st.overlay.updatePlacement(placementOf(st.value));
    } else if (!st.hiddenForModal) {
      open(el, st);
    }
    // hiddenForModal：等 modal 關掉後由 watch 重開，不提早打開
  } else {
    st.hiddenForModal = false; // 錯誤消失，不必再等重開
    close(st);
  }
}

export const vErrorTooltip: Directive<HTMLElement, ErrorTooltipValue> = {
  mounted(el, binding) {
    const st: State = {
      value: binding.value,
      container: null,
      overlay: null,
      shownPosition: binding.value.position ?? 'bottom',
      hiddenForModal: false,
      openedAtStackSize: 0,
      stopWatch: () => {},
    };
    st.stopWatch = watch(modalStack.stackSize, (size) => {
      if (st.hiddenForModal && size <= st.openedAtStackSize && active(st.value) && !st.overlay) {
        st.hiddenForModal = false;
        open(el, st);
      }
    });
    states.set(el, st);
    sync(el, st, null);
  },
  updated(el, binding) {
    const st = states.get(el);
    if (!st) return;
    const prev = st.value;
    st.value = binding.value;
    sync(el, st, prev);
  },
  beforeUnmount(el) {
    const st = states.get(el);
    if (!st) return;
    st.stopWatch();
    close(st);
    states.delete(el);
  },
};
