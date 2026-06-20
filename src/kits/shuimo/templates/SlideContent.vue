<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="sm-content w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 — 多个不对称分布 -->
    <div class="absolute left-[5%] top-[10%] w-56 h-56 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[8%] bottom-[15%] w-40 h-40 rounded-full pointer-events-none opacity-[0.04]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 左侧竖排"旁注"区域 — 小号竖排文字 -->
    <div v-if="slide.title" class="absolute left-8 top-1/2 -translate-y-1/2 z-10"
      style="writing-mode: vertical-rl; text-orientation: mixed; max-height: 70%;">
      <div class="sm-side-note">
        <span class="block text-xs tracking-widest opacity-25"
          style="color: var(--color-muted-foreground); font-family: 'KaiTi', 'STKaiti', serif; font-size: 0.65rem; letter-spacing: 0.25em;">
          {{ slide.title.slice(0, 6) }}
        </span>
      </div>
    </div>

    <!-- 主体"卷轴"画幅 — 宣纸质感面板，偏移中心 -->
    <div class="sm-scroll-container">
      <!-- 卷轴上轴 -->
      <div class="sm-scroll-rod sm-scroll-rod-top" />

      <!-- 画心 — 使用 clip-path 制造不规则边界 -->
      <div class="sm-scroll-body"
        style="background: var(--color-card);">
        <div v-html="slide.html" class="sm-content-prose" />
      </div>

      <!-- 卷轴下轴 -->
      <div class="sm-scroll-rod sm-scroll-rod-bottom" />
    </div>

    <!-- 右侧印章 -->
    <div class="sm-seal absolute bottom-10 right-10 w-14 h-14 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.6rem; letter-spacing: 0.12em; transform: rotate(8deg); opacity: 0.45; padding: 2px;">
      记
    </div>
  </div>
</template>

<style scoped>
.sm-content {
  padding: 2rem;
}

.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

/* 卷轴容器 — 偏右放置，制造不对称构图 */
.sm-scroll-container {
  position: absolute;
  left: 16%;
  right: 8%;
  top: 50%;
  transform: translateY(-50%);
  max-height: 85%;
  display: flex;
  flex-direction: column;
}

/* 卷轴杆 — 上下仿木轴头 */
.sm-scroll-rod {
  height: 16px;
  margin: 0 8px;
  border-radius: 8px;
  position: relative;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--color-foreground) 15%, transparent),
    color-mix(in srgb, var(--color-foreground) 25%, transparent),
    color-mix(in srgb, var(--color-foreground) 12%, transparent)
  );
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.sm-scroll-rod::before,
.sm-scroll-rod::after {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-foreground) 18%, transparent);
  opacity: 0.5;
}
.sm-scroll-rod::before { left: -6px; }
.sm-scroll-rod::after { right: -6px; }

.sm-scroll-rod-top {
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--color-foreground) 10%, transparent),
    color-mix(in srgb, var(--color-foreground) 22%, transparent)
  );
}

/* 画心 — 宣纸面板，水墨不规则边缘 */
.sm-scroll-body {
  padding: 2.5rem 3rem;
  overflow-y: auto;
  position: relative;
  flex: 1;
  /* 不规则边框 — 使用 box-shadow 模拟水墨晕染边缘 */
  border: 1px solid var(--color-border);
  border-left-width: 2px;
  border-right-width: 2px;
  box-shadow:
    inset 0 0 0 1px var(--color-paper-texture),
    inset 2px 0 4px color-mix(in srgb, var(--color-ink-wash) 30%, transparent),
    inset -2px 0 4px color-mix(in srgb, var(--color-ink-wash) 30%, transparent),
    0 4px 24px rgba(0,0,0,0.05);
}

/* 内文样式 */
.sm-content-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.06em;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-ink-wash);
}

.sm-content-prose :deep(h3) {
  font-size: var(--fs-h3);
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
}

.sm-content-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-foreground);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  text-indent: 2em;
}

.sm-content-prose :deep(ul),
.sm-content-prose :deep(ol) {
  padding-left: 0;
  margin: 1rem 0;
  list-style: none;
}

.sm-content-prose :deep(li) {
  font-size: var(--fs-body-sm);
  margin-bottom: 0.6rem;
  line-height: 1.7;
  padding-left: 2rem;
  position: relative;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.sm-content-prose :deep(li)::before {
  content: '—';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-accent);
  opacity: 0.6;
  font-size: 0.85em;
}

.sm-content-prose :deep(blockquote) {
  border-left: 4px solid var(--color-blockquote-border);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: normal;
  background: var(--color-ink-wash);
  border-radius: 0 4px 4px 0;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.sm-content-prose :deep(code) {
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'JetBrains Mono', 'Cascadia Code', monospace;
}

.sm-content-prose :deep(pre) {
  overflow-x: auto;
}

.sm-content-prose :deep(h1) {
  background: linear-gradient(315deg, var(--color-h1-from) 25%, var(--color-h1-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sm-content-prose :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

sm-content-prose :deep(img) {
    max-width: 60%;
    max-height: 40vh;
    display: block;
    margin: 1rem auto;
    object-fit: contain;
  }

.sm-content-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-heading);
}

/* 旁注竖排小字 */
.sm-side-note {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  opacity: 0.18;
  letter-spacing: 0.3em;
  user-select: none;
}
</style>
