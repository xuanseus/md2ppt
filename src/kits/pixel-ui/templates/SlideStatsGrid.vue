<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const cols = computed(() => parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i) || [])[1] || '3'))

const cards = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('|||').map(s => s.trim()).filter(Boolean).map(s => ({ html: marked.parse(s) as string }))
})
</script>

<template>
  <!-- Pixel Retro stats grid — NES-style stat cards with HP bars and block shadows -->
  <div class="px-stats-grid flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Top HUD bar -->
    <div class="absolute top-0 left-0 right-0 pointer-events-none px-hud">
      <div class="hud-left">
        <span class="hud-label">SCORE</span>
        <span class="hud-value">000000</span>
      </div>
      <div class="hud-right">
        <span class="hud-label">HIGH</span>
        <span class="hud-value">999999</span>
      </div>
    </div>

    <!-- Bottom status bar -->
    <div class="absolute bottom-0 left-0 right-0 pointer-events-none px-bottom-bar">
      <span class="bottom-label">STAGE</span>
      <span class="bottom-value">1-1</span>
      <span class="bottom-label">LIVES</span>
      <span class="bottom-lives">
        <span class="life">♥</span>
        <span class="life">♥</span>
        <span class="life">♥</span>
      </span>
    </div>

    <div class="relative z-10 w-full max-w-4xl px-8">
      <div v-if="cards.length" class="px-grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
        <div v-for="(card, i) in cards" :key="i"
          class="px-stat-card" :style="{
            background: 'var(--color-card)',
            border: '3px solid var(--color-border)',
            boxShadow: '4px 4px 0 var(--pixel-shadow)',
            imageRendering: 'pixelated',
          }">
          <!-- 1UP label -->
          <div class="stat-1up">
            <span class="oneup-icon">{{ i === 0 ? '★' : '●' }}</span>
            <span class="oneup-text">{{ i === 0 ? 'HIGH' : `${i}UP` }}</span>
          </div>

          <!-- Content -->
          <div v-html="card.html" class="px-stat-body" />

          <!-- HP bar -->
          <div class="hp-bar-wrap">
            <div class="hp-bar-track" :style="{ background: 'var(--color-muted)', border: '3px solid var(--color-border)' }">
              <div
                class="hp-bar-fill"
                :style="{
                  width: `${Math.min(50 + (i + 1) * 20, 100)}%`,
                  background: i === 0 ? 'var(--color-h1-from)' : i === 1 ? 'var(--color-accent)' : 'var(--color-h1-to)',
                }"
              />
              <div class="hp-segments">
                <span v-for="s in 8" :key="s" class="hp-seg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fallback -->
      <div v-if="!cards.length" v-html="slide.html" class="px-fallback"
        :style="{
          background: 'var(--color-card)',
          border: '4px solid var(--color-accent)',
          boxShadow: '6px 6px 0 var(--pixel-shadow)',
          imageRendering: 'pixelated',
          padding: '2rem 3rem',
          textAlign: 'center',
        }" />
    </div>
  </div>
</template>

<style scoped>
.px-stats-grid {
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

/* Top HUD bar */
.px-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 2rem;
  background: var(--color-muted);
  border-bottom: 3px solid var(--color-accent);
  image-rendering: pixelated;
}
.hud-left, .hud-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.hud-label {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.7);
  color: var(--color-muted-foreground);
  letter-spacing: 0.15em;
  image-rendering: pixelated;
}
.hud-value {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.85);
  color: var(--color-accent);
  image-rendering: pixelated;
}

/* Bottom bar */
.px-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.4rem 2rem;
  background: var(--color-muted);
  border-top: 3px solid var(--color-accent);
  image-rendering: pixelated;
}
.bottom-label, .bottom-value {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.7);
  color: var(--color-muted-foreground);
  image-rendering: pixelated;
}
.bottom-value {
  color: var(--color-accent);
}
.bottom-lives {
  display: flex;
  gap: 2px;
}
.life {
  font-family: monospace;
  font-size: 0.7rem;
  color: var(--color-h1-from);
}

/* Grid */
.px-grid {
  display: grid;
  gap: 2rem;
}

/* Stat card */
.px-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem;
}

/* 1UP label */
.stat-1up {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}
.oneup-icon {
  font-family: monospace;
  color: var(--color-accent);
  font-size: 0.8rem;
}
.oneup-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.85);
  color: var(--color-muted-foreground);
  letter-spacing: 0.15em;
  image-rendering: pixelated;
}

/* Stat body */
.px-stat-body :deep(strong) {
  display: block;
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
  color: var(--color-heading);
  text-shadow: 3px 3px 0 var(--pixel-shadow);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
  margin-bottom: 0.75rem;
}
.px-stat-body :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  margin: 0;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

/* HP bar */
.hp-bar-wrap {
  margin: 0.75rem auto 0;
  padding: 0 0.5rem;
  width: 100%;
}
.hp-bar-track {
  width: 100%;
  height: 12px;
  position: relative;
  overflow: hidden;
  image-rendering: pixelated;
}
.hp-bar-fill {
  height: 100%;
  image-rendering: pixelated;
}
.hp-segments {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
}
.hp-seg {
  flex: 1;
  border-right: 2px solid var(--pixel-shadow);
  opacity: 0.2;
}
.hp-seg:last-child {
  border-right: none;
}

/* Fallback */
.px-fallback {
  text-align: center;
}
.px-fallback :deep(strong) {
  font-size: var(--fs-stat);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1.5rem;
  display: block;
  color: var(--color-accent);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 3px 3px 0 var(--pixel-shadow);
  image-rendering: pixelated;
}
.px-fallback :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  margin-top: 1.5rem;
  line-height: 1.7;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
</style>
