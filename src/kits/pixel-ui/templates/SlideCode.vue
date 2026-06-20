<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <!-- NES Password Entry Screen — code in bordered box with character grid spacing -->
  <div class="px-code flex items-center justify-center w-full h-full" :style="{ background: '#282a36' }">
    <!-- CRT scanline -->
    <div class="absolute inset-0 pointer-events-none pixel-scanline" />

    <!-- Password screen frame — darker background with glowing border -->
    <div class="absolute inset-4 pointer-events-none pixel-password-frame" />

    <!-- Decorative pixel border corners -->
    <div class="absolute top-8 left-8 pointer-events-none pixel-pw-corner">
      <span class="pw-cchar c1">┏</span><span class="pw-cchar c2">━</span><span class="pw-cchar c2">━</span><span class="pw-cchar c1">┓</span>
    </div>
    <div class="absolute top-8 right-8 pointer-events-none pixel-pw-corner">
      <span class="pw-cchar c1">┏</span><span class="pw-cchar c2">━</span><span class="pw-cchar c2">━</span><span class="pw-cchar c1">┓</span>
    </div>
    <div class="absolute bottom-8 left-8 pointer-events-none pixel-pw-corner">
      <span class="pw-cchar c1">┗</span><span class="pw-cchar c2">━</span><span class="pw-cchar c2">━</span><span class="pw-cchar c1">┛</span>
    </div>
    <div class="absolute bottom-8 right-8 pointer-events-none pixel-pw-corner">
      <span class="pw-cchar c1">┗</span><span class="pw-cchar c2">━</span><span class="pw-cchar c2">━</span><span class="pw-cchar c1">┛</span>
    </div>

    <div class="relative z-10 w-full max-w-4xl px-10">
      <!-- Password window — like Mega Man / Metroid password screen -->
      <div class="px-password-window" :style="{
        background: '#282a36',
        border: '4px solid var(--color-accent)',
        boxShadow: '6px 6px 0 var(--pixel-shadow)',
        imageRendering: 'pixelated',
      }">
        <!-- Password title bar -->
        <div class="px-password-titlebar" :style="{
          background: 'var(--color-accent)',
          borderBottom: '4px solid var(--pixel-shadow)',
          imageRendering: 'pixelated',
          padding: '0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }">
          <span class="pw-title-icon">▀</span>
          <span class="pw-title-label">PASSWORD</span>
          <span class="pw-title-icon">▀</span>
        </div>

        <!-- Password grid area -->
        <div class="px-password-body" :style="{
          padding: '1.5rem 2rem',
          imageRendering: 'pixelated',
        }">
          <!-- Password character grid background dots -->
          <div class="px-pw-grid">
            <span v-for="r in 6" :key="'r'+r" class="pw-row">
              <span v-for="c in 8" :key="'c'+c" class="pw-cell">
                <span class="pw-dot" />
              </span>
            </span>
          </div>

          <!-- Code content overlay -->
          <div v-html="slide.html" class="px-code-prose" />
        </div>

        <!-- Bottom decoration — password cursor -->
        <div class="px-password-footer" :style="{
          background: 'var(--color-muted)',
          borderTop: '4px solid var(--color-border)',
          imageRendering: 'pixelated',
          padding: '0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }">
          <span class="pw-header-label">SELECT LETTER</span>
          <span class="pw-cursor">█</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-code {
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

.pixel-password-frame {
  border: 3px solid var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-code-bg), 0 0 0 5px var(--pixel-shadow);
  image-rendering: pixelated;
  opacity: 0.3;
}

/* Corner chars */
.pixel-pw-corner {
  font-family: monospace;
  font-size: 1rem;
  line-height: 1;
  opacity: 0.3;
}
.pw-cchar.c1 { color: var(--color-accent); }
.pw-cchar.c2 { color: var(--pixel-shadow); }

/* Password window */
.px-password-window {
  overflow: hidden;
}

.px-password-titlebar .pw-title-icon {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--color-accent-foreground);
  opacity: 0.5;
}
.px-password-titlebar .pw-title-label {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: var(--fs-caption);
  color: var(--color-accent-foreground);
  letter-spacing: 0.25em;
  image-rendering: pixelated;
}

/* Password body */
.px-password-body {
  position: relative;
}

/* Background grid dots */
.px-pw-grid {
  position: absolute;
  inset: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
  opacity: 0.08;
}
.pw-row {
  display: flex;
  justify-content: space-around;
  flex: 1;
}
.pw-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pw-dot {
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  image-rendering: pixelated;
}

/* Code prose */
.px-code-prose {
  position: relative;
  z-index: 1;
}
.px-code-prose :deep(h1),
.px-code-prose :deep(h2),
.px-code-prose :deep(h3),
.px-code-prose :deep(h4) {
  font-size: var(--fs-h3);
  font-weight: 700;
  color: var(--color-heading);
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  text-align: center;
  margin-bottom: 1rem;
  image-rendering: pixelated;
}
.px-code-prose :deep(pre) {
  overflow-x: auto;
  margin: 0.5rem 0;
  image-rendering: pixelated;
  padding: 1rem 1.5rem;
}
.px-code-prose :deep(code) {
  font-family: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace;
  font-size: var(--fs-caption);
  line-height: 1.7;
}
.px-code-prose :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  image-rendering: pixelated;
  margin-top: 0.75rem;
}

/* Footer */
.px-password-footer .pw-header-label {
  font-family: var(--pixel-font, 'Press Start 2P', monospace);
  font-size: calc(var(--fs-caption) * 0.8);
  color: var(--color-muted-foreground);
  letter-spacing: 0.15em;
  image-rendering: pixelated;
}
.px-password-footer .pw-cursor {
  font-family: monospace;
  font-size: 1rem;
  color: var(--color-accent);
  animation: pw-cursor-blink 0.8s step-end infinite;
}

@keyframes pw-cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
