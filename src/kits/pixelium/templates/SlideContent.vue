<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="px-content flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 像素网格背景 -->
    <div class="absolute inset-0 pointer-events-none opacity-3" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3))" />

    <div class="relative z-10 w-full max-w-5xl px-10 slide-animate">
      <!-- 菜单窗口 -->
      <div :style="{ background: 'var(--color-card)', border: '3px solid var(--color-border)', boxShadow: '0 0 0 1px var(--color-background), 0 0 0 4px var(--color-border), 5px 5px 0 #0006' }">
        <!-- 窗口标题栏 -->
        <div :style="{ background: 'linear-gradient(90deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 70%, var(--color-h1-to)))', padding: '0.5rem 1rem', borderBottom: '2px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <span class="font-bold text-xs tracking-widest uppercase" style="color: var(--color-background); font-family: var(--px-font)">
            ▼ MENU
          </span>
          <div class="flex gap-1d5">
            <span style="width: 10px; height: 10px; background: var(--color-background); opacity: 0.6; display: inline-block"></span>
            <span style="width: 10px; height: 10px; background: var(--color-background); opacity: 0.4; display: inline-block"></span>
            <span style="width: 10px; height: 10px; background: var(--color-background); opacity: 0.25; display: inline-block"></span>
          </div>
        </div>

        <!-- 菜单内容区 -->
        <div style="padding: 2.5rem 3rem;" class="relative">
          <div v-html="slide.html" class="px-content-prose" />
        </div>

        <!-- 底部操作提示栏 -->
        <div :style="{ background: 'var(--color-muted)', borderTop: '2px solid var(--color-border)', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }">
          <div class="flex items-center gap-2">
            <span class="px-btn-icon" style="background: var(--color-accent); color: var(--color-background)">A</span>
            <span class="text-xs" style="color: var(--color-muted-foreground); font-family: var(--px-font)">Continue</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-btn-icon" style="background: var(--color-muted-foreground); color: var(--color-background)">B</span>
            <span class="text-xs" style="color: var(--color-muted-foreground); font-family: var(--px-font)">Back</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-content {
  padding: 2.5rem 3rem;
}

.px-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 0.65rem;
  font-weight: 800;
  font-family: var(--px-font);
  box-shadow: 1px 1px 0 #0004;
}

.px-content-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.2;
  color: var(--color-heading);
  font-family: var(--px-font);
}

.px-content-prose :deep(h3) {
  font-size: var(--fs-h3);
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--color-heading);
  font-family: var(--px-font);
}

.px-content-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-foreground);
  font-family: var(--px-font);
}

.px-content-prose :deep(ul),
.px-content-prose :deep(ol) {
  padding-left: 0;
  margin: 1rem 0;
  list-style: none;
}

.px-content-prose :deep(li) {
  font-size: var(--fs-body-sm);
  margin-bottom: 0.6rem;
  line-height: 1.7;
  padding: 0.5rem 1rem 0.5rem 2rem;
  position: relative;
  font-family: var(--px-font);
  background: color-mix(in srgb, var(--color-accent) 5%, transparent);
  border: 1px solid var(--color-border);
  box-shadow: 2px 2px 0 color-mix(in srgb, var(--color-accent) 8%, transparent);
}

.px-content-prose :deep(li)::before {
  content: '▶';
  position: absolute;
  left: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.55em;
  color: var(--color-accent);
  font-family: monospace;
}

.px-content-prose :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: normal;
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
  box-shadow: 4px 4px 0 color-mix(in srgb, var(--color-accent) 10%, transparent);
  font-family: var(--px-font);
}

.px-content-prose :deep(code) {
  padding: 0.2rem 0.5rem;
  font-size: 0.9em;
  background: var(--color-muted);
  color: var(--color-accent);
  font-family: var(--px-font);
  border: 1px solid var(--color-border);
}

.px-content-prose :deep(pre) {
  overflow-x: auto;
  border: 2px solid var(--color-border);
  box-shadow: 4px 4px 0 color-mix(in srgb, var(--color-accent) 15%, transparent);
}

.px-content-prose :deep(h1) {
  background: linear-gradient(180deg, var(--color-h1-from, var(--color-accent)) 0%, var(--color-h1-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--px-font);
}

.px-content-prose :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-family: var(--px-font);
}

.px-content-prose :deep(img) {
  max-width: 90%;
  max-height: 55vh;
  display: block;
  margin: 1rem auto;
  object-fit: contain;
  border: 3px solid var(--color-border);
  box-shadow: 6px 6px 0 color-mix(in srgb, var(--color-accent) 15%, transparent);
}
</style>
