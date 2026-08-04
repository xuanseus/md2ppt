<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'
import FadeContent from '../../../components/transitions/FadeContent.vue'

const props = defineProps<{ slide: Slide }>()
const items = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  return body.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s+/, '').trim()).filter(Boolean)
})
</script>

<template>
  <div class="root">
    <div class="wrap">
      <h3 v-if="slide.title" class="title">{{ slide.title }}</h3>
      <div v-if="items.length" class="list">
        <FadeContent v-for="(item,i) in items" :key="i" :blur="true" :duration="400" :delay="100+i*80" class="item">
          <span class="check">✓</span>
          <span class="text" v-html="(marked.parseInline(item) as string)" />
        </FadeContent>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:2.5rem 3rem; }
.wrap { max-width:40rem; width:100%; }
.title { font-size:var(--fs-h3); font-weight:600; text-align:center; margin-bottom:1.5rem; }
.list { display:flex; flex-direction:column; gap:0.75rem; }
.item { display:flex; align-items:center; gap:1rem; padding:0.75rem 1rem; }
.check { flex-shrink:0; width:1.5rem; height:1.5rem; border-radius:9999px; background:rgba(34,197,94,0.15); color:#22c55e; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; }
.text { font-size:var(--fs-body-sm); color:var(--color-muted-foreground); line-height:1.5; }
</style>
