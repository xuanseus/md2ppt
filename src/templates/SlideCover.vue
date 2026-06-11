<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Slide } from '../types/slides'
import Aurora from '../components/backgrounds/Aurora.vue'
import SplitText from '../components/text-effects/SplitText.vue'

defineProps<{ slide: Slide }>()

// 从当前主题 CSS 变量读取实际色值
function readCSSColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

const auroraColors = ref<string[]>(['#42D392', '#1a1a2e', '#647EFF'])

function syncColors() {
  auroraColors.value = [
    readCSSColor('--color-accent'),
    readCSSColor('--color-foreground'),
    readCSSColor('--color-h1-to'),
  ]
}

let observer: MutationObserver | null = null

onMounted(() => {
  syncColors()
  // 监听主题切换（class="dark" 或 style 属性变化）
  observer = new MutationObserver(syncColors)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="slide-cover relative flex items-center justify-center overflow-hidden w-full h-full">
    <!-- Aurora 动态背景 -->
    <Aurora
      class="absolute inset-0"
      :color-stops="auroraColors"
      :speed="0.8"
      :amplitude="0.6"
      :intensity="0.8"
    />

    <!-- 内容区 -->
    <div class="relative z-10 max-w-4xl px-16 text-center">
      <!-- 标题上方装饰小标 -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium tracking-widest uppercase mb-8 slide-animate">
        <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Presentation
      </div>

      <!-- 标题用 SplitText 动画 -->
      <div v-if="slide.title" class="cover-title">
        <SplitText
          :text="slide.title"
          tag="h1"
          split-type="words"
          :delay="80"
          :duration="1"
        />
      </div>

      <!-- 其他内容保持 v-html -->
      <div v-html="slide.html" class="prose-cover" />

      <!-- 底部渐变装饰线 -->
      <div class="accent-line w-32 mx-auto mt-12 slide-animate" />
    </div>
  </div>
</template>

<style scoped>
.cover-title :deep(h1) {
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-foreground);
}

.prose-cover :deep(h1) {
  display: none;
}

.prose-cover :deep(p) {
  font-size: 1.5rem;
  color: var(--color-muted-foreground);
  line-height: 1.6;
  margin-top: 0;
}
</style>
