// 移植自 Angular 版 portal-positioning.service.spec.ts（v0.3.0），逐條對應。
// 差別：服務改成直接 new PortalPositioning()；modal 堆疊是全頁共用的 modalStack，每條測試結束時還原。
import type { Mock } from 'vitest';
import {
  type AttachOptions,
  type CloseReason,
  type PortalOverlayRef,
  PortalPositioning,
} from './positioning';
import { modalStack as sharedModalStack } from './modal-stack';

// ── Fake browser observer APIs (JSDOM does not include these) ─────────────────

const resizeCbMap = new Map<Element, ResizeObserverCallback>();
const intersectCbMap = new Map<Element, IntersectionObserverCallback>();

// beforeEach 會把 window 上的 ResizeObserver / IntersectionObserver 換成 fake；afterEach 必須還原，
// 否則整包隨機順序跑到後面、依賴真 observer 的 spec（例 priority-overflow）會靜默收不到 callback。
const REAL_RESIZE_OBSERVER = window.ResizeObserver;
const REAL_INTERSECTION_OBSERVER = window.IntersectionObserver;

class FakeResizeObserver {
  private observed: Element[] = [];
  constructor(private cb: ResizeObserverCallback) {}
  observe(el: Element): void { this.observed.push(el); resizeCbMap.set(el, this.cb); }
  unobserve(el: Element): void {
    this.observed = this.observed.filter(x => x !== el);
    resizeCbMap.delete(el);
  }
  disconnect(): void {
    this.observed.forEach(el => resizeCbMap.delete(el));
    this.observed = [];
  }
}

class FakeIntersectionObserver {
  private watched: Element[] = [];
  constructor(private cb: IntersectionObserverCallback) {}
  observe(el: Element): void { this.watched.push(el); intersectCbMap.set(el, this.cb); }
  unobserve(el: Element): void {
    this.watched = this.watched.filter(x => x !== el);
    intersectCbMap.delete(el);
  }
  disconnect(): void {
    this.watched.forEach(el => intersectCbMap.delete(el));
    this.watched = [];
  }
}

function fireResize(el: Element): void {
  resizeCbMap.get(el)?.(
    [{ target: el, contentRect: el.getBoundingClientRect() } as ResizeObserverEntry],
    {} as ResizeObserver,
  );
}

function fireIntersection(
  el: Element,
  opts: { isIntersecting: boolean; ratio: number; width: number; height: number },
): void {
  intersectCbMap.get(el)?.(
    [{
      target: el,
      isIntersecting: opts.isIntersecting,
      intersectionRatio: opts.ratio,
      boundingClientRect: {
        width: opts.width, height: opts.height,
        top: 0, left: 0, bottom: 0, right: 0,
      } as DOMRectReadOnly,
    } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeTriggerEl(
  rect: Partial<Pick<DOMRect, 'top' | 'left' | 'right' | 'bottom' | 'width' | 'height'>> = {},
): HTMLElement {
  const div = document.createElement('div');
  document.body.appendChild(div);
  vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({
    top: rect.top ?? 100,
    left: rect.left ?? 50,
    right: rect.right ?? 250,
    bottom: rect.bottom ?? 120,
    width: rect.width ?? 200,
    height: rect.height ?? 20,
    x: 0, y: 0,
    toJSON: () => ({}),
  } as DOMRect);
  return div;
}

function makePanelEl(): HTMLElement {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('PortalPositioning', () => {
  let service: PortalPositioning;
  const registered: string[] = [];
  // 測試裡註冊過的 modal id 要在 afterEach 移除，避免影響下一條
  const modalStack = {
    register(id: string) { registered.push(id); sharedModalStack.register(id); },
    unregister(id: string) { sharedModalStack.unregister(id); },
    stackSize: () => sharedModalStack.stackSize.value,
  };
  let rafQueue: FrameRequestCallback[];
  const cleanupEls: HTMLElement[] = [];
  let capturedPointerdown: EventListener | null;
  let capturedKeydown: EventListener | null;

  // Flush all pending requestAnimationFrame callbacks synchronously
  function flushRaf(): void {
    const pending = [...rafQueue];
    rafQueue = [];
    pending.forEach(fn => fn(0));
  }

  function track<T extends HTMLElement>(el: T): T {
    cleanupEls.push(el);
    return el;
  }

  function tRef(
    rect?: Parameters<typeof makeTriggerEl>[0],
  ): HTMLElement {
    return track(makeTriggerEl(rect));
  }

  function pRef(): HTMLElement {
    return track(makePanelEl());
  }

  function attach(opts?: AttachOptions): { ref: PortalOverlayRef; panel: HTMLElement } {
    const p = track(makePanelEl());
    return { ref: service.attach(tRef(), p, opts), panel: p };
  }

  beforeEach(() => {
    resizeCbMap.clear();
    intersectCbMap.clear();
    rafQueue = [];
    capturedPointerdown = null;
    capturedKeydown = null;

    (window as any).ResizeObserver = FakeResizeObserver;
    (window as any).IntersectionObserver = FakeIntersectionObserver;

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((fn: FrameRequestCallback): number => {
      rafQueue.push(fn);
      return rafQueue.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) => {
      if (id >= 1 && id <= rafQueue.length) rafQueue[id - 1] = () => {};
    });

    // Intercept document.addEventListener so we can remove listeners in afterEach
    const origAdd = document.addEventListener.bind(document);
    vi.spyOn(document, 'addEventListener').mockImplementation(
      (type: string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions | boolean) => {
        if (type === 'pointerdown') capturedPointerdown = fn as EventListener;
        if (type === 'keydown') capturedKeydown = fn as EventListener;
        origAdd(type, fn, opts);
      },
    );

    service = new PortalPositioning();
  });

  afterEach(() => {
    registered.splice(0).forEach((id) => sharedModalStack.unregister(id));
    vi.restoreAllMocks();
    window.ResizeObserver = REAL_RESIZE_OBSERVER;
    window.IntersectionObserver = REAL_INTERSECTION_OBSERVER;
    cleanupEls.forEach(el => el.parentElement?.removeChild(el));
    cleanupEls.length = 0;
    if (capturedPointerdown) {
      document.removeEventListener('pointerdown', capturedPointerdown, { capture: true });
      capturedPointerdown = null;
    }
    if (capturedKeydown) {
      document.removeEventListener('keydown', capturedKeydown);
      capturedKeydown = null;
    }
  });

  // ── API surface ──────────────────────────────────────────────────────────────

  describe('API surface', () => {
    it('attach() returns PortalOverlayRef with updatePlacement / reposition / detach', () => {
      const { ref } = attach();
      expect(typeof ref.updatePlacement).toBe('function');
      expect(typeof ref.reposition).toBe('function');
      expect(typeof ref.detach).toBe('function');
      ref.detach();
    });

    it('attachAtPoint() returns PortalOverlayRef', () => {
      const ref = service.attachAtPoint(100, 200, pRef());
      expect(typeof ref.detach).toBe('function');
      ref.detach();
    });
  });

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  describe('lifecycle', () => {
    it('single attach + detach completes without error', () => {
      const { ref } = attach();
      expect(() => ref.detach()).not.toThrow();
    });

    it('detach() is idempotent — second call does not throw or re-trigger onClose', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const { ref } = attach({ onClose });
      ref.detach();
      ref.detach();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('detach() calls onClose with reason "manual"', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const { ref } = attach({ onClose });
      ref.detach();
      expect(onClose).toHaveBeenCalledExactlyOnceWith('manual');
    });
  });

  // ── N=10 concurrent refs ─────────────────────────────────────────────────────

  describe('concurrent refs', () => {
    it('N=10 refs: detaching ref[4] does not affect any other ref', () => {
      const spies: Mock[] = [];
      const refs: PortalOverlayRef[] = [];

      for (let i = 0; i < 10; i++) {
        const spy = vi.fn();
        spies.push(spy);
        refs.push(attach({ onClose: spy }).ref);
      }

      refs[4].detach();
      expect(spies[4]).toHaveBeenCalledExactlyOnceWith('manual');
      for (let i = 0; i < 10; i++) {
        if (i !== 4) expect(spies[i]).not.toHaveBeenCalled();
      }

      for (let i = 0; i < 10; i++) {
        if (i !== 4) refs[i].detach();
      }
    });
  });

  // ── closeOnModalOpen ─────────────────────────────────────────────────────────

  describe('closeOnModalOpen', () => {
    it('auto-detaches with "modal-open" when ModalStackService stackSize increases', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      attach({ closeOnModalOpen: true, onClose });

      modalStack.register('test-modal-a');
      // Vue 的 watch 同步觸發，不需要 flush

      expect(onClose).toHaveBeenCalledExactlyOnceWith('modal-open');
      modalStack.unregister('test-modal-a');
    });

    it('does NOT detach when closeOnModalOpen=false (default)', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const { ref } = attach({ onClose });

      modalStack.register('test-modal-b');
      // Vue 的 watch 同步觸發，不需要 flush

      expect(onClose).not.toHaveBeenCalled();
      ref.detach();
      modalStack.unregister('test-modal-b');
    });

    it('all closeOnModalOpen=true refs close; closeOnModalOpen=false ref stays open', () => {
      const spyClose = vi.fn();
      const spyStay = vi.fn();

      attach({ closeOnModalOpen: true, onClose: spyClose });
      const { ref: stayRef } = attach({ closeOnModalOpen: false, onClose: spyStay });

      modalStack.register('test-modal-c');
      // Vue 的 watch 同步觸發，不需要 flush

      expect(spyClose).toHaveBeenCalledExactlyOnceWith('modal-open');
      expect(spyStay).not.toHaveBeenCalled();
      stayRef.detach();
      modalStack.unregister('test-modal-c');
    });
  });

  // ── closeOnClickOutside ──────────────────────────────────────────────────────

  describe('closeOnClickOutside', () => {
    function pointerdownOn(el: HTMLElement): void {
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
    }

    it('pointerdown on outside element closes ref with "click-outside"', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      attach({ closeOnClickOutside: true, onClose });

      const outside = track(document.createElement('div'));
      document.body.appendChild(outside);
      pointerdownOn(outside);

      expect(onClose).toHaveBeenCalledExactlyOnceWith('click-outside');
    });

    it('pointerdown on panel does NOT close ref', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const { ref, panel } = attach({ closeOnClickOutside: true, onClose });

      pointerdownOn(panel);

      expect(onClose).not.toHaveBeenCalled();
      ref.detach();
    });

    it('closeOnClickOutside=false: outside pointerdown does NOT close ref', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const { ref } = attach({ closeOnClickOutside: false, onClose });

      const outside = track(document.createElement('div'));
      document.body.appendChild(outside);
      pointerdownOn(outside);

      expect(onClose).not.toHaveBeenCalled();
      ref.detach();
    });

    it('stacked overlays: clicking inside child panel does NOT close ancestor panel', () => {
      // Panel A (ancestor) contains child-trigger inside its DOM content
      const panelA = track(makePanelEl());
      const triggerA = track(makeTriggerEl());
      const onCloseA = vi.fn();
      const refA = service.attach(
        triggerA,
        panelA,
        { closeOnClickOutside: true, onClose: onCloseA },
      );

      // Child trigger physically lives inside panel A
      const childTrigger = track(document.createElement('div'));
      panelA.appendChild(childTrigger); // nested inside panel A

      // Panel B (child) is teleported to body — DOM sibling of panel A
      const panelB = track(makePanelEl());
      const triggerB = childTrigger;
      vi.spyOn(childTrigger, 'getBoundingClientRect').mockReturnValue({
        top: 200, left: 100, right: 300, bottom: 220, width: 200, height: 20,
        x: 0, y: 0, toJSON: () => ({}),
      } as DOMRect);
      const onCloseB = vi.fn();
      const refB = service.attach(
        triggerB,
        panelB,
        { closeOnClickOutside: true, onClose: onCloseB },
      );

      // Click inside panel B (a body-level sibling of panel A)
      pointerdownOn(panelB);

      // Neither A nor B should close — click was inside B which is a logical child of A
      expect(onCloseA).not.toHaveBeenCalled();
      expect(onCloseB).not.toHaveBeenCalled();

      refA.detach();
      refB.detach();
    });

    it('stacked overlays (point-anchored child + ancestorAnchorEl): clicking inside child panel does NOT close ancestor', () => {
      // 父選單 A，內含巢狀 flyout 的觸發鈕（如卡片選單的「下載檔案」row）
      const panelA = track(makePanelEl());
      const onCloseA = vi.fn();
      const refA = service.attach(tRef(), panelA, { closeOnClickOutside: true, onClose: onCloseA });

      const childTrigger = track(document.createElement('div'));
      panelA.appendChild(childTrigger); // 觸發鈕實際位於 panel A 內

      // 子 flyout B 是 point-anchored（attachAtPoint，無 trigger element）→ 帶 ancestorAnchorEl=childTrigger
      const panelB = track(makePanelEl());
      const onCloseB = vi.fn();
      const refB = service.attachAtPoint(100, 200, panelB, {
        closeOnClickOutside: true, onClose: onCloseB, ancestorAnchorEl: childTrigger,
      });

      pointerdownOn(panelB); // 點子 flyout 內容（含下載確認鈕）

      // B 安全（點在自己 panel）；A 因 B 的 ancestorAnchorEl 位於 A panel 內 → 被 ancestor-protection 保護
      expect(onCloseB).not.toHaveBeenCalled();
      expect(onCloseA).not.toHaveBeenCalled();

      refA.detach();
      refB.detach();
    });

    it('stacked overlays (point-anchored child WITHOUT ancestorAnchorEl): 父選單被誤關（Fix H 前的 bug；對照組）', () => {
      const panelA = track(makePanelEl());
      const onCloseA = vi.fn();
      const refA = service.attach(tRef(), panelA, { closeOnClickOutside: true, onClose: onCloseA });

      // point-anchored 子 flyout 不帶 ancestorAnchorEl → 無 trigger 可供 ancestor-protection
      const panelB = track(makePanelEl());
      const onCloseB = vi.fn();
      const refB = service.attachAtPoint(100, 200, panelB, { closeOnClickOutside: true, onClose: onCloseB });

      pointerdownOn(panelB);

      expect(onCloseB).not.toHaveBeenCalled();              // B 自己 panel 內＝安全
      expect(onCloseA).toHaveBeenCalledExactlyOnceWith('click-outside'); // A 無保護 → 被誤關（正是下載 submenu 原 bug）
      refA.detach();
    });

    it('stacked overlays: clicking outside all panels closes both A and B', () => {
      const panelA = track(makePanelEl());
      const onCloseA = vi.fn();
      const refA = service.attach(tRef(), panelA, {
        closeOnClickOutside: true, onClose: onCloseA,
      });

      const panelB = track(makePanelEl());
      const onCloseB = vi.fn();
      const refB = service.attach(tRef(), panelB, {
        closeOnClickOutside: true, onClose: onCloseB,
      });

      const outside = track(document.createElement('div'));
      document.body.appendChild(outside);
      pointerdownOn(outside);

      expect(onCloseA).toHaveBeenCalledExactlyOnceWith('click-outside');
      expect(onCloseB).toHaveBeenCalledExactlyOnceWith('click-outside');
    });
  });

  // ── closeOnEscape ────────────────────────────────────────────────────────────

  describe('closeOnEscape', () => {
    function pressEscape(): void {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    }

    it('Esc closes ref with reason "escape" (closeOnEscape=true is default)', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      attach({ onClose });

      pressEscape();

      expect(onClose).toHaveBeenCalledExactlyOnceWith('escape');
    });

    it('closeOnEscape=false: Esc does NOT close ref', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const { ref } = attach({ closeOnEscape: false, onClose });

      pressEscape();

      expect(onClose).not.toHaveBeenCalled();
      ref.detach();
    });

    it('multiple refs: Esc closes only the topmost (last attached)', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const spy3 = vi.fn();

      const { ref: ref1 } = attach({ onClose: spy1 });
      const { ref: ref2 } = attach({ onClose: spy2 });
      attach({ onClose: spy3 }); // topmost

      pressEscape();

      expect(spy3).toHaveBeenCalledExactlyOnceWith('escape');
      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();

      ref1.detach();
      ref2.detach();
    });

    it('second Esc closes the new topmost after the first one is gone', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();

      const { ref: ref1 } = attach({ onClose: spy1 });
      attach({ onClose: spy2 });

      pressEscape(); // closes ref2 (topmost)
      pressEscape(); // closes ref1 (now topmost)

      expect(spy2).toHaveBeenCalledExactlyOnceWith('escape');
      expect(spy1).toHaveBeenCalledExactlyOnceWith('escape');
    });
  });

  // ── onClose reason values ────────────────────────────────────────────────────

  describe('onClose reasons', () => {
    it('"escape" — from Esc keydown', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      attach({ onClose });
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      expect(onClose).toHaveBeenCalledWith('escape');
    });

    it('"click-outside" — from outside pointerdown', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      attach({ closeOnClickOutside: true, onClose });
      const outside = track(document.createElement('div'));
      document.body.appendChild(outside);
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onClose).toHaveBeenCalledWith('click-outside');
    });

    it('"modal-open" — from ModalStackService register', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      attach({ closeOnModalOpen: true, onClose });
      modalStack.register('reason-modal');
      // Vue 的 watch 同步觸發，不需要 flush
      expect(onClose).toHaveBeenCalledWith('modal-open');
      modalStack.unregister('reason-modal');
    });

    it('"trigger-removed" — from IntersectionObserver (trigger DOM-removed)', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const triggerEl = track(makeTriggerEl());
      const panelEl = track(makePanelEl());
      service.attach(triggerEl, panelEl, { onClose });

      fireIntersection(triggerEl, { isIntersecting: false, ratio: 0, width: 0, height: 0 });

      expect(onClose).toHaveBeenCalledWith('trigger-removed');
    });

    it('"manual" — from explicit detach()', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const { ref } = attach({ onClose });
      ref.detach();
      expect(onClose).toHaveBeenCalledWith('manual');
    });
  });

  // ── ResizeObserver ───────────────────────────────────────────────────────────

  describe('ResizeObserver', () => {
    it('trigger resize schedules a reposition via rAF', () => {
      const triggerEl = track(makeTriggerEl());
      const ref = service.attach(triggerEl, pRef());
      rafQueue = []; // clear constructor rAF

      fireResize(triggerEl);

      expect(rafQueue.length).toBe(1);
      ref.detach();
    });

    it('multiple rapid resizes before rAF flush produce only one rAF (coalesced)', () => {
      const triggerEl = track(makeTriggerEl());
      const ref = service.attach(triggerEl, pRef());
      rafQueue = [];

      fireResize(triggerEl);
      fireResize(triggerEl);
      fireResize(triggerEl);

      expect(rafQueue.length).toBe(1);
      ref.detach();
    });

    it('after detach, resize does not schedule rAF', () => {
      const triggerEl = track(makeTriggerEl());
      const ref = service.attach(triggerEl, pRef());
      ref.detach();
      rafQueue = [];

      fireResize(triggerEl);

      expect(rafQueue.length).toBe(0);
    });
  });

  // ── IntersectionObserver ─────────────────────────────────────────────────────

  describe('IntersectionObserver', () => {
    it('trigger DOM-removed (ratio=0, size=0) → auto-detach with "trigger-removed"', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const triggerEl = track(makeTriggerEl());
      const ref = service.attach(triggerEl, pRef(), { onClose });

      fireIntersection(triggerEl, { isIntersecting: false, ratio: 0, width: 0, height: 0 });

      expect(onClose).toHaveBeenCalledExactlyOnceWith('trigger-removed');
    });

    it('trigger scrolled out of viewport (ratio=0 but size>0) → does NOT detach', () => {
      const onClose = vi.fn<(r: CloseReason) => void>();
      const triggerEl = track(makeTriggerEl());
      const ref = service.attach(triggerEl, pRef(), { onClose });

      // Still in DOM (has size) — just outside the scrolling viewport
      fireIntersection(triggerEl, { isIntersecting: false, ratio: 0, width: 200, height: 20 });

      expect(onClose).not.toHaveBeenCalled();
      ref.detach();
    });
  });

  // ── trackScroll (document strategy) ─────────────────────────────────────────

  describe('trackScroll', () => {
    it('scroll event schedules reposition when trackScroll=true', () => {
      const { ref } = attach({ trackScroll: true, scrollContainerStrategy: 'document' });
      rafQueue = [];

      document.dispatchEvent(new Event('scroll'));

      expect(rafQueue.length).toBeGreaterThan(0);
      ref.detach();
    });

    it('scroll event does NOT schedule reposition when trackScroll=false', () => {
      const { ref } = attach({ trackScroll: false, scrollContainerStrategy: 'document' });
      rafQueue = [];

      document.dispatchEvent(new Event('scroll'));

      expect(rafQueue.length).toBe(0);
      ref.detach();
    });
  });

  // ── reposition() updates panel position ─────────────────────────────────────

  describe('reposition()', () => {
    it('initial reposition positions panel with position:fixed', () => {
      const { ref, panel } = attach({ placement: 'bottom' });

      flushRaf();

      expect(panel.style.position).toBe('fixed');
      ref.detach();
    });

    it('manual reposition() re-calculates after trigger moves', () => {
      const triggerEl = track(makeTriggerEl({ top: 100, bottom: 120 }));
      const panelEl = track(makePanelEl());
      const ref = service.attach(triggerEl, panelEl, { placement: 'bottom' });

      flushRaf(); // initial: top = 120 + 4 = 124
      expect(panelEl.style.top).toBe('124px');

      // Simulate trigger moved down
      (triggerEl.getBoundingClientRect as Mock).mockReturnValue({
        top: 300, bottom: 320, left: 50, right: 250, width: 200, height: 20,
        x: 0, y: 0, toJSON: () => ({}),
      } as DOMRect);

      ref.reposition(); // manual trigger: top = 320 + 4 = 324
      expect(panelEl.style.top).toBe('324px');
      ref.detach();
    });

    it('updatePlacement() changes placement direction', () => {
      const triggerEl = track(makeTriggerEl({ top: 200, bottom: 220 }));
      const panelEl = track(makePanelEl());
      const ref = service.attach(triggerEl, panelEl, { placement: 'bottom' });

      flushRaf(); // bottom: top = 220 + 4 = 224
      expect(panelEl.style.top).toBe('224px');

      ref.updatePlacement('top');
      flushRaf(); // top: top = 200 - 4 - 0 = 196
      expect(panelEl.style.top).toBe('196px');
      ref.detach();
    });
  });

  // ── visualViewport integration ───────────────────────────────────────────────

  describe('visualViewport', () => {
    it('visualViewport resize triggers reposition for all active refs', () => {
      const vpListeners: Record<string, EventListener> = {};
      const mockVP = {
        height: 600,
        addEventListener: (type: string, fn: EventListener) => { vpListeners[type] = fn; },
        removeEventListener: () => {},
      };
      Object.defineProperty(window, 'visualViewport', { value: mockVP, configurable: true });

      const triggerEl = track(makeTriggerEl({ top: 100, bottom: 120 }));
      const panelEl = track(makePanelEl());
      const ref = service.attach(triggerEl, panelEl, { placement: 'bottom' });
      flushRaf(); // initial reposition

      // Move trigger and fire visualViewport resize
      (triggerEl.getBoundingClientRect as Mock).mockReturnValue({
        top: 400, bottom: 420, left: 50, right: 250, width: 200, height: 20,
        x: 0, y: 0, toJSON: () => ({}),
      } as DOMRect);
      vpListeners['resize']?.(new Event('resize'));

      expect(panelEl.style.top).toBe('424px'); // 420 + 4
      ref.detach();

      Object.defineProperty(window, 'visualViewport', { value: undefined, configurable: true });
    });

    // ── iOS 鍵盤：visual 座標 → fixed 座標換算（offsetTop / offsetLeft）────────────
    // 座標系事實（2026-07-25 真 iPhone 實測，推薦員工 autocomplete 鍵盤開啟時直接量得）：
    //   offsetTop=208、面板 style.top=212px 時，量到 getBoundingClientRect().top=4
    //   → 212 − 208 = 4，差值恰為 offsetTop。
    // 即：getBoundingClientRect() 回傳 **visual viewport** 座標，position:fixed 吃
    // **layout viewport** 座標，兩者相差 (offsetLeft, offsetTop)。
    // 所以 reposition() 內所有運算維持 visual 座標（可視區間就是 [0, height]，anchorRect 同框），
    // 唯一需要換算的是寫入 style.top/left 的那一步。
    // 下列四支同時否證兩種錯法：(a) 完全不換算（原始 bug，面板上移 offsetTop 被切在畫面外）、
    // (b) 改用 [offsetTop, offsetTop+height] 當運算區間（把 anchorRect 誤當 layout 座標）。
    const IOS_KEYBOARD_VP = { height: 415, offsetTop: 208, offsetLeft: 0 };

    function withIosKeyboardViewport(
      overrides: Partial<typeof IOS_KEYBOARD_VP>,
      fn: () => void,
    ): void {
      Object.defineProperty(window, 'visualViewport', {
        value: {
          ...IOS_KEYBOARD_VP, ...overrides,
          addEventListener: () => {}, removeEventListener: () => {},
        },
        configurable: true,
      });
      try {
        fn();
      } finally {
        Object.defineProperty(window, 'visualViewport', { value: undefined, configurable: true });
      }
    }

    it('offsetTop > 0：style.top = visual 定位 + offsetTop（面板才真正落在 anchor 下緣）', () => {
      withIosKeyboardViewport({}, () => {
        // anchor visual 149–191（實測值）→ visual 目標 top = 191 + gap 4 = 195
        // → 寫入 fixed 座標須 +208 = 403px，量回來才是 visual 195（貼齊 anchor 下緣）
        // 錯法 (a) 不換算：寫 195 → 量到 visual −13 → 被切在畫面頂端外（原始 bug）
        // 錯法 (b) 區間含 offsetTop：clamp 下限 208+4 → 寫 212 → 量到 visual 4（釘在畫面最上緣）
        const triggerEl = track(makeTriggerEl({ top: 149, bottom: 191 }));
        const panelEl = track(makePanelEl());
        const ref = service.attach(triggerEl, panelEl, { placement: 'bottom-start' });

        flushRaf();

        expect(panelEl.style.top).toBe('403px');
        ref.detach();
      });
    });

    it('offsetLeft > 0（縮放）：style.left = visual 定位 + offsetLeft', () => {
      withIosKeyboardViewport({ offsetLeft: 30 }, () => {
        // anchor visual left = 50（makeTriggerEl 預設）→ bottom-start：visual left = 50
        // → 寫入 fixed 座標須 +30 = 80px；錯法 (a) 不換算會寫 50px
        const triggerEl = track(makeTriggerEl({ top: 149, bottom: 191, left: 50, right: 250 }));
        const panelEl = track(makePanelEl());
        const ref = service.attach(triggerEl, panelEl, { placement: 'bottom-start' });

        flushRaf();

        expect(panelEl.style.left).toBe('80px');
        ref.detach();
      });
    });

    it('offsetTop > 0：boundMaxHeight 的可用空間仍以 visual 區間（[0, height]）計算', () => {
      withIosKeyboardViewport({}, () => {
        // avail = 415 - (191 + 4) - 8 = 212 → maxHeight = max(120, min(240, 212)) = 212
        // 錯法 (b) 會用 (208+415) - 195 - 8 = 420 → 撞上限得 240px（限高等於失效）
        const triggerEl = track(makeTriggerEl({ top: 149, bottom: 191 }));
        const panelEl = track(makePanelEl());
        const ref = service.attach(triggerEl, panelEl, {
          placement: 'bottom-start',
          boundMaxHeight: 240,
        });

        flushRaf();

        expect(panelEl.style.maxHeight).toBe('212px');
        ref.detach();
      });
    });

    it('offsetTop > 0：翻轉判斷仍以 visual 區間為準，翻轉後同樣要換算座標', () => {
      withIosKeyboardViewport({}, () => {
        // anchor visual 250–292，stableFlipHeight = 240：
        // 下方 292 + 4 + 240 = 536 > 415（visual 區間下緣）→ 空間不足；
        // 上方 250 - 4 - 240 = 6 ≥ 0 → 翻到 top：visual top = 250 - 4 - 0 = 246
        // → 寫入 fixed 座標 246 + 208 = 454px
        // 錯法 (a)：246px（未換算）／錯法 (b)：536 ≤ 623 → 誤判空間足夠不翻 → 296px
        const triggerEl = track(makeTriggerEl({ top: 250, bottom: 292 }));
        const panelEl = track(makePanelEl());
        const ref = service.attach(triggerEl, panelEl, {
          placement: 'bottom-start',
          stableFlipHeight: 240,
        });

        flushRaf();

        expect(panelEl.style.top).toBe('454px');
        ref.detach();
      });
    });
  });

  // ── z-index calculation ──────────────────────────────────────────────────────

  describe('z-index calculation', () => {
    it('panel 忽略祖先 stacking context z-index，一律使用 9999 floor（對齊 pre-migration：portal 永遠在 modal/wizard 之上）', () => {
      const container = track(document.createElement('div'));
      container.style.position = 'relative';
      container.style.zIndex = '500';
      document.body.appendChild(container);

      const triggerEl = makeTriggerEl();
      container.appendChild(triggerEl);
      track(triggerEl);

      const panelEl = track(makePanelEl());
      const ref = service.attach(triggerEl, panelEl);

      // 不再是 nearest stacking context + 1（501）；Z_INDEX_FLOOR 起算的單調 counter
      expect(panelEl.style.zIndex).toBe('9999');
      ref.detach();
    });

    it('panel gets z-index 9999 when no stacking context found in ancestor chain', () => {
      const { ref, panel } = attach();
      expect(panel.style.zIndex).toBe('9999');
      ref.detach();
    });
  });

  // ── viewport flip ────────────────────────────────────────────────────────────

  describe('viewport flip', () => {
    it('placement="bottom" flips to "top" when trigger bottom + gap exceeds viewport height', () => {
      const vh = window.innerHeight; // 768 in JSDOM
      // trigger bottom at vh-3: bottom+gap = (768-3)+4 = 769 > 768 → flip to top
      const triggerTop = vh - 30;
      const triggerBottom = vh - 3;
      const triggerEl = track(makeTriggerEl({ top: triggerTop, bottom: triggerBottom }));
      const panelEl = track(makePanelEl());
      const ref = service.attach(
        triggerEl,
        panelEl,
        { placement: 'bottom' },
      );

      flushRaf();

      // After flip to 'top': top = triggerTop - gap - panelH = (vh-30) - 4 - 0
      const expectedTop = triggerTop - 4;
      expect(panelEl.style.top).toBe(`${expectedTop}px`);
      ref.detach();
    });

    it('placement="bottom" stays bottom when there is sufficient space', () => {
      const vh = window.innerHeight;
      // trigger bottom at vh/2: plenty of space below
      const triggerBottom = Math.floor(vh / 2);
      const triggerTop = triggerBottom - 20;
      const triggerEl = track(makeTriggerEl({ top: triggerTop, bottom: triggerBottom }));
      const panelEl = track(makePanelEl());
      const ref = service.attach(
        triggerEl,
        panelEl,
        { placement: 'bottom' },
      );

      flushRaf();

      // Should stay bottom: top = triggerBottom + gap
      const expectedTop = triggerBottom + 4;
      expect(panelEl.style.top).toBe(`${expectedTop}px`);
      ref.detach();
    });
  });

  // ── attachAtPoint ────────────────────────────────────────────────────────────

  describe('attachAtPoint', () => {
    it('positions panel at given viewport coordinates with placement="bottom-start" default', () => {
      const panelEl = track(makePanelEl());
      const ref = service.attachAtPoint(100, 200, panelEl);

      flushRaf();

      // placement='bottom-start': top = y + gap = 200 + 4 = 204, left = x = 100
      expect(panelEl.style.top).toBe('204px');
      expect(panelEl.style.left).toBe('100px');
      expect(panelEl.style.position).toBe('fixed');
      ref.detach();
    });

    it('clamps left to min 4px when x is near viewport left edge', () => {
      const panelEl = track(makePanelEl());
      const ref = service.attachAtPoint(2, 200, panelEl); // x=2 < clamp min 4

      flushRaf();

      expect(panelEl.style.left).toBe('4px');
      ref.detach();
    });

    it('accepts custom placement override', () => {
      const panelEl = track(makePanelEl());
      const ref = service.attachAtPoint(100, 200, panelEl, { placement: 'top-start' });

      flushRaf();

      // placement='top-start': top = y - gap - panelH = 200 - 4 - 0 = 196, left = x = 100
      expect(panelEl.style.top).toBe('196px');
      expect(panelEl.style.left).toBe('100px');
      ref.detach();
    });
  });

  // ── No existing component changes (Phase 0 scope integrity) ─────────────────

  describe('Phase 0 scope — no existing elements modified', () => {
    it('service exists in src/app/shared/services/ and is injectable', () => {
      expect(service).toBeTruthy();
      expect(service.attach).toBeDefined();
      expect(service.attachAtPoint).toBeDefined();
    });
  });
});
