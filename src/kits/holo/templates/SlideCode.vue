<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'

defineProps<{ slide: Slide }>()

const chars = '01ABCDEF789abcdef'

interface CharItem { id: number; char: string }

function generateRainChars(count: number): CharItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    char: chars[Math.floor(Math.random() * chars.length)]
  }))
}

const rainColsLeft = computed(() => Array.from({ length: 8 }, () => generateRainChars(8)))
const rainColsRight = computed(() => Array.from({ length: 8 }, () => generateRainChars(8)))
</script>

<template>
  <div class="holo-code relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 数据雨边框（左右两侧垂直字符流） ============ -->
    <div class="holo-datarain holo-datarain-left">
      <div class="holo-rain-col" v-for="(col, ci) in rainColsLeft" :key="'rl'+ci">
        <span v-for="ch in col" :key="ch.id" class="holo-rain-char" :style="{ animationDelay: (ci * 0.4).toFixed(1) + 's', animationDuration: (2 + (ci % 3)).toFixed(1) + 's' }">{{ ch.char }}</span>
      </div>
    </div>
    <div class="holo-datarain holo-datarain-right">
      <div class="holo-rain-col" v-for="(col, ci) in rainColsRight" :key="'rr'+ci">
        <span v-for="ch in col" :key="ch.id" class="holo-rain-char" :style="{ animationDelay: ((ci + 2) * 0.4).toFixed(1) + 's', animationDuration: (2.5 + (ci % 3)).toFixed(1) + 's' }">{{ ch.char }}</span>
      </div>
    </div>

    <!-- ============ 终端窗口 ============ -->
    <div class="relative z-10 holo-terminal-window">
      <!-- 终端顶部栏 -->
      <div class="holo-terminal-bar">
        <!-- 三角控制按钮 -->
        <div class="holo-term-btns">
          <span class="holo-term-btn close"></span>
          <span class="holo-term-btn min"></span>
          <span class="holo-term-btn max"></span>
        </div>
        <!-- 标题 -->
        <div class="holo-term-title">
          <span class="holo-term-icon">&#9654;</span>
          <span class="holo-term-text">TERMINAL://NODE-07/DATASTREAM</span>
        </div>
        <!-- 状态 -->
        <div class="holo-term-status">
          <span class="holo-status-dot"></span>
          <span class="holo-status-text">CONNECTED</span>
        </div>
      </div>

      <!-- 终端内容区 -->
      <div class="holo-terminal-body">
        <!-- 命令行提示符 -->
        <div class="holo-terminal-prompt">
          <span class="holo-prompt-path">root@holo:~$</span>
          <span class="holo-prompt-cmd">cat /data/stream.bin</span>
          <span class="holo-cursor-blink">&#9608;</span>
        </div>

        <!-- 代码内容 -->
        <div v-html="slide.html" class="holo-code-prose"></div>

        <!-- 底部状态行 -->
        <div class="holo-terminal-statusline">
          <span>-- OUTPUT --</span>
          <span class="holo-status-sep">|</span>
          <span>LN: 42</span>
          <span class="holo-status-sep">|</span>
          <span>ENC: HEX-7</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ===== 数据雨 ===== */
.holo-datarain {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  gap: 0.3rem;
  pointer-events: none;
  overflow: hidden;
}

.holo-datarain-left {
  left: 0;
  padding-left: 0.25rem;
}

.holo-datarain-right {
  right: 0;
  padding-right: 0.25rem;
}

.holo-rain-col {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 8px;
}

.holo-rain-char {
  display: block;
  font-size: 0.45rem;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1;
  color: var(--color-accent);
  opacity: 0.08;
  animation: holo-rain-fall linear infinite;
}

@keyframes holo-rain-fall {
  0% { opacity: 0.03; transform: translateY(-100%); }
  10% { opacity: 0.2; }
  50% { opacity: 0.05; }
  100% { opacity: 0.01; transform: translateY(10vh); }
}

/* ===== 终端窗口 ===== */
.holo-terminal-window {
  width: 750px;
  max-width: 78vw;
  border: 1px solid var(--color-border);
  clip-path: polygon(
    0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px,
    100% calc(100% - 12px), calc(100% - 12px) 100%,
    12px 100%, 0 calc(100% - 12px)
  );
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3), 0 0 30px color-mix(in srgb, var(--color-accent) 8%, transparent);
}

/* ===== 终端顶部栏 ===== */
.holo-terminal-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: color-mix(in srgb, #282a36 90%, transparent);
  border-bottom: 1px solid var(--color-border);
  gap: 1rem;
}

.holo-term-btns {
  display: flex;
  gap: 6px;
}

.holo-term-btn {
  width: 10px;
  height: 10px;
  display: block;
}

.holo-term-btn.close {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: var(--color-h1-to);
  opacity: 0.6;
}

.holo-term-btn.min {
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  background: var(--color-accent);
  opacity: 0.4;
}

.holo-term-btn.max {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  background: var(--color-accent);
  opacity: 0.4;
}

.holo-term-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.holo-term-icon {
  font-size: 0.5rem;
  color: var(--color-accent);
}

.holo-term-text {
  font-size: 0.55rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  letter-spacing: 0.05em;
}

.holo-term-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.holo-status-dot {
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  box-shadow: var(--holo-glow);
  animation: holo-dot-blink-code 2s step-end infinite;
}

.holo-status-text {
  font-size: 0.5rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  letter-spacing: 0.1em;
}

@keyframes holo-dot-blink-code {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* ===== 终端主体 ===== */
.holo-terminal-body {
  background: #282a36;
  padding: 1.25rem 1.5rem 1rem;
  min-height: 200px;
}

/* ===== 命令提示符 ===== */
.holo-terminal-prompt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
}

.holo-prompt-path {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  font-weight: 600;
}

.holo-prompt-cmd {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-code-fg);
  opacity: 0.7;
}

.holo-cursor-blink {
  font-size: 0.7rem;
  color: var(--color-accent);
  animation: holo-cursor-glow 1s step-end infinite;
}

@keyframes holo-cursor-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ===== 状态行 ===== */
.holo-terminal-statusline {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  display: flex;
  gap: 0.5rem;
  font-size: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  opacity: 0.5;
}

.holo-status-sep {
  opacity: 0.3;
}

/* ===== 代码内容 ===== */
.holo-code-prose :deep(h1),
.holo-code-prose :deep(h2),
.holo-code-prose :deep(h3),
.holo-code-prose :deep(h4) {
  font-size: var(--fs-h3);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.holo-code-prose :deep(.code-block-wrapper) { width: 100%; }

.holo-code-prose :deep(pre) {
  overflow-x: auto;
  margin: 0.5rem 0;
}

.holo-code-prose :deep(code) {
  font-family: 'JetBrains Mono', 'IBM Plex Mono', 'Fira Code', monospace;
  font-size: var(--fs-caption);
  line-height: 1.6;
}

.holo-code-prose :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  margin-top: 0.75rem;
}

</style>
