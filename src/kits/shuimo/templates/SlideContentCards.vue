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
    <div class="absolute left-[5%] top-[8%] w-48 h-48 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[6%] bottom-[10%] w-44 h-44 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 主体 -->
    <div class="wrap relative z-10" style="max-width: 48rem; width: 100%; padding: 2rem;">
      <h3 v-if="slide.title" class="cards-title">{{ slide.title }}</h3>
      <div class="cards-panel">
        <div v-html="slide.html" class="cards-prose" />
      </div>
    </div>

    <!-- 左下印章 -->
    <div class="sm-seal absolute bottom-8 left-8 w-12 h-12 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.5rem; letter-spacing: 0.1em; transform: rotate(-6deg); opacity: 0.4; padding: 2px;">
      文
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.cards-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.06em;
}

.cards-panel {
  padding: 2.5rem 3rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-left-width: 2px;
  border-right-width: 2px;
  box-shadow:
    inset 0 0 0 1px var(--color-paper-texture),
    inset 2px 0 4px color-mix(in srgb, var(--color-ink-wash) 25%, transparent),
    inset -2px 0 4px color-mix(in srgb, var(--color-ink-wash) 25%, transparent),
    0 4px 24px rgba(0, 0, 0, 0.04);
}

.cards-prose :deep(h1),
.cards-prose :deep(h2),
.cards-prose :deep(h3),
.cards-prose :deep(h4) {
  display: none;
}

.cards-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.8;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  text-indent: 2em;
}

.cards-prose :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.cards-prose :deep(li) {
  font-size: var(--fs-body-sm);
  padding: 0.4rem 0;
  padding-left: 2rem;
  position: relative;
  color: var(--color-muted-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  line-height: 1.7;
}

.cards-prose :deep(li::before) {
  content: '—';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-accent);
  opacity: 0.5;
}

.cards-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-heading);
}

.cards-prose :deep(blockquote) {
  border-left: 4px solid var(--color-blockquote-border);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: normal;
  background: var(--color-ink-wash);
  border-radius: 0 4px 4px 0;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}
</style>
