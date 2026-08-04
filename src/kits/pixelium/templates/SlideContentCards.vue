<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-content-cards flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <div class="relative z-10 max-w-5xl w-full px-8">
      <h3 v-if="slide.title" class="px-cards-title text-center">{{ slide.title }}</h3>
      <div style="background: var(--color-card); border: 3px solid var(--color-border); box-shadow: 6px 6px 0 #0006; padding: 2.5rem 3rem;">
        <div v-html="slide.html" class="px-cards-prose" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-cards-title {
  font-size: calc(2.5rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 2rem;
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
}

.px-cards-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  font-family: var(--px-font);
}

.px-cards-prose :deep(ul) {
  list-style: none;
  padding: 0;
}

.px-cards-prose :deep(li) {
  font-size: var(--fs-body-sm);
  padding: 0.4rem 0;
  color: var(--color-muted-foreground);
  font-family: var(--px-font);
}

.px-cards-prose :deep(li::before) {
  content: '▸ ';
  color: var(--color-accent);
}
</style>
