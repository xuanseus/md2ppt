<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-section relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景辐射线 ============ -->
    <div class="absolute top-1/2 left-1/2 pointer-events-none" style="width: 0; height: 0; opacity: 0.04;">
      <div v-for="n in 36" :key="n" class="holo-radial-line" :style="{
        transform: `rotate(${n * 10}deg) translateY(-50vh)`,
      }"></div>
    </div>

    <!-- ============ 中央全息环 - 外层轨道 ============ -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <!-- 外环 1：旋转 -->
      <div class="holo-ring holo-ring-1"></div>
      <!-- 外环 2：反向旋转 -->
      <div class="holo-ring holo-ring-2"></div>
      <!-- 外环 3：脉动 -->
      <div class="holo-ring holo-ring-3"></div>
      <!-- 六边形内核 -->
      <div class="holo-hex-core">
        <div class="holo-hex-inner">
          <span class="holo-chapter-num">{{ String(slide.index + 1).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>

    <!-- ============ 轨道上的章节号（散布在环上） ============ -->
    <div class="absolute top-1/2 left-1/2 pointer-events-none holo-orbit-group">
      <span class="holo-orbit-num" style="--orbit-angle: 0deg; --orbit-dist: 150px;">{{ String(slide.index + 1).padStart(2, '0') }}</span>
      <span class="holo-orbit-num" style="--orbit-angle: 45deg; --orbit-dist: 150px; opacity: 0.3">S</span>
      <span class="holo-orbit-num" style="--orbit-angle: 90deg; --orbit-dist: 150px; opacity: 0.2">E</span>
      <span class="holo-orbit-num" style="--orbit-angle: 135deg; --orbit-dist: 150px; opacity: 0.3">C</span>
      <span class="holo-orbit-num" style="--orbit-angle: 180deg; --orbit-dist: 150px; opacity: 0.2">T</span>
      <span class="holo-orbit-num" style="--orbit-angle: 225deg; --orbit-dist: 150px; opacity: 0.25">I</span>
      <span class="holo-orbit-num" style="--orbit-angle: 270deg; --orbit-dist: 150px; opacity: 0.2">O</span>
      <span class="holo-orbit-num" style="--orbit-angle: 315deg; --orbit-dist: 150px; opacity: 0.25">N</span>
    </div>

    <!-- ============ 标题（环下方） ============ -->
    <div class="absolute z-10 text-center" style="top: 62%; left: 50%; transform: translateX(-50%); width: 80%; max-width: 800px;">
      <h2 v-if="slide.title" class="holo-section-title">{{ slide.title }}</h2>
      <div class="holo-section-beam"></div>
      <div v-if="slide.html" v-html="slide.html" class="holo-section-sub"></div>
    </div>

    <!-- ============ 顶部/底部扫描线 ============ -->
    <div class="absolute top-[15%] left-0 w-full h-px pointer-events-none holo-top-scan"></div>
    <div class="absolute bottom-[15%] left-0 w-full h-px pointer-events-none holo-bot-scan"></div>
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

/* ===== 全息环 ===== */
.holo-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid transparent;
}

.holo-ring-1 {
  width: 220px;
  height: 220px;
  margin: -110px 0 0 -110px;
  border-top-color: var(--color-accent);
  border-right-color: var(--color-accent);
  opacity: 0.25;
  animation: holo-ring-spin 12s linear infinite;
}

.holo-ring-2 {
  width: 180px;
  height: 180px;
  margin: -90px 0 0 -90px;
  border-bottom-color: var(--color-h1-to);
  border-left-color: var(--color-h1-to);
  opacity: 0.2;
  animation: holo-ring-spin-reverse 8s linear infinite;
}

.holo-ring-3 {
  width: 260px;
  height: 260px;
  margin: -130px 0 0 -130px;
  border: 1px dashed color-mix(in srgb, var(--color-accent) 20%, transparent);
  opacity: 0.35;
  animation: holo-ring-pulse 3s ease-in-out infinite;
}

/* ===== 六边形内核 ===== */
.holo-hex-core {
  width: 100px;
  height: 115px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 15%, transparent);
}

.holo-hex-inner {
  width: 60px;
  height: 69px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: color-mix(in srgb, var(--color-accent) 20%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.holo-chapter-num {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  text-shadow: var(--holo-glow);
}

/* ===== 轨道字符 ===== */
.holo-orbit-group {
  width: 0;
  height: 0;
  animation: holo-orbit-rotate 20s linear infinite;
}
.holo-orbit-num {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  text-shadow: var(--holo-glow);
  transform: translate(
    calc(cos(var(--orbit-angle)) * var(--orbit-dist)),
    calc(sin(var(--orbit-angle)) * var(--orbit-dist))
  ) translate(-50%, -50%);
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
}

.holo-section-beam {
  width: 60px;
  height: 3px;
  margin: 1rem auto;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
}

/* ===== 副标题 ===== */
.holo-section-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
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
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes holo-ring-spin-reverse {
  from { transform: translate(-50%, -50%) rotate(360deg); }
  to { transform: translate(-50%, -50%) rotate(0deg); }
}
@keyframes holo-ring-pulse {
  0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.05); }
}
@keyframes holo-orbit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
