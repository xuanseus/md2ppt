<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Column {
  title: string
  items: string[]
}

const parsed = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()

  const columns: Column[] = []
  const beforeText: string[] = []
  const afterText: string[] = []
  let hitColumns = false

  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const titleMatch = trimmed.match(/^\*\*([^*]+)\*\*/m)
    if (titleMatch) {
      hitColumns = true
      const items: string[] = []
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        const itemMatch = t.match(/^-\s+(.+)$/)
        if (itemMatch) {
          items.push(itemMatch[1])
        } else if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
          afterText.push(t)
        }
      }
      columns.push({ title: titleMatch[1], items })
    } else {
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t) beforeText.push(t)
      }
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2), afterText: after }
})
</script>

<template>
  <div class="holo-comparison relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景雷达扫描 ============ -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div class="holo-radar-sweep"></div>
    </div>

    <!-- ============ 中央 VS 分割线 ============ -->
    <div class="absolute top-[15%] bottom-[15%] left-1/2 z-20 pointer-events-none" style="width: 3px; transform: translateX(-50%);">
      <!-- 垂直光束 -->
      <div class="holo-vs-beam" style="height: 100%; width: 1px; margin: 0 auto; background: linear-gradient(180deg, transparent, var(--color-accent) 20%, var(--color-accent) 80%, transparent); opacity: 0.4;"></div>
      <!-- 中心VS六边形 -->
      <div class="holo-vs-core" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="holo-vs-hex">
          <span>VS</span>
        </div>
        <!-- 发射波 -->
        <div class="holo-vs-pulse"></div>
        <div class="holo-vs-pulse delay"></div>
      </div>
    </div>

    <!-- ============ 全局标题 ============ -->
    <div class="absolute z-10" style="top: 8%; left: 50%; transform: translateX(-50%);">
      <h2 v-if="slide.title" class="holo-comp-global-title">{{ slide.title }}</h2>
      <div v-if="parsed.subtitle" class="holo-comp-subtitle" v-html="parsed.subtitle"></div>
    </div>

    <!-- ============ 左侧面板（斜向倾斜） ============ -->
    <div class="absolute z-10 holo-hud-panel left" v-if="parsed.columns[0]">
      <!-- 面板背景 -->
      <div class="holo-hud-bg left"></div>

      <!-- HUD数据头部 -->
      <div class="holo-hud-header">
        <div class="holo-hud-id">UNIT-A</div>
        <div class="holo-hud-status">ONLINE</div>
      </div>

      <!-- 列标题 -->
      <h3 class="holo-hud-title left-accent">{{ parsed.columns[0].title }}</h3>

      <!-- 数据分隔线 -->
      <div class="holo-hud-divider left-accent"></div>

      <!-- 数据项 -->
      <div class="holo-hud-items">
        <div v-for="(item, j) in parsed.columns[0].items" :key="j" class="holo-hud-item">
          <span class="holo-hud-marker left-accent">&#x25B8;</span>
          <span class="holo-hud-text">{{ item }}</span>
        </div>
      </div>

      <!-- 底部扫描值 -->
      <div class="holo-hud-footer">
        <span>SIG: {{ (70 + j * 5) }}%</span>
        <span class="holo-hud-freq">FREQ: 442.7Hz</span>
      </div>
    </div>

    <!-- ============ 右侧面板（反向倾斜） ============ -->
    <div class="absolute z-10 holo-hud-panel right" v-if="parsed.columns[1]">
      <!-- 面板背景 -->
      <div class="holo-hud-bg right"></div>

      <!-- HUD数据头部 -->
      <div class="holo-hud-header right-align">
        <div class="holo-hud-status">ACTIVE</div>
        <div class="holo-hud-id">UNIT-B</div>
      </div>

      <!-- 列标题 -->
      <h3 class="holo-hud-title right-accent">{{ parsed.columns[1].title }}</h3>

      <!-- 数据分隔线 -->
      <div class="holo-hud-divider right-accent" style="margin-left: auto; background: linear-gradient(90deg, transparent, var(--color-h1-to));"></div>

      <!-- 数据项 -->
      <div class="holo-hud-items">
        <div v-for="(item, j) in parsed.columns[1].items" :key="j" class="holo-hud-item right-align">
          <span class="holo-hud-text">{{ item }}</span>
          <span class="holo-hud-marker right-accent">&#x25C2;</span>
        </div>
      </div>

      <!-- 底部扫描值 -->
      <div class="holo-hud-footer right-align">
        <span class="holo-hud-freq">FREQ: 689.1Hz</span>
        <span>SIG: {{ 80 - j * 3 }}%</span>
      </div>
    </div>

    <!-- ============ 尾部文字 ============ -->
    <div v-if="parsed.afterText" class="absolute z-10" style="bottom: 6%; left: 50%; transform: translateX(-50%);" v-html="parsed.afterText"></div>
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

/* ===== HUD面板通用 ===== */
.holo-hud-panel {
  width: 36%;
  max-width: 480px;
  padding: 1.5rem 2rem;
  z-index: 10;
}

.holo-hud-panel.left {
  top: 22%;
  left: 6%;
}

.holo-hud-panel.right {
  bottom: 22%;
  right: 6%;
}

/* ===== 面板背景 ===== */
.holo-hud-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.7;
}

.holo-hud-bg.left {
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 30px) 100%, 0 100%, 0 0);
  transform: skewY(-1deg);
}

.holo-hud-bg.right {
  background: color-mix(in srgb, var(--color-card) 90%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-h1-to) 30%, transparent);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30px 100%, 0 calc(100% - 16px), 0 0);
  transform: skewY(1deg);
}

/* ===== HUD 头部 ===== */
.holo-hud-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 1;
}

.holo-hud-header.right-align {
  justify-content: flex-end;
}

.holo-hud-id {
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-shadow: var(--holo-glow);
}

.holo-hud-status {
  font-size: 0.45rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  letter-spacing: 0.1em;
  opacity: 0.6;
}

/* ===== HUD 标题 ===== */
.holo-hud-title {
  font-size: var(--fs-h4);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
  position: relative;
  z-index: 1;
}

.holo-hud-title.right-accent {
  text-align: right;
}

/* ===== HUD 分隔线 ===== */
.holo-hud-divider {
  width: 48px;
  height: 2px;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.holo-hud-divider.left-accent {
  background: linear-gradient(90deg, var(--color-accent), transparent);
}

.holo-hud-divider.right-accent {
  background: linear-gradient(90deg, transparent, var(--color-h1-to));
}

/* ===== HUD 数据项 ===== */
.holo-hud-items {
  position: relative;
  z-index: 1;
}

.holo-hud-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0;
  font-size: var(--fs-body-sm);
  line-height: 1.6;
  position: relative;
}

.holo-hud-item.right-align {
  justify-content: flex-end;
}

.holo-hud-marker {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  flex-shrink: 0;
}

.holo-hud-marker.left-accent {
  color: var(--color-accent);
}

.holo-hud-marker.right-accent {
  color: var(--color-h1-to);
}

.holo-hud-text {
  color: var(--color-foreground);
}

.holo-hud-item.right-align .holo-hud-text {
  text-align: right;
}

/* ===== HUD 底部 ===== */
.holo-hud-footer {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
  font-size: 0.45rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  opacity: 0.5;
  position: relative;
  z-index: 1;
}

.holo-hud-footer.right-align {
  justify-content: flex-end;
}

.holo-hud-freq {
  opacity: 0.6;
}

/* ===== 全局标题 ===== */
.holo-comp-global-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
}

.holo-comp-subtitle :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin-top: 0.25rem;
}
</style>
