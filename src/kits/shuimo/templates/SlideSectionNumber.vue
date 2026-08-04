<script setup lang="ts">
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const num = (props.slide.rawMd.match(/\{num:\s*(\d+)\}/i) || [])[1] || '壹'
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden"
    style="background: linear-gradient(180deg, var(--color-muted) 0%, var(--color-background) 100%)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 左侧留白 — 序号大字 -->
    <div class="absolute left-0 top-0 bottom-0 flex items-center justify-center pointer-events-none select-none" style="width: 32%;">
      <span class="section-num-watermark">{{ num }}</span>
    </div>

    <!-- 竖向分隔线 -->
    <div class="absolute pointer-events-none opacity-[0.05]"
      style="left: 32%; top: 15%; bottom: 15%; width: 1px; background: linear-gradient(180deg, transparent 0%, var(--color-foreground) 30%, var(--color-foreground) 70%, transparent 100%)" />

    <!-- 右侧 68% — 竖排文字 -->
    <div class="absolute right-0 top-0 bottom-0 flex items-center justify-center"
      style="width: 68%; padding: 3rem;">

      <div class="relative h-full flex items-center" style="writing-mode: vertical-rl; text-orientation: mixed; flex-direction: column; gap: 4rem;">

        <!-- 竖排标题 -->
        <h2 v-if="slide.title" class="section-num-title">
          {{ slide.title }}
        </h2>

        <!-- 竖排副标题 -->
        <div v-if="slide.html" v-html="slide.html" class="section-num-sub" />

        <!-- 右侧墨点装饰 -->
        <div class="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center gap-6 opacity-[0.07]">
          <span class="w-2 h-2 rounded-full" style="background: var(--color-ink-light)" />
          <span class="w-3 h-3 rounded-sm rotate-45" style="background: var(--color-seal)" />
          <span class="w-2 h-2 rounded-full" style="background: var(--color-ink-light)" />
        </div>
      </div>
    </div>

    <!-- 右下角墨晕 -->
    <div class="absolute -bottom-8 right-0 w-52 h-36 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse at 70% 80%, var(--color-foreground) 0%, transparent 70%)" />
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.section-num-watermark {
  font-size: calc(10rem * var(--content-scale));
  font-weight: 900;
  color: var(--color-ink-wash);
  opacity: 0.1;
  font-family: 'Noto Serif SC', 'STSong', 'SimSun', serif;
  letter-spacing: 0.1em;
  user-select: none;
}

.section-num-title {
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

.section-num-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 2.2;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 0 1.5rem;
  letter-spacing: 0.08em;
}
</style>
