<script setup lang="ts">
import type { Slide } from '../types/slides'
import { useKit } from '../composables/useKit'
import SlideContent from '../kits/beats/templates/SlideContent.vue'

const props = defineProps<{ slide: Slide }>()

const { activeKit } = useKit()

// 优先使用 layout，否则使用 type
const layout = props.slide.layout && props.slide.layout !== 'auto'
  ? props.slide.layout
  : props.slide.type

// 从激活套件的模板映射中获取组件，回退到默认 SlideContent
const componentMap = activeKit.templates
</script>

<template>
  <component :is="componentMap[layout] || SlideContent" :slide="props.slide" />
</template>
