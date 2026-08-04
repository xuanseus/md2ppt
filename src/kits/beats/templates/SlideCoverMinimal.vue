<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import SplitText from '../../../components/text-effects/SplitText.vue'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="root">
    <div class="wrap">
      <div class="badge slide-animate">
        <span class="badge-dot" />
        Thank You
      </div>
      <div v-if="slide.title" class="title-wrap">
        <SplitText :text="slide.title" tag="h1" split-type="words" :delay="60" :duration="1" />
      </div>
      <div v-html="slide.html" class="prose" />
      <div class="accent-line w-32 mx-auto mt-10 slide-animate" />
      <div class="deco-row">
        <div class="deco-dot" />
        <div class="deco-line" />
        <div class="deco-dot" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:4rem; }
.wrap { max-width:72rem; text-align:center; }
.badge { display:inline-flex; align-items:center; gap:0.5rem; padding:0.4rem 1rem; border-radius:9999px; background:color-mix(in srgb,var(--color-accent) 10%,transparent); border:1px solid color-mix(in srgb,var(--color-accent) 20%,transparent); color:var(--color-accent); font-size:0.75rem; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:2rem; }
.badge-dot { width:0.375rem; height:0.375rem; border-radius:9999px; background:var(--color-accent); animation:pulse 2s infinite; }
.title-wrap :deep(h1) { font-size:var(--fs-hero); font-weight:800; line-height:1.1; letter-spacing:-0.02em; color:var(--color-foreground); margin-bottom:0; }
.prose :deep(p) { font-size:var(--fs-body); color:var(--color-muted-foreground); line-height:1.6; margin-top:1.5rem; }
.accent-line { height:2px; background:linear-gradient(90deg,transparent,var(--color-accent),transparent); }
.deco-row { display:flex; align-items:center; justify-content:center; gap:0.5rem; margin-top:0.75rem; }
.deco-dot { width:0.5rem; height:0.5rem; border-radius:9999px; background:color-mix(in srgb,var(--color-accent) 30%,transparent); }
.deco-line { width:3rem; height:0.25rem; border-radius:9999px; background:linear-gradient(90deg,var(--color-accent),transparent); }
@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
</style>
