<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps<{ slide: Slide }>()

const contentRef = ref<HTMLElement | null>(null)
const duration = ref('')

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function detectVideo() {
  if (!contentRef.value) return
  const video = contentRef.value.querySelector('video') as HTMLVideoElement | null
  if (!video) { duration.value = ''; return }
  if (video.duration && !isNaN(video.duration)) {
    duration.value = formatDuration(video.duration)
  } else {
    video.addEventListener('loadedmetadata', () => {
      duration.value = formatDuration(video.duration)
    }, { once: true })
  }
}

onMounted(() => { nextTick(detectVideo) })
watch(() => props.slide.html, () => { nextTick(detectVideo) })
</script>

<template>
  <div class="px-media flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3))" />

    <div class="relative z-10 w-full h-full flex items-center justify-center p-8">
      <!-- 物品查看面板 -->
      <div :style="{ background: 'var(--color-card)', border: '4px solid var(--color-border)', boxShadow: '0 0 0 2px var(--color-background), 0 0 0 6px var(--color-border), 8px 8px 0 #0008', maxWidth: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }">
        <!-- 面板标题栏 -->
        <div :style="{ background: 'linear-gradient(90deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 60%, var(--color-h1-to)))', padding: '0.5rem 1.5rem', borderBottom: '3px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <span class="font-extrabold text-xs tracking-widest uppercase" style="color: var(--color-background); font-family: var(--px-font)">◈ MEDIA ◈</span>
          <span class="font-bold text-xs" style="color: var(--color-background); font-family: var(--px-font); opacity: 0.7">{{ duration ? '时长 ' + duration : '' }}</span>
        </div>

        <!-- 物品图片展示区 -->
        <div :style="{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', background: 'color-mix(in srgb, var(--color-muted) 50%, transparent)', borderBottom: '3px solid var(--color-border)', overflow: 'hidden' }">
          <!-- 四角放大镜 -->
          <div class="absolute top-2 left-2 pointer-events-none" style="width: 32px; height: 32px; border-top: 4px solid var(--color-accent); border-left: 4px solid var(--color-accent); opacity: 0.5"></div>
          <div class="absolute top-2 right-2 pointer-events-none" style="width: 32px; height: 32px; border-top: 4px solid var(--color-accent); border-right: 4px solid var(--color-accent); opacity: 0.5"></div>
          <div class="absolute bottom-2 left-2 pointer-events-none" style="width: 32px; height: 32px; border-bottom: 4px solid var(--color-accent); border-left: 4px solid var(--color-accent); opacity: 0.5"></div>
          <div class="absolute bottom-2 right-2 pointer-events-none" style="width: 32px; height: 32px; border-bottom: 4px solid var(--color-accent); border-right: 4px solid var(--color-accent); opacity: 0.5"></div>

          <div ref="contentRef" v-html="slide.html" class="px-media-content" />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.px-media { padding: 2.5rem 2rem; }

.px-media-content :deep(video) {
  max-width: 100%; max-height: 55vh; object-fit: contain; display: block;
  border: 3px solid var(--color-border); box-shadow: 6px 6px 0 #0008;
}
.px-media-content :deep(img) {
  max-width: 90%; max-height: 55vh; display: block; object-fit: contain;
  border: 4px solid var(--color-border);
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 6px var(--color-border), 8px 8px 0 #0008;
}
</style>
