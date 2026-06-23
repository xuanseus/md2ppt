<script setup lang="ts">
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const icon = (props.slide.rawMd.match(/\{icon:\s*(\S+)\}/i) || [])[1] || '✦'
</script>

<template>
  <div class="ai-section-icon flex items-center justify-center w-full h-full" style="background: linear-gradient(180deg, var(--color-muted) 0%, var(--color-background) 100%)">
    <!-- 装饰弧形 -->
    <div class="absolute top-0 left-0 w-full h-1/2 pointer-events-none" style="background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, transparent 70%)" />
    <!-- 角落装饰 -->
    <div class="absolute top-12 right-12 text-6xl opacity-[0.05] pointer-events-none select-none">🌿</div>
    <div class="absolute bottom-12 left-12 text-5xl opacity-[0.04] pointer-events-none select-none">🌱</div>

    <div class="relative z-10 w-full max-w-3xl px-12 text-center">
      <div class="icon-wrapper slide-animate">
        <span class="icon">{{ icon }}</span>
      </div>
      <h2 v-if="slide.title" class="section-title slide-animate" style="animation-delay: 0.15s">{{ slide.title }}</h2>
      <div v-if="slide.html" v-html="slide.html" class="section-sub slide-animate" style="animation-delay: 0.3s" />
    </div>
  </div>
</template>

<style scoped>
.ai-section-icon { position: relative; overflow: hidden; }
.icon-wrapper { display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
.icon { display: inline-flex; align-items: center; justify-content: center; width: 5rem; height: 5rem; border-radius: 50%; background: color-mix(in srgb, var(--color-accent) 10%, transparent); border: 2px solid color-mix(in srgb, var(--color-accent) 20%, transparent); font-size: 2.5rem; opacity: 0.8; }
.section-title { font-size: calc(4rem * var(--content-scale)); font-weight: 700; color: var(--color-heading); line-height: 1.15; margin-bottom: 1.5rem; font-family: var(--animal-font-family, inherit); }
.section-sub :deep(h1), .section-sub :deep(h2), .section-sub :deep(h3), .section-sub :deep(h4) { display: none; }
.section-sub :deep(p) { font-size: var(--fs-body); color: var(--color-muted-foreground); line-height: 1.7; }
</style>
