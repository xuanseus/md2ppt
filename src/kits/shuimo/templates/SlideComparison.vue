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

  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const titleMatch = trimmed.match(/^\*\*([^*]+)\*\*/m)
    if (titleMatch) {
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
  <div class="sm-comparison w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 标题区 -->
    <div v-if="slide.title" class="absolute top-12 left-1/2 -translate-x-1/2 z-20">
      <h2 class="text-center"
        style="font-size: var(--fs-h2); font-weight: 700; color: var(--color-heading); font-family: 'Noto Serif SC', 'STSong', Georgia, serif; letter-spacing: 0.08em;">
        {{ slide.title }}
      </h2>
    </div>

    <div v-if="parsed.subtitle" class="absolute top-40 left-1/2 -translate-x-1/2 z-20" v-html="parsed.subtitle"
      style="font-size: var(--fs-body-sm); color: var(--color-muted-foreground); font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif; opacity: 0.6;" />

    <!-- 双卷轴对比布局 -->
    <div class="sm-comp-layout">
      <!-- 左卷轴 — 自上向下展开 -->
      <div v-if="parsed.columns[0]" class="sm-scroll-left">
        <div class="sm-scroll-top-rod" />
        <div class="sm-scroll-left-body">
          <div class="sm-comp-header">
            <span class="w-2.5 h-2.5 rounded-sm rotate-45 opacity-50" style="background: var(--color-seal)" />
            <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); font-family: 'Noto Serif SC', 'STSong', Georgia, serif;">
              {{ parsed.columns[0].title }}
            </h4>
          </div>
          <ul class="sm-comp-items">
            <li v-for="(item, j) in parsed.columns[0].items" :key="j" class="sm-comp-item-left">
              <span class="sm-comp-marker">甲</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 中部 VS 印章 -->
      <div class="sm-comp-vs">
        <div class="sm-comp-vs-seal">
          <span>对</span>
        </div>
        <!-- 垂直墨线连接 -->
        <div class="sm-comp-vs-line" />
      </div>

      <!-- 右卷轴 — 自下向上展开 -->
      <div v-if="parsed.columns[1]" class="sm-scroll-right">
        <div class="sm-scroll-right-body">
          <div class="sm-comp-header">
            <span class="w-2.5 h-2.5 rounded-sm rotate-45 opacity-50" style="background: var(--color-seal)" />
            <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); font-family: 'Noto Serif SC', 'STSong', Georgia, serif;">
              {{ parsed.columns[1].title }}
            </h4>
          </div>
          <ul class="sm-comp-items">
            <li v-for="(item, j) in parsed.columns[1].items" :key="j" class="sm-comp-item-right">
              <span class="sm-comp-marker">乙</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="sm-scroll-bottom-rod" />
      </div>

      <div v-if="parsed.afterText" class="text-center mt-4" style="grid-column: 1 / -1; font-size: var(--fs-caption); color: var(--color-muted-foreground); font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif; opacity: 0.5;" v-html="parsed.afterText" />
    </div>
  </div>
</template>

<style scoped>
.sm-comparison {
  padding: 1.5rem;
}

.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

/* 双卷轴布局 */
.sm-comp-layout {
  position: absolute;
  inset: 24% 8% 14% 8%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* 左卷轴 — 顶部固定、内容向下展开 */
.sm-scroll-left {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.sm-scroll-top-rod {
  height: 14px;
  width: 90%;
  margin: 0 auto 0;
  border-radius: 7px;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--color-foreground) 18%, transparent),
    color-mix(in srgb, var(--color-foreground) 10%, transparent)
  );
  opacity: 0.3;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.sm-scroll-left-body {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-top: none;
  padding: 1.25rem 1.5rem 2rem;
  border-radius: 0 0 2px 2px;
  box-shadow:
    inset 0 -2px 4px color-mix(in srgb, var(--color-ink-wash) 20%, transparent),
    0 2px 10px rgba(0,0,0,0.04);
  clip-path: polygon(
    0% 0%, 100% 0%, 99% 2%, 100% 100%, 98% 99%, 2% 100%, 0% 99%, 1% 2%
  );
}

/* 右卷轴 — 底部固定、内容向上展开 */
.sm-scroll-right {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.sm-scroll-right-body {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-bottom: none;
  padding: 2rem 1.5rem 1.25rem;
  border-radius: 2px 2px 0 0;
  box-shadow:
    inset 0 2px 4px color-mix(in srgb, var(--color-ink-wash) 20%, transparent),
    0 2px 10px rgba(0,0,0,0.04);
  clip-path: polygon(
    1% 2%, 99% 0%, 100% 2%, 100% 100%, 2% 100%, 0% 98%, 0% 0%
  );
}

.sm-scroll-bottom-rod {
  height: 14px;
  width: 90%;
  margin: 0 auto;
  border-radius: 7px;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--color-foreground) 10%, transparent),
    color-mix(in srgb, var(--color-foreground) 18%, transparent)
  );
  opacity: 0.3;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

/* 对比头部 */
.sm-comp-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-ink-wash);
}

/* VS 印章 */
.sm-comp-vs {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 70%;
  justify-content: center;
}

.sm-comp-vs-seal {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-seal);
  color: var(--color-seal);
  font-weight: 700;
  font-size: 0.85rem;
  font-family: 'KaiTi', 'STKaiti', serif;
  background: var(--color-card);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transform: rotate(-3deg);
  letter-spacing: 0.1em;
  z-index: 2;
}

.sm-comp-vs-line {
  width: 1px;
  flex: 1;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--color-seal) 15%, transparent),
    color-mix(in srgb, var(--color-ink-light) 10%, transparent),
    color-mix(in srgb, var(--color-seal) 15%, transparent)
  );
  opacity: 0.3;
  margin-top: 0.5rem;
}

/* 条目样式 */
.sm-comp-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sm-comp-item-left,
.sm-comp-item-right {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: var(--fs-body-sm);
  color: var(--color-foreground);
  padding: 0.4rem 0;
  line-height: 1.6;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.sm-comp-marker {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 3px;
  font-family: 'KaiTi', 'STKaiti', serif;
  transform: rotate(-3deg);
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
}
</style>
