<script setup lang="ts">
import { ref } from 'vue'
import { usePresentation } from '../composables/usePresentation'
import { useKeyboardNavigation } from '../composables/useKeyboardNavigation'
import { useTouchNavigation } from '../composables/useTouchNavigation'
import { useSlideTransition } from '../composables/useSlideTransition'
import { useTheme } from '../composables/useTheme'
import SlideRenderer from './SlideRenderer.vue'
import SlideOverview from './SlideOverview.vue'
import DeckControls from './DeckControls.vue'
import ClickSpark from '../components/interactive/ClickSpark.vue'

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

const { currentTransition, cycleTransition } = useSlideTransition()
useTheme() // init theme from localStorage on mount

const isOverview = ref(false)
const viewportRef = ref<HTMLElement | null>(null)

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
  <ClickSpark
    class="relative w-screen h-screen overflow-hidden bg-background text-foreground"
    spark-color="#42D392"
    :spark-size="8"
    :spark-radius="20"
    :spark-count="10"
    :duration="500"
    easing="ease-out"
  >
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

    <div ref="viewportRef" class="w-full h-full">
      <Transition
        v-if="!isOverview && currentSlide"
        :name="currentTransition"
        mode="out-in"
      >
        <div :key="currentSlide.id" class="w-full h-full">
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
      @navigate="handleNavigate"
      @toggle-overview="toggleOverview"
      @cycle-transition="cycleTransition"
      @reload-md="handleReloadMd"
    />
  </ClickSpark>
</template>
