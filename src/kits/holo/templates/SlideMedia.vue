<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-media relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景网格 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoMediaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="var(--color-accent)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoMediaGrid)" />
      </svg>
    </div>

    <!-- ============ 六边形视口框架 ============ -->
    <div class="relative z-10 holo-viewport">
      <!-- 外六边形框架 -->
      <div class="holo-viewport-frame">
        <!-- 视口内容 -->
        <div class="holo-viewport-content">
          <div v-html="slide.html" class="holo-media-prose"></div>
        </div>
      </div>

      <!-- 顶部角括号 --->
      <div class="holo-bracket holo-bracket-top-left"></div>
      <div class="holo-bracket holo-bracket-top-right"></div>

      <!-- 底部角括号 -->
      <div class="holo-bracket holo-bracket-bottom-left"></div>
      <div class="holo-bracket holo-bracket-bottom-right"></div>

      <!-- 左右中点标记 -->
      <div class="holo-mid-marker holo-mid-left"></div>
      <div class="holo-mid-marker holo-mid-right"></div>

      <!-- 顶部标签 -->
      <div class="holo-viewport-label top">
        <span class="holo-label-diamond"></span>
        <span class="holo-label-text">VIEWPORT</span>
        <span class="holo-label-diamond"></span>
      </div>

      <!-- 底部标签 -->
      <div class="holo-viewport-label bottom">
        <span class="holo-label-text dim">FRAME-LOCK</span>
        <span class="holo-label-sep">::</span>
        <span class="holo-label-text dim">RES:4K</span>
      </div>
    </div>

    <!-- ============ 扫描线覆盖 ============ -->
    <div class="absolute inset-0 pointer-events-none z-20 holo-scan-overlay"></div>
  </div>
</template>

<style scoped>
/* ===== 六边形视口 ===== */
.holo-viewport {
  width: 85vw;
  height: 75vh;
  position: relative;
}

/* ===== 外六边形框架 ===== */
.holo-viewport-frame {
  width: 100%;
  height: 100%;
  clip-path: polygon(
    10% 0%, 90% 0%, 100% 15%, 100% 85%,
    90% 100%, 10% 100%, 0% 85%, 0% 15%
  );
  background: var(--color-card);
  border: none;
  position: relative;
  box-shadow: 0 0 50px color-mix(in srgb, var(--color-accent) 6%, transparent);
}

.holo-viewport-frame::before {
  content: '';
  position: absolute;
  inset: 1px;
  clip-path: polygon(
    10% 0%, 90% 0%, 100% 15%, 100% 85%,
    90% 100%, 10% 100%, 0% 85%, 0% 15%
  );
  border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
  pointer-events: none;
  z-index: 2;
}

/* ===== 视口内容 ===== */
.holo-viewport-content {
  position: absolute;
  inset: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ===== 角括号 ===== */
.holo-bracket {
  position: absolute;
  width: 32px;
  height: 32px;
  pointer-events: none;
  z-index: 3;
}

.holo-bracket-top-left {
  top: -2px;
  left: calc(10% - 1px);
  border-top: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
  opacity: 0.5;
}

.holo-bracket-top-right {
  top: -2px;
  right: calc(10% - 1px);
  border-top: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
  opacity: 0.5;
}

.holo-bracket-bottom-left {
  bottom: -2px;
  left: calc(10% - 1px);
  border-bottom: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
  opacity: 0.5;
}

.holo-bracket-bottom-right {
  bottom: -2px;
  right: calc(10% - 1px);
  border-bottom: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
  opacity: 0.5;
}

/* ===== 中点标记 ===== */
.holo-mid-marker {
  position: absolute;
  top: 50%;
  width: 24px;
  height: 2px;
  background: var(--color-accent);
  opacity: 0.25;
  z-index: 3;
  pointer-events: none;
}

.holo-mid-left {
  left: -8px;
  transform: translateY(-50%);
}

.holo-mid-right {
  right: -8px;
  transform: translateY(-50%);
}

/* ===== 视口标签 ===== */
.holo-viewport-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 3;
  pointer-events: none;
}

.holo-viewport-label.top {
  top: -24px;
}

.holo-viewport-label.bottom {
  bottom: -24px;
}

.holo-label-diamond {
  width: 5px;
  height: 5px;
  background: var(--color-accent);
  transform: rotate(45deg);
  opacity: 0.4;
}

.holo-label-text {
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  letter-spacing: 0.2em;
}

.holo-label-text.dim {
  color: var(--color-muted-foreground);
  opacity: 0.4;
}

.holo-label-sep {
  font-size: 0.45rem;
  color: var(--color-accent);
  opacity: 0.2;
}

/* ===== 扫描线覆盖 ===== */
.holo-scan-overlay {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    color-mix(in srgb, var(--color-accent) 2%, transparent) 2px,
    color-mix(in srgb, var(--color-accent) 2%, transparent) 4px
  );
  animation: holo-scan-move 8s linear infinite;
}

@keyframes holo-scan-move {
  0% { background-position: 0 0; }
  100% { background-position: 0 100px; }
}

/* ===== 媒体内容 ===== */
.holo-media-prose :deep(video) {
  width: 90%;
  height: auto;
  max-height: 65vh;
  object-fit: contain;
  display: block;
}

.holo-media-prose :deep(img) {
  max-width: 90%;
  max-height: 65vh;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

.holo-media-prose :deep(p) {
  text-align: center;
  font-size: var(--fs-caption);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
}
</style>
