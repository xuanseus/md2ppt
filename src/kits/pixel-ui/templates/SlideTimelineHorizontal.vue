<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface TLI { date: string; content: string }
const entries = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const r: TLI[] = []
  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/)
    if (m) r.push({ date: m[1], content: m[2] })
  }
  return r
})

const subtitle = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const before: string[] = []
  for (const line of body.split('\n')) { const t = line.trim(); if (t && !t.startsWith('-')) before.push(t); else break }
  return before.length ? marked.parse(before.join('\n')) as string : ''
})
</script>

<template>
  <!-- Pixel Retro timeline — NES stage-select style horizontal track with block dots -->
  <div class="px-timeline flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Corner decorations -->
    <div class="absolute top-6 left-6 pointer-events-none pixel-corner corner-tl">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>
    <div class="absolute top-6 right-6 pointer-events-none pixel-corner corner-tr">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>

    <div class="relative z-10 w-full max-w-4xl px-8">
      <h3 v-if="slide.title" class="px-title">{{ slide.title }}</h3>
      <div v-if="subtitle" class="px-sub mb-6" v-html="subtitle" />

      <div v-if="entries.length" class="px-track-wrap">
        <!-- Pixel track line -->
        <div class="px-track" />

        <div class="px-nodes">
          <div v-for="(e, i) in entries" :key="i" class="px-node">
            <!-- Pixel dot connector -->
            <div class="node-dot-connector">
              <div class="node-line" />
              <div class="node-dot"
                :style="{
                  background: 'var(--color-accent)',
                  border: '3px solid var(--pixel-shadow)',
                }"
              />
              <div class="node-line" />
            </div>

            <!-- Date label -->
            <div class="node-date">{{ e.date }}</div>

            <!-- Content -->
            <div class="node-text">{{ e.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-timeline {
  padding: 3rem;
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

/* Track wrap */
.px-track-wrap {
  position: relative;
  width: 100%;
  padding: 2rem 0 1rem;
}

/* Track line */
.px-track {
  position: absolute;
  top: 3.5rem;
  left: 8%;
  right: 8%;
  height: 4px;
  background: var(--color-accent);
  opacity: 0.4;
  image-rendering: pixelated;
}

/* Nodes */
.px-nodes {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.px-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 12rem;
}

/* Node dot connector */
.node-dot-connector {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 0.25rem;
}
.node-line {
  flex: 1;
  height: 4px;
  background: var(--color-accent);
  opacity: 0.15;
  image-rendering: pixelated;
}
.node-dot {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  image-rendering: pixelated;
}

/* Date */
.node-date {
  font-size: var(--fs-caption);
  font-weight: 700;
  color: var(--color-accent);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

/* Content */
.node-text {
  font-size: var(--fs-small);
  color: var(--color-muted-foreground);
  line-height: 1.5;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
</style>
