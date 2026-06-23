<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const ratio = computed(() => {
  const r = (props.slide.rawMd.match(/\{ratio:\s*(\d+)-(\d+)\}/i) || [])
  return { l: parseInt(r[1] || '2'), r: parseInt(r[2] || '1') }
})

interface Column {
  title: string
  html: string
}

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
  <div class="holo-two-asym relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景三角形网格 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.025]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoAsymGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <line x1="0" y1="50" x2="50" y2="0" stroke="var(--color-accent)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoAsymGrid)" />
      </svg>
    </div>

    <!-- ============ 全局标题 ============ -->
    <div class="absolute z-10" style="top: 5%; left: 50%; transform: translateX(-50%);">
      <h2 v-if="slide.title" class="holo-asym-title">{{ slide.title || 'Two Column' }}</h2>
      <div class="holo-asym-beam"></div>
      <div v-if="parsed.subtitle" class="holo-asym-sub" v-html="parsed.subtitle"></div>
    </div>

    <!-- ============ 不对称网格面板 ============ -->
    <div class="relative z-10 w-full" style="max-width: 920px; margin-top: 50px;">
      <div class="holo-asym-grid" :style="{ gridTemplateColumns: `${ratio.l}fr ${ratio.r}fr` }">
        <div v-for="(col, i) in parsed.columns" :key="i" class="holo-asym-panel" :class="i === 0 ? 'left-panel' : 'right-panel'">
          <div class="holo-panel-header" :class="{ 'right': i !== 0 }">
            <span v-if="i === 0" class="holo-panel-reticle"></span>
            <span class="holo-panel-id">[PANEL-{{ String(i + 1).padStart(2, '0') }}]</span>
            <span v-if="i !== 0" class="holo-panel-reticle"></span>
          </div>
          <h4 class="holo-asym-col-title" :class="{ 'alt': i !== 0 }">{{ col.title }}</h4>
          <div class="holo-asym-col-beam" :class="{ 'alt': i !== 0 }"></div>
          <div v-html="col.html" class="holo-asym-prose"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 全局标题 ===== */
.holo-asym-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
  text-align: center;
}
.holo-asym-beam {
  width: 60px;
  height: 2px;
  margin: 0.5rem auto;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
}
.holo-asym-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin: 0;
}

/* ===== 网格 ===== */
.holo-asym-grid {
  display: grid;
  gap: 2rem;
}

/* ===== 面板 ===== */
.holo-asym-panel {
  padding: 1.5rem 2rem;
  border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
  clip-path: polygon(
    0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px,
    100% calc(100% - 12px), calc(100% - 12px) 100%,
    12px 100%, 0 calc(100% - 12px)
  );
}

.left-panel {
  background: color-mix(in srgb, var(--color-card) 95%, transparent);
  box-shadow: -4px 4px 20px color-mix(in srgb, var(--color-accent) 8%, transparent);
}

.right-panel {
  background: color-mix(in srgb, var(--color-card) 95%, transparent);
  box-shadow: 4px -4px 20px color-mix(in srgb, var(--color-h1-to) 8%, transparent);
}

/* ===== 面板头部 ===== */
.holo-panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.holo-panel-header.right {
  justify-content: flex-end;
}
.holo-panel-reticle {
  width: 8px;
  height: 8px;
  border: 1px solid var(--color-accent);
  clip-path: polygon(0 0, 100% 0, 100% 4px, 4px 4px, 4px 100%, 0 100%);
}
.holo-panel-id {
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  letter-spacing: 0.1em;
}

/* ===== 列标题 ===== */
.holo-asym-col-title {
  font-size: var(--fs-h4);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  margin: 0 0 0.25rem 0;
}
.holo-asym-col-beam {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
  margin-bottom: 1rem;
}
.holo-asym-col-beam.alt {
  background: linear-gradient(90deg, var(--color-h1-to), transparent);
}

/* ===== 内容 ===== */
.holo-asym-prose :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.5rem;
  color: var(--color-foreground);
}
.holo-asym-prose :deep(ul),
.holo-asym-prose :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}
.holo-asym-prose :deep(li) {
  margin-bottom: 0.4rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
}
.holo-asym-prose :deep(li::marker) {
  color: var(--color-accent);
}
.holo-asym-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}
</style>
