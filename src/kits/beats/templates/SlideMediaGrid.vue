<script setup lang="ts">
import { computed } from 'vue'
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const cols = parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i)||[])[1]||'2')
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
  <div class="root">
    <h3 v-if="slide.title" class="title">{{ slide.title }}</h3>
    <div class="wrap" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="(url, i) in images" :key="i" class="item glass" :style="{ animationDelay: `${0.1 + i * 0.1}s` }">
        <img :src="url" />
      </div>
    </div>
    <div v-if="!images.length" v-html="slide.html" />
  </div>
</template>

<style scoped>
.root { display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:2.5rem 2rem; }
.title { font-size:var(--fs-h2); font-weight:700; text-align:center; margin-bottom:2rem; }
.wrap { display:grid; gap:1.5rem; max-width:min(calc(100vh * 1.3),72rem,100%); width:100%; }
.item { border-radius:0.75rem; overflow:hidden; background:color-mix(in srgb,var(--color-muted) 20%,transparent); border:1px solid color-mix(in srgb,var(--color-border) 30%,transparent); display:flex; align-items:center; justify-content:center; aspect-ratio:16/9; animation:card-in 0.5s ease both; }
.item img { max-width:100%; max-height:100%; object-fit:contain; }
@keyframes card-in { 0% { opacity:0; transform:translateY(20px) } 100% { opacity:1; transform:translateY(0) } }
</style>
