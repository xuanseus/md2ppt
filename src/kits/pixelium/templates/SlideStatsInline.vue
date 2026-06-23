<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-stats-inline flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2))" />

    <div class="relative z-10 max-w-4xl w-full px-8">
      <h3 v-if="slide.title" class="px-stats-inline-title text-center">{{ slide.title }}</h3>
      <div v-html="slide.html" class="px-stats-inline-prose" />
    </div>
  </div>
</template>

<style scoped>
@keyframes px-stat-inline-pop {
  0% { transform: scale(0.3); opacity: 0; }
  40% { transform: scale(1.15); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
}

.px-stats-inline-title {
  font-size: calc(2rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
  color: var(--color-heading);
}

.px-stats-inline-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  text-align: center;
  font-family: var(--px-font);
}

.px-stats-inline-prose :deep(strong) {
  font-size: calc(2.5rem * var(--content-scale));
  font-weight: 800;
  color: var(--color-accent);
  display: inline-block;
  margin: 0 0.25rem;
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
  animation: px-stat-inline-pop 0.5s ease-out;
}
</style>
