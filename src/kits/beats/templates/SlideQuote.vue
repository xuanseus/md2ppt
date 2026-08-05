<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Slide } from '../../../types/slides'
import Particles from '../../../components/backgrounds/Particles.vue'

const props = defineProps<{ slide: Slide }>()

// 从当前主题 CSS 变量读取实际色值
function readCSSColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

const particleColors = ref<string[]>(['#42D392', '#647EFF', '#ffffff'])

function syncColors() {
  particleColors.value = [
    readCSSColor('--color-accent'),
    readCSSColor('--color-h1-to'),
    readCSSColor('--color-foreground'),
  ]
}

let observer: MutationObserver | null = null

onMounted(() => {
  syncColors()
  observer = new MutationObserver(syncColors)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="slide-quote relative flex items-center justify-center overflow-hidden w-full h-full">
    <!-- Particles 粒子背景 -->
    <Particles
      class="absolute inset-0"
      :particle-count="80"
      :particle-spread="15"
      :speed="0.3"
      :particle-colors="particleColors"
      :particle-base-size="3"
      :alpha-particles="true"
    />

    <!-- 装饰大引号 -->
    <div class="absolute top-16 left-16 text-[12rem] leading-none font-serif text-accent/[0.07] select-none pointer-events-none">"</div>
    <div class="absolute bottom-16 right-16 text-[12rem] leading-none font-serif text-accent/[0.07] select-none pointer-events-none rotate-180">"</div>

    <!-- 引用内容 -->
    <div class="relative z-10 px-6 slide-animate" style="max-width: min(calc(var(--content-max-narrow) * var(--content-scale)), 100%)">
      <div class="text-center mb-8">
        <div class="w-12 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
      </div>
      <div v-html="slide.html" class="prose-quote" />
      <div class="text-center mt-8">
        <div class="w-12 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose-quote :deep(h3) {
  font-size: var(--fs-caption);
  font-weight: 500;
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-foreground);
}

.prose-quote :deep(blockquote),
.prose-quote :deep(p) {
  font-size: var(--fs-quote);
  font-weight: 300;
  line-height: 1.625;
  text-align: center;
  font-style: italic;
  border: none;
  margin: 0;
  color: var(--color-foreground);
}
</style>
