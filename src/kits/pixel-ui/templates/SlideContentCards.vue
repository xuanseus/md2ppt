<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- Pixel Retro content card — single pixel-bordered card with block shadow -->
  <div class="px-content-card flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
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

    <div class="relative z-10 w-full max-w-2xl px-8">
      <h3 v-if="slide.title" class="px-title">{{ slide.title }}</h3>

      <div class="px-card" :style="{
        background: 'var(--color-card)',
        border: '4px solid var(--color-accent)',
        boxShadow: '6px 6px 0 var(--pixel-shadow)',
        imageRendering: 'pixelated',
        padding: '2.5rem 3rem',
      }">
        <div v-html="slide.html" class="px-prose" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-content-card {
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
  font-size: var(--fs-h2);
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Card */
.px-card {
  overflow: hidden;
}

/* Prose */
.px-prose :deep(h1),
.px-prose :deep(h2),
.px-prose :deep(h3),
.px-prose :deep(h4) {
  display: none;
}
.px-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-prose :deep(ul) {
  list-style: none;
  padding: 0;
}
.px-prose :deep(li) {
  font-size: var(--fs-body-sm);
  padding: 0.4rem 0;
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-prose :deep(li::before) {
  content: '▸ ';
  color: var(--color-accent);
  font-family: monospace;
}
.px-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}
.px-prose :deep(a) {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 2px solid var(--color-accent);
  image-rendering: pixelated;
}
.px-prose :deep(blockquote) {
  border-left: 4px solid var(--color-blockquote-border);
  padding: 0.75rem 1.25rem;
  margin: 1rem 0;
  font-style: normal;
  background: var(--color-muted);
  image-rendering: pixelated;
}
</style>
