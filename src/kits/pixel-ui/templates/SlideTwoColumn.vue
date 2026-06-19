<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Column {
  title: string
  html: string
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
      const contentLines: string[] = []
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
          contentLines.push(t)
        }
      }
      columns.push({ title: titleMatch[1], html: marked.parse(contentLines.join('\n')) as string })
    } else {
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t) {
          if (hitColumns) afterText.push(t)
          else beforeText.push(t)
        }
      }
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2), afterText: after }
})
</script>

<template>
  <!-- NES Map + Inventory layout: two stacked horizontal panels — top 60% (map), bottom 40% (inventory) -->
  <div class="px-twocol flex flex-col w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Outer border frame around entire screen -->
    <div class="absolute inset-2 pointer-events-none pixel-outer-frame" />

    <!-- TOP PANEL (60% height) — "MAP" area, contains both column cards side-by-side -->
    <div class="px-twocol-top" :style="{ flex: '0 0 60%' }">
      <!-- Panel title bar -->
      <div class="px-panel-titlebar">
        <span class="titlebar-icon">■</span>
        <span class="titlebar-text">{{ slide.title || 'TWO COLUMN' }}</span>
        <span class="titlebar-icon">■</span>
      </div>

      <!-- Subtitle (before text) -->
      <div v-if="parsed.subtitle" class="px-twocol-subtitle-panel" v-html="parsed.subtitle" />

      <!-- Two column cards side by side inside top panel -->
      <div class="px-twocol-cards" v-if="parsed.columns.length">
        <div
          v-for="(col, i) in parsed.columns"
          :key="i"
          class="px-col-card"
          :style="{
            background: 'var(--color-card)',
            border: `4px solid ${i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'}`,
            boxShadow: '4px 4px 0 var(--pixel-shadow)',
            imageRendering: 'pixelated',
          }"
        >
          <!-- Column title bar -->
          <div class="px-col-titlebar" :style="{ borderBottom: `4px solid ${i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'}`, imageRendering: 'pixelated' }">
            <span class="col-icon">{{ i === 0 ? '◆' : '◇' }}</span>
            <span class="col-title">{{ col.title }}</span>
          </div>
          <div v-html="col.html" class="px-twocol-prose" />
        </div>
      </div>
    </div>

    <!-- BOTTOM PANEL (40% height) — "INVENTORY" area, after text -->
    <div class="px-twocol-bottom" :style="{ flex: '0 0 40%' }" v-if="parsed.columns.length">
      <!-- Panel title bar -->
      <div class="px-panel-titlebar bottom-bar">
        <span class="titlebar-icon">▀</span>
        <span class="titlebar-text">INFO</span>
        <span class="titlebar-icon">▀</span>
      </div>

      <!-- After text content -->
      <div v-if="parsed.afterText" class="px-twocol-after" v-html="parsed.afterText" />
      <div v-else class="px-twocol-after-empty">
        <span class="empty-cursor">█</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-twocol {
  position: relative;
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

.pixel-outer-frame {
  border: 4px solid var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 6px var(--pixel-shadow);
  image-rendering: pixelated;
}

/* Panel title bar — NES window title */
.px-panel-titlebar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.4rem 1rem;
  background: var(--color-accent);
  image-rendering: pixelated;
  margin: 0.5rem 0.5rem 0;
}
.px-panel-titlebar .titlebar-icon {
  font-family: monospace;
  font-size: 0.7rem;
  color: var(--color-accent-foreground);
}
.px-panel-titlebar .titlebar-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: var(--fs-caption);
  color: var(--color-accent-foreground);
  letter-spacing: 0.2em;
  image-rendering: pixelated;
}

/* Bottom info bar variant */
.px-panel-titlebar.bottom-bar {
  background: var(--color-muted);
  border: 3px solid var(--color-accent);
}
.px-panel-titlebar.bottom-bar .titlebar-icon,
.px-panel-titlebar.bottom-bar .titlebar-text {
  color: var(--color-accent);
}

/* Top panel area */
.px-twocol-top {
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
  overflow: hidden;
}

/* Subtitle in top panel */
.px-twocol-subtitle-panel {
  padding: 0.5rem 1rem 0;
  text-align: center;
}
.px-twocol-subtitle-panel :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.6;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-twocol-subtitle-panel :deep(img) {
  max-width: 100%;
  max-height: 120px;
  object-fit: contain;
  image-rendering: pixelated;
  margin: 0 auto 0.5rem;
  border: 3px solid var(--color-border);
  box-shadow: 3px 3px 0 var(--pixel-shadow);
}

/* Two column cards side-by-side */
.px-twocol-cards {
  display: flex;
  gap: 1rem;
  flex: 1;
  padding: 0.5rem 0.5rem 0;
  overflow: hidden;
}

.px-col-card {
  flex: 1;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.px-col-titlebar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}
.col-icon {
  font-family: monospace;
  font-size: 0.8rem;
  flex-shrink: 0;
}
.col-title {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-h4) * 0.9);
  font-weight: 700;
  color: var(--color-heading);
  image-rendering: pixelated;
  line-height: 1.3;
  word-break: break-word;
}

.px-twocol-prose :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.5rem;
  color: var(--color-foreground);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-twocol-prose :deep(ul),
.px-twocol-prose :deep(ol) {
  padding-left: 1rem;
  margin: 0.25rem 0;
}
.px-twocol-prose :deep(li) {
  margin-bottom: 0.3rem;
  line-height: 1.5;
  font-size: var(--fs-body-sm);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}
.px-twocol-prose :deep(li)::marker {
  color: var(--color-accent);
  font-family: monospace;
}
.px-twocol-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}

/* Bottom panel */
.px-twocol-bottom {
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem 0.5rem;
  overflow: hidden;
}

.px-twocol-after {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.7;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
  overflow: auto;
}
.px-twocol-after :deep(p) {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

.px-twocol-after-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.px-twocol-after-empty .empty-cursor {
  color: var(--color-accent);
  font-family: monospace;
  font-size: 1.5rem;
  animation: px-cursor-blink 1s step-end infinite;
}

@keyframes px-cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
