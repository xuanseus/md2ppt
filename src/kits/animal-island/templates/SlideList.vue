<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { Card } from 'animal-island-vue'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="ai-list flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <div class="w-full max-w-4xl px-10">
      <div v-if="slide.title" class="text-center mb-6">
        <h2 style="font-size: var(--fs-h2); font-weight: 700; color: var(--color-heading); font-family: var(--animal-font-family, inherit)">
          {{ slide.title }}
        </h2>
        <div class="w-16 h-0.5 rounded-full mx-auto mt-3" style="background: var(--color-accent)" />
      </div>
      <Card
        type="filled"
        color="white"
        :style="{
          borderRadius: 'var(--animal-border-radius-lg, 24px)',
          border: '2px solid var(--color-border)',
          boxShadow: '0 3px 12px rgba(61, 52, 40, 0.06)',
          padding: '2rem 3rem',
        }"
      >
        <div v-html="slide.html" class="ai-list-prose" />
      </Card>
    </div>
  </div>
</template>

<style scoped>
.ai-list {
  padding: 2.5rem 3rem;
}

.ai-list-prose :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ai-list-prose :deep(li) {
  font-size: var(--fs-body);
  line-height: 1.8;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: var(--animal-border-radius-base, 18px);
  background: color-mix(in srgb, var(--color-accent) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.ai-list-prose :deep(li:hover) {
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.ai-list-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
}
</style>
