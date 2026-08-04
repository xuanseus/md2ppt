<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Slide } from '../../../types/slides'
import StarBorder from '../../../components/cards/StarBorder.vue'
import SplitText from '../../../components/text-effects/SplitText.vue'

const props = defineProps<{ slide: Slide }>()
const num = (props.slide.rawMd.match(/\{num:\s*(\d+)\}/i) || [])[1] || '01'

function readCSSColor(v: string) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#42D392' }
const accentColor = ref('#42D392')
function sync() { accentColor.value = readCSSColor('--color-accent') || '#42D392' }
let o: MutationObserver | null = null
onMounted(() => { sync(); o = new MutationObserver(sync); o.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] }) })
onUnmounted(() => o?.disconnect())
</script>

<template>
  <div class="root">
    <div class="wrap">
      <StarBorder as="div" class="card" :color="accentColor" speed="8s" :thickness="2">
        <span class="num">{{ num }}</span>
        <div v-if="slide.title" class="title-wrap">
          <SplitText :text="slide.title" tag="h2" split-type="words" :delay="60" :duration="0.9" />
        </div>
        <div v-html="slide.html" class="prose" />
        <div class="deco">
          <div class="deco-dot" />
          <div class="deco-line" />
          <div class="deco-dot" />
        </div>
      </StarBorder>
    </div>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:3rem; }
.wrap { max-width:56rem; margin:0 auto; }
.card {
  padding:3rem 4rem; text-align:center; border-radius:1.5rem;
  background:linear-gradient(135deg,color-mix(in srgb,var(--color-muted) 95%,var(--color-accent) 5%),color-mix(in srgb,var(--color-muted) 85%,var(--color-background) 15%));
  border:1px solid color-mix(in srgb,var(--color-border) 50%,transparent);
  box-shadow:0 8px 32px color-mix(in srgb,var(--color-foreground) 6%,transparent);
}
.num { display:block; font-size:7rem; font-weight:900; line-height:1; background:linear-gradient(135deg,var(--color-accent),var(--color-h1-to,#647EFF)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; opacity:0.2; }
.title-wrap :deep(h2) { font-size:var(--fs-section-title); font-weight:700; margin-top:-0.5rem; margin-bottom:0.5rem; line-height:1.2; }
.prose :deep(p) { font-size:var(--fs-body); color:var(--color-muted-foreground); line-height:1.6; }
.deco { display:flex; align-items:center; justify-content:center; gap:0.5rem; margin-top:2rem; }
.deco-dot { width:0.5rem; height:0.5rem; border-radius:9999px; background:color-mix(in srgb,var(--color-accent) 40%,transparent); }
.deco-line { width:2.5rem; height:0.25rem; border-radius:9999px; background:linear-gradient(90deg,var(--color-accent),var(--color-h1-to)); }
</style>
