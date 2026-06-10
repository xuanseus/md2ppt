<script setup lang="ts">
import type { Slide } from '../types/slides'
import { computed } from 'vue'

const props = defineProps<{ slide: Slide }>()

interface Column {
  title: string
  items: string[]
}

const parsed = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()

  const columns: Column[] = []
  const beforeText: string[] = []
  const afterText: string[] = []
  let hitColumns = false

  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const titleMatch = trimmed.match(/^\*\*([^*]+)\*\*/m)
    if (titleMatch) {
      hitColumns = true
      const items: string[] = []
      // 逐行处理：提取列表项，其余自由文本归入 afterText
      const lines = trimmed.split('\n')
      for (const line of lines) {
        const t = line.trim()
        const itemMatch = t.match(/^-\s+(.+)$/)
        if (itemMatch) {
          items.push(itemMatch[1])
        } else if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
          // 非 heading 的自由文本
          if (hitColumns) afterText.push(t)
          else beforeText.push(t)
        }
      }
      columns.push({ title: titleMatch[1], items })
    } else {
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t && !t.startsWith('-')) {
          if (hitColumns) afterText.push(t)
          else beforeText.push(t)
        }
      }
    }
  }

  return { subtitle: beforeText.join(' '), columns: columns.slice(0, 2), afterText: afterText.join(' ') }
})
</script>

<template>
  <div class="slide-comparison flex flex-col items-center justify-center h-full px-12 py-10">
    <h3 v-if="slide.title" class="text-xl md:text-2xl font-semibold mb-3 text-center">
      {{ slide.title }}
    </h3>
    <p v-if="parsed.subtitle" class="text-sm text-muted-foreground mb-8 text-center max-w-xl">{{ parsed.subtitle }}</p>

    <div class="comparison-grid w-full max-w-4xl">
      <div
        v-for="(col, i) in parsed.columns"
        :key="i"
        class="comparison-col rounded-2xl p-8 flex flex-col items-center"
        :class="i === 0 ? 'bg-red-50 dark:bg-red-950/20' : 'bg-green-50 dark:bg-green-950/20'"
      >
        <strong class="text-lg mb-6">{{ col.title }}</strong>
        <ul class="space-y-3 w-full">
          <li v-for="(item, j) in col.items" :key="j" class="text-base flex items-center gap-2">
            <span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm"
              :class="i === 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'">
              {{ i === 0 ? '✕' : '✓' }}
            </span>
            <span class="text-muted-foreground">{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>

    <p v-if="parsed.afterText" class="text-sm text-muted-foreground mt-6 text-center max-w-xl">{{ parsed.afterText }}</p>
  </div>
</template>

<style scoped>
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.comparison-col {
  min-height: 260px;
}
</style>
