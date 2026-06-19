<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface TimelineEntry {
  date: string
  content: string
}

const parsed = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()

  const entries: TimelineEntry[] = []
  const beforeText: string[] = []
  const afterText: string[] = []
  let hitItems = false

  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/)
    if (m) {
      hitItems = true
      entries.push({ date: m[1], content: m[2] })
      continue
    }
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('-')) {
      if (hitItems) afterText.push(trimmed)
      else beforeText.push(trimmed)
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, entries, afterText: after }
})
</script>

<template>
  <!-- NES Level Select Screen — each entry is a level box in a grid, completed ones have star ★ -->
  <div class="px-timeline flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Background grid dots — like SMB3 level select background -->
    <div class="absolute inset-0 pointer-events-none pixel-level-bg" />

    <!-- Outer frame -->
    <div class="absolute inset-2 pointer-events-none pixel-level-frame" />

    <div class="relative z-10 w-full max-w-5xl px-10">
      <!-- Title banner — "WORLD SELECT" style -->
      <div v-if="slide.title" class="text-center mb-5">
        <div class="px-timeline-titlebar" :style="{ background: 'var(--color-accent)', imageRendering: 'pixelated' }">
          <span class="tl-title-icon">★</span>
          <h2 class="tl-title-text">{{ slide.title }}</h2>
          <span class="tl-title-icon">★</span>
        </div>
      </div>

      <!-- Subtitle -->
      <div v-if="parsed.subtitle" class="text-center mb-4 px-timeline-sub" v-html="parsed.subtitle" />

      <!-- Level grid — SMB3 style boxes -->
      <div v-if="parsed.entries.length" class="px-level-grid">
        <div
          v-for="(entry, i) in parsed.entries"
          :key="i"
          class="px-level-box"
          :style="{
            background: 'var(--color-card)',
            border: '4px solid var(--color-border)',
            boxShadow: '4px 4px 0 var(--pixel-shadow)',
            imageRendering: 'pixelated',
          }"
        >
          <!-- Level number badge with star for completed -->
          <div class="level-number-wrap">
            <span class="level-star" v-if="i < parsed.entries.length - 1">★</span>
            <span class="level-star empty" v-else>☆</span>
            <span class="level-number">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>

          <!-- Level date/header -->
          <div class="level-header">{{ entry.date }}</div>

          <!-- Level content -->
          <div class="level-content">{{ entry.content }}</div>

          <!-- Level progress bar (filled for completed) -->
          <div class="level-progress">
            <div
              class="level-progress-fill"
              :style="{
                width: i < parsed.entries.length - 1 ? '100%' : `${30 + i * 15}%`,
                background: i < parsed.entries.length - 1 ? 'var(--color-accent)' : 'var(--color-h1-from)',
              }"
            />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <p v-if="!parsed.entries.length && !parsed.subtitle" class="px-timeline-empty">
        — NO LEVELS —
      </p>

      <!-- After text -->
      <div v-if="parsed.afterText" class="text-center mt-4 px-timeline-after" v-html="parsed.afterText" />
    </div>
  </div>
</template>

<style scoped>
.px-timeline {
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

.pixel-level-bg {
  background-image: radial-gradient(var(--pixel-bg-grid) 1px, transparent 1px);
  background-size: 24px 24px;
  image-rendering: pixelated;
  opacity: 0.6;
}

.pixel-level-frame {
  border: 4px solid var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 6px var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Title bar — like level select header */
.px-timeline-titlebar {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 2rem;
  border: 4px solid var(--pixel-shadow);
  box-shadow: 4px 4px 0 var(--pixel-shadow);
}
.tl-title-icon {
  font-family: monospace;
  color: var(--color-accent-foreground);
  font-size: 0.9rem;
}
.tl-title-text {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-accent-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
  line-height: 1.2;
}

/* Subtitle */
.px-timeline-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

/* Level grid — auto-flow grid of level boxes */
.px-level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
  justify-content: center;
}

/* Each level box */
.px-level-box {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.1s ease;
}
.px-level-box:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--pixel-shadow) !important;
}

/* Level number with star badge */
.level-number-wrap {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.35rem;
}
.level-star {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--color-accent);
}
.level-star.empty {
  color: var(--pixel-shadow);
  opacity: 0.4;
}
.level-number {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.9);
  font-weight: 700;
  color: var(--color-heading);
  image-rendering: pixelated;
}

/* Level header (date) */
.level-header {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.7);
  font-weight: 600;
  color: var(--color-accent);
  image-rendering: pixelated;
  margin-bottom: 0.25rem;
  line-height: 1.3;
  word-break: break-word;
}

/* Level content */
.level-content {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.65);
  color: var(--color-foreground);
  image-rendering: pixelated;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  word-break: break-word;
  flex: 1;
}

/* Progress bar at bottom of each level box */
.level-progress {
  width: 100%;
  height: 6px;
  background: var(--color-muted);
  border: 2px solid var(--color-border);
  image-rendering: pixelated;
  margin-top: auto;
}
.level-progress-fill {
  height: 100%;
  image-rendering: pixelated;
  transition: width 1s ease-out;
}

/* Empty state */
.px-timeline-empty {
  text-align: center;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  color: var(--color-muted-foreground);
  image-rendering: pixelated;
  font-size: var(--fs-body-sm);
  letter-spacing: 0.2em;
}

/* After text */
.px-timeline-after :deep(p) {
  font-size: var(--fs-caption);
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
</style>
