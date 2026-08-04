<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-list w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- ═══ 系统进程表布局（ps aux / task manager） ═══ -->
    <div class="relative z-10 w-full h-full flex flex-col" style="padding: 1.5rem 2rem">

      <!-- 标题栏 -->
      <div class="cp-proc-titlebar mb-3">
        <div class="flex items-center gap-3">
          <span class="cp-mono cp-proc-cmd">$ ps aux --sort=-%cpu | head -n 20</span>
        </div>
        <h2 v-if="slide.title" class="cp-proc-title">{{ slide.title }}</h2>
      </div>

      <!-- ═══ 表格容器 ═══ -->
      <div class="cp-proc-table-wrapper">
        <!-- 表头 -->
        <div class="cp-proc-header">
          <div class="cp-proc-header-cell cp-proc-col-pid">PID</div>
          <div class="cp-proc-header-cell cp-proc-col-stat">STAT</div>
          <div class="cp-proc-header-cell cp-proc-col-cpu">%CPU</div>
          <div class="cp-proc-header-cell cp-proc-col-mem">%MEM</div>
          <div class="cp-proc-header-cell cp-proc-col-time">TIME</div>
          <div class="cp-proc-header-cell cp-proc-col-name">PROCESS</div>
        </div>

        <!-- 列表项：每项成为一行进程 -->
        <div class="cp-proc-list">
          <div v-html="slide.html" class="cp-list-prose" />
        </div>
      </div>

      <!-- 底部信息栏 -->
      <div class="cp-proc-footer mt-3">
        <div class="flex items-center gap-4">
          <span class="cp-mono cp-footer-stat">TOTAL: <span style="color: var(--color-accent)">247</span> processes</span>
          <span class="cp-mono cp-footer-stat">RUNNING: <span style="color: #00ff88">3</span></span>
          <span class="cp-mono cp-footer-stat">SLEEPING: <span style="color: var(--color-muted-foreground)">242</span></span>
          <span class="cp-mono cp-footer-stat">ZOMBIE: <span style="color: #ff4444">0</span></span>
        </div>
        <div class="flex items-center gap-2">
          <span class="cp-mono cp-footer-stat">UPTIME: 14d 7h 32m</span>
          <span class="cp-mono cp-footer-stat">LOAD: 0.47 0.52 0.43</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px);
}

.cp-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace; }

/* 标题 */
.cp-proc-cmd {
  font-size: 0.65rem;
  color: var(--color-muted-foreground);
  opacity: 0.6;
}

.cp-proc-title {
  font-size: var(--fs-h2);
  font-weight: 800;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 30px var(--color-accent);
  text-transform: uppercase;
  margin-top: 0.25rem;
}

/* 表格容器 */
.cp-proc-table-wrapper {
  flex: 1;
  background: var(--color-code-bg);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 8%, transparent), inset 0 0 30px color-mix(in srgb, var(--color-accent) 2%, transparent);
}

/* 表头 */
.cp-proc-header {
  display: flex;
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  border-bottom: 2px solid var(--color-accent);
  padding: 0.35rem 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
}

.cp-proc-col-pid { flex: 0 0 70px; }
.cp-proc-col-stat { flex: 0 0 55px; }
.cp-proc-col-cpu { flex: 0 0 60px; text-align: right; }
.cp-proc-col-mem { flex: 0 0 60px; text-align: right; }
.cp-proc-col-time { flex: 0 0 70px; text-align: right; }
.cp-proc-col-name { flex: 1 1 0; }

/* 进程列表 */
.cp-proc-list { flex: 1; overflow-y: auto; }

.cp-list-prose :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: proc-pid;
}

/* 每一项 li 都变成进程行 */
.cp-list-prose :deep(li) {
  display: flex;
  align-items: center;
  padding: 0.45rem 0.75rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 20%, transparent);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  font-size: var(--fs-body-sm);
  line-height: 1.5;
  color: var(--color-foreground);
  transition: background 0.15s ease, box-shadow 0.15s ease;
  position: relative;
}

.cp-list-prose :deep(li:nth-child(odd)) {
  background: color-mix(in srgb, var(--color-card) 30%, transparent);
}

.cp-list-prose :deep(li:nth-child(even)) {
  background: transparent;
}

.cp-list-prose :deep(li:hover) {
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  box-shadow: inset 0 0 15px color-mix(in srgb, var(--color-accent) 5%, transparent);
}

/* 用 CSS counter 自动生成 PID */
.cp-list-prose :deep(li)::before {
  counter-increment: proc-pid;
  content: counter(proc-pid);
  flex: 0 0 70px;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
}

/* 状态指示器 */
.cp-list-prose :deep(li)::after {
  content: 'RUN';
  flex: 0 0 55px;
  font-size: 0.55rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.05em;
}

/* 每 3 个的 PID 用不同颜色 */
.cp-list-prose :deep(li:nth-child(3n+1))::after { content: 'RUN'; color: #00ff88; text-shadow: 0 0 6px #00ff88; }
.cp-list-prose :deep(li:nth-child(3n+2))::after { content: 'SLP'; color: var(--color-muted-foreground); }
.cp-list-prose :deep(li:nth-child(3n+3))::after { content: 'IDL'; color: var(--color-accent); text-shadow: 0 0 6px var(--color-accent); }

/* 每个 PID 前加 0x 前缀 */
.cp-list-prose :deep(li:nth-child(3n+1))::before { color: #00ff88; text-shadow: 0 0 6px #00ff88; }
.cp-list-prose :deep(li:nth-child(3n+2))::before { color: var(--color-muted-foreground); }
.cp-list-prose :deep(li:nth-child(3n+3))::before { color: var(--color-accent); text-shadow: 0 0 6px var(--color-accent); }

/* strong 高亮为进程名 */
.cp-list-prose :deep(strong) {
  color: var(--color-accent);
  font-weight: 700;
  text-shadow: 0 0 10px var(--color-accent);
}

/* 移除默认的 > 前缀 marker */
.cp-list-prose :deep(li::marker) { content: none; }

/* p 段落作为进程行 */
.cp-list-prose :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.6;
  padding: 0.45rem 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-foreground);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 20%, transparent);
}

/* footer */
.cp-proc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--color-code-bg) 60%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 0.3rem 0.75rem;
}

.cp-footer-stat { font-size: 0.55rem; color: var(--color-muted-foreground); opacity: 0.7; }
</style>
