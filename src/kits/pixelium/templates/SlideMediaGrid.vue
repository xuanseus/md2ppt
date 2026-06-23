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
  <div class="px-media-grid flex flex-col items-center justify-center w-full h-full" style="background: var(--color-background)">
    <h3 v-if="slide.title" class="px-media-title text-center">{{ slide.title }}</h3>
    <div class="px-media-wrap" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="(url, i) in images" :key="i" class="px-media-item">
        <img :src="url" />
      </div>
    </div>
    <div v-if="!images.length" v-html="slide.html" class="px-media-fallback" />
  </div>
</template>

<style scoped>
.px-media-grid {
  padding: 3rem;
}

.px-media-title {
  font-size: calc(2.5rem * var(--content-scale));
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
}

.px-media-wrap {
  display: grid;
  gap: 1.5rem;
  max-width: 64rem;
  width: 100%;
}

.px-media-item {
  background: var(--color-card);
  border: 3px solid var(--color-border);
  box-shadow: 4px 4px 0 #0006;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.px-media-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.px-media-fallback {
  max-width: 48rem;
  text-align: center;
}
</style>
