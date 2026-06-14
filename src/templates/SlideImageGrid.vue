<script setup lang="ts">
import type { Slide } from '../types/slides'
import { computed } from 'vue'
import FadeContent from '../components/transitions/FadeContent.vue'

const props = defineProps<{ slide: Slide }>()

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
  <div class="slide-image-grid-wrapper relative flex flex-col items-center justify-center overflow-hidden h-full">
    <!-- 背景已由全局背景层提供 -->

    <!-- 内容 -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full px-12 py-12 w-full">
      <h4 v-if="slide.title" class="text-lg md:text-xl font-medium mb-8 text-center text-muted-foreground slide-animate">
        {{ slide.title }}
      </h4>

      <div
        v-if="images.length"
        class="grid gap-6 w-full max-w-5xl"
        :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }"
      >
        <FadeContent
          v-for="(img, i) in images"
          :key="i"
          :blur="true"
          :duration="700"
          :delay="150 + i * 120"
          class="image-card relative rounded-2xl overflow-hidden bg-muted/20 border border-border/30 aspect-[4/3] group hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
        >
          <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div v-if="img.alt" class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            {{ img.alt }}
          </div>
        </FadeContent>
      </div>

      <p v-else class="text-muted-foreground text-sm">（暂无图片）</p>
    </div>
  </div>
</template>

<style scoped>
.slide-image-grid-wrapper {
  padding: 2.5rem 3rem;  /* 旧 3rem 4rem */
}

/* 标题跟随缩放 */
.slide-image-grid-wrapper :deep(h4) {
  font-size: var(--fs-h4);
}
</style>
