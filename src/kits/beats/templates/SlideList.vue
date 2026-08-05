<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import SpotlightCard from '../../../components/cards/SpotlightCard.vue'

const props = defineProps<{ slide: Slide }>()

interface ListItem {
  emoji: string
  title: string
  desc: string
  titleHtml: string
  descHtml: string
}

const parsed = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()

  const items: ListItem[] = []
  const beforeText: string[] = []
  const afterText: string[] = []
  let hitItems = false

  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+(\S+)\s+(.+?)[：:—–]\s*(.+)$/)
    if (m) {
      hitItems = true
      items.push({
        emoji: m[1],
        title: m[2],
        desc: m[3],
        titleHtml: marked.parseInline(m[2]) as string,
        descHtml: marked.parseInline(m[3]) as string,
      })
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
  return { subtitle, items, afterText: after }
})
</script>

<template>
  <div class="slide-list-wrapper relative flex flex-col items-center justify-center overflow-hidden h-full">
    <!-- 背景已由全局背景层提供 -->

    <!-- 内容 -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full px-6 py-10 w-full">
      <h3 v-if="slide.title" class="text-xl md:text-2xl font-semibold mb-6 text-center slide-animate">
        {{ slide.title }}
      </h3>
      <div v-if="parsed.subtitle" class="list-subtitle mb-8 text-center max-w-xl slide-animate" v-html="parsed.subtitle"></div>

      <div v-if="parsed.items.length" class="list-grid mx-auto grid grid-cols-1 gap-4" style="max-width: min(calc(var(--content-max) * var(--content-scale)), 100%); width: fit-content; min-width: min(calc(44rem * var(--content-scale)), 100%)">
        <SpotlightCard
          v-for="(item, i) in parsed.items"
          :key="i"
          class="list-card"
          spotlight-color="rgba(66, 211, 146, 0.15)"
          :style="{ animationDelay: `${0.15 + i * 0.1}s` }"
        >
          <div class="flex items-center gap-5 px-8 py-6 rounded-xl">
            <span class="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-accent/10">{{ item.emoji }}</span>
            <div>
              <div class="text-base font-semibold" v-html="item.titleHtml"></div>
              <div class="text-sm text-muted-foreground mt-0.5" v-html="item.descHtml"></div>
            </div>
          </div>
        </SpotlightCard>
      </div>
      <p v-else class="text-muted-foreground text-sm">（暂无列表项）</p>

      <div v-if="parsed.afterText" class="list-after mt-6 text-center max-w-xl" v-html="parsed.afterText"></div>
    </div>
  </div>
</template>

<style scoped>
.slide-list-wrapper {
  padding: 2.5rem 2rem;  /* 横向 padding 缩小，内容占比更大 */
}

/* 标题跟随缩放 */
.slide-list-wrapper :deep(h3) {
  font-size: var(--fs-h3);
}

/* 列表项文字跟随缩放 */
.list-card :deep(.text-base) {
  font-size: var(--fs-caption);
}
.list-card :deep(.text-sm) {
  font-size: var(--fs-small);
}

.list-card {
  animation: fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  background: color-mix(in srgb, var(--color-muted) 30%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-border) 40%, transparent);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.3s;
}

.list-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.list-subtitle :deep(img),
.list-after :deep(img) {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 0.75rem;
  margin: 0 auto 1rem;
}

.list-after :deep(p) {
  font-size: var(--fs-caption);
  color: var(--color-muted-foreground);
}
</style>
