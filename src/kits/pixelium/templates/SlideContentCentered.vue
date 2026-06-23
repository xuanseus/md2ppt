<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-content-center flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <div class="relative z-10 max-w-3xl w-full px-8 text-center">
      <h3 v-if="slide.title" class="px-content-title">{{ slide.title }}</h3>
      <div v-html="slide.html" class="px-content-prose" />
    </div>
  </div>
</template>

<style scoped>
.px-content-center {
  /* overflow hidden for safety */
}

.px-content-title {
  font-size: calc(2.5rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 2rem;
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
}

.px-content-prose :deep(h1),
.px-content-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-family: var(--px-font);
  color: var(--color-heading);
}

.px-content-prose :deep(h3),
.px-content-prose :deep(h4) {
  font-size: var(--fs-h3);
  font-weight: 500;
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;
}

.px-content-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;
  font-family: var(--px-font);
}

.px-content-prose :deep(ul) {
  list-style: none;
  padding: 0;
}

.px-content-prose :deep(li) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  padding: 0.5rem 0;
  font-family: var(--px-font);
}

.px-content-prose :deep(li::before) {
  content: '▶ ';
  color: var(--color-accent);
  font-size: 0.7em;
}
</style>
