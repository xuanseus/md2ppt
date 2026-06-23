<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Col { title: string; items: string[]; icon: string; colorClass: string }
const cols = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  const c: Col[] = []
  for (let i = 0; i < Math.min(parts.length, 2); i++) {
    const p = parts[i].trim(); const tm = p.match(/^\*\*([^*]+)\*\*/m)
    const items = p.split('\n').slice(1).filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim())
    c.push({ title: tm ? tm[1] : '', items, icon: i === 0 ? '✕' : '✓', colorClass: i === 0 ? 'is-red' : 'is-green' })
  }
  return c
})

const subtitle = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const fi = body.indexOf('**'); if (fi > 0) { const b = body.slice(0, fi).trim(); if (b) return marked.parse(b) as string }
  return ''
})
</script>

<template>
  <div class="ai-comparison flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰 -->
    <div class="absolute top-1/4 right-1/5 w-40 h-40 rounded-full border-2 opacity-[0.04] pointer-events-none" style="border-color: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-4xl px-10">
      <h3 v-if="slide.title" class="cmp-title slide-animate">{{ slide.title }}</h3>
      <div v-if="subtitle" class="cmp-sub slide-animate" style="animation-delay: 0.1s" v-html="subtitle" />
      <div v-if="cols.length === 2" class="cmp-grid">
        <div v-for="(col, ci) in cols" :key="ci" :class="['cmp-card', col.colorClass, 'slide-animate']" :style="{ animationDelay: `${0.15 + ci * 0.15}s` }">
          <div class="cmp-card-icon">{{ col.icon }}</div>
          <strong class="cmp-card-title">{{ col.title }}</strong>
          <ul class="cmp-card-list">
            <li v-for="(item, ji) in col.items" :key="ji" v-html="(marked.parseInline(item) as string)" />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-comparison { position: relative; overflow: hidden; padding: 2rem 3rem; }
.cmp-title { font-size: var(--fs-h3); font-weight: 600; text-align: center; margin-bottom: 0.25rem; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.cmp-sub :deep(p) { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); text-align: center; margin-bottom: 1.5rem; }
.cmp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; width: 100%; margin-top: 1rem; }
.cmp-card { display: flex; flex-direction: column; align-items: center; padding: 2.25rem 2rem; border-radius: var(--animal-border-radius-lg, 24px); background: color-mix(in srgb, var(--color-muted) 12%, transparent); border: 2px solid var(--color-border); box-shadow: 0 3px 12px rgba(61, 52, 40, 0.04); text-align: center; }
.cmp-card.is-red { border-color: color-mix(in srgb, #f87171 25%, transparent); background: color-mix(in srgb, #f87171 5%, color-mix(in srgb, var(--color-muted) 12%, transparent)); }
.cmp-card.is-green { border-color: color-mix(in srgb, var(--color-accent) 25%, transparent); background: color-mix(in srgb, var(--color-accent) 5%, color-mix(in srgb, var(--color-muted) 12%, transparent)); }
.cmp-card-icon { font-size: 2.25rem; font-weight: 900; margin-bottom: 1rem; }
.is-red .cmp-card-icon { color: #f87171; }
.is-green .cmp-card-icon { color: var(--color-accent); }
.cmp-card-title { font-size: var(--fs-h3); font-weight: 700; margin-bottom: 1.25rem; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.cmp-card-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
.cmp-card-list li { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); line-height: 1.6; }
</style>
