<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface TLI { date: string; content: string }
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
    const t = line.trim(); if (t && !t.startsWith('-')) before.push(t); else break
  }
  return before.length ? marked.parse(before.join('\n')) as string : ''
})
</script>

<template>
  <div class="cp-timeline w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 3rem">
      <!-- 标题 -->
      <h3 v-if="slide.title" class="cp-timeline-title">{{ slide.title }}</h3>
      <div v-if="subtitle" class="cp-timeline-sub" v-html="subtitle" />

      <!-- 时间线 -->
      <div v-if="entries.length" class="cp-timeline-track-wrap">
        <!-- 轨道 -->
        <div class="cp-timeline-track" />

        <!-- 节点 -->
        <div class="cp-timeline-nodes">
          <div v-for="(e, i) in entries" :key="i" class="cp-timeline-node">
            <!-- diamond 标记 -->
            <div class="cp-timeline-diamond" :style="{
              background: i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)',
              boxShadow: i % 2 === 0 ? '0 0 12px var(--color-accent), 0 0 24px color-mix(in srgb, var(--color-accent) 40%, transparent)' : '0 0 12px var(--color-h1-to), 0 0 24px color-mix(in srgb, var(--color-h1-to) 40%, transparent)',
            }" />
            <div class="cp-timeline-date">{{ e.date }}</div>
            <div class="cp-timeline-content">{{ e.content }}</div>
          </div>
        </div>
      </div>

      <!-- 状态标签 -->
      <div class="mt-6 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">TIMELINE::{{ entries.length }}_ENTRIES</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.05) 3px,
    rgba(0, 0, 0, 0.05) 6px
  );
}

.cp-mono {
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
}

.cp-blink-slow { animation: cp-blink-slow 2.5s ease-in-out infinite; }

@keyframes cp-blink-slow {
  0%, 100% { opacity: 1; }
  40%, 60% { opacity: 0.2; }
}

.cp-timeline-title {
  font-size: calc(1.6rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  color: var(--color-heading);
  text-shadow: 0 0 15px var(--color-accent);
  text-transform: uppercase;
}

.cp-timeline-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-timeline-track-wrap {
  position: relative;
  width: 100%;
  max-width: 64rem;
  padding: 3rem 0 1rem;
}

.cp-timeline-track {
  position: absolute;
  top: 4rem;
  left: 5%;
  right: 5%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), var(--color-h1-to), transparent);
  box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 20%, transparent);
  opacity: 0.6;
}

.cp-timeline-nodes {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.cp-timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 10rem;
}

.cp-timeline-diamond {
  width: 14px;
  height: 14px;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  margin-bottom: 0.5rem;
  animation: cp-diamond-glow 2s ease-in-out infinite;
}

@keyframes cp-diamond-glow {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.cp-timeline-date {
  font-size: var(--fs-caption);
  font-weight: 700;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 8px var(--color-accent);
}

.cp-timeline-content {
  font-size: var(--fs-small);
  color: var(--color-muted-foreground);
  line-height: 1.5;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 4px color-mix(in srgb, var(--color-accent) 5%, transparent);
}
</style>
