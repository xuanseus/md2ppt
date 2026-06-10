<script setup lang="ts">
import type { Slide } from '../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-content flex flex-col items-center justify-center">
    <!-- 居中大标题 -->
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-3 tracking-tight">
      {{ slide.title || 'Two Column' }}
    </h2>
    <!-- 装饰线 -->
    <div class="w-16 h-1.5 bg-accent rounded-full mb-8" />

    <!-- 两列内容 -->
    <div class="w-full max-w-5xl">
      <div class="grid grid-cols-2 gap-12">
        <div class="prose-two-col" v-html="slide.leftHtml" />
        <div class="prose-two-col" v-html="slide.rightHtml" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose-two-col :deep(h3) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-accent);
  opacity: 0.6;
}

.prose-two-col :deep(h4) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.prose-two-col :deep(p) {
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.prose-two-col :deep(ul),
.prose-two-col :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.prose-two-col :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.prose-two-col :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}
</style>
