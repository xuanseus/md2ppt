<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-quote flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素星空背景 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <span
        v-for="s in 15"
        :key="'star'+s"
        class="absolute"
        :style="{
          left: ((s * 73 + 17) % 94) + '%',
          top: ((s * 41 + 11) % 90) + '%',
          width: (2 + (s % 3)) + 'px',
          height: (2 + (s % 3)) + 'px',
          background: s % 5 === 0 ? '#ffe066' : s % 3 === 0 ? '#a0d2db' : '#ffffff',
          opacity: 0.15 + (s % 5) * 0.08,
          animation: 'px-star-twinkle ' + (2 + (s % 3) * 0.8) + 's step-end infinite',
          animationDelay: (s * 0.17) + 's',
        }"
      />
    </div>

    <div class="relative z-10 max-w-3xl w-full px-12 text-center">
      <!-- 引号像素装饰 -->
      <div class="mb-6 flex justify-center">
        <span style="font-size: 8rem; line-height: 1; color: var(--color-accent); opacity: 0.08; font-family: serif; user-select: none;">"</span>
      </div>

      <div v-html="slide.html" class="px-quote-prose" />

      <div class="mt-4 flex justify-center">
        <span style="font-size: 8rem; line-height: 1; color: var(--color-accent); opacity: 0.08; font-family: serif; user-select: none; transform: rotate(180deg);">"</span>
      </div>

      <!-- 像素装饰底部 -->
      <div class="mt-6 flex items-center justify-center gap-2">
        <div style="width: 8px; height: 8px; background: var(--color-accent); opacity: 0.3;" />
        <div style="width: 48px; height: 4px; background: var(--color-accent); opacity: 0.25;" />
        <div style="width: 8px; height: 8px; background: var(--color-accent); opacity: 0.3;" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes px-star-twinkle {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.5; }
}

.px-quote-prose :deep(blockquote),
.px-quote-prose :deep(p) {
  font-size: var(--fs-quote, 2rem);
  font-weight: 300;
  line-height: 1.5;
  color: var(--color-muted-foreground);
  font-style: italic;
  margin: 1rem 0;
  font-family: var(--px-font);
}

.px-quote-prose :deep(h3),
.px-quote-prose :deep(h4) {
  display: none;
}
</style>
