<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-stats flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 战斗像素粒子背景 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-6">
      <div v-for="n in 16" :key="n" class="absolute px-battle-particle"
        :style="{ width: (10 + (n % 5) * 6) + 'px', height: (10 + (n % 5) * 6) + 'px', left: ((n * 41 + 19) % 100) + '%', top: ((n * 67 + 23) % 100) + '%', background: n % 4 === 0 ? 'var(--color-accent)' : n % 4 === 1 ? 'var(--color-h1-to)' : '#e55', animationDelay: (n * 0.2) + 's' }" />
    </div>

    <div class="relative z-10 max-w-5xl px-12 slide-animate">
      <!-- 战斗数据大框 -->
      <div :style="{ background: 'var(--color-card)', border: '4px solid var(--color-border)', boxShadow: '0 0 0 2px var(--color-background), 0 0 0 6px var(--color-border), 8px 8px 0 #0008', padding: '3rem 4rem', textAlign: 'center' }">
        <!-- LEVEL UP 标签 -->
        <div class="px-level-up-badge mx-auto mb-6 px-6 py-1d5 inline-block" style="background: linear-gradient(90deg, var(--color-accent), var(--color-h1-to)); color: var(--color-accent-foreground); box-shadow: 3px 3px 0 #0006">
          <span class="text-sm font-extrabold tracking-widest uppercase" style="font-family: var(--px-font)">LEVEL UP!</span>
        </div>

        <!-- 核心数据大字报内容 -->
        <div v-html="slide.html" class="px-stats-prose" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes px-particle-float {
  0% { transform: translateY(0) translateX(0); opacity: 0.6; }
  50% { transform: translateY(-10px) translateX(5px); opacity: 1; }
  100% { transform: translateY(-20px) translateX(-5px); opacity: 0; }
}
@keyframes px-stats-pop {
  0% { transform: scale(0.3); opacity: 0; }
  40% { transform: scale(1.15); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
}

.px-stats { padding: 2.5rem 3rem; }
.px-battle-particle { animation: px-particle-float 3s step-end infinite; }
.px-level-up-badge { animation: px-stats-pop 0.6s step-end; }

.px-hp-mega-bar { width: 100%; height: 32px; background: var(--color-muted); border: 3px solid var(--color-border); box-shadow: inset 0 0 0 2px var(--color-background); position: relative; overflow: hidden; }
.px-hp-mega-fill { height: 100%; width: 89%; background: repeating-linear-gradient(90deg, #4c9 0px, #4c9 4px, color-mix(in srgb, var(--color-accent) 80%, transparent) 4px, color-mix(in srgb, var(--color-accent) 80%, transparent) 8px); }
.px-mp-mega-bar { width: 100%; height: 20px; background: var(--color-muted); border: 3px solid var(--color-border); position: relative; overflow: hidden; }
.px-mp-mega-fill { height: 100%; width: 65%; background: repeating-linear-gradient(90deg, var(--color-h1-to) 0px, var(--color-h1-to) 4px, color-mix(in srgb, var(--color-h1-to) 50%, transparent) 4px, color-mix(in srgb, var(--color-h1-to) 50%, transparent) 8px); }

.px-cmd { font-size: 0.8rem; font-weight: 800; font-family: var(--px-font); letter-spacing: 0.08em; text-transform: uppercase; }
.px-cmd-sep { color: var(--color-border); font-family: var(--px-font); }

.px-stats-prose :deep(h4) { font-size: var(--fs-body-sm); font-weight: 500; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-muted-foreground); text-align: center; font-family: var(--px-font); }
.px-stats-prose :deep(strong) { display: block; font-size: var(--fs-stat); font-weight: 700; line-height: 1; margin-bottom: 1.2rem; color: var(--color-accent); font-family: var(--px-font); text-shadow: 4px 4px 0 #0006; animation: px-stats-pop 0.6s ease-out; }
.px-stats-prose :deep(p) { font-size: var(--fs-body); color: var(--color-muted-foreground); margin-top: 1.2rem; line-height: 1.7; font-family: var(--px-font); }
</style>
