<script setup lang="ts">
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const icon = (props.slide.rawMd.match(/\{icon:\s*(\S+)\}/i) || [])[1] || '✦'
</script>

<template>
  <!-- Pixel Retro section with icon — diagonal stripe BG, pixel tower, icon in bordered frame -->
  <div class="px-section-icon flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-muted)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Diagonal stripe background -->
    <div class="absolute inset-0 pointer-events-none pixel-diagonal" />

    <!-- Top & bottom solid pixel bars -->
    <div class="absolute top-0 left-0 right-0 h-3 pointer-events-none pixel-topbar" />
    <div class="absolute bottom-0 left-0 right-0 h-3 pointer-events-none pixel-bottombar" />

    <!-- Left side pixel block tower decoration -->
    <div class="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none pixel-tower">
      <div class="tower-block" /><div class="tower-block" />
      <div class="tower-block diamond" />
      <div class="tower-block" /><div class="tower-block" />
      <div class="tower-block diamond" />
      <div class="tower-block" /><div class="tower-block" />
    </div>

    <!-- Right side pixel block tower decoration -->
    <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none pixel-tower">
      <div class="tower-block" /><div class="tower-block" />
      <div class="tower-block diamond" />
      <div class="tower-block" /><div class="tower-block" />
      <div class="tower-block diamond" />
      <div class="tower-block" /><div class="tower-block" />
    </div>

    <div class="relative z-10 w-full max-w-2xl px-8 text-center">
      <!-- Icon in pixel bordered box -->
      <div class="px-icon-frame">
        <span class="px-icon">{{ icon }}</span>
      </div>

      <!-- Title -->
      <h2 v-if="slide.title" class="px-title">{{ slide.title }}</h2>

      <!-- Subtitle -->
      <div v-if="slide.html" v-html="slide.html" class="px-prose" />

      <!-- Bottom decoration — pixel arrow -->
      <div class="flex justify-center items-center gap-1 mt-8 px-arrow">
        <span class="arrow-block" />
        <span class="arrow-block" />
        <span class="arrow-tip">▶</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-section-icon {
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

/* Diagonal stripe pattern */
.pixel-diagonal {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 8px,
    var(--pixel-bg-grid) 8px,
    var(--pixel-bg-grid) 10px
  );
  opacity: 0.5;
  image-rendering: pixelated;
}

/* Top/bottom bars */
.pixel-topbar {
  background: repeating-linear-gradient(
    90deg,
    var(--color-accent),
    var(--color-accent) 12px,
    var(--pixel-shadow) 12px,
    var(--pixel-shadow) 24px
  );
  image-rendering: pixelated;
}
.pixel-bottombar {
  background: repeating-linear-gradient(
    90deg,
    var(--pixel-shadow),
    var(--pixel-shadow) 12px,
    var(--color-accent) 12px,
    var(--color-accent) 24px
  );
  image-rendering: pixelated;
}

/* Tower decorations */
.pixel-tower {
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0.15;
}
.pixel-tower .tower-block {
  width: 16px;
  height: 16px;
  background: var(--color-accent);
  image-rendering: pixelated;
}
.pixel-tower .tower-block.diamond {
  background: transparent;
  border: 4px solid var(--color-accent);
  image-rendering: pixelated;
}

/* Icon frame */
.px-icon-frame {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border: 4px solid var(--color-accent);
  box-shadow: 4px 4px 0 var(--pixel-shadow);
  image-rendering: pixelated;
  background: var(--color-background);
  margin-bottom: 1.5rem;
}
.px-icon {
  font-size: 2.5rem;
  color: var(--color-accent);
  font-family: monospace;
  line-height: 1;
}

/* Title */
.px-title {
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.2;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-shadow: 3px 3px 0 var(--pixel-shadow);
  image-rendering: pixelated;
  word-break: break-word;
}

/* Prose */
.px-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  margin-top: 1rem;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
}

/* Arrow decoration */
.px-arrow .arrow-block {
  width: 20px;
  height: 6px;
  background: var(--color-accent);
  image-rendering: pixelated;
  display: inline-block;
}
.px-arrow .arrow-tip {
  color: var(--color-accent);
  font-size: 1rem;
  font-family: monospace;
  animation: px-arrow-pulse 1s ease-in-out infinite;
}
@keyframes px-arrow-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
</style>
