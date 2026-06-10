<script setup lang="ts">
import type { Slide } from '../types/slides'
import { computed } from 'vue'

const props = defineProps<{ slide: Slide }>()

// 从 rawMd 直接提取图片，避免 markdown 的 <br> 污染 grid 布局
const images = computed(() => {
  const result: { src: string; alt: string }[] = []
  const matches = props.slide.rawMd.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)
  for (const m of matches) {
    result.push({ alt: m[1], src: m[2] })
  }
  return result
})

const gridCols = computed(() => images.value.length === 1 ? 1 : 2)
</script>

<template>
  <div class="slide-image-grid flex flex-col items-center justify-center h-full px-12 py-12">
    <h4 v-if="slide.title" class="text-lg md:text-xl font-medium mb-8 text-center text-muted-foreground">
      {{ slide.title }}
    </h4>

    <div
      v-if="images.length"
      class="grid gap-5 w-full max-w-5xl"
      :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }"
    >
      <div
        v-for="(img, i) in images"
        :key="i"
        class="relative rounded-xl overflow-hidden bg-muted/30 aspect-[4/3]"
      >
        <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover" loading="lazy" />
      </div>
    </div>

    <p v-else class="text-muted-foreground text-sm">（暂无图片）</p>
  </div>
</template>
