<script setup lang="ts">
import type { Slide } from '../types/slides'
import { useKit } from '../composables/useKit'
import SlideContent from '../kits/beats/templates/SlideContent.vue'
import { ref, onMounted, useTemplateRef } from 'vue'
import { animateEntry } from '../composables/useSlideAnim'

const props = defineProps<{ slide: Slide }>()

const { activeKit } = useKit()

// 优先使用 layout，否则使用 type
const layout = props.slide.layout && props.slide.layout !== 'auto'
  ? props.slide.layout
  : props.slide.type

// 从激活套件的模板映射中获取组件，回退到默认 SlideContent
const componentMap = activeKit.templates

// ── 动画：如果 slide.anim 有值，页面入场时播放动画 ──
const containerRef = useTemplateRef<HTMLDivElement>('container')
onMounted(() => {
  if (props.slide.anim && containerRef.value) {
    animateEntry(containerRef.value, props.slide.anim, { delay: 0.05 })
  }
})
</script>

<template>
  <div ref="container" class="slide-anim-wrapper">
    <component :is="componentMap[layout] || SlideContent" :slide="props.slide" />
  </div>
</template>

<style scoped>
.slide-anim-wrapper { width:100%; height:100%; }
</style>
