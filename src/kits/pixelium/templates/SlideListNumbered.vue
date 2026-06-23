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
  <div class="px-list-num flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2))" />

    <div class="relative z-10 max-w-3xl w-full px-8">
      <h3 v-if="slide.title" class="px-list-title text-center">{{ slide.title }}</h3>
      <div v-if="parsed.subtitle" class="px-list-sub mb-6" v-html="parsed.subtitle" />

      <div v-if="parsed.items.length" class="px-list-items">
        <div v-for="(item, i) in parsed.items" :key="i" class="px-list-item">
          <span class="px-list-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="px-list-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-list-title {
  font-size: calc(2.5rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
}

.px-list-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: var(--px-font);
}

.px-list-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.px-list-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  background: var(--color-card);
  border: 2px solid var(--color-border);
  box-shadow: 3px 3px 0 #0006;
}

.px-list-num {
  flex-shrink: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-accent);
  opacity: 0.4;
  min-width: 2.5rem;
  text-align: right;
  font-family: var(--px-font);
}

.px-list-text {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.6;
  font-family: var(--px-font);
  text-shadow: 1px 1px 0 #0004;
}
</style>
