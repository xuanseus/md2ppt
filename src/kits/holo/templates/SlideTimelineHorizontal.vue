<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface TLI {
  date: string
  content: string
}

const entries = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const r: TLI[] = []
  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/)
    if (m) r.push({ date: m[1], content: m[2] })
  }
  return r
})

const subtitle = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const before: string[] = []
  for (const line of body.split('\n')) {
    const t = line.trim()
    if (t && !t.startsWith('-')) before.push(t)
    else break
  }
  return before.length ? marked.parse(before.join('\n')) as string : ''
})
</script>

<template>
  <div class="holo-timeline-h relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景坐标网格 ============ -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" style="opacity: 0.025;">
      <defs>
        <pattern id="holoTimelineHGrid" width="80" height="80" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="80" y2="80" stroke="var(--color-accent)" stroke-width="0.5"/>
          <line x1="80" y1="0" x2="0" y2="80" stroke="var(--color-accent)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#holoTimelineHGrid)" />
    </svg>

    <!-- ============ 全局标题 ============ -->
    <div class="absolute z-10" style="top: 6%; left: 50%; transform: translateX(-50%);">
      <h2 v-if="slide.title" class="holo-th-title">{{ slide.title }}</h2>
      <div v-if="subtitle" class="holo-th-sub" v-html="subtitle"></div>
    </div>

    <!-- ============ 水平时间轴 ============ -->
    <div class="relative z-10 w-full px-12" style="max-width: 1000px; margin-top: 40px;">
      <div v-if="entries.length" class="holo-th-track-wrapper">
        <!-- 轨道线 -->
        <div class="holo-th-track">
          <div class="holo-th-track-glow"></div>
          <div class="holo-th-track-dashes"></div>
        </div>

        <!-- 节点 -->
        <div class="holo-th-nodes">
          <div v-for="(e, i) in entries" :key="i" class="holo-th-node">
            <!-- 投影光束 -->
            <div class="holo-th-beam" :class="{ 'beam-up': i % 2 === 0, 'beam-down': i % 2 !== 0 }"></div>

            <!-- 节点圆点 -->
            <div class="holo-th-dot">
              <div class="holo-th-dot-inner"></div>
              <div class="holo-th-dot-ripple"></div>
            </div>

            <!-- 卡片 -->
            <div class="holo-th-card" :class="{ 'card-up': i % 2 === 0, 'card-down': i % 2 !== 0 }">
              <div class="holo-th-date">{{ e.date }}</div>
              <div class="holo-th-content">{{ e.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!entries.length && !subtitle" class="text-center">
        <span class="holo-empty">[ NO CHRONO-DATA ]</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 标题 ===== */
.holo-th-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
  text-align: center;
}

.holo-th-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin-top: 0.25rem;
}

/* ===== 轨道包裹 ===== */
.holo-th-track-wrapper {
  position: relative;
  height: 260px;
  width: 100%;
}

/* ===== 轨道线 ===== */
.holo-th-track {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
}

.holo-th-track-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, var(--color-accent) 30%, var(--color-accent) 70%, transparent 100%);
  opacity: 0.3;
}

.holo-th-track-dashes {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    var(--color-accent) 0px,
    var(--color-accent) 4px,
    transparent 4px,
    transparent 12px
  );
  opacity: 0.15;
}

/* ===== 节点容器 ===== */
.holo-th-nodes {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.holo-th-node {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
}

/* ===== 投影光束 ===== */
.holo-th-beam {
  position: absolute;
  left: 50%;
  width: 1px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--color-accent) 30%, transparent), var(--color-accent), color-mix(in srgb, var(--color-accent) 30%, transparent));
  transform: translateX(-50%);
  opacity: 0.3;
  animation: holo-beam-pulse 3s ease-in-out infinite;
}

.beam-up {
  top: 30%;
  height: 20%;
}

.beam-down {
  bottom: 30%;
  height: 20%;
}

@keyframes holo-beam-pulse {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.4; }
}

/* ===== 节点圆点 ===== */
.holo-th-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  z-index: 3;
}

.holo-th-dot-inner {
  width: 10px;
  height: 10px;
  background: var(--color-accent);
  transform: rotate(45deg);
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -5px 0 0 -5px;
  box-shadow: var(--holo-glow);
  z-index: 2;
}

.holo-th-dot-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border: 1px solid var(--color-accent);
  transform: rotate(45deg);
  animation: holo-node-ripple 2s ease-out infinite;
  z-index: 1;
}

@keyframes holo-node-ripple {
  0% { transform: rotate(45deg) scale(1); opacity: 0.5; }
  100% { transform: rotate(45deg) scale(2); opacity: 0; }
}

/* ===== 卡片 ===== */
.holo-th-card {
  position: absolute;
  width: 160px;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 1px solid var(--color-border);
  clip-path: polygon(
    0 6px, 6px 0, 100% 0, 100% calc(100% - 6px),
    calc(100% - 6px) 100%, 0 100%
  );
  z-index: 5;
  transition: box-shadow 0.3s ease;
}

.holo-th-card:hover {
  box-shadow: var(--holo-border-glow);
}

.card-up {
  bottom: 52%;
  left: 50%;
  transform: translateX(-50%);
}

.card-down {
  top: 52%;
  left: 50%;
  transform: translateX(-50%);
}

.holo-th-date {
  font-size: var(--fs-caption);
  font-weight: 600;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  text-shadow: var(--holo-glow);
  text-align: center;
}

.holo-th-content {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.5;
  text-align: center;
}

/* ===== 空状态 ===== */
.holo-empty {
  font-size: var(--fs-body);
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  opacity: 0.4;
}
</style>
