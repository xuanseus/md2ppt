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
  <div class="cp-list w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 2.5rem 3rem">
      <!-- 标题 -->
      <h3 v-if="slide.title" class="cp-list-title">{{ slide.title }}</h3>
      <div v-if="parsed.subtitle" class="cp-list-sub" v-html="parsed.subtitle" />

      <!-- 编号列表 -->
      <div v-if="parsed.items.length" class="cp-list-items">
        <div v-for="(item, i) in parsed.items" :key="i" class="cp-list-row">
          <div class="cp-list-num-wrap">
            <span class="cp-list-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="cp-list-num-line" />
          </div>
          <span class="cp-list-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>

      <!-- 状态标签 -->
      <div class="mt-6 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">LIST::{{ parsed.items.length }}_ITEMS</span>
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

.cp-list-title {
  font-size: calc(1.6rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.75rem;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  color: var(--color-heading);
  text-shadow: 0 0 15px var(--color-accent);
  text-transform: uppercase;
}

.cp-list-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  margin-bottom: 1.5rem;
}

.cp-list-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 40rem;
}

.cp-list-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: 2px;
  border-left: 3px solid var(--color-accent);
  box-shadow: 0 0 10px color-mix(in srgb, var(--color-accent) 5%, transparent), inset 0 0 15px color-mix(in srgb, var(--color-accent) 2%, transparent);
}

.cp-list-num-wrap {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.cp-list-num {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 10px var(--color-accent);
  min-width: 2.5rem;
  text-align: right;
}

.cp-list-num-line {
  width: 12px;
  height: 2px;
  background: var(--color-accent);
  box-shadow: 0 0 4px var(--color-accent);
}

.cp-list-text {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.6;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 4px color-mix(in srgb, var(--color-accent) 5%, transparent);
}

.cp-list-text :deep(strong) {
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
}
</style>
