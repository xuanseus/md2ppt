<script setup lang="ts">
import type { Slide } from '../../../types/slides'
defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-content w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 3rem">
      <!-- 标题 -->
      <h3 v-if="slide.title" class="cp-content-title">{{ slide.title }}</h3>

      <!-- 卡片容器 -->
      <div class="cp-card">
        <!-- 顶部 neon 边 -->
        <div class="cp-card-top-accent" />
        <div v-html="slide.html" class="cp-card-prose" />
      </div>

      <!-- 底部状态标签 -->
      <div class="mt-4 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">PACKET::RECEIVED</span>
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

.cp-content-title {
  font-size: calc(2rem * var(--content-scale));
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 20px var(--color-accent), 0 0 40px color-mix(in srgb, var(--color-accent) 30%, transparent);
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 2rem;
}

.cp-card {
  position: relative;
  padding: 2.5rem 3rem;
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 10%, transparent), 0 0 60px color-mix(in srgb, var(--color-accent) 5%, transparent), inset 0 0 30px color-mix(in srgb, var(--color-accent) 3%, transparent);
  max-width: 48rem;
  width: 100%;
}

.cp-card-top-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  box-shadow: 0 0 15px var(--color-accent);
}

.cp-card-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 6px color-mix(in srgb, var(--color-accent) 5%, transparent);
}

.cp-card-prose :deep(ul) {
  list-style: none;
  padding: 0;
}

.cp-card-prose :deep(li) {
  font-size: var(--fs-body-sm);
  padding: 0.4rem 0;
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-card-prose :deep(li::before) {
  content: '\25B8 ';
  color: var(--color-accent);
  text-shadow: 0 0 6px var(--color-accent);
}

.cp-card-prose :deep(strong) {
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
}
</style>
