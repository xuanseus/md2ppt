<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'

defineProps<{ slide: Slide }>()

const sysTime = computed(() => {
  const d = new Date()
  return d.toString().replace(/ GMT.*/, '')
})
</script>

<template>
  <div class="cp-stats w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- 闹钟/警报红色扫描区 -->
    <div class="absolute inset-0 pointer-events-none z-0 opacity-[0.04] cp-alert-sweep" />

    <!-- ═══ 警报式布局 ═══ -->
    <div class="relative z-10 w-full h-full flex flex-col items-center justify-center" style="padding: 2rem 3rem">

      <!-- 顶部警报 banner -->
      <div class="cp-alert-banner mb-6">
        <div class="flex items-center gap-3">
          <span class="cp-alert-icon cp-blink-fast" style="font-size: 1.2rem">⚠</span>
          <span class="cp-mono cp-alert-header">!! SYSTEM ALERT !!</span>
          <span class="cp-alert-icon cp-blink-fast cp-blink-offset" style="font-size: 1.2rem">⚠</span>
        </div>
        <div class="cp-mono text-xs mt-1 cp-alert-sub">SEC_PROTOCOL_v9.7.2 // THREAT DETECTED</div>
      </div>

      <!-- 主数据面板：带闪烁边框 -->
      <div class="cp-alert-panel">
        <!-- 闪烁边框效果 — 使用动画 outline -->
        <div class="cp-alert-border" />

        <!-- 内容 -->
        <div class="cp-alert-inner">
          <!-- 顶部状态条 -->
          <div class="flex items-center justify-between mb-6 px-2">
            <div class="flex items-center gap-2">
              <span class="cp-mono text-xs" style="color: var(--color-accent)">SEVERITY</span>
              <span class="cp-severity-bar cp-severity-pulse" />
            </div>
            <span class="cp-mono text-xs" style="color: var(--color-muted-foreground)">TIMESTAMP: {{ sysTime }}</span>
          </div>

          <!-- 大数字 -->
          <div v-html="slide.html" class="cp-stats-prose" />

          <!-- 底部系统诊断 -->
          <div class="cp-diagnostics mt-6 pt-4" style="border-top: 1px dashed color-mix(in srgb, var(--color-border) 60%, transparent)">
            <div class="cp-mono text-xs mb-2" style="color: var(--color-muted-foreground)">DIAGNOSTICS //</div>
            <div class="flex gap-6 flex-wrap">
              <div class="flex items-center gap-1 cp-mono text-xs" style="color: var(--color-h1-to)">
                <span class="cp-blink-slow">●</span> ANOMALY_SCORE: 94.7
              </div>
              <div class="flex items-center gap-1 cp-mono text-xs" style="color: var(--color-accent)">
                <span>●</span> QUARANTINE: ACTIVE
              </div>
              <div class="flex items-center gap-1 cp-mono text-xs" style="color: var(--color-accent)">
                <span>●</span> TRACE: 0x7F3A
              </div>
              <div class="flex items-center gap-1 cp-mono text-xs" style="color: var(--color-muted-foreground)">
                <span>●</span> LOG: 1,247 events
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部扫描线波形 -->
      <div class="cp-scan-wave mt-6">
        <div v-for="n in 24" :key="n" class="cp-wave-bar cp-wave-anim" :style="{ height: (8 + Math.sin(n * 0.8) * 6 + ((n * 7) % 10)) + 'px', animationDelay: (n * 0.08) + 's' }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.06) 2px,
    rgba(0, 0, 0, 0.06) 4px
  );
}

.cp-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace; }

/* 红色警报扫描 */
.cp-alert-sweep {
  background: repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, color-mix(in srgb, var(--color-accent) 10%, transparent) 1deg, transparent 2deg, transparent 90deg);
  animation: cp-sweep 8s linear infinite;
}

@keyframes cp-sweep {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 警报 banner */
.cp-alert-banner { text-align: center; }

.cp-alert-header {
  font-size: calc(1.2rem * var(--content-scale));
  font-weight: 900;
  color: var(--color-accent);
  letter-spacing: 0.3em;
  text-shadow: 0 0 30px var(--color-accent), 0 0 60px var(--color-h1-to);
  text-transform: uppercase;
}

.cp-alert-sub {
  color: var(--color-muted-foreground);
  letter-spacing: 0.1em;
}

.cp-alert-icon { color: var(--color-accent); text-shadow: 0 0 15px var(--color-accent); }
.cp-blink-fast { animation: cp-blink-fast 0.6s step-end infinite; }
.cp-blink-offset { animation: cp-blink-fast 0.6s step-end 0.3s infinite; }

@keyframes cp-blink-fast {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 主面板 */
.cp-alert-panel {
  position: relative;
  max-width: 700px;
  width: 100%;
  padding: 2.5rem 3rem;
  background: var(--color-card);
  border: 2px solid var(--color-accent);
  box-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 25%, transparent), inset 0 0 40px color-mix(in srgb, var(--color-accent) 6%, transparent);
}

.cp-alert-border {
  position: absolute;
  inset: -4px;
  border: 2px solid transparent;
  pointer-events: none;
  animation: cp-alert-border 2s ease-in-out infinite;
}

@keyframes cp-alert-border {
  0%, 100% { border-color: transparent; box-shadow: none; }
  50% { border-color: color-mix(in srgb, var(--color-accent) 50%, transparent); box-shadow: 0 0 20px var(--color-accent), inset 0 0 20px color-mix(in srgb, var(--color-accent) 20%, transparent); }
}

.cp-alert-inner { position: relative; z-index: 1; }

/* 严重度条 */
.cp-severity-bar {
  width: 60px; height: 4px;
  background: linear-gradient(90deg, var(--color-h1-to), var(--color-accent), var(--color-h1-to));
  border-radius: 2px;
}
.cp-severity-pulse { animation: cp-severity-pulse 1s ease-in-out infinite; }

@keyframes cp-severity-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* 数据文字样式 */
.cp-stats-prose :deep(h4) {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
}

.cp-stats-prose :deep(strong) {
  display: block;
  font-size: var(--fs-stat);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1.5rem;
  color: var(--color-accent);
  text-shadow: 0 0 40px var(--color-accent), 0 0 80px var(--color-h1-to), 0 2px 4px rgba(0,0,0,0.5);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-align: center;
  animation: cp-glitch-pulse 2s ease-out;
}

@keyframes cp-glitch-pulse {
  0% { transform: scale(0.3); opacity: 0; filter: blur(10px); }
  30% { transform: scale(1.15); opacity: 1; filter: blur(0); }
  40% { transform: translateX(-3px); }
  42% { transform: translateX(3px); }
  44% { transform: translateX(0); }
  60% { transform: scale(0.97); }
  100% { transform: scale(1); opacity: 1; filter: blur(0); }
}

.cp-stats-prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  margin-top: 1.5rem;
  line-height: 1.7;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
}

/* 底部扫描波形 */
.cp-scan-wave { display: flex; align-items: flex-end; gap: 2px; height: 30px; }

.cp-wave-bar {
  width: 3px;
  background: linear-gradient(180deg, var(--color-accent), var(--color-h1-to));
  border-radius: 1px;
  box-shadow: 0 0 6px var(--color-accent);
}

.cp-wave-anim { animation: cp-wave 1.5s ease-in-out infinite; }

@keyframes cp-wave {
  0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
  50% { opacity: 1; transform: scaleY(1); }
}

.cp-blink-slow { animation: cp-blink-slow 2s ease-in-out infinite; }

@keyframes cp-blink-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
