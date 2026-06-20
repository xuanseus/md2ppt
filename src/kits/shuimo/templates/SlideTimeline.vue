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
  <div class="sm-timeline w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 — 右侧一小团 -->
    <div class="absolute right-[10%] top-[30%] w-40 h-40 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 标题区 — 左上方 -->
    <div v-if="slide.title" class="absolute z-20" style="top: 8%; left: 16%;">
      <h2 style="font-size: var(--fs-h2); font-weight: 700; color: var(--color-heading); font-family: 'Noto Serif SC', 'STSong', Georgia, serif; letter-spacing: 0.08em;">
        {{ slide.title }}
      </h2>
      <div class="w-16 h-px mt-2 opacity-20"
        style="background: linear-gradient(90deg, var(--color-foreground), transparent)" />
    </div>

    <div v-if="parsed.subtitle" class="absolute z-20" style="top: 20%; left: 16%; font-size: var(--fs-body-sm); color: var(--color-muted-foreground); font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif; opacity: 0.5;" v-html="parsed.subtitle" />

    <!-- 时间线布局：条目向左扇出 + 右侧竖线轨道 -->
    <div class="sm-timeline-layout">
      <!-- 右侧竖直时间线轨道 -->
      <div class="sm-timeline-track">
        <!-- 墨线 -->
        <div class="sm-timeline-line" />
        <!-- 顶部印章 -->
        <div class="sm-timeline-top-seal">纪</div>
        <!-- 底部落款 -->
        <div class="sm-timeline-bottom-mark" />
      </div>

      <!-- 条目区域 — 从右向左扇出 -->
      <div class="sm-timeline-entries">
        <div
          v-for="(entry, i) in parsed.entries"
          :key="i"
          class="sm-timeline-entry"
          :style="{ marginRight: (parsed.entries.length - i) * 0.8 + 'rem' }"
        >
          <!-- 连接线 — 从条目右边缘伸向时间线 -->
          <div class="sm-timeline-connector">
            <span class="sm-timeline-dot" />
            <span class="sm-timeline-wire" />
          </div>

          <!-- 条目卡片 -->
          <div class="sm-timeline-card">
            <div class="sm-timeline-date">{{ entry.date }}</div>
            <div class="sm-timeline-content">{{ entry.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="!parsed.entries.length && !parsed.subtitle" class="absolute inset-0 flex items-center justify-center"
      style="color: var(--color-muted-foreground); font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif; opacity: 0.4;">
      （暂无时间线条目）
    </p>

    <div v-if="parsed.afterText" class="absolute z-20" style="bottom: 2%; left: 16%; font-size: var(--fs-caption); color: var(--color-muted-foreground); font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif; opacity: 0.4;" v-html="parsed.afterText" />
  </div>
</template>

<style scoped>
.sm-timeline {
  padding: 1.5rem;
}

.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

/* 时间线整体布局 — 条目区 + 右侧轨道 */
.sm-timeline-layout {
  position: absolute;
  inset: 14% 8% 8% 16%;
  display: flex;
  flex-direction: row-reverse; /* 轨道在右，条目在左 */
}

/* 右侧时间轨道 */
.sm-timeline-track {
  width: 60px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sm-timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg,
    transparent 0%,
    var(--color-foreground) 10%,
    var(--color-foreground) 90%,
    transparent 100%
  );
  opacity: 0.12;
}

.sm-timeline-top-seal {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-seal);
  color: var(--color-seal);
  font-size: 0.55rem;
  font-family: 'KaiTi', 'STKaiti', serif;
  transform: rotate(-4deg);
  opacity: 0.35;
  z-index: 2;
  margin-top: -4px;
}

.sm-timeline-bottom-mark {
  margin-top: auto;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  opacity: 0.1;
  background: var(--color-foreground);
  margin-bottom: -4px;
}

/* 条目区域 — 居左 */
.sm-timeline-entries {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
  padding-right: 1.5rem;
}

/* 单个条目 — 连接线 + 卡片 */
.sm-timeline-entry {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 0.8rem;
}

/* 连接线 */
.sm-timeline-connector {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sm-timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  transform: rotate(45deg);
  background: var(--color-seal);
  opacity: 0.5;
  flex-shrink: 0;
}

.sm-timeline-wire {
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, var(--color-seal), transparent);
  opacity: 0.15;
}

/* 条目卡片 */
.sm-timeline-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  padding: 0.75rem 1.25rem;
  border-radius: 2px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.03);
  /* 不规则效果 */
  border-left-width: 3px;
  border-left-color: var(--color-ink-wash);
  clip-path: polygon(
    0% 0%, 98% 1%, 100% 4%, 99% 100%, 1% 98%, 0% 100%
  );
}

.sm-timeline-date {
  font-size: var(--fs-caption);
  font-weight: 600;
  color: var(--color-seal);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', serif;
  margin-bottom: 0.15rem;
  letter-spacing: 0.04em;
}

.sm-timeline-content {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  line-height: 1.6;
}
</style>
