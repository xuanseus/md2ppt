<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Slide } from '../../../types/slides'
import StarBorder from '../../../components/cards/StarBorder.vue'
import SplitText from '../../../components/text-effects/SplitText.vue'

defineProps<{ slide: Slide }>()

// 从当前主题 CSS 变量读取实际色值
function readCSSColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

const accentColor = ref('#42D392')

function syncColors() {
  accentColor.value = readCSSColor('--color-accent') || '#42D392'
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
  <div class="slide-section relative flex items-center justify-center overflow-hidden w-full h-full">
    <!-- 内容卡片 -->
    <div class="relative z-10 max-w-5xl px-12 slide-animate">
      <StarBorder
        as="div"
        class="section-card px-16 py-16 text-center rounded-2xl"
        :color="accentColor"
        speed="8s"
        :thickness="2"
      >
        <!-- 标题用 SplitText -->
        <div v-if="slide.title" class="section-title">
          <SplitText
            :text="slide.title"
            tag="h2"
            split-type="words"
            :delay="60"
            :duration="0.9"
          />
        </div>

        <div v-html="slide.html" class="prose-section" />

        <!-- 底部装饰 -->
        <div class="flex items-center justify-center gap-2 mt-10">
          <div class="w-2 h-2 rounded-full bg-accent/40" />
          <div class="w-10 h-1 rounded-full bg-gradient-to-r from-accent to-[var(--color-h1-to)]" />
          <div class="w-2 h-2 rounded-full bg-accent/40" />
        </div>
      </StarBorder>
    </div>
  </div>
</template>

<style scoped>
.section-card {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--color-muted) 95%, var(--color-accent) 5%),
    color-mix(in srgb, var(--color-muted) 85%, var(--color-background) 15%)
  );
  border: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
  box-shadow: 0 8px 32px color-mix(in srgb, var(--color-foreground) 6%, transparent);
}

.section-title :deep(h2) {
  font-size: var(--fs-section-title);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.prose-section :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.6;
}
</style>
