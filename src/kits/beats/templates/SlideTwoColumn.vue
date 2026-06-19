<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import GradientText from '../../../components/text-effects/GradientText.vue'
import FadeContent from '../../../components/transitions/FadeContent.vue'

const props = defineProps<{ slide: Slide }>()

// 从当前主题 CSS 变量读取实际色值
function readCSSColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

const gradientColors = ref<string[]>(['#42D392', '#647EFF', '#42D392'])

function syncColors() {
  const accent = readCSSColor('--color-accent') || '#42D392'
  const h1To = readCSSColor('--color-h1-to') || '#647EFF'
  gradientColors.value = [accent, h1To, accent]
}

let observer: MutationObserver | null = null

onMounted(() => {
  syncColors()
  observer = new MutationObserver(syncColors)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
})

onUnmounted(() => {
  observer?.disconnect()
})

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

  // 按 **粗体标题** 拆分
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
  <div class="slide-twocol relative flex flex-col items-center justify-center overflow-hidden h-full">
    <!-- 装饰光晕 -->
    <div class="orb w-[350px] h-[350px] bg-accent/8 top-10 left-10" style="animation-delay: -4s" />
    <div class="orb w-[300px] h-[300px] bg-[var(--color-h1-to)]/6 bottom-10 right-10" style="animation-delay: -8s" />

    <!-- 内容 -->
    <div class="relative z-10 w-full max-w-6xl px-10">
      <!-- 居中大标题用 GradientText -->
      <FadeContent :blur="true" :duration="800">
        <GradientText
          class="!rounded-none !bg-transparent !p-0 text-3xl md:text-4xl font-bold text-center mb-3 tracking-tight"
          :colors="gradientColors"
          :animation-speed="6"
        >
          {{ slide.title || 'Two Column' }}
        </GradientText>
      </FadeContent>

      <!-- 渐变装饰线 -->
      <div class="accent-line w-20 mx-auto mb-6 slide-animate" />

      <!-- 列前副标题 -->
      <div v-if="parsed.subtitle" class="twocol-subtitle mb-8 text-center max-w-xl mx-auto slide-animate" v-html="parsed.subtitle"></div>

      <!-- 两列内容 -->
      <div class="grid grid-cols-2 gap-8">
        <FadeContent
          v-for="(col, i) in parsed.columns"
          :key="i"
          :blur="true"
          :duration="600"
          :delay="200 + i * 200"
        >
          <div class="glass p-8 relative overflow-hidden">
            <div
              class="absolute top-0 left-6 right-6 h-[2px] rounded-full"
              :class="i === 0
                ? 'bg-gradient-to-r from-accent/40 to-transparent'
                : 'bg-gradient-to-r from-[var(--color-h1-to)]/40 to-transparent'"
            />
            <h4 class="text-xl font-bold mb-4 pb-2 border-b-2 border-accent/30">{{ col.title }}</h4>
            <div v-html="col.html" class="prose-two-col" />
          </div>
        </FadeContent>
      </div>

      <!-- 列尾文字 -->
      <div v-if="parsed.afterText" class="twocol-after mt-6 text-center max-w-xl mx-auto" v-html="parsed.afterText"></div>
    </div>
  </div>
</template>

<style scoped>
.slide-twocol {
  padding: 2.5rem 3rem;  /* 旧 3rem 4rem */
}

.prose-two-col :deep(p) {
  font-size: var(--fs-body-sm);
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.prose-two-col :deep(ul),
.prose-two-col :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.prose-two-col :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.prose-two-col :deep(li)::marker {
  color: var(--color-accent);
}

.prose-two-col :deep(strong) {
  font-weight: 700;
  color: var(--color-accent);
}

/* 列标题跟随缩放 */
.prose-two-col :deep(h4),
.slide-twocol :deep(h4) {
  font-size: var(--fs-h4);
}

.twocol-subtitle :deep(img),
.twocol-after :deep(img) {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 0.75rem;
  margin: 0 auto 1rem;
}

.twocol-after :deep(p) {
  font-size: var(--fs-caption);
  color: var(--color-muted-foreground);
}
</style>
