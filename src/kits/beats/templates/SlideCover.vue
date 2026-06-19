<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import SplitText from '../../../components/text-effects/SplitText.vue'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-cover relative flex items-center justify-center overflow-hidden w-full h-full">
    <!-- 内容区 -->
    <div class="relative z-10 max-w-5xl px-12 text-center">
      <!-- 标题上方装饰小标 -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium tracking-widest uppercase mb-8 slide-animate">
        <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Presentation
      </div>

      <!-- 标题用 SplitText 动画 -->
      <div v-if="slide.title" class="cover-title">
        <SplitText
          :text="slide.title"
          tag="h1"
          split-type="words"
          :delay="80"
          :duration="1"
        />
      </div>

      <!-- 其他内容保持 v-html -->
      <div v-html="slide.html" class="prose-cover" />

      <!-- 底部渐变装饰线 -->
      <div class="accent-line w-32 mx-auto mt-12 slide-animate" />
    </div>
  </div>
</template>

<style scoped>
.cover-title :deep(h1) {
  font-size: var(--fs-hero);
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-foreground);
}

.prose-cover :deep(h1),
.prose-cover :deep(h2),
.prose-cover :deep(h3),
.prose-cover :deep(h4),
.prose-cover :deep(h5),
.prose-cover :deep(h6) {
  display: none;
}

.prose-cover :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.6;
  margin-top: 0;
}
</style>
