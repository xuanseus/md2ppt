<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-media w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-10 cp-scanlines" />

    <!-- 媒体内容 -->
    <div class="relative z-0 w-full h-full flex items-center justify-center" style="padding: 3rem">
      <div class="cp-media-frame">
        <!-- 四角 bracket -->
        <div class="cp-bracket cp-br-tl" />
        <div class="cp-bracket cp-br-tr" />
        <div class="cp-bracket cp-br-bl" />
        <div class="cp-bracket cp-br-br" />

        <div v-html="slide.html" class="cp-media-content" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(255, 255, 255, 0.02) 2px, rgba(255, 255, 255, 0.02) 4px
  );
}

.cp-media-frame {
  position: relative;
  max-width: 90%;
  max-height: 80%;
}

.cp-bracket {
  position: absolute;
  width: 24px; height: 24px;
  pointer-events: none;
  z-index: 5;
  opacity: 0.4;
}
.cp-br-tl { top: 0; left: 0; border-top: 2px solid var(--color-accent); border-left: 2px solid var(--color-accent); }
.cp-br-tr { top: 0; right: 0; border-top: 2px solid var(--color-accent); border-right: 2px solid var(--color-accent); }
.cp-br-bl { bottom: 0; left: 0; border-bottom: 2px solid var(--color-accent); border-left: 2px solid var(--color-accent); }
.cp-br-br { bottom: 0; right: 0; border-bottom: 2px solid var(--color-accent); border-right: 2px solid var(--color-accent); }

.cp-media-content :deep(video) {
  max-width: 100%;
  max-height: 70vh;
  display: block;
}

.cp-media-content :deep(img) {
  max-width: 100%;
  max-height: 70vh;
  display: block;
  object-fit: contain;
}
</style>
