<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
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

watch(() => props.currentIndex, (v) => {
  highlightedIndex.value = v
})

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
            class="aspect-video rounded-lg border-2 overflow-hidden bg-card transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg"
            :class="index === highlightedIndex ? 'border-accent shadow-lg shadow-accent/20 ring-2 ring-accent/50' : 'border-border'"
          >
            <div class="thumb-preview w-full h-full overflow-hidden p-1 pointer-events-none" v-html="slide.html" />
          </div>
          <div class="mt-1.5 text-center text-xs text-muted-foreground">
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
