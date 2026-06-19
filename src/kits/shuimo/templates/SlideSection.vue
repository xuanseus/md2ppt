<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="sm-section w-full h-full relative overflow-hidden"
    style="background: linear-gradient(180deg, var(--color-muted) 0%, var(--color-background) 100%)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 左侧大面积留白 — 仅顶部淡淡墨晕 -->
    <div class="absolute left-0 top-0 bottom-0 pointer-events-none" style="width: 42%;">
      <div class="absolute top-[10%] left-[15%] w-48 h-48 rounded-full opacity-[0.03]"
        style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    </div>

    <!-- 竖向分隔线 -->
    <div class="absolute pointer-events-none opacity-[0.06]"
      style="left: 42%; top: 15%; bottom: 15%; width: 1px; background: linear-gradient(180deg, transparent 0%, var(--color-foreground) 30%, var(--color-foreground) 70%, transparent 100%)" />

    <!-- 右侧竖排文字区域 -->
    <div class="absolute right-0 top-0 bottom-0 flex items-center"
      style="width: 58%; padding: 3rem;">

      <div class="relative w-full h-full flex items-center" style="writing-mode: vertical-rl; text-orientation: mixed;">

        <!-- 竖排印章（章节号） -->
        <div class="sm-seal absolute left-[2%] top-1/2 -translate-y-1/2 flex items-center justify-center select-none shrink-0"
          style="border: 2px solid var(--color-seal); width: 52px; height: 52px; color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: horizontal-tb; font-size: 0.65rem; transform: rotate(-3deg); opacity: 0.6; flex-direction: column; line-height: 1.2; text-align: center;">
          <span>第</span>
          <span>{{ String(slide.index + 1).padStart(2, '0') }}</span>
          <span>章</span>
        </div>

        <!-- 竖排标题 -->
        <h2 v-if="slide.title" class="sm-section-title">
          {{ slide.title }}
        </h2>

        <!-- 竖排副标题 / 内文 -->
        <div v-if="slide.html" v-html="slide.html" class="sm-section-sub" />

        <!-- 右侧边栏墨点装饰 -->
        <div class="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center gap-6 opacity-[0.08]">
          <span class="w-2 h-2 rounded-full" style="background: var(--color-ink-light)" />
          <span class="w-3 h-3 rounded-sm rotate-45" style="background: var(--color-seal)" />
          <span class="w-2 h-2 rounded-full" style="background: var(--color-ink-light)" />
        </div>
      </div>
    </div>

    <!-- 右上角水墨晕染 -->
    <div class="absolute -top-16 right-0 w-64 h-40 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse at 70% 20%, var(--color-foreground) 0%, transparent 70%)" />
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.sm-section-title {
  font-size: calc(4rem * var(--content-scale));
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 0 2rem;
  line-height: 1.3;
  text-shadow:
    1px 0 0 var(--color-ink-wash),
    0 1px 0 var(--color-ink-wash);
}

.sm-section-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 2.2;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 0 1.5rem;
  letter-spacing: 0.08em;
}

.sm-section-sub :deep(h1),
.sm-section-sub :deep(h2),
.sm-section-sub :deep(h3) {
  display: none;
}
</style>
