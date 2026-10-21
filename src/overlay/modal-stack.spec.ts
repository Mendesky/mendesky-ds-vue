import { modalStack } from './modal-stack';

describe('modalStack', () => {
  afterEach(() => {
    modalStack.unregister('a');
    modalStack.unregister('b');
  });

  it('後開的在最上層；關掉後前一個回到最上層', () => {
    modalStack.register('a');
    modalStack.register('b');
    expect(modalStack.isTopmost('b')).toBe(true);
    expect(modalStack.isTopmost('a')).toBe(false);
    modalStack.unregister('b');
    expect(modalStack.isTopmost('a')).toBe(true);
  });

  it('堆疊大小跟著開關變化；同一個 id 不重複計算', () => {
    expect(modalStack.stackSize.value).toBe(0);
    modalStack.register('a');
    modalStack.register('a');
    expect(modalStack.stackSize.value).toBe(1);
    expect(modalStack.hasAny()).toBe(true);
    modalStack.unregister('a');
    expect(modalStack.stackSize.value).toBe(0);
    expect(modalStack.hasAny()).toBe(false);
  });
});
