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
  <div class="root w-full h-full relative overflow-hidden flex items-center justify-center"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 -->
    <div class="absolute left-[8%] top-[10%] w-52 h-52 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[6%] bottom-[12%] w-44 h-44 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 内容网格 -->
    <div v-if="cards.length" class="stats-grid relative z-10" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="(card, i) in cards" :key="i" class="stat-card" v-html="card.html" />
    </div>
    <div v-else-if="slide.html" v-html="slide.html" class="stats-fallback relative z-10" />

    <!-- 左上印章 -->
    <div class="sm-seal absolute left-8 top-8 w-12 h-12 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.5rem; letter-spacing: 0.1em; transform: rotate(-5deg); opacity: 0.4; padding: 2px;">
      数据
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.stats-grid {
  display: grid;
  gap: 2rem;
  max-width: 64rem;
  width: 100%;
  padding: 3rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 2rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow:
    inset 0 0 0 1px var(--color-paper-texture),
    0 2px 12px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s ease;
}

.stat-card:hover {
  box-shadow:
    inset 0 0 0 1px var(--color-paper-texture),
    0 4px 20px rgba(0, 0, 0, 0.06);
}

.stat-card :deep(strong) {
  display: block;
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 900;
  line-height: 1;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  margin-bottom: 0.75rem;
  letter-spacing: 0.04em;
}

.stat-card :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  margin: 0;
  line-height: 1.6;
}

.stats-fallback {
  max-width: 48rem;
  text-align: center;
  padding: 2rem;
}

.stats-fallback :deep(h4) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  margin-bottom: 2rem;
  font-family: 'Noto Serif SC', 'STKaiti', Georgia, serif;
}

.stats-fallback :deep(strong) {
  font-size: var(--fs-stat);
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'STSong', 'SimSun', Georgia, serif;
}
</style>
