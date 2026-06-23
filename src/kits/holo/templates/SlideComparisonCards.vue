<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Col {
  title: string
  items: string[]
  icon: string
  colorClass: string
}

const cols = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  const c: Col[] = []
  for (let i = 0; i < Math.min(parts.length, 2); i++) {
    const p = parts[i].trim()
    const tm = p.match(/^\*\*([^*]+)\*\*/m)
    const items = p.split('\n').slice(1).filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim())
    c.push({
      title: tm ? tm[1] : '',
      items,
      icon: i === 0 ? '&#x2715;' : '&#10003;',
      colorClass: i === 0 ? 'is-red' : 'is-green'
    })
  }
  return c
})

const subtitle = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const fi = body.indexOf('**')
  if (fi > 0) {
    const b = body.slice(0, fi).trim()
    if (b) return marked.parse(b) as string
  }
  return ''
})
</script>

<template>
  <div class="holo-comparison-cards relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景雷达扫描 ============ -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div class="holo-radar-sweep"></div>
    </div>

    <!-- ============ 中央 VS 分割线 ============ -->
    <div class="absolute top-[15%] bottom-[15%] left-1/2 z-20 pointer-events-none" style="width: 3px; transform: translateX(-50%);">
      <div class="holo-vs-beam" style="height: 100%; width: 1px; margin: 0 auto; background: linear-gradient(180deg, transparent, var(--color-accent) 20%, var(--color-accent) 80%, transparent); opacity: 0.4;"></div>
      <div class="holo-vs-core" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="holo-vs-hex">
          <span>VS</span>
        </div>
        <div class="holo-vs-pulse"></div>
        <div class="holo-vs-pulse delay"></div>
      </div>
    </div>

    <!-- ============ 全局标题 ============ -->
    <div class="absolute z-10" style="top: 6%; left: 50%; transform: translateX(-50%);">
      <h2 v-if="slide.title" class="holo-cc-title">{{ slide.title }}</h2>
      <div v-if="subtitle" class="holo-cc-sub" v-html="subtitle"></div>
    </div>

    <!-- ============ 对比卡片 ============ -->
    <div v-if="cols.length === 2" class="relative z-10 holo-cc-grid">
      <div v-for="(col, ci) in cols" :key="ci" class="holo-cc-card" :class="col.colorClass">
        <!-- 卡片切角边框 -->
        <div class="holo-cc-card-header">
          <span class="holo-cc-header-dot" :class="col.colorClass"></span>
          <span class="holo-cc-header-id">{{ ci === 0 ? 'UNIT-A' : 'UNIT-B' }}</span>
        </div>

        <!-- 图标和标题 -->
        <div class="holo-cc-icon" v-html="col.icon"></div>
        <h3 class="holo-cc-card-title">{{ col.title }}</h3>
        <div class="holo-cc-beam" :class="col.colorClass"></div>

        <!-- 项目列表 -->
        <ul class="holo-cc-list">
          <li v-for="(item, ji) in col.items" :key="ji" class="holo-cc-item">
            <span class="holo-cc-marker" :class="col.colorClass">&#x25B8;</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 雷达扫描 ===== */
.holo-radar-sweep {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--color-accent) 10%, transparent);
  background: conic-gradient(
    from 0deg,
    color-mix(in srgb, var(--color-accent) 5%, transparent) 0deg,
    transparent 60deg,
    color-mix(in srgb, var(--color-accent) 5%, transparent) 300deg,
    transparent 360deg
  );
  animation: holo-radar-rotate 10s linear infinite;
}

@keyframes holo-radar-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== VS 核心 ===== */
.holo-vs-core {
  position: relative;
}

.holo-vs-hex {
  width: 50px;
  height: 57px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent-foreground);
  z-index: 2;
  position: relative;
  box-shadow: var(--holo-glow);
}

.holo-vs-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 57px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: transparent;
  border: 1px solid var(--color-accent);
  transform: translate(-50%, -50%);
  animation: holo-vs-emit 2s ease-out infinite;
}

.holo-vs-pulse.delay {
  animation-delay: 1s;
}

@keyframes holo-vs-emit {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}

/* ===== 全局标题 ===== */
.holo-cc-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
  text-align: center;
}

.holo-cc-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin-top: 0.25rem;
}

/* ===== 对比网格 ===== */
.holo-cc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 75%;
  max-width: 900px;
  margin-top: 40px;
}

/* ===== 对比卡片 ===== */
.holo-cc-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem;
  background: var(--color-card);
  border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
  clip-path: polygon(
    0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px,
    100% calc(100% - 16px), calc(100% - 16px) 100%,
    16px 100%, 0 calc(100% - 16px)
  );
  text-align: center;
  transition: box-shadow 0.3s ease;
}

.holo-cc-card:hover {
  box-shadow: var(--holo-border-glow);
}

.holo-cc-card.is-red {
  border-color: color-mix(in srgb, var(--color-h1-to) 25%, transparent);
}

.holo-cc-card.is-green {
  border-color: color-mix(in srgb, var(--color-accent) 25%, transparent);
}

/* ===== 卡片头部 ===== */
.holo-cc-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.holo-cc-header-dot {
  width: 6px;
  height: 6px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: var(--color-accent);
  box-shadow: var(--holo-glow);
}

.holo-cc-header-dot.is-red {
  background: var(--color-h1-to);
  box-shadow: none;
  opacity: 0.6;
}

.holo-cc-header-id {
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  letter-spacing: 0.15em;
}

/* ===== 图标 ===== */
.holo-cc-icon {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
  color: var(--color-accent);
  text-shadow: var(--holo-glow);
}

.is-red .holo-cc-icon {
  color: var(--color-h1-to);
  text-shadow: none;
  opacity: 0.7;
}

/* ===== 卡片标题 ===== */
.holo-cc-card-title {
  font-size: var(--fs-h3);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
}

/* ===== 光束 ===== */
.holo-cc-beam {
  width: 48px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
  margin-bottom: 1.25rem;
}

.holo-cc-beam.is-red {
  background: linear-gradient(90deg, var(--color-h1-to), transparent);
}

/* ===== 列表 ===== */
.holo-cc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
}

.holo-cc-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.6;
  text-align: left;
}

.holo-cc-marker {
  flex-shrink: 0;
  color: var(--color-accent);
  font-size: 0.6rem;
}

.holo-cc-marker.is-red {
  color: var(--color-h1-to);
}
</style>
