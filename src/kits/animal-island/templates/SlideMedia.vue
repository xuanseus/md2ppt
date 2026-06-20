<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-media flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 外圆角边框 -->
    <div class="absolute inset-5 rounded-[24px] border-2 pointer-events-none opacity-15" style="border-color: var(--color-accent)" />

    <!-- 内圆角边框 -->
    <div class="absolute inset-8 rounded-[18px] border pointer-events-none opacity-10" style="border-color: var(--color-accent); border-style: dashed;" />

    <!-- 四角装饰圆点 -->
    <div class="absolute top-4 left-4 w-3 h-3 rounded-full opacity-25" style="background: var(--color-accent)" />
    <div class="absolute top-4 right-4 w-3 h-3 rounded-full opacity-25" style="background: var(--color-accent)" />
    <div class="absolute bottom-4 left-4 w-3 h-3 rounded-full opacity-25" style="background: var(--color-accent)" />
    <div class="absolute bottom-4 right-4 w-3 h-3 rounded-full opacity-25" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full h-full flex items-center justify-center p-10">
      <div v-html="slide.html" class="ai-media-content" />
    </div>
  </div>
</template>

<style scoped>
.ai-media-content :deep(video) {
  max-width: 100%;
  max-height: 65vh;
  object-fit: contain;
  display: block;
  border-radius: var(--animal-border-radius-base, 18px);
}

.ai-media-content :deep(img) {
  max-width: 90%;
  max-height: 65vh;
  display: block;
  margin: 0 auto;
  border-radius: var(--animal-border-radius-base, 18px);
  object-fit: contain;
  box-shadow: 0 4px 20px rgba(61, 52, 40, 0.12);
}
</style>
