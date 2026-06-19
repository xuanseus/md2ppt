<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { Card } from 'animal-island-vue'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-quote flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰大引号 -->
    <div class="absolute top-20 left-20 text-[10rem] leading-none pointer-events-none select-none opacity-[0.06]" style="font-family: Georgia, serif; color: var(--color-accent)">"</div>
    <div class="absolute bottom-20 right-20 text-[10rem] leading-none pointer-events-none select-none opacity-[0.06] rotate-180" style="font-family: Georgia, serif; color: var(--color-accent)">"</div>

    <div class="relative z-10 max-w-4xl px-12 slide-animate">
      <Card
        type="filled"
        color="white"
        :style="{
          borderRadius: 'var(--animal-border-radius-lg, 24px)',
          border: '2px solid var(--color-border)',
          boxShadow: '0 4px 20px rgba(61, 52, 40, 0.08)',
          padding: '3rem 4rem',
          textAlign: 'center',
          position: 'relative',
        }"
      >
        <!-- 顶部装饰 -->
        <div class="flex items-center justify-center gap-2 mb-8">
          <span class="text-2xl opacity-50">🌿</span>
          <div class="w-16 h-0.5 rounded-full" style="background: var(--color-accent)" />
          <span class="text-2xl opacity-50">🌿</span>
        </div>

        <div v-html="slide.html" class="ai-quote-prose" />

        <!-- 底部装饰 -->
        <div class="flex items-center justify-center gap-2 mt-8">
          <span class="text-2xl opacity-50">🌱</span>
          <div class="w-16 h-0.5 rounded-full" style="background: var(--color-accent)" />
          <span class="text-2xl opacity-50">🌱</span>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.ai-quote {
  padding: 2.5rem 3rem;
}

.ai-quote-prose :deep(h3) {
  font-size: var(--fs-caption);
  font-weight: 500;
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-foreground);
}

.ai-quote-prose :deep(blockquote),
.ai-quote-prose :deep(p) {
  font-size: var(--fs-quote);
  font-weight: 300;
  line-height: 1.7;
  text-align: center;
  font-style: italic;
  border: none;
  margin: 0;
  color: var(--color-foreground);
  font-family: var(--animal-font-family, Georgia, serif);
}
</style>
