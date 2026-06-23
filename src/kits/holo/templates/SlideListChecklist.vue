<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'

const props = defineProps<{ slide: Slide }>()

const items = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim()).filter(Boolean)
})
</script>

<template>
  <div class="holo-list-checklist relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景六边形网格 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.025]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoChecklistGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="var(--color-accent)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoChecklistGrid)" />
      </svg>
    </div>

    <!-- ============ 标题 ============ -->
    <div class="absolute z-10" style="top: 6%; left: 50%; transform: translateX(-50%);">
      <h2 v-if="slide.title" class="holo-cl-title">{{ slide.title }}</h2>
    </div>

    <!-- ============ 检查列表 ============ -->
    <div class="relative z-10" style="max-width: 640px; width: 70%; margin-top: 20px;">
      <div v-if="items.length" class="holo-cl-list">
        <div v-for="(item, i) in items" :key="i" class="holo-cl-item" :style="{ animationDelay: `${0.1 + i * 0.08}s` }">
          <span class="holo-cl-check">&#10003;</span>
          <span class="holo-cl-text">{{ item }}</span>
        </div>
      </div>
    </div>

    <!-- ============ 底部状态 ============ -->
    <div class="absolute bottom-4 left-4 z-10 holo-bottom-data">
      <span class="holo-data-text">ITEMS</span>
      <span class="holo-data-sep">::</span>
      <span class="holo-data-text">{{ items.length }}</span>
    </div>
  </div>
</template>

<style scoped>
/* ===== 标题 ===== */
.holo-cl-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  text-align: center;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
}

/* ===== 列表 ===== */
.holo-cl-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.holo-cl-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  background: color-mix(in srgb, var(--color-card) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 15%, transparent);
  clip-path: polygon(
    0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px,
    100% calc(100% - 8px), calc(100% - 8px) 100%,
    8px 100%, 0 calc(100% - 8px)
  );
  animation: holo-slide-in 0.5s ease both;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.holo-cl-item:hover {
  border-color: var(--color-accent);
  box-shadow: var(--holo-border-glow);
}

/* ===== 勾选标记 ===== */
.holo-cl-check {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  text-shadow: var(--holo-glow);
}

/* ===== 文本 ===== */
.holo-cl-text {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.5;
  font-family: 'JetBrains Mono', monospace;
}

/* ===== 底部数据 ===== */
.holo-bottom-data {
  font-size: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  gap: 0.4rem;
}

.holo-data-text {
  color: var(--color-muted-foreground);
  opacity: 0.35;
}

.holo-data-sep {
  color: var(--color-accent);
  opacity: 0.15;
}

@keyframes holo-slide-in {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}
</style>
