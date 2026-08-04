<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-quote-large relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 传输信号波（从四周指向中心） ============ -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" style="opacity: 0.06;">
      <!-- 上方信号 -->
      <line x1="50%" y1="5%" x2="50%" y2="25%" stroke="var(--color-accent)" stroke-width="1" stroke-dasharray="4,8" class="holo-signal-line"/>
      <!-- 下方信号 -->
      <line x1="50%" y1="75%" x2="50%" y2="95%" stroke="var(--color-accent)" stroke-width="1" stroke-dasharray="4,8" class="holo-signal-line"/>
      <!-- 左侧信号 -->
      <line x1="8%" y1="50%" x2="28%" y2="50%" stroke="var(--color-accent)" stroke-width="1" stroke-dasharray="4,8" class="holo-signal-line"/>
      <!-- 右侧信号 -->
      <line x1="72%" y1="50%" x2="92%" y2="50%" stroke="var(--color-accent)" stroke-width="1" stroke-dasharray="4,8" class="holo-signal-line"/>

      <!-- 对角线信号 -->
      <line x1="15%" y1="15%" x2="30%" y2="30%" stroke="var(--color-h1-to)" stroke-width="1" stroke-dasharray="3,9" class="holo-signal-line" style="opacity: 0.5;"/>
      <line x1="70%" y1="70%" x2="85%" y2="85%" stroke="var(--color-h1-to)" stroke-width="1" stroke-dasharray="3,9" class="holo-signal-line" style="opacity: 0.5;"/>
      <line x1="85%" y1="15%" x2="70%" y2="30%" stroke="var(--color-h1-to)" stroke-width="1" stroke-dasharray="3,9" class="holo-signal-line" style="opacity: 0.5;"/>
      <line x1="15%" y1="85%" x2="30%" y2="70%" stroke="var(--color-h1-to)" stroke-width="1" stroke-dasharray="3,9" class="holo-signal-line" style="opacity: 0.5;"/>

      <!-- 信号节点 -->
      <circle cx="50%" cy="25%" r="3" fill="var(--color-accent)" opacity="0.3" class="holo-signal-node"/>
      <circle cx="50%" cy="75%" r="3" fill="var(--color-accent)" opacity="0.3" class="holo-signal-node"/>
      <circle cx="28%" cy="50%" r="3" fill="var(--color-accent)" opacity="0.3" class="holo-signal-node"/>
      <circle cx="72%" cy="50%" r="3" fill="var(--color-accent)" opacity="0.3" class="holo-signal-node"/>
    </svg>

    <!-- ============ 中央消息气泡 ============ -->
    <div class="relative z-10 holo-message-bubble">
      <!-- 外围旋转边框 -->
      <div class="holo-bubble-border"></div>

      <!-- 六边形气泡体 -->
      <div class="holo-bubble-body">
        <!-- 顶部引用标识 -->
        <div class="holo-bubble-cite">
          <span class="holo-cite-diamond"></span>
          <span class="holo-cite-text">BROADCAST</span>
          <span class="holo-cite-diamond"></span>
        </div>

        <!-- 引用内容 -->
        <div v-html="slide.html" class="holo-quote-large-prose"></div>

        <!-- 底部信号强度 -->
        <div class="holo-bubble-signal">
          <span class="holo-signal-bar l1"></span>
          <span class="holo-signal-bar l2"></span>
          <span class="holo-signal-bar l3"></span>
          <span class="holo-signal-bar l4"></span>
        </div>
      </div>
    </div>

    <!-- ============ 角落信号源标记 ============ -->
    <div class="holo-source-marker tl">SRC-&#945;</div>
    <div class="holo-source-marker tr">SRC-&#946;</div>
    <div class="holo-source-marker bl">SRC-&#947;</div>
    <div class="holo-source-marker br">SRC-&#948;</div>
  </div>
</template>

<style scoped>
/* ===== 信号线动画 ===== */
.holo-signal-line {
  animation: holo-dash-march 2s linear infinite;
}

@keyframes holo-dash-march {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -24; }
}

.holo-signal-node {
  animation: holo-node-blink 2.5s ease-in-out infinite;
}

@keyframes holo-node-blink {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.5; }
}

/* ===== 消息气泡外层 ===== */
.holo-message-bubble {
  width: 750px;
  max-width: 82vw;
  position: relative;
}

/* ===== 旋转边框 ===== */
.holo-bubble-border {
  position: absolute;
  inset: -3px;
  clip-path: polygon(50% 0%, 95% 10%, 100% 40%, 100% 70%, 95% 100%, 50% 100%, 5% 100%, 0% 70%, 0% 40%, 5% 10%);
  background: linear-gradient(45deg, var(--color-accent), var(--color-h1-to), var(--color-accent));
  opacity: 0.3;
  animation: holo-border-rotate 6s linear infinite;
  z-index: -1;
}

@keyframes holo-border-rotate {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

/* ===== 六边形气泡体 ===== */
.holo-bubble-body {
  padding: 3rem 4.5rem;
  background: var(--color-card);
  clip-path: polygon(50% 0%, 95% 10%, 100% 40%, 100% 70%, 95% 100%, 50% 100%, 5% 100%, 0% 70%, 0% 40%, 5% 10%);
  text-align: center;
  position: relative;
}

/* ===== 引用标识 ===== */
.holo-bubble-cite {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.holo-cite-diamond {
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  transform: rotate(45deg);
  opacity: 0.5;
}

.holo-cite-text {
  font-size: 0.55rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* ===== 信号强度 ===== */
.holo-bubble-signal {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  height: 20px;
  margin-top: 1.5rem;
}

.holo-signal-bar {
  width: 5px;
  background: var(--color-accent);
  opacity: 0.3;
}

.holo-signal-bar.l1 { height: 5px; }
.holo-signal-bar.l2 { height: 10px; opacity: 0.5; }
.holo-signal-bar.l3 { height: 15px; opacity: 0.7; }
.holo-signal-bar.l4 { height: 20px; opacity: 1; box-shadow: var(--holo-glow); }

/* ===== 引用内容 ===== */
.holo-quote-large-prose :deep(blockquote),
.holo-quote-large-prose :deep(p) {
  font-size: var(--fs-quote);
  font-weight: 300;
  line-height: 1.7;
  text-align: center;
  font-style: normal;
  border: none;
  margin: 0;
  color: var(--color-foreground);
  font-family: 'JetBrains Mono', monospace;
}

.holo-quote-large-prose :deep(p::before) {
  content: '\300C ';
  color: var(--color-accent);
  font-style: normal;
  opacity: 0.5;
}

.holo-quote-large-prose :deep(p::after) {
  content: ' \300D';
  color: var(--color-accent);
  font-style: normal;
  opacity: 0.5;
}

/* ===== 角落信号源标记 ===== */
.holo-source-marker {
  position: absolute;
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  opacity: 0.3;
  letter-spacing: 0.15em;
}

.holo-source-marker.tl { top: 8%; left: 12%; }
.holo-source-marker.tr { top: 8%; right: 12%; }
.holo-source-marker.bl { bottom: 8%; left: 12%; }
.holo-source-marker.br { bottom: 8%; right: 12%; }
</style>
