<script setup lang="ts">
import type { Slide } from '../../../types/slides'
defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-content w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 3rem">
      <!-- 顶部状态标签 -->
      <div class="mb-4 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-50" style="color: var(--color-muted-foreground)">SECTION::CONTENT</span>
      </div>

      <!-- 标题 -->
      <h3 v-if="slide.title" class="cp-content-title">{{ slide.title }}</h3>

      <!-- 内容 -->
      <div v-html="slide.html" class="cp-content-prose" />
    </div>

    <!-- 底部装饰线 -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none" style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, var(--color-accent), transparent); box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 40%, transparent)" />
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

.cp-content-prose :deep(h1),
.cp-content-prose :deep(h2) {
  font-size: calc(1.6rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 15px var(--color-accent);
  text-align: center;
  margin-bottom: 1.5rem;
}

.cp-content-prose :deep(h3),
.cp-content-prose :deep(h4) {
  font-size: calc(1.2rem * var(--content-scale));
  font-weight: 500;
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  margin-bottom: 1rem;
  text-align: center;
}

.cp-content-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  margin-bottom: 1rem;
  text-align: center;
  text-shadow: 0 0 6px color-mix(in srgb, var(--color-accent) 5%, transparent);
}

.cp-content-prose :deep(ul) {
  list-style: none;
  padding: 0;
}

.cp-content-prose :deep(li) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  padding: 0.5rem 0;
  text-align: center;
}

.cp-content-prose :deep(li::before) {
  content: '\25C6 ';
  color: var(--color-accent);
  text-shadow: 0 0 6px var(--color-accent);
}

.cp-content-prose :deep(strong) {
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
}
</style>
