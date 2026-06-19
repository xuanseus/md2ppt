<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-cover flex items-center justify-center w-full h-full" style="background: linear-gradient(160deg, var(--color-muted) 0%, var(--color-background) 100%)">
    <!-- 装饰圆环 -->
    <div class="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border-2 opacity-10 pointer-events-none" style="border-color: var(--color-accent)" />
    <div class="absolute bottom-1/4 left-1/5 w-48 h-48 rounded-full border-2 opacity-8 pointer-events-none" style="border-color: var(--color-accent)" />
    <div class="absolute top-1/3 left-1/3 w-32 h-32 rounded-full opacity-5 pointer-events-none" style="background: var(--color-accent)" />

    <!-- 顶部叶子装饰 -->
    <div class="absolute top-0 left-0 w-full h-1 opacity-20" style="background: linear-gradient(90deg, transparent, var(--color-accent), var(--color-h1-to), transparent)" />

    <div class="relative z-10 w-full max-w-6xl px-12 text-center">
      <!-- 装饰小标 -->
      <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8" style="background: color-mix(in srgb, var(--color-accent) 10%, transparent); border: 2px solid color-mix(in srgb, var(--color-accent) 20%, transparent)">
        <span class="text-lg">🌿</span>
        <span class="text-sm font-semibold tracking-wider uppercase" style="color: var(--color-accent); font-family: var(--animal-font-family, inherit)">Animal Island</span>
      </div>

      <!-- 原生 h1 — 不受 Title scoped style 影响 -->
      <h1 v-if="slide.title" class="ai-cover-title">{{ slide.title }}</h1>

      <!-- 其他内容 -->
      <div v-html="slide.html" class="ai-cover-prose" />

      <!-- 底部装饰线 -->
      <div class="mx-auto mt-10 flex items-center gap-3 justify-center">
        <span class="w-12 h-0.5 rounded-full opacity-30" style="background: var(--color-accent)" />
        <span class="w-2 h-2 rounded-full" style="background: var(--color-accent)" />
        <span class="w-12 h-0.5 rounded-full opacity-30" style="background: var(--color-accent)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-cover-title {
  font-size: calc(4.5rem * var(--content-scale));
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  font-family: var(--animal-font-family, inherit);
}

.ai-cover-prose :deep(h1),
.ai-cover-prose :deep(h2),
.ai-cover-prose :deep(h3),
.ai-cover-prose :deep(h4),
.ai-cover-prose :deep(h5),
.ai-cover-prose :deep(h6) {
  display: none;
}

.ai-cover-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  margin-top: 0.5rem;
  font-family: var(--animal-font-family, inherit);
}
</style>
