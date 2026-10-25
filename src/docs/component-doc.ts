/**
 * Vue 用法說明檔的格式（與 Angular 版相同，方便文件網站並排顯示）。
 *
 * 元件說明分成兩份，以同一個 `id` 對應：
 * - 元件規格（何時用、注意事項、選用表格）：跟框架無關，放在本體套件 `@mendesky/ds` 的
 *   `src/docs/components/<id>.ts`（格式 `ComponentSpec`）。
 * - Vue 用法（元件標籤、屬性、事件、範例程式碼、只有 Vue 才需要知道的注意事項）：放在元件旁邊的 `<id>.docs.ts`，
 *   export 一個 `ComponentApi`。`npm run check:docs` 會比對屬性名稱與元件的 defineProps／defineEmits。
 *
 * 屬性表的命名：一般屬性寫屬性名稱（`text`）；事件寫 `@` 加 kebab-case 名稱（`@btn-click`）並標 `isOutput`；
 * 雙向綁定寫 `v-model`。
 */
import type { ComponentSpec, DocNote } from '@mendesky/ds';

export interface DocProp {
  name: string;
  type: string;
  default?: string;
  desc?: string;
  description?: string;
  isOutput?: boolean;
}

export interface DocUsage {
  label?: string;
  code: string;
}

export interface DocEvent {
  name: string;
  type: string;
  description: string;
}

/** Vue 用法（元件旁邊的 `<id>.docs.ts`）。 */
export interface ComponentApi {
  /** 對應本體元件規格的 id */
  id: string;
  /** Vue 元件標籤，例如 `<DsButton>` */
  selector: string;
  /** 一行屬性摘要 */
  summary?: string;
  props: DocProp[];
  events?: DocEvent[];
  usage: DocUsage[];
  /** 只有 Vue 才需要知道的注意事項（例如 v-model 綁哪個值、插槽怎麼寫）。跨框架的注意事項寫在本體規格的 `notes`。 */
  usageNotes?: Array<DocNote | string>;
}

/** 元件規格＋Vue 用法合併後的完整說明（Storybook 說明頁使用）。 */
export type ComponentDoc = ComponentSpec & ComponentApi;
