<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="sm-stats w-full h-full relative overflow-hidden"
    style="background: linear-gradient(180deg, var(--color-background) 0%, var(--color-muted) 100%)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 — 中央一团淡墨 -->
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full pointer-events-none"
      style="background: radial-gradient(ellipse at center, var(--color-ink-wash) 0%, transparent 70%); opacity: 0.5" />

    <!-- 散落墨点 — 仿毛笔甩墨 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      <span v-for="n in 8" :key="n" class="absolute rounded-full" :style="{
        width: (6 + (n % 4) * 8) + 'px',
        height: (6 + (n % 4) * 8) + 'px',
        left: ((n * 47 + 13) % 80 + 10) + '%',
        top: ((n * 59 + 7) % 80 + 10) + '%',
        background: 'var(--color-foreground)',
      }" />
    </div>

    <!-- 左侧竖线 — 题跋的"引首章"位置 -->
    <div class="absolute left-10 top-1/4 bottom-1/4 w-px pointer-events-none opacity-[0.06]"
      style="background: linear-gradient(180deg, transparent, var(--color-foreground) 30%, var(--color-foreground) 70%, transparent)" />

    <!-- 主体：数字大字报 + 题跋 -->
    <div class="relative z-10 w-full h-full flex flex-col items-center justify-center px-16">
      <!-- 顶部细线题记 -->
      <div class="sm-stats-hatnote mb-4" v-if="slide.html">
        <!-- 提取第一段小字作为题跋上款 -->
        <div class="text-center opacity-25 tracking-[0.25em]"
          style="font-size: 0.6rem; color: var(--color-muted-foreground); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: horizontal-tb;">
          题记
        </div>
      </div>

      <!-- 数据正文 — 大字，墨渍晕染效果 -->
      <div v-html="slide.html" class="sm-stats-prose" />

      <!-- 底部题跋落款 -->
      <div class="sm-stats-inscription mt-6">
        <div class="flex items-center gap-4 opacity-20">
          <span class="w-8 h-px" style="background: var(--color-ink-light)" />
          <span class="text-xs tracking-[0.3em]"
            style="color: var(--color-muted-foreground); font-family: 'KaiTi', 'STKaiti', serif;">
            岁次甲辰
          </span>
          <span class="w-8 h-px" style="background: var(--color-ink-light)" />
        </div>
      </div>
    </div>

    <!-- 右下印章 -->
    <div class="sm-seal absolute bottom-12 right-12 w-12 h-12 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.55rem; letter-spacing: 0.1em; transform: rotate(-4deg); opacity: 0.4;">
      数
    </div>
  </div>
</template>

<style scoped>
.sm-stats {
  padding: 2rem;
}

.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

/* 大数字 — 核心大字报 */
.sm-stats-prose :deep(strong) {
  display: block;
  font-size: var(--fs-stat);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1.5rem;
  color: var(--color-foreground);
  font-family: 'Noto Serif SC', 'STSong', 'SimSun', Georgia, serif;
  text-align: center;
  animation: sm-ink-bleed 2.5s ease-out;
  /* 墨渍晕染：多层 text-shadow 模拟墨水在宣纸上洇开 */
  text-shadow:
    0 0 2px var(--color-ink-wash),
    0 0 4px var(--color-ink-wash),
    1px 1px 8px color-mix(in srgb, var(--color-ink-wash) 60%, transparent),
    2px 2px 16px color-mix(in srgb, var(--color-ink-light) 30%, transparent),
    -1px -1px 4px color-mix(in srgb, var(--color-ink-wash) 40%, transparent);
}

@keyframes sm-ink-bleed {
  0% {
    opacity: 0;
    filter: blur(12px);
    transform: scale(0.92);
  }
  40% {
    opacity: 1;
    filter: blur(3px);
    transform: scale(1.02);
  }
  70% {
    filter: blur(0.5px);
    transform: scale(0.99);
  }
  100% {
    filter: blur(0);
    transform: scale(1);
    opacity: 1;
  }
}

.sm-stats-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  margin-top: 1.5rem;
  line-height: 1.8;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  text-align: center;
  max-width: 70%;
  margin-left: auto;
  margin-right: auto;
}
</style>
