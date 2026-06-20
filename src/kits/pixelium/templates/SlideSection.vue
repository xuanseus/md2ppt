<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-section flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2))" />

    <!-- RPG 对话框 -->
    <div class="relative z-10 max-w-3xl">
      <div style="background: var(--color-card); border: 3px solid var(--color-border); box-shadow: 6px 6px 0 #0006; padding: 2.5rem 3rem; position: relative;">
        <!-- 对话框顶部装饰栏 -->
        <div class="flex items-center justify-between mb-6 pb-4" style="border-bottom: 2px dashed var(--color-border)">
          <span class="text-xs tracking-widest uppercase" style="color: var(--color-muted-foreground); font-family: var(--px-font)">
            ▶ Chapter {{ String(slide.index + 1).padStart(2, '0') }}
          </span>
          <div class="flex gap-1">
            <span style="width: 6px; height: 6px; background: var(--color-accent); display: inline-block"></span>
            <span style="width: 6px; height: 6px; background: var(--color-accent); opacity: 0.4; display: inline-block"></span>
          </div>
        </div>

        <!-- 章节标题 -->
        <h2 v-if="slide.title" class="px-section-title">{{ slide.title }}</h2>

        <!-- 副标题 -->
        <div v-if="slide.html" v-html="slide.html" class="px-section-sub" />

        <!-- 对话框尾部 "▶ Next" 提示 -->
        <div class="flex items-center justify-end mt-8 pt-4" style="border-top: 2px dashed var(--color-border)">
          <span class="px-next-indicator">▶ Next</span>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes px-next-blink {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.px-section-title {
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
  margin-bottom: 1rem;
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
}

.px-section-sub :deep(h1),
.px-section-sub :deep(h2),
.px-section-sub :deep(h3),
.px-section-sub :deep(h4) {
  display: none;
}

.px-section-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-family: var(--px-font);
}

.px-next-indicator {
  font-size: calc(0.85rem * var(--content-scale));
  font-family: var(--px-font);
  color: var(--color-accent);
  letter-spacing: 0.15em;
  animation: px-next-blink 1.5s step-end infinite;
}
</style>
