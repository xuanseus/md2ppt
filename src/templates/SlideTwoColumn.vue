<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Slide } from '../types/slides'
import GradientText from '../components/text-effects/GradientText.vue'
import FadeContent from '../components/transitions/FadeContent.vue'

const props = defineProps<{ slide: Slide }>()

// 从当前主题 CSS 变量读取实际色值
function readCSSColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

const gradientColors = ref<string[]>(['#42D392', '#647EFF', '#42D392'])

function syncColors() {
  const accent = readCSSColor('--color-accent') || '#42D392'
  const h1To = readCSSColor('--color-h1-to') || '#647EFF'
  gradientColors.value = [accent, h1To, accent]
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
  <div class="slide-twocol relative flex flex-col items-center justify-center overflow-hidden h-full">
    <!-- 装饰光晕 -->
    <div class="orb w-[350px] h-[350px] bg-accent/8 top-10 left-10" style="animation-delay: -4s" />
    <div class="orb w-[300px] h-[300px] bg-[var(--color-h1-to)]/6 bottom-10 right-10" style="animation-delay: -8s" />

    <!-- 内容 -->
    <div class="relative z-10 w-full max-w-5xl px-12">
      <!-- 居中大标题用 GradientText -->
      <FadeContent :blur="true" :duration="800">
        <GradientText
          class="!rounded-none !bg-transparent !p-0 text-3xl md:text-4xl font-bold text-center mb-3 tracking-tight"
          :colors="gradientColors"
          :animation-speed="6"
        >
          {{ slide.title || 'Two Column' }}
        </GradientText>
      </FadeContent>

      <!-- 渐变装饰线 -->
      <div class="accent-line w-20 mx-auto mb-10 slide-animate" />

      <!-- 两列内容 -->
      <div class="grid grid-cols-2 gap-8">
        <FadeContent :blur="true" :duration="600" :delay="200">
          <div class="glass p-8 prose-two-col relative overflow-hidden">
            <div class="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-accent/40 to-transparent" />
            <div v-html="slide.leftHtml" />
          </div>
        </FadeContent>
        <FadeContent :blur="true" :duration="600" :delay="400">
          <div class="glass p-8 prose-two-col relative overflow-hidden">
            <div class="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-[var(--color-h1-to)]/40 to-transparent" />
            <div v-html="slide.rightHtml" />
          </div>
        </FadeContent>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-twocol {
  padding: 3rem 4rem;
}

.prose-two-col :deep(h3) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.prose-two-col :deep(h4) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.prose-two-col :deep(p) {
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.prose-two-col :deep(ul),
.prose-two-col :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.prose-two-col :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.prose-two-col :deep(li)::marker {
  color: var(--color-accent);
}

.prose-two-col :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}
</style>
