<script setup lang="ts">
import type { Slide } from '../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import FadeContent from '../components/transitions/FadeContent.vue'

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
      const lines = trimmed.split('\n')
      for (const line of lines) {
        const t = line.trim()
        const itemMatch = t.match(/^-\s+(.+)$/)
        if (itemMatch) {
          items.push(itemMatch[1])
        } else if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
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

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2), afterText: after }
})
</script>

<template>
  <div class="slide-comparison-wrapper relative flex flex-col items-center justify-center overflow-hidden h-full">
    <!-- 背景已由全局背景层提供 -->

    <!-- 内容 -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full px-12 py-10 w-full">
      <h3 v-if="slide.title" class="text-xl md:text-2xl font-semibold mb-3 text-center slide-animate">
        {{ slide.title }}
      </h3>
      <div v-if="parsed.subtitle" class="comparison-subtitle mb-8 text-center max-w-xl slide-animate" v-html="parsed.subtitle"></div>

      <div class="comparison-grid w-full">
        <FadeContent
          v-for="(col, i) in parsed.columns"
          :key="i"
          :blur="true"
          :duration="700"
          :delay="150 + i * 200"
          class="comparison-col glass p-8 flex flex-col items-center relative overflow-hidden"
        >
          <!-- 顶部渐变装饰线 -->
          <div
            class="absolute top-0 left-6 right-6 h-[3px] rounded-full"
            :class="i === 0
              ? 'bg-gradient-to-r from-red-400/60 to-red-400/10'
              : 'bg-gradient-to-r from-emerald-400/60 to-emerald-400/10'"
          />
          <!-- 列标题 -->
          <div class="flex items-center gap-2 mb-6">
            <span
              class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
              :class="i === 0 ? 'bg-red-500/15 text-red-500' : 'bg-emerald-500/15 text-emerald-500'"
            >
              {{ i === 0 ? '✕' : '✓' }}
            </span>
            <strong class="text-lg">{{ col.title }}</strong>
          </div>
          <!-- 列表项 -->
          <ul class="space-y-3 w-full">
            <li
              v-for="(item, j) in col.items"
              :key="j"
              class="text-base flex items-center gap-3"
              :style="{ animationDelay: `${0.3 + (i * col.items.length + j) * 0.08}s` }"
            >
              <span
                class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                :class="i === 0
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-emerald-500/10 text-emerald-400'"
              >
                {{ i === 0 ? '✕' : '✓' }}
              </span>
              <span class="text-muted-foreground">{{ item }}</span>
            </li>
          </ul>
        </FadeContent>
      </div>

      <div v-if="parsed.afterText" class="comparison-after mt-6 text-center max-w-xl" v-html="parsed.afterText"></div>
    </div>
  </div>
</template>

<style scoped>
.slide-comparison-wrapper {
  padding: 2.5rem 3rem;  /* 旧 3rem 4rem */
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 64rem;       /* 旧 max-w-4xl (56rem) — 加宽 */
  width: 100%;
}

.comparison-col {
  min-height: 260px;
}

.comparison-col li {
  animation: fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* 标题跟随缩放 */
.slide-comparison-wrapper :deep(h3) {
  font-size: var(--fs-h3);
}

.comparison-col :deep(strong) {
  font-size: var(--fs-body-sm);
}

.comparison-col :deep(li) {
  font-size: var(--fs-caption);
}

.comparison-subtitle :deep(img) {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 0.75rem;
  margin: 0 auto 1rem;
}

.comparison-after :deep(p) {
  font-size: var(--fs-caption);
  color: var(--color-muted-foreground);
}
</style>
