import type { InjectionKey, Ref } from 'vue';

/**
 * DsField 交給裡面控制項的資訊（對應 Angular 版 app-input 讀 app-field 的 labelId／labelText／isRequired）。
 * 放在獨立檔案：DsField、DsInput 都 import 它，兩個 .vue 不用互相 import。
 */
export interface FieldContext {
  /** 標題元素的 id；控制項用 aria-labelledby 指向它 */
  readonly labelId: string;
  /** 標題文字（去掉前後空白）；空字串＝沒有標題，不連 */
  readonly labelText: Readonly<Ref<string>>;
  /** 欄位是否標了必填 */
  readonly required: Readonly<Ref<boolean>>;
  /** DsField 元件實例的 uid；控制項只在上一層元件就是這個 DsField 時才連（直接寫在插槽裡） */
  readonly ownerUid: number;
}

export const FIELD_CONTEXT: InjectionKey<FieldContext> = Symbol('DsFieldContext');
