<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-cover-minimal flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2))" />

    <!-- 顶部像素装饰横幅 -->
    <div class="absolute top-0 left-0 right-0 pointer-events-none" style="height: 10px; background: repeating-linear-gradient(90deg, var(--color-accent) 0px, var(--color-accent) 8px, transparent 8px, transparent 16px)" />

    <!-- 底部像素装饰横幅 -->
    <div class="absolute bottom-0 left-0 right-0 pointer-events-none" style="height: 10px; background: repeating-linear-gradient(90deg, transparent 0px, transparent 8px, var(--color-accent) 8px, var(--color-accent) 16px)" />

    <div class="relative z-10 max-w-3xl w-full px-12 text-center">
      <div class="inline-block px-6 py-2 mb-8" style="background: var(--color-card); border: 2px solid var(--color-border); box-shadow: 3px 3px 0 var(--color-accent)">
        <span class="text-sm font-bold tracking-widest uppercase" style="color: var(--color-accent); font-family: var(--px-font)">
          ▶ Thank You
        </span>
      </div>

      <h1 v-if="slide.title" class="px-minimal-title">{{ slide.title }}</h1>

      <div v-html="slide.html" class="px-minimal-prose" />

      <!-- 像素装饰 -->
      <div class="mt-10 flex items-center justify-center gap-2">
        <div style="width: 8px; height: 8px; background: var(--color-accent); opacity: 0.4;" />
        <div style="width: 64px; height: 4px; background: var(--color-accent); opacity: 0.3;" />
        <div style="width: 8px; height: 8px; background: var(--color-accent); opacity: 0.4;" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-minimal-title {
  font-size: calc(4rem * var(--content-scale));
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.04em;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  font-family: var(--px-font);
  text-shadow:
    0 0 10px color-mix(in srgb, var(--color-accent) 30%, transparent),
    3px 3px 0 #0004;
}

.px-minimal-prose :deep(h1),
.px-minimal-prose :deep(h2),
.px-minimal-prose :deep(h3),
.px-minimal-prose :deep(h4),
.px-minimal-prose :deep(h5),
.px-minimal-prose :deep(h6) {
  display: none;
}

.px-minimal-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  margin-top: 1rem;
  font-family: var(--px-font);
}
</style>
