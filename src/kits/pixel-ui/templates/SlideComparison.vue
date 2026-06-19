<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Column {
  title: string
  items: string[]
}

const parsed = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()

  const columns: Column[] = []
  const beforeText: string[] = []
  const afterText: string[] = []
  let hitColumns = false

  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const titleMatch = trimmed.match(/^\*\*([^*]+)\*\*/m)
    if (titleMatch) {
      hitColumns = true
      const items: string[] = []
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        const itemMatch = t.match(/^-\s+(.+)$/)
        if (itemMatch) {
          items.push(itemMatch[1])
        } else if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
          afterText.push(t)
        }
      }
      columns.push({ title: titleMatch[1], items })
    } else {
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t) beforeText.push(t)
      }
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2), afterText: after }
})
</script>

<template>
  <!-- NES Fighting Game VS Screen — two panels facing each other, VS in center with sparkle -->
  <div class="px-comparison flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Outer battle frame -->
    <div class="absolute inset-2 pointer-events-none pixel-battle-frame" />

    <div class="relative z-10 w-full max-w-6xl px-8">
      <!-- Title banner -->
      <div v-if="slide.title" class="text-center mb-4">
        <h2 class="px-comp-title">{{ slide.title }}</h2>
        <div class="flex justify-center gap-1 mt-2">
          <span class="seg active" />
          <span class="seg" />
          <span class="seg active" />
          <span class="seg" />
          <span class="seg active" />
        </div>
      </div>

      <!-- Subtitle -->
      <div v-if="parsed.subtitle" class="text-center mb-3 px-comp-subtitle" v-html="parsed.subtitle" />

      <!-- VS Arena — two panels facing each other with VS in center -->
      <div class="px-comp-arena">
        <!-- Left panel (Player 1) -->
        <div
          v-if="parsed.columns[0]"
          class="px-comp-panel panel-left"
          :style="{
            background: 'var(--color-card)',
            border: '4px solid var(--color-accent)',
            boxShadow: '-6px 6px 0 var(--pixel-shadow)',
            imageRendering: 'pixelated',
          }"
        >
          <!-- Panel title bar -->
          <div class="panel-titlebar left-bar" :style="{ borderBottom: '4px solid var(--color-accent)', imageRendering: 'pixelated' }">
            <span class="panel-icon">◆</span>
            <span class="panel-text">{{ parsed.columns[0].title }}</span>
          </div>
          <!-- Items list -->
          <ul class="panel-items">
            <li v-for="(item, j) in parsed.columns[0].items" :key="'l'+j" class="panel-item">
              <span class="item-bullet">▸</span>
              <span class="item-text">{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- VS Center Badge — with sparkle decorations -->
        <div class="px-comp-vs-center">
          <!-- Sparkle decorations around VS -->
          <span class="vs-sparkle sparkle-tl">✦</span>
          <span class="vs-sparkle sparkle-tr">✦</span>
          <span class="vs-sparkle sparkle-bl">✦</span>
          <span class="vs-sparkle sparkle-br">✦</span>

          <div class="vs-badge" :style="{
            background: 'var(--color-accent)',
            border: '4px solid var(--pixel-shadow)',
            boxShadow: '2px 2px 0 var(--pixel-shadow)',
            imageRendering: 'pixelated',
          }">
            <span class="vs-text">VS</span>
          </div>

          <!-- Small decoration below VS -->
          <div class="vs-deco-row">
            <span class="vs-deco-dot" />
            <span class="vs-deco-dot accent" />
            <span class="vs-deco-dot" />
          </div>
        </div>

        <!-- Right panel (Player 2) -->
        <div
          v-if="parsed.columns[1]"
          class="px-comp-panel panel-right"
          :style="{
            background: 'var(--color-card)',
            border: '4px solid var(--color-h1-to)',
            boxShadow: '6px 6px 0 var(--pixel-shadow)',
            imageRendering: 'pixelated',
          }"
        >
          <!-- Panel title bar -->
          <div class="panel-titlebar right-bar" :style="{ borderBottom: '4px solid var(--color-h1-to)', imageRendering: 'pixelated' }">
            <span class="panel-icon">◇</span>
            <span class="panel-text">{{ parsed.columns[1].title }}</span>
          </div>
          <!-- Items list -->
          <ul class="panel-items">
            <li v-for="(item, j) in parsed.columns[1].items" :key="'r'+j" class="panel-item">
              <span class="item-bullet right">▸</span>
              <span class="item-text">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- After text -->
      <div v-if="parsed.afterText" class="text-center mt-4 px-comp-after" v-html="parsed.afterText" />
    </div>
  </div>
</template>

<style scoped>
.px-comparison {
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

.pixel-battle-frame {
  border: 4px solid var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 6px var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Title */
.px-comp-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 2px 2px 0 var(--pixel-shadow);
  image-rendering: pixelated;
  word-break: break-word;
}

.seg {
  width: 14px;
  height: 5px;
  background: var(--pixel-shadow);
  display: inline-block;
  image-rendering: pixelated;
}
.seg.active { background: var(--color-accent); }

.px-comp-subtitle :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

/* VS Arena — 3-column layout with VS in middle */
.px-comp-arena {
  display: flex;
  align-items: center;
  gap: 0;
}

/* Side panels */
.px-comp-panel {
  flex: 1;
  padding: 1rem 1.25rem 1.25rem;
}

/* Panel title bar */
.panel-titlebar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
}
.panel-icon {
  font-family: monospace;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.left-bar .panel-icon { color: var(--color-accent); }
.right-bar .panel-icon { color: var(--color-h1-to); }
.panel-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: var(--fs-h4);
  font-weight: 700;
  color: var(--color-heading);
  image-rendering: pixelated;
  word-break: break-word;
  line-height: 1.3;
}

/* Panel items */
.panel-items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.panel-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.35rem 0;
  font-size: var(--fs-body-sm);
  line-height: 1.6;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.item-bullet {
  flex-shrink: 0;
  color: var(--color-accent);
  font-family: monospace;
  font-size: 0.7rem;
  padding-top: 0.15rem;
}
.item-bullet.right { color: var(--color-h1-to); }
.item-text {
  color: var(--color-foreground);
}

/* VS Center */
.px-comp-vs-center {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.75rem;
}

.vs-badge {
  padding: 0.5rem 0.75rem;
  z-index: 1;
}
.vs-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(1.3rem * var(--content-scale));
  font-weight: 900;
  color: var(--color-accent-foreground);
  image-rendering: pixelated;
  line-height: 1;
}

/* Sparkle decorations */
.vs-sparkle {
  position: absolute;
  font-family: monospace;
  color: var(--color-accent);
  font-size: 0.7rem;
  animation: vs-sparkle-pulse 1.5s ease-in-out infinite;
}
@keyframes vs-sparkle-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
.sparkle-tl { top: -8px; left: 2px; animation-delay: 0s; }
.sparkle-tr { top: -8px; right: 2px; animation-delay: 0.4s; }
.sparkle-bl { bottom: 20px; left: 2px; animation-delay: 0.8s; }
.sparkle-br { bottom: 20px; right: 2px; animation-delay: 1.2s; }

/* VS deco row */
.vs-deco-row {
  display: flex;
  gap: 4px;
  margin-top: 0.25rem;
  z-index: 1;
}
.vs-deco-dot {
  width: 6px;
  height: 6px;
  background: var(--pixel-shadow);
  image-rendering: pixelated;
}
.vs-deco-dot.accent {
  background: var(--color-accent);
}

/* After text */
.px-comp-after :deep(p) {
  font-size: var(--fs-caption);
  color: var(--color-muted-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
</style>
