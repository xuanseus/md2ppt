<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="sm-quote w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 — 右上角浓墨，左下角淡墨 -->
    <div class="absolute -top-20 -right-10 w-80 h-72 rounded-full pointer-events-none opacity-[0.04]"
      style="background: radial-gradient(ellipse at 60% 40%, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute -bottom-16 -left-8 w-56 h-56 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse at 40% 50%, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 水墨笔触引号 — 不是印刷体引号，而是毛笔书写的引号效果 -->
    <div class="sm-brush-quote-left" aria-hidden="true">&#x300E;</div>
    <div class="sm-brush-quote-right" aria-hidden="true">&#x300F;</div>

    <!-- 主体引用内容 — 竖排，从右到左 -->
    <div class="sm-quote-content-wrapper">
      <div class="sm-quote-vertical" v-html="slide.html" />
    </div>

    <!-- 右侧竖线 -->
    <div class="absolute right-16 top-1/4 bottom-1/4 w-px pointer-events-none opacity-[0.06]"
      style="background: linear-gradient(180deg, transparent, var(--color-foreground) 30%, var(--color-foreground) 70%, transparent)" />

    <!-- 右下角印章 -->
    <div class="sm-seal absolute bottom-10 right-10 w-14 h-14 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.55rem; letter-spacing: 0.1em; transform: rotate(7deg); opacity: 0.45; padding: 2px;">
      引
    </div>
  </div>
</template>

<style scoped>
.sm-quote {
  padding: 2rem;
}

.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

/* 水墨笔触引导号 — 用巨大的毛笔书写引号作为背景装饰 */
.sm-brush-quote-left {
  position: absolute;
  top: 8%;
  left: 8%;
  font-size: 16rem;
  line-height: 1;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', serif;
  color: var(--color-foreground);
  opacity: 0.035;
  pointer-events: none;
  user-select: none;
  /* 模拟毛笔的粗细变化 */
  transform: scaleX(1.3) scaleY(0.9);
  text-shadow:
    4px 2px 2px color-mix(in srgb, var(--color-ink-wash) 40%, transparent),
    -2px -1px 1px color-mix(in srgb, var(--color-ink-wash) 30%, transparent);
}

.sm-brush-quote-right {
  position: absolute;
  bottom: 8%;
  right: 8%;
  font-size: 16rem;
  line-height: 1;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', serif;
  color: var(--color-foreground);
  opacity: 0.035;
  pointer-events: none;
  user-select: none;
  transform: scaleX(1.3) scaleY(0.9);
  text-shadow:
    4px 2px 2px color-mix(in srgb, var(--color-ink-wash) 40%, transparent),
    -2px -1px 1px color-mix(in srgb, var(--color-ink-wash) 30%, transparent);
}

/* 竖排引用内容容器 — 从右向左排列列 */
.sm-quote-content-wrapper {
  position: absolute;
  inset: 12%;
  display: flex;
  flex-direction: row-reverse; /* 从右向左排列 */
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 竖排引用文字 */
.sm-quote-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  max-height: 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 2rem;
}

.sm-quote-vertical :deep(blockquote),
.sm-quote-vertical :deep(p) {
  font-size: var(--fs-quote);
  font-weight: 300;
  line-height: 2.4;
  font-style: normal;
  border: none;
  margin: 0;
  padding: 0;
  color: var(--color-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  letter-spacing: 0.08em;
  text-indent: 0;
}

.sm-quote-vertical :deep(h1),
.sm-quote-vertical :deep(h2),
.sm-quote-vertical :deep(h3),
.sm-quote-vertical :deep(h4) {
  display: none;
}

.sm-quote-vertical :deep(strong) {
  font-weight: 700;
  color: var(--color-heading);
}
</style>
