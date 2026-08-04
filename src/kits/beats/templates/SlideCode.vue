<script lang="ts" setup>
import type {Slide} from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="slide-code-wrapper relative overflow-hidden">
    <!-- 装饰光晕 -->
    <div class="orb w-[300px] h-[300px] bg-accent/6 top-10 left-10" style="animation-delay: -5s"/>

    <!-- 代码内容 -->
    <div
        class="relative z-10 slide-code-container h-full flex flex-col items-center justify-center px-12 py-12 slide-animate">
      <div v-if="slide.title" class="code-title mb-6">
        <h4 class="text-2xl font-bold">{{ slide.title }}</h4>
      </div>

      <div class="w-full max-w-5xl prose-code" v-html="slide.html"/>
    </div>
  </div>
</template>

<style>
/* prose-code 作为 flex 列容器，gap 统一子元素上下间距 */
.slide-code-wrapper .prose-code {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slide-code-wrapper .prose-code p {
  font-size: var(--fs-body-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  line-height: 1.6;
}

/* blockquote 内部：第一段无上边距，后续段落有间距 */
.slide-code-wrapper .prose-code blockquote p:first-child {
  margin-top: 0;
}

.slide-code-wrapper .prose-code blockquote p + p {
  margin-top: 0.75rem;
}
</style>

<style scoped>
.slide-code-wrapper {
  width: 100%;
  height: 100%;
}

.slide-code-container > div {
  padding-left: 0;
  padding-right: 0;
}

.code-title {
  text-align: center;
  color: var(--color-accent);
}

.code-title h4 {
  margin: 0;
  font-size: var(--fs-h4);
}

.prose-code :deep(.code-block-wrapper) {
  margin: 0 auto;
  width: 100%;
}

</style>
