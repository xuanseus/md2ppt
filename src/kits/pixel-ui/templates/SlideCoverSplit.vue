<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- Pixel Retro split cover — left title + right pixel deco block -->
  <div class="px-cover-split flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline overlay -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Outer border frame -->
    <div class="absolute inset-3 pointer-events-none pixel-frame-outer" />

    <!-- Starfield dots -->
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

    <div class="relative z-10 w-full max-w-6xl px-8">
      <div class="flex items-center gap-10">
        <!-- Left column — title -->
        <div class="flex-1 flex flex-col gap-6">
          <div class="px-cover-doubleline">
            <span class="line-block" />
            <span class="line-diamond">◆</span>
            <span class="line-block" />
            <span class="line-diamond">◆</span>
            <span class="line-block" />
          </div>

          <h1 v-if="slide.title" class="px-title">{{ slide.title }}</h1>

          <div v-html="slide.html" class="px-prose" />

          <div class="px-sep mt-2">
            <span class="sep-dot" />
            <span class="sep-dash" />
            <span class="sep-dot accent" />
            <span class="sep-dash" />
            <span class="sep-dot" />
          </div>
        </div>

        <!-- Right column — pixel deco block -->
        <div class="shrink-0 flex items-center justify-center">
          <div class="px-deco-box">
            <span class="deco-icon">◆</span>
            <span class="deco-text">2026</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="absolute bottom-0 left-0 right-0 h-1 pointer-events-none pixel-bottom-bar" />
  </div>
</template>

<style scoped>
.px-cover-split {
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

/* Double line decoration */
.px-cover-doubleline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

/* Title */
.px-title {
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 900;
  line-height: 1.15;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow:
    4px 4px 0 var(--pixel-shadow),
    -1px -1px 0 var(--pixel-highlight);
  image-rendering: pixelated;
  word-break: break-word;
}

/* Separator */
.px-sep {
  display: flex;
  align-items: center;
  gap: 6px;
}
.px-sep .sep-dot {
  width: 8px;
  height: 8px;
  background: var(--pixel-shadow);
  display: inline-block;
  image-rendering: pixelated;
}
.px-sep .sep-dot.accent {
  background: var(--color-accent);
}
.px-sep .sep-dash {
  width: 24px;
  height: 4px;
  background: var(--color-accent);
  display: inline-block;
  image-rendering: pixelated;
}

/* Deco box */
.px-deco-box {
  width: 12rem;
  height: 12rem;
  border: 4px solid var(--color-accent);
  box-shadow: 6px 6px 0 var(--pixel-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  image-rendering: pixelated;
  background: var(--color-muted);
}
.deco-icon {
  font-size: 3rem;
  color: var(--color-accent);
  opacity: 0.6;
  font-family: monospace;
}
.deco-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(1rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-accent);
  opacity: 0.7;
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
</style>
