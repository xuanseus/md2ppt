<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { Card } from 'animal-island-vue'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-content flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 侧边装饰 -->
    <div class="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full opacity-15 pointer-events-none" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-5xl px-10 slide-animate">
      <Card
        type="filled"
        color="white"
        :style="{
          borderRadius: 'var(--animal-border-radius-lg, 24px)',
          border: '2px solid var(--color-border)',
          boxShadow: '0 3px 12px rgba(61, 52, 40, 0.06)',
          padding: '2.5rem 3rem',
        }"
      >
        <div v-html="slide.html" class="ai-content-prose" />
      </Card>
    </div>
  </div>
</template>

<style scoped>
.ai-content {
  padding: 2.5rem 3rem;
}

.ai-content-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.2;
  color: var(--color-heading);
}

.ai-content-prose :deep(h3) {
  font-size: var(--fs-h3);
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--color-heading);
}

.ai-content-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-foreground);
}

.ai-content-prose :deep(ul),
.ai-content-prose :deep(ol) {
  padding-left: 0;
  margin: 1rem 0;
  list-style: none;
}

.ai-content-prose :deep(li) {
  font-size: var(--fs-body-sm);
  margin-bottom: 0.6rem;
  line-height: 1.7;
  padding-left: 2rem;
  position: relative;
}

.ai-content-prose :deep(li)::before {
  content: '🌱';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.9em;
}

.ai-content-prose :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: normal;
  background: color-mix(in srgb, var(--color-accent) 6%, transparent);
  border-radius: 0 var(--animal-border-radius-base, 18px) var(--animal-border-radius-base, 18px) 0;
}

.ai-content-prose :deep(code) {
  padding: 0.2rem 0.5rem;
  border-radius: 0.35rem;
  font-size: 0.9em;
}

.ai-content-prose :deep(pre) {
  overflow-x: auto;
}

.ai-content-prose :deep(h1) {
  background: linear-gradient(315deg, var(--color-h1-from, var(--color-accent)) 25%, var(--color-h1-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ai-content-prose :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

ai-content-prose :deep(img) {
    max-width: 60%;
    max-height: 40vh;
    display: block;
    margin: 1rem auto;
    object-fit: contain;
  }
</style>
