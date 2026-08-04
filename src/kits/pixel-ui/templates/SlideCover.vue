<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- Classic NES Title Screen — block letters at top 1/3, blinking START, simple border frame -->
  <div class="px-cover flex flex-col items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline overlay -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Outer border frame — simple 4px frame around entire screen -->
    <div class="absolute inset-3 pointer-events-none pixel-frame-outer" />

    <!-- Starfield dots — scattered pixel stars -->
    <div class="absolute inset-0 pointer-events-none pixel-stars">
      <span class="star" v-for="n in 40" :key="n"
        :style="{
          left: `${Math.abs((n * 137 + 53) % 100)}%`,
          top: `${Math.abs((n * 97 + 29) % 100)}%`,
          animationDelay: `${(n * 0.17) % 3}s`,
          opacity: n % 3 === 0 ? 0.6 : n % 3 === 1 ? 0.3 : 0.8,
          fontSize: n % 5 === 0 ? '0.5rem' : '0.35rem',
        }"
      >✦</span>
    </div>

    <!-- Content centered on screen -->
    <div class="relative z-10 flex flex-col items-center" style="margin-top: -4vh">
      <!-- Decorative top border line -->
      <div class="px-cover-doubleline mb-10">
        <span class="line-block" />
        <span class="line-diamond">◆</span>
        <span class="line-block" />
        <span class="line-diamond">◆</span>
        <span class="line-block" />
        <span class="line-diamond">◆</span>
        <span class="line-block" />
      </div>

      <!-- Main title — large block letters like NES title logo -->
      <h1 v-if="slide.title" class="px-cover-title">{{ slide.title }}</h1>

      <!-- Subtitle / description -->
      <div v-html="slide.html" class="px-cover-prose mt-6" />

      <!-- Pixel separator -->
      <div class="px-cover-sep mt-8">
        <span class="sep-dot" />
        <span class="sep-dash" />
        <span class="sep-dot accent" />
        <span class="sep-dash" />
        <span class="sep-dot" />
      </div>

      <!-- Blinking "▶ START" text — like NES press start screen -->
      <div class="px-cover-start mt-5">
        <span class="blink-cursor">▶</span>
        <span class="blink-text">START</span>
      </div>

    </div>

    <!-- Bottom decoration — solid bar -->
    <div class="absolute bottom-0 left-0 right-0 h-1 pointer-events-none pixel-bottom-bar" />
  </div>
</template>

<style scoped>
.px-cover {
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

.pixel-frame-outer {
  border: 4px solid var(--color-accent);
  box-shadow: inset 0 0 0 4px var(--color-background), 0 0 0 4px var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Starfield */
.pixel-stars .star {
  position: absolute;
  color: var(--color-accent);
  font-family: monospace;
  animation: star-twinkle 2s infinite alternate;
  pointer-events: none;
}

@keyframes star-twinkle {
  0% { opacity: 0.2; }
  100% { opacity: 0.8; }
}

/* Double decorative line */
.px-cover-doubleline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}
.px-cover-doubleline .line-block {
  width: 40px;
  height: 6px;
  background: var(--color-accent);
  display: inline-block;
  image-rendering: pixelated;
}
.px-cover-doubleline .line-diamond {
  color: var(--color-accent);
  font-size: 0.6rem;
  font-family: monospace;
}

/* Title — classic NES block letter style */
.px-cover-title {
  font-size: calc(4.5rem * var(--content-scale));
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-heading);
  text-align: center;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow:
    4px 4px 0 var(--pixel-shadow),
    -1px -1px 0 var(--pixel-highlight);
  image-rendering: pixelated;
  word-break: break-word;
  max-width: 90vw;
  padding: 0 2rem;
}

/* Separator */
.px-cover-sep {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}
.px-cover-sep .sep-dot {
  width: 8px;
  height: 8px;
  background: var(--pixel-shadow);
  display: inline-block;
  image-rendering: pixelated;
}
.px-cover-sep .sep-dot.accent {
  background: var(--color-accent);
}
.px-cover-sep .sep-dash {
  width: 24px;
  height: 4px;
  background: var(--color-accent);
  display: inline-block;
  image-rendering: pixelated;
}

/* Blinking START */
.px-cover-start {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(1.2rem * var(--content-scale));
  color: var(--color-accent);
  image-rendering: pixelated;
  animation: px-start-blink 1s step-end infinite;
}

@keyframes px-start-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.px-cover-start .blink-cursor {
  font-size: calc(1.5rem * var(--content-scale));
}


/* Bottom bar */
.pixel-bottom-bar {
  background: repeating-linear-gradient(
    90deg,
    var(--color-accent),
    var(--color-accent) 8px,
    var(--pixel-shadow) 8px,
    var(--pixel-shadow) 16px
  );
  image-rendering: pixelated;
}

/* Prose */
.px-cover-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  text-align: center;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
</style>
