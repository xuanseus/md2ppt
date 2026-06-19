<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import { Card } from 'animal-island-vue'

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
  <div class="ai-timeline flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <div class="w-full max-w-3xl px-10">
      <div v-if="slide.title" class="text-center mb-6">
        <h2 style="font-size: var(--fs-h2); font-weight: 700; color: var(--color-heading); font-family: var(--animal-font-family, inherit)">
          {{ slide.title }}
        </h2>
        <div class="w-16 h-0.5 rounded-full mx-auto mt-3" style="background: var(--color-accent)" />
      </div>

      <div v-if="parsed.subtitle" class="text-center mb-6" v-html="parsed.subtitle" style="font-size: var(--fs-body-sm); color: var(--color-muted-foreground); font-family: var(--animal-font-family, inherit)" />

      <div v-if="parsed.entries.length" class="flex flex-col gap-3">
        <div v-for="(entry, i) in parsed.entries" :key="i" class="flex gap-4">
          <!-- 左侧时间轨 -->
          <div class="flex flex-col items-center flex-shrink-0 w-5 pt-1.5">
            <div class="w-3 h-3 rounded-full flex-shrink-0" style="background: var(--color-accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 15%, transparent)" />
            <div v-if="i < parsed.entries.length - 1" class="w-0.5 flex-1 mt-1.5 rounded" style="background: linear-gradient(180deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 10%, transparent))" />
          </div>
          <!-- 条目卡片 -->
          <Card
            type="filled"
            color="white"
            :style="{
              borderRadius: 'var(--animal-border-radius-base, 18px)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 2px 8px rgba(61, 52, 40, 0.05)',
              padding: '0.75rem 1.25rem',
              flex: '1',
              marginBottom: i < parsed.entries.length - 1 ? '0' : '0',
            }"
          >
            <div style="font-size: var(--fs-caption); font-weight: 600; color: var(--color-accent); font-family: var(--animal-font-family, inherit); margin-bottom: 0.25rem">{{ entry.date }}</div>
            <div style="font-size: var(--fs-body-sm); color: var(--color-foreground); font-family: var(--animal-font-family, inherit); line-height: 1.6">{{ entry.content }}</div>
          </Card>
        </div>
      </div>

      <p v-if="!parsed.entries.length && !parsed.subtitle" class="text-center" style="color: var(--color-muted-foreground); font-family: var(--animal-font-family, inherit)">（暂无时间线条目）</p>

      <div v-if="parsed.afterText" class="text-center mt-6" v-html="parsed.afterText" style="font-size: var(--fs-caption); color: var(--color-muted-foreground); font-family: var(--animal-font-family, inherit)" />
    </div>
  </div>
</template>

<style scoped>
.ai-timeline {
  padding: 2.5rem 3rem;
}
</style>
