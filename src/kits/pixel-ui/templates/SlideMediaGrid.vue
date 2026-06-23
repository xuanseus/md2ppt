<script setup lang="ts">
import { computed } from 'vue'
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()

const cols = parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i) || [])[1] || '2')

const images = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const urls: string[] = []
  for (const line of body.split('\n')) {
    const m = line.match(/!\[.*\]\((.+)\)/)
    if (m) urls.push(m[1])
  }
  return urls
})
</script>

<template>
  <!-- Pixel Retro media grid — NES-style pixel-bordered image containers -->
  <div class="px-media flex flex-col items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Corner decorations -->
    <div class="absolute top-6 left-6 pointer-events-none pixel-corner corner-tl">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>
    <div class="absolute top-6 right-6 pointer-events-none pixel-corner corner-tr">
      <span class="corner-char c1">┌</span><span class="corner-char c2">─</span><span class="corner-char c2">─</span><span class="corner-char c1">┐</span>
    </div>

    <h3 v-if="slide.title" class="px-title">{{ slide.title }}</h3>

    <div class="relative z-10 px-grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="(url, i) in images" :key="i"
        class="px-item" :style="{
          background: 'var(--color-card)',
          border: '4px solid var(--color-accent)',
          boxShadow: '4px 4px 0 var(--pixel-shadow)',
          imageRendering: 'pixelated',
        }">
        <img :src="url" :style="{ imageRendering: 'auto' }" />
      </div>
    </div>

    <div v-if="!images.length" v-html="slide.html" class="px-fallback" />
  </div>
</template>

<style scoped>
.px-media {
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
  font-size: var(--fs-h2);
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
  position: relative;
  z-index: 10;
}

/* Grid */
.px-grid {
  display: grid;
  gap: 1.5rem;
  max-width: 64rem;
  width: 100%;
}

.px-item {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.px-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Fallback */
.px-fallback {
  position: relative;
  z-index: 10;
  max-width: 48rem;
  text-align: center;
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
</style>
