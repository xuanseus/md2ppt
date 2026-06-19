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
  <div class="sm-twocol w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 不对称双栏布局 — 左栏 60%、右栏 30% 下沉 -->
    <div class="sm-twocol-grid">

      <!-- 左栏 — 主文本（宽，语气如善本正文） -->
      <div class="sm-col-main">
        <!-- 顶部笔触装饰 -->
        <div class="flex items-center gap-2 mb-4 opacity-40">
          <span class="w-2 h-2 rounded-full" style="background: var(--color-seal)" />
          <div class="w-12 h-px" style="background: linear-gradient(90deg, var(--color-foreground), transparent)" />
        </div>

        <h2 v-if="slide.title" class="sm-col-main-title">{{ slide.title || 'Two Column' }}</h2>

        <div v-if="parsed.subtitle" class="sm-twocol-subtitle" v-html="parsed.subtitle" />

        <!-- 主文本列内容 -->
        <div v-if="parsed.columns[0]" class="sm-col-main-body"
          style="border: 1px solid var(--color-border); background: var(--color-card); padding: 1.25rem 1.5rem; border-left: 4px solid var(--color-ink-light);">
          <div class="flex items-center gap-2 pb-2 mb-2 border-b"
            style="border-color: var(--color-ink-wash);">
            <span class="w-3 h-3 rounded-sm rotate-45 opacity-60" style="background: var(--color-seal)" />
            <h4 class="sm-col-title">{{ parsed.columns[0].title }}</h4>
          </div>
          <div v-html="parsed.columns[0].html" class="sm-twocol-prose" />
        </div>

        <!-- 底部装饰线 -->
        <div class="mt-4 flex items-center gap-2 opacity-30">
          <div class="w-8 h-px" style="background: linear-gradient(90deg, transparent, var(--color-foreground))" />
          <span class="w-1.5 h-1.5 rounded-full" style="background: var(--color-ink-light)" />
        </div>
      </div>

      <!-- 右栏 — 注释/副文本（窄，下沉如古籍批注） -->
      <div v-if="parsed.columns[1]" class="sm-col-note">
        <div class="sm-col-note-card"
          style="border: 1px solid var(--color-border); background: var(--color-card); padding: 1rem 1.25rem; border-right: 3px solid var(--color-seal); opacity: 0.9;">
          <div class="flex items-center gap-2 pb-2 mb-2"
            style="border-bottom: 1px dashed var(--color-border);">
            <span class="w-2 h-2 rounded-full opacity-50" style="background: var(--color-ink-light)" />
            <h4 class="sm-col-title" style="font-size: var(--fs-body-sm); color: var(--color-muted-foreground);">{{ parsed.columns[1].title }}</h4>
          </div>
          <div v-html="parsed.columns[1].html" class="sm-twocol-note-prose" />
        </div>

        <!-- 印章装饰 -->
        <div class="mt-3 flex justify-end">
          <span class="w-8 h-8 flex items-center justify-center text-xs select-none"
            style="border: 1px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; transform: rotate(5deg); opacity: 0.4;">
            批
          </span>
        </div>
      </div>
    </div>

    <div v-if="parsed.afterText" class="absolute bottom-8 left-1/2 -translate-x-1/2 sm-twocol-after" v-html="parsed.afterText" />
  </div>
</template>

<style scoped>
.sm-twocol {
  padding: 2rem;
}

.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

.sm-twocol-grid {
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  gap: 2rem;
  height: 100%;
  align-items: start;
  padding: 1rem 2rem;
}

/* 左栏微微偏上 */
.sm-col-main {
  padding-top: 1rem;
}

.sm-col-main-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
  letter-spacing: 0.06em;
}

/* 右栏下沉 20% */
.sm-col-note {
  padding-top: 25%;
  position: relative;
}

.sm-col-note::before {
  content: '';
  position: absolute;
  left: -2rem;
  top: 25%;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, var(--color-ink-light) 30%, var(--color-ink-light) 80%, transparent 100%);
  opacity: 0.15;
}

.sm-col-title {
  font-size: var(--fs-h4);
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
}

.sm-twocol-prose :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.75rem;
  color: var(--color-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.sm-twocol-note-prose :deep(p) {
  font-size: var(--fs-caption);
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: var(--color-muted-foreground);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.sm-twocol-prose :deep(ul),
.sm-twocol-prose :deep(ol),
.sm-twocol-note-prose :deep(ul),
.sm-twocol-note-prose :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.sm-twocol-prose :deep(li),
.sm-twocol-note-prose :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.sm-twocol-prose :deep(li)::marker,
.sm-twocol-note-prose :deep(li)::marker {
  color: var(--color-accent);
}

.sm-twocol-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-heading);
}

.sm-twocol-subtitle :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
}

.sm-twocol-subtitle :deep(img),
.sm-twocol-after :deep(img) {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 2px;
  margin: 0 auto 1rem;
}

.sm-col-main-body {
  clip-path: polygon(
    0% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%
  );
}

.sm-col-note-card {
  border-radius: 0 4px 4px 0;
  clip-path: polygon(
    0% 3%, 97% 0%, 100% 4%, 98% 100%, 2% 97%, 0% 100%
  );
}
</style>
