<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import Grainient from '../../../components/backgrounds/Grainient.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ slide: Slide }>()

// 从当前主题 CSS 变量读取实际色值
function readCSSColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

const themeColors = ref({
  bg: '#ffffff',
  accent: '#42D392',
  h1To: '#647EFF',
})

function syncColors() {
  themeColors.value = {
    bg: readCSSColor('--color-background'),
    accent: readCSSColor('--color-accent'),
    h1To: readCSSColor('--color-h1-to'),
  }
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
  <div class="slide-stats relative flex items-center justify-center overflow-hidden w-full h-full">
    <!-- Grainient 渐变颗粒背景 — 颜色跟随主题 -->
    <Grainient
      :color1="themeColors.bg"
      :color2="themeColors.accent"
      :color3="themeColors.h1To"
      :time-speed="0.25"
      :color-balance="0"
      :warp-strength="1"
      :warp-frequency="5"
      :warp-speed="2"
      :warp-amplitude="50"
      :blend-angle="0"
      :blend-softness="0.05"
      :rotation-amount="500"
      :noise-scale="2"
      :grain-amount="0.1"
      :grain-scale="2"
      :grain-animated="true"
      :contrast="1.5"
      :gamma="1"
      :saturation="1"
      :center-x="0"
      :center-y="0"
      :zoom="0.9"
    />

    <!-- 主要内容 -->
    <div class="relative z-10 px-6 flex flex-col items-center justify-center text-center slide-animate" style="max-width: min(calc(var(--content-max) * var(--content-scale)), 100%)">
      <div class="stats-content flex flex-col items-center">
        <div v-html="slide.html" class="prose-stats" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose-stats :deep(h4) {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  margin-bottom: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-foreground);
  text-align: center;
}

.prose-stats :deep(strong) {
  display: block;
  font-size: var(--fs-stat);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--color-accent), var(--color-h1-to, #647EFF));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: count-pulse 2s ease-out;
}

@keyframes count-pulse {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.prose-stats :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  margin-top: 1.5rem;
  line-height: 1.7;
}
</style>
