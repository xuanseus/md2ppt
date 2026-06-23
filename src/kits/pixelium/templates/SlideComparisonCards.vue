<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()
interface Col { title: string; items: string[]; icon: string; isRed: boolean }
const cols = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  const c: Col[] = []
  for (let i = 0; i < Math.min(parts.length, 2); i++) {
    const p = parts[i].trim(); const tm = p.match(/^\*\*([^*]+)\*\*/m)
    const items = p.split('\n').slice(1).filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim())
    c.push({ title: tm ? tm[1] : '', items, icon: i === 0 ? '✕' : '✓', isRed: i === 0 })
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
  <div class="px-compare flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2))" />

    <div class="relative z-10 max-w-5xl w-full px-8">
      <h3 v-if="slide.title" class="px-cmp-title text-center">{{ slide.title }}</h3>
      <div v-if="subtitle" class="px-cmp-sub mb-6" v-html="subtitle" />

      <div v-if="cols.length === 2" class="px-cmp-grid">
        <div v-for="(col, ci) in cols" :key="ci" :class="['px-cmp-card', col.isRed ? 'px-cmp-red' : 'px-cmp-green']">
          <div class="px-cmp-icon">{{ col.icon }}</div>
          <strong class="px-cmp-card-title">{{ col.title }}</strong>
          <ul class="px-cmp-list">
            <li v-for="(item, ji) in col.items" :key="ji" v-html="(marked.parseInline(item) as string)" />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-cmp-title {
  font-size: calc(2.5rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
}

.px-cmp-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: var(--px-font);
}

.px-cmp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  margin-top: 1.5rem;
}

.px-cmp-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem;
  background: var(--color-card);
  border: 3px solid var(--color-border);
  box-shadow: 5px 5px 0 #0006;
  text-align: center;
}

.px-cmp-card.px-cmp-red {
  border-color: rgba(248, 113, 113, 0.5);
}

.px-cmp-card.px-cmp-green {
  border-color: rgba(52, 211, 153, 0.5);
}

.px-cmp-icon {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  font-family: var(--px-font);
}

.px-cmp-red .px-cmp-icon {
  color: #f87171;
}

.px-cmp-green .px-cmp-icon {
  color: #34d399;
}

.px-cmp-card-title {
  font-size: var(--fs-h3);
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--color-heading);
  font-family: var(--px-font);
}

.px-cmp-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.px-cmp-list li {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.6;
}
</style>
