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
  <div class="ai-timeline flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰 -->
    <div class="absolute top-1/4 right-1/5 w-40 h-40 rounded-full border-2 opacity-[0.04] pointer-events-none" style="border-color: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-5xl px-10">
      <h3 v-if="slide.title" class="tl-title slide-animate">{{ slide.title }}</h3>
      <div v-if="subtitle" class="tl-sub slide-animate" style="animation-delay: 0.1s" v-html="subtitle" />
      <div v-if="entries.length" class="tl-wrap">
        <div class="tl-track" />
        <div class="tl-nodes">
          <div v-for="(e, i) in entries" :key="i" class="tl-node slide-animate" :style="{ animationDelay: `${0.15 + i * 0.12}s` }">
            <div class="tl-dot" />
            <div class="tl-date">{{ e.date }}</div>
            <div class="tl-content">{{ e.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-timeline { position: relative; overflow: hidden; padding: 3rem; }
.tl-title { font-size: var(--fs-h3); font-weight: 600; text-align: center; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.tl-sub :deep(p) { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); text-align: center; margin-bottom: 1rem; }
.tl-wrap { position: relative; width: 100%; padding: 3rem 0 1rem; }
.tl-track { position: absolute; top: 4rem; left: 5%; right: 5%; height: 2px; background: var(--color-accent); opacity: 0.25; border-radius: 1px; }
.tl-nodes { display: flex; justify-content: space-between; position: relative; z-index: 1; }
.tl-node { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; flex: 1; max-width: 10rem; }
.tl-dot { width: 0.875rem; height: 0.875rem; border-radius: 9999px; background: var(--color-accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 15%, transparent); margin-bottom: 0.5rem; }
.tl-date { font-size: var(--fs-caption); font-weight: 700; color: var(--color-accent); font-family: var(--animal-font-family, inherit); }
.tl-content { font-size: var(--fs-small); color: var(--color-muted-foreground); line-height: 1.5; }
</style>
