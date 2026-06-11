<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { Slide } from '../types/slides'

const props = defineProps<{
  slides: Slide[]
  currentIndex: number
}>()

const emit = defineEmits<{
  select: [index: number]
  close: []
}>()

const highlightedIndex = ref(props.currentIndex)
const cardRefs = ref<Map<number, HTMLElement>>(new Map())

watch(() => props.currentIndex, (v) => {
  highlightedIndex.value = v
})

function setCardRef(el: HTMLElement | null, index: number) {
  if (el) cardRefs.value.set(index, el)
  else cardRefs.value.delete(index)
}

function handleTiltMove(e: MouseEvent, index: number) {
  const el = cardRefs.value.get(index)
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -8
  const rotateY = ((x - centerX) / centerX) * 8
  el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
}

function handleTiltLeave(index: number) {
  const el = cardRefs.value.get(index)
  if (!el) return
  el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'
}

function handleSelect(index: number) {
  emit('select', index)
}

function handleKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'Enter':
      e.preventDefault()
      handleSelect(highlightedIndex.value)
      break
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.slides.length - 1)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Escape':
      e.preventDefault()
      emit('close')
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="slide-overview fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
    @click.self="emit('close')"
  >
    <div class="p-6 border-b border-border text-center">
      <h2 class="text-lg font-semibold">幻灯片预览 — 共 {{ slides.length }} 页</h2>
      <p class="text-sm text-muted-foreground mt-1">点击缩略图 / 按 Enter 跳转 / 按 ESC 返回</p>
    </div>
    <div class="flex-1" style="overflow-y:auto; padding:32px;" @keydown.enter.prevent="handleSelect(highlightedIndex)">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full" style="gap:16px;">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="cursor-pointer group"
          @click="handleSelect(index)"
        >
          <div
            :ref="(el: any) => setCardRef(el, index)"
            class="thumb-container aspect-video rounded-xl border-2 overflow-hidden bg-card"
            style="transition: transform 0.15s ease-out, box-shadow 0.2s, border-color 0.2s;"
            :class="index === highlightedIndex ? 'border-accent shadow-lg shadow-accent/20 ring-2 ring-accent/50' : 'border-border hover:shadow-lg hover:shadow-accent/10'"
            @mousemove="handleTiltMove($event, index)"
            @mouseleave="handleTiltLeave(index)"
          >
            <div class="thumb-preview w-full h-full pointer-events-none" v-html="slide.html" />
          </div>
          <div class="mt-1.5 text-center text-xs text-muted-foreground">
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thumb-container {
  will-change: transform;
  transform-style: preserve-3d;
}
</style>
