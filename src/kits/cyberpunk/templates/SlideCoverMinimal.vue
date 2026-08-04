<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-cover w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- 中心装饰 diamond -->
    <div class="absolute z-10 pointer-events-none cp-center-node" style="top: 28%; left: 50%; width: 12px; height: 12px; transform: translate(-50%, -50%); background: var(--color-accent); box-shadow: 0 0 30px var(--color-accent), 0 0 60px var(--color-accent); clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" />

    <!-- 主内容区 -->
    <div class="absolute z-20 flex flex-col items-center justify-center" style="inset: 0">
      <!-- 顶部状态标签 -->
      <div class="flex items-center gap-2 mb-8">
        <span class="cp-status-dot cp-blink-slow" style="background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent)" />
        <span class="text-xs cp-mono" style="color: var(--color-accent)">STATUS::ONLINE</span>
        <span class="text-xs cp-mono opacity-30" style="color: var(--color-muted-foreground)">•</span>
        <span class="text-xs cp-mono opacity-50" style="color: var(--color-muted-foreground)">NODE::END</span>
      </div>

      <!-- 标题 -->
      <h1 v-if="slide.title" class="cp-minimal-title">{{ slide.title }}</h1>

      <!-- 内容 -->
      <div v-if="slide.html" v-html="slide.html" class="cp-minimal-prose" />
      <div v-else class="cp-mono text-sm opacity-30 mt-6" style="color: var(--color-muted-foreground)">
        // TRANSMISSION COMPLETE
      </div>

      <!-- 底部装饰线 -->
      <div class="mt-8" style="width: 120px; height: 2px; background: linear-gradient(90deg, transparent, var(--color-accent), transparent); box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 40%, transparent)" />

      <!-- 底部状态条 -->
      <div class="absolute bottom-8 flex items-center gap-6">
        <span class="cp-mono text-xs opacity-40" style="color: var(--color-muted-foreground)">SYS::v4.2.1</span>
        <span class="w-1 h-1 rounded-full" style="background: #00ff88; box-shadow: 0 0 6px #00ff88" />
        <span class="cp-mono text-xs opacity-40" style="color: var(--color-muted-foreground)">UPTIME 127h</span>
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
.cp-minimal-title {
  font-size: calc(4rem * var(--content-scale));
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 50px var(--color-accent), 0 0 100px color-mix(in srgb, var(--color-accent) 40%, transparent), 2px 2px 0 rgba(0,0,0,0.8);
  text-transform: uppercase;
  text-align: center;
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

.cp-status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
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

.cp-minimal-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  text-align: center;
  margin-top: 1.5rem;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 10px color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.cp-minimal-prose :deep(strong) {
  color: var(--color-accent);
  text-shadow: 0 0 12px var(--color-accent);
}
</style>
