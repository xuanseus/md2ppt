<script setup lang="ts">
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const icon = (props.slide.rawMd.match(/\{icon:\s*(\S+)\}/i) || [])[1] || '墨'
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden"
    style="background: linear-gradient(180deg, var(--color-muted) 0%, var(--color-background) 100%)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 左侧留白 — 淡墨晕 -->
    <div class="absolute left-0 top-0 bottom-0 pointer-events-none" style="width: 32%;">
      <div class="absolute top-[12%] left-[18%] w-44 h-44 rounded-full opacity-[0.03]"
        style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    </div>

    <!-- 竖向分隔线 -->
    <div class="absolute pointer-events-none opacity-[0.05]"
      style="left: 32%; top: 15%; bottom: 15%; width: 1px; background: linear-gradient(180deg, transparent 0%, var(--color-foreground) 30%, var(--color-foreground) 70%, transparent 100%)" />

    <!-- 右侧 68% — 竖排布局 -->
    <div class="absolute right-0 top-0 bottom-0 flex items-center justify-center"
      style="width: 68%; padding: 3rem;">

      <div class="relative h-full flex items-center" style="writing-mode: vertical-rl; text-orientation: mixed; flex-direction: column; gap: 3rem;">

        <!-- 图标 — 宣纸边框，印章风格 -->
        <div class="section-icon-box flex items-center justify-center select-none"
          style="border: 2px solid var(--color-seal); width: 56px; height: 56px; color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 1.2rem; opacity: 0.6; transform: rotate(-3deg);">
          {{ icon }}
        </div>

        <!-- 竖排标题 -->
        <h2 v-if="slide.title" class="section-icon-title">
          {{ slide.title }}
        </h2>

        <!-- 竖排副标题 -->
        <div v-if="slide.html" v-html="slide.html" class="section-icon-sub" />
      </div>
    </div>

    <!-- 右上墨晕 -->
    <div class="absolute -top-12 right-0 w-56 h-36 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse at 70% 20%, var(--color-foreground) 0%, transparent 70%)" />
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.section-icon-title {
  font-size: calc(3.5rem * var(--content-scale));
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

.section-icon-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 2.2;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 0 1.5rem;
  letter-spacing: 0.08em;
}

.section-icon-sub :deep(h1),
.section-icon-sub :deep(h2),
.section-icon-sub :deep(h3) {
  display: none;
}
</style>
