<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { Card } from 'animal-island-vue'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-stats flex items-center justify-center w-full h-full" style="background: linear-gradient(180deg, var(--color-background) 0%, var(--color-muted) 100%)">
    <!-- 背景圆点装饰 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
      <div v-for="n in 12" :key="n" class="absolute rounded-full" :style="{
        width: (40 + (n % 5) * 20) + 'px',
        height: (40 + (n % 5) * 20) + 'px',
        left: ((n * 37 + 13) % 100) + '%',
        top: ((n * 53 + 7) % 100) + '%',
        background: n % 3 === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)',
      }" />
    </div>

    <div class="relative z-10 max-w-5xl px-12 slide-animate">
      <Card
        type="filled"
        color="white"
        :style="{
          borderRadius: 'var(--animal-border-radius-lg, 24px)',
          border: '2px solid var(--color-border)',
          boxShadow: '0 4px 20px rgba(61, 52, 40, 0.1)',
          padding: '3rem 4rem',
          textAlign: 'center',
        }"
      >
        <div v-html="slide.html" class="ai-stats-prose" />
      </Card>
    </div>
  </div>
</template>

<style scoped>
.ai-stats {
  padding: 2.5rem 3rem;
}

.ai-stats-prose :deep(h4) {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  margin-bottom: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-foreground);
  text-align: center;
}

.ai-stats-prose :deep(strong) {
  display: block;
  font-size: var(--fs-stat);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1.5rem;
  color: var(--color-accent);
  text-shadow: 0 2px 12px color-mix(in srgb, var(--color-accent) 20%, transparent);
  animation: ai-count-pulse 2s ease-out;
}

@keyframes ai-count-pulse {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.ai-stats-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  margin-top: 1.5rem;
  line-height: 1.7;
}
</style>
