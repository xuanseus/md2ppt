<script setup lang="ts">
import themes, { getNextTheme } from '../themes'

defineProps<{
  currentSlideIndex: number
  totalSlides: number
  hasPrev: boolean
  hasNext: boolean
  transitionName: string
}>()

const emit = defineEmits<{
  navigate: [direction: 'next' | 'prev']
  toggleOverview: []
  cycleTransition: []
}>()

const curName = ref(localStorage.getItem('theme-preset') || themes[0].name)
const curTheme = computed(() => themes.find(t => t.name === curName.value) || themes[0])
const themeLabel = computed(() => curTheme.value.label)
const themeIsDark = computed(() => curTheme.value.dark)

function handleThemeClick(e: MouseEvent) {
  const x = e.clientX
  const y = e.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )
  const el = document.documentElement
  el.style.setProperty('--circle-x', `${x}px`)
  el.style.setProperty('--circle-y', `${y}px`)
  el.style.setProperty('--circle-r', `${endRadius}px`)

  const next = getNextTheme(curName.value)

  const apply = () => {
    el.classList.toggle('dark', next.dark)
    for (const [k, v] of Object.entries(next.vars)) {
      el.style.setProperty(k, v)
    }
    localStorage.setItem('theme-preset', next.name)
    curName.value = next.name
  }

  if (document.startViewTransition) {
    document.startViewTransition(() => apply())
  } else {
    apply()
  }
}

// ── 内容缩放 (1x / 1.25x / 1.5x) ──
const scaleOptions = [1, 1.25, 1.5]
const scaleLabels = ['1x', '1.25x', '1.5x']
const currentScaleIndex = ref(parseInt(localStorage.getItem('content-scale') || '0'))

function cycleScale() {
  currentScaleIndex.value = (currentScaleIndex.value + 1) % scaleOptions.length
  const scale = scaleOptions[currentScaleIndex.value]
  document.documentElement.style.setProperty('--content-scale', String(scale))
  localStorage.setItem('content-scale', String(currentScaleIndex.value))
}

const isFullscreen = ref(false)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

const visible = ref(true)
let hideTimer: ReturnType<typeof setTimeout> | null = null

function resetTimer() {
  visible.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    visible.value = false
  }, 3000)
}

onMounted(() => {
  resetTimer()
  window.addEventListener('mousemove', resetTimer)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', resetTimer)
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <div
    class="deck-controls fixed bottom-0 inset-x-0 z-40 transition-all duration-500"
    :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'"
  >
    <div class="flex items-center justify-center gap-2 p-4">
      <div
        class="flex items-center gap-1 bg-card/80 backdrop-blur-md border border-border rounded-xl px-3 py-2 shadow-lg"
      >
        <button
          :disabled="!hasPrev"
          class="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="emit('navigate', 'prev')"
          title="上一页 (←)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <span class="text-sm font-mono tabular-nums min-w-20 text-center select-none">
          {{ currentSlideIndex + 1 }} / {{ totalSlides }}
        </span>

        <button
          :disabled="!hasNext"
          class="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="emit('navigate', 'next')"
          title="下一页 (→)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div
        class="flex items-center gap-1 bg-card/80 backdrop-blur-md border border-border rounded-xl px-2 py-2 shadow-lg"
      >
        <button
          class="p-2 rounded-lg hover:bg-muted transition-colors"
          @click="toggleFullscreen"
          :title="isFullscreen ? '退出全屏 (ESC)' : '全屏 (F)'"
        >
          <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
        </button>

        <button
            class="p-2 rounded-lg hover:bg-muted transition-colors"
            @click="emit('toggleOverview')"
            title="幻灯片预览 (ESC)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </button>

        <button
          class="p-2 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-1"
          @click="handleThemeClick"
          :title="`当前: ${themeLabel} — 点击切换`"
        >
          <svg v-if="themeIsDark" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          <span class="text-xs ml-1 hidden sm:inline">{{ themeLabel }}</span>
        </button>

        <button
          class="p-2 rounded-lg hover:bg-muted transition-colors text-xs font-mono"
          @click="emit('cycleTransition')"
          :title="`当前动画: ${transitionName}`"
        >
          {{ transitionName }}
        </button>

        <span class="w-px h-5 bg-border/30" />

        <button
          class="p-2 rounded-lg hover:bg-muted transition-colors text-xs font-mono"
          @click="cycleScale"
          :title="`内容缩放: ${scaleLabels[currentScaleIndex]}`"
        >
          {{ scaleLabels[currentScaleIndex] }}
        </button>
      </div>
    </div>
  </div>
</template>
