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
  <div class="px-timeline flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 顶部像素装饰横幅 -->
    <div class="absolute top-0 left-0 right-0 pointer-events-none" style="height: 10px; background: repeating-linear-gradient(90deg, var(--color-accent) 0px, var(--color-accent) 8px, transparent 8px, transparent 16px)" />

    <div class="relative z-10 w-full max-w-5xl px-8">
      <h3 v-if="slide.title" class="px-timeline-title text-center">{{ slide.title }}</h3>
      <div v-if="subtitle" class="px-timeline-sub mb-8" v-html="subtitle" />

      <div v-if="entries.length" class="px-timeline-track-wrap">
        <!-- 轨道线 -->
        <div class="px-timeline-track" />
        <div class="px-timeline-nodes">
          <div v-for="(e, i) in entries" :key="i" class="px-timeline-node">
            <!-- 像素方块节点 -->
            <div class="px-timeline-dot" />
            <div class="px-timeline-date">{{ e.date }}</div>
            <div class="px-timeline-content">{{ e.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-timeline-title {
  font-size: calc(2.5rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  color: var(--color-heading);
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
  margin-bottom: 0.5rem;
}

.px-timeline-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: var(--px-font);
}

.px-timeline-track-wrap {
  position: relative;
  width: 100%;
  padding: 3rem 0 1rem;
}

.px-timeline-track {
  position: absolute;
  top: 4.5rem;
  left: 5%;
  right: 5%;
  height: 4px;
  background: var(--color-accent);
  opacity: 0.3;
}

.px-timeline-nodes {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.px-timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 12rem;
}

.px-timeline-dot {
  width: 16px;
  height: 16px;
  background: var(--color-accent);
  box-shadow: 4px 0 0 color-mix(in srgb, var(--color-accent) 50%, transparent);
  margin-bottom: 0.5rem;
}

.px-timeline-date {
  font-size: var(--fs-caption);
  font-weight: 700;
  color: var(--color-accent);
  font-family: var(--px-font);
}

.px-timeline-content {
  font-size: var(--fs-small);
  color: var(--color-muted-foreground);
  line-height: 1.5;
  font-family: var(--px-font);
}
</style>
