<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- Pixel Retro inline stats — centered text with pixel bold numbers -->
  <div class="px-stats-inline flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
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

    <div class="relative z-10 w-full max-w-2xl px-8 text-center">
      <h3 v-if="slide.title" class="px-title">{{ slide.title }}</h3>
      <div v-html="slide.html" class="px-prose" />
    </div>
  </div>
</template>

<style scoped>
.px-stats-inline {
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
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Prose */
.px-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-prose :deep(strong) {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-heading);
  text-shadow: 3px 3px 0 var(--pixel-shadow);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
  display: inline-block;
  margin: 0 0.25rem;
}
</style>
