<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const ratio = computed(() => {
  const r = (props.slide.rawMd.match(/\{ratio:\s*(\d+)-(\d+)\}/i) || [])
  return { l: parseInt(r[1] || '2'), r: parseInt(r[2] || '1') }
})

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
  <!-- Pixel Retro asymmetric two-column — pixel-bordered columns side by side -->
  <div class="px-two-asym flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Corner pixel decorations -->
    <div class="absolute top-6 left-6 pointer-events-none pixel-corner corner-tl">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>
    <div class="absolute top-6 right-6 pointer-events-none pixel-corner corner-tr">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>
    <div class="absolute bottom-6 left-6 pointer-events-none pixel-corner corner-bl">
      <span class="corner-char c1">└</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┘</span>
    </div>
    <div class="absolute bottom-6 right-6 pointer-events-none pixel-corner corner-br">
      <span class="corner-char c1">└</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┘</span>
    </div>

    <div class="relative z-10 w-full max-w-4xl px-8">
      <!-- Title -->
      <h3 v-if="slide.title" class="px-title">{{ slide.title }}</h3>

      <!-- Separator -->
      <div class="px-sep mb-6">
        <span class="sep-dot" />
        <span class="sep-dash" />
        <span class="sep-dot accent" />
        <span class="sep-dash" />
        <span class="sep-dot" />
      </div>

      <div v-if="parsed.subtitle" class="px-sub mb-6" v-html="parsed.subtitle" />

      <div class="px-grid" :style="{ gridTemplateColumns: `${ratio.l}fr ${ratio.r}fr` }">
        <div v-for="(col, i) in parsed.columns" :key="i"
          class="px-col" :style="{
            background: 'var(--color-card)',
            border: i === 0 ? '4px solid var(--color-accent)' : '4px solid var(--pixel-shadow)',
            boxShadow: '4px 4px 0 var(--pixel-shadow)',
            imageRendering: 'pixelated',
          }">
          <h4 class="px-col-title">{{ col.title }}</h4>
          <div v-html="col.html" class="px-col-body" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-two-asym {
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
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Separator */
.px-sep {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}
.px-sep .sep-dot {
  width: 8px;
  height: 8px;
  background: var(--pixel-shadow);
  display: inline-block;
  image-rendering: pixelated;
}
.px-sep .sep-dot.accent {
  background: var(--color-accent);
}
.px-sep .sep-dash {
  width: 24px;
  height: 4px;
  background: var(--color-accent);
  display: inline-block;
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

/* Columns grid */
.px-grid {
  display: grid;
  gap: 2rem;
}

.px-col {
  overflow: hidden;
  padding: 1.5rem 2rem;
}

.px-col-title {
  font-size: var(--fs-h4);
  font-weight: 700;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid var(--color-accent);
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 1px 1px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}

.px-col-body :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.5rem;
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-col-body :deep(ul),
.px-col-body :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}
.px-col-body :deep(li) {
  margin-bottom: 0.4rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-col-body :deep(li::marker) {
  color: var(--color-accent);
}
</style>
