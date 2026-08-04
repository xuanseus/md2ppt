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
    <div class="absolute left-[8%] top-[15%] w-56 h-56 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[10%] bottom-[18%] w-44 h-44 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 左上角竖向引导线 -->
    <div class="absolute left-[12%] top-[12%] pointer-events-none opacity-[0.04]"
      style="height: 5rem; width: 1px; background: linear-gradient(180deg, transparent, var(--color-foreground))" />

    <div class="wrap relative z-10" style="max-width: 40rem; width: 100%; padding: 3rem; text-align: center;">

      <!-- 开引号 -->
      <div class="quote-mark-top">&#x201C;</div>

      <!-- 引用内容 -->
      <div v-html="slide.html" class="quote-prose" />

      <!-- 闭引号 -->
      <div class="quote-mark-bottom">&#x201D;</div>

      <!-- 来源 — 标题在此作为引用者 -->
      <div v-if="slide.title" class="quote-attr">
        <span class="attr-dash" />
        {{ slide.title }}
      </div>
    </div>

    <!-- 右下竖向引导线 -->
    <div class="absolute right-[12%] bottom-[12%] pointer-events-none opacity-[0.04]"
      style="height: 5rem; width: 1px; background: linear-gradient(0deg, transparent, var(--color-foreground))" />
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.quote-mark-top,
.quote-mark-bottom {
  font-size: 8rem;
  line-height: 1;
  font-family: 'Noto Serif SC', 'STSong', 'SimSun', Georgia, serif;
  color: var(--color-ink-wash);
  opacity: 0.12;
  user-select: none;
  pointer-events: none;
}

.quote-mark-bottom {
  transform: rotate(180deg);
  margin-top: -1rem;
}

.quote-prose :deep(blockquote),
.quote-prose :deep(p) {
  font-size: var(--fs-quote, 2rem);
  font-weight: 300;
  line-height: 1.6;
  color: var(--color-foreground);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  margin: 0.5rem 0;
  letter-spacing: 0.04em;
}

.quote-attr {
  margin-top: 2rem;
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.attr-dash {
  display: inline-block;
  width: 2rem;
  height: 1px;
  background: var(--color-ink-light);
  opacity: 0.3;
}
</style>
