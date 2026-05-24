<script lang="ts" setup>
import type {Slide} from '../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div
      class="slide-content relative flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
    <!-- 装饰背景 -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"/>
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 max-w-4xl px-16 text-center">
      <div class="prose-stats" v-html="slide.html"/>
    </div>
  </div>
</template>

<style scoped>
.prose-stats :deep(h4) {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: hsl(var(--muted-foreground));
}

.prose-stats :deep(strong) {
  display: block;
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
}

.prose-stats :deep(p) {
  font-size: 1.25rem;
  color: hsl(var(--muted-foreground));
}
</style>
