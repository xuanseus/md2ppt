<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-content-centered relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景三角形网格 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.025]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoCenteredGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <line x1="0" y1="50" x2="50" y2="0" stroke="var(--color-accent)" stroke-width="0.5"/>
            <line x1="25" y1="50" x2="25" y2="0" stroke="var(--color-accent)" stroke-width="1"/>
            <line x1="0" y1="50" x2="50" y2="50" stroke="var(--color-accent)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoCenteredGrid)" />
      </svg>
    </div>

    <!-- ============ 中央内容 ============ -->
    <div class="relative z-10 text-center px-8" style="max-width: 720px; width: 80%;">
      <h3 v-if="slide.title" class="holo-centered-title">{{ slide.title }}</h3>
      <div v-html="slide.html" class="holo-centered-prose"></div>
    </div>

    <!-- ============ 底部扫描数据 ============ -->
    <div class="absolute bottom-4 left-4 z-10 holo-bottom-data">
      <span class="holo-data-text">FRAME: {{ String(Date.now() % 100000).padStart(5, '0') }}</span>
      <span class="holo-data-sep">|</span>
      <span class="holo-data-text">MODE: CENTER</span>
    </div>
  </div>
</template>

<style scoped>
/* ===== 标题 ===== */
.holo-centered-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0 0 2rem 0;
}

/* ===== 内容 ===== */
.holo-centered-prose :deep(h1),
.holo-centered-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
}

.holo-centered-prose :deep(h3),
.holo-centered-prose :deep(h4) {
  font-size: var(--fs-h3);
  font-weight: 500;
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
}

.holo-centered-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;
}

.holo-centered-prose :deep(ul) {
  list-style: none;
  padding: 0;
}

.holo-centered-prose :deep(li) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  padding: 0.5rem 0;
}

.holo-centered-prose :deep(li::before) {
  content: '\25B6';
  color: var(--color-accent);
  margin-right: 0.5rem;
  font-size: 0.6em;
}

.holo-centered-prose :deep(strong) {
  color: var(--color-accent);
  font-weight: 700;
}

.holo-centered-prose :deep(a) {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-accent);
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
</style>
