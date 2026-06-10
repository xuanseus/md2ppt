<script setup lang="ts">
import type { Slide } from '../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-content pt-12">
    <div v-html="slide.html" class="w-full max-w-4xl mx-auto px-8" />
  </div>
</template>
