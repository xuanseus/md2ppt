<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import FadeContent from '../../../components/transitions/FadeContent.vue'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="root">
    <FadeContent :blur="true" :duration="1000">
      <div class="wrap">
        <div class="deco">"</div>
        <div v-html="slide.html" class="prose" />
        <div class="deco bottom">"</div>
      </div>
    </FadeContent>
  </div>
</template>

<style scoped>
.root { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:4rem; }
.wrap { position:relative; max-width:40rem; text-align:center; }
.deco { font-size:12rem; line-height:1; font-family:serif; color:color-mix(in srgb,var(--color-accent) 6%,transparent); user-select:none; pointer-events:none; }
.deco.bottom { transform:rotate(180deg); }
.prose :deep(blockquote), .prose :deep(p) { font-size:var(--fs-quote,2rem); font-weight:300; line-height:1.5; color:var(--color-muted-foreground); font-style:italic; margin:1rem 0; }
</style>
