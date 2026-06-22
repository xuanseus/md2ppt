<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-section w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- 底部状态栏 -->
    <div class="absolute bottom-0 left-0 right-0 z-20 cp-statusbar" style="height: 32px; background: color-mix(in srgb, var(--color-card) 90%, transparent); border-top: 1px solid var(--color-border)">
      <div class="flex items-center justify-between h-full px-4" style="font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace">
        <div class="flex items-center gap-4">
          <span class="text-xs" style="color: var(--color-accent)">SECT</span>
          <span class="text-xs opacity-50" style="color: var(--color-muted-foreground)">PROGRESS</span>
          <!-- 进度条 -->
          <div class="cp-progress-track" style="width: 120px">
            <div class="cp-progress-active cp-shimmer" :style="{ width: Math.min((slide.index + 1) * 10, 100) + '%' }" />
          </div>
          <span class="text-xs" style="color: var(--color-accent)">{{ Math.min((slide.index + 1) * 10, 100) }}%</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs opacity-50" style="color: var(--color-muted-foreground)">LINE: {{ slide.index + 1 }}</span>
          <span class="text-xs opacity-50" style="color: var(--color-muted-foreground)">COL: 1</span>
          <span class="text-xs cp-blink" style="color: #00ff88">● ACTIVE</span>
        </div>
      </div>
    </div>

    <div class="absolute z-10" style="top: 15%; left: 10%; right: 10%">
      <!-- 终端 prompt 行 -->
      <div class="cp-terminal-prompt mb-8">
        <span class="cp-mono" style="color: #00ff88">root@system</span>
        <span class="cp-mono" style="color: var(--color-foreground)">:</span>
        <span class="cp-mono" style="color: var(--color-accent)">~/chapters</span>
        <span class="cp-mono" style="color: var(--color-foreground)">$ </span>
        <span class="cp-mono" style="color: var(--color-heading)">cat chapter</span>
        <span class="cp-cursor-blink cp-mono" style="color: var(--color-accent)">█</span>
      </div>

      <!-- 章节标题 -->
      <h2 v-if="slide.title" class="cp-section-title">{{ slide.title }}</h2>

      <!-- 副标题/描述 -->
      <div v-if="slide.html" v-html="slide.html" class="cp-section-sub" />

      <!-- 输出分隔线 -->
      <div class="mt-6 flex items-center gap-2 opacity-40">
        <span class="cp-mono text-xs" style="color: var(--color-muted-foreground)">OUTPUT</span>
        <div class="flex-1" style="height: 1px; background: repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 4px, transparent 4px, transparent 8px)" />
        <span class="cp-mono text-xs" style="color: var(--color-muted-foreground)">EOF</span>
      </div>
    </div>

    <!-- 装饰：右侧竖排系统日志 -->
    <div class="absolute right-4 top-1/4 bottom-1/3 pointer-events-none opacity-15">
      <div class="cp-mono text-xs cp-vertical-text" style="color: var(--color-accent); writing-mode: vertical-rl; letter-spacing: 0.3em">
        SYS_LOG_v4.2.1_KERNEL_PANIC_0xFF
      </div>
    </div>

    <!-- 装饰：左侧数据点阵 -->
    <div class="absolute left-8 top-1/3 bottom-1/3 flex flex-col gap-3 pointer-events-none opacity-20">
      <span v-for="n in 8" :key="n" class="w-1 h-1 rounded-full cp-fade-dot" :style="{
        background: n % 3 === 0 ? 'var(--color-accent)' : n % 3 === 1 ? 'var(--color-h1-to)' : '#00ff88',
        boxShadow: n % 3 === 0 ? '0 0 6px var(--color-accent)' : n % 3 === 1 ? '0 0 6px var(--color-h1-to)' : '0 0 6px #00ff88',
        animationDelay: (n * 0.2) + 's',
      }" />
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

.cp-terminal-prompt {
  font-size: calc(0.9rem * var(--content-scale));
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

.cp-section-title {
  font-size: calc(4rem * var(--content-scale));
  font-weight: 900;
  line-height: 1.1;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 50px var(--color-accent), 0 0 100px color-mix(in srgb, var(--color-accent) 30%, transparent);
  text-transform: uppercase;
}

.cp-section-sub :deep(h1),
.cp-section-sub :deep(h2),
.cp-section-sub :deep(h3),
.cp-section-sub :deep(h4) {
  display: none;
}

.cp-section-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  margin-top: 1rem;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 10px color-mix(in srgb, var(--color-accent) 8%, transparent);
}

.cp-progress-track {
  height: 4px;
  background: color-mix(in srgb, var(--color-muted) 60%, transparent);
  border-radius: 2px;
  overflow: hidden;
}

.cp-progress-active {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-h1-to));
  border-radius: 2px;
  box-shadow: 0 0 8px var(--color-accent);
}

.cp-shimmer {
  animation: cp-shimmer 2s ease-in-out infinite;
}

@keyframes cp-shimmer {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.cp-blink { animation: cp-blink 1.5s step-end infinite; }

@keyframes cp-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.cp-fade-dot { animation: cp-dot-fade 3s ease-in-out infinite; }

@keyframes cp-dot-fade {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.cp-vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.55rem;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
}
</style>
