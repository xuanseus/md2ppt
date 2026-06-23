<script setup lang="ts">
import { computed } from 'vue'
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const cols = parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i) || [])[1] || '2')
const images = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const urls: string[] = []
  for (const line of body.split('\n')) {
    const m = line.match(/!\[.*\]\((.+)\)/)
    if (m) urls.push(m[1])
  }
  return urls
})
</script>

<template>
  <div class="root w-full h-full relative overflow-hidden flex flex-col items-center justify-center"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 -->
    <div class="absolute left-[8%] top-[10%] w-48 h-48 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[10%] bottom-[12%] w-40 h-40 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <h3 v-if="slide.title" class="mg-title relative z-10">{{ slide.title }}</h3>

    <!-- 图片网格 -->
    <div v-if="images.length" class="mg-grid relative z-10" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="(url, i) in images" :key="i" class="mg-item">
        <img :src="url" />
      </div>
    </div>

    <div v-if="!images.length" v-html="slide.html" class="mg-fallback relative z-10" />

    <!-- 右下印章 -->
    <div class="sm-seal absolute bottom-8 right-8 w-11 h-11 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.45rem; letter-spacing: 0.1em; transform: rotate(4deg); opacity: 0.35; padding: 2px;">
      画卷
    </div>
  </div>
</template>

<style scoped>
.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.mg-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.06em;
}

.mg-grid {
  display: grid;
  gap: 1.5rem;
  max-width: 64rem;
  width: 100%;
  padding: 0 2rem;
}

.mg-item {
  overflow: hidden;
  background: var(--color-card);
  border: 2px solid var(--color-border);
  box-shadow:
    0 1px 8px rgba(0, 0, 0, 0.03),
    inset 0 0 0 1px var(--color-paper-texture);
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9;
}

.mg-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.mg-fallback {
  max-width: 48rem;
  text-align: center;
  padding: 2rem;
}
</style>
