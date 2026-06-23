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
  <div class="ai-stats-grid flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰 -->
    <div class="absolute top-1/4 right-1/5 w-48 h-48 rounded-full border-2 opacity-[0.05] pointer-events-none" style="border-color: var(--color-accent)" />
    <div class="absolute bottom-1/4 left-1/5 w-32 h-32 rounded-full opacity-[0.03] pointer-events-none" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-5xl px-10">
      <div v-if="cards.length" class="sg-content" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
        <div v-for="(card, i) in cards" :key="i" class="sg-card slide-animate" :style="{ animationDelay: `${0.1 + i * 0.1}s` }" v-html="card.html" />
      </div>
      <div v-else v-html="slide.html" class="sg-fallback slide-animate" />
    </div>
  </div>
</template>

<style scoped>
.ai-stats-grid { position: relative; overflow: hidden; padding: 2rem 3rem; }
.sg-content { display: grid; gap: 1.75rem; }
.sg-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 2rem 1.5rem; background: color-mix(in srgb, var(--color-muted) 12%, transparent); border: 2px solid var(--color-border); border-radius: var(--animal-border-radius-lg, 24px); box-shadow: 0 3px 12px rgba(61, 52, 40, 0.05); }
.sg-card :deep(strong) { display: block; font-size: calc(3.5rem * var(--content-scale)); font-weight: 800; line-height: 1; color: var(--color-accent); margin-bottom: 0.75rem; font-family: var(--animal-font-family, inherit); }
.sg-card :deep(p) { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); margin: 0; }
.sg-fallback { text-align: center; max-width: 36rem; margin: 0 auto; }
.sg-fallback :deep(h4) { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); margin-bottom: 2rem; }
.sg-fallback :deep(strong) { font-size: var(--fs-stat); color: var(--color-accent); }
@keyframes card-in { 0% { opacity: 0; transform: translateY(20px) } 100% { opacity: 1; transform: translateY(0) } }
</style>
