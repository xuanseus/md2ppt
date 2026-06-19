<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-section flex items-center justify-center w-full h-full" style="background: linear-gradient(180deg, var(--color-muted) 0%, var(--color-background) 100%)">
    <!-- 装饰弧形 -->
    <div class="absolute top-0 left-0 w-full h-1/2 pointer-events-none" style="background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, transparent 70%)" />

    <!-- 角落叶子装饰 -->
    <div class="absolute top-12 right-12 text-6xl opacity-[0.06] pointer-events-none select-none">🌿</div>
    <div class="absolute bottom-12 left-12 text-5xl opacity-[0.05] pointer-events-none select-none">🌱</div>

    <div class="relative z-10 w-full max-w-6xl px-12 text-center">
      <!-- 小章节编号 -->
      <div class="inline-flex items-center gap-2 mb-8 opacity-50">
        <span class="chapter-badge">Chapter {{ String(slide.index + 1).padStart(2, '0') }}</span>
      </div>

      <!-- 原生 h2 — 不用 Title 组件，避免 scoped style 冲突 -->
      <h2 v-if="slide.title" class="ai-section-title">{{ slide.title }}</h2>

      <!-- 副标题 -->
      <div v-if="slide.html" v-html="slide.html" class="ai-section-sub" />
    </div>
  </div>
</template>

<style scoped>
.chapter-badge {
  font-size: var(--fs-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted-foreground);
  font-family: var(--animal-font-family, inherit);
}

.ai-section-title {
  font-size: calc(4.5rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.15;
  margin-bottom: 1.5rem;
  font-family: var(--animal-font-family, inherit);
}

.ai-section-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-family: var(--animal-font-family, inherit);
}
</style>
