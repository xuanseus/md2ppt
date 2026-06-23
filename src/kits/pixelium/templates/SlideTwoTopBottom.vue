<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Column { title: string; html: string }
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
  <div class="px-two-ttb flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <div class="relative z-10 w-full max-w-4xl px-8">
      <h3 class="px-ttb-title text-center">{{ slide.title || 'Two Column' }}</h3>

      <!-- 像素装饰线 -->
      <div class="flex justify-center mb-6">
        <div style="width: 80px; height: 4px; background: var(--color-accent); box-shadow: 16px 0 0 var(--color-accent)" />
      </div>

      <div v-if="parsed.subtitle" class="px-ttb-sub mb-6 text-center" v-html="parsed.subtitle" />

      <div class="flex flex-col gap-6">
        <div v-for="(col, i) in parsed.columns" :key="i" style="background: var(--color-card); border: 2px solid var(--color-border); box-shadow: 4px 4px 0 #0006; padding: 1.5rem 2rem; position: relative;">
          <!-- 顶部色条 -->
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--color-accent);" />
          <h4 class="px-ttb-col-title">{{ col.title }}</h4>
          <div v-html="col.html" class="px-ttb-col-body" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-ttb-title {
  font-size: calc(2.5rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  font-family: var(--px-font);
  text-shadow: 2px 2px 0 #0004;
}

.px-ttb-sub :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: var(--px-font);
}

.px-ttb-col-title {
  font-size: calc(1.2rem * var(--content-scale));
  font-weight: 700;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px dashed var(--color-border);
  color: var(--color-heading);
  font-family: var(--px-font);
}

.px-ttb-col-body :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.5rem;
  color: var(--color-muted-foreground);
}

.px-ttb-col-body :deep(ul),
.px-ttb-col-body :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}

.px-ttb-col-body :deep(li) {
  margin-bottom: 0.4rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
}

.px-ttb-col-body :deep(li::marker) {
  color: var(--color-accent);
}
</style>
