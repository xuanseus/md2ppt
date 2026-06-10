<script setup lang="ts">
import type { Slide } from '../types/slides'
import { computed } from 'vue'

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
  <div class="slide-timeline flex flex-col items-center justify-center h-full px-14 py-12">
    <h4 v-if="slide.title" class="text-lg md:text-xl font-medium mb-3 text-center text-muted-foreground">
      {{ slide.title }}
    </h4>
    <p v-if="parsed.subtitle" class="text-sm text-muted-foreground mb-8 text-center max-w-xl">{{ parsed.subtitle }}</p>

    <div v-if="parsed.entries.length" class="timeline relative w-full max-w-2xl pl-10">
      <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
      <div
        v-for="(entry, i) in parsed.entries"
        :key="i"
        class="timeline-item relative pb-10 last:pb-0"
      >
        <div
          class="absolute -left-[26px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-primary ring-2 ring-primary/30"
        />
        <div class="text-sm font-semibold text-primary mb-1">{{ entry.date }}</div>
        <div class="text-base text-muted-foreground">{{ entry.content }}</div>
      </div>
    </div>
    <p v-else class="text-muted-foreground text-sm">（暂无时间线条目）</p>

    <p v-if="parsed.afterText" class="text-sm text-muted-foreground mt-6 text-center max-w-xl">{{ parsed.afterText }}</p>
  </div>
</template>
