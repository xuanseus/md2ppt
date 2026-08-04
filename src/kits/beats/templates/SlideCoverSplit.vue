<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import SplitText from '../../../components/text-effects/SplitText.vue'
import FadeContent from '../../../components/transitions/FadeContent.vue'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="layout-root">
    <div class="split-grid">
      <div class="split-left">
        <div class="badge">
          <span class="badge-dot" /> Presentation
        </div>
        <div v-if="slide.title" class="title-wrap">
          <SplitText :text="slide.title" tag="h1" split-type="words" :delay="80" :duration="1" />
        </div>
        <div v-html="slide.html" class="body-html" />
        <div class="accent-line" />
      </div>
      <FadeContent :blur="true" :duration="1000" :delay="300">
        <div class="split-right">
          <div class="deco-box">
            <div class="deco-icon">✦</div>
            <span class="deco-text">2026</span>
          </div>
        </div>
      </FadeContent>
    </div>
  </div>
</template>

<style scoped>
.layout-root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:3rem 4rem; }
.split-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; width:100%; max-width:72rem; }
.split-left { display:flex; flex-direction:column; gap:1.5rem; }
.badge { display:inline-flex; align-items:center; gap:0.5rem; padding:0.5rem 1rem; border-radius:9999px; background:color-mix(in srgb,var(--color-accent) 10%,transparent); border:1px solid color-mix(in srgb,var(--color-accent) 20%,transparent); color:var(--color-accent); font-size:0.75rem; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; }
.badge-dot { width:0.375rem; height:0.375rem; border-radius:9999px; background:var(--color-accent); animation:pulse 2s infinite; }
.title-wrap :deep(h1) { font-size:var(--fs-hero); font-weight:800; line-height:1.1; letter-spacing:-0.02em; color:var(--color-foreground); }
.body-html :deep(p) { font-size:var(--fs-body); color:var(--color-muted-foreground); line-height:1.6; }
.accent-line { width:5rem; height:2px; background:linear-gradient(90deg,var(--color-accent),transparent); }
.split-right { display:flex; align-items:center; justify-content:center; }
.deco-box { width:16rem; height:16rem; border-radius:2rem; background:color-mix(in srgb,var(--color-accent) 8%,transparent); border:1px solid color-mix(in srgb,var(--color-accent) 15%,transparent); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem; backdrop-filter:blur(10px); }
.deco-icon { font-size:4rem; opacity:0.4; }
.deco-text { font-size:var(--fs-h3); font-weight:700; color:var(--color-accent); opacity:0.5; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
</style>
