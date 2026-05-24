<script setup lang="ts">
import type { Slide } from '../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-content flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
    <div v-html="slide.html" class="max-w-4xl px-16 text-center prose-cover" />
  </div>
</template>

<style scoped>
.prose-cover :deep(h1) {
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: hsl(var(--foreground));
}

.prose-cover :deep(p) {
  font-size: 1.5rem;
  color: hsl(var(--muted-foreground));
  line-height: 1.6;
  margin-top: 0;
}
</style>
