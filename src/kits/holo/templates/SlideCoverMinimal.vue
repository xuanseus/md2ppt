<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-cover-minimal relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 全息网格背景 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoGridMinimal" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="var(--color-accent)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoGridMinimal)" />
      </svg>
    </div>

    <!-- ============ 中心内容 ============ -->
    <div class="relative z-10 text-center px-8" style="max-width: 640px">
      <!-- 系统状态条 -->
      <div class="flex items-center justify-center gap-3 mb-10">
        <span class="holo-sys-tag">SYS.ONLINE</span>
        <span class="holo-sys-sep"></span>
        <span class="holo-sys-tag dim">NODE-07</span>
      </div>

      <!-- 三角指引标记 -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <span class="holo-tri-pointer"></span>
        <span class="holo-tri-pointer-sm"></span>
        <span class="holo-tri-pointer"></span>
      </div>

      <!-- 标题 -->
      <h1 v-if="slide.title" class="holo-cover-minimal-title">{{ slide.title }}</h1>

      <!-- 内容 -->
      <div v-html="slide.html" class="holo-minimal-sub"></div>

      <!-- 底部分割线 -->
      <div class="holo-section-beam"></div>

      <!-- 数据点装饰 -->
      <div class="flex items-center justify-center gap-2 mt-6">
        <span class="holo-data-dot"></span>
        <span class="holo-data-dot" style="opacity: 0.3;"></span>
        <span class="holo-data-dot" style="opacity: 0.15;"></span>
      </div>
    </div>

    <!-- ============ 四角 HUD 准星 ============ -->
    <div class="absolute top-0 left-0 w-8 h-8 pointer-events-none holo-corner-tl"></div>
    <div class="absolute top-0 right-0 w-8 h-8 pointer-events-none holo-corner-tr"></div>
    <div class="absolute bottom-0 left-0 w-8 h-8 pointer-events-none holo-corner-bl"></div>
    <div class="absolute bottom-0 right-0 w-8 h-8 pointer-events-none holo-corner-br"></div>

    <!-- 底部全息扫描条 -->
    <div class="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none holo-bottom-scan"></div>
    <!-- 顶部扫描条 -->
    <div class="absolute top-[10%] left-0 w-full h-px pointer-events-none holo-top-scan"></div>
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

/* ===== 数据点 ===== */
.holo-data-dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  transform: rotate(45deg);
}

/* ===== 标题 ===== */
.holo-cover-minimal-title {
  font-size: calc(4rem * var(--content-scale));
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0 0 1.5rem 0;
}

/* ===== 分割线 ===== */
.holo-section-beam {
  width: 80px;
  height: 3px;
  margin: 1.5rem auto;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
}

/* ===== 副标题内容 ===== */
.holo-minimal-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
}
.holo-minimal-sub :deep(p + p) {
  margin-top: 0.5rem;
}

/* ===== 四角 HUD 准星 ===== */
.holo-corner-tl {
  border-top: 1px solid var(--color-accent);
  border-left: 1px solid var(--color-accent);
  opacity: 0.25;
  top: 12px;
  left: 12px;
}
.holo-corner-tr {
  border-top: 1px solid var(--color-accent);
  border-right: 1px solid var(--color-accent);
  opacity: 0.25;
  top: 12px;
  right: 12px;
}
.holo-corner-bl {
  border-bottom: 1px solid var(--color-accent);
  border-left: 1px solid var(--color-accent);
  opacity: 0.25;
  bottom: 12px;
  left: 12px;
}
.holo-corner-br {
  border-bottom: 1px solid var(--color-accent);
  border-right: 1px solid var(--color-accent);
  opacity: 0.25;
  bottom: 12px;
  right: 12px;
}

/* ===== 扫描条 ===== */
.holo-bottom-scan {
  background: linear-gradient(90deg, transparent 0%, var(--color-accent) 20%, var(--color-accent) 80%, transparent 100%);
  opacity: 0.25;
  animation: holo-bottom-glow 3s ease-in-out infinite;
}
.holo-top-scan {
  background: linear-gradient(90deg, transparent 5%, var(--color-accent) 50%, transparent 95%);
  opacity: 0.12;
}

@keyframes holo-bottom-glow {
  0%, 100% { opacity: 0.12; }
  50% { opacity: 0.35; }
}
</style>
