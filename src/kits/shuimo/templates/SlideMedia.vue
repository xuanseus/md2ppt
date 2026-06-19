<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="sm-media w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 画框 — 多层水墨边框，形成装裱效果 -->
    <div class="sm-frame-outer" />

    <!-- 内层裱边 -->
    <div class="sm-frame-inner" />

    <!-- 画心 — 微旋1.5度，模拟手工装裱的不完美 -->
    <div class="sm-frame-artwork">
      <div v-html="slide.html" class="sm-media-content" />
    </div>

    <!-- 四角笔墨装饰点 -->
    <span class="sm-corner-dot sm-corner-tl" />
    <span class="sm-corner-dot sm-corner-tr" />
    <span class="sm-corner-dot sm-corner-bl" />
    <span class="sm-corner-dot sm-corner-br" />

    <!-- 右上角印章 -->
    <div class="sm-seal absolute top-[6%] right-[6%] w-14 h-14 flex items-center justify-center select-none z-20"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.55rem; letter-spacing: 0.1em; transform: rotate(6deg); opacity: 0.5; padding: 2px;">
      鉴
    </div>

    <!-- 左下角题签 -->
    <div class="absolute left-[6%] bottom-[6%] z-20 opacity-[0.12] select-none"
      style="writing-mode: vertical-rl; text-orientation: mixed; font-family: 'KaiTi', 'STKaiti', serif; font-size: 0.55rem; letter-spacing: 0.2em; color: var(--color-muted-foreground);">
      岁次甲辰
    </div>
  </div>
</template>

<style scoped>
.sm-media {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

/* 外层画框 — 厚墨边框 */
.sm-frame-outer {
  position: absolute;
  inset: 4%;
  pointer-events: none;
  border: 6px solid var(--color-foreground);
  opacity: 0.06;
  transform: rotate(-1.5deg);
  border-radius: 1px;
}

/* 内层裱边 — 宣纸色 */
.sm-frame-inner {
  position: absolute;
  inset: 6%;
  pointer-events: none;
  border: 2px solid var(--color-border);
  opacity: 0.15;
  transform: rotate(-1.5deg);
  background: var(--color-card);
}

/* 画心 — 媒体内容，微旋 */
.sm-frame-artwork {
  position: absolute;
  inset: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-1.5deg);
  /* 不规则裁剪 — 模拟手裁 */
  clip-path: polygon(
    1% 0%, 99% 0.5%, 100% 98%, 98% 100%, 0.5% 99.5%, 0% 2%
  );
}

/* 四角墨点 */
.sm-corner-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  transform: rotate(45deg);
  pointer-events: none;
  z-index: 5;
  opacity: 0.12;
  background: var(--color-foreground);
}
.sm-corner-tl { top: 5%; left: 5%; }
.sm-corner-tr { top: 5%; right: 5%; }
.sm-corner-bl { bottom: 5%; left: 5%; }
.sm-corner-br { bottom: 5%; right: 5%; }

/* 媒体内容样式 */
.sm-media-content :deep(video) {
  width: 100vw;
  height: 100vh;
  object-fit: contain;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sm-media-content :deep(img) {
  max-width: 92%;
  max-height: 80vh;
  display: block;
  margin: 0 auto;
  border-radius: 2px;
  object-fit: contain;
  box-shadow:
    0 6px 24px rgba(0,0,0,0.12),
    inset 0 0 0 1px rgba(0,0,0,0.04);
}
</style>
