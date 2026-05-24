<script setup lang="ts">
import type { Slide } from '../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-content flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
    <!-- 装饰边框 -->
    <div class="relative max-w-4xl px-16">
      <!-- 边框装饰 -->
      <div class="absolute inset-0 rounded-2xl border-2 border-primary/30" />
      
      <!-- 内容 -->
      <div v-html="slide.html" class="relative z-10 py-24 px-16 text-center prose-section" />
    </div>
  </div>
</template>

<style scoped>
.prose-section :deep(h2) {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.prose-section :deep(p) {
  font-size: 1.25rem;
  color: hsl(var(--muted-foreground));
  line-height: 1.6;
}
</style>
