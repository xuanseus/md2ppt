<script setup lang="ts">
import { computed } from 'vue'
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const cols = parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i) || [])[1] || '2')
const images = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const urls: string[] = []
  for (const line of body.split('\n')) {
    const m = line.match(/!\[.*\]\((.+)\)/)
    if (m) urls.push(m[1])
  }
  return urls
})
</script>

<template>
  <div class="cp-media w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0; padding: 3rem">
      <!-- 标题 -->
      <h3 v-if="slide.title" class="cp-media-title">{{ slide.title }}</h3>

      <!-- 媒体网格 -->
      <div v-if="images.length" class="cp-media-grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
        <div v-for="(url, i) in images" :key="i" class="cp-media-item" :style="{ animationDelay: `${0.1 + i * 0.1}s` }">
          <img :src="url" />
          <div class="cp-media-overlay" />
        </div>
      </div>
      <div v-else v-html="slide.html" class="cp-media-fallback" />

      <!-- 状态标签 -->
      <div class="mt-4 flex items-center gap-2">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-40" style="color: var(--color-muted-foreground)">MEDIA::{{ images.length }}_ASSETS</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.05) 3px,
    rgba(0, 0, 0, 0.05) 6px
  );
}

.cp-mono {
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
}

.cp-blink-slow { animation: cp-blink-slow 2.5s ease-in-out infinite; }

@keyframes cp-blink-slow {
  0%, 100% { opacity: 1; }
  40%, 60% { opacity: 0.2; }
}

.cp-media-title {
  font-size: calc(1.6rem * var(--content-scale));
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  color: var(--color-heading);
  text-shadow: 0 0 15px var(--color-accent);
  text-transform: uppercase;
}

.cp-media-grid {
  display: grid;
  gap: 1.5rem;
  max-width: 64rem;
  width: 100%;
}

.cp-media-item {
  position: relative;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 10%, transparent), inset 0 0 20px color-mix(in srgb, var(--color-accent) 3%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16/9;
  animation: cp-card-in 0.5s ease both;
}

.cp-media-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.cp-media-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--color-accent) 15%, transparent);
  box-shadow: inset 0 0 30px color-mix(in srgb, var(--color-accent) 5%, transparent);
  z-index: 2;
}

.cp-media-fallback {
  max-width: 48rem;
  text-align: center;
}

.cp-media-fallback :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

@keyframes cp-card-in {
  0% { opacity: 0; transform: translateY(20px) }
  100% { opacity: 1; transform: translateY(0) }
}
</style>
