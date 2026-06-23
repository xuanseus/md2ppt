<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 -->
    <div class="absolute -top-20 left-[20%] w-64 h-64 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute -bottom-16 right-[10%] w-48 h-48 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 上部留白区域 — 印章 -->
    <div class="absolute top-0 left-0 right-0 pointer-events-none" style="height: 28%;">
      <div class="sm-seal absolute right-[12%] top-1/2 -translate-y-1/2 flex items-center justify-center select-none shrink-0"
        style="border: 2px solid var(--color-seal); width: 50px; height: 50px; color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', 'SimSun', serif; writing-mode: vertical-rl; font-size: 0.6rem; letter-spacing: 0.12em; transform: rotate(-5deg); opacity: 0.5">
        墨韵
      </div>
    </div>

    <!-- 横向分隔线 -->
    <div class="absolute left-[12%] right-[12%] pointer-events-none opacity-[0.06]"
      style="top: 28%; height: 1px; background: linear-gradient(90deg, transparent 0%, var(--color-foreground) 30%, var(--color-foreground) 70%, transparent 100%)" />

    <!-- 下方内容区域 — 标题左 + 描述右 -->
    <div class="absolute bottom-0 left-0 right-0 flex" style="top: 28%;">

      <!-- 左侧 40%：竖排标题 -->
      <div class="flex items-center justify-center" style="width: 40%; padding: 2rem;">
        <div style="writing-mode: vertical-rl; text-orientation: mixed;">
          <h1 v-if="slide.title" class="split-title">{{ slide.title }}</h1>
        </div>
      </div>

      <!-- 竖向分隔线 -->
      <div class="pointer-events-none opacity-[0.06]"
        style="width: 1px; margin: 2rem 0; background: linear-gradient(180deg, transparent 0%, var(--color-foreground) 30%, var(--color-foreground) 70%, transparent 100%)" />

      <!-- 右侧 60%：描述文字 -->
      <div class="flex items-center" style="width: 60%; padding: 2.5rem 3rem;">
        <div v-if="slide.html" v-html="slide.html" class="split-prose" />
      </div>
    </div>

    <!-- 右下墨点装饰 -->
    <div class="absolute right-8 bottom-8 flex flex-col gap-3 opacity-[0.06] pointer-events-none">
      <span class="w-2 h-2 rounded-full" style="background: var(--color-ink-light)" />
      <span class="w-2.5 h-2.5 rounded-sm rotate-45" style="background: var(--color-seal)" />
      <span class="w-2 h-2 rounded-full" style="background: var(--color-ink-light)" />
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.split-title {
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  line-height: 1.3;
  text-shadow:
    1px 0 0 var(--color-ink-wash),
    0 1px 0 var(--color-ink-wash);
}

.split-prose :deep(h1),
.split-prose :deep(h2),
.split-prose :deep(h3),
.split-prose :deep(h4),
.split-prose :deep(h5),
.split-prose :deep(h6) {
  display: none;
}

.split-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 2.2;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  letter-spacing: 0.08em;
  text-indent: 2em;
}
</style>
