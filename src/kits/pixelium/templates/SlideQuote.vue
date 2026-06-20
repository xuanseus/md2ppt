<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-quote flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-3" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2))" />

    <!-- 对话气泡主体 -->
    <div class="relative z-10 max-w-5xl px-12 slide-animate">
      <div :style="{ background: 'var(--color-card)', border: '3px solid var(--color-border)', boxShadow: '0 0 0 2px var(--color-background), 0 0 0 5px var(--color-border), 6px 6px 0 #0006', padding: '3rem 4rem', position: 'relative' }">
        <!-- 对话内容 -->
        <div v-html="slide.html" class="px-quote-prose" />

      </div>
    </div>
  </div>
</template>

<style scoped>
.px-quote { padding: 2.5rem 3rem; }
.px-quote-prose :deep(h3) { font-size: var(--fs-caption); font-weight: 500; margin-bottom: 2rem; text-align: center; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-muted-foreground); font-family: var(--px-font); }
.px-quote-prose :deep(blockquote), .px-quote-prose :deep(p) { font-size: var(--fs-quote); font-weight: 300; line-height: 1.8; text-align: left; font-style: normal; border: none; margin: 0; color: var(--color-foreground); font-family: var(--px-font); }
.px-quote-prose :deep(blockquote) { padding: 0; background: none; box-shadow: none; }
</style>
