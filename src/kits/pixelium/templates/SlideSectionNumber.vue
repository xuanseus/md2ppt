<script setup lang="ts">
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const num = (props.slide.rawMd.match(/\{num:\s*(\d+)\}/i) || [])[1] || '01'
</script>

<template>
  <div class="px-section-num flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2))" />

    <!-- 顶部像素装饰横幅 -->
    <div class="absolute top-0 left-0 right-0 pointer-events-none" style="height: 10px; background: repeating-linear-gradient(90deg, var(--color-accent) 0px, var(--color-accent) 8px, transparent 8px, transparent 16px)" />

    <!-- RPG 对话框 -->
    <div class="relative z-10 max-w-3xl">
      <div style="background: var(--color-card); border: 3px solid var(--color-border); box-shadow: 6px 6px 0 #0006; padding: 2.5rem 3rem; position: relative;">
        <!-- 编号 -->
        <span class="block text-center mb-2" style="font-size: 8rem; font-weight: 900; line-height: 0.9; color: var(--color-accent); opacity: 0.15; font-family: var(--px-font);">{{ num }}</span>

        <!-- 章节标题 -->
        <h2 v-if="slide.title" class="px-section-num-title">{{ slide.title }}</h2>

        <!-- 副标题 -->
        <div v-if="slide.html" v-html="slide.html" class="px-section-num-sub" />

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

.px-section-num-title {
  font-size: calc(3rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
  margin-top: -1rem;
  margin-bottom: 1rem;
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
  text-align: center;
}

.px-section-num-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-family: var(--px-font);
  text-align: center;
}

.px-next-indicator {
  font-size: calc(0.85rem * var(--content-scale));
  font-family: var(--px-font);
  color: var(--color-accent);
  letter-spacing: 0.15em;
  animation: px-next-blink 1.5s step-end infinite;
}
</style>
