<script setup lang="ts">
import type { Slide } from '../../../types/slides'
defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-stats w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 3rem">
      <!-- 标题 -->
      <h3 v-if="slide.title" class="cp-stats-title">{{ slide.title }}</h3>

      <!-- 内联统计内容 -->
      <div v-html="slide.html" class="cp-stats-inline" />

      <!-- 底部状态标签 -->
      <div class="mt-6 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">METRICS::INLINE</span>
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

.cp-stats-title {
  font-size: calc(1.6rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  color: var(--color-heading);
  text-shadow: 0 0 15px var(--color-accent);
  text-transform: uppercase;
}

.cp-stats-inline :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 4px color-mix(in srgb, var(--color-accent) 5%, transparent);
}

.cp-stats-inline :deep(strong) {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 30px var(--color-accent), 0 0 60px color-mix(in srgb, var(--color-accent) 40%, transparent);
  animation: cp-count-pulse 2s ease-out;
  display: inline-block;
  margin: 0 0.25rem;
}

@keyframes cp-count-pulse {
  0% { transform: scale(0.5); opacity: 0 }
  50% { transform: scale(1.1) }
  100% { transform: scale(1); opacity: 1 }
}
</style>
