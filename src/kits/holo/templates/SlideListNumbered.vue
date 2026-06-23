<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'

const props = defineProps<{ slide: Slide }>()

const parsed = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const items: string[] = []
  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+(.+)$/)
    if (m) items.push(m[1])
  }
  return { items }
})
</script>

<template>
  <div class="holo-list-numbered relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景六边形点阵 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.025]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoNumListHex" width="100" height="87" patternUnits="userSpaceOnUse">
            <polygon points="50,0 100,25 100,62 50,87 0,62 0,25" fill="none" stroke="var(--color-accent)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoNumListHex)" />
      </svg>
    </div>

    <!-- ============ 左侧状态面板 ============ -->
    <div class="absolute z-20 holo-nl-status-panel">
      <div v-for="(item, i) in parsed.items" :key="'status-'+i" class="holo-nl-status-block">
        <span class="holo-nl-status-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="holo-nl-status-line" :class="{ active: i === 0 }"></span>
      </div>
    </div>

    <!-- ============ 标题 ============ -->
    <div class="absolute z-10" style="top: 6%; left: 50%; transform: translateX(-50%);">
      <h2 v-if="slide.title" class="holo-nl-title">{{ slide.title }}</h2>
    </div>

    <!-- ============ 浮动卡片区域 ============ -->
    <div class="relative z-10 holo-nl-cards-area">
      <div
        v-for="(item, i) in parsed.items"
        :key="i"
        class="holo-nl-floating-card"
        :class="{ 'card-left': i % 2 === 0, 'card-right': i % 2 !== 0 }"
        :style="{
          '--stagger-y': (i * 110 + 30) + 'px',
          '--card-z': (10 - i) + '',
        }"
      >
        <div class="holo-nl-card-inner" :class="{ 'even-card': i % 2 !== 0 }">
          <!-- 顶部缩进标记 -->
          <div class="holo-nl-card-notch" :class="{ 'notch-right': i % 2 !== 0 }">
            <span class="holo-nl-notch-tri"></span>
            <span class="holo-nl-notch-num">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>

          <!-- 卡片内容 -->
          <div class="holo-nl-card-body">
            <p class="holo-nl-item-text">{{ item }}</p>
          </div>

          <!-- 底部连接线 -->
          <div class="holo-nl-card-connector" :class="{ 'conn-right': i % 2 !== 0 }"></div>
        </div>
      </div>
    </div>

    <!-- ============ 右侧信号强度 ============ -->
    <div class="absolute z-20 holo-nl-signal-panel">
      <div class="holo-nl-signal-bars">
        <div v-for="n in parsed.items.length" :key="'sig-'+n" class="holo-nl-signal-bar-v" :style="{ height: (8 + n * 6) + 'px', opacity: 0.2 + n * 0.15 }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 状态面板 ===== */
.holo-nl-status-panel {
  left: 3%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.holo-nl-status-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.holo-nl-status-num {
  font-size: 0.55rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  width: 20px;
  text-align: right;
}

.holo-nl-status-line {
  width: 16px;
  height: 2px;
  background: color-mix(in srgb, var(--color-accent) 20%, transparent);
}

.holo-nl-status-line.active {
  background: var(--color-accent);
  box-shadow: var(--holo-glow);
}

/* ===== 标题 ===== */
.holo-nl-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
}

/* ===== 卡片区域 ===== */
.holo-nl-cards-area {
  width: 70vw;
  max-width: 800px;
  min-height: 480px;
  position: relative;
  margin-left: 40px;
  margin-right: 40px;
}

/* ===== 浮动卡片 ===== */
.holo-nl-floating-card {
  position: absolute;
  width: 280px;
  left: 50%;
  transform: translateX(-50%);
  top: var(--stagger-y, 20px);
  z-index: var(--card-z, 10);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              margin-left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.holo-nl-floating-card.card-left {
  margin-left: -220px;
}

.holo-nl-floating-card.card-right {
  margin-left: 120px;
}

.holo-nl-floating-card:hover {
  transform: translateX(-50%) scale(1.05);
  z-index: 50;
}

/* ===== 卡片内部 ===== */
.holo-nl-card-inner {
  padding: 1rem 1.25rem;
  background: var(--color-card);
  border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
  clip-path: polygon(
    0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px,
    100% 100%, 0 100%
  );
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.holo-nl-card-inner:hover {
  border-color: var(--color-accent);
  box-shadow: var(--holo-border-glow), 0 8px 25px rgba(0,0,0,0.2);
}

.holo-nl-card-inner.even-card {
  border-color: color-mix(in srgb, var(--color-h1-to) 25%, transparent);
  clip-path: polygon(
    0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%,
    10px 100%, 0 calc(100% - 10px)
  );
}

.holo-nl-card-inner.even-card:hover {
  border-color: var(--color-h1-to);
  box-shadow: 0 0 15px color-mix(in srgb, var(--color-h1-to) 20%, transparent), 0 8px 25px rgba(0,0,0,0.2);
}

/* ===== 卡片切角标记 ===== */
.holo-nl-card-notch {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
}

.holo-nl-card-notch.notch-right {
  justify-content: flex-end;
  flex-direction: row-reverse;
}

.holo-nl-notch-tri {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 7px solid var(--color-accent);
}

.holo-nl-notch-num {
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  letter-spacing: 0.1em;
}

/* ===== 卡片内容 ===== */
.holo-nl-card-body {
  padding: 0.25rem 0;
}

.holo-nl-item-text {
  font-size: var(--fs-body-sm);
  line-height: 1.6;
  color: var(--color-foreground);
  margin: 0;
}

/* ===== 底部连接线 ===== */
.holo-nl-card-connector {
  height: 2px;
  width: 30px;
  margin-top: 0.5rem;
  background: linear-gradient(90deg, var(--color-accent), transparent);
}

.holo-nl-card-connector.conn-right {
  margin-left: auto;
  background: linear-gradient(90deg, transparent, var(--color-h1-to));
}

/* ===== 信号面板 ===== */
.holo-nl-signal-panel {
  right: 4%;
  top: 50%;
  transform: translateY(-50%);
}

.holo-nl-signal-bars {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.holo-nl-signal-bar-v {
  width: 8px;
  background: var(--color-accent);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 80%);
  transition: width 0.3s ease;
}
</style>
