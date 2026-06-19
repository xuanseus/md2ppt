<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import { Card } from 'animal-island-vue'

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
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        const itemMatch = t.match(/^-\s+(.+)$/)
        if (itemMatch) {
          items.push(itemMatch[1])
        } else if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
          afterText.push(t)
        }
      }
      columns.push({ title: titleMatch[1], items })
    } else {
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t) beforeText.push(t)
      }
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2), afterText: after }
})
</script>

<template>
  <div class="ai-comparison flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <div class="relative z-10 w-full max-w-6xl px-10">
      <div v-if="slide.title" class="text-center mb-6">
        <h2 style="font-size: var(--fs-h2); font-weight: 700; color: var(--color-heading); font-family: var(--animal-font-family, inherit)">
          {{ slide.title }}
        </h2>
        <div class="w-16 h-0.5 rounded-full mx-auto mt-3" style="background: var(--color-accent)" />
      </div>

      <div v-if="parsed.subtitle" class="text-center mb-6" v-html="parsed.subtitle" style="font-size: var(--fs-body-sm); color: var(--color-muted-foreground); font-family: var(--animal-font-family, inherit)" />

      <div class="relative grid grid-cols-2 gap-14">
        <!-- VS 悬浮标签 -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-20" style="background: var(--color-accent); color: white; font-weight: 800; font-size: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-family: var(--animal-font-family, inherit)">
          VS
        </div>

        <Card
          v-for="(col, i) in parsed.columns"
          :key="i"
          type="filled"
          color="white"
          class="ai-comp-card"
          :style="{
            borderRadius: 'var(--animal-border-radius-lg, 24px)',
            border: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'),
            boxShadow: '0 3px 12px rgba(61, 52, 40, 0.08)',
            padding: '1.25rem 1.5rem',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }"
        >
          <!-- 列标题 -->
          <div class="flex items-center gap-2 pb-3" :style="{ borderBottom: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)') }">
            <span class="text-lg">{{ i === 0 ? '🌸' : '🌻' }}</span>
            <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); font-family: var(--animal-font-family, inherit)">{{ col.title }}</h4>
          </div>

          <!-- 结构化列表 -->
          <ul class="mt-3" style="list-style: none; padding: 0; margin: 0">
            <li
              v-for="(item, j) in col.items"
              :key="j"
              class="flex items-center gap-3"
              style="font-size: var(--fs-body-sm); color: var(--color-foreground); padding: 0.4rem 0; line-height: 1.6; font-family: var(--animal-font-family, inherit)"
            >
              <span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                :style="{
                  background: i === 0 ? 'color-mix(in srgb, var(--color-accent) 15%, transparent)' : 'color-mix(in srgb, var(--color-h1-to) 15%, transparent)',
                  color: i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)',
                }"
              >
                {{ i === 0 ? '✕' : '✓' }}
              </span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </Card>
      </div>

      <div v-if="parsed.afterText" class="text-center mt-6" v-html="parsed.afterText" style="font-size: var(--fs-caption); color: var(--color-muted-foreground); font-family: var(--animal-font-family, inherit)" />
    </div>
  </div>
</template>

<style scoped>
.ai-comparison {
  padding: 2.5rem 3rem;
}

.ai-comp-card:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 24px rgba(61, 52, 40, 0.14) !important;
}
</style>
