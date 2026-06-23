<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const ratio = computed(() => { const r = (props.slide.rawMd.match(/\{ratio:\s*(\d+)-(\d+)\}/i) || []); return { l: parseInt(r[1] || '2'), r: parseInt(r[2] || '1') } })

interface Column { title: string; html: string }
const parsed = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const columns: Column[] = []
  const beforeText: string[] = []
  let hit = false
  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  for (const part of parts) {
    const t = part.trim(); if (!t) continue
    const tm = t.match(/^\*\*([^*]+)\*\*/m)
    if (tm) {
      hit = true
      const lines: string[] = []
      for (const l of t.split('\n')) { const ln = l.trim(); if (ln && !ln.match(/^\*\*[^*]+\*\*$/)) lines.push(ln) }
      columns.push({ title: tm[1], html: marked.parse(lines.join('\n')) as string })
    } else { for (const l of t.split('\n')) { const ln = l.trim(); if (ln && !hit) beforeText.push(ln) } }
  }
  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2) }
})
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden flex items-center justify-center"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 — 不对称分布 -->
    <div class="absolute left-[5%] top-[10%] w-52 h-52 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[4%] bottom-[12%] w-40 h-40 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <div class="wrap relative z-10" style="width: 100%; max-width: 64rem; padding: 2rem;">

      <!-- 标题 -->
      <h3 v-if="slide.title" class="asym-title">{{ slide.title }}</h3>
      <div v-if="parsed.subtitle" class="asym-sub" v-html="parsed.subtitle" />

      <!-- 不对称网格 -->
      <div class="asym-grid" :style="{ gridTemplateColumns: `${ratio.l}fr ${ratio.r}fr` }">
        <div v-for="(col, i) in parsed.columns" :key="i" class="asym-card">
          <div class="asym-accent" />
          <h4 class="asym-col-title">{{ col.title }}</h4>
          <div v-html="col.html" class="asym-body" />
        </div>
      </div>
    </div>

    <!-- 右侧印章 -->
    <div class="sm-seal absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.5rem; letter-spacing: 0.1em; transform: rotate(5deg); opacity: 0.35; padding: 2px;">
      对比
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.asym-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.06em;
}

.asym-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  margin-bottom: 1.5rem;
}

.asym-grid {
  display: grid;
  gap: 2rem;
}

.asym-card {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
}

.asym-accent {
  position: absolute;
  top: 0;
  left: 1.5rem;
  right: 1.5rem;
  height: 2px;
  opacity: 0.25;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
}

.asym-col-title {
  font-size: var(--fs-h4);
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-ink-wash);
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
}

.asym-body :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.5rem;
  color: var(--color-muted-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.asym-body :deep(ul),
.asym-body :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}

.asym-body :deep(li) {
  margin-bottom: 0.4rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.asym-body :deep(li::marker) {
  color: var(--color-ink-light);
}

.asym-body :deep(strong) {
  font-weight: 700;
  color: var(--color-heading);
}
</style>
