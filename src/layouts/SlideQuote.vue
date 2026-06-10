<script setup lang="ts">
import type { Slide } from '../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-content relative flex items-center justify-center bg-gradient-to-br from-muted/30 to-background">
    <!-- 装饰引号 -->
    <div class="absolute top-20 left-20 text-9xl text-primary/10 font-serif">"</div>
    <div class="absolute bottom-20 right-20 text-9xl text-primary/10 font-serif">"</div>
    
    <!-- 引用内容 -->
    <div class="relative z-10 max-w-4xl px-16">
      <div v-html="slide.html" class="prose-quote" />
    </div>
  </div>
</template>

<style scoped>
.prose-quote :deep(h3) {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: hsl(var(--muted-foreground));
}

.prose-quote :deep(blockquote),
.prose-quote :deep(p) {
  font-size: 2.25rem;
  font-weight: 300;
  line-height: 1.625;
  text-align: center;
  font-style: italic;
  border: none;
  margin: 0;
}
</style>
