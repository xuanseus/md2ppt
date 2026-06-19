<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- NES Picture-in-Picture Window — full screen image with WINDOW title bar at top, simple border frame -->
  <div class="px-media flex items-center justify-center w-full h-full" :style="{ background: 'var(--color-background)' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Outer frame — NES screen border -->
    <div class="absolute inset-2 pointer-events-none pixel-outer-frame" />

    <!-- Window container — centered with title bar -->
    <div class="relative z-10 w-full max-w-6xl">
      <div class="px-media-window" :style="{
        imageRendering: 'pixelated',
      }">
        <!-- WINDOW title bar — NES-style drag bar -->
        <div class="px-media-titlebar" :style="{
          background: 'var(--color-accent)',
          border: '4px solid var(--pixel-shadow)',
          borderBottom: 'none',
          imageRendering: 'pixelated',
        }">
          <!-- Left title bar buttons -->
          <div class="titlebar-buttons">
            <span class="tb-btn minimize">─</span>
            <span class="tb-btn maximize">□</span>
            <span class="tb-btn close">✕</span>
          </div>
          <!-- Title text -->
          <span class="titlebar-text">WINDOW</span>
          <!-- Right decoration -->
          <span class="titlebar-deco">██</span>
        </div>

        <!-- Content frame -->
        <div class="px-media-frame" :style="{
          border: '4px solid var(--color-accent)',
          boxShadow: '6px 6px 0 var(--pixel-shadow)',
          imageRendering: 'pixelated',
          background: 'var(--color-code-bg)',
        }">
          <!-- Media content -->
          <div v-html="slide.html" class="px-media-content" />
        </div>

        <!-- Bottom status bar -->
        <div class="px-media-statusbar" :style="{
          background: 'var(--color-muted)',
          border: '4px solid var(--pixel-shadow)',
          borderTop: 'none',
          imageRendering: 'pixelated',
        }">
          <span class="status-pixel">▌</span>
          <span class="status-text">640 x 480 — 256 COLORS</span>
          <span class="status-pixel">▐</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-media {
  padding: 2rem;
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

/* WINDOW title bar — classic NES window drag bar */
.px-media-titlebar {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  gap: 0.75rem;
}

.titlebar-buttons {
  display: flex;
  gap: 4px;
}
.tb-btn {
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 0.55rem;
  line-height: 1;
  color: var(--color-accent-foreground);
  background: var(--pixel-shadow);
  border: 2px solid var(--pixel-shadow);
  image-rendering: pixelated;
  opacity: 0.7;
}
.tb-btn.minimize { border-color: var(--pixel-shadow); }
.tb-btn.maximize { border-color: var(--pixel-shadow); }
.tb-btn.close { border-color: var(--color-h1-from); background: var(--color-h1-from); }

.titlebar-text {
  flex: 1;
  text-align: center;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.8);
  color: var(--color-accent-foreground);
  letter-spacing: 0.3em;
  image-rendering: pixelated;
}

.titlebar-deco {
  font-family: monospace;
  font-size: 0.5rem;
  color: var(--color-accent-foreground);
  opacity: 0.4;
}

/* Content frame */
.px-media-frame {
  overflow: hidden;
  position: relative;
}

.px-media-content :deep(video) {
  width: 100%;
  max-height: 65vh;
  object-fit: contain;
  display: block;
}
.px-media-content :deep(img) {
  width: 100%;
  max-height: 65vh;
  display: block;
  object-fit: contain;
  image-rendering: pixelated;
}

/* Bottom status bar */
.px-media-statusbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.3rem 0.75rem;
}
.px-media-statusbar .status-pixel {
  font-family: monospace;
  font-size: 0.6rem;
  color: var(--color-accent);
  opacity: 0.4;
}
.px-media-statusbar .status-text {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.65);
  color: var(--color-muted-foreground);
  letter-spacing: 0.15em;
  image-rendering: pixelated;
}
</style>
