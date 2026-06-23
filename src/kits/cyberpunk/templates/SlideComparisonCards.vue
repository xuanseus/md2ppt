<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Col { title: string; items: string[]; icon: string; colorClass: string }
const cols = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  const c: Col[] = []
  for (let i = 0; i < Math.min(parts.length, 2); i++) {
    const p = parts[i].trim(); const tm = p.match(/^\*\*([^*]+)\*\*/m)
    const items = p.split('\n').slice(1).filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim())
    c.push({ title: tm ? tm[1] : '', items, icon: i === 0 ? 'X' : 'OK', colorClass: i === 0 ? 'is-red' : 'is-green' })
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
  <div class="cp-compare w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 2.5rem 3rem">
      <!-- 标题 -->
      <h3 v-if="slide.title" class="cp-compare-title">{{ slide.title }}</h3>
      <div v-if="subtitle" class="cp-compare-sub" v-html="subtitle" />

      <!-- 对比网格 -->
      <div v-if="cols.length === 2" class="cp-compare-grid">
        <div v-for="(col, ci) in cols" :key="ci" :class="['cp-compare-card', col.colorClass]">
          <div class="cp-compare-card-accent" :class="col.colorClass" />
          <div class="cp-compare-card-status">{{ col.icon }}</div>
          <strong class="cp-compare-card-title">{{ col.title }}</strong>
          <ul class="cp-compare-list">
            <li v-for="(item, ji) in col.items" :key="ji" v-html="(marked.parseInline(item) as string)" />
          </ul>
        </div>
      </div>

      <!-- 状态标签 -->
      <div class="mt-6 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">COMPARE::A_B</span>
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

.cp-compare-title {
  font-size: calc(1.6rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  color: var(--color-heading);
  text-shadow: 0 0 15px var(--color-accent);
  text-transform: uppercase;
}

.cp-compare-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  margin-bottom: 1.5rem;
}

.cp-compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 56rem;
}

.cp-compare-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem;
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 2px solid var(--color-border);
  border-radius: 2px;
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 8%, transparent), inset 0 0 25px color-mix(in srgb, var(--color-accent) 2%, transparent);
  text-align: center;
}

.cp-compare-card.is-red {
  border-color: color-mix(in srgb, #ff4444 50%, transparent);
  box-shadow: 0 0 20px color-mix(in srgb, #ff4444 15%, transparent), inset 0 0 25px color-mix(in srgb, #ff4444 3%, transparent);
}

.cp-compare-card.is-green {
  border-color: color-mix(in srgb, #00ff88 50%, transparent);
  box-shadow: 0 0 20px color-mix(in srgb, #00ff88 15%, transparent), inset 0 0 25px color-mix(in srgb, #00ff88 3%, transparent);
}

.cp-compare-card-accent {
  position: absolute;
  top: 0;
  left: 1.5rem;
  right: 1.5rem;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
}

.cp-compare-card-accent.is-red {
  background: linear-gradient(90deg, transparent, #ff4444, transparent);
  box-shadow: 0 0 12px #ff4444;
}

.cp-compare-card-accent.is-green {
  background: linear-gradient(90deg, transparent, #00ff88, transparent);
  box-shadow: 0 0 12px #00ff88;
}

.cp-compare-card-status {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.is-red .cp-compare-card-status {
  color: #ff4444;
  text-shadow: 0 0 15px #ff4444;
}

.is-green .cp-compare-card-status {
  color: #00ff88;
  text-shadow: 0 0 15px #00ff88;
}

.cp-compare-card-title {
  font-size: var(--fs-h3);
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--color-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-transform: uppercase;
  text-shadow: 0 0 8px color-mix(in srgb, var(--color-accent) 20%, transparent);
}

.cp-compare-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.cp-compare-list li {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.6;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 4px color-mix(in srgb, var(--color-accent) 5%, transparent);
}

.cp-compare-list :deep(strong) {
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
}
</style>
