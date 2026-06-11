<script setup lang="ts">
import type { Slide } from '../types/slides'
import { computed } from 'vue'
import SpotlightCard from '../components/cards/SpotlightCard.vue'

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
  <div class="slide-list-wrapper relative flex flex-col items-center justify-center overflow-hidden h-full">
    <!-- 背景已由全局背景层提供 -->

    <!-- 内容 -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full px-12 py-12 w-full">
      <h3 v-if="slide.title" class="text-xl md:text-2xl font-semibold mb-3 text-center slide-animate">
        {{ slide.title }}
      </h3>
      <p v-if="parsed.subtitle" class="text-sm text-muted-foreground mb-8 text-center max-w-xl slide-animate">{{ parsed.subtitle }}</p>

      <div v-if="parsed.items.length" class="list-grid w-full max-w-2xl grid grid-cols-1 gap-4">
        <SpotlightCard
          v-for="(item, i) in parsed.items"
          :key="i"
          class="list-card"
          spotlight-color="rgba(66, 211, 146, 0.15)"
          :style="{ animationDelay: `${0.15 + i * 0.1}s` }"
        >
          <div class="flex items-center gap-5 p-5 rounded-xl">
            <span class="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-accent/10">{{ item.emoji }}</span>
            <div>
              <div class="text-base font-semibold">{{ item.title }}</div>
              <div class="text-sm text-muted-foreground mt-0.5">{{ item.desc }}</div>
            </div>
          </div>
        </SpotlightCard>
      </div>
      <p v-else class="text-muted-foreground text-sm">（暂无列表项）</p>

      <p v-if="parsed.afterText" class="text-sm text-muted-foreground mt-6 text-center max-w-xl">{{ parsed.afterText }}</p>
    </div>
  </div>
</template>

<style scoped>
.slide-list-wrapper {
  padding: 3rem 4rem;
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
</style>
