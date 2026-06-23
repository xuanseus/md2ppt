<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-stats-inline relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景三角形网格 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.025]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoStatsInlineGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="var(--color-accent)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoStatsInlineGrid)" />
      </svg>
    </div>

    <!-- ============ 内容 ============ -->
    <div class="relative z-10 text-center px-8" style="max-width: 48rem; width: 90%;">
      <h3 v-if="slide.title" class="holo-si-title">{{ slide.title }}</h3>
      <div v-html="slide.html" class="holo-si-prose"></div>
    </div>

    <!-- ============ 底部扫描数据 ============ -->
    <div class="absolute bottom-4 left-4 z-10 holo-bottom-data">
      <span class="holo-data-text">STAT</span>
      <span class="holo-data-sep">::</span>
      <span class="holo-data-text">INLINE-RENDER</span>
    </div>
  </div>
</template>

<style scoped>
/* ===== 标题 ===== */
.holo-si-title {
  font-size: var(--fs-h3);
  font-weight: 600;
  text-align: center;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0 0 2rem 0;
}

/* ===== 内容 ===== */
.holo-si-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
}

.holo-si-prose :deep(strong) {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', monospace;
  text-shadow: var(--holo-glow);
  display: inline-block;
  margin: 0 0.25rem;
  animation: holo-count-pulse 2s ease-out;
  position: relative;
}

.holo-si-prose :deep(strong)::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 2px;
  background: color-mix(in srgb, var(--color-accent) 15%, transparent);
  animation: holo-scan-overlay 3s linear infinite;
}

/* ===== 底部数据 ===== */
.holo-bottom-data {
  font-size: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  gap: 0.4rem;
}

.holo-data-text {
  color: var(--color-muted-foreground);
  opacity: 0.35;
}

.holo-data-sep {
  color: var(--color-accent);
  opacity: 0.2;
}

@keyframes holo-count-pulse {
  0% { transform: scale(0.5); opacity: 0; filter: blur(8px); }
  50% { transform: scale(1.05); filter: blur(0); }
  100% { transform: scale(1); opacity: 1; filter: blur(0); }
}

@keyframes holo-scan-overlay {
  0% { top: 0%; }
  100% { top: 100%; }
}
</style>
