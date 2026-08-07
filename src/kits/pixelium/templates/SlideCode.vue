<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-code flex flex-col items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- CRT 扫描线 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, var(--color-accent) 0px, var(--color-accent) 1px, transparent 1px, transparent 4px)" />

    <div class="relative z-10 w-full max-w-5xl px-10 slide-animate">
      <!-- 调试终端窗口 -->
      <div :style="{ background: 'var(--color-card)', border: '4px solid var(--color-border)', boxShadow: '6px 6px 0 #0008' }">
        <!-- 终端标题栏 -->
        <div :style="{ background: 'color-mix(in srgb, var(--color-accent) 30%, transparent)', borderBottom: '3px solid var(--color-border)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <div class="flex items-center gap-2">
            <span class="px-term-btn" style="background: var(--color-accent)"></span>
            <span class="px-term-btn" style="background: var(--color-accent); opacity: 0.5"></span>
            <span class="px-term-btn" style="background: var(--color-accent); opacity: 0.3"></span>
          </div>
          <span class="font-bold text-xs tracking-widest uppercase" style="color: var(--color-accent); font-family: var(--px-font)">◈ DEBUG MODE ◈</span>
          <span class="text-xs" style="color: var(--color-muted-foreground); font-family: var(--px-font)">GAME_ENGINE.exe</span>
        </div>

        <!-- 终端内容区 -->
        <div :style="{ backgroundColor: 'color-mix(in srgb, var(--color-muted) 50%, transparent)', padding: '2rem 2.5rem', position: 'relative', borderTop: '2px solid var(--color-border)', borderBottom: '2px solid var(--color-border)' }">
          <!-- CRT 扫描线 -->
          <div class="absolute inset-0 pointer-events-none" style="background: repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)"></div>
          <!-- 终端提示符 -->
          <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom: 1px solid var(--color-border)">
            <span style="color: var(--color-accent); font-family: var(--px-font); font-size: 0.75rem">root@game:~$</span>
            <span class="px-cursor-blink" style="color: var(--color-accent); font-weight: bold">▌</span>
          </div>
          <div v-html="slide.html" class="px-code-prose" />
        </div>

        <!-- 终端状态栏 -->
        <div :style="{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', borderTop: '2px solid var(--color-border)', padding: '0.4rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6rem', fontFamily: 'var(--px-font)', color: 'var(--color-muted-foreground)' }">
          <span>LINE: 042 | COL: 018</span>
          <span>MEM: 64KB</span>
          <span>FPS: 60</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes px-cursor-flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }

.px-code { padding: 2.5rem 3rem; }
.px-term-btn { width: 12px; height: 12px; display: inline-block; }
.px-cursor-blink { animation: px-cursor-flash 1s step-end infinite; }

.px-code-prose :deep(h1), .px-code-prose :deep(h2), .px-code-prose :deep(h3), .px-code-prose :deep(h4) {
  font-size: var(--fs-h3); font-weight: 700; color: var(--color-heading); font-family: var(--px-font);
  text-align: left; margin-bottom: 1.5rem;
}
.px-code-prose :deep(.code-block-wrapper) { width: 100%; }
.px-code-prose :deep(pre) { overflow-x: auto; margin: 0.5rem 0; }
.px-code-prose :deep(code) { font-family: var(--px-font); font-size: var(--fs-caption); line-height: 1.6; }
.px-code-prose :deep(p) { font-size: var(--fs-body-sm); color: var(--color-muted-foreground); text-align: left; font-family: var(--px-font); margin-top: 1rem; }
</style>
