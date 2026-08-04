<script setup lang="ts">
import type { Slide } from '../../../types/slides'
defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="root">
    <div class="wrap">
      <h3 v-if="slide.title" class="title">{{ slide.title }}</h3>
      <div class="card glass">
        <div v-html="slide.html" class="prose" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:3rem; }
.wrap { max-width:48rem; width:100%; }
.title { font-size:var(--fs-h2); font-weight:700; text-align:center; margin-bottom:2rem; }
.card { padding:2.5rem 3rem; border-radius:1.25rem; background:color-mix(in srgb,var(--color-muted) 20%,transparent); border:1px solid color-mix(in srgb,var(--color-border) 30%,transparent); backdrop-filter:blur(12px); }
.prose :deep(p) { font-size:var(--fs-body); color:var(--color-muted-foreground); line-height:1.8; }
.prose :deep(ul) { list-style:none; padding:0; }
.prose :deep(li) { font-size:var(--fs-body-sm); padding:0.4rem 0; color:var(--color-muted-foreground); }
.prose :deep(li::before) { content:'▸ '; color:var(--color-accent); }
</style>
