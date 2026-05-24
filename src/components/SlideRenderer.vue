<script setup lang="ts">
import type { Slide } from '../types/slides'
import SlideCover from './SlideCover.vue'
import SlideSection from './SlideSection.vue'
import SlideCode from './SlideCode.vue'
import SlideMedia from './SlideMedia.vue'
import SlideContent from './SlideContent.vue'
import SlideTwoColumn from './SlideTwoColumn.vue'
import SlideStats from './SlideStats.vue'
import SlideQuote from './SlideQuote.vue'

const props = defineProps<{ slide: Slide }>()

// 优先使用 layout，否则使用 type
const layout = props.slide.layout && props.slide.layout !== 'auto' 
  ? props.slide.layout 
  : props.slide.type

const componentMap: Record<string, any> = {
  cover: SlideCover,
  section: SlideSection,
  code: SlideCode,
  'code-full': SlideCode,
  media: SlideMedia,
  'media-hero': SlideMedia,
  content: SlideContent,
  'two-column': SlideTwoColumn,
  stats: SlideStats,
  quote: SlideQuote,
  // 其他布局暂时回退到 content
  'image-grid': SlideContent,
  comparison: SlideContent,
  timeline: SlideContent,
  list: SlideContent,
}
</script>

<template>
  <component :is="componentMap[layout] || SlideContent" :slide="props.slide" />
</template>
