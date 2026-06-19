<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- NES Dialog Window — blue-bordered window with white interior, title bar, blinking cursor at bottom -->
  <div class="px-content flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Corner pixel decorations — NES-style brackets -->
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
    <div class="relative z-10 w-full max-w-4xl px-10">
      <div class="px-dialog-window" :style="{
        background: 'var(--color-card)',
        border: '4px solid var(--color-accent)',
        boxShadow: '6px 6px 0 var(--pixel-shadow)',
        imageRendering: 'pixelated',
      }">
        <!-- NES-style title bar at top of window -->
        <div class="px-dialog-titlebar" :style="{
          background: 'var(--color-accent)',
          borderBottom: '4px solid var(--pixel-shadow)',
          imageRendering: 'pixelated',
        }">
          <span class="titlebar-tab-left">╔</span>
          <span class="titlebar-text">MESSAGE</span>
          <span class="titlebar-tab-right">╗</span>
        </div>

        <!-- Content area — white interior like NES dialog -->
        <div class="px-dialog-body" :style="{
          background: 'var(--color-card)',
          padding: '2rem 2.5rem',
          imageRendering: 'pixelated',
        }">
          <div v-html="slide.html" class="px-content-prose" />
        </div>

        <!-- Bottom status bar with blinking cursor block -->
        <div class="px-dialog-footer" :style="{
          background: 'var(--color-muted)',
          borderTop: '4px solid var(--color-border)',
          imageRendering: 'pixelated',
        }">
          <span class="footer-prompt">PRESS A TO CONTINUE</span>
          <span class="footer-cursor">█</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-content {
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

/* Dialog window */
.px-dialog-window {
  overflow: hidden;
}

/* Title bar */
.px-dialog-titlebar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.5rem 1.5rem;
}
.px-dialog-titlebar .titlebar-tab-left,
.px-dialog-titlebar .titlebar-tab-right {
  font-family: monospace;
  font-size: 1rem;
  color: var(--color-accent-foreground);
}
.px-dialog-titlebar .titlebar-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: var(--fs-caption);
  color: var(--color-accent-foreground);
  letter-spacing: 0.25em;
  image-rendering: pixelated;
}

/* Body */
.px-dialog-body {
  min-height: 200px;
}

/* Footer with blinking cursor */
.px-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.6rem 1.5rem;
}
.px-dialog-footer .footer-prompt {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.85);
  color: var(--color-muted-foreground);
  letter-spacing: 0.15em;
  image-rendering: pixelated;
}
.px-dialog-footer .footer-cursor {
  font-family: monospace;
  font-size: 1rem;
  color: var(--color-accent);
  animation: px-dialog-blink 1s step-end infinite;
}

@keyframes px-dialog-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Content prose */
.px-content-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  line-height: 1.2;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}
.px-content-prose :deep(h3) {
  font-size: var(--fs-h3);
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-content-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-content-prose :deep(ul),
.px-content-prose :deep(ol) {
  padding-left: 0;
  margin: 0.75rem 0;
  list-style: none;
}
.px-content-prose :deep(li) {
  font-size: var(--fs-body-sm);
  margin-bottom: 0.5rem;
  line-height: 1.7;
  padding-left: 1.5rem;
  position: relative;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-content-prose :deep(li)::before {
  content: '▸';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-accent);
  font-family: monospace;
}
.px-content-prose :deep(blockquote) {
  border-left: 4px solid var(--color-blockquote-border);
  padding: 0.75rem 1.25rem;
  margin: 1rem 0;
  font-style: normal;
  background: var(--color-muted);
  image-rendering: pixelated;
}
.px-content-prose :deep(code) {
  padding: 0.1rem 0.4rem;
  font-size: 0.85em;
  background: var(--color-muted);
  color: var(--color-accent);
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  image-rendering: pixelated;
}
.px-content-prose :deep(pre) {
  border: 4px solid var(--color-border);
  overflow-x: auto;
  image-rendering: pixelated;
  box-shadow: 4px 4px 0 var(--pixel-shadow);
}
.px-content-prose :deep(a) {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 2px solid var(--color-accent);
  image-rendering: pixelated;
}
.px-content-prose :deep(img) {
  max-width: 90%;
  max-height: 40vh;
  display: block;
  margin: 0.75rem auto;
  image-rendering: pixelated;
  border: 4px solid var(--color-border);
  box-shadow: 4px 4px 0 var(--pixel-shadow);
}
.px-content-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}
</style>
