<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const parsed = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const items: string[] = []
  const before: string[] = []
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
  <!-- Pixel Retro numbered list — NES inventory-style blocky numbered items -->
  <div class="px-list-num flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Corner decorations -->
    <div class="absolute top-6 left-6 pointer-events-none pixel-corner corner-tl">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>
    <div class="absolute top-6 right-6 pointer-events-none pixel-corner corner-tr">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>

    <div class="relative z-10 w-full max-w-xl px-8">
      <h3 v-if="slide.title" class="px-title">{{ slide.title }}</h3>
      <div v-if="parsed.subtitle" class="px-sub mb-6" v-html="parsed.subtitle" />

      <div v-if="parsed.items.length" class="px-list">
        <div v-for="(item, i) in parsed.items" :key="i"
          class="px-item" :style="{
            background: 'var(--color-card)',
            border: '3px solid var(--color-border)',
            boxShadow: '4px 4px 0 var(--pixel-shadow)',
            imageRendering: 'pixelated',
          }">
          <span class="px-num" :style="{
            background: 'var(--color-accent)',
            color: 'var(--color-accent-foreground)',
            border: '2px solid var(--pixel-shadow)',
          }">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="px-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-list-num {
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
  margin-bottom: 0.75rem;
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

/* List */
.px-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.px-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
}

/* Number badge */
.px-num {
  flex-shrink: 0;
  font-size: 1rem;
  font-weight: 800;
  min-width: 2.5rem;
  text-align: center;
  padding: 0.25rem 0.5rem;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

/* Text */
.px-text {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.6;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-text :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}
</style>
