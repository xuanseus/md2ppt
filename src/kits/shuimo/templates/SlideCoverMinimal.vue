<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden flex items-center justify-center"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 -->
    <div class="absolute left-[5%] top-[15%] w-56 h-56 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[8%] bottom-[20%] w-44 h-44 rounded-full pointer-events-none opacity-[0.035]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 主体内容居中 -->
    <div class="wrap relative z-10 flex flex-col items-center text-center" style="max-width: 48rem; padding: 3rem;">

      <!-- 印章在上方 -->
      <div class="sm-seal mb-8 flex items-center justify-center select-none shrink-0"
        style="border: 2px solid var(--color-seal); width: 44px; height: 44px; color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', 'SimSun', serif; writing-mode: vertical-rl; font-size: 0.55rem; letter-spacing: 0.12em; transform: rotate(-4deg); opacity: 0.5">
        终章
      </div>

      <!-- 标题 -->
      <h1 v-if="slide.title" class="minimal-title">{{ slide.title }}</h1>

      <!-- 描述 -->
      <div v-if="slide.html" v-html="slide.html" class="minimal-prose" />

      <!-- 底部横线装饰 -->
      <div class="mt-10 w-24 pointer-events-none opacity-[0.12]"
        style="height: 1px; background: linear-gradient(90deg, transparent, var(--color-foreground), transparent)" />
    </div>

    <!-- 左下墨点 -->
    <div class="absolute left-8 bottom-8 flex items-center gap-3 opacity-[0.06] pointer-events-none">
      <span class="w-2 h-2 rounded-full" style="background: var(--color-ink-light)" />
      <span class="w-3 h-0.5 rounded-full" style="background: var(--color-ink-light)" />
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

.minimal-title {
  font-size: calc(4rem * var(--content-scale));
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  line-height: 1.3;
  margin-bottom: 1.5rem;
  text-shadow:
    1px 0 0 var(--color-ink-wash),
    0 1px 0 var(--color-ink-wash);
}

.minimal-prose :deep(h1),
.minimal-prose :deep(h2),
.minimal-prose :deep(h3) {
  display: none;
}

.minimal-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 2;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  letter-spacing: 0.06em;
  text-indent: 2em;
}
</style>
