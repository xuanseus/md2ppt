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
  <div class="relative w-screen h-screen overflow-hidden bg-background text-foreground">
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
  </div>
</template>
