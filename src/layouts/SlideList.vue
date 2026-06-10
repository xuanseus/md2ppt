<script setup lang="ts">
import type { Slide } from '../types/slides'
import { computed } from 'vue'

const props = defineProps<{ slide: Slide }>()

interface ListItem {
  emoji: string
  title: string
  desc: string
}

const parsed = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()

  const items: ListItem[] = []
  const beforeText: string[] = []
  const afterText: string[] = []
  let hitItems = false

  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+(\S+)\s+(.+?)[：:]\s*(.+)$/)
    if (m) {
      hitItems = true
      items.push({ emoji: m[1], title: m[2], desc: m[3] })
      continue
    }
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('-')) {
      if (hitItems) afterText.push(trimmed)
      else beforeText.push(trimmed)
    }
  }

  return { subtitle: beforeText.join(' '), items, afterText: afterText.join(' ') }
})
</script>

<template>
  <div class="slide-list flex flex-col items-center justify-center h-full px-12 py-12">
    <h3 v-if="slide.title" class="text-xl md:text-2xl font-semibold mb-3 text-center">
      {{ slide.title }}
    </h3>
    <p v-if="parsed.subtitle" class="text-sm text-muted-foreground mb-8 text-center max-w-xl">{{ parsed.subtitle }}</p>

    <div v-if="parsed.items.length" class="list-grid w-full max-w-2xl grid grid-cols-1 gap-4">
      <div
        v-for="(item, i) in parsed.items"
        :key="i"
        class="flex items-center gap-5 p-5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
      >
        <span class="text-3xl flex-shrink-0">{{ item.emoji }}</span>
        <div>
          <div class="text-base font-semibold">{{ item.title }}</div>
          <div class="text-sm text-muted-foreground">{{ item.desc }}</div>
        </div>
      </div>
    </div>
    <p v-else class="text-muted-foreground text-sm">（暂无列表项）</p>

    <p v-if="parsed.afterText" class="text-sm text-muted-foreground mt-6 text-center max-w-xl">{{ parsed.afterText }}</p>
  </div>
</template>
