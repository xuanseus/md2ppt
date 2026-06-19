<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-stats relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 圆形扫描背景 ============ -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div class="holo-scan-circle"></div>
      <div class="holo-scan-circle delay"></div>
      <div class="holo-scan-circle delay2"></div>
    </div>

    <!-- ============ 目标准星（四角） ============ -->
    <div class="absolute pointer-events-none holo-target-corners">
      <div class="holo-target-corner tl"></div>
      <div class="holo-target-corner tr"></div>
      <div class="holo-target-corner bl"></div>
      <div class="holo-target-corner br"></div>
    </div>

    <!-- ============ 中心主数据显示区 ============ -->
    <div class="relative z-10 holo-main-viewer">
      <!-- 数据投影框架 -->
      <div class="holo-projection-frame">
        <!-- 顶部标签 -->
        <div class="holo-proj-header">
          <span class="holo-proj-label">MAIN.VE</span>
          <span class="holo-proj-sep">::</span>
          <span class="holo-proj-label dim">DATA-STREAM-01</span>
        </div>

        <!-- 投影内容 -->
        <div v-html="slide.html" class="holo-stats-prose"></div>

        <!-- 底部扫描条 -->
        <div class="holo-proj-scanbar"></div>
      </div>
    </div>

    <!-- ============ 左侧数据读数条 ============ -->
    <div class="absolute z-10 holo-side-readout left">
      <div class="holo-readout-line" v-for="n in 6" :key="'l'+n" :style="{ opacity: 0.15 + n * 0.08 }">
        <span class="holo-readout-dash"></span>
        <span class="holo-readout-val">{{ (Math.random() * 100).toFixed(1) }}</span>
      </div>
    </div>

    <!-- ============ 右侧数据读数条 ============ -->
    <div class="absolute z-10 holo-side-readout right">
      <div class="holo-readout-line" v-for="n in 6" :key="'r'+n" :style="{ opacity: 0.15 + n * 0.08 }">
        <span class="holo-readout-val">{{ (Math.random() * 100).toFixed(1) }}</span>
        <span class="holo-readout-dash"></span>
      </div>
    </div>

    <!-- ============ 底部图例 ============ -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 holo-legend">
      <span class="holo-legend-dot"></span>
      <span class="holo-legend-text">REAL-TIME</span>
      <span class="holo-legend-dot alt"></span>
      <span class="holo-legend-text dim">TRENDING</span>
    </div>
  </div>
</template>

<style scoped>
/* ===== 扫描圆 ===== */
.holo-scan-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--color-accent) 15%, transparent);
  animation: holo-scan-expand 4s ease-out infinite;
}

.holo-scan-circle:nth-child(1) { width: 300px; height: 300px; margin: -150px 0 0 -150px; }
.holo-scan-circle:nth-child(2) { width: 300px; height: 300px; margin: -150px 0 0 -150px; animation-delay: 1.3s; }
.holo-scan-circle:nth-child(3) { width: 300px; height: 300px; margin: -150px 0 0 -150px; animation-delay: 2.6s; }

@keyframes holo-scan-expand {
  0% { transform: scale(0.8); opacity: 0.3; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* ===== 目标准星 ===== */
.holo-target-corners {
  position: absolute;
  inset: 10%;
  z-index: 5;
}

.holo-target-corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: var(--color-accent);
  opacity: 0.25;
}

.holo-target-corner.tl {
  top: 0; left: 0;
  border-top: 2px solid;
  border-left: 2px solid;
  clip-path: polygon(0 0, 100% 0, 8px 0, 0 8px, 0 100%, 0 0);
}

.holo-target-corner.tr {
  top: 0; right: 0;
  border-top: 2px solid;
  border-right: 2px solid;
  clip-path: polygon(0 0, 100% 0, 100% 8px, calc(100% - 8px) 0, 100% 0);
}

.holo-target-corner.bl {
  bottom: 0; left: 0;
  border-bottom: 2px solid;
  border-left: 2px solid;
  clip-path: polygon(0 100%, 0 0, 0 100%, 8px 100%, 100% calc(100% - 8px), 100% 100%);
}

.holo-target-corner.br {
  bottom: 0; right: 0;
  border-bottom: 2px solid;
  border-right: 2px solid;
  clip-path: polygon(100% 100%, calc(100% - 8px) 100%, 100% calc(100% - 8px), 100% 100%);
}

/* ===== 主显示器 ===== */
.holo-main-viewer {
  width: 650px;
  max-width: 70vw;
}

.holo-projection-frame {
  padding: 3rem 4rem;
  position: relative;
  border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
  clip-path: polygon(
    0 30px, 30px 0, calc(100% - 30px) 0, 100% 30px,
    100% calc(100% - 30px), calc(100% - 30px) 100%,
    30px 100%, 0 calc(100% - 30px)
  );
  background: color-mix(in srgb, var(--color-card) 70%, transparent);
  box-shadow: 0 0 60px color-mix(in srgb, var(--color-accent) 8%, transparent);
}

/* ===== 顶部标签 ===== */
.holo-proj-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.holo-proj-label {
  font-size: 0.55rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.holo-proj-label.dim {
  color: var(--color-muted-foreground);
  opacity: 0.5;
}

.holo-proj-sep {
  font-size: 0.5rem;
  color: var(--color-accent);
  opacity: 0.4;
}

/* ===== 底部扫描条 ===== */
.holo-proj-scanbar {
  width: 100%;
  height: 2px;
  margin-top: 1.5rem;
  background: linear-gradient(90deg, transparent, var(--color-accent) 30%, var(--color-accent) 70%, transparent);
  animation: holo-scanbar-pulse 2s ease-in-out infinite;
}

@keyframes holo-scanbar-pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}

/* ===== 内容样式 ===== */
.holo-stats-prose :deep(h4) {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
}

.holo-stats-prose :deep(strong) {
  display: block;
  font-size: var(--fs-stat);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1.5rem;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', monospace;
  text-shadow: var(--holo-glow);
  text-align: center;
  animation: holo-data-reveal 2s ease-out;
  /* 全息扫描线叠加 */
  position: relative;
}

.holo-stats-prose :deep(strong)::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 2px;
  background: color-mix(in srgb, var(--color-accent) 20%, transparent);
  animation: holo-scan-overlay 3s linear infinite;
}

@keyframes holo-data-reveal {
  0% { transform: scale(0.5); opacity: 0; filter: blur(8px); }
  50% { transform: scale(1.05); filter: blur(0); }
  100% { transform: scale(1); opacity: 1; filter: blur(0); }
}

@keyframes holo-scan-overlay {
  0% { top: 0%; }
  100% { top: 100%; }
}

.holo-stats-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  margin-top: 1.5rem;
  line-height: 1.7;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
}

/* ===== 侧边数据读数条 ===== */
.holo-side-readout {
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.holo-side-readout.left {
  left: 5%;
  align-items: flex-end;
}

.holo-side-readout.right {
  right: 5%;
  align-items: flex-start;
}

.holo-readout-line {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.holo-readout-dash {
  width: 16px;
  height: 1px;
  background: var(--color-accent);
}

.holo-readout-val {
  font-size: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
}

/* ===== 底部图例 ===== */
.holo-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.holo-legend-dot {
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  transform: rotate(45deg);
  box-shadow: var(--holo-glow);
}

.holo-legend-dot.alt {
  background: var(--color-h1-to);
  box-shadow: none;
  opacity: 0.4;
}

.holo-legend-text {
  font-size: 0.45rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  letter-spacing: 0.15em;
}

.holo-legend-text.dim {
  color: var(--color-muted-foreground);
  opacity: 0.5;
}
</style>
