<script setup lang="ts">
import type { Slide } from '../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-code-wrapper relative overflow-hidden">
    <!-- 装饰光晕 -->
    <div class="orb w-[300px] h-[300px] bg-accent/6 top-10 left-10" style="animation-delay: -5s" />

    <!-- 代码内容 -->
    <div class="relative z-10 slide-code-container h-full flex flex-col items-center justify-center px-16 py-16 slide-animate">
      <div v-if="slide.title" class="code-title mb-6">
        <h4 class="text-2xl font-bold">{{ slide.title }}</h4>
      </div>

      <div v-html="slide.html" class="w-full max-w-4xl prose-code" />
    </div>
  </div>
</template>

<style scoped>
.slide-code-wrapper {
  width: 100%;
  height: 100%;
}

.slide-code-container > div {
  padding-left: 0;
  padding-right: 0;
}

.code-title {
  text-align: center;
  color: var(--color-accent);
}

.code-title h4 {
  margin: 0;
}

/* 隐藏 slide.html 中的重复标题 */
.prose-code :deep(h4) {
  display: none;
}

.prose-code :deep(.code-block-wrapper) {
  margin: 0 auto;
  max-width: 100%;
}

.prose-code :deep(p) {
  font-size: 1.125rem;
  color: var(--color-muted-foreground);
  text-align: center;
  line-height: 1.6;
  margin-top: 1.5rem;
}
</style>
