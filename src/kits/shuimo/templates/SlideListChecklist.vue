<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()
const items = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim()).filter(Boolean)
})
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden flex items-center justify-center"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 -->
    <div class="absolute left-[8%] top-[12%] w-48 h-48 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[10%] bottom-[14%] w-40 h-40 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 主体 -->
    <div class="wrap relative z-10" style="max-width: 40rem; width: 100%; padding: 2rem;">

      <h3 v-if="slide.title" class="cl-title">{{ slide.title }}</h3>

      <div v-if="items.length" class="cl-list">
        <div v-for="(item, i) in items" :key="i" class="cl-item">
          <span class="cl-check">&#x2714;</span>
          <span class="cl-text" v-html="(marked.parseInline(item) as string)" />
        </div>
      </div>
    </div>

    <!-- 右下印章 -->
    <div class="sm-seal absolute bottom-8 right-8 w-11 h-11 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.45rem; letter-spacing: 0.1em; transform: rotate(4deg); opacity: 0.35; padding: 2px;">
      清单
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.cl-title {
  font-size: var(--fs-h3);
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.06em;
}

.cl-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cl-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
}

.cl-check {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-seal);
  border: 1.5px solid color-mix(in srgb, var(--color-seal) 35%, transparent);
  opacity: 0.6;
}

.cl-text {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.5;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}
</style>
