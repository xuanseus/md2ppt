<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'

export interface PopupOption {
  value: string | number
  label: string
  active?: boolean
  hint?: string
  icon?: 'sun' | 'moon'  // 亮/暗 图标，与 dock 按钮同款 SVG
}

const props = defineProps<{
  options: PopupOption[]
  anchorEl: HTMLElement | null
  show: boolean
  dockHeight?: number
}>()

const emit = defineEmits<{
  select: [value: string | number]
  close: []
}>()

const panel = ref<HTMLElement | null>(null)
const highlightedIndex = ref(-1)

// ── 计算水平位置：面板在按钮正上方，不超出屏幕 ──
const panelStyle = computed(() => {
  const bottom = `${(props.dockHeight || 80) + 8}px`
  if (!props.anchorEl) {
    return { position: 'fixed', bottom, left: '50%', transform: 'translateX(-50%)', zIndex: 100, maxWidth: 'calc(100vw - 16px)' } as const
  }
  const rect = props.anchorEl.getBoundingClientRect()
  const btnCenter = rect.left + rect.width / 2
  // 面板以按钮中心为基准，超出屏幕时贴边
  return {
    position: 'fixed',
    bottom,
    left: `${btnCenter}px`,
    transform: 'translateX(-50%)',
    zIndex: 100,
    maxWidth: 'calc(100vw - 16px)',
  } as const
})

function optionElements(): HTMLElement[] {
  if (!panel.value) return []
  return Array.from(panel.value.querySelectorAll('.popup-option'))
}

// ── 指针追踪：滑动到哪个选项就高亮哪个 ──
function onPointerMove(e: PointerEvent) {
  const opts = optionElements()
  highlightedIndex.value = -1
  for (let i = 0; i < opts.length; i++) {
    const rect = opts[i].getBoundingClientRect()
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      highlightedIndex.value = i
      break
    }
  }
}

// ── 全局 pointerup：松手时如果高亮了选项就选中，否则关闭 ──
function onGlobalPointerUp(e: PointerEvent) {
  if (highlightedIndex.value >= 0) {
    const opt = props.options[highlightedIndex.value]
    if (opt) emit('select', opt.value)
  } else {
    emit('close')
  }
}

watch(() => props.show, async (v) => {
  if (v) {
    highlightedIndex.value = -1
    await nextTick()
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onGlobalPointerUp)
  } else {
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onGlobalPointerUp)
  }
})

onUnmounted(() => {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onGlobalPointerUp)
})
</script>

<template>
  <Teleport to="body">
    <!-- 外层：固定定位 + 水平居中（不受动画影响） -->
    <div
      v-if="show"
      :style="panelStyle"
    >
      <!-- 内层：弹出动画 -->
      <div
        ref="panel"
        class="popup-select-panel glass !rounded-xl p-2 flex flex-col gap-0.5 shadow-xl select-none"
      >
        <div
          v-for="(opt, i) in options"
          :key="opt.value"
          class="popup-option flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors text-left whitespace-nowrap cursor-pointer"
          :class="i === highlightedIndex
            ? 'bg-accent/25 text-accent'
            : opt.active
              ? 'bg-accent/10 text-accent'
              : 'text-foreground/70'"
        >
          <svg v-if="opt.icon === 'moon'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg v-else-if="opt.icon === 'sun'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="m4.22 4.22 1.42 1.42"/><path d="m18.36 18.36 1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="m4.22 19.78 1.42-1.42"/><path d="m18.36 5.64 1.42-1.42"/></svg>
          <span class="flex-1">{{ opt.label }}</span>
          <span v-if="opt.hint" class="text-xs text-muted-foreground/50">{{ opt.hint }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
.popup-select-panel {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: popup-in 0.12s ease-out;
}

@keyframes popup-in {
  from { opacity: 0; transform: translateY(8px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
