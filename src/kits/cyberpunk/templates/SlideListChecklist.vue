<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const items = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim()).filter(Boolean)
})
</script>

<template>
  <div class="cp-list w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 2.5rem 3rem">
      <!-- 标题 -->
      <h3 v-if="slide.title" class="cp-list-title">{{ slide.title }}</h3>

      <!-- 检查列表 -->
      <div v-if="items.length" class="cp-checklist">
        <div v-for="(item, i) in items" :key="i" class="cp-checklist-row">
          <span class="cp-checklist-mark">[&#10003;]</span>
          <span class="cp-checklist-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>

      <!-- 状态标签 -->
      <div class="mt-6 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">CHECKLIST::{{ items.length }}_PASSED</span>
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
  margin-bottom: 1.5rem;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  color: var(--color-heading);
  text-shadow: 0 0 15px var(--color-accent);
  text-transform: uppercase;
}

.cp-checklist {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 40rem;
  width: 100%;
}

.cp-checklist-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
}

.cp-checklist-mark {
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #00ff88;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 10px #00ff88, 0 0 20px color-mix(in srgb, #00ff88 30%, transparent);
  background: color-mix(in srgb, #00ff88 10%, transparent);
  border: 1px solid color-mix(in srgb, #00ff88 20%, transparent);
  border-radius: 2px;
  padding: 0.15rem 0.5rem;
}

.cp-checklist-text {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.5;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 4px color-mix(in srgb, var(--color-accent) 5%, transparent);
}

.cp-checklist-text :deep(strong) {
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
}
</style>
