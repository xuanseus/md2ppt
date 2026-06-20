<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'

const props = defineProps<{ slide: Slide }>()

const LANG_DISPLAY: Record<string, string> = {
  javascript: 'JavaScript ES2024',
  typescript: 'TypeScript 5.x',
  python: 'Python 3.11',
  bash: 'Bash',
  shell: 'Shell',
  powershell: 'PowerShell 7',
  html: 'HTML5',
  css: 'CSS3',
  json: 'JSON',
  markdown: 'Markdown',
  java: 'Java 21',
  go: 'Go 1.x',
  rust: 'Rust',
  c: 'C11',
  cpp: 'C++20',
  csharp: 'C# 12',
  swift: 'Swift 6',
  kotlin: 'Kotlin 2.x',
  ruby: 'Ruby 3.x',
  php: 'PHP 8.x',
  sql: 'SQL',
  yaml: 'YAML',
  xml: 'XML',
  dockerfile: 'Docker',
  diff: 'Diff',
  vue: 'Vue 3 SFC',
  svelte: 'Svelte 5',
  makefile: 'Makefile',
}

const codeLang = computed(() => {
  const match = props.slide.rawMd.match(/^```(\w+)/m)
  if (!match) return ''
  const lang = match[1].toLowerCase()
  return LANG_DISPLAY[lang] || lang
})
</script>

<template>
  <div class="cp-code w-full h-full" style="background: var(--color-background)">
    <!-- 背景矩阵雨效果 -->
    <div class="cp-matrix-bg" />

    <!-- ═══ 终端窗口 ═══ -->
    <div class="relative z-10 w-full h-full flex items-center justify-center" style="padding: 2rem 3rem">
      <div class="cp-terminal-window" style="width: 100%; max-width: 960px; overflow: hidden">
        <!-- 终端标题栏 -->
        <div class="cp-term-titlebar">
          <!-- 红绿灯 -->
          <div class="flex items-center gap-2">
            <span class="cp-terminate-btn" style="background: #ff5f57; box-shadow: 0 0 8px #ff5f57" />
            <span class="cp-terminate-btn" style="background: #ffbd2e; box-shadow: 0 0 8px #ffbd2e" />
            <span class="cp-terminate-btn" style="background: #27ca40; box-shadow: 0 0 8px #27ca40" />
          </div>
          <!-- 标题 -->
          <span class="cp-mono cp-term-title">root@neon-grid: ~/classified/source_code — bash — 80×24</span>
          <!-- 右侧控制 -->
          <div class="flex items-center gap-3">
            <span class="cp-mono cp-term-pid" style="font-size: 0.55rem; color: var(--color-muted-foreground)">PID: 8472</span>
          </div>
        </div>

        <!-- ═══ 代码区：带行号 ═══ -->
        <div class="cp-term-body" style="position: relative">
          <!-- 行号列 -->
          <div class="cp-line-numbers">
            <span v-for="n in 24" :key="n" class="cp-line-num" :class="{ 'cp-line-active': n === 12 }">{{ String(n).padStart(3, ' ') }}</span>
          </div>

          <!-- 代码内容 -->
          <div v-html="slide.html" class="cp-code-prose" />
        </div>

        <!-- 底部状态栏 -->
        <div class="cp-term-statusbar">
          <div class="flex gap-4">
            <span class="cp-mono cp-status-item" style="color: var(--color-muted-foreground)">UTF-8</span>
            <span class="cp-mono cp-status-item" style="color: var(--color-muted-foreground)">LF</span>
            <span class="cp-mono cp-status-item" style="color: var(--color-muted-foreground)">{{ codeLang || 'Plain Text' }}</span>
          </div>
          <div class="flex gap-4">
            <span class="cp-mono cp-status-item" style="color: var(--color-accent)">Ln 24, Col 1</span>
            <span class="cp-mono cp-status-item" style="color: var(--color-muted-foreground)">Spaces: 4</span>
            <span class="cp-mono cp-status-item" style="color: var(--color-accent)">● SYNTAX OK</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace; }

/* 矩阵雨背景 */
.cp-matrix-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.06;
  background-image:
    repeating-linear-gradient(180deg,
      transparent 0,
      transparent 40px,
      color-mix(in srgb, var(--color-accent) 50%, transparent) 40px,
      color-mix(in srgb, var(--color-accent) 50%, transparent) 42px,
      transparent 42px,
      transparent 80px
    );
  animation: cp-matrix-rain 3s linear infinite;
}

@keyframes cp-matrix-rain {
  0% { background-position-y: 0; }
  100% { background-position-y: 80px; }
}

/* 终端窗口 */
.cp-terminal-window {
  background: color-mix(in srgb, #282a36 95%, #000);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 10%, transparent), 0 0 80px color-mix(in srgb, var(--color-accent) 5%, transparent);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 标题栏 */
.cp-term-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: color-mix(in srgb, var(--color-muted) 60%, transparent);
  border-bottom: 1px solid var(--color-border);
}

.cp-terminate-btn { width: 12px; height: 12px; border-radius: 50%; }
.cp-term-title { font-size: 0.65rem; color: var(--color-muted-foreground); opacity: 0.7; }

/* 终端 body */
.cp-term-body {
  display: flex;
  padding: 0.75rem 0;
  position: relative;
}

/* 行号 */
.cp-line-numbers {
  display: flex;
  flex-direction: column;
  padding: 0 0.75rem;
  border-right: 1px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--fs-caption);
  line-height: 1.6;
  color: var(--color-muted-foreground);
  opacity: 0.4;
  user-select: none;
  flex-shrink: 0;
}

.cp-line-num { line-height: 1.6; }

.cp-line-active {
  opacity: 1;
  color: var(--color-accent);
  font-weight: 700;
}

/* 代码区 */
.cp-code-prose {
  flex: 1;
  overflow-x: auto;
  padding: 0 1rem;
}

.cp-code-prose :deep(h1), .cp-code-prose :deep(h2), .cp-code-prose :deep(h3), .cp-code-prose :deep(h4) {
  display: none;
}

.cp-code-prose :deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0;
}

.cp-code-prose :deep(code) {
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  font-size: calc(0.85rem * var(--content-scale));
  line-height: 1.6;
}

.cp-code-prose :deep(p) {
  display: none;
}

/* 底部状态栏 */
.cp-term-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 1rem;
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
  border-top: 1px solid var(--color-border);
  font-size: 0.6rem;
}
</style>
