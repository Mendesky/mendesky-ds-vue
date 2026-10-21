import { ICON_REGISTRY } from '@mendesky/ds';

// 骨架檢查：Vue 版讀得到本體的色彩變數與圖示資料（不自己另存一份）。
describe('本體套件', () => {
  it('全域樣式載入後，讀得到本體的色彩變數', () => {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--text/body').trim();
    expect(value.toLowerCase()).toBe('#686868');
  });

  it('讀得到本體的圖示資料', () => {
    expect(ICON_REGISTRY['Close']).toContain('<path');
  });
});
