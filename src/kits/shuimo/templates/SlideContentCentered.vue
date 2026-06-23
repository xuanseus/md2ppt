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
    <div class="absolute left-[10%] top-[15%] w-52 h-52 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[12%] bottom-[20%] w-40 h-40 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 主体内容 -->
    <div class="wrap relative z-10" style="max-width: 36rem; width: 100%; text-align: center; padding: 2rem;">
      <h3 v-if="slide.title" class="centered-title">{{ slide.title }}</h3>
      <div v-html="slide.html" class="centered-prose" />
    </div>

    <!-- 右下印章 -->
    <div class="sm-seal absolute bottom-8 right-8 w-12 h-12 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.5rem; letter-spacing: 0.1em; transform: rotate(5deg); opacity: 0.4; padding: 2px;">
      笔记
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.centered-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.06em;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-ink-wash);
  display: inline-block;
}

.centered-prose :deep(h1),
.centered-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'STSong', 'SimSun', Georgia, serif;
}

.centered-prose :deep(h3),
.centered-prose :deep(h4) {
  font-size: var(--fs-h3);
  font-weight: 500;
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;
  font-family: 'Noto Serif SC', 'STKaiti', Georgia, serif;
}

.centered-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  text-indent: 2em;
}

.centered-prose :deep(ul) {
  list-style: none;
  padding: 0;
  text-align: left;
}

.centered-prose :deep(li) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.centered-prose :deep(li::before) {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--color-ink-light);
  opacity: 0.5;
}

.centered-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-heading);
}

.centered-prose :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
