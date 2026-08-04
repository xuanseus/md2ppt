<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-cover w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- 中央十字型 neon 分割线 -->
    <div class="absolute z-10 pointer-events-none" style="top: 50%; left: 0; right: 0; height: 2px; background: var(--color-accent); box-shadow: 0 0 20px var(--color-accent), 0 0 60px color-mix(in srgb, var(--color-accent) 40%, transparent)" />
    <div class="absolute z-10 pointer-events-none" style="left: 50%; top: 0; bottom: 0; width: 2px; background: var(--color-h1-to); box-shadow: 0 0 20px var(--color-h1-to), 0 0 60px color-mix(in srgb, var(--color-h1-to) 40%, transparent)" />

    <!-- 中心 glitch 交汇节点 -->
    <div class="absolute z-10 pointer-events-none cp-center-node" style="top: 50%; left: 50%; width: 16px; height: 16px; transform: translate(-50%, -50%); background: var(--color-accent); box-shadow: 0 0 30px var(--color-accent), 0 0 60px var(--color-accent); clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" />

    <!-- ═══ 上左：标题 ═══ -->
    <div class="absolute z-20" style="top: 4%; left: 4%; right: 54%; bottom: 54%">
      <div class="flex items-center gap-2 mb-3">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono opacity-50" style="color: var(--color-muted-foreground)">NODE::SPLIT</span>
      </div>
      <h1 v-if="slide.title" class="cp-cover-title">{{ slide.title }}</h1>
      <div class="flex items-center gap-3 mt-2">
        <span class="cp-mono text-xs" style="color: var(--color-accent)">AUTH_LEVEL_7</span>
        <span class="cp-diamond w-2 h-2" style="background: var(--color-accent); box-shadow: 0 0 6px var(--color-accent)" />
        <span class="cp-mono text-xs opacity-50" style="color: var(--color-muted-foreground)">PRESENTATION</span>
      </div>
    </div>

    <!-- ═══ 上右：系统指示器 ═══ -->
    <div class="absolute z-20" style="top: 4%; right: 4%; left: 54%; bottom: 54%">
      <div class="cp-status-panel">
        <div class="cp-mono text-xs mb-3" style="color: var(--color-accent); text-align: right">// SYS_INFO</div>
        <div class="flex flex-col gap-2 items-end">
          <div class="flex items-center gap-2">
            <span class="cp-mono text-xs" style="color: var(--color-foreground)">DATE</span>
            <span class="cp-mono text-xs" style="color: var(--color-accent)">2026</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="cp-mono text-xs" style="color: var(--color-foreground)">VER</span>
            <span class="cp-mono text-xs" style="color: var(--color-h1-to)">v4.2.1</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="cp-mono text-xs" style="color: var(--color-foreground)">STAT</span>
            <span class="cp-status-indicator cp-blink-slow" style="color: #00ff88">● ONLINE</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 下左：副标题/描述 ═══ -->
    <div class="absolute z-20" style="bottom: 4%; left: 4%; right: 54%; top: 54%">
      <div v-if="slide.html" v-html="slide.html" class="cp-cover-prose" />
      <div v-else class="cp-mono text-sm opacity-40" style="color: var(--color-muted-foreground)">
        // AWAITING INPUT...
      </div>
    </div>

    <!-- ═══ 下右：数据装饰 ═══ -->
    <div class="absolute z-20" style="bottom: 4%; right: 4%; left: 54%; top: 54%">
      <div class="cp-mono text-xs mb-2" style="color: var(--color-accent); text-align: right">// STREAM_IDX</div>
      <div class="cp-data-stream">
        <div v-for="line in 6" :key="line" class="cp-data-row cp-mono" :style="{
          color: line % 3 === 0 ? 'var(--color-accent)' : line % 3 === 1 ? 'var(--color-h1-to)' : 'var(--color-muted-foreground)',
          opacity: 1 - (line * 0.1),
          animationDelay: (line * 0.2) + 's',
        }">
          <span class="opacity-40">0x{{ (line * 0x3A + 0x1F).toString(16).toUpperCase().padStart(4, '0') }}</span>
          <span> {{ '0123456789ABCDEF'.split('').sort(() => 0.5 - Math.random()).slice(0, 12).join('') }}</span>
        </div>
      </div>
    </div>

    <!-- 四角 wireframe brackets -->
    <div class="absolute top-0 left-0 w-16 h-16 pointer-events-none" style="border-top: 2px solid var(--color-accent); border-left: 2px solid var(--color-accent); box-shadow: -2px -2px 15px color-mix(in srgb, var(--color-accent) 20%, transparent)" />
    <div class="absolute top-0 right-0 w-16 h-16 pointer-events-none" style="border-top: 2px solid var(--color-h1-to); border-right: 2px solid var(--color-h1-to); box-shadow: 2px -2px 15px color-mix(in srgb, var(--color-h1-to) 20%, transparent)" />
    <div class="absolute bottom-0 left-0 w-16 h-16 pointer-events-none" style="border-bottom: 2px solid var(--color-h1-to); border-left: 2px solid var(--color-h1-to); box-shadow: -2px 2px 15px color-mix(in srgb, var(--color-h1-to) 20%, transparent)" />
    <div class="absolute bottom-0 right-0 w-16 h-16 pointer-events-none" style="border-bottom: 2px solid var(--color-accent); border-right: 2px solid var(--color-accent); box-shadow: 2px 2px 15px color-mix(in srgb, var(--color-accent) 20%, transparent)" />
  </div>
</template>

<style scoped>
.cp-cover-title {
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 50px var(--color-accent), 0 0 100px color-mix(in srgb, var(--color-accent) 40%, transparent), 2px 2px 0 rgba(0,0,0,0.8);
  text-transform: uppercase;
}

.cp-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.06) 2px,
    rgba(0, 0, 0, 0.06) 4px
  );
}

.cp-mono {
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-diamond { transform: rotate(45deg); }

.cp-status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
}

.cp-status-panel {
  background: color-mix(in srgb, var(--color-card) 80%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 1rem 1.25rem;
  box-shadow: inset 0 0 20px color-mix(in srgb, var(--color-accent) 5%, transparent), 0 0 15px color-mix(in srgb, var(--color-accent) 8%, transparent);
}

.cp-status-indicator {
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  font-size: 0.7rem;
}

.cp-center-node { animation: cp-node-pulse 3s ease-in-out infinite; }

@keyframes cp-node-pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.3); }
}

.cp-blink-slow { animation: cp-blink-slow 2.5s ease-in-out infinite; }

@keyframes cp-blink-slow {
  0%, 100% { opacity: 1; }
  40%, 60% { opacity: 0.2; }
}

.cp-data-stream {
  text-align: right;
  font-size: 0.6rem;
  line-height: 1.6;
  overflow: hidden;
}

.cp-data-row { animation: cp-stream-fade 4s ease-in-out infinite; }

@keyframes cp-stream-fade {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.9; }
}

.cp-cover-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 10px color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.cp-cover-prose :deep(strong) {
  color: var(--color-accent);
  text-shadow: 0 0 12px var(--color-accent);
}
</style>
