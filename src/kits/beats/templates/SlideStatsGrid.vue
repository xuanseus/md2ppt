<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import Grainient from '../../../components/backgrounds/Grainient.vue'

const props = defineProps<{ slide: Slide }>()

function readCSSColor(v: string) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#000' }
const tc = ref({ bg:'#fff',accent:'#42D392',h1To:'#647EFF' })
function sync() { tc.value = { bg:readCSSColor('--color-background'), accent:readCSSColor('--color-accent'), h1To:readCSSColor('--color-h1-to') } }
let o: MutationObserver|null=null
onMounted(()=>{ sync(); o=new MutationObserver(sync); o.observe(document.documentElement,{attributes:true,attributeFilter:['class','style']}) })
onUnmounted(()=>o?.disconnect())

const cols = computed(() => parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i)||[])[1]||'3'))

import { marked } from 'marked'
const cards = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
    const [num, desc] = line.split('|||')
    return { html: marked.parse((desc ? num + '\n' + desc : num).trim()) as string }
  })
})
</script>

<template>
  <div class="root">
    <Grainient :color1="tc.bg" :color2="tc.accent" :color3="tc.h1To" :time-speed="0.25" :color-balance="0" :warp-strength="1" :warp-frequency="5" :warp-speed="2" :warp-amplitude="50" :blend-angle="0" :blend-softness="0.05" :rotation-amount="500" :noise-scale="2" :grain-amount="0.1" :grain-scale="2" :grain-animated="true" :contrast="1.5" :gamma="1" :saturation="1" :center-x="0" :center-y="0" :zoom="0.9" />
    <div class="content" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="(card, i) in cards" :key="i" class="stat-card" :style="{ animationDelay: `${0.1+i*0.1}s` }" v-html="card.html" />
    </div>
    <div v-if="!cards.length" v-html="slide.html" class="prose-fallback" />
  </div>
</template>

<style scoped>
.root { position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; width:100%; height:100%; }
.content { position:relative; z-index:10; display:grid; gap:2rem; max-width:min(calc(60rem * var(--content-scale)),calc(100% - 8rem),100%); width:100%; padding:2.5rem 2rem; }
.stat-card { display:flex; flex-direction:column; align-items:center; text-align:center; padding:2rem; background:color-mix(in srgb,var(--color-muted) 20%,transparent); border:1px solid color-mix(in srgb,var(--color-border) 30%,transparent); border-radius:1rem; backdrop-filter:blur(10px); animation:card-in 0.6s ease both; }
.stat-card :deep(strong) { display:block; font-size:calc(3.5rem * var(--content-scale)); font-weight:800; line-height:1; background:linear-gradient(135deg,var(--color-accent),var(--color-h1-to,#647EFF)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:0.75rem; animation:count-pulse 2s ease-out; }
.stat-card :deep(p) { font-size:var(--fs-body-sm); color:var(--color-muted-foreground); margin:0; }
.prose-fallback { position:relative; z-index:10; max-width:min(calc(var(--content-max) * var(--content-scale)),100%); text-align:center; }
.prose-fallback :deep(h4) { font-size:var(--fs-body-sm); color:var(--color-muted-foreground); margin-bottom:2rem; }
.prose-fallback :deep(strong) { font-size:var(--fs-stat); background:linear-gradient(135deg,var(--color-accent),var(--color-h1-to)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
@keyframes card-in { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
@keyframes count-pulse { 0%{transform:scale(0.5);opacity:0} 50%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
</style>
