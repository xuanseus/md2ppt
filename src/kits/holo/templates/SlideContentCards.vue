<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-content-cards relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景网格 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.025]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoCardsGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <line x1="0" y1="50" x2="50" y2="0" stroke="var(--color-accent)" stroke-width="0.5"/>
            <line x1="25" y1="50" x2="25" y2="0" stroke="var(--color-accent)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoCardsGrid)" />
      </svg>
    </div>

    <!-- ============ 卡片内容区 ============ -->
    <div class="relative z-10" style="max-width: 720px; width: 75%;">
      <!-- 标题 -->
      <h3 v-if="slide.title" class="holo-cards-title">{{ slide.title }}</h3>

      <!-- 卡片 -->
      <div class="holo-card-wrapper">
        <div class="holo-card-body">
          <!-- 顶部标签 -->
          <div class="holo-card-header">
            <span class="holo-dash-dot active"></span>
            <span class="holo-dash-label">DATACARD</span>
            <span class="holo-dash-dot active"></span>
          </div>
          <!-- 内容 -->
          <div v-html="slide.html" class="holo-cards-prose"></div>
        </div>
      </div>
    </div>

    <!-- ============ 底部扫描数据 ============ -->
    <div class="absolute bottom-4 left-4 z-10 holo-bottom-data">
      <span class="holo-data-text">STATUS: ACTIVE</span>
      <span class="holo-data-sep">|</span>
      <span class="holo-data-text">MEM: OK</span>
    </div>
  </div>
</template>

<style scoped>
/* ===== 标题 ===== */
.holo-cards-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  text-align: center;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0 0 2rem 0;
}

/* ===== 卡片包裹 ===== */
.holo-card-wrapper {
  position: relative;
}

.holo-card-body {
  padding: 2.5rem 3rem;
  background: var(--color-card);
  border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
  clip-path: polygon(
    0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px,
    100% calc(100% - 16px), calc(100% - 16px) 100%,
    16px 100%, 0 calc(100% - 16px)
  );
  box-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 6%, transparent);
  transition: box-shadow 0.3s ease;
}

.holo-card-body:hover {
  box-shadow: var(--holo-border-glow);
}

/* ===== 卡片头部 ===== */
.holo-card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
}

.holo-dash-dot {
  width: 6px;
  height: 6px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: var(--color-accent);
  opacity: 0.3;
}

.holo-dash-dot.active {
  opacity: 1;
  box-shadow: var(--holo-glow);
  animation: holo-dot-blink 2s ease-in-out infinite;
}

.holo-dash-label {
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ===== 内容 ===== */
.holo-cards-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-foreground);
  line-height: 1.8;
}

.holo-cards-prose :deep(ul) {
  list-style: none;
  padding: 0;
}

.holo-cards-prose :deep(li) {
  font-size: var(--fs-body-sm);
  padding: 0.4rem 0;
  color: var(--color-foreground);
  padding-left: 1.5rem;
  position: relative;
}

.holo-cards-prose :deep(li::before) {
  content: '\25B8';
  position: absolute;
  left: 0;
  color: var(--color-accent);
}

.holo-cards-prose :deep(strong) {
  color: var(--color-accent);
  font-weight: 700;
}

/* ===== 底部数据 ===== */
.holo-bottom-data {
  font-size: 0.55rem;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  gap: 0.5rem;
}

.holo-data-text {
  color: var(--color-muted-foreground);
  opacity: 0.4;
}

.holo-data-sep {
  color: var(--color-accent);
  opacity: 0.2;
}

@keyframes holo-dot-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
