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
  <div class="ai-media flex flex-col items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰 -->
    <div class="absolute top-1/4 left-1/5 w-32 h-32 rounded-full opacity-[0.03] pointer-events-none" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-5xl px-8">
      <h3 v-if="slide.title" class="mg-title slide-animate">{{ slide.title }}</h3>
      <div class="mg-grid slide-animate" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, animationDelay: '0.1s' }">
        <div v-for="(url, i) in images" :key="i" class="mg-item" :style="{ animationDelay: `${0.1 + i * 0.1}s` }">
          <img :src="url" />
        </div>
      </div>
      <div v-if="!images.length" v-html="slide.html" class="mg-fallback" />
    </div>
  </div>
</template>

<style scoped>
.ai-media { position: relative; overflow: hidden; padding: 2rem 3rem; }
.mg-title { font-size: var(--fs-h2); font-weight: 700; text-align: center; margin-bottom: 1.75rem; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.mg-grid { display: grid; gap: 1.5rem; }
.mg-item { border-radius: var(--animal-border-radius-lg, 24px); overflow: hidden; background: color-mix(in srgb, var(--color-muted) 10%, transparent); border: 2px solid var(--color-border); display: flex; align-items: center; justify-content: center; aspect-ratio: 16 / 9; box-shadow: 0 2px 8px rgba(61, 52, 40, 0.04); animation: card-in 0.5s ease both; }
.mg-item img { max-width: 100%; max-height: 100%; object-fit: contain; }
.mg-fallback { text-align: center; color: var(--color-muted-foreground); }
@keyframes card-in { 0% { opacity: 0; transform: translateY(20px) } 100% { opacity: 1; transform: translateY(0) } }
</style>
