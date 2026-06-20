<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden">
    <div class="relative z-10 w-full h-full flex items-center justify-center p-8">
      <div v-html="slide.html" class="beats-media-content" />
    </div>
  </div>
</template>

<style scoped>
.beats-media-content :deep(video) {
  width: 90%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  display: block;
  border-radius: 0.75rem;
}

.beats-media-content :deep(img) {
  width: 90%;
  height: auto;
  max-height: 70vh;
  display: block;
  object-fit: contain;
  border-radius: 0.75rem;
  margin: 0 auto;
}
</style>
