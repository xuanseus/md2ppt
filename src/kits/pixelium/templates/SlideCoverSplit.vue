<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-cover-split flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素星空背景 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <span
        v-for="s in 25"
        :key="'star'+s"
        class="absolute"
        :style="{
          left: ((s * 73 + 17) % 94) + '%',
          top: ((s * 41 + 11) % 90) + '%',
          width: (2 + (s % 3)) + 'px',
          height: (2 + (s % 3)) + 'px',
          background: s % 5 === 0 ? '#ffe066' : s % 3 === 0 ? '#a0d2db' : '#ffffff',
          opacity: 0.2 + (s % 5) * 0.1,
          animation: 'px-star-twinkle ' + (2 + (s % 3) * 0.8) + 's step-end infinite',
          animationDelay: (s * 0.17) + 's',
        }"
      />
    </div>

    <!-- 8-bit 装饰边框 -->
    <div class="absolute pointer-events-none" style="inset: 32px; border: 4px solid var(--color-accent); box-shadow: inset 0 0 0 4px #0a0a2e, 0 0 0 4px var(--color-accent), 8px 8px 0 #0008" />

    <!-- 边框四角像素块 -->
    <div class="absolute top-8 left-8 pointer-events-none" style="width: 16px; height: 16px; background: var(--color-accent); box-shadow: 16px 0 0 var(--color-accent)" />
    <div class="absolute top-8 right-8 pointer-events-none" style="width: 16px; height: 16px; background: var(--color-accent); box-shadow: -16px 0 0 var(--color-accent)" />
    <div class="absolute bottom-8 left-8 pointer-events-none" style="width: 16px; height: 16px; background: var(--color-accent); box-shadow: 16px 0 0 var(--color-accent)" />
    <div class="absolute bottom-8 right-8 pointer-events-none" style="width: 16px; height: 16px; background: var(--color-accent); box-shadow: -16px 0 0 var(--color-accent)" />

    <!-- 顶部像素装饰横幅 -->
    <div class="absolute top-0 left-0 right-0 pointer-events-none" style="height: 12px; background: repeating-linear-gradient(90deg, var(--color-accent) 0px, var(--color-accent) 8px, transparent 8px, transparent 16px)" />

    <!-- 左右分栏 -->
    <div class="relative z-10 w-full max-w-6xl px-12" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
      <!-- 左侧文本 -->
      <div>
        <div class="inline-block px-6 py-2 mb-5" style="background: var(--color-card); border: 2px solid var(--color-border); box-shadow: 3px 3px 0 var(--color-accent)">
          <span class="text-sm font-bold tracking-widest uppercase" style="color: var(--color-accent); font-family: var(--px-font)">
            ▶ New Game
          </span>
        </div>

        <h1 v-if="slide.title" class="px-cover-title">{{ slide.title }}</h1>

        <div v-html="slide.html" class="px-cover-prose" />

        <div class="mt-6" style="width: 5rem; height: 4px; background: var(--color-accent); box-shadow: 8px 0 0 var(--color-accent), 4px 0 0 0 var(--color-accent)" />
      </div>

      <!-- 右侧装饰 -->
      <div class="flex items-center justify-center">
        <div class="flex flex-col items-center justify-center" style="width: 14rem; height: 14rem; background: var(--color-card); border: 3px solid var(--color-border); box-shadow: 6px 6px 0 #0006;">
          <span style="font-size: 4rem; opacity: 0.4;">✦</span>
          <span class="text-2xl font-bold" style="color: var(--color-accent); font-family: var(--px-font); opacity: 0.5;">2026</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes px-star-twinkle {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.7; }
}

.px-cover-title {
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.04em;
  color: var(--color-heading);
  margin-bottom: 1.25rem;
  font-family: var(--px-font);
  text-shadow:
    0 0 10px color-mix(in srgb, var(--color-accent) 30%, transparent),
    3px 3px 0 #0004;
}

.px-cover-prose :deep(h1),
.px-cover-prose :deep(h2),
.px-cover-prose :deep(h3),
.px-cover-prose :deep(h4),
.px-cover-prose :deep(h5),
.px-cover-prose :deep(h6) {
  display: none;
}

.px-cover-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  margin-top: 0.5rem;
  font-family: var(--px-font);
}
</style>
