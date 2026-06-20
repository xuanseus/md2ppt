<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface TimelineEntry {
  date: string
  content: string
}

const parsed = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()

  const entries: TimelineEntry[] = []
  const beforeText: string[] = []
  const afterText: string[] = []
  let hitItems = false

  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/)
    if (m) {
      hitItems = true
      entries.push({ date: m[1], content: m[2] })
      continue
    }
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('-')) {
      if (hitItems) afterText.push(trimmed)
      else beforeText.push(trimmed)
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, entries, afterText: after }
})
</script>

<template>
  <div class="holo-timeline relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景坐标网格 ============ -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" style="opacity: 0.025;">
      <defs>
        <pattern id="holoTimelineGridH" width="80" height="80" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="80" y2="80" stroke="var(--color-accent)" stroke-width="0.5"/>
          <line x1="80" y1="0" x2="0" y2="80" stroke="var(--color-accent)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#holoTimelineGridH)" />
    </svg>

    <!-- ============ 全局标题 ============ -->
    <div class="absolute z-10" style="top: 8%; left: 50%; transform: translateX(-50%);">
      <h2 v-if="slide.title" class="holo-timeline-title">{{ slide.title }}</h2>
      <div v-if="parsed.subtitle" v-html="parsed.subtitle" class="holo-timeline-sub"></div>
    </div>

    <!-- ============ 水平时间轴 ============ -->
    <div class="relative z-10 w-full px-12" style="max-width: 1000px; margin-top: 40px;">
      <!-- 主时间轨道 -->
      <div class="holo-timeline-track-wrapper">
        <!-- 轨道线 -->
        <div class="holo-timeline-track">
          <div class="holo-track-glow"></div>
          <div class="holo-track-dashes"></div>
        </div>

        <!-- 节点和卡片 -->
        <div class="holo-timeline-nodes">
          <div
            v-for="(entry, i) in parsed.entries"
            :key="i"
            class="holo-timeline-node-group"
            :class="{ 'holo-node-above': i % 2 === 0, 'holo-node-below': i % 2 !== 0 }"
          >
            <!-- 投影光束（节点到卡片） -->
            <div class="holo-projection-beam" :class="{ 'beam-up': i % 2 === 0, 'beam-down': i % 2 !== 0 }"></div>

            <!-- 节点圆点 -->
            <div class="holo-node-dot">
              <div class="holo-node-inner"></div>
              <div class="holo-node-ripple"></div>
            </div>

            <!-- 信息卡片 -->
            <div class="holo-node-card" :class="{ 'card-above': i % 2 === 0, 'card-below': i % 2 !== 0 }">
              <div class="holo-card-date">{{ entry.date }}</div>
              <div class="holo-card-content">{{ entry.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ 空状态 ============ -->
    <div v-if="!parsed.entries.length && !parsed.subtitle" class="absolute z-10" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
      <span class="holo-empty-state">[ NO CHRONO-DATA ]</span>
    </div>

    <!-- ============ 尾部文字 ============ -->
    <div v-if="parsed.afterText" class="absolute z-10" style="bottom: 16%; left: 50%; transform: translateX(-50%);" v-html="parsed.afterText"></div>
  </div>
</template>

<style scoped>
/* ===== 标题 ===== */
.holo-timeline-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
  text-align: center;
}

.holo-timeline-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin-top: 0.25rem;
}

/* ===== 时间轨道包裹 ===== */
.holo-timeline-track-wrapper {
  position: relative;
  height: 280px;
  width: 100%;
}

/* ===== 轨道线 ===== */
.holo-timeline-track {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
}

.holo-track-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, var(--color-accent) 30%, var(--color-accent) 70%, transparent 100%);
  opacity: 0.3;
}

.holo-track-dashes {
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

/* ===== 节点组 ===== */
.holo-timeline-nodes {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.holo-timeline-node-group {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
}

/* ===== 投影光束 ===== */
.holo-projection-beam {
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
.holo-node-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  z-index: 3;
}

.holo-node-inner {
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

.holo-node-ripple {
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

/* ===== 信息卡片 ===== */
.holo-node-card {
  position: absolute;
  width: 180px;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 1px solid var(--color-border);
  clip-path: polygon(
    0 6px, 6px 0, 100% 0, 100% calc(100% - 6px),
    calc(100% - 6px) 100%, 0 100%
  );
  z-index: 5;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.holo-node-card:hover {
  box-shadow: var(--holo-border-glow);
}

.card-above {
  bottom: 52%;
  left: 50%;
  transform: translateX(-50%);
}

.card-below {
  top: 52%;
  left: 50%;
  transform: translateX(-50%);
}

.holo-card-date {
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

.holo-card-content {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.5;
  text-align: center;
}

/* ===== 空状态 ===== */
.holo-empty-state {
  font-size: var(--fs-body);
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  opacity: 0.4;
}

.holo-timeline :deep(.holo-after-text p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
}
</style>
