<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const parsed = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const items: string[] = []; const before: string[] = []
  let hit = false
  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+(.+)$/)
    if (m) { hit = true; items.push(m[1]) }
    else { const t = line.trim(); if (t && !hit) before.push(t) }
  }
  return { subtitle: before.length ? marked.parse(before.join('\n')) as string : '', items }
})
</script>

<template>
  <div class="ai-list-numbered flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰 -->
    <div class="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full opacity-10 pointer-events-none" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-3xl px-10">
      <h3 v-if="slide.title" class="ln-title slide-animate">{{ slide.title }}</h3>
      <div v-if="parsed.subtitle" class="ln-sub slide-animate" style="animation-delay: 0.1s" v-html="parsed.subtitle" />
      <div v-if="parsed.items.length" class="ln-list">
        <div v-for="(item, i) in parsed.items" :key="i" class="ln-item slide-animate" :style="{ animationDelay: `${0.1 + i * 0.08}s` }">
          <span class="ln-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="ln-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-list-numbered { position: relative; overflow: hidden; padding: 2rem 3rem; }
.ln-title { font-size: var(--fs-h3); font-weight: 600; text-align: center; margin-bottom: 1rem; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.ln-sub :deep(p) { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); text-align: center; margin-bottom: 1.5rem; }
.ln-list { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
.ln-item { display: flex; align-items: center; gap: 1.25rem; padding: 0.9rem 1.25rem; background: color-mix(in srgb, var(--color-muted) 12%, transparent); border: 2px solid var(--color-border); border-radius: var(--animal-border-radius-base, 18px); box-shadow: 0 1px 4px rgba(61, 52, 40, 0.03); }
.ln-num { flex-shrink: 0; font-size: 1.5rem; font-weight: 800; color: var(--color-accent); opacity: 0.35; min-width: 2.5rem; text-align: right; font-family: var(--animal-font-family, inherit); }
.ln-text { font-size: var(--fs-body-sm); color: var(--color-foreground); line-height: 1.6; }
</style>
