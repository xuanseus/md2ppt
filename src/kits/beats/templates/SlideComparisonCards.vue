<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import FadeContent from '../../../components/transitions/FadeContent.vue'

const props = defineProps<{ slide: Slide }>()
interface Col { title:string; items:string[]; icon:string; colorClass:string }
const cols = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  const c:Col[]=[]
  for(let i=0;i<Math.min(parts.length,2);i++){
    const p=parts[i].trim(); const tm=p.match(/^\*\*([^*]+)\*\*/m)
    const items = p.split('\n').slice(1).filter(l=>l.trim().startsWith('-')).map(l=>l.replace(/^\s*-\s+/, '').trim())
    c.push({title:tm?tm[1]:'',items,icon:i===0?'✕':'✓',colorClass:i===0?'is-red':'is-green'})
  }
  return c
})
const subtitle = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const fi = body.indexOf('**'); if(fi>0){ const b=body.slice(0,fi).trim(); if(b) return marked.parse(b) as string }
  return ''
})
</script>

<template>
  <div class="root">
    <div class="wrap">
      <h3 v-if="slide.title" class="title">{{ slide.title }}</h3>
      <div v-if="subtitle" class="sub mb-6" v-html="subtitle" />
      <div v-if="cols.length===2" class="grid">
        <FadeContent v-for="(col,ci) in cols" :key="ci" :blur="true" :duration="700" :delay="150+ci*200" :class="['card',col.colorClass]">
          <div class="card-icon">{{ col.icon }}</div>
          <strong class="card-title">{{ col.title }}</strong>
          <ul class="card-list">
            <li v-for="(item,ji) in col.items" :key="ji" v-html="(marked.parseInline(item) as string)" />
          </ul>
        </FadeContent>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:2.5rem 2rem; }
.wrap { max-width:min(calc(var(--content-max) * var(--content-scale)),100%); width:100%; display:flex; flex-direction:column; align-items:center; }
.title { font-size:var(--fs-h3); font-weight:600; text-align:center; margin-bottom:1rem; }
.sub :deep(p) { font-size:var(--fs-body-sm); color:var(--color-muted-foreground); text-align:center; }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:2rem; width:100%; margin-top:1.5rem; }
.card { display:flex; flex-direction:column; align-items:center; padding:2.5rem 2rem; border-radius:1.25rem; background:color-mix(in srgb,var(--color-muted) 20%,transparent); border:2px solid transparent; backdrop-filter:blur(10px); text-align:center; }
.card.is-red { border-color:rgba(248,113,113,0.3); }
.card.is-green { border-color:rgba(52,211,153,0.3); }
.card-icon { font-size:2.5rem; font-weight:900; margin-bottom:1rem; }
.is-red .card-icon { color:#f87171; }
.is-green .card-icon { color:#34d399; }
.card-title { font-size:var(--fs-h3); font-weight:700; margin-bottom:1.25rem; color:var(--color-foreground); }
.card-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.6rem; }
.card-list li { font-size:var(--fs-body-sm); color:var(--color-muted-foreground); line-height:1.6; }
</style>
