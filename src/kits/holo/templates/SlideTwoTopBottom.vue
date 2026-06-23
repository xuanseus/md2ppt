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
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const columns: Column[] = []
  const beforeText: string[] = []
  let hit = false
  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  for (const part of parts) {
    const t = part.trim(); if (!t) continue
    const tm = t.match(/^\*\*([^*]+)\*\*/m)
    if (tm) {
      hit = true
      const lines: string[] = []
      for (const l of t.split('\n')) { const ln = l.trim(); if (ln && !ln.match(/^\*\*[^*]+\*\*$/)) lines.push(ln) }
      columns.push({ title: tm[1], html: marked.parse(lines.join('\n')) as string })
    } else { for (const l of t.split('\n')) { const ln = l.trim(); if (ln && !hit) beforeText.push(ln) } }
  }
  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2) }
})
</script>

<template>
  <div class="holo-twotb relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景坐标网格 ============ -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" style="opacity: 0.025;">
      <defs>
        <pattern id="holoTtbGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="60" y2="60" stroke="var(--color-accent)" stroke-width="0.5"/>
          <line x1="60" y1="0" x2="0" y2="60" stroke="var(--color-accent)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#holoTtbGrid)" />
    </svg>

    <!-- ============ 全局标题 ============ -->
    <div class="absolute z-10" style="top: 4%; left: 50%; transform: translateX(-50%);">
      <h2 v-if="slide.title" class="holo-ttb-title">{{ slide.title || 'Two Column' }}</h2>
      <div class="holo-ttb-beam"></div>
      <div v-if="parsed.subtitle" class="holo-ttb-sub" v-html="parsed.subtitle"></div>
    </div>

    <!-- ============ 上下 HUD 面板 ============ -->
    <div class="relative z-10 w-full" style="max-width: 900px; margin-top: 60px;">
      <div class="flex flex-col gap-6">
        <!-- 上面板 -->
        <div v-if="parsed.columns[0]" class="holo-ttb-panel top-panel">
          <div class="holo-panel-header">
            <span class="holo-panel-reticle"></span>
            <span class="holo-panel-id">[PANEL-01]</span>
            <span class="holo-panel-status">ACTIVE</span>
          </div>
          <h3 class="holo-panel-title">{{ parsed.columns[0].title }}</h3>
          <div class="holo-panel-beam-accent"></div>
          <div v-html="parsed.columns[0].html" class="holo-ttb-prose"></div>
        </div>

        <!-- 下面板 -->
        <div v-if="parsed.columns[1]" class="holo-ttb-panel bottom-panel">
          <div class="holo-panel-header right">
            <span class="holo-panel-id">[PANEL-02]</span>
            <span class="holo-panel-status idle">STBY</span>
            <span class="holo-panel-reticle"></span>
          </div>
          <h3 class="holo-panel-title alt">{{ parsed.columns[1].title }}</h3>
          <div class="holo-panel-beam-accent alt"></div>
          <div v-html="parsed.columns[1].html" class="holo-ttb-prose"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 全局标题 ===== */
.holo-ttb-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
}
.holo-ttb-beam {
  width: 60px;
  height: 2px;
  margin: 0.5rem auto;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
}
.holo-ttb-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin: 0;
}

/* ===== HUD 面板 ===== */
.holo-ttb-panel {
  padding: 1.25rem 2rem;
  border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
  clip-path: polygon(
    0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px,
    100% calc(100% - 12px), calc(100% - 12px) 100%,
    12px 100%, 0 calc(100% - 12px)
  );
}

.top-panel {
  background: color-mix(in srgb, var(--color-card) 95%, transparent);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--color-accent) 8%, transparent);
}

.bottom-panel {
  background: color-mix(in srgb, var(--color-card) 95%, transparent);
  box-shadow: 0 -4px 20px color-mix(in srgb, var(--color-h1-to) 8%, transparent);
}

/* ===== 面板头部 ===== */
.holo-panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
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
  font-size: var(--fs-h4);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  margin: 0 0 0.25rem 0;
}
.holo-panel-title.alt {
  color: var(--color-heading);
}
.holo-panel-beam-accent {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
  margin-bottom: 0.75rem;
}
.holo-panel-beam-accent.alt {
  background: linear-gradient(90deg, var(--color-h1-to), transparent);
}

/* ===== 内容 ===== */
.holo-ttb-prose :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.5rem;
  color: var(--color-foreground);
}
.holo-ttb-prose :deep(ul),
.holo-ttb-prose :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}
.holo-ttb-prose :deep(li) {
  margin-bottom: 0.4rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
}
.holo-ttb-prose :deep(li::marker) {
  color: var(--color-accent);
}
.holo-ttb-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}
</style>
