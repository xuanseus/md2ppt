<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()
interface TLI { date: string; content: string }
const entries = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const r: TLI[] = []
  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/)
    if (m) r.push({ date: m[1], content: m[2] })
  }
  return r
})
const subtitle = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const before: string[] = []
  for (const line of body.split('\n')) { const t = line.trim(); if (t && !t.startsWith('-')) before.push(t); else break }
  return before.length ? marked.parse(before.join('\n')) as string : ''
})
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden flex items-center justify-center"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 -->
    <div class="absolute left-[6%] top-[8%] w-48 h-48 rounded-full pointer-events-none opacity-[0.02]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[8%] bottom-[10%] w-40 h-40 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <div class="wrap relative z-10" style="display: flex; flex-direction: column; align-items: center; max-width: 64rem; width: 100%; padding: 2rem;">

      <h3 v-if="slide.title" class="tl-title">{{ slide.title }}</h3>
      <div v-if="subtitle" class="tl-sub" v-html="subtitle" />

      <div v-if="entries.length" class="tl-container">
        <!-- 水墨横线 -->
        <div class="tl-track" />

        <div class="tl-nodes">
          <div v-for="(e, i) in entries" :key="i" class="tl-node">
            <!-- 墨点 -->
            <div class="tl-dot" />
            <div class="tl-date">{{ e.date }}</div>
            <div class="tl-content">{{ e.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 左侧印章 -->
    <div class="sm-seal absolute left-6 bottom-6 w-11 h-11 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.45rem; letter-spacing: 0.1em; transform: rotate(-5deg); opacity: 0.35; padding: 2px;">
      纪年
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.tl-title {
  font-size: var(--fs-h3);
  font-weight: 600;
  text-align: center;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.06em;
}

.tl-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  margin-bottom: 1.5rem;
}

.tl-container {
  position: relative;
  width: 100%;
  padding: 3rem 0 1rem;
}

.tl-track {
  position: absolute;
  top: 4rem;
  left: 5%;
  right: 5%;
  height: 1px;
  opacity: 0.18;
  background: linear-gradient(90deg, transparent 0%, var(--color-ink-light) 20%, var(--color-ink-light) 80%, transparent 100%);
}

.tl-nodes {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.tl-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 10rem;
}

.tl-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: var(--color-seal);
  opacity: 0.6;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-seal) 12%, transparent);
  margin-bottom: 0.5rem;
}

.tl-date {
  font-size: var(--fs-caption);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
  letter-spacing: 0.04em;
}

.tl-content {
  font-size: var(--fs-small);
  color: var(--color-muted-foreground);
  line-height: 1.5;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}
</style>
