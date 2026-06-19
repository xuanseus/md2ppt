<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-cover flex items-center justify-center w-full h-full" style="background: linear-gradient(180deg, #0a0a2e 0%, #1a0a3e 30%, #0a0a2e 60%, #1a0a3e 100%)">
    <!-- 像素星空背景 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <span
        v-for="s in 30"
        :key="'star'+s"
        class="absolute"
        :style="{
          left: ((s * 73 + 17) % 94) + '%',
          top: ((s * 41 + 11) % 90) + '%',
          width: (2 + (s % 4)) + 'px',
          height: (2 + (s % 4)) + 'px',
          background: s % 5 === 0 ? '#ffe066' : s % 3 === 0 ? '#a0d2db' : '#ffffff',
          opacity: 0.3 + (s % 5) * 0.12,
          animation: 'px-star-twinkle ' + (2 + (s % 3) * 0.8) + 's step-end infinite',
          animationDelay: (s * 0.17) + 's',
        }"
      />
    </div>

    <!-- 8-bit 装饰边框 -->
    <div class="absolute pointer-events-none" style="inset: 32px; border: 4px solid var(--color-accent); box-shadow: inset 0 0 0 4px #0a0a2e, 0 0 0 4px var(--color-accent), 8px 8px 0 #0008" />

    <!-- 边框四角像素块 -->
    <div class="absolute top-8 left-8 pointer-events-none" style="width: 16px; height: 16px; background: var(--color-accent); box-shadow: 16px 0 0 var(--color-accent)" />
    <div class="absolute top-8 right-8 pointer-events-none" style="width: 16px; height: 16px; background: var(--color-accent); box-shadow: -16px 0 0 var(--color-accent)" />
    <div class="absolute bottom-8 left-8 pointer-events-none" style="width: 16px; height: 16px; background: var(--color-accent); box-shadow: 16px 0 0 var(--color-accent)" />
    <div class="absolute bottom-8 right-8 pointer-events-none" style="width: 16px; height: 16px; background: var(--color-accent); box-shadow: -16px 0 0 var(--color-accent)" />

    <!-- 顶部像素装饰横幅 -->
    <div class="absolute top-0 left-0 right-0 pointer-events-none" style="height: 12px; background: repeating-linear-gradient(90deg, var(--color-accent) 0px, var(--color-accent) 8px, transparent 8px, transparent 16px)" />

    <div class="relative z-10 w-full max-w-6xl px-12 text-center">
      <!-- 副标题 / 日期标签 -->
      <div class="inline-block px-6 py-2 mb-6" style="background: var(--color-card); border: 2px solid var(--color-border); box-shadow: 3px 3px 0 var(--color-accent)">
        <span class="text-sm font-bold tracking-widest uppercase" style="color: var(--color-accent); font-family: var(--px-font)">
          ▶ New Game
        </span>
      </div>

      <!-- 游戏标题 -->
      <h1 v-if="slide.title" class="px-cover-title">{{ slide.title }}</h1>

      <!-- 副标题内容 -->
      <div v-html="slide.html" class="px-cover-prose" />

      <!-- 像素装饰分隔线 -->
      <div class="mt-8 flex items-center justify-center gap-1" style="font-family: monospace; color: var(--color-accent); opacity: 0.5; font-size: 1.2rem; letter-spacing: -2px">
        ◆ ◇ ◆ ◇ ◆ ◇ ◆
      </div>

      <!-- PRESS START 闪烁文字 -->
      <div class="px-press-start mt-6">
        — PRESS START —
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes px-star-twinkle {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.7; }
}

@keyframes px-press-blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.px-cover-title {
  font-size: calc(4.5rem * var(--content-scale));
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: 0.04em;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  font-family: var(--px-font);
  text-shadow:
    0 0 10px color-mix(in srgb, var(--color-accent) 30%, transparent),
    3px 3px 0 #0004;
}

.px-press-start {
  font-size: calc(1.2rem * var(--content-scale));
  font-family: var(--px-font);
  color: var(--color-accent);
  letter-spacing: 0.2em;
  animation: px-press-blink 1.2s step-end infinite;
}

.px-cover-prose :deep(h1),
.px-cover-prose :deep(h2),
.px-cover-prose :deep(h3),
.px-cover-prose :deep(h4),
.px-cover-prose :deep(h5),
.px-cover-prose :deep(h6) {
  display: none;
}

.px-cover-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  margin-top: 0.5rem;
  font-family: var(--px-font);
}
</style>
