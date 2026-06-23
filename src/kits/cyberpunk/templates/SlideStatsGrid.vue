<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

const cols = computed(() => parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i) || [])[1] || '3'))

const cards = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('|||').map(s => s.trim()).filter(Boolean).map(s => ({ html: marked.parse(s) as string }))
})
</script>

<template>
  <div class="cp-stats w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 3rem">
      <div v-if="cards.length" class="cp-stats-grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
        <div v-for="(card, i) in cards" :key="i" class="cp-stat-card" :style="{ animationDelay: `${0.1 + i * 0.1}s` }">
          <div class="cp-stat-accent" />
          <div v-html="card.html" class="cp-stat-prose" />
        </div>
      </div>
      <div v-else v-html="slide.html" class="cp-stats-fallback" />

      <!-- 底部状态标签 -->
      <div class="mt-6 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">METRICS::{{ cols }}COL</span>
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

.cp-stats-grid {
  display: grid;
  gap: 1.5rem;
  max-width: 64rem;
  width: 100%;
}

.cp-stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 8%, transparent), inset 0 0 20px color-mix(in srgb, var(--color-accent) 2%, transparent);
  animation: cp-card-in 0.6s ease both;
}

.cp-stat-accent {
  position: absolute;
  top: 0;
  left: 2rem;
  right: 2rem;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  box-shadow: 0 0 12px var(--color-accent);
}

.cp-stat-prose :deep(strong) {
  display: block;
  font-size: calc(3rem * var(--content-scale));
  font-weight: 900;
  line-height: 1;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 30px var(--color-accent), 0 0 60px color-mix(in srgb, var(--color-accent) 40%, transparent);
  margin-bottom: 0.75rem;
  animation: cp-count-pulse 2s ease-out;
}

.cp-stat-prose :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  margin: 0;
  text-shadow: 0 0 4px color-mix(in srgb, var(--color-accent) 5%, transparent);
}

.cp-stats-fallback {
  max-width: 48rem;
  text-align: center;
}

.cp-stats-fallback :deep(h4) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  margin-bottom: 2rem;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-stats-fallback :deep(strong) {
  font-size: var(--fs-stat);
  color: var(--color-accent);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 30px var(--color-accent);
}

@keyframes cp-card-in {
  0% { opacity: 0; transform: translateY(20px) }
  100% { opacity: 1; transform: translateY(0) }
}

@keyframes cp-count-pulse {
  0% { transform: scale(0.5); opacity: 0 }
  50% { transform: scale(1.1) }
  100% { transform: scale(1); opacity: 1 }
}
</style>
