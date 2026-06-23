<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- Pixel Retro centered content — NES dialog window with title bar -->
  <div class="px-content-centered flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
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

    <!-- Dialog window -->
    <div class="relative z-10 w-full max-w-xl px-8">
      <div class="px-window" :style="{
        background: 'var(--color-card)',
        border: '4px solid var(--color-accent)',
        boxShadow: '6px 6px 0 var(--pixel-shadow)',
        imageRendering: 'pixelated',
        padding: '2.5rem 3rem',
      }">
        <!-- NES-style title bar -->
        <div class="px-titlebar" :style="{
          background: 'var(--color-accent)',
          borderBottom: '4px solid var(--pixel-shadow)',
          imageRendering: 'pixelated',
          margin: '-2.5rem -3rem 2rem -3rem',
          padding: '0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
        }">
          <span class="titlebar-tab-left">╔</span>
          <span class="titlebar-text">MESSAGE</span>
          <span class="titlebar-tab-right">╗</span>
        </div>

        <h3 v-if="slide.title" class="px-title">{{ slide.title }}</h3>
        <div v-html="slide.html" class="px-prose" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-content-centered {
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

/* Title bar */
.px-titlebar .titlebar-tab-left,
.px-titlebar .titlebar-tab-right {
  font-family: monospace;
  font-size: 1rem;
  color: var(--color-accent-foreground);
}
.px-titlebar .titlebar-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: var(--fs-caption);
  color: var(--color-accent-foreground);
  letter-spacing: 0.25em;
  image-rendering: pixelated;
}

.px-window {
  overflow: hidden;
  text-align: center;
}

/* Title */
.px-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Prose */
.px-prose :deep(h1),
.px-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}
.px-prose :deep(h3),
.px-prose :deep(h4) {
  font-size: var(--fs-h3);
  font-weight: 500;
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-prose :deep(ul) {
  list-style: none;
  padding: 0;
}
.px-prose :deep(li) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  padding: 0.5rem 0;
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
</style>
