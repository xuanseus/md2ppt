<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()
interface Col { title: string; items: string[]; icon: string }
const cols = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  const c: Col[] = []
  for (let i = 0; i < Math.min(parts.length, 2); i++) {
    const p = parts[i].trim(); const tm = p.match(/^\*\*([^*]+)\*\*/m)
    const items = p.split('\n').slice(1).filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim())
    c.push({ title: tm ? tm[1] : '', items, icon: i === 0 ? '旧' : '新' })
  }
  return c
})
const subtitle = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const fi = body.indexOf('**'); if (fi > 0) { const b = body.slice(0, fi).trim(); if (b) return marked.parse(b) as string }
  return ''
})
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden flex items-center justify-center"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 -->
    <div class="absolute left-[6%] top-[8%] w-48 h-48 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[8%] bottom-[10%] w-40 h-40 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <div class="wrap relative z-10" style="max-width: 56rem; width: 100%; display: flex; flex-direction: column; align-items: center; padding: 2rem;">

      <h3 v-if="slide.title" class="cmp-title">{{ slide.title }}</h3>
      <div v-if="subtitle" class="cmp-sub" v-html="subtitle" />

      <div v-if="cols.length === 2" class="cmp-grid">
        <div v-for="(col, ci) in cols" :key="ci" class="cmp-card" :class="ci === 0 ? 'cmp-left' : 'cmp-right'">
          <!-- 印章图标 -->
          <div class="cmp-seal-icon"
            style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; opacity: 0.5; transform: rotate(-3deg);">
            {{ col.icon }}
          </div>
          <strong class="cmp-col-title">{{ col.title }}</strong>
          <ul class="cmp-list">
            <li v-for="(item, ji) in col.items" :key="ji" v-html="(marked.parseInline(item) as string)" />
          </ul>
        </div>
      </div>
    </div>

    <!-- 左下印章 -->
    <div class="sm-seal absolute left-8 bottom-8 w-11 h-11 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.45rem; letter-spacing: 0.1em; transform: rotate(-4deg); opacity: 0.35; padding: 2px;">
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

.cmp-title {
  font-size: var(--fs-h3);
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.06em;
}

.cmp-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  margin-bottom: 1.5rem;
}

.cmp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  margin-top: 1rem;
}

.cmp-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  text-align: center;
}

.cmp-left {
  border-top: 2px solid color-mix(in srgb, var(--color-seal) 35%, transparent);
}

.cmp-right {
  border-top: 2px solid color-mix(in srgb, var(--color-ink-light) 35%, transparent);
}

.cmp-seal-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.cmp-col-title {
  font-size: var(--fs-h3);
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
}

.cmp-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.cmp-list li {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.6;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  padding-left: 1.25rem;
  position: relative;
}

.cmp-left .cmp-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: color-mix(in srgb, var(--color-seal) 40%, transparent);
}

.cmp-right .cmp-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--color-ink-light);
  opacity: 0.5;
}
</style>
