<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-code flex flex-col items-center justify-center w-full h-full" style="background: linear-gradient(180deg, #0a0f0a 0%, #0d1a0d 50%, #0a0f0a 100%)">
    <!-- CRT 扫描线 -->
    <div class="absolute inset-0 pointer-events-none opacity-4" style="background-image: repeating-linear-gradient(0deg, #33ff33 0px, #33ff33 1px, transparent 1px, transparent 4px)" />

    <div class="relative z-10 w-full max-w-5xl px-10 slide-animate">
      <!-- 调试终端窗口 -->
      <div :style="{ background: '#0a1a0a', border: '4px solid #1a4a1a', boxShadow: '0 0 0 2px #050a05, 0 0 0 6px #1a4a1a, 6px 6px 0 #0008, inset 0 0 30px rgba(0, 50, 0, 0.2)' }">
        <!-- 终端标题栏 -->
        <div :style="{ background: 'linear-gradient(90deg, #1a3a1a, #0f2a0f)', borderBottom: '3px solid #2a5a2a', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <div class="flex items-center gap-2">
            <span class="px-term-btn" style="background: #33ff33"></span>
            <span class="px-term-btn" style="background: #33cc33; opacity: 0.5"></span>
            <span class="px-term-btn" style="background: #339933; opacity: 0.3"></span>
          </div>
          <span class="font-bold text-xs tracking-widest uppercase" style="color: #33ff33; font-family: var(--px-font)">◈ DEBUG MODE ◈</span>
          <span class="text-xs" style="color: #33ff33; font-family: var(--px-font); opacity: 0.4">GAME_ENGINE.exe</span>
        </div>

        <!-- 终端内容区 -->
        <div :style="{ backgroundColor: '#050f05', padding: '2rem 2.5rem', position: 'relative', borderTop: '2px solid #0a200a', borderBottom: '2px solid #0a200a' }">
          <!-- CRT 扫描线 -->
          <div class="absolute inset-0 pointer-events-none" style="background: repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)"></div>
          <!-- 终端提示符 -->
          <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom: 1px solid #1a3a1a">
            <span style="color: #33ff33; font-family: var(--px-font); font-size: 0.75rem">root@game:~$</span>
            <span class="px-cursor-blink" style="color: #33ff33; font-weight: bold">▌</span>
          </div>
          <div v-html="slide.html" class="px-code-prose" />
          <span class="px-cursor-blink" style="color: #33ff33; font-family: var(--px-font); font-size: var(--fs-caption)">▌</span>
        </div>

        <!-- 终端状态栏 -->
        <div :style="{ background: '#0f200f', borderTop: '2px solid #1a3a1a', padding: '0.4rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6rem', fontFamily: 'var(--px-font)', color: '#33aa33' }">
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
  font-size: var(--fs-h3); font-weight: 700; color: #33ff33; font-family: var(--px-font);
  text-align: left; margin-bottom: 1.5rem; text-shadow: 0 0 8px rgba(51, 255, 51, 0.3);
}
.px-code-prose :deep(pre) { overflow-x: auto; margin: 0.5rem 0; border: 2px solid #1a3a1a; background: #030a03 !important; box-shadow: 4px 4px 0 #0006; }
.px-code-prose :deep(code) { font-family: var(--px-font); font-size: var(--fs-caption); line-height: 1.6; color: #33ff33 !important; text-shadow: 0 0 4px rgba(51, 255, 51, 0.2); }
.px-code-prose :deep(p) { font-size: var(--fs-body-sm); color: #33cc33; text-align: left; font-family: var(--px-font); margin-top: 1rem; }
</style>
