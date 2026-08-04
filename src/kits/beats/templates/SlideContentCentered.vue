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
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:3rem; }
.wrap { max-width:56rem; width:100%; text-align:center; }
.title { font-size:var(--fs-h2); font-weight:700; margin-bottom:2rem; }
.prose :deep(h1), .prose :deep(h2) { font-size:var(--fs-h2); font-weight:700; margin-bottom:1.5rem; }
.prose :deep(h3), .prose :deep(h4) { font-size:var(--fs-h3); font-weight:500; color:var(--color-muted-foreground); margin-bottom:1rem; }
.prose :deep(p) { font-size:var(--fs-body); line-height:1.8; color:var(--color-muted-foreground); margin-bottom:1rem; }
.prose :deep(ul) { list-style:none; padding:0; }
.prose :deep(li) { font-size:var(--fs-body-sm); color:var(--color-muted-foreground); padding:0.5rem 0; }
.prose :deep(li::before) { content:'— '; color:var(--color-accent); }
</style>
