<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import { Card } from 'animal-island-vue'

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

  // 按 **粗体标题** 拆分列
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
  <!-- ═══════════════════════════════════════════
      Animal Island 特殊两列布局：
      左侧：竖排标题 + 副标题
      右侧：两列横向卡片
     ═══════════════════════════════════════════ -->
  <div class="ai-twocol flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <!-- 装饰色块 -->
    <div class="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-[0.03]" style="background: linear-gradient(225deg, transparent 60%, var(--color-accent) 100%)" />

    <div class="relative z-10 w-full max-w-7xl px-10 flex gap-10 items-start">
      <!-- ═══ 左侧：标题区 ═══ -->
      <div class="flex-shrink-0 w-[280px] pt-4">
        <!-- 装饰小圆点 -->
        <div class="flex items-center gap-2 mb-6">
          <span class="w-3 h-3 rounded-full" style="background: var(--color-accent)" />
          <span class="w-2 h-2 rounded-full opacity-50" style="background: var(--color-accent)" />
          <span class="w-1.5 h-1.5 rounded-full opacity-30" style="background: var(--color-accent)" />
        </div>

        <h2 class="ai-h2" style="font-size: var(--fs-h2); font-weight: 700; line-height: 1.2; color: var(--color-heading); margin-bottom: 1rem">
          {{ slide.title || 'Two Column' }}
        </h2>

        <!-- 左侧分隔线 -->
        <div class="w-16 h-1 rounded-full mb-4" style="background: linear-gradient(90deg, var(--color-accent), transparent)" />

        <!-- 副标题/说明文字 -->
        <div v-if="parsed.subtitle" class="ai-twocol-subtitle" v-html="parsed.subtitle"></div>
      </div>

      <!-- ═══ 右侧：两列横向卡片 ═══ -->
      <div class="flex-1 grid grid-cols-2 gap-6">
        <Card
          v-for="(col, i) in parsed.columns"
          :key="i"
          type="filled"
          color="white"
          class="ai-col-card"
          :style="{
            borderRadius: 'var(--animal-border-radius-base, 18px)',
            border: '2px solid ' + 'var(--color-border)',
            boxShadow: '0 3px 12px rgba(61, 52, 40, 0.08)',
            padding: '1.25rem 1.5rem',
          }"
        >
          <!-- 列标题 -->
          <div class="flex items-center gap-2 pb-3" style="border-bottom: 2px solid color-mix(in srgb, var(--color-accent) 30%, transparent)">
            <span class="text-lg">{{ i === 0 ? '🌱' : '🌿' }}</span>
            <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading)">{{ col.title }}</h4>
          </div>
          <div v-html="col.html" class="ai-twocol-prose mt-3" />
        </Card>
      </div>
    </div>

    <!-- 列尾文字 -->
    <div v-if="parsed.afterText" class="absolute bottom-10 left-1/2 -translate-x-1/2 text-center" v-html="parsed.afterText"></div>
  </div>
</template>

<style scoped>
.ai-twocol {
  padding: 2.5rem 3rem;
}

.ai-col-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ai-col-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 52, 40, 0.12) !important;
}

.ai-twocol-prose :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.75rem;
  color: var(--color-foreground);
}

.ai-twocol-prose :deep(ul),
.ai-twocol-prose :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.ai-twocol-prose :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  font-size: var(--fs-body-sm);
}

.ai-twocol-prose :deep(li)::marker {
  color: var(--color-accent);
}

.ai-twocol-prose :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}

.ai-twocol-subtitle :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  line-height: 1.6;
  font-family: var(--animal-font-family, inherit);
}

.ai-twocol-subtitle :deep(img),
.ai-twocol-after :deep(img) {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 1rem;
  margin: 0 auto 1rem;
}
</style>
