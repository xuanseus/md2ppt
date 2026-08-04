<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-content-centered flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰元素 -->
    <div class="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full opacity-15 pointer-events-none" style="background: var(--color-accent)" />
    <div class="absolute top-1/3 right-1/4 w-32 h-32 rounded-full opacity-[0.03] pointer-events-none" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-5xl px-12 text-center">
      <h2 v-if="slide.title" class="centered-title slide-animate">{{ slide.title }}</h2>
      <div v-html="slide.html" class="centered-prose slide-animate" style="animation-delay: 0.15s" />
    </div>
  </div>
</template>

<style scoped>
.ai-content-centered { position: relative; overflow: hidden; }
.centered-title { font-size: var(--fs-h2); font-weight: 700; margin-bottom: 2rem; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.centered-prose :deep(h1) { font-size: var(--fs-h2); font-weight: 700; margin-bottom: 1.5rem; color: var(--color-heading); }
.centered-prose :deep(h2) { font-size: var(--fs-h2); font-weight: 700; margin-bottom: 1.5rem; color: var(--color-heading); }
.centered-prose :deep(h3), .centered-prose :deep(h4) { font-size: var(--fs-h3); font-weight: 600; color: var(--color-muted-foreground); margin-bottom: 1rem; }
.centered-prose :deep(p) { font-size: var(--fs-body); line-height: 1.8; color: var(--color-muted-foreground); margin-bottom: 1rem; }
.centered-prose :deep(ul) { list-style: none; padding: 0; }
.centered-prose :deep(li) { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); padding: 0.5rem 0; }
.centered-prose :deep(li::before) { content: '\2014 '; color: var(--color-accent); }
</style>
