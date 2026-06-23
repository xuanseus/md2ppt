<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const cols = computed(() => parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i) || [])[1] || '3'))

const cards = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('|||').map(s => s.trim()).filter(Boolean).map(s => ({ html: marked.parse(s) as string }))
})
</script>

<template>
  <div class="holo-stats-grid relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
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

    <!-- ============ 统计卡片网格 ============ -->
    <div class="relative z-10" style="width: 80%; max-width: 960px;">
      <div v-if="cards.length" class="holo-stats-cards-grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
        <div v-for="(card, i) in cards" :key="i" class="holo-stat-card" :style="{ animationDelay: `${0.1 + i * 0.1}s` }" v-html="card.html" />
      </div>
      <div v-if="!cards.length" v-html="slide.html" class="holo-stats-fallback"></div>
    </div>

    <!-- ============ 底部图例 ============ -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 holo-legend">
      <span class="holo-legend-dot"></span>
      <span class="holo-legend-text">REAL-TIME</span>
      <span class="holo-legend-dot alt"></span>
      <span class="holo-legend-text dim">BENCHMARK</span>
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

.holo-scan-circle:nth-child(1) { width: 400px; height: 400px; margin: -200px 0 0 -200px; }
.holo-scan-circle:nth-child(2) { width: 400px; height: 400px; margin: -200px 0 0 -200px; animation-delay: 1.3s; }
.holo-scan-circle:nth-child(3) { width: 400px; height: 400px; margin: -200px 0 0 -200px; animation-delay: 2.6s; }

@keyframes holo-scan-expand {
  0% { transform: scale(0.8); opacity: 0.3; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* ===== 目标准星 ===== */
.holo-target-corners {
  position: absolute;
  inset: 8%;
  z-index: 5;
}

.holo-target-corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: var(--color-accent);
  opacity: 0.2;
}

.holo-target-corner.tl {
  top: 0; left: 0;
  border-top: 2px solid;
  border-left: 2px solid;
}
.holo-target-corner.tr {
  top: 0; right: 0;
  border-top: 2px solid;
  border-right: 2px solid;
}
.holo-target-corner.bl {
  bottom: 0; left: 0;
  border-bottom: 2px solid;
  border-left: 2px solid;
}
.holo-target-corner.br {
  bottom: 0; right: 0;
  border-bottom: 2px solid;
  border-right: 2px solid;
}

/* ===== 统计卡片网格 ===== */
.holo-stats-cards-grid {
  display: grid;
  gap: 2rem;
}

.holo-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  background: color-mix(in srgb, var(--color-card) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
  clip-path: polygon(
    0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px,
    100% calc(100% - 12px), calc(100% - 12px) 100%,
    12px 100%, 0 calc(100% - 12px)
  );
  box-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 6%, transparent);
  animation: holo-card-in 0.6s ease both;
  transition: box-shadow 0.3s ease;
}

.holo-stat-card:hover {
  box-shadow: var(--holo-border-glow), 0 0 50px color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.holo-stat-card :deep(strong) {
  display: block;
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', monospace;
  text-shadow: var(--holo-glow);
  margin-bottom: 0.75rem;
  animation: holo-count-pulse 2s ease-out;
  position: relative;
}

.holo-stat-card :deep(strong)::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 2px;
  background: color-mix(in srgb, var(--color-accent) 15%, transparent);
  animation: holo-scan-overlay-stats 3s linear infinite;
}

.holo-stat-card :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
}

/* ===== 回退内容 ===== */
.holo-stats-fallback {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.holo-stats-fallback :deep(h4) {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  color: var(--color-muted-foreground);
  margin-bottom: 2rem;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.holo-stats-fallback :deep(strong) {
  display: block;
  font-size: var(--fs-stat);
  font-weight: 700;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', monospace;
  text-shadow: var(--holo-glow);
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

/* ===== 动画 ===== */
@keyframes holo-card-in {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes holo-count-pulse {
  0% { transform: scale(0.5); opacity: 0; filter: blur(8px); }
  50% { transform: scale(1.05); filter: blur(0); }
  100% { transform: scale(1); opacity: 1; filter: blur(0); }
}

@keyframes holo-scan-overlay-stats {
  0% { top: 0%; }
  100% { top: 100%; }
}
</style>
