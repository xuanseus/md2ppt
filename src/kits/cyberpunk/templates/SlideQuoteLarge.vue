<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-quote w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 4rem">
      <!-- 顶部终端提示 -->
      <div class="cp-terminal-prompt mb-6">
        <span class="cp-mono" style="color: #00ff88">root@system</span>
        <span class="cp-mono" style="color: var(--color-foreground)">:</span>
        <span class="cp-mono" style="color: var(--color-accent)">~/quotes</span>
        <span class="cp-mono" style="color: var(--color-foreground)">$ </span>
        <span class="cp-mono" style="color: var(--color-heading)">echo quote</span>
        <span class="cp-cursor-blink cp-mono" style="color: var(--color-accent)">&#9608;</span>
      </div>

      <!-- 引用装饰 -->
      <div class="cp-quote-marks">/*</div>

      <!-- 引用内容 -->
      <div v-html="slide.html" class="cp-quote-content" />

      <!-- 闭合装饰 -->
      <div class="cp-quote-marks cp-quote-end">*/</div>

      <!-- 底部状态标签 -->
      <div class="mt-6 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">QUOTE::RECEIVED</span>
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

.cp-terminal-prompt {
  font-size: calc(0.85rem * var(--content-scale));
  letter-spacing: 0.02em;
  opacity: 0.85;
}

.cp-cursor-blink {
  animation: cp-cursor 0.8s step-end infinite;
}

@keyframes cp-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cp-quote-marks {
  font-size: 4rem;
  line-height: 1;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  color: color-mix(in srgb, var(--color-accent) 20%, transparent);
  text-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 15%, transparent);
  user-select: none;
  pointer-events: none;
}

.cp-quote-end {
  transform: rotate(0deg);
  margin-top: 0;
}

.cp-quote-content :deep(blockquote),
.cp-quote-content :deep(p) {
  font-size: var(--fs-quote, 1.8rem);
  font-weight: 300;
  line-height: 1.5;
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 10%, transparent);
  margin: 1rem 0;
  max-width: 40rem;
  text-align: center;
}

.cp-quote-content :deep(h3),
.cp-quote-content :deep(h4) { display: none; }

.cp-quote-content :deep(strong),
.cp-quote-content :deep(em) {
  color: var(--color-accent);
  text-shadow: 0 0 12px var(--color-accent);
  font-style: normal;
}
</style>
