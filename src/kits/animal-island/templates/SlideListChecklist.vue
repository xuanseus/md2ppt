<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const items = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim()).filter(Boolean)
})
</script>

<template>
  <div class="ai-list-checklist flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰 -->
    <div class="absolute top-1/3 right-1/5 w-36 h-36 rounded-full border-2 opacity-[0.04] pointer-events-none" style="border-color: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-3xl px-10">
      <h3 v-if="slide.title" class="lc-title slide-animate">{{ slide.title }}</h3>
      <div v-if="items.length" class="lc-list">
        <div v-for="(item, i) in items" :key="i" class="lc-item slide-animate" :style="{ animationDelay: `${0.08 + i * 0.06}s` }">
          <span class="lc-check">&#10003;</span>
          <span class="lc-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-list-checklist { position: relative; overflow: hidden; padding: 2rem 3rem; }
.lc-title { font-size: var(--fs-h3); font-weight: 600; text-align: center; margin-bottom: 1.5rem; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.lc-list { display: flex; flex-direction: column; gap: 0.75rem; }
.lc-item { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1.25rem; background: color-mix(in srgb, var(--color-muted) 12%, transparent); border: 2px solid var(--color-border); border-radius: var(--animal-border-radius-base, 18px); box-shadow: 0 1px 4px rgba(61, 52, 40, 0.03); }
.lc-check { flex-shrink: 0; width: 1.5rem; height: 1.5rem; border-radius: 9999px; background: color-mix(in srgb, var(--color-accent) 15%, transparent); color: var(--color-accent); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; }
.lc-text { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); line-height: 1.5; }
</style>
