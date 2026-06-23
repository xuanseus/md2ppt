<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-cover-split flex items-center justify-center w-full h-full" style="background: linear-gradient(160deg, var(--color-muted) 0%, var(--color-background) 100%)">
    <!-- 装饰圆环 -->
    <div class="absolute top-1/4 right-1/4 w-56 h-56 rounded-full border-2 opacity-[0.06] pointer-events-none" style="border-color: var(--color-accent)" />
    <div class="absolute bottom-1/4 left-1/5 w-40 h-40 rounded-full opacity-[0.04] pointer-events-none" style="background: var(--color-accent)" />
    <div class="absolute top-1/3 right-1/3 w-24 h-24 rounded-full border-2 opacity-[0.08] pointer-events-none" style="border-color: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-6xl px-12">
      <div class="split-grid">
        <div class="split-left slide-animate">
          <div class="badge">
            <span class="badge-dot" /> Presentation
          </div>
          <h1 v-if="slide.title" class="split-title">{{ slide.title }}</h1>
          <div v-html="slide.html" class="split-body" />
        </div>
        <div class="split-right slide-animate" style="animation-delay: 0.2s">
          <div class="deco-box">
            <div class="deco-icon">✦</div>
            <span class="deco-text">2026</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-cover-split { position: relative; overflow: hidden; }
.split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; width: 100%; }
.split-left { display: flex; flex-direction: column; gap: 1.5rem; }
.badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.2rem; border-radius: 9999px; background: color-mix(in srgb, var(--color-accent) 10%, transparent); border: 2px solid color-mix(in srgb, var(--color-accent) 20%, transparent); color: var(--color-accent); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--animal-font-family, inherit); width: fit-content; }
.badge-dot { width: 0.375rem; height: 0.375rem; border-radius: 9999px; background: var(--color-accent); animation: dot-pulse 2s infinite; }
.split-title { font-size: calc(3.5rem * var(--content-scale)); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: var(--color-heading); font-family: var(--animal-font-family, inherit); }
.split-body :deep(h1), .split-body :deep(h2), .split-body :deep(h3) { display: none; }
.split-body :deep(p) { font-size: var(--fs-body); color: var(--color-muted-foreground); line-height: 1.7; }
.split-right { display: flex; align-items: center; justify-content: center; }
.deco-box { width: 15rem; height: 15rem; border-radius: 2rem; background: color-mix(in srgb, var(--color-accent) 6%, transparent); border: 2px solid color-mix(in srgb, var(--color-accent) 12%, transparent); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 20px rgba(61, 52, 40, 0.05); }
.deco-icon { font-size: 4rem; opacity: 0.35; color: var(--color-accent); }
.deco-text { font-size: var(--fs-h3); font-weight: 700; color: var(--color-accent); opacity: 0.4; font-family: var(--animal-font-family, inherit); }
@keyframes dot-pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
</style>
