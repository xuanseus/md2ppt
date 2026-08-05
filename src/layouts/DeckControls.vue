<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useKit } from '../composables/useKit'
import { useLongPress } from '../composables/useLongPress'
import PopupSelect, { type PopupOption } from './PopupSelect.vue'
import type { TransitionType } from '../composables/useSlideTransition'

const props = defineProps<{
  currentSlideIndex: number
  totalSlides: number
  hasPrev: boolean
  hasNext: boolean
  transitionName: string
  transitions: TransitionType[]
}>()

const emit = defineEmits<{
  navigate: [direction: 'next' | 'prev']
  toggleOverview: []
  cycleTransition: []
  setTransition: [t: TransitionType]
}>()

const { activeKit, kits, setKit, getNextKit, cycleTheme, applyTheme, getCurrentTheme } = useKit()

// ── 主题状态 ──
const currentThemeName = ref(localStorage.getItem('theme-preset') || activeKit.themes[0]?.name || '')
const curTheme = computed(() => activeKit.themes.find(t => t.name === currentThemeName.value) || activeKit.themes[0])
const themeLabel = computed(() => curTheme.value?.label || '默认')
const themeIsDark = computed(() => curTheme.value?.dark || false)
const kitLabel = computed(() => activeKit.label)
const nextKit = computed(() => getNextKit())

// ── 缩放状态 ──
const scaleOptions = [1, 1.25, 1.5]
const scaleLabels = ['1x', '1.25x', '1.5x']
const currentScaleIndex = ref(parseInt(localStorage.getItem('content-scale') || '1'))

function cycleScale() {
  currentScaleIndex.value = (currentScaleIndex.value + 1) % scaleOptions.length
  applyScale(currentScaleIndex.value)
}

function setScale(idx: number) {
  currentScaleIndex.value = idx
  applyScale(idx)
}

function applyScale(idx: number) {
  const scale = scaleOptions[idx]
  document.documentElement.style.setProperty('--content-scale', String(scale))
  localStorage.setItem('content-scale', String(idx))
}

// ── 全屏 ──
const isFullscreen = ref(false)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

onMounted(() => {
  updateDockHeight()
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

// ── 自动播放 ──
const isPlaying = ref(false)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

function toggleAutoplay() {
  isPlaying.value ? stopAutoplay() : startAutoplay()
}

function startAutoplay() {
  isPlaying.value = true
  autoplayTimer = setInterval(() => {
    if (props.hasNext) {
      emit('navigate', 'next')
    } else {
      stopAutoplay()
    }
  }, 3000)
}

function stopAutoplay() {
  isPlaying.value = false
  if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null }
}

onUnmounted(() => { stopAutoplay() })

// ── 键盘快捷键（行为与手动点击完全一致） ──
function shortcutKit() { setKit(nextKit.value.id) }
function shortcutTheme() {
  // 模拟点击事件，复用 ViewTransition 效果
  const el = document.documentElement
  const x = window.innerWidth / 2
  const y = window.innerHeight / 2
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  el.style.setProperty('--circle-x', `${x}px`)
  el.style.setProperty('--circle-y', `${y}px`)
  el.style.setProperty('--circle-r', `${endRadius}px`)
  const curIdx = activeKit.themes.findIndex(t => t.name === currentThemeName.value)
  const next = activeKit.themes[(curIdx + 1) % activeKit.themes.length]
  const apply = () => {
    if (next) {
      el.classList.toggle('dark', next.dark)
      for (const [k, v] of Object.entries(next.vars)) el.style.setProperty(k, v)
      localStorage.setItem('theme-preset', next.name)
      currentThemeName.value = next.name
    }
  }
  if (document.startViewTransition) { document.startViewTransition(() => apply()) } else { apply() }
}

function handleShortcut(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  switch (e.key) {
    case 'p': case 'P': e.preventDefault(); toggleAutoplay(); break
    case 'k': case 'K': e.preventDefault(); shortcutKit(); break
    case 't': case 'T': e.preventDefault(); shortcutTheme(); break
    case 'a': case 'A': e.preventDefault(); emit('cycleTransition'); break
    case 's': case 'S': e.preventDefault(); cycleScale(); break
  }
}
onMounted(() => window.addEventListener('keydown', handleShortcut))
onUnmounted(() => window.removeEventListener('keydown', handleShortcut))

// ── 自动隐藏 ──
// 鼠标移入 dock 底部热区才显示；1s 无操作自动隐藏（不区分全屏/非全屏）
const visible = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null
const DOCK_ZONE = 100 // 底部热区高度（px）

function hideDock() {
  if (!popupType.value) visible.value = false
}

function handleMouseMove(e: MouseEvent) {
  // 仅在底部热区内显示并顺延 1s 隐藏计时
  if (e.clientY >= window.innerHeight - DOCK_ZONE) {
    visible.value = true
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(hideDock, 1000)
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (hideTimer) clearTimeout(hideTimer)
})

// ═══════════════════════════════════════════
// 弹出面板状态
// ═══════════════════════════════════════════
const popupType = ref<'kit' | 'theme' | 'transition' | 'scale' | null>(null)
const popupAnchor = ref<HTMLElement | null>(null)
const dockRef = ref<HTMLElement | null>(null)
const dockHeight = ref(80)

function updateDockHeight() {
  if (dockRef.value) dockHeight.value = dockRef.value.offsetHeight
}

function closePopup() {
  popupType.value = null
  popupAnchor.value = null
}

// ── 套件 popup ──
const kitBtn = ref<HTMLElement | null>(null)

const kitLong = useLongPress(
  () => setKit(nextKit.value.id),
  () => { updateDockHeight(); popupType.value = 'kit'; popupAnchor.value = kitBtn.value },
)

const kitOptions = computed<PopupOption[]>(() =>
  kits.map(k => ({
    value: k.id,
    label: k.label,
    active: k.id === activeKit.id,
  }))
)

function selectKit(id: string | number) {
  closePopup()
  setKit(String(id))
}

// ── 主题 popup ──
const themeBtn = ref<HTMLElement | null>(null)

// 短按：ViewTransition 圆形展开切换
function shortTheme(e: PointerEvent) {
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

  const curIdx = activeKit.themes.findIndex(t => t.name === currentThemeName.value)
  const next = activeKit.themes[(curIdx + 1) % activeKit.themes.length]

  const apply = () => {
    if (next) {
      el.classList.toggle('dark', next.dark)
      for (const [k, v] of Object.entries(next.vars)) {
        el.style.setProperty(k, v)
      }
      localStorage.setItem('theme-preset', next.name)
      currentThemeName.value = next.name
    }
  }

  if (document.startViewTransition) {
    document.startViewTransition(() => apply())
  } else {
    apply()
  }
}

const themeLong = useLongPress(
  shortTheme,
  () => { updateDockHeight(); popupType.value = 'theme'; popupAnchor.value = themeBtn.value },
)

const themeOptions = computed<PopupOption[]>(() =>
  activeKit.themes.map(t => ({
    value: t.name,
    label: t.label,
    active: t.name === currentThemeName.value,
    icon: (t.dark ? 'moon' : 'sun') as 'moon' | 'sun',
  }))
)

function selectTheme(name: string | number) {
  const theme = activeKit.themes.find(t => t.name === String(name))
  if (theme) {
    applyTheme(activeKit, theme)
    currentThemeName.value = theme.name
  }
  closePopup()
}

// ── 翻页动画 popup ──
const transitionBtn = ref<HTMLElement | null>(null)

const transitionLong = useLongPress(
  () => emit('cycleTransition'),
  () => { updateDockHeight(); popupType.value = 'transition'; popupAnchor.value = transitionBtn.value },
)

const transitionOptions = computed<PopupOption[]>(() =>
  props.transitions.map(t => ({
    value: t,
    label: t,
    active: t === props.transitionName,
  }))
)

function selectTransition(t: string | number) {
  emit('setTransition', String(t) as TransitionType)
  closePopup()
}

// ── 缩放 popup ──
const scaleBtn = ref<HTMLElement | null>(null)

const scaleLong = useLongPress(
  () => cycleScale(),
  () => { updateDockHeight(); popupType.value = 'scale'; popupAnchor.value = scaleBtn.value },
)

const scalePopupOptions = computed<PopupOption[]>(() =>
  scaleLabels.map((l, i) => ({
    value: i,
    label: l,
    active: i === currentScaleIndex.value,
  }))
)

function selectScale(idx: string | number) {
  setScale(Number(idx))
  closePopup()
}
</script>

<template>
  <div
    ref="dockRef" class="deck-controls fixed bottom-0 inset-x-0 z-[100] transition-all duration-500"
    :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'"
  >
    <div class="flex items-center justify-center gap-2 p-4">
      <div
        class="flex items-center gap-1 bg-card/80 backdrop-blur-md border border-border rounded-xl px-3 py-2 shadow-lg"
      >
        <button
          :disabled="!hasPrev"
          class="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="stopAutoplay(); emit('navigate', 'prev')"
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
          @click="stopAutoplay(); emit('navigate', 'next')"
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
            title="幻灯片预览 (Tab)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </button>

        <!-- 自动播放 -->
        <button
          class="p-2 rounded-lg hover:bg-muted transition-colors"
          @click="toggleAutoplay"
          :title="isPlaying ? '停止自动播放' : '自动播放 (3s) (P)'"
        >
          <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        </button>

        <span class="w-px h-5 bg-border/30" />

        <!-- Kit 套件 — 短按循环 / 长按面板 -->
        <button
          ref="kitBtn"
          class="p-2 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-1 select-none"
          :title="`套件: ${kitLabel} — 点击切换 / 长按列表 (K)`"
          @pointerdown="kitLong.onPointerDown"
          @pointerup="kitLong.onPointerUp"
          @pointerleave="kitLong.onPointerLeave"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
          <span class="text-xs hidden sm:inline">{{ kitLabel }}</span>
        </button>

        <!-- 主题 — 短按循环 / 长按面板 -->
        <button
          ref="themeBtn"
          class="p-2 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-1 select-none"
          :title="`主题: ${themeLabel} — 点击切换 / 长按列表 (T)`"
          @pointerdown="themeLong.onPointerDown"
          @pointerup="themeLong.onPointerUp"
          @pointerleave="themeLong.onPointerLeave"
        >
          <svg v-if="themeIsDark" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="m4.22 4.22 1.42 1.42"/><path d="m18.36 18.36 1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="m4.22 19.78 1.42-1.42"/><path d="m18.36 5.64 1.42-1.42"/></svg>
          <span class="text-xs ml-1 hidden sm:inline">{{ themeLabel }}</span>
        </button>

        <span class="w-px h-5 bg-border/30" />

        <!-- 翻页动画 — 短按循环 / 长按面板 -->
        <button
          ref="transitionBtn"
          class="p-2 rounded-lg hover:bg-muted transition-colors text-xs font-mono select-none"
          :title="`翻页动画: ${transitionName} — 点击切换 / 长按列表 (A)`"
          @pointerdown="transitionLong.onPointerDown"
          @pointerup="transitionLong.onPointerUp"
          @pointerleave="transitionLong.onPointerLeave"
        >
          {{ transitionName }}
        </button>

        <!-- 缩放 — 短按循环 / 长按面板 -->
        <button
          ref="scaleBtn"
          class="p-2 rounded-lg hover:bg-muted transition-colors text-xs font-mono select-none"
          :title="`缩放: ${scaleLabels[currentScaleIndex]} — 点击切换 / 长按列表 (S)`"
          @pointerdown="scaleLong.onPointerDown"
          @pointerup="scaleLong.onPointerUp"
          @pointerleave="scaleLong.onPointerLeave"
        >
          {{ scaleLabels[currentScaleIndex] }}
        </button>
      </div>
    </div>

    <!-- ═══ 弹出面板 ═══ -->
    <PopupSelect
      :show="popupType === 'kit'"
      :options="kitOptions"
      :anchor-el="popupAnchor"
      :dock-height="dockHeight"
      @select="selectKit"
      @close="closePopup"
    />
    <PopupSelect
      :show="popupType === 'theme'"
      :options="themeOptions"
      :anchor-el="popupAnchor"
      :dock-height="dockHeight"
      @select="selectTheme"
      @close="closePopup"
    />
    <PopupSelect
      :show="popupType === 'transition'"
      :options="transitionOptions"
      :anchor-el="popupAnchor"
      :dock-height="dockHeight"
      @select="selectTransition"
      @close="closePopup"
    />
    <PopupSelect
      :show="popupType === 'scale'"
      :options="scalePopupOptions"
      :anchor-el="popupAnchor"
      :dock-height="dockHeight"
      @select="selectScale"
      @close="closePopup"
    />
  </div>
</template>
