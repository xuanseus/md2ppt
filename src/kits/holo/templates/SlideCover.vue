<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-cover relative w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 全息网格背景 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.04]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoGridCover" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="var(--color-accent)" stroke-width="0.5"/>
            <line x1="0" y1="30" x2="60" y2="30" stroke="var(--color-accent)" stroke-width="0.3" opacity="0.5"/>
            <line x1="30" y1="0" x2="30" y2="60" stroke="var(--color-accent)" stroke-width="0.3" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoGridCover)" />
      </svg>
    </div>

    <!-- ============ 对角线分割线（从左上到右下） ============ -->
    <div class="absolute inset-0 pointer-events-none" style="
      background: linear-gradient(135deg,
        color-mix(in srgb, var(--color-accent) 8%, transparent) 0%,
        color-mix(in srgb, var(--color-accent) 3%, transparent) 49.5%,
        transparent 50.5%,
        color-mix(in srgb, var(--color-h1-to) 3%, transparent) 50.5%,
        color-mix(in srgb, var(--color-h1-to) 8%, transparent) 100%);
      clip-path: none;
    "></div>

    <!-- 对角线发光扫描线 -->
    <div class="absolute top-[50%] left-0 w-full h-[2px] pointer-events-none" style="
      background: linear-gradient(90deg, transparent, var(--color-accent) 20%, var(--color-accent) 80%, transparent);
      transform: rotate(-45deg) scaleX(2);
      opacity: 0.15;
      animation: holo-diag-scan 4s ease-in-out infinite;
    "></div>

    <!-- 左上三角区域：系统标识 + 标题 -->
    <div class="absolute z-10" style="top: 12%; left: 8%; width: 45%; max-width: 600px; clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%)">
      <!-- 系统状态条 -->
      <div class="flex items-center gap-3 mb-10">
        <span class="holo-sys-tag">SYS.ONLINE</span>
        <span class="holo-sys-sep"></span>
        <span class="holo-sys-tag dim">NODE-07</span>
        <span class="holo-sys-sep"></span>
        <span class="holo-sys-tag dim">SEC:L-5</span>
      </div>

      <!-- 标题 -->
      <h1 v-if="slide.title" class="holo-cover-title">{{ slide.title }}</h1>

      <!-- 三角指引标记 -->
      <div class="flex items-center gap-2 mt-6">
        <span class="holo-tri-pointer"></span>
        <span class="holo-tri-pointer-sm"></span>
        <span class="holo-tri-pointer"></span>
      </div>
    </div>

    <!-- 右下三角区域：副标题内容 -->
    <div class="absolute z-10 flex flex-col justify-end" style="bottom: 10%; right: 6%; width: 42%; text-align: right; clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%)">
      <div v-html="slide.html" class="holo-cover-sub"></div>

      <!-- 底部数据流线 -->
      <div class="flex items-center justify-end gap-2 mt-8">
        <span class="holo-data-stream"></span>
        <span class="holo-data-dot"></span>
        <span class="holo-data-stream"></span>
        <span class="holo-data-dot"></span>
        <span class="holo-data-stream long"></span>
      </div>
    </div>

    <!-- 四角 HUD 准星 -->
    <div class="absolute top-0 left-0 w-8 h-8 pointer-events-none holo-corner-tl"></div>
    <div class="absolute top-0 right-0 w-8 h-8 pointer-events-none holo-corner-tr"></div>
    <div class="absolute bottom-0 left-0 w-8 h-8 pointer-events-none holo-corner-bl"></div>
    <div class="absolute bottom-0 right-0 w-8 h-8 pointer-events-none holo-corner-br"></div>

    <!-- 底部全息扫描条 -->
    <div class="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none holo-bottom-scan"></div>
  </div>
</template>

<style scoped>
/* ===== 系统状态标签 ===== */
.holo-sys-tag {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
}
.holo-sys-tag.dim {
  color: var(--color-muted-foreground);
  opacity: 0.5;
}
.holo-sys-sep {
  width: 1px;
  height: 10px;
  background: var(--color-accent);
  opacity: 0.3;
}

/* ===== 标题 ===== */
.holo-cover-title {
  font-size: calc(5rem * var(--content-scale));
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
}

/* ===== 三角指针 ===== */
.holo-tri-pointer {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 10px solid var(--color-accent);
}
.holo-tri-pointer-sm {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid var(--color-accent);
  opacity: 0.5;
}

/* ===== 副标题内容 ===== */
.holo-cover-sub :deep(h1),
.holo-cover-sub :deep(h2),
.holo-cover-sub :deep(h3),
.holo-cover-sub :deep(h4),
.holo-cover-sub :deep(h5),
.holo-cover-sub :deep(h6) {
  display: none;
}
.holo-cover-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
}
.holo-cover-sub :deep(p + p) {
  margin-top: 0.75rem;
}

/* ===== 数据流线 ===== */
.holo-data-stream {
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent));
  opacity: 0.4;
}
.holo-data-stream.long {
  width: 48px;
}
.holo-data-dot {
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  transform: rotate(45deg);
  opacity: 0.6;
}

/* ===== 四角 HUD 准星 ===== */
.holo-corner-tl {
  border-top: 1px solid var(--color-accent);
  border-left: 1px solid var(--color-accent);
  opacity: 0.3;
  top: 12px;
  left: 12px;
}
.holo-corner-tr {
  border-top: 1px solid var(--color-accent);
  border-right: 1px solid var(--color-accent);
  opacity: 0.3;
  top: 12px;
  right: 12px;
}
.holo-corner-bl {
  border-bottom: 1px solid var(--color-accent);
  border-left: 1px solid var(--color-accent);
  opacity: 0.3;
  bottom: 12px;
  left: 12px;
}
.holo-corner-br {
  border-bottom: 1px solid var(--color-accent);
  border-right: 1px solid var(--color-accent);
  opacity: 0.3;
  bottom: 12px;
  right: 12px;
}

/* ===== 底部扫描条 ===== */
.holo-bottom-scan {
  background: linear-gradient(90deg, transparent 0%, var(--color-accent) 20%, var(--color-accent) 80%, transparent 100%);
  opacity: 0.3;
  animation: holo-bottom-glow 3s ease-in-out infinite;
}

@keyframes holo-diag-scan {
  0%, 100% { opacity: 0.08; }
  50% { opacity: 0.25; }
}

@keyframes holo-bottom-glow {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.4; }
}
</style>
