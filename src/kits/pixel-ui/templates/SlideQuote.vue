<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { ref, onMounted } from 'vue'

defineProps<{ slide: Slide }>()

// Typewriter state — text is fully rendered but the "..." prompt blinks to simulate crawl
const showPrompt = ref(false)
onMounted(() => {
  setTimeout(() => { showPrompt.value = true }, 800)
})
</script>

<template>
  <!-- NES Text Crawl / Story Screen — typewriter text in a bordered window with "..." prompt -->
  <div class="px-quote flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-code-bg)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Diagonal stripe background for story screen feel -->
    <div class="absolute inset-0 pointer-events-none pixel-diagonal" />

    <!-- Outer border — NES screen frame -->
    <div class="absolute inset-3 pointer-events-none pixel-outer-frame" />

    <!-- Story window — tall horizontal banner across screen -->
    <div class="relative z-10 w-full max-w-3xl px-8">
      <div class="px-quote-window" :style="{
        background: 'var(--color-card)',
        border: '4px solid var(--color-accent)',
        boxShadow: '8px 8px 0 var(--pixel-shadow)',
        imageRendering: 'pixelated',
      }">
        <!-- Window title bar with story label -->
        <div class="px-quote-titlebar" :style="{
          background: 'var(--color-accent)',
          borderBottom: '4px solid var(--pixel-shadow)',
          imageRendering: 'pixelated',
        }">
          <span class="titlebar-deco">▌</span>
          <span class="titlebar-label">STORY</span>
          <span class="titlebar-deco">▐</span>
        </div>

        <!-- Text crawl area -->
        <div class="px-quote-body" :style="{
          padding: '2.5rem 3rem',
          imageRendering: 'pixelated',
        }">
          <!-- The quote text — rendered in NES crawl style -->
          <div v-html="slide.html" class="px-quote-prose" />

          <!-- Typewriter "..." prompt at bottom -->
          <div class="px-quote-prompt" :class="{ visible: showPrompt }">
            <span class="prompt-char">.</span>
            <span class="prompt-char">.</span>
            <span class="prompt-char">.</span>
          </div>
        </div>

        <!-- Bottom border decoration -->
        <div class="px-quote-bottom" :style="{
          background: 'var(--color-muted)',
          borderTop: '4px solid var(--color-border)',
          padding: '0.3rem 1rem',
          imageRendering: 'pixelated',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
        }">
          <span class="bottom-dash" />
          <span class="bottom-dash accent" />
          <span class="bottom-dash" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-quote {
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

.pixel-diagonal {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    var(--pixel-bg-grid) 10px,
    var(--pixel-bg-grid) 12px
  );
  opacity: 0.3;
  image-rendering: pixelated;
}

.pixel-outer-frame {
  border: 4px solid var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 6px var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Window */
.px-quote-window {
  overflow: hidden;
}

/* Title bar */
.px-quote-titlebar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 1.5rem;
}
.px-quote-titlebar .titlebar-deco {
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--color-accent-foreground);
  opacity: 0.6;
}
.px-quote-titlebar .titlebar-label {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: var(--fs-caption);
  color: var(--color-accent-foreground);
  letter-spacing: 0.3em;
  image-rendering: pixelated;
}

/* Body */
.px-quote-body {
  position: relative;
  min-height: 160px;
}

/* Quote text — large, center, typewriter feel */
.px-quote-prose :deep(h3) {
  font-size: var(--fs-caption);
  font-weight: 500;
  margin-bottom: 1.5rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

.px-quote-prose :deep(blockquote),
.px-quote-prose :deep(p) {
  font-size: var(--fs-quote);
  font-weight: 600;
  line-height: 1.75;
  text-align: center;
  border: none;
  margin: 0;
  color: var(--color-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Blinking ... prompt */
.px-quote-prompt {
  display: flex;
  justify-content: center;
  gap: 0.3rem;
  margin-top: 1.5rem;
  opacity: 0;
  transition: opacity 0.5s ease;
}
.px-quote-prompt.visible {
  opacity: 1;
  animation: px-prompt-blink 1.2s step-end infinite;
  animation-delay: 0.8s;
}
@keyframes px-prompt-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.px-quote-prompt .prompt-char {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: 1.5rem;
  color: var(--color-accent);
  image-rendering: pixelated;
}

/* Bottom dashes */
.px-quote-bottom .bottom-dash {
  width: 24px;
  height: 4px;
  background: var(--pixel-shadow);
  display: inline-block;
  image-rendering: pixelated;
}
.px-quote-bottom .bottom-dash.accent {
  background: var(--color-accent);
}
</style>
