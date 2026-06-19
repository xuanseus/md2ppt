<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-media flex items-center justify-center w-full h-full" style="background: linear-gradient(180deg, #0a0a1a 0%, #121024 50%, #0a0a1a 100%)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3))" />

    <div class="relative z-10 w-full h-full flex items-center justify-center p-8">
      <!-- 物品查看面板 -->
      <div :style="{ background: 'var(--color-card)', border: '4px solid var(--color-border)', boxShadow: '0 0 0 2px var(--color-background), 0 0 0 6px var(--color-border), 8px 8px 0 #0008', maxWidth: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }">
        <!-- 面板标题栏 -->
        <div :style="{ background: 'linear-gradient(90deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 60%, var(--color-h1-to)))', padding: '0.5rem 1.5rem', borderBottom: '3px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <span class="font-extrabold text-xs tracking-widest uppercase" style="color: var(--color-background); font-family: var(--px-font)">◈ ITEM ◈</span>
          <span class="font-bold text-xs" style="color: var(--color-background); font-family: var(--px-font); opacity: 0.7">RARE ★★★</span>
        </div>

        <!-- 物品图片展示区 -->
        <div :style="{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', background: 'color-mix(in srgb, var(--color-muted) 50%, transparent)', borderBottom: '3px solid var(--color-border)', overflow: 'hidden' }">
          <!-- 四角放大镜 -->
          <div class="absolute top-2 left-2 pointer-events-none" style="width: 32px; height: 32px; border-top: 4px solid var(--color-accent); border-left: 4px solid var(--color-accent); opacity: 0.5"></div>
          <div class="absolute top-2 right-2 pointer-events-none" style="width: 32px; height: 32px; border-top: 4px solid var(--color-accent); border-right: 4px solid var(--color-accent); opacity: 0.5"></div>
          <div class="absolute bottom-2 left-2 pointer-events-none" style="width: 32px; height: 32px; border-bottom: 4px solid var(--color-accent); border-left: 4px solid var(--color-accent); opacity: 0.5"></div>
          <div class="absolute bottom-2 right-2 pointer-events-none" style="width: 32px; height: 32px; border-bottom: 4px solid var(--color-accent); border-right: 4px solid var(--color-accent); opacity: 0.5"></div>

          <div v-html="slide.html" class="px-media-content" />
        </div>

        <!-- 物品描述栏 -->
        <div :style="{ background: 'var(--color-muted)', padding: '0.75rem 1.5rem', borderTop: '2px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }">
          <span style="font-family: var(--px-font); font-size: 0.75rem; color: var(--color-accent)">▶ Examine</span>
          <span style="font-family: var(--px-font); font-size: 0.65rem; color: var(--color-muted-foreground)">Press A to inspect · Press B to close</span>
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
