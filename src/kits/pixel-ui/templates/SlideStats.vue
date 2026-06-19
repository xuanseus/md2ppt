<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'

const props = defineProps<{ slide: Slide }>()

interface StatChunk {
  value: string
  label: string
}

const stats = computed<StatChunk[]>(() => {
  const chunks: StatChunk[] = []
  const strongRe = /<strong>(.+?)<\/strong>/g
  const body = props.slide.html
  let match: RegExpExecArray | null
  let lastIndex = 0

  while ((match = strongRe.exec(body)) !== null) {
    const beforeStrong = body.slice(lastIndex, match.index)
    const labelMatch = beforeStrong.match(/<p>(.+?)<\/p>/g)
    if (labelMatch && labelMatch.length > 0 && chunks.length > 0) {
      const lastLabel = labelMatch[labelMatch.length - 1].replace(/<\/?p>/g, '')
      if (lastLabel.trim()) {
        chunks[chunks.length - 1].label = lastLabel.trim()
      }
    }
    chunks.push({ value: match[1], label: '' })
    lastIndex = strongRe.lastIndex
  }

  const trailing = body.slice(lastIndex)
  const lastLabelMatch = trailing.match(/<p>(.+?)<\/p>/)
  if (lastLabelMatch && chunks.length > 0) {
    chunks[chunks.length - 1].label = lastLabelMatch[1]
  }

  return chunks
})

const useFallback = computed(() => stats.value.length === 0)
</script>

<template>
  <!-- NES Score Screen — HIGH SCORE display with 1UP style stats, blocky HP progress bars -->
  <div class="px-stats flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Top HUD bar — like NES game status bar -->
    <div class="absolute top-0 left-0 right-0 pointer-events-none px-stats-hud">
      <div class="hud-left">
        <span class="hud-label">SCORE</span>
        <span class="hud-value">{{ stats[0]?.value || '000000' }}</span>
      </div>
      <div class="hud-right">
        <span class="hud-label">HIGH</span>
        <span class="hud-value">{{ stats[0]?.value || '000000' }}</span>
      </div>
    </div>

    <!-- Bottom status bar -->
    <div class="absolute bottom-0 left-0 right-0 pointer-events-none px-stats-bottom-bar">
      <span class="bottom-label">WORLD</span>
      <span class="bottom-time">1-1</span>
      <span class="bottom-label">LIVES</span>
      <span class="bottom-lives">
        <span class="life-icon">♥</span>
        <span class="life-icon">♥</span>
        <span class="life-icon">♥</span>
      </span>
    </div>

    <div class="relative z-10 w-full max-w-4xl px-10">
      <!-- Fallback: render raw HTML -->
      <div v-if="useFallback" class="px-stats-fallback" :style="{
        background: 'var(--color-card)',
        border: '4px solid var(--color-accent)',
        boxShadow: '6px 6px 0 var(--pixel-shadow)',
        imageRendering: 'pixelated',
        padding: '2rem 3rem',
      }">
        <div v-html="slide.html" class="px-stats-prose" />
      </div>

      <!-- Stats grid — score-style layout -->
      <div v-else class="px-stats-grid" :style="{ gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)` }">
        <div v-for="(stat, i) in stats" :key="i" class="px-stat-item">
          <!-- 1UP style label -->
          <div class="px-stat-1up">
            <span class="oneup-icon">{{ i === 0 ? '★' : '●' }}</span>
            <span class="oneup-text">{{ i === 0 ? 'HIGH SCORE' : `${i}UP` }}</span>
          </div>

          <!-- Large blocky number display -->
          <div class="px-stat-value" v-html="stat.value" />

          <!-- Blocky pixel progress bar (HP bar style) -->
          <div class="px-stat-hpbar-wrap">
            <div class="px-stat-hpbar-track">
              <div
                class="px-stat-hpbar-fill"
                :style="{
                  width: `${Math.min(55 + (i + 1) * 20, 100)}%`,
                  background: i === 0 ? 'var(--color-h1-from)' : i === 1 ? 'var(--color-accent)' : 'var(--color-h1-to)',
                }"
              />
              <div class="px-stat-hpbar-segments">
                <span v-for="s in 8" :key="s" class="hp-seg-divider" />
              </div>
            </div>
          </div>

          <!-- Stat label -->
          <div class="px-stat-label" v-if="stat.label">{{ stat.label }}</div>
        </div>

        <!-- Empty state — single huge score display -->
        <div v-if="stats.length === 0" class="px-stat-solo">
          <div class="oneup-text">INSERT COIN</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-stats {
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
.px-stats-hud {
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
.px-stats-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.4rem 2rem;
  background: var(--color-muted);
  border-top: 3px solid var(--color-accent);
  image-rendering: pixelated;
}
.bottom-label, .bottom-time {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.7);
  color: var(--color-muted-foreground);
  image-rendering: pixelated;
}
.bottom-time {
  color: var(--color-accent);
}
.bottom-lives {
  display: flex;
  gap: 2px;
}
.life-icon {
  font-family: monospace;
  font-size: 0.7rem;
  color: var(--color-h1-from);
}

/* Stats grid */
.px-stats-grid {
  display: grid;
  gap: 2rem;
  padding: 0 1rem;
}

/* Each stat item */
.px-stat-item {
  text-align: center;
  background: var(--color-card);
  border: 3px solid var(--color-border);
  padding: 1.5rem 1rem;
  image-rendering: pixelated;
  box-shadow: 4px 4px 0 var(--pixel-shadow);
}

/* 1UP label row */
.px-stat-1up {
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

/* Large number */
.px-stat-value {
  font-size: var(--fs-stat);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
  text-shadow: 3px 3px 0 var(--pixel-shadow);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
  animation: px-score-pop 0.5s ease-out;
}

@keyframes px-score-pop {
  0% { transform: scale(0.3); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

/* Blocky HP bar */
.px-stat-hpbar-wrap {
  margin: 0.5rem auto;
  padding: 0 0.5rem;
}
.px-stat-hpbar-track {
  width: 100%;
  height: 12px;
  background: var(--color-muted);
  border: 3px solid var(--color-border);
  position: relative;
  overflow: hidden;
  image-rendering: pixelated;
}
.px-stat-hpbar-fill {
  height: 100%;
  image-rendering: pixelated;
  animation: px-hp-fill 1.2s ease-out;
}
.px-stat-hpbar-segments {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
}
.hp-seg-divider {
  flex: 1;
  border-right: 2px solid var(--pixel-shadow);
  opacity: 0.2;
}
.hp-seg-divider:last-child {
  border-right: none;
}

@keyframes px-hp-fill {
  0% { width: 0% !important; }
}

/* Label */
.px-stat-label {
  font-size: var(--fs-caption);
  color: var(--color-muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 600;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
  margin-top: 0.5rem;
}

/* Fallback */
.px-stats-fallback {
  text-align: center;
}

.px-stats-prose :deep(strong) {
  display: block;
  font-size: var(--fs-stat);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1.5rem;
  color: var(--color-accent);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 3px 3px 0 var(--pixel-shadow);
  image-rendering: pixelated;
  animation: px-score-pop 0.5s ease-out;
}
.px-stats-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  margin-top: 1.5rem;
  line-height: 1.7;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
</style>
