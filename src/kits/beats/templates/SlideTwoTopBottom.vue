<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import GradientText from '../../../components/text-effects/GradientText.vue'
import FadeContent from '../../../components/transitions/FadeContent.vue'

const props = defineProps<{ slide: Slide }>()

function readCSSColor(v: string) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#42D392' }
const gradientColors = ref<string[]>(['#42D392', '#647EFF', '#42D392'])
function sync() { const a = readCSSColor('--color-accent'), b = readCSSColor('--color-h1-to') || '#647EFF'; gradientColors.value = [a, b, a] }
let o: MutationObserver | null = null
onMounted(() => { sync(); o = new MutationObserver(sync); o.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] }) })
onUnmounted(() => o?.disconnect())

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
  <div class="root">
    <div class="wrap">
      <FadeContent :blur="true" :duration="800">
        <GradientText class="!rounded-none !bg-transparent !p-0 text-3xl md:text-4xl font-bold text-center mb-3 tracking-tight" :colors="gradientColors" :animation-speed="6">
          {{ slide.title || 'Two Column' }}
        </GradientText>
      </FadeContent>
      <div class="accent-line w-20 mx-auto mb-6 slide-animate" />
      <div v-if="parsed.subtitle" class="sub mb-6 text-center max-w-xl mx-auto" v-html="parsed.subtitle" />
      <div class="stack">
        <FadeContent v-for="(col, i) in parsed.columns" :key="i" :blur="true" :duration="600" :delay="200 + i * 200">
          <div class="col glass">
            <div class="col-top" :class="i === 0 ? 'bg-gradient-to-r from-accent/40 to-transparent' : 'bg-gradient-to-r from-[var(--color-h1-to)]/40 to-transparent'" />
            <h4 class="col-title">{{ col.title }}</h4>
            <div v-html="col.html" class="col-body" />
          </div>
        </FadeContent>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:2.5rem 2rem; }
.wrap { width:100%; max-width:min(calc(60rem * var(--content-scale)),calc(100% - 8rem),100%); }
.accent-line { height:2px; background:linear-gradient(90deg,transparent,var(--color-accent),transparent); }
.sub :deep(p) { font-size:var(--fs-body-sm); color:var(--color-muted-foreground); text-align:center; }
.stack { display:flex; flex-direction:column; gap:1.5rem; }
.col { position:relative; overflow:hidden; padding:2rem; border-radius:0.75rem; }
.col-top { position:absolute; top:0; left:1.5rem; right:1.5rem; height:2px; border-radius:9999px; }
.col-title { font-size:var(--fs-h4); font-weight:700; margin-bottom:0.75rem; padding-bottom:0.5rem; border-bottom:2px solid color-mix(in srgb,var(--color-accent) 30%,transparent); }
.col-body :deep(p) { font-size:var(--fs-body-sm); line-height:1.7; margin-bottom:0.5rem; color:var(--color-muted-foreground); }
.col-body :deep(ul), .col-body :deep(ol) { padding-left:1.25rem; margin-bottom:0.5rem; }
.col-body :deep(li) { margin-bottom:0.4rem; line-height:1.6; font-size:var(--fs-body-sm); color:var(--color-muted-foreground); }
.col-body :deep(li::marker) { color:var(--color-accent); }
</style>
