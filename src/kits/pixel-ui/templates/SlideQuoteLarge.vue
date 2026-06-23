<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- Pixel Retro quote — NES dialogue box with block border and pixel quote marks -->
  <div class="px-quote flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
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
      <!-- Pixel quote box -->
      <div class="px-quote-box" :style="{
        background: 'var(--color-card)',
        border: '4px solid var(--color-accent)',
        boxShadow: '6px 6px 0 var(--pixel-shadow)',
        imageRendering: 'pixelated',
        padding: '2.5rem 3rem',
      }">
        <!-- Top quote mark -->
        <div class="quote-mark top">"</div>

        <div v-html="slide.html" class="px-prose" />

        <!-- Bottom quote mark -->
        <div class="quote-mark bottom">"</div>

        <!-- NES-style prompt -->
        <div class="quote-prompt mt-6">
          <span class="prompt-text">PRESS A TO CONTINUE</span>
          <span class="prompt-cursor">█</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-quote {
  padding: 4rem;
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

/* Quote box */
.px-quote-box {
  position: relative;
  overflow: hidden;
}

/* Quote marks */
.quote-mark {
  font-size: 6rem;
  line-height: 1;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  color: var(--color-accent);
  opacity: 0.2;
  user-select: none;
  pointer-events: none;
  image-rendering: pixelated;
}
.quote-mark.bottom {
  transform: rotate(180deg);
}

/* Prose */
.px-prose :deep(blockquote),
.px-prose :deep(p) {
  font-size: var(--fs-quote, 1.8rem);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-muted-foreground);
  margin: 1rem 0;
  font-style: normal;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-prose :deep(h3),
.px-prose :deep(h4) {
  display: none;
}
.px-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}

/* Prompt */
.quote-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.prompt-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.85);
  color: var(--color-muted-foreground);
  letter-spacing: 0.15em;
  image-rendering: pixelated;
}
.prompt-cursor {
  font-family: monospace;
  font-size: 1rem;
  color: var(--color-accent);
  animation: px-blink 1s step-end infinite;
}
@keyframes px-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
