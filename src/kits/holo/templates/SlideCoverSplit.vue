<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-cover-split relative w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 全息网格背景 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.04]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoGridSplit" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="var(--color-accent)" stroke-width="0.5"/>
            <line x1="0" y1="30" x2="60" y2="30" stroke="var(--color-accent)" stroke-width="0.3" opacity="0.5"/>
            <line x1="30" y1="0" x2="30" y2="60" stroke="var(--color-accent)" stroke-width="0.3" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoGridSplit)" />
      </svg>
    </div>

    <!-- 对角线分区底色 -->
    <div class="absolute inset-0 pointer-events-none" style="
      clip-path: polygon(0 0, 100% 0, 0 100%);
      background: color-mix(in srgb, var(--color-accent) 3%, transparent);
    "></div>
    <div class="absolute inset-0 pointer-events-none" style="
      clip-path: polygon(100% 0, 100% 100%, 0 100%);
      background: color-mix(in srgb, var(--color-h1-to) 3%, transparent);
    "></div>

    <!-- 对角线数据流 -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none" style="
      background: linear-gradient(135deg, transparent 48%, var(--color-accent) 49%, var(--color-accent) 51%, transparent 52%);
      opacity: 0.06;
    "></div>

    <!-- ============ 左上层面板 ============ -->
    <div class="absolute z-20" style="top: 10%; left: 6%; width: 42%; max-width: 560px">
      <!-- 系统状态条 -->
      <div class="flex items-center gap-3 mb-8">
        <span class="holo-sys-tag">SYS.ONLINE</span>
        <span class="holo-sys-sep"></span>
        <span class="holo-sys-tag dim">NODE-07</span>
        <span class="holo-sys-sep"></span>
        <span class="holo-sys-tag dim">SEC:L-5</span>
      </div>

      <!-- 标题 -->
      <h1 v-if="slide.title" class="holo-cover-split-title">{{ slide.title }}</h1>

      <!-- 三角指引标记 -->
      <div class="flex items-center gap-2 mt-6">
        <span class="holo-tri-pointer"></span>
        <span class="holo-tri-pointer-sm"></span>
        <span class="holo-tri-pointer"></span>
      </div>

      <!-- 内容 -->
      <div v-html="slide.html" class="holo-split-sub"></div>
    </div>

    <!-- ============ 右下层面板（装饰） ============ -->
    <div class="absolute z-20 flex flex-col items-end justify-end" style="bottom: 10%; right: 6%; width: 42%; max-width: 520px">
      <!-- 全息装饰框 -->
      <div class="holo-split-deco-frame">
        <div class="holo-split-deco-inner">
          <div class="holo-split-deco-hex"></div>
          <span class="holo-split-deco-label">HOLO://DEPLOY</span>
          <div class="holo-split-deco-hex"></div>
        </div>
      </div>

      <!-- 底部数据流线 -->
      <div class="flex items-center justify-end gap-2 mt-6">
        <span class="holo-data-stream"></span>
        <span class="holo-data-dot"></span>
        <span class="holo-data-stream"></span>
        <span class="holo-data-dot"></span>
        <span class="holo-data-stream long"></span>
      </div>
    </div>

    <!-- ============ 四角 HUD 准星 ============ -->
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
.holo-cover-split-title {
  font-size: calc(4rem * var(--content-scale));
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
.holo-split-sub :deep(h1),
.holo-split-sub :deep(h2),
.holo-split-sub :deep(h3),
.holo-split-sub :deep(h4),
.holo-split-sub :deep(h5),
.holo-split-sub :deep(h6) {
  display: none;
}
.holo-split-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
}
.holo-split-sub :deep(p + p) {
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

/* ===== 装饰框 ===== */
.holo-split-deco-frame {
  padding: 3rem;
  background: color-mix(in srgb, var(--color-card) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
  clip-path: polygon(
    0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px,
    100% calc(100% - 20px), calc(100% - 20px) 100%,
    20px 100%, 0 calc(100% - 20px)
  );
  box-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 8%, transparent);
}
.holo-split-deco-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.holo-split-deco-hex {
  width: 20px;
  height: 23px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: var(--color-accent);
  opacity: 0.3;
}
.holo-split-deco-label {
  font-size: 0.6rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  letter-spacing: 0.2em;
  text-shadow: var(--holo-glow);
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

@keyframes holo-bottom-glow {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.4; }
}
</style>
