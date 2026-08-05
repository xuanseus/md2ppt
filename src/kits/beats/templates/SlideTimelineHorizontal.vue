<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import FadeContent from '../../../components/transitions/FadeContent.vue'

const props = defineProps<{ slide: Slide }>()
interface TLI { date:string; content:string }
const entries = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const r: TLI[] = []
  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/,'').match(/^\s*-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/)
    if (m) r.push({ date:m[1], content:m[2] })
  }
  return r
})
const subtitle = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const before: string[] = []
  for (const line of body.split('\n')) { const t=line.trim(); if(t&&!t.startsWith('-')) before.push(t); else break }
  return before.length?marked.parse(before.join('\n')) as string:''
})
</script>

<template>
  <div class="root">
    <div class="wrap">
      <h3 v-if="slide.title" class="title">{{ slide.title }}</h3>
      <div v-if="subtitle" class="subtitle mb-8" v-html="subtitle" />
      <div v-if="entries.length" class="timeline">
        <div class="track" />
        <div class="nodes">
          <FadeContent v-for="(e,i) in entries" :key="i" :blur="true" :duration="600" :delay="200+i*150" class="node">
            <div class="dot" />
            <div class="date">{{ e.date }}</div>
            <div class="content">{{ e.content }}</div>
          </FadeContent>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:2.5rem 2rem; }
.wrap { display:flex; flex-direction:column; align-items:center; max-width:min(calc(var(--content-max) * var(--content-scale)),100%); width:fit-content; }
.title { font-size:var(--fs-h3); font-weight:600; text-align:center; }
.subtitle :deep(p) { font-size:var(--fs-body-sm); color:var(--color-muted-foreground); text-align:center; }
.timeline { position:relative; width:100%; padding:3rem 0 1rem; }
.track { position:absolute; top:3.5rem; left:5%; right:5%; height:2px; background:linear-gradient(90deg,transparent,var(--color-accent),transparent); opacity:0.4; }
.nodes { display:flex; justify-content:center; gap:4rem; position:relative; z-index:1; }
.node { display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.75rem; flex:0 0 10rem; max-width:10rem; }
.dot { width:1rem; height:1rem; border-radius:9999px; background:var(--color-accent); box-shadow:0 0 0 4px color-mix(in srgb,var(--color-accent) 20%,transparent); margin-bottom:0.5rem; }
.date { font-size:var(--fs-caption); font-weight:700; color:var(--color-accent); }
.content { font-size:var(--fs-small); color:var(--color-muted-foreground); line-height:1.5; }
</style>
