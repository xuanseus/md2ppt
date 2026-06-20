<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePresentation } from '../composables/usePresentation'
import { useKeyboardNavigation } from '../composables/useKeyboardNavigation'
import { useTouchNavigation } from '../composables/useTouchNavigation'
import { useSlideTransition } from '../composables/useSlideTransition'
import { initTheme, useKit } from '../composables/useKit'
import SlideRenderer from './SlideRenderer.vue'
import SlideOverview from './SlideOverview.vue'
import DeckControls from './DeckControls.vue'
import Aurora from '../components/backgrounds/Aurora.vue'
import Silk from '../components/backgrounds/Silk.vue'
import Grainient from '../components/backgrounds/Grainient.vue'

const {
  slides,
  currentSlideIndex,
  currentSlide,
  totalSlides,
  hasPrev,
  hasNext,
  goToSlide,
  next,
  prev,
  goToFirst,
  goToLast,
  reloadMarkdownFromFile,
} = usePresentation()

const { currentTransition, transitions, cycleTransition, setTransition } = useSlideTransition()
const { activeKit } = useKit()
initTheme() // init kit theme from localStorage on mount

const isOverview = ref(false)
const viewportRef = ref<HTMLElement | null>(null)

// ── 全局背景策略：Beats 用 WebGL，Animal Island 等用静态 CSS ──
const useWebGL = computed(() => activeKit.decorations?.background === 'webgl')

// ── 持久背景：根据当前 slide 类型切换 Aurora / Silk，v-show 常驻不卸载 ──
function readCSSColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

const auroraColors = ref<string[]>(['#42D392', '#1a1a2e', '#647EFF'])
const silkColor = ref('#42D392')
const grainientColors = ref<string[]>(['#FF9FFC', '#5227FF', '#B19EEF'])

function syncBackgroundColors() {
  auroraColors.value = [
    readCSSColor('--color-accent'),
    readCSSColor('--color-foreground'),
    readCSSColor('--color-h1-to'),
  ]
  silkColor.value = readCSSColor('--color-accent') || '#42D392'
  grainientColors.value = [
    readCSSColor('--color-background') || '#ffffff',
    readCSSColor('--color-accent') || '#42D392',
    readCSSColor('--color-h1-to') || '#647EFF',
  ]
}

let colorObserver: MutationObserver | null = null

onMounted(() => {
  syncBackgroundColors()
  colorObserver = new MutationObserver(syncBackgroundColors)
  colorObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
})

onUnmounted(() => {
  colorObserver?.disconnect()
})

// 与 SlideRenderer 逻辑一致：layout 优先、type 兜底
function effectiveLayout(slide: typeof currentSlide.value): string {
  if (!slide) return ''
  return (slide.layout && slide.layout !== 'auto') ? slide.layout : slide.type
}
const showAurora = computed(() => effectiveLayout(currentSlide.value) === 'cover')
const showSilk = computed(() => effectiveLayout(currentSlide.value) === 'section')
const showGrainient = computed(() => {
  const el = effectiveLayout(currentSlide.value)
  return el !== 'cover' && el !== 'section'
})

// Wheel navigation with debounce
let wheelLocked = false
function handleWheel(e: WheelEvent) {
  if (wheelLocked || isOverview.value) return
  wheelLocked = true
  if (e.deltaY > 0) next()
  else if (e.deltaY < 0) prev()
  setTimeout(() => { wheelLocked = false }, 600)
}

onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
})

useKeyboardNavigation(
  next,
  prev,
  goToFirst,
  goToLast,
  goToSlide,
  isOverview,
)
useTouchNavigation(next, prev, viewportRef)

function handleSelectSlide(index: number) {
  goToSlide(index)
  isOverview.value = false
}

function handleNavigate(direction: 'next' | 'prev') {
  if (direction === 'next') next()
  else prev()
}

function toggleOverview() {
  isOverview.value = !isOverview.value
}

async function handleReloadMd() {
  await reloadMarkdownFromFile()
}
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden bg-background text-foreground">
    <!-- 全局背景装饰 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- 基础渐变底色 -->
      <div class="absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-background to-[var(--color-h1-to)]/[0.06]" />
      <!-- 浮动光晕 -->
      <div class="orb w-[500px] h-[500px] bg-accent/[0.06] -top-20 -left-20" style="animation-delay: -2s" />
      <div class="orb w-[400px] h-[400px] bg-[var(--color-h1-to)]/[0.05] bottom-0 right-0" style="animation-delay: -6s" />
      <div class="orb w-[300px] h-[300px] bg-accent/[0.04] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style="animation-delay: -10s" />
      <!-- 顶部细线装饰 -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
    </div>

    <div ref="viewportRef" class="relative w-full h-full overflow-hidden">
      <!-- 持久背景层，Transition 期间永不消失 -->
      <div class="absolute inset-0 z-0" style="background-color: var(--color-background)" />

      <!-- WebGL 背景（仅 Beats 等 webgl 套件）— 常驻不卸载，v-show 只切换显隐 -->
      <div v-if="useWebGL" class="absolute inset-0 z-[1] pointer-events-none">
        <Aurora
          v-show="showAurora"
          :color-stops="auroraColors"
          :speed="0.8"
          :amplitude="0.6"
          :intensity="0.8"
        />
        <Silk
          v-show="showSilk"
          :color="silkColor"
          :speed="3"
          :scale="1.2"
          :noise-intensity="1.2"
        />
        <Grainient
          v-show="showGrainient"
          :color1="grainientColors[0]"
          :color2="grainientColors[1]"
          :color3="grainientColors[2]"
          :time-speed="0.15"
          :warp-strength="0.25"
          :grain-amount="0.03"
          :contrast="1.0"
          :saturation="0.5"
        />
      </div>

      <!-- 半透遮罩（仅 WebGL 套件需要，压暗背景使其不喧宾夺主） -->
      <div v-if="useWebGL" class="absolute inset-0 z-[2] pointer-events-none" style="background: var(--color-background); opacity: 0.3" />

      <Transition
        v-if="!isOverview && currentSlide"
        :name="currentTransition"
        mode="out-in"
      >
        <div :key="currentSlide.id" class="relative w-full h-full" :class="currentSlide?.layout === 'media-hero' || currentSlide?.type === 'media' ? 'z-10' : 'z-10'">
          <SlideRenderer :slide="currentSlide" />
        </div>
      </Transition>
    </div>

    <SlideOverview
      v-if="isOverview"
      :slides="slides"
      :current-index="currentSlideIndex"
      @select="handleSelectSlide"
      @close="isOverview = false"
    />

    <DeckControls
      v-if="!isOverview"
      :current-slide-index="currentSlideIndex"
      :total-slides="totalSlides"
      :has-prev="hasPrev"
      :has-next="hasNext"
      :transition-name="currentTransition"
      :transitions="transitions"
      @navigate="handleNavigate"
      @toggle-overview="toggleOverview"
      @cycle-transition="cycleTransition"
      @set-transition="setTransition"
      @reload-md="handleReloadMd"
    />
  </div>
</template>
