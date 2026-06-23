<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import FadeContent from '../../../components/transitions/FadeContent.vue'

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
  <div class="slide-timeline-wrapper relative flex flex-col items-center justify-center overflow-hidden h-full">
    <!-- 背景已由全局背景层提供 -->

    <!-- 内容 -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full px-14 py-12 w-full">
      <h4 v-if="slide.title" class="text-lg md:text-xl font-medium mb-3 text-center text-muted-foreground slide-animate">
        {{ slide.title }}
      </h4>
      <div v-if="parsed.subtitle" class="timeline-subtitle mb-8 text-center max-w-xl slide-animate" v-html="parsed.subtitle"></div>

      <div v-if="parsed.entries.length" class="timeline flex flex-col w-full max-w-3xl">
        <FadeContent
          v-for="(entry, i) in parsed.entries"
          :key="i"
          :blur="true"
          :duration="600"
          :delay="200 + i * 150"
          class="timeline-entry flex gap-5"
        >
          <!-- 左侧轨道：圆点 + 连接线 -->
          <div class="rail flex flex-col items-center flex-shrink-0 w-5 pt-4">
            <div class="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20 flex-shrink-0" />
            <div
              v-if="i < parsed.entries.length - 1"
              class="w-0.5 flex-1 mt-2 bg-gradient-to-b from-accent/50 to-accent/10"
            />
          </div>
          <!-- 条目卡片 -->
          <div class="glass px-5 py-3 flex-1 mb-4">
            <div class="text-sm font-semibold text-accent mb-1">{{ entry.date }}</div>
            <div class="text-base text-muted-foreground">{{ entry.content }}</div>
          </div>
        </FadeContent>
      </div>
      <p v-else class="text-muted-foreground text-sm">（暂无时间线条目）</p>

      <div v-if="parsed.afterText" class="timeline-after mt-6 text-center max-w-xl" v-html="parsed.afterText"></div>
    </div>
  </div>
</template>

<style scoped>
.slide-timeline-wrapper {
  padding: 2.5rem 3rem;  /* 旧 3rem 4rem */
}

/* 标题跟随缩放 */
.slide-timeline-wrapper :deep(h4) {
  font-size: var(--fs-h4);
}

/* 条目文字跟随缩放 */
.timeline-entry :deep(.text-sm) {
  font-size: var(--fs-caption);
}
.timeline-entry :deep(.text-base) {
  font-size: var(--fs-body-sm);
}

.timeline-subtitle :deep(img),
.timeline-after :deep(img) {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 0.75rem;
  margin: 0 auto 1rem;
}

.timeline-after :deep(p) {
  font-size: var(--fs-caption);
  color: var(--color-muted-foreground);
}
.prose-quote :deep(h1), .prose-quote :deep(h2), .prose-quote :deep(h3), .prose-quote :deep(h4), .prose-stats :deep(h1), .prose-stats :deep(h2), .prose-stats :deep(h3), .prose-stats :deep(h4), .prose-list :deep(h1), .prose-list :deep(h2), .prose-list :deep(h3), .prose-list :deep(h4), .prose-timeline :deep(h1), .prose-timeline :deep(h2), .prose-timeline :deep(h3), .prose-timeline :deep(h4), .prose-comparison :deep(h1), .prose-comparison :deep(h2), .prose-comparison :deep(h3), .prose-comparison :deep(h4), .prose-content :deep(h1), .prose-content :deep(h2) { display:none; }
</style>
