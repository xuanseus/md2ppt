<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-stats-inline flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰 -->
    <div class="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full opacity-12 pointer-events-none" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-3xl px-12 text-center">
      <h3 v-if="slide.title" class="si-title slide-animate">{{ slide.title }}</h3>
      <div v-html="slide.html" class="si-prose slide-animate" style="animation-delay: 0.15s" />
    </div>
  </div>
</template>

<style scoped>
.ai-stats-inline { position: relative; overflow: hidden; padding: 3rem; }
.si-title { font-size: var(--fs-h3); font-weight: 600; text-align: center; margin-bottom: 2rem; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.si-prose :deep(p) { font-size: var(--fs-body); color: var(--color-muted-foreground); line-height: 1.8; text-align: center; }
.si-prose :deep(strong) { font-size: 2.5rem; font-weight: 800; color: var(--color-accent); display: inline-block; margin: 0 0.25rem; font-family: var(--animal-font-family, inherit); }
</style>
