<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="sm-cover w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 左侧留白区域 -->
    <div class="absolute left-0 top-0 bottom-0 pointer-events-none" style="width: 30%;">
      <!-- 中间印章 -->
      <div class="sm-seal absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none shrink-0"
        style="border: 2px solid var(--color-seal); width: 56px; height: 56px; color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', 'SimSun', serif; writing-mode: vertical-rl; font-size: 0.7rem; letter-spacing: 0.15em; transform: rotate(-6deg); opacity: 0.55">
        水墨
      </div>
    </div>

    <!-- 竖向分隔线 -->
    <div class="absolute pointer-events-none opacity-[0.06]"
      style="left: 30%; top: 15%; bottom: 15%; width: 1px; background: linear-gradient(180deg, transparent 0%, var(--color-foreground) 30%, var(--color-foreground) 70%, transparent 100%)" />

    <!-- 右侧 70% 竖排双列 -->
    <div class="absolute right-0 top-0 bottom-0 flex items-center justify-center"
      style="width: 70%; padding: 3rem;">

      <div class="relative h-full flex items-center" style="writing-mode: vertical-rl; text-orientation: mixed; flex-direction: column; gap: 4rem;">
        <!-- 标题列 -->
        <h1 v-if="slide.title" class="sm-cover-title">{{ slide.title }}</h1>
        <!-- 内容列 -->
        <div v-if="slide.html" v-html="slide.html" class="sm-cover-prose" />
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
  letter-spacing: 0.18em;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  line-height: 1.3;
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
  line-height: 2.2;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  letter-spacing: 0.08em;
}
</style>
