<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import FadeContent from '../../../components/transitions/FadeContent.vue'

const props = defineProps<{ slide: Slide }>()
const parsed = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const items: string[] = []; const before: string[] = []
  let hit = false
  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/,'').match(/^\s*-\s+(.+)$/)
    if (m) { hit=true; items.push(m[1]) }
    else { const t=line.trim(); if(t&&!hit) before.push(t) }
  }
  return { subtitle: before.length?marked.parse(before.join('\n')) as string:'', items }
})
</script>

<template>
  <div class="root">
    <div class="wrap">
      <h3 v-if="slide.title" class="title">{{ slide.title }}</h3>
      <div v-if="parsed.subtitle" class="subtitle mb-6" v-html="parsed.subtitle" />
      <div v-if="parsed.items.length" class="list">
        <FadeContent v-for="(item,i) in parsed.items" :key="i" :blur="true" :duration="500" :delay="150+i*120" class="item">
          <span class="num">{{ String(i+1).padStart(2,'0') }}</span>
          <span class="text" v-html="(marked.parseInline(item) as string)" />
        </FadeContent>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:2.5rem 2rem; }
.wrap { display:flex; flex-direction:column; align-items:center; max-width:min(calc(var(--content-max) * var(--content-scale)),100%); width:fit-content; min-width:min(calc(44rem * var(--content-scale)),100%); }
.title { font-size:var(--fs-h3); font-weight:600; text-align:center; margin-bottom:1.25rem; }
.subtitle :deep(p) { font-size:var(--fs-body-sm); color:var(--color-muted-foreground); text-align:center; }
.list { display:flex; flex-direction:column; gap:1rem; }
.item { display:flex; align-items:center; gap:1.5rem; padding:1.25rem 2.5rem; background:color-mix(in srgb,var(--color-muted) 30%,transparent); border:1px solid color-mix(in srgb,var(--color-border) 40%,transparent); border-radius:0.75rem; }
.num { flex-shrink:0; font-size:1.5rem; font-weight:800; color:var(--color-accent); opacity:0.3; min-width:2.5rem; text-align:right; }
.text { font-size:var(--fs-body-sm); color:var(--color-foreground); line-height:1.6; }
</style>
