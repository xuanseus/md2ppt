<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-quote flex items-center justify-center w-full h-full" style="background: linear-gradient(160deg, #0d0d1a 0%, #1a1230 50%, #0d0d1a 100%)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-3" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 2))" />

    <!-- NPC 名字标签 -->
    <div class="absolute left-20 top-25p px-4 py-1d5" style="background: var(--color-accent); color: var(--color-background); font-family: var(--px-font); font-weight: 800; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; box-shadow: 3px 3px 0 #0006">
      NPC
    </div>

    <!-- 像素角色头像占位 -->
    <div class="absolute left-16 bottom-25p" style="width: 80px; height: 80px; background: var(--color-card); border: 3px solid var(--color-border); box-shadow: 4px 4px 0 #0008">
      <div class="w-full h-full flex items-center justify-center" style="font-family: monospace; color: var(--color-accent); opacity: 0.3; font-size: 2rem">◉</div>
    </div>

    <!-- 对话气泡主体 -->
    <div class="relative z-10 max-w-3xl px-12 slide-animate">
      <div :style="{ background: 'var(--color-card)', border: '3px solid var(--color-border)', boxShadow: '0 0 0 2px var(--color-background), 0 0 0 5px var(--color-border), 6px 6px 0 #0006', padding: '3rem 4rem', position: 'relative' }">
        <!-- 气泡尾巴 -->
        <div class="absolute -left-6 bottom-10 pointer-events-none" style="width: 0; height: 0; border-right: 20px solid var(--color-card); border-top: 16px solid transparent; border-bottom: 16px solid transparent; filter: drop-shadow(-3px 2px 0 #0004)" />

        <!-- 对话内容 -->
        <div v-html="slide.html" class="px-quote-prose" />

        <!-- Press A to continue -->
        <div class="flex items-center justify-center gap-2 mt-6 pt-4" style="border-top: 2px dashed var(--color-border)">
          <span class="px-btn-icon-sm" style="background: var(--color-accent); color: var(--color-background)">A</span>
          <span class="px-continue-text">Continue</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes px-blink-cursor { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
@keyframes px-typewriter-reveal { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.px-quote { padding: 2.5rem 3rem; }
.px-continue-text { font-size: 0.7rem; font-family: var(--px-font); color: var(--color-accent); letter-spacing: 0.15em; animation: px-blink-cursor 1.4s step-end infinite; }
.px-btn-icon-sm { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; font-size: 0.55rem; font-weight: 800; font-family: var(--px-font); box-shadow: 1px 1px 0 #0004; }

.px-quote-prose :deep(h3) { font-size: var(--fs-caption); font-weight: 500; margin-bottom: 2rem; text-align: center; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-muted-foreground); font-family: var(--px-font); }
.px-quote-prose :deep(blockquote), .px-quote-prose :deep(p) { font-size: var(--fs-quote); font-weight: 300; line-height: 1.8; text-align: left; font-style: normal; border: none; margin: 0; color: var(--color-foreground); font-family: var(--px-font); }
.px-quote-prose :deep(blockquote) { padding: 0; background: none; box-shadow: none; }
.px-quote-prose :deep(p)::after, .px-quote-prose :deep(blockquote)::after { content: '▌'; display: inline; color: var(--color-accent); animation: px-blink-cursor 1s step-end infinite; margin-left: 2px; }
</style>
