<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="sm-code w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 -->
    <div class="absolute left-[24%] top-[5%] w-60 h-48 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 砚台装饰元素 — 右下角 -->
    <div class="sm-inkstone">
      <div class="sm-inkstone-body">
        <div class="sm-inkstone-pool" />
      </div>
    </div>

    <!-- 代码卷轴 — 带弧形边界的面板 -->
    <div class="sm-code-scroll">
      <!-- 卷轴顶部弧形 -->
      <div class="sm-scroll-curve-top">
        <svg class="sm-scroll-svg" viewBox="0 0 400 20" preserveAspectRatio="none">
          <path d="M0,10 Q100,0 200,8 Q300,16 400,10" fill="none"
            :stroke="'var(--color-border)'" stroke-width="1.5" />
        </svg>
      </div>

      <!-- 代码内容区 -->
      <div class="sm-code-body"
        style="background: var(--color-code-bg); border-left: 4px solid var(--color-ink-light); border-right: 4px solid var(--color-ink-light);">
        <div v-html="slide.html" class="sm-code-prose" />
      </div>

      <!-- 卷轴底部弧形 -->
      <div class="sm-scroll-curve-bottom">
        <svg class="sm-scroll-svg" viewBox="0 0 400 20" preserveAspectRatio="none">
          <path d="M0,10 Q100,20 200,12 Q300,4 400,10" fill="none"
            :stroke="'var(--color-border)'" stroke-width="1.5" />
        </svg>
      </div>
    </div>

    <!-- 左侧笔搁装饰 -->
    <div class="sm-brush-rest">
      <span class="sm-brush-dot" v-for="n in 3" :key="n" />
    </div>
  </div>
</template>

<style scoped>
.sm-code {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

/* 砚台装饰 */
.sm-inkstone {
  position: absolute;
  right: 8%;
  bottom: 8%;
  width: 60px;
  height: 60px;
  pointer-events: none;
  opacity: 0.08;
}

.sm-inkstone-body {
  width: 100%;
  height: 100%;
  border-radius: 12% 12% 40% 40% / 15% 15% 45% 45%;
  background: color-mix(in srgb, var(--color-foreground) 30%, transparent);
  position: relative;
  box-shadow:
    inset 0 4px 8px color-mix(in srgb, var(--color-foreground) 20%, transparent);
}

.sm-inkstone-pool {
  position: absolute;
  top: 15%;
  left: 20%;
  width: 60%;
  height: 35%;
  border-radius: 45%;
  background: color-mix(in srgb, var(--color-foreground) 50%, transparent);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}

/* 代码卷轴容器 */
.sm-code-scroll {
  position: relative;
  width: 80%;
  max-width: 900px;
  max-height: 75vh;
  z-index: 10;
}

.sm-scroll-curve-top,
.sm-scroll-curve-bottom {
  width: 100%;
  height: 20px;
  overflow: visible;
}

.sm-scroll-svg {
  width: 100%;
  height: 100%;
}

/* 代码面板主体 */
.sm-code-body {
  padding: 1.5rem 2rem;
  border-radius: 2px;
  box-shadow:
    0 2px 16px rgba(0,0,0,0.08),
    inset 0 1px 0 color-mix(in srgb, var(--color-ink-light) 8%, transparent),
    inset 0 -1px 0 color-mix(in srgb, var(--color-ink-light) 8%, transparent);
  overflow-y: auto;
}

/* 笔搁装饰 — 左侧竖排小点 */
.sm-brush-rest {
  position: absolute;
  left: 6%;
  top: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0.06;
  pointer-events: none;
}

.sm-brush-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 2px;
  transform: rotate(45deg);
  background: var(--color-foreground);
}
.sm-brush-dot:nth-child(1) { opacity: 0.6; width: 5px; height: 5px; }
.sm-brush-dot:nth-child(2) { opacity: 0.35; width: 8px; height: 8px; }
.sm-brush-dot:nth-child(3) { opacity: 0.15; width: 5px; height: 5px; }

/* 内文样式 */
.sm-code-prose :deep(h1),
.sm-code-prose :deep(h2),
.sm-code-prose :deep(h3),
.sm-code-prose :deep(h4) {
  font-size: var(--fs-h3);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}

.sm-code-prose :deep(pre) {
  border-radius: 3px;
  overflow-x: auto;
  margin: 0.5rem 0;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
}

.sm-code-prose :deep(code) {
  font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', ui-monospace, monospace;
  font-size: var(--fs-caption);
  line-height: 1.6;
  /* 暖色调 */
  color: var(--color-code-fg);
  filter: sepia(0.08);
}

.sm-code-prose :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  margin-top: 1rem;
}
</style>
