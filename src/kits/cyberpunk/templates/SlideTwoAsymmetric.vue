<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const ratio = computed(() => {
  const r = (props.slide.rawMd.match(/\{ratio:\s*(\d+)-(\d+)\}/i) || []);
  return { l: parseInt(r[1] || '2'), r: parseInt(r[2] || '1') }
})

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
  <div class="cp-two-col w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 2.5rem 3rem">
      <!-- 标题 -->
      <h3 v-if="slide.title" class="cp-two-title">{{ slide.title }}</h3>

      <!-- 副标题 -->
      <div v-if="parsed.subtitle" class="cp-two-sub" v-html="parsed.subtitle" />

      <!-- 不对称网格 -->
      <div class="cp-two-grid" :style="{ gridTemplateColumns: `${ratio.l}fr ${ratio.r}fr` }">
        <div v-for="(col, i) in parsed.columns" :key="i" class="cp-two-col-card">
          <div class="cp-two-col-accent" :style="{ background: i === 0 ? `linear-gradient(90deg, var(--color-accent), transparent)` : `linear-gradient(90deg, var(--color-h1-to), transparent)` }" />
          <h4 class="cp-two-col-title">{{ col.title }}</h4>
          <div v-html="col.html" class="cp-two-col-body" />
        </div>
      </div>

      <!-- 底部状态标签 -->
      <div class="mt-4 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">ASYMM::{{ ratio.l }}-{{ ratio.r }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.05) 3px,
    rgba(0, 0, 0, 0.05) 6px
  );
}

.cp-mono {
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
}

.cp-blink-slow { animation: cp-blink-slow 2.5s ease-in-out infinite; }

@keyframes cp-blink-slow {
  0%, 100% { opacity: 1; }
  40%, 60% { opacity: 0.2; }
}

.cp-two-title {
  font-size: calc(2rem * var(--content-scale));
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 20px var(--color-accent), 0 0 40px color-mix(in srgb, var(--color-accent) 30%, transparent);
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 0.5rem;
}

.cp-two-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  margin-bottom: 1.5rem;
}

.cp-two-grid {
  display: grid;
  gap: 2rem;
  width: 100%;
  max-width: 64rem;
}

.cp-two-col-card {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 8%, transparent), inset 0 0 20px color-mix(in srgb, var(--color-accent) 2%, transparent);
}

.cp-two-col-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  box-shadow: 0 0 12px var(--color-accent);
}

.cp-two-col-title {
  font-size: var(--fs-h4);
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  color: var(--color-heading);
  text-shadow: 0 0 8px var(--color-accent);
  text-transform: uppercase;
}

.cp-two-col-body :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.5rem;
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-two-col-body :deep(ul),
.cp-two-col-body :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}

.cp-two-col-body :deep(li) {
  margin-bottom: 0.4rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-two-col-body :deep(li::marker) {
  color: var(--color-accent);
}

.cp-two-col-body :deep(strong) {
  color: var(--color-accent);
  text-shadow: 0 0 6px var(--color-accent);
}
</style>
