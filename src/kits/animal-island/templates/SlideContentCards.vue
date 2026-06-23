<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-content-cards flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰元素 -->
    <div class="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full opacity-15 pointer-events-none" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-4xl px-10">
      <h2 v-if="slide.title" class="cards-title slide-animate">{{ slide.title }}</h2>
      <div class="card slide-animate" style="animation-delay: 0.15s">
        <div v-html="slide.html" class="cards-prose" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-content-cards { position: relative; overflow: hidden; padding: 2.5rem 3rem; }
.cards-title { font-size: var(--fs-h2); font-weight: 700; text-align: center; margin-bottom: 2rem; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.card { padding: 2.5rem 3rem; border-radius: var(--animal-border-radius-lg, 24px); background: color-mix(in srgb, var(--color-muted) 20%, transparent); border: 2px solid var(--color-border); box-shadow: 0 3px 12px rgba(61, 52, 40, 0.05); }
.cards-prose :deep(h1), .cards-prose :deep(h2), .cards-prose :deep(h3), .cards-prose :deep(h4) { display: none; }
.cards-prose :deep(p) { font-size: var(--fs-body); color: var(--color-muted-foreground); line-height: 1.8; }
.cards-prose :deep(ul) { list-style: none; padding: 0; }
.cards-prose :deep(li) { font-size: var(--fs-body-sm); padding: 0.4rem 0; color: var(--color-muted-foreground); }
.cards-prose :deep(li::before) { content: '\25B8 '; color: var(--color-accent); }
</style>
