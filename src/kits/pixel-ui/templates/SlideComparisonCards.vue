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
    const p = parts[i].trim()
    const tm = p.match(/^\*\*([^*]+)\*\*/m)
    const items = p.split('\n').slice(1).filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim())
    c.push({ title: tm ? tm[1] : '', items, icon: i === 0 ? '✕' : '✓', colorClass: i === 0 ? 'is-bad' : 'is-good' })
  }
  return c
})

const subtitle = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const fi = body.indexOf('**')
  if (fi > 0) { const b = body.slice(0, fi).trim(); if (b) return marked.parse(b) as string }
  return ''
})
</script>

<template>
  <!-- Pixel Retro comparison — NES-style side-by-side columns with pixel borders -->
  <div class="px-comparison flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Corner decorations -->
    <div class="absolute top-6 left-6 pointer-events-none pixel-corner corner-tl">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>
    <div class="absolute top-6 right-6 pointer-events-none pixel-corner corner-tr">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>

    <div class="relative z-10 w-full max-w-3xl px-8">
      <h3 v-if="slide.title" class="px-title">{{ slide.title }}</h3>
      <div v-if="subtitle" class="px-sub mb-6" v-html="subtitle" />

      <div v-if="cols.length === 2" class="px-grid">
        <div v-for="(col, ci) in cols" :key="ci"
          :class="['px-col', col.colorClass]"
          :style="{
            background: 'var(--color-card)',
            imageRendering: 'pixelated',
          }">
          <!-- Column header -->
          <div class="col-header">
            <span class="col-icon">{{ col.icon }}</span>
            <span class="col-title">{{ col.title }}</span>
          </div>

          <!-- Items list -->
          <ul class="col-list">
            <li v-for="(item, ji) in col.items" :key="ji" v-html="(marked.parseInline(item) as string)" />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-comparison {
  padding: 2.5rem 3rem;
  overflow: hidden;
}

.pixel-scanline {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    var(--pixel-scanline) 2px,
    var(--pixel-scanline) 4px
  );
}

/* Corner decorations */
.pixel-corner {
  font-family: monospace;
  font-size: 1.2rem;
  line-height: 1;
  opacity: 0.5;
}
.pixel-corner .corner-char.c1 { color: var(--color-accent); }
.pixel-corner .corner-char.c2 { color: var(--pixel-shadow); }

/* Title */
.px-title {
  font-size: var(--fs-h3);
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Subtitle */
.px-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

/* Grid */
.px-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  margin-top: 1.5rem;
}

/* Columns */
.px-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border: 4px solid var(--color-border);
  box-shadow: 4px 4px 0 var(--pixel-shadow);
  text-align: center;
}
.px-col.is-bad {
  border-color: color-mix(in srgb, #f87171 40%, var(--color-border));
}
.px-col.is-good {
  border-color: color-mix(in srgb, #34d399 40%, var(--color-border));
}

/* Header */
.col-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid var(--color-accent);
}
.col-icon {
  font-size: 1.5rem;
  font-weight: 900;
  font-family: monospace;
}
.is-bad .col-icon {
  color: #f87171;
}
.is-good .col-icon {
  color: #34d399;
}
.col-title {
  font-size: var(--fs-h4);
  font-weight: 700;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 1px 1px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}

/* List */
.col-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
}
.col-list li {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.6;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
</style>
