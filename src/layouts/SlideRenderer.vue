<script setup lang="ts">
import type { Slide } from '../types/slides'
import SlideCover from '../templates/SlideCover.vue'
import SlideSection from '../templates/SlideSection.vue'
import SlideCode from '../templates/SlideCode.vue'
import SlideMedia from '../templates/SlideMedia.vue'
import SlideContent from '../templates/SlideContent.vue'
import SlideTwoColumn from '../templates/SlideTwoColumn.vue'
import SlideStats from '../templates/SlideStats.vue'
import SlideQuote from '../templates/SlideQuote.vue'
import SlideImageGrid from '../templates/SlideImageGrid.vue'
import SlideComparison from '../templates/SlideComparison.vue'
import SlideTimeline from '../templates/SlideTimeline.vue'
import SlideList from '../templates/SlideList.vue'

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
  'image-grid': SlideImageGrid,
  comparison: SlideComparison,
  timeline: SlideTimeline,
  list: SlideList,
}
</script>

<template>
  <component :is="componentMap[layout] || SlideContent" :slide="props.slide" />
</template>
