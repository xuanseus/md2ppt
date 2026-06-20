<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Column {
  title: string
  html: string
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
      const contentLines: string[] = []
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
          contentLines.push(t)
        }
      }
      columns.push({ title: titleMatch[1], html: marked.parse(contentLines.join('\n')) as string })
    } else {
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t) {
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
  <div class="sm-twocol w-full h-full relative overflow-hidden"
    style="background: linear-gradient(180deg, var(--color-muted) 0%, var(--color-background) 100%)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 标题区 -->
    <h2 v-if="slide.title" class="absolute top-6 left-1/2 -translate-x-1/2 z-20"
      style="font-size: var(--fs-h2); font-weight: 700; color: var(--color-heading); font-family: 'Noto Serif SC', 'STSong', Georgia, serif; letter-spacing: 0.08em;">
      {{ slide.title }}
    </h2>

    <!-- 双栏内容 -->
    <div class="absolute inset-x-8 flex gap-8" style="top: 15%;">
      <div v-for="(col, i) in parsed.columns" :key="i"
        style="flex: 1; background: var(--color-card); border: 1px solid var(--color-border); padding: 2rem;">
        <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); font-family: 'Noto Serif SC', 'STSong', Georgia, serif; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--color-ink-wash);">
          {{ col.title }}
        </h4>
        <div v-html="col.html" class="sm-twocol-prose" />
      </div>
    </div>

    <div v-if="parsed.afterText" class="text-center mt-4 mx-8"
      style="font-size: var(--fs-caption); color: var(--color-muted-foreground); font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif; opacity: 0.5;" v-html="parsed.afterText" />
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.sm-twocol-prose :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.75rem;
  color: var(--color-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.sm-twocol-prose :deep(ul),
.sm-twocol-prose :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.sm-twocol-prose :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.sm-twocol-prose :deep(li)::marker {
  color: var(--color-accent);
}

.sm-twocol-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-heading);
}
</style>
