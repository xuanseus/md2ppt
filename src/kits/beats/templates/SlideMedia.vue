<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="w-full h-full bg-black flex items-center justify-center overflow-hidden">
    <div v-html="slide.html" class="w-full h-full relative z-50 [&_video]:w-full [&_video]:h-full [&_video]:object-contain" />
  </div>
</template>
