<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()
const parsed = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const items: string[] = []; const before: string[] = []
  let hit = false
  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+(.+)$/)
    if (m) { hit = true; items.push(m[1]) }
    else { const t = line.trim(); if (t && !hit) before.push(t) }
  }
  return { subtitle: before.length ? marked.parse(before.join('\n')) as string : '', items }
})
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden flex items-center justify-center"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 -->
    <div class="absolute left-[6%] top-[10%] w-48 h-48 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[8%] bottom-[12%] w-40 h-40 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 主体 -->
    <div class="wrap relative z-10" style="display: flex; flex-direction: column; align-items: center; max-width: 40rem; width: 100%; padding: 2rem;">

      <h3 v-if="slide.title" class="ln-title">{{ slide.title }}</h3>
      <div v-if="parsed.subtitle" class="ln-sub" v-html="parsed.subtitle" />

      <div v-if="parsed.items.length" class="ln-list">
        <div v-for="(item, i) in parsed.items" :key="i" class="ln-item">
          <span class="ln-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="ln-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>
    </div>

    <!-- 右侧印章 -->
    <div class="sm-seal absolute right-8 top-8 w-11 h-11 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.45rem; letter-spacing: 0.1em; transform: rotate(4deg); opacity: 0.35; padding: 2px;">
      要点
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.ln-title {
  font-size: var(--fs-h3);
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.06em;
}

.ln-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  margin-bottom: 1.5rem;
}

.ln-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.ln-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.02);
}

.ln-num {
  flex-shrink: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-ink-light);
  opacity: 0.35;
  min-width: 2.5rem;
  text-align: right;
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
  letter-spacing: 0.04em;
}

.ln-text {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.6;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}
</style>
