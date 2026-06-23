<script setup lang="ts">
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const icon = (props.slide.rawMd.match(/\{icon:\s*(\S+)\}/i) || [])[1] || '◆'
</script>

<template>
  <div class="holo-section-icon relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景辐射线 ============ -->
    <div class="absolute top-1/2 left-1/2 pointer-events-none" style="width: 0; height: 0; opacity: 0.04;">
      <div v-for="n in 36" :key="n" class="holo-radial-line" :style="{
        transform: `rotate(${n * 10}deg) translateY(-50vh)`,
      }"></div>
    </div>

    <!-- ============ 标题 + 环绕环圈 ============ -->
    <div class="relative z-10 flex items-center justify-center" style="min-width: 50vw; min-height: 50vh;">
      <!-- 环圈围绕文字 -->
      <div class="holo-rings-wrapper">
        <div class="holo-ring holo-ring-1"></div>
        <div class="holo-ring holo-ring-2"></div>
        <div class="holo-ring holo-ring-3"></div>
      </div>

      <!-- 标题文字（在环圈上层） -->
      <div class="relative z-10 text-center px-8">
        <!-- 图标 -->
        <div class="holo-section-icon-display">{{ icon }}</div>
        <!-- 标题 -->
        <h2 v-if="slide.title" class="holo-section-title">{{ slide.title }}</h2>
        <div class="holo-section-beam"></div>
        <div v-if="slide.html" v-html="slide.html" class="holo-section-sub"></div>
      </div>
    </div>

    <!-- ============ 顶部/底部扫描线 ============ -->
    <div class="absolute top-[12%] left-0 w-full h-px pointer-events-none holo-top-scan"></div>
    <div class="absolute bottom-[12%] left-0 w-full h-px pointer-events-none holo-bot-scan"></div>
  </div>
</template>

<style scoped>
/* ===== 辐射线 ===== */
.holo-radial-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 100vh;
  background: linear-gradient(180deg, var(--color-accent) 0%, transparent 70%);
  transform-origin: center top;
}

/* ===== 环圈容器 ===== */
.holo-rings-wrapper {
  position: absolute;
  inset: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 0;
}

/* ===== 全息环 ===== */
.holo-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid transparent;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.holo-ring-1 {
  width: min(52vw, 480px);
  height: min(52vw, 480px);
  border-top-color: var(--color-accent);
  border-right-color: var(--color-accent);
  opacity: 0.2;
  animation: holo-ring-spin 14s linear infinite;
}

.holo-ring-2 {
  width: min(42vw, 380px);
  height: min(42vw, 380px);
  border-bottom-color: var(--color-h1-to);
  border-left-color: var(--color-h1-to);
  opacity: 0.18;
  animation: holo-ring-spin-reverse 9s linear infinite;
}

.holo-ring-3 {
  width: min(62vw, 560px);
  height: min(62vw, 560px);
  border: 1px dashed color-mix(in srgb, var(--color-accent) 18%, transparent);
  opacity: 0.3;
  animation: holo-ring-pulse 4s ease-in-out infinite;
}

/* ===== 图标 ===== */
.holo-section-icon-display {
  font-size: 5rem;
  color: var(--color-accent);
  opacity: 0.4;
  margin-bottom: 0.5rem;
  text-shadow: var(--holo-glow);
  line-height: 1;
}

/* ===== 标题 ===== */
.holo-section-title {
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.15;
  font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
  position: relative;
  z-index: 10;
}

.holo-section-beam {
  width: 60px;
  height: 3px;
  margin: 1rem auto;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
  position: relative;
  z-index: 10;
}

/* ===== 副标题 ===== */
.holo-section-sub :deep(h1),
.holo-section-sub :deep(h2),
.holo-section-sub :deep(h3),
.holo-section-sub :deep(h4) {
  display: none;
}

.holo-section-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
  position: relative;
  z-index: 10;
}

/* ===== 扫描线 ===== */
.holo-top-scan {
  background: linear-gradient(90deg, transparent 5%, var(--color-accent) 50%, transparent 95%);
  opacity: 0.15;
}
.holo-bot-scan {
  background: linear-gradient(90deg, transparent 5%, var(--color-accent) 50%, transparent 95%);
  opacity: 0.1;
}

/* ===== 动画 ===== */
@keyframes holo-ring-spin {
  from { rotate: 0deg; }
  to { rotate: 360deg; }
}
@keyframes holo-ring-spin-reverse {
  from { rotate: 360deg; }
  to { rotate: 0deg; }
}
@keyframes holo-ring-pulse {
  0%, 100% { opacity: 0.2; scale: 1; }
  50% { opacity: 0.4; scale: 1.06; }
}
</style>
