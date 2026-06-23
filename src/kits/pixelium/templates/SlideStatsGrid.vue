<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const cols = computed(() => parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i) || [])[1] || '3'))

const cards = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('|||').map(s => s.trim()).filter(Boolean).map(s => ({ html: marked.parse(s) as string }))
})
</script>

<template>
  <div class="px-stats-grid flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 顶部像素装饰横幅 -->
    <div class="absolute top-0 left-0 right-0 pointer-events-none" style="height: 10px; background: repeating-linear-gradient(90deg, var(--color-accent) 0px, var(--color-accent) 8px, transparent 8px, transparent 16px)" />

    <!-- 底部像素装饰横幅 -->
    <div class="absolute bottom-0 left-0 right-0 pointer-events-none" style="height: 10px; background: repeating-linear-gradient(90deg, transparent 0px, transparent 8px, var(--color-accent) 8px, var(--color-accent) 16px)" />

    <div v-if="cards.length" class="relative z-10 grid gap-8 max-w-5xl w-full px-8" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="(card, i) in cards" :key="i" class="px-stat-card" v-html="card.html" />
    </div>
    <div v-if="!cards.length" v-html="slide.html" class="px-stats-fallback" />
  </div>
</template>

<style scoped>
@keyframes px-stat-card-pop {
  0% { transform: scale(0.3); opacity: 0; }
  40% { transform: scale(1.15); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
}

.px-stats-grid {
  overflow: hidden;
}

.px-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: var(--color-card);
  border: 3px solid var(--color-border);
  box-shadow: 5px 5px 0 #0006;
}

.px-stat-card :deep(strong) {
  display: block;
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 800;
  line-height: 1;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
  animation: px-stat-card-pop 0.5s ease-out;
}

.px-stat-card :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  margin: 0;
  font-family: var(--px-font);
}

.px-stats-fallback {
  position: relative;
  z-index: 10;
  max-width: 48rem;
  text-align: center;
}

.px-stats-fallback :deep(h4) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  margin-bottom: 2rem;
  font-family: var(--px-font);
}

.px-stats-fallback :deep(strong) {
  font-size: var(--fs-stat);
  color: var(--color-accent);
  font-family: var(--px-font);
}
</style>
