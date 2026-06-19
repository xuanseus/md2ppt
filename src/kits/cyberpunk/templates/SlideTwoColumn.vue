<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Column {
  title: string
  html: string
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
      const contentLines: string[] = []
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
          contentLines.push(t)
        }
      }
      columns.push({ title: titleMatch[1], html: marked.parse(contentLines.join('\n')) as string })
    } else {
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t) {
          if (hitColumns) afterText.push(t)
          else beforeText.push(t)
        }
      }
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2), afterText: after }
})
</script>

<template>
  <div class="cp-twocol w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- ═══ 非对称两栏布局 ═══ -->
    <div class="relative z-10 w-full h-full flex gap-0" style="padding: 2rem 2rem 2rem 3rem">

      <!-- ═══ 左侧：窄终端面板（命令输出风格） ═══ -->
      <div class="cp-terminal-panel" :style="{
        flex: '0 0 30%',
        background: 'color-mix(in srgb, var(--color-code-bg) 90%, transparent)',
        border: '1px solid var(--color-border)',
        borderRadius: '4px',
        boxShadow: '0 0 25px color-mix(in srgb, var(--color-accent) 10%, transparent), inset 0 0 30px color-mix(in srgb, var(--color-accent) 3%, transparent)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }">
        <!-- 终端标题栏 -->
        <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom: 1px solid var(--color-border)">
          <span class="w-2.5 h-2.5 rounded-full" style="background: #ff5f57; box-shadow: 0 0 6px #ff5f57" />
          <span class="w-2.5 h-2.5 rounded-full" style="background: #ffbd2e; box-shadow: 0 0 6px #ffbd2e" />
          <span class="w-2.5 h-2.5 rounded-full" style="background: #27ca40; box-shadow: 0 0 6px #27ca40" />
          <span class="cp-mono text-xs ml-2 opacity-50" style="color: var(--color-muted-foreground)">sys.query --panel</span>
        </div>

        <!-- 标题 -->
        <h2 v-if="slide.title" class="cp-terminal-title">{{ slide.title }}</h2>

        <!-- 副标题 -->
        <div v-if="parsed.subtitle" v-html="parsed.subtitle" class="cp-terminal-sub" />

        <!-- 虚构的命令输出 -->
        <div class="mt-auto cp-mono text-xs opacity-30" style="color: var(--color-muted-foreground)">
          <div>$ query --filter "{{ slide.title || 'data' }}"</div>
          <div>&gt; 2 records found</div>
          <div>&gt; latency: 0.003ms</div>
          <div class="cp-cursor-blink" style="color: var(--color-accent)">$ █</div>
        </div>
      </div>

      <!-- ═══ 数据流连接线 ═══ -->
      <div class="cp-data-bridge" style="flex: 0 0 40px; position: relative">
        <div class="cp-bridge-line" />
        <div v-for="n in 3" :key="n" class="cp-bridge-dot cp-dot-flow" :style="{ animationDelay: (n * 0.6) + 's' }" />
      </div>

      <!-- ═══ 右侧：宽数据可视化面板 ═══ -->
      <div class="cp-viz-panel" :style="{
        flex: '1 1 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: 0,
      }">
        <!-- 面板头部 -->
        <div class="flex items-center justify-between" style="padding: 0 0.5rem">
          <div class="flex items-center gap-2">
            <span class="cp-diamond w-2 h-2" style="background: var(--color-h1-to); box-shadow: 0 0 6px var(--color-h1-to)" />
            <span class="cp-mono text-xs" style="color: var(--color-h1-to)">DATA_VISUALIZATION</span>
          </div>
          <div class="flex gap-1">
            <span v-for="n in 4" :key="n" class="cp-mono text-xs cp-dot-pulse" :style="{ color: n % 2 ? 'var(--color-accent)' : 'var(--color-h1-to)', animationDelay: (n * 0.3) + 's' }">{{ n % 2 ? '■' : '□' }}</span>
          </div>
        </div>

        <!-- 右侧列卡片 — 纵向堆叠，非并排 grid -->
        <div
          v-for="(col, i) in parsed.columns"
          :key="i"
          class="cp-viz-card"
          :style="{
            background: 'var(--color-card)',
            border: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'),
            borderRadius: '2px',
            boxShadow: '0 0 20px ' + (i === 0 ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'color-mix(in srgb, var(--color-h1-to) 12%, transparent)'),
            padding: '1.25rem 1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }"
        >
          <!-- 面板 wireframe 边角装饰 -->
          <div class="absolute top-0 left-0 w-8 h-8 pointer-events-none" :style="{ borderTop: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'), borderLeft: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'), opacity: 0.6 }" />
          <div class="absolute top-0 right-0 w-8 h-8 pointer-events-none" :style="{ borderTop: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'), borderRight: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'), opacity: 0.6 }" />
          <div class="absolute bottom-0 left-0 w-8 h-8 pointer-events-none" :style="{ borderBottom: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'), borderLeft: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'), opacity: 0.6 }" />
          <div class="absolute bottom-0 right-0 w-8 h-8 pointer-events-none" :style="{ borderBottom: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'), borderRight: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)'), opacity: 0.6 }" />

          <!-- 列标题带 wireframe bracket -->
          <div class="flex items-center gap-2 mb-3 pb-2" :style="{ borderBottom: '1px solid ' + (i === 0 ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)' : 'color-mix(in srgb, var(--color-h1-to) 20%, transparent)') }">
            <span class="cp-mono text-xs" :style="{ color: i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)' }">[</span>
            <h4 class="cp-mono" style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); text-shadow: 0 0 8px var(--color-accent)">
              {{ col.title }}
            </h4>
            <span class="cp-mono text-xs" :style="{ color: i === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)' }">]</span>
          </div>

          <!-- 内容区 -->
          <div v-html="col.html" class="cp-twocol-prose" />
        </div>
      </div>
    </div>

    <!-- 列尾文字 -->
    <div v-if="parsed.afterText" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center" v-html="parsed.afterText" style="font-family: 'JetBrains Mono', monospace; font-size: var(--fs-caption); color: var(--color-muted-foreground)" />
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
.cp-diamond { transform: rotate(45deg); }

.cp-terminal-title {
  font-size: calc(1.6rem * var(--content-scale));
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 20px var(--color-accent);
  margin-bottom: 0.75rem;
}

.cp-terminal-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.6;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

/* 数据流连接桥 */
.cp-bridge-line {
  position: absolute;
  left: 50%;
  top: 10%;
  bottom: 10%;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, var(--color-accent), var(--color-h1-to), var(--color-accent));
  box-shadow: 0 0 8px var(--color-accent);
}

.cp-bridge-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 8px var(--color-accent);
}

.cp-bridge-dot:nth-child(2) { top: 25%; }
.cp-bridge-dot:nth-child(3) { top: 50%; }
.cp-bridge-dot:nth-child(4) { top: 75%; }

.cp-dot-flow { animation: cp-dot-flow 3s ease-in-out infinite; }

@keyframes cp-dot-flow {
  0%, 100% { opacity: 0.2; transform: translateX(-50%) scale(1); }
  50% { opacity: 1; transform: translateX(-50%) scale(2); }
}

.cp-dot-pulse { animation: cp-dot-pulse 2s ease-in-out infinite; }

@keyframes cp-dot-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.cp-cursor-blink { animation: cp-cursor 1s step-end infinite; }

@keyframes cp-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 右侧面板内容样式 */
.cp-twocol-prose :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.6rem;
  color: var(--color-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-twocol-prose :deep(ul),
.cp-twocol-prose :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
  list-style: none;
}

.cp-twocol-prose :deep(li) {
  margin-bottom: 0.4rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  padding-left: 1.2rem;
  position: relative;
}

.cp-twocol-prose :deep(li)::before {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--color-accent);
  text-shadow: 0 0 6px var(--color-accent);
  font-weight: 700;
}

.cp-twocol-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
  text-shadow: 0 0 10px var(--color-accent);
}

.cp-twocol-prose :deep(img) {
  max-width: 100%;
  max-height: 140px;
  object-fit: contain;
  border-radius: 2px;
  margin: 0.5rem auto;
  border: 1px solid var(--color-border);
}
</style>
