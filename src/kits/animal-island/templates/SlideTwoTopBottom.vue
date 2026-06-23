<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Column { title: string; html: string }
const parsed = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const columns: Column[] = []
  const beforeText: string[] = []
  let hit = false
  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  for (const part of parts) {
    const t = part.trim(); if (!t) continue
    const tm = t.match(/^\*\*([^*]+)\*\*/m)
    if (tm) {
      hit = true
      const lines: string[] = []
      for (const l of t.split('\n')) { const ln = l.trim(); if (ln && !ln.match(/^\*\*[^*]+\*\*$/)) lines.push(ln) }
      columns.push({ title: tm[1], html: marked.parse(lines.join('\n')) as string })
    } else { for (const l of t.split('\n')) { const ln = l.trim(); if (ln && !hit) beforeText.push(ln) } }
  }
  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2) }
})
</script>

<template>
  <div class="ai-two-top-bottom flex items-center justify-center w-full h-full" style="background: linear-gradient(160deg, var(--color-muted) 0%, var(--color-background) 100%)">
    <!-- 装饰 -->
    <div class="absolute top-1/4 right-1/5 w-40 h-40 rounded-full border-2 opacity-[0.05] pointer-events-none" style="border-color: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-4xl px-10">
      <h2 v-if="slide.title" class="t2-title slide-animate" style="animation-delay: 0.1s">{{ slide.title || 'Two Column' }}</h2>
      <div v-if="parsed.subtitle" class="t2-sub slide-animate" style="animation-delay: 0.15s" v-html="parsed.subtitle" />
      <div class="t2-stack">
        <div v-for="(col, i) in parsed.columns" :key="i" class="t2-col slide-animate" :style="{ animationDelay: `${0.2 + i * 0.2}s` }">
          <div class="t2-col-accent" :class="i === 0 ? 'col-accent-a' : 'col-accent-b'" />
          <h4 class="t2-col-title">{{ col.title }}</h4>
          <div v-html="col.html" class="t2-col-body" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-two-top-bottom { position: relative; overflow: hidden; padding: 2rem 3rem; }
.t2-title { font-size: calc(2.5rem * var(--content-scale)); font-weight: 700; text-align: center; margin-bottom: 0.5rem; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.t2-sub :deep(p) { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); text-align: center; margin-bottom: 1.5rem; }
.t2-stack { display: flex; flex-direction: column; gap: 1.25rem; }
.t2-col { position: relative; overflow: hidden; padding: 1.75rem 2rem; border-radius: var(--animal-border-radius-lg, 24px); background: color-mix(in srgb, var(--color-muted) 15%, transparent); border: 2px solid var(--color-border); box-shadow: 0 2px 8px rgba(61, 52, 40, 0.04); }
.t2-col-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 3px 3px 0 0; }
.col-accent-a { background: var(--color-accent); opacity: 0.5; }
.col-accent-b { background: var(--color-accent); opacity: 0.3; }
.t2-col-title { font-size: var(--fs-h4); font-weight: 700; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 2px solid color-mix(in srgb, var(--color-accent) 20%, transparent); color: var(--color-heading); }
.t2-col-body :deep(p) { font-size: var(--fs-body-sm); line-height: 1.7; margin-bottom: 0.5rem; color: var(--color-muted-foreground); }
.t2-col-body :deep(ul), .t2-col-body :deep(ol) { padding-left: 1.25rem; margin-bottom: 0.5rem; }
.t2-col-body :deep(li) { margin-bottom: 0.4rem; line-height: 1.6; font-size: var(--fs-body-sm); color: var(--color-muted-foreground); }
.t2-col-body :deep(li::marker) { color: var(--color-accent); }
</style>
