<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-code flex flex-col items-center justify-center w-full h-full" style="background: var(--color-background)">
    <div class="w-full max-w-5xl px-10">
      <div v-html="slide.html" class="ai-code-prose" />
    </div>
  </div>
</template>

<style scoped>
.ai-code {
  padding: 2.5rem 3rem;
}

.ai-code-prose :deep(h1),
.ai-code-prose :deep(h2),
.ai-code-prose :deep(h3),
.ai-code-prose :deep(h4) {
  font-size: var(--fs-h3);
  font-weight: 700;
  color: var(--color-heading);
  font-family: var(--animal-font-family, inherit);
  text-align: center;
  margin-bottom: 1.5rem;
}

.ai-code-prose :deep(.code-block-wrapper) { width: 100%; }

.ai-code-prose :deep(pre) {
  overflow-x: auto;
  margin: 0.5rem 0;
}

.ai-code-prose :deep(code) {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: var(--fs-caption);
  line-height: 1.6;
}

.ai-code-prose :deep(p) {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  font-family: var(--animal-font-family, inherit);
  margin-top: 1rem;
}
</style>
