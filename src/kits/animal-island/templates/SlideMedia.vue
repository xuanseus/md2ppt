<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-media flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 边框装饰 -->
    <div class="absolute inset-4 rounded-3xl border-2 pointer-events-none opacity-15" style="border-color: var(--color-accent)" />

    <div class="relative z-10 w-full h-full flex items-center justify-center p-8">
      <div v-html="slide.html" class="ai-media-content" />
    </div>
  </div>
</template>

<style scoped>
.ai-media-content :deep(video) {
  width: 100vw;
  height: 100vh;
  object-fit: contain;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ai-media-content :deep(img) {
  max-width: 95%;
  max-height: 85vh;
  display: block;
  margin: 0 auto;
  border-radius: var(--animal-border-radius-base, 18px);
  object-fit: contain;
  box-shadow: 0 4px 20px rgba(61, 52, 40, 0.12);
}
</style>
