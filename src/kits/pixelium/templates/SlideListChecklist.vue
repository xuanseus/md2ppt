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
  <div class="px-list-check flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2))" />

    <div class="relative z-10 max-w-3xl w-full px-8">
      <h3 v-if="slide.title" class="px-cl-title text-center">{{ slide.title }}</h3>
      <div v-if="items.length" class="px-cl-list">
        <div v-for="(item, i) in items" :key="i" class="px-cl-item">
          <span class="px-cl-check">&#10003;</span>
          <span class="px-cl-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-cl-title {
  font-size: calc(2.5rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
}

.px-cl-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.px-cl-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  background: var(--color-card);
  border: 2px solid var(--color-border);
  box-shadow: 3px 3px 0 #0006;
}

.px-cl-check {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--color-accent);
  color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 2px 2px 0 #0006;
}

.px-cl-text {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.5;
}
</style>
