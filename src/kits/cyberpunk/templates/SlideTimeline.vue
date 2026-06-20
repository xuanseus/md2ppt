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
  <div class="cp-timeline w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- ═══ 系统日志 + 音频波形时间轴 ═══ -->
    <div class="relative z-10 w-full h-full flex flex-col" style="padding: 1.5rem 2rem 0">

      <!-- ═══ 顶部：标题 + 日志头 ═══ -->
      <div class="cp-tl-top mb-4">
        <div class="flex items-center gap-2 mb-1">
          <span class="cp-mono text-xs" style="color: var(--color-muted-foreground)">~$ </span>
          <span class="cp-mono text-xs" style="color: var(--color-accent)">journalctl --timeline --output=verbose</span>
        </div>
        <h2 v-if="slide.title" class="cp-tl-title">{{ slide.title }}</h2>
        <div v-if="parsed.subtitle" v-html="parsed.subtitle" class="cp-tl-sub" />
      </div>

      <!-- ═══ 中间：事件卡片区域 ═══ -->
      <div class="flex-1 flex items-center justify-center overflow-visible" style="min-height: 0">
        <div class="cp-tl-cards-container">
          <div
            v-for="(entry, i) in parsed.entries"
            :key="i"
            class="cp-tl-card"
            :style="{
              animationDelay: (i * 0.2) + 's',
              left: ((i / Math.max(parsed.entries.length - 1, 1)) * 100) + '%',
            }"
          >
            <!-- 卡片连接线（延伸到下方波形） -->
            <div class="cp-tl-connector" :class="'cp-connector-' + i" />

            <!-- 卡片内容 -->
            <div class="cp-tl-card-inner">
              <div class="cp-tl-card-bracket-tl" />
              <div class="cp-tl-card-bracket-br" />
              <div class="cp-mono cp-tl-date">{{ entry.date }}</div>
              <div class="cp-mono cp-tl-content">{{ entry.content }}</div>
              <div class="cp-tl-logmeta">
                <span class="cp-mono cp-tl-logid">#{{ String(i + 1).padStart(3, '0') }}</span>
                <span class="cp-mono cp-tl-logstatus">OK</span>
              </div>
            </div>
          </div>

          <div v-if="parsed.entries.length === 0 && !parsed.subtitle" class="cp-mono cp-tl-empty">
            // NO LOG ENTRIES — journalctl: empty
          </div>
        </div>
      </div>

      <!-- ═══ 底部：音频波形进度条 ═══ -->
      <div class="cp-tl-waveform-section">
        <!-- 波形进度轨道 -->
        <div class="cp-tl-wave-track">
          <!-- 背景网格 -->
          <div class="cp-tl-grid-bg" />

          <!-- 波形条 -->
          <div class="cp-tl-wave-visual">
            <div
              v-for="n in 40"
              :key="n"
              class="cp-tl-wave-bar"
              :class="'cp-wave-bar-' + n"
              :style="{
                height: (Math.abs(Math.sin(n * 0.7)) * 55 + 10) + '%',
                background: n % 5 < 2 ? 'var(--color-accent)' : 'var(--color-h1-to)',
                boxShadow: n % 5 < 2 ? '0 0 6px var(--color-accent)' : '0 0 6px var(--color-h1-to)',
                animationDelay: (n * 0.05) + 's',
              }"
            />
          </div>

          <!-- 播放头 -->
          <div class="cp-tl-playhead">
            <div class="cp-tl-playhead-dot" />
            <div class="cp-tl-playhead-line" />
          </div>

          <!-- 时间刻度标签 — 对齐卡片位置 -->
          <div class="cp-tl-ticks">
            <div
              v-for="(entry, i) in parsed.entries"
              :key="entry.date"
              class="cp-mono cp-tl-tick-label"
              :style="{ left: ((i / Math.max(parsed.entries.length - 1, 1)) * 100) + '%' }"
            >{{ entry.date }}</div>
          </div>
        </div>

        <!-- 底部日志统计 -->
        <div class="cp-tl-stats">
          <span class="cp-mono cp-tl-stat-item">ENTRIES: {{ parsed.entries.length }}</span>
          <span class="cp-mono cp-tl-stat-divider">|</span>
          <span class="cp-mono cp-tl-stat-item">SYSLOG v2.4.1</span>
          <span class="cp-mono cp-tl-stat-divider">|</span>
          <span class="cp-mono cp-tl-stat-item cp-blink-slow" style="color: #00ff88">● LIVE</span>
        </div>
      </div>

      <div v-if="parsed.afterText" class="text-center mb-1" v-html="parsed.afterText" style="font-family: 'JetBrains Mono', monospace; font-size: var(--fs-caption); color: var(--color-muted-foreground)" />
    </div>
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px);
}

.cp-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace; }

.cp-tl-title {
  font-size: var(--fs-h2);
  font-weight: 800;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 30px var(--color-accent);
  text-transform: uppercase;
}

.cp-tl-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
}

/* ═══ 卡片容器 ═══ */
.cp-tl-cards-container {
  position: relative;
  width: 90%;
  height: 130px;
}

/* 浮动卡片 */
.cp-tl-card {
  position: absolute;
  transform: translateX(-50%);
  top: 0;
  z-index: 5;
  animation: cp-card-pop 0.5s ease-out backwards;
}

@keyframes cp-card-pop {
  0% { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.8); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

.cp-tl-card-inner {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 0.6rem 0.9rem;
  min-width: 160px;
  max-width: 220px;
  position: relative;
  box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 10%, transparent);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cp-tl-card-inner:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 25px color-mix(in srgb, var(--color-accent) 25%, transparent);
}

/* 卡片 bracket */
.cp-tl-card-bracket-tl {
  position: absolute; top: 2px; left: 2px;
  width: 8px; height: 8px;
  border-top: 1px solid var(--color-accent); border-left: 1px solid var(--color-accent);
}
.cp-tl-card-bracket-br {
  position: absolute; bottom: 2px; right: 2px;
  width: 8px; height: 8px;
  border-bottom: 1px solid var(--color-accent); border-right: 1px solid var(--color-accent);
}

/* 连接线 */
.cp-tl-connector {
  position: absolute;
  bottom: -30px;
  left: 50%;
  width: 1px;
  height: 30px;
  background: linear-gradient(180deg, var(--color-accent), transparent);
  opacity: 0.3;
}

.cp-tl-date {
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cp-tl-content {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.5;
}

.cp-tl-logmeta {
  display: flex;
  justify-content: space-between;
  margin-top: 0.35rem;
  padding-top: 0.3rem;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 30%, transparent);
}

.cp-tl-logid { font-size: 0.5rem; color: var(--color-muted-foreground); opacity: 0.5; }
.cp-tl-logstatus { font-size: 0.5rem; color: #00ff88; }

.cp-tl-empty { color: var(--color-muted-foreground); text-align: center; padding: 2rem; }

/* ═══ 底部波形 ═══ */
.cp-tl-waveform-section {
  margin-top: auto;
  padding-bottom: 0.5rem;
}

.cp-tl-wave-track {
  position: relative;
  height: 70px;
  background: color-mix(in srgb, var(--color-code-bg) 80%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.cp-tl-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent, color-mix(in srgb, var(--color-border) 20%, transparent) 1px),
    repeating-linear-gradient(90deg, transparent, transparent 4.9%, color-mix(in srgb, var(--color-border) 10%, transparent) 5%);
  opacity: 0.3;
}

.cp-tl-wave-visual {
  position: absolute;
  inset: 8px 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 2px;
}

.cp-tl-wave-bar {
  width: 4px;
  min-height: 4px;
  border-radius: 2px 2px 0 0;
  animation: cp-wave-pulse 2s ease-in-out infinite;
}

@keyframes cp-wave-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 播放头 */
.cp-tl-playhead {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}

.cp-tl-playhead-dot {
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px; height: 10px;
  background: var(--color-accent);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--color-accent), 0 0 30px color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.cp-tl-playhead-line {
  position: absolute;
  top: 6px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  background: linear-gradient(180deg, var(--color-accent), transparent);
  box-shadow: 0 0 8px var(--color-accent);
}

/* 时间刻度 */
.cp-tl-ticks {
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
}

.cp-tl-tick-label {
  position: absolute;
  font-size: 0.45rem;
  color: var(--color-muted-foreground);
  opacity: 0.4;
  transform: translateX(-50%);
}

.cp-tl-stats {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
  font-size: 0.55rem;
  color: var(--color-muted-foreground);
  opacity: 0.5;
}

.cp-tl-stat-item { font-size: 0.55rem; color: var(--color-muted-foreground); }
.cp-tl-stat-divider { font-size: 0.55rem; opacity: 0.3; }

.cp-blink-slow { animation: cp-blink-slow 2s ease-in-out infinite; }

@keyframes cp-blink-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
