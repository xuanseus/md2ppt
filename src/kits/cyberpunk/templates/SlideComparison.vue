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
  <div class="cp-comparison w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- ═══ DIFF 模式 — 两个终端面板 ═══ -->
    <div class="relative z-10 w-full h-full flex flex-col" style="padding: 1.5rem 2.5rem 2rem">

      <!-- ═══ 顶部：标题 + DIFF header ═══ -->
      <div class="text-center mb-4">
        <div class="flex items-center justify-center gap-3 mb-1">
          <span class="cp-mono text-xs" style="color: var(--color-muted-foreground)">$ </span>
          <span class="cp-mono text-xs" style="color: var(--color-accent)">diff</span>
          <span class="cp-mono text-xs" style="color: #ff4444">--left</span>
          <span class="cp-mono text-xs" style="color: #00ff88">--right</span>
        </div>
        <h2 v-if="slide.title" class="cp-comp-title">{{ slide.title }}</h2>
        <div v-if="parsed.subtitle" v-html="parsed.subtitle" class="cp-comp-sub" />
      </div>

      <!-- ═══ 双终端面板 ═══ -->
      <div class="flex-1 flex gap-4 min-h-0">
        <!-- 左侧终端（红色霓虹主题） -->
        <div
          v-for="(col, i) in parsed.columns"
          :key="i"
          class="cp-diff-terminal"
          :class="i === 0 ? 'cp-diff-left' : 'cp-diff-right'"
          :style="{
            flex: '1 1 0',
            background: 'var(--color-code-bg)',
            border: '1px solid ' + (i === 0 ? '#ff4444' : '#00ff88'),
            borderRadius: '4px',
            boxShadow: '0 0 20px ' + (i === 0 ? 'rgba(255,68,68,0.15)' : 'rgba(0,255,136,0.15)'),
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }"
        >
          <!-- 终端标题栏 -->
          <div class="cp-diff-titlebar" :style="{ borderBottom: '1px solid ' + (i === 0 ? 'rgba(255,68,68,0.2)' : 'rgba(0,255,136,0.2)'), background: i === 0 ? 'rgba(255,68,68,0.05)' : 'rgba(0,255,136,0.05)' }">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :style="{ background: i === 0 ? '#ff4444' : '#00ff88', boxShadow: '0 0 6px ' + (i === 0 ? '#ff4444' : '#00ff88') }" />
              <span class="cp-mono text-xs" :style="{ color: i === 0 ? '#ff4444' : '#00ff88' }">{{ i === 0 ? '<<<' : '>>>' }}</span>
              <span class="cp-mono text-xs" style="color: var(--color-muted-foreground)">{{ col.title }}</span>
            </div>
            <span class="cp-mono cp-diff-mode" :style="{ color: i === 0 ? '#ff4444' : '#00ff88' }">{{ i === 0 ? '- REMOVED' : '+ ADDED' }}</span>
          </div>

          <!-- 终端内容 -->
          <div class="cp-diff-body">
            <!-- 模拟命令行 -->
            <div class="cp-diff-cmdline">
              <span class="cp-mono text-xs" style="color: var(--color-muted-foreground); opacity: 0.5">$ output --format=json | grep -v null</span>
            </div>

            <!-- 输出项 -->
            <div class="cp-diff-output">
              <div
                v-for="(item, j) in col.items"
                :key="j"
                class="cp-diff-item"
                :style="{ borderLeft: '3px solid ' + (i === 0 ? '#ff4444' : '#00ff88') }"
              >
                <span class="cp-diff-prefix cp-mono" :style="{ color: i === 0 ? '#ff4444' : '#00ff88' }">{{ i === 0 ? '-' : '+' }}</span>
                <span class="cp-diff-item-text cp-mono">{{ item }}</span>
              </div>

              <div v-if="col.items.length === 0" class="cp-diff-empty">
                <span class="cp-mono text-xs" style="color: var(--color-muted-foreground)">// NO OUTPUT</span>
              </div>
            </div>

            <!-- 底部 prompt -->
            <div class="cp-diff-prompt">
              <span class="cp-mono text-xs" style="color: var(--color-muted-foreground); opacity: 0.5">$ <span class="cp-cursor-blink" :style="{ color: i === 0 ? '#ff4444' : '#00ff88' }">█</span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- DIFF 统计 -->
      <div class="text-center mt-3">
        <div class="cp-diff-stat">
          <span class="cp-mono cp-diff-stat-item" style="color: #ff4444">- {{ parsed.columns[0]?.items.length || 0 }} lines</span>
          <span class="cp-mono cp-diff-stat-divider" style="color: var(--color-muted-foreground)">|</span>
          <span class="cp-mono cp-diff-stat-item" style="color: #00ff88">+ {{ parsed.columns[1]?.items.length || 0 }} lines</span>
          <span class="cp-mono cp-diff-stat-divider" style="color: var(--color-muted-foreground)">|</span>
          <span class="cp-mono cp-diff-stat-item" style="color: var(--color-accent)">{{ Math.abs((parsed.columns[0]?.items.length || 0) - (parsed.columns[1]?.items.length || 0)) }} changes</span>
        </div>
        <div v-if="parsed.afterText" v-html="parsed.afterText" class="cp-comp-after" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px);
}

.cp-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace; }

.cp-comp-title {
  font-size: var(--fs-h2);
  font-weight: 800;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 30px var(--color-accent);
  text-transform: uppercase;
}

.cp-comp-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
}

/* DIFF 终端 header bar */
.cp-diff-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
}

.cp-diff-mode {
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

/* DIFF body */
.cp-diff-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.75rem;
  overflow-y: auto;
}

.cp-diff-cmdline {
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
}

.cp-diff-output {
  flex: 1;
}

.cp-diff-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  margin-bottom: 0.3rem;
  background: color-mix(in srgb, var(--color-card) 40%, transparent);
  border-radius: 0 2px 2px 0;
  transition: background 0.2s ease;
}

.cp-diff-item:hover {
  background: color-mix(in srgb, var(--color-card) 80%, transparent);
}

.cp-diff-prefix {
  font-size: var(--fs-body-sm);
  font-weight: 900;
  flex-shrink: 0;
  width: 1rem;
}

.cp-diff-item-text {
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  line-height: 1.6;
}

.cp-diff-empty {
  text-align: center;
  padding: 2rem 0;
}

.cp-diff-prompt {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.cp-cursor-blink { animation: cp-cursor 1s step-end infinite; }

@keyframes cp-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* DIFF 统计栏 */
.cp-diff-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-code-bg);
  border: 1px solid var(--color-border);
  padding: 0.3rem 1.25rem;
  border-radius: 2px;
}

.cp-diff-stat-item { font-size: 0.65rem; }
.cp-diff-stat-divider { font-size: 0.65rem; opacity: 0.3; }

.cp-comp-after :deep(p) {
  font-size: var(--fs-caption);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  margin-top: 0.5rem;
}
</style>
