<script setup lang="ts">
import type { Slide } from '../types/slides'
import { computed } from 'vue'
import FadeContent from '../components/transitions/FadeContent.vue'

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

  return { subtitle: beforeText.join(' '), entries, afterText: afterText.join(' ') }
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
      <p v-if="parsed.subtitle" class="text-sm text-muted-foreground mb-8 text-center max-w-xl slide-animate">{{ parsed.subtitle }}</p>

      <div v-if="parsed.entries.length" class="timeline flex flex-col w-full max-w-2xl">
        <FadeContent
          v-for="(entry, i) in parsed.entries"
          :key="i"
          :blur="true"
          :duration="600"
          :delay="200 + i * 150"
          class="timeline-entry flex gap-5"
        >
          <!-- 左侧轨道：圆点 + 连接线 -->
          <div class="rail flex flex-col items-center flex-shrink-0 w-5 pt-3">
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

      <p v-if="parsed.afterText" class="text-sm text-muted-foreground mt-6 text-center max-w-xl">{{ parsed.afterText }}</p>
    </div>
  </div>
</template>

<style scoped>
.slide-timeline-wrapper {
  padding: 3rem 4rem;
}
</style>
