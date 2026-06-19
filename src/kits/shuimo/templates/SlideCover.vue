<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="sm-cover w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 左侧留白区域 — 几乎完全空白，仅一条细笔触竖线和印章 -->
    <div class="absolute left-0 top-0 bottom-0 pointer-events-none"
      style="width: 33%; border-right: 1px solid var(--color-ink-wash)">
      <!-- 顶部笔触 -->
      <div class="absolute left-1/2 top-[15%] w-px h-24 opacity-[0.08]"
        style="background: linear-gradient(180deg, transparent, var(--color-foreground) 60%, transparent)" />
      <!-- 中间小印章 -->
      <div class="sm-seal absolute left-1/2 top-[45%] -translate-x-1/2 flex items-center justify-center select-none shrink-0"
        style="border: 2px solid var(--color-seal); width: 56px; height: 56px; color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', 'SimSun', serif; writing-mode: vertical-rl; font-size: 0.7rem; letter-spacing: 0.15em; transform: rotate(-6deg); opacity: 0.55">
        水墨
      </div>
      <!-- 底部落款 -->
      <div class="absolute left-8 bottom-12 opacity-[0.12] select-none"
        style="width: 2px; height: 60px; background: linear-gradient(180deg, transparent, var(--color-foreground) 30%, var(--color-foreground) 70%, transparent)" />
    </div>

    <!-- 右侧 2/3 主体区域 -->
    <div class="absolute right-0 top-0 bottom-0 flex flex-col justify-center"
      style="width: 67%; padding: 4rem 5rem 4rem 4rem">

      <!-- 墨迹背景晕染 -->
      <div class="absolute right-[-10%] top-[10%] w-[70%] h-[80%] rounded-full pointer-events-none"
        style="background: radial-gradient(ellipse at 60% 50%, var(--color-ink-wash) 0%, transparent 70%); opacity: 0.5" />
      <div class="absolute right-[20%] top-[-5%] w-[50%] h-[40%] rounded-full pointer-events-none"
        style="background: radial-gradient(ellipse at 70% 30%, var(--color-ink-light) 0%, transparent 60%); opacity: 0.08" />

      <div class="relative z-10">
        <!-- 顶部分隔笔触 -->
        <div class="flex items-center gap-3 mb-10">
          <span class="w-3 h-3 rounded-sm rotate-45 opacity-50" style="background: var(--color-seal)" />
          <div class="flex-1 h-px opacity-20" style="background: linear-gradient(90deg, var(--color-foreground), transparent)" />
        </div>

        <!-- 标题 -- 大幅书法字 -->
        <h1 v-if="slide.title" class="sm-cover-title">{{ slide.title }}</h1>

        <!-- 内文 -->
        <div v-html="slide.html" class="sm-cover-prose" />

        <!-- 底部分隔笔触 -->
        <div class="flex items-center gap-3 mt-10">
          <div class="flex-1 h-px opacity-15" style="background: linear-gradient(90deg, transparent, var(--color-foreground))" />
          <span class="w-2 h-2 rounded-full opacity-35" style="background: var(--color-ink-light)" />
          <span class="w-1.5 h-1.5 rounded-full opacity-20" style="background: var(--color-seal)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.sm-cover-title {
  font-size: calc(5rem * var(--content-scale));
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.12em;
  color: var(--color-heading);
  margin-bottom: 2rem;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  /* 仿毛笔飞白效果 */
  text-shadow:
    1px 0 0 var(--color-ink-wash),
    -1px 0 0 var(--color-ink-wash),
    0 1px 0 var(--color-ink-wash);
}

.sm-cover-prose :deep(h1),
.sm-cover-prose :deep(h2),
.sm-cover-prose :deep(h3),
.sm-cover-prose :deep(h4),
.sm-cover-prose :deep(h5),
.sm-cover-prose :deep(h6) {
  display: none;
}

.sm-cover-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  margin-top: 0.5rem;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  letter-spacing: 0.06em;
  max-width: 85%;
}
</style>
