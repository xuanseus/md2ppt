<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-cover-minimal flex items-center justify-center w-full h-full" style="background: linear-gradient(160deg, var(--color-muted) 0%, var(--color-background) 100%)">
    <!-- 装饰圆环 -->
    <div class="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border-2 opacity-[0.07] pointer-events-none" style="border-color: var(--color-accent)" />
    <div class="absolute bottom-1/4 left-1/5 w-48 h-48 rounded-full border-2 opacity-[0.05] pointer-events-none" style="border-color: var(--color-accent)" />
    <div class="absolute top-1/3 left-1/3 w-32 h-32 rounded-full opacity-[0.04] pointer-events-none" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-3xl px-12 text-center">
      <div class="badge slide-animate">
        <span class="badge-dot" />
        Thank You
      </div>
      <h1 v-if="slide.title" class="minimal-title slide-animate" style="animation-delay: 0.15s">{{ slide.title }}</h1>
      <div v-html="slide.html" class="minimal-prose slide-animate" style="animation-delay: 0.3s" />

      <!-- 底部装饰线 -->
      <div class="mx-auto mt-10 flex items-center gap-3 justify-center">
        <span class="w-16 h-0.5 rounded-full opacity-30" style="background: var(--color-accent)" />
        <span class="w-2 h-2 rounded-full" style="background: var(--color-accent)" />
        <span class="w-16 h-0.5 rounded-full opacity-30" style="background: var(--color-accent)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-cover-minimal { position: relative; overflow: hidden; }
.badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.2rem; border-radius: 9999px; background: color-mix(in srgb, var(--color-accent) 10%, transparent); border: 2px solid color-mix(in srgb, var(--color-accent) 20%, transparent); color: var(--color-accent); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--animal-font-family, inherit); margin-bottom: 2rem; }
.badge-dot { width: 0.375rem; height: 0.375rem; border-radius: 9999px; background: var(--color-accent); animation: dot-pulse 2s infinite; }
.minimal-title { font-size: calc(4rem * var(--content-scale)); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: var(--color-heading); margin-bottom: 1.5rem; font-family: var(--animal-font-family, inherit); }
.minimal-prose :deep(h1), .minimal-prose :deep(h2), .minimal-prose :deep(h3) { display: none; }
.minimal-prose :deep(p) { font-size: var(--fs-body); color: var(--color-muted-foreground); line-height: 1.7; margin-top: 1rem; }
@keyframes dot-pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
</style>
