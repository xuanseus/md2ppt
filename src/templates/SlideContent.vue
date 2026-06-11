<script setup lang="ts">
import type { Slide } from '../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-content-wrapper relative flex flex-col items-center justify-center overflow-hidden">
    <!-- 内容区 -->
    <div class="relative z-10 w-full flex flex-col items-center slide-animate">
      <div v-html="slide.html" class="w-full max-w-4xl mx-auto px-8 prose-content" />
    </div>
  </div>
</template>

<style scoped>
.slide-content-wrapper {
  width: 100%;
  height: 100%;
  padding: 3rem 4rem;
}

.prose-content :deep(h2) {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0;
  text-align: center;
  line-height: 1.2;
}

.prose-content :deep(h3) {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.prose-content :deep(p) {
  font-size: 1.25rem;
  line-height: 1.8;
}

.prose-content :deep(ul),
.prose-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose-content :deep(li) {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  position: relative;
}

.prose-content :deep(li)::marker {
  color: var(--color-accent);
}

.prose-content :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--color-muted-foreground);
}

.prose-content :deep(code) {
  background: var(--color-muted);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}

.prose-content :deep(pre) {
  background: var(--color-muted);
  border-radius: 0.5rem;
  overflow-x: auto;
}
</style>
