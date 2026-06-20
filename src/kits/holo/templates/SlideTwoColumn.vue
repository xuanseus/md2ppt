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
  <!-- ============================================================
      全息对角线分裂布局：
      左上层面板 (z-30) + 右下层面板 (z-20) 重叠交错
      中间对角线连接梁
      ============================================================ -->
  <div class="holo-twocol relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- 对角线分区底色 -->
    <div class="absolute inset-0 pointer-events-none" style="
      clip-path: polygon(0 0, 100% 0, 0 100%);
      background: color-mix(in srgb, var(--color-accent) 3%, transparent);
    "></div>
    <div class="absolute inset-0 pointer-events-none" style="
      clip-path: polygon(100% 0, 100% 100%, 0 100%);
      background: color-mix(in srgb, var(--color-h1-to) 3%, transparent);
    "></div>

    <!-- 对角线数据流 -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none" style="
      background: linear-gradient(135deg, transparent 48%, var(--color-accent) 49%, var(--color-accent) 51%, transparent 52%);
      opacity: 0.06;
    "></div>

    <!-- ============ 左上层面板（第一列） z-30 ============ -->
    <div class="absolute z-30 holo-panel-topleft" style="
      clip-path: polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
    " v-if="parsed.columns[0]">
      <!-- 面板顶部数据读数 -->
      <div class="holo-panel-header">
        <span class="holo-panel-reticle"></span>
        <span class="holo-panel-id">[PANEL-01]</span>
        <span class="holo-panel-status">ACTIVE</span>
      </div>

      <!-- 列标题 -->
      <h3 class="holo-panel-title">{{ parsed.columns[0].title }}</h3>
      <div class="holo-panel-beam"></div>

      <!-- 内容 -->
      <div v-html="parsed.columns[0].html" class="holo-twocol-prose"></div>
    </div>

    <!-- ============ 对角线连接桥 ============ -->
    <!-- 左列右下 (44%, ~35%) → 右列左上 (56%, ~65%) -->
    <svg class="absolute inset-0 z-25 pointer-events-none w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="none" style="overflow: visible;">
      <line x1="440" y1="245" x2="560" y2="455" stroke="var(--color-accent)" stroke-width="1.5" opacity="0.2" stroke-dasharray="6,8"/>
      <!-- 箭头指向右列 -->
      <polygon points="552,443 566,455 554,463" fill="var(--color-accent)" opacity="0.3"/>
    </svg>

    <!-- ============ 右下层面板（第二列） z-20 ============ -->
    <div class="absolute z-20 holo-panel-bottomright" style="
      clip-path: polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
    " v-if="parsed.columns[1]">
      <!-- 面板顶部数据读数 -->
      <div class="holo-panel-header right">
        <span class="holo-panel-id">[PANEL-02]</span>
        <span class="holo-panel-status idle">STBY</span>
        <span class="holo-panel-reticle"></span>
      </div>

      <!-- 列标题 -->
      <h3 class="holo-panel-title alt">{{ parsed.columns[1].title }}</h3>
      <div class="holo-panel-beam alt"></div>

      <!-- 内容 -->
      <div v-html="parsed.columns[1].html" class="holo-twocol-prose"></div>
    </div>

    <!-- ============ 大标题（顶部居中） ============ -->
    <div class="absolute z-30 text-center" style="top: 5%; left: 50%; transform: translateX(-50%); width: 80%; max-width: 800px;">
      <h2 v-if="slide.title" class="holo-twocol-global-title">{{ slide.title }}</h2>
      <div v-if="parsed.subtitle" v-html="parsed.subtitle" class="holo-twocol-global-sub"></div>
    </div>

    <!-- ============ 列尾文字（右下角） ============ -->
    <div v-if="parsed.afterText" class="absolute z-10" style="bottom: 6%; right: 5%; text-align: right;" v-html="parsed.afterText"></div>
  </div>
</template>

<style scoped>
/* ===== 面板通用 ===== */
.holo-panel-topleft {
  top: 10%;
  left: 4%;
  width: 40%;
  max-width: 520px;
  padding: 1.5rem 2rem;
  background: color-mix(in srgb, var(--color-card) 95%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 40%, transparent);
  box-shadow: -4px 4px 20px color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.holo-panel-bottomright {
  bottom: 10%;
  right: 4%;
  width: 40%;
  max-width: 520px;
  padding: 1.5rem 2rem;
  background: color-mix(in srgb, var(--color-card) 95%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-h1-to) 40%, transparent);
  box-shadow: 4px -4px 20px color-mix(in srgb, var(--color-h1-to) 10%, transparent);
}

/* ===== 面板头部 ===== */
.holo-panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.holo-panel-header.right {
  justify-content: flex-end;
}

.holo-panel-reticle {
  width: 8px;
  height: 8px;
  border: 1px solid var(--color-accent);
  clip-path: polygon(0 0, 100% 0, 100% 4px, 4px 4px, 4px 100%, 0 100%);
}

.holo-panel-id {
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  letter-spacing: 0.1em;
}

.holo-panel-status {
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-shadow: var(--holo-glow);
}

.holo-panel-status.idle {
  color: var(--color-h1-to);
  text-shadow: none;
  opacity: 0.6;
}

/* ===== 面板标题 ===== */
.holo-panel-title {
  font-size: var(--fs-h3);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  margin: 0 0 0.25rem 0;
}

.holo-panel-title.alt {
  color: var(--color-heading);
}

.holo-panel-beam {
  width: 48px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
  margin-bottom: 1rem;
}

.holo-panel-beam.alt {
  background: linear-gradient(90deg, var(--color-h1-to), transparent);
}

/* ===== 全局标题 ===== */
.holo-twocol-global-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
}

.holo-twocol-global-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  margin-top: 0.5rem;
  line-height: 1.5;
}

/* ===== 内容 ===== */
.holo-twocol-prose :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.75rem;
  color: var(--color-foreground);
}

.holo-twocol-prose :deep(ul),
.holo-twocol-prose :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.holo-twocol-prose :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
}

.holo-twocol-prose :deep(li)::marker {
  color: var(--color-accent);
  content: '\25B8';
}

.holo-twocol-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}
</style>
