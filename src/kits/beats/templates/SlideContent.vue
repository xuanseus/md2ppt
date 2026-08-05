<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-content-wrapper relative flex flex-col items-center justify-center overflow-hidden">
    <!-- 内容区 -->
    <div class="relative z-10 w-full flex flex-col items-center slide-animate">
      <div v-html="slide.html" class="w-full mx-auto px-6 prose-content" style="max-width: min(calc(var(--content-max) * var(--content-scale)), 100%)" />
    </div>
  </div>
</template>

<style scoped>
.slide-content-wrapper {
  width: 100%;
  height: 100%;
  padding: 2.5rem 2rem;  /* 横向 padding 缩小，内容占比更大 */
}

.prose-content :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 0;
  text-align: center;
  line-height: 1.2;
}

.prose-content :deep(h3) {
  font-size: var(--fs-h3);
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.prose-content :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
}

.prose-content :deep(ul),
.prose-content :deep(ol) {
  padding-left: 0;
  margin: 1rem auto;
  list-style: none;
  width: fit-content;
}

.prose-content :deep(li) {
  font-size: var(--fs-body-sm);
  margin-bottom: 0.6rem;
  line-height: 1.7;
  padding-left: 1.75rem;
  position: relative;
}

.prose-content :deep(li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  opacity: 0.7;
}

.prose-content :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--color-muted-foreground);
}

.prose-content :deep(code) {
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}

.prose-content :deep(pre) {
  border-radius: 0.5rem;
  overflow-x: auto;
}
</style>
