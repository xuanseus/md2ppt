<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- NES Menu Select Screen — ▶ cursor prefix, numbered items, blue selection highlight bar on hover -->
  <div class="px-list flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Side pixel pillars — like NES menu framing -->
    <div class="absolute left-0 top-0 bottom-0 w-2 pointer-events-none pixel-pillar" />
    <div class="absolute right-0 top-0 bottom-0 w-2 pointer-events-none pixel-pillar" />

    <!-- Outer frame border -->
    <div class="absolute inset-3 pointer-events-none pixel-menu-frame" />

    <div class="relative z-10 w-full max-w-3xl px-10">
      <!-- Menu title header -->
      <div v-if="slide.title" class="px-menu-header">
        <div class="menu-header-inner" :style="{
          background: 'var(--color-accent)',
          border: '4px solid var(--pixel-shadow)',
          boxShadow: '4px 4px 0 var(--pixel-shadow)',
          imageRendering: 'pixelated',
        }">
          <span class="menu-header-deco">█</span>
          <h2 class="menu-header-title">{{ slide.title }}</h2>
          <span class="menu-header-deco">█</span>
        </div>

        <!-- Menu index counter -->
        <div class="menu-index-row mt-2">
          <span class="index-dot" />
          <span class="index-dot accent" />
          <span class="index-dot accent" />
          <span class="index-dot accent" />
          <span class="index-dot" />
        </div>
      </div>

      <!-- Menu items — NES-style selectable list with ▶ cursor -->
      <div class="px-menu-box" :style="{
        background: 'var(--color-card)',
        border: '4px solid var(--color-accent)',
        boxShadow: '6px 6px 0 var(--pixel-shadow)',
        imageRendering: 'pixelated',
        padding: '1.5rem 2rem',
      }">
        <!-- Menu selection indicator at top -->
        <div class="menu-select-hint" :style="{
          borderBottom: '3px solid var(--color-border)',
          imageRendering: 'pixelated',
        }">
          <span class="hint-cursor">▶</span>
          <span class="hint-label">SELECT OPTION</span>
        </div>

        <!-- Render content with menu styling -->
        <div v-html="slide.html" class="px-list-prose" />
      </div>

      <!-- Menu footer — "B: BACK" text -->
      <div class="px-menu-footer mt-3">
        <span class="footer-btn">A</span>
        <span class="footer-text">SELECT</span>
        <span class="footer-spacer" />
        <span class="footer-btn">B</span>
        <span class="footer-text">BACK</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-list {
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

/* Side pillars */
.pixel-pillar {
  background: repeating-linear-gradient(
    0deg,
    var(--color-accent),
    var(--color-accent) 8px,
    var(--pixel-shadow) 8px,
    var(--pixel-shadow) 16px
  );
  image-rendering: pixelated;
}

.pixel-menu-frame {
  border: 4px solid var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 6px var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Menu header */
.px-menu-header {
  text-align: center;
  margin-bottom: 1rem;
}
.menu-header-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 2rem;
}
.menu-header-deco {
  font-family: monospace;
  color: var(--color-accent-foreground);
  font-size: 0.8rem;
  opacity: 0.6;
}
.menu-header-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-accent-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
  line-height: 1.2;
}

/* Index dots */
.menu-index-row {
  display: flex;
  justify-content: center;
  gap: 6px;
}
.index-dot {
  width: 8px;
  height: 8px;
  background: var(--pixel-shadow);
  image-rendering: pixelated;
}
.index-dot.accent {
  background: var(--color-accent);
}

/* Menu box */
.px-menu-box {
  overflow: hidden;
}

/* Selection hint at top */
.menu-select-hint {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}
.hint-cursor {
  font-family: monospace;
  color: var(--color-accent);
  font-size: 0.9rem;
  animation: px-list-cursor-blink 1s step-end infinite;
}
@keyframes px-list-cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.hint-label {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.8);
  color: var(--color-muted-foreground);
  letter-spacing: 0.2em;
  image-rendering: pixelated;
}

/* List items — menu style */
.px-list-prose :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

.px-list-prose :deep(ol) {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: menu-item;
}

/* Unordered list items — ▶ cursor prefix */
.px-list-prose :deep(ul > li) {
  font-size: var(--fs-body);
  line-height: 1.7;
  padding: 0.65rem 1rem;
  margin-bottom: 0.35rem;
  background: var(--color-muted);
  border: 3px solid var(--color-border);
  color: var(--color-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
  position: relative;
  padding-left: 2.25rem;
  transition: background 0.1s, border-color 0.1s, box-shadow 0.1s;
  cursor: default;
}

/* ▶ cursor for UL items */
.px-list-prose :deep(ul > li)::before {
  content: '▶';
  position: absolute;
  left: 0.75rem;
  color: var(--color-accent);
  font-family: monospace;
  font-size: 0.6rem;
  opacity: 0;
  transition: opacity 0.1s;
}

.px-list-prose :deep(ul > li:hover) {
  background: var(--color-card);
  border-color: var(--color-accent);
  box-shadow: 3px 3px 0 var(--pixel-shadow);
}

.px-list-prose :deep(ul > li:hover)::before {
  opacity: 1;
  animation: px-list-cursor-blink 0.8s step-end infinite;
}

/* Ordered list items — numbered with cursor */
.px-list-prose :deep(ol > li) {
  font-size: var(--fs-body);
  line-height: 1.7;
  padding: 0.65rem 1rem;
  margin-bottom: 0.35rem;
  background: var(--color-muted);
  border: 3px solid var(--color-border);
  color: var(--color-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
  position: relative;
  padding-left: 2.25rem;
  transition: background 0.1s, border-color 0.1s, box-shadow 0.1s;
  cursor: default;
  counter-increment: menu-item;
}

.px-list-prose :deep(ol > li)::before {
  content: counter(menu-item);
  position: absolute;
  left: 0.75rem;
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.8);
  image-rendering: pixelated;
}

.px-list-prose :deep(ol > li:hover) {
  background: var(--color-card);
  border-color: var(--color-accent);
  box-shadow: 3px 3px 0 var(--pixel-shadow);
}

.px-list-prose :deep(ol > li:hover)::before {
  color: var(--color-accent);
}

/* Paragraphs */
.px-list-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

/* Menu footer — button hints */
.px-menu-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.footer-btn {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.7);
  color: var(--color-accent-foreground);
  background: var(--color-accent);
  padding: 0.15rem 0.4rem;
  image-rendering: pixelated;
  border: 2px solid var(--pixel-shadow);
  min-width: 1.2rem;
  text-align: center;
}
.footer-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.7);
  color: var(--color-muted-foreground);
  image-rendering: pixelated;
  letter-spacing: 0.1em;
}
.footer-spacer {
  width: 1.5rem;
}
</style>
