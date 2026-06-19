<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-content w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- ═══ HUD 多面板布局 ═══ -->
    <div class="relative z-10 w-full h-full flex gap-0">

      <!-- ═══ 左侧系统信息面板 ═══ -->
      <div class="cp-hud-sidebar" style="flex: 0 0 180px; border-right: 1px solid var(--color-border); padding: 2rem 0.75rem; display: flex; flex-direction: column; gap: 1rem">
        <!-- 威胁等级 -->
        <div class="cp-hud-widget" style="border: 1px solid var(--color-border); border-radius: 2px; padding: 0.75rem; box-shadow: inset 0 0 15px color-mix(in srgb, var(--color-accent) 3%, transparent)">
          <div class="cp-mono text-xs mb-2" style="color: var(--color-muted-foreground)">THREAT_LEVEL</div>
          <div class="cp-mono cp-threat-text" style="font-size: 1.5rem; font-weight: 900; color: #ff4444; text-shadow: 0 0 20px #ff4444, 0 0 40px #ff0000">HIGH</div>
          <div class="cp-threat-bar mt-1">
            <div class="cp-threat-fill cp-threat-pulse" style="width: 78%" />
          </div>
        </div>

        <!-- 系统时间 -->
        <div class="cp-hud-widget" style="border: 1px solid var(--color-border); border-radius: 2px; padding: 0.75rem">
          <div class="cp-mono text-xs mb-1" style="color: var(--color-muted-foreground)">SYS.TIME</div>
          <div class="cp-mono text-sm cp-time-glow" style="color: var(--color-accent)">{{ new Date().toISOString().slice(11, 19) }}</div>
          <div class="cp-mono text-xs opacity-50" style="color: var(--color-muted-foreground)">UTC+8 // SYNCED</div>
        </div>

        <!-- 节点状态 -->
        <div class="cp-hud-widget" style="border: 1px solid var(--color-border); border-radius: 2px; padding: 0.75rem">
          <div class="cp-mono text-xs mb-1" style="color: var(--color-muted-foreground)">NODE_STATUS</div>
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-1 cp-mono text-xs" style="color: #00ff88"><span class="cp-blink-slow">●</span> NODE_01</div>
            <div class="flex items-center gap-1 cp-mono text-xs" style="color: #00ff88"><span class="cp-blink-slow">●</span> NODE_02</div>
            <div class="flex items-center gap-1 cp-mono text-xs" style="color: #ffaa00"><span>●</span> NODE_03</div>
          </div>
        </div>
      </div>

      <!-- ═══ 中央主内容面板 ═══ -->
      <div class="cp-hud-center" style="flex: 1 1 0; display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative">
        <!-- wireframe 包围主内容区 -->
        <div class="cp-wireframe-border">
          <!-- 四角 bracket -->
          <div class="cp-bracket-tl" />
          <div class="cp-bracket-tr" />
          <div class="cp-bracket-bl" />
          <div class="cp-bracket-br" />

          <!-- 内容 -->
          <div class="cp-wireframe-inner">
            <div v-html="slide.html" class="cp-content-prose" />
          </div>
        </div>
      </div>

      <!-- ═══ 右侧系统信息面板 ═══ -->
      <div class="cp-hud-sidebar" style="flex: 0 0 180px; border-left: 1px solid var(--color-border); padding: 2rem 0.75rem; display: flex; flex-direction: column; gap: 1rem">
        <!-- 数据指标 -->
        <div class="cp-hud-widget" style="border: 1px solid var(--color-border); border-radius: 2px; padding: 0.75rem">
          <div class="cp-mono text-xs mb-2" style="color: var(--color-muted-foreground)">METRICS</div>
          <div class="cp-mono text-xs mb-1" style="color: var(--color-foreground)">PKTS: <span style="color: var(--color-accent)">12.4K</span></div>
          <div class="cp-mono text-xs mb-1" style="color: var(--color-foreground)">BW: <span style="color: var(--color-h1-to)">847 Mbps</span></div>
          <div class="cp-mono text-xs mb-1" style="color: var(--color-foreground)">ERR: <span style="color: #ff4444">0.002%</span></div>
        </div>

        <!-- 加密状态 -->
        <div class="cp-hud-widget" style="border: 1px solid var(--color-border); border-radius: 2px; padding: 0.75rem">
          <div class="cp-mono text-xs mb-1" style="color: var(--color-muted-foreground)">CRYPTO</div>
          <div class="cp-mono text-xs" style="color: #00ff88">AES-256-GCM ✓</div>
          <div class="cp-mono text-xs mt-1" style="color: var(--color-muted-foreground) opacity-60">KEY_ROTATION: T+2h</div>
        </div>

        <!-- Hash -->
        <div class="cp-hud-widget" style="border: 1px solid var(--color-border); border-radius: 2px; padding: 0.75rem">
          <div class="cp-mono text-xs mb-1" style="color: var(--color-muted-foreground)">CHECKSUM</div>
          <div class="cp-mono cp-hash-text" style="font-size: 0.55rem; color: var(--color-accent); word-break: break-all; line-height: 1.3">e3b0c44298fc1c14 9afbf4c8996fb924 27ae41e4649b934c a495991b7852b855</div>
        </div>
      </div>
    </div>

    <!-- 顶部 HUD 线 -->
    <div class="absolute top-0 left-0 right-0 z-20 pointer-events-none" style="height: 1px; background: linear-gradient(90deg, transparent, var(--color-accent) 20%, var(--color-h1-to) 80%, transparent); opacity: 0.3" />
    <!-- 底部 HUD 线 -->
    <div class="absolute bottom-0 left-0 right-0 z-20 pointer-events-none" style="height: 1px; background: linear-gradient(90deg, transparent, var(--color-h1-to) 20%, var(--color-accent) 80%, transparent); opacity: 0.3" />
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.05) 2px,
    rgba(0, 0, 0, 0.05) 4px
  );
}

.cp-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace; }

/* 威胁等级 */
.cp-threat-bar {
  height: 3px;
  background: color-mix(in srgb, #ff4444 15%, transparent);
  border-radius: 1px;
  overflow: hidden;
}
.cp-threat-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4444, #ff0000);
  box-shadow: 0 0 10px #ff4444;
}
.cp-threat-pulse { animation: cp-threat-pulse 1.5s ease-in-out infinite; }

@keyframes cp-threat-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.cp-threat-text { animation: cp-threat-text 3s ease-in-out infinite; }

@keyframes cp-threat-text {
  0%, 100% { opacity: 0.8; text-shadow: 0 0 20px #ff4444; }
  50% { opacity: 1; text-shadow: 0 0 40px #ff0000, 0 0 80px #ff0000; }
}

.cp-time-glow { text-shadow: 0 0 10px var(--color-accent); }
.cp-hash-text { opacity: 0.6; }

/* Wireframe 主面板 */
.cp-wireframe-border {
  width: 100%; max-width: 900px;
  position: relative;
  padding: 2.5rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
  box-shadow: inset 0 0 30px color-mix(in srgb, var(--color-accent) 3%, transparent);
}

.cp-wireframe-inner {
  position: relative;
  z-index: 1;
}

/* 四角 bracket */
.cp-bracket-tl {
  position: absolute; top: -1px; left: -1px;
  width: 20px; height: 20px;
  border-top: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
  box-shadow: -1px -1px 8px color-mix(in srgb, var(--color-accent) 30%, transparent);
}
.cp-bracket-tr {
  position: absolute; top: -1px; right: -1px;
  width: 20px; height: 20px;
  border-top: 2px solid var(--color-h1-to);
  border-right: 2px solid var(--color-h1-to);
  box-shadow: 1px -1px 8px color-mix(in srgb, var(--color-h1-to) 30%, transparent);
}
.cp-bracket-bl {
  position: absolute; bottom: -1px; left: -1px;
  width: 20px; height: 20px;
  border-bottom: 2px solid var(--color-h1-to);
  border-left: 2px solid var(--color-h1-to);
  box-shadow: -1px 1px 8px color-mix(in srgb, var(--color-h1-to) 30%, transparent);
}
.cp-bracket-br {
  position: absolute; bottom: -1px; right: -1px;
  width: 20px; height: 20px;
  border-bottom: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
  box-shadow: 1px 1px 8px color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.cp-blink-slow { animation: cp-blink-slow 2s step-end infinite; }

@keyframes cp-blink-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* Content prose */
.cp-content-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.2;
  color: var(--color-heading);
  text-shadow: 0 0 30px var(--color-accent);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}
.cp-content-prose :deep(h3) {
  font-size: var(--fs-h3);
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-heading);
  text-shadow: 0 0 20px var(--color-accent);
  font-family: 'JetBrains Mono', monospace;
}
.cp-content-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-foreground);
  font-family: 'JetBrains Mono', monospace;
}
.cp-content-prose :deep(ul), .cp-content-prose :deep(ol) {
  padding-left: 0;
  margin: 1rem 0;
  list-style: none;
}
.cp-content-prose :deep(li) {
  font-size: var(--fs-body-sm);
  margin-bottom: 0.6rem;
  line-height: 1.7;
  padding-left: 1.75rem;
  position: relative;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-foreground);
}
.cp-content-prose :deep(li)::before {
  content: '>';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
  font-weight: 700;
}
.cp-content-prose :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  padding: 0.75rem 1.25rem;
  margin: 1.25rem 0;
  background: color-mix(in srgb, var(--color-accent) 6%, transparent);
  border-radius: 0 2px 2px 0;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-foreground);
}
.cp-content-prose :deep(code) {
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
  font-size: 0.9em;
  background: var(--color-code-bg);
  color: var(--color-code-fg);
  border: 1px solid var(--color-border);
  font-family: 'JetBrains Mono', monospace;
}
.cp-content-prose :deep(pre) {
  border-radius: 2px;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 8%, transparent);
}
.cp-content-prose :deep(strong) {
  color: var(--color-accent);
  text-shadow: 0 0 12px var(--color-accent);
}
.cp-content-prose :deep(img) {
  max-width: 85%;
  max-height: 50vh;
  display: block;
  margin: 0.75rem auto;
  border-radius: 2px;
  object-fit: contain;
  border: 1px solid var(--color-border);
}
</style>
