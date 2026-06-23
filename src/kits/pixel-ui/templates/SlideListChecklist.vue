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
  <!-- Pixel Retro checklist — NES-style block items with square checkboxes -->
  <div class="px-checklist flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
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

      <div v-if="items.length" class="px-list">
        <div v-for="(item, i) in items" :key="i"
          class="px-item" :style="{
            background: 'var(--color-card)',
            border: '3px solid var(--color-border)',
            boxShadow: '4px 4px 0 var(--pixel-shadow)',
            imageRendering: 'pixelated',
          }">
          <!-- Square checkbox -->
          <span class="px-check" :style="{
            border: '3px solid var(--color-accent)',
            background: 'var(--color-muted)',
          }">
            <span class="check-mark">✔</span>
          </span>
          <span class="px-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-checklist {
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
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}

/* List */
.px-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.px-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
}

/* Square checkbox */
.px-check {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  image-rendering: pixelated;
}
.check-mark {
  font-family: monospace;
  font-size: 0.7rem;
  color: var(--color-accent);
  font-weight: 700;
}

/* Text */
.px-text {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.5;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-text :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}
</style>
