<script setup lang="ts">
import type { Slide } from '../types/slides'
import SlideCover from '../layouts/SlideCover.vue'
import SlideSection from '../layouts/SlideSection.vue'
import SlideCode from '../layouts/SlideCode.vue'
import SlideMedia from '../layouts/SlideMedia.vue'
import SlideContent from '../layouts/SlideContent.vue'
import SlideTwoColumn from '../layouts/SlideTwoColumn.vue'
import SlideStats from '../layouts/SlideStats.vue'
import SlideQuote from '../layouts/SlideQuote.vue'
import SlideImageGrid from '../layouts/SlideImageGrid.vue'
import SlideComparison from '../layouts/SlideComparison.vue'
import SlideTimeline from '../layouts/SlideTimeline.vue'
import SlideList from '../layouts/SlideList.vue'

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
