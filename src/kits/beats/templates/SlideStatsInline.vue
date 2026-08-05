<script setup lang="ts">
import type { Slide } from '../../../types/slides'
defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="root">
    <div class="wrap">
      <h3 v-if="slide.title" class="title">{{ slide.title }}</h3>
      <div v-html="slide.html" class="prose" />
    </div>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:2.5rem 2rem; }
.wrap { max-width:min(calc(var(--content-max) * var(--content-scale)),100%); width:100%; }
.title { font-size:var(--fs-h3); font-weight:600; text-align:center; margin-bottom:2rem; }
.prose :deep(p) { font-size:var(--fs-body); color:var(--color-muted-foreground); line-height:1.8; text-align:center; }
.prose :deep(strong) { font-size:calc(2.5rem * var(--content-scale)); font-weight:800; background:linear-gradient(135deg,var(--color-accent),var(--color-h1-to,#647EFF)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:count-pulse 2s ease-out; display:inline-block; margin:0 0.25rem; }
@keyframes count-pulse { 0%{transform:scale(0.5);opacity:0} 50%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
</style>
