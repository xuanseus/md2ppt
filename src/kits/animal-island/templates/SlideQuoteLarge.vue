<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-quote flex items-center justify-center w-full h-full" style="background: linear-gradient(160deg, var(--color-muted) 0%, var(--color-background) 100%)">
    <!-- 装饰 -->
    <div class="absolute top-1/3 right-1/5 w-48 h-48 rounded-full border-2 opacity-[0.05] pointer-events-none" style="border-color: var(--color-accent)" />
    <div class="absolute bottom-1/3 left-1/5 w-36 h-36 rounded-full opacity-[0.03] pointer-events-none" style="background: var(--color-accent)" />

    <div class="relative z-10 w-full max-w-3xl px-12 text-center slide-animate">
      <div class="quote-deco">"</div>
      <div v-html="slide.html" class="quote-prose" />
      <div class="quote-deco bottom">"</div>
    </div>
  </div>
</template>

<style scoped>
.ai-quote { position: relative; overflow: hidden; padding: 4rem; }
.quote-deco { font-size: 10rem; line-height: 1; font-family: Georgia, serif; color: color-mix(in srgb, var(--color-accent) 8%, transparent); user-select: none; pointer-events: none; }
.quote-deco.bottom { transform: rotate(180deg); }
.quote-prose :deep(blockquote), .quote-prose :deep(p) { font-size: var(--fs-quote, 2rem); font-weight: 300; line-height: 1.5; color: var(--color-muted-foreground); font-style: italic; margin: 0.75rem 0; font-family: var(--animal-font-family, inherit); }

</style>
