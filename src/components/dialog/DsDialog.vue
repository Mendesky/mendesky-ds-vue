<script lang="ts">
// 每個對話框在 modal 堆疊裡的編號
let counter = 0;
</script>

<script setup lang="ts">
/**
 * DsDialog — 不可逆操作前的確認、或錯誤提示 alert（對應 Angular 版 app-dialog）。
 *
 * 用 Teleport 掛到 body 最上層，不會被外層 modal 的 transform 蓋住。
 * 開著時：Tab 只在對話框裡循環、Esc 等於取消（疊了好幾層時只有最上層回應）；
 * 關閉時先播退場動畫（250ms）再移除，焦點還給開啟前的元素。
 * Warning 只代表「紅色嚴重度」，不等於刪除：非刪除的確認請傳 confirmIcon=""。
 */
import '@mendesky/ds/styles/components/dialog.scss';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import DsButton from '../button/DsButton.vue';
import { modalStack } from '../../overlay/modal-stack';
import { createFocusTrap, type FocusTrap } from '../../overlay/focus-trap';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    header?: string;
    content?: string;
    propClass?: 'Warning' | 'Normal';
    confirmText?: string;
    /** Warning 確認鈕的左側圖示；非刪除的確認傳 '' 拿掉圖示（仍保留紅色） */
    confirmIcon?: string;
    showCancel?: boolean;
    /** 取消（次要）按鈕文字 */
    cancelText?: string;
    loading?: boolean;
  }>(),
  {
    isOpen: false,
    header: 'Header',
    content: 'Content',
    propClass: 'Warning',
    confirmText: '確認封存',
    confirmIcon: 'Trash-Del',
    showCancel: true,
    cancelText: '取消並關閉',
    loading: false,
  },
);

const emit = defineEmits<{ cancel: []; confirm: [] }>();

const visible = ref(false);
const isClosing = ref(false);
const cardEl = ref<HTMLElement | null>(null);
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let trap: FocusTrap | null = null;

const dialogId = `dialog-${++counter}`;

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return;
  if (!props.isOpen) return;
  if (!modalStack.isTopmost(dialogId)) return;
  event.preventDefault();
  emit('cancel');
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (closeTimer) clearTimeout(closeTimer);
      visible.value = true;
      isClosing.value = false;
      modalStack.register(dialogId);
    } else if (visible.value) {
      modalStack.unregister(dialogId);
      isClosing.value = true;
      closeTimer = setTimeout(() => {
        visible.value = false;
        isClosing.value = false;
      }, 250);
    }
  },
  { immediate: true },
);

// 卡片出現時把焦點圈在裡面；卡片移除時還給原本的元素
watch(cardEl, (el) => {
  if (el) {
    trap = createFocusTrap(el);
    nextTick(() => trap?.activate());
  } else {
    trap?.deactivate();
    trap = null;
  }
});

onMounted(() => document.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  if (closeTimer) clearTimeout(closeTimer);
  modalStack.unregister(dialogId);
  trap?.deactivate();
});
</script>

<template>
  <Teleport to="body">
    <span class="ds-dialog" v-bind="$attrs">
      <div v-if="visible" class="dialog-overlay" :class="{ 'dialog-overlay--leaving': isClosing }" @click.stop>
        <!-- Backdrop -->
        <div class="dialog-backdrop" :class="{ 'dialog-backdrop--leaving': isClosing }"></div>

        <!-- Dialog Card -->
        <div ref="cardEl" class="dialog-card" :class="{ 'dialog-card--leaving': isClosing }" role="dialog" aria-modal="true">
          <div class="dialog-wrapper">
            <!-- Header：圖示＋標題＋分隔線 -->
            <div class="dialog-header-section">
              <div class="dialog-header-row">
                <span class="dialog-header-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                    <path d="M12 8.5v1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M12 12.5v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                </span>
                <span class="dialog-header-title">{{ header }}</span>
              </div>
              <div class="dialog-divider"></div>
            </div>

            <!-- Content -->
            <div class="dialog-content">{{ content }}</div>

            <!-- Actions -->
            <div class="dialog-actions">
              <DsButton
                v-if="showCancel"
                variant="elevated"
                :text="cancelText"
                :full-width="true"
                style="flex: 1"
                @btn-click="emit('cancel')"
              />
              <DsButton
                v-if="propClass === 'Warning'"
                :text="confirmText"
                variant="filled"
                color="danger"
                :left-icon="confirmIcon"
                :full-width="true"
                :loading="loading"
                style="flex: 1"
                @btn-click="emit('confirm')"
              />
              <DsButton
                v-if="propClass === 'Normal'"
                :text="confirmText"
                variant="filled"
                color="primary"
                :full-width="true"
                :loading="loading"
                style="flex: 1"
                @btn-click="emit('confirm')"
              />
            </div>
          </div>
        </div>
      </div>
    </span>
  </Teleport>
</template>
