import type { KitDef } from '../types'

// ── 模板组件 ──
import SlideCover from './templates/SlideCover.vue'
import SlideSection from './templates/SlideSection.vue'
import SlideCode from './templates/SlideCode.vue'
import SlideMedia from './templates/SlideMedia.vue'
import SlideContent from './templates/SlideContent.vue'
import SlideTwoColumn from './templates/SlideTwoColumn.vue'
import SlideStats from './templates/SlideStats.vue'
import SlideQuote from './templates/SlideQuote.vue'
import SlideComparison from './templates/SlideComparison.vue'
import SlideTimeline from './templates/SlideTimeline.vue'
import SlideList from './templates/SlideList.vue'

// ── 主题文件 ──
import xuanziLight from './themes/xuanzi-light.json'
import xuanziDark from './themes/xuanzi-dark.json'
import simpleLight from './themes/simple-light.json'
import simpleDark from './themes/simple-dark.json'

export const beatsKit: KitDef = {
  id: 'beats',
  label: 'Realtime Beats',
  description: '现代科技风格，WebGL 动态背景，Glassmorphism 布局',
  decorations: { background: 'webgl' },
  themes: [
    simpleDark,
    xuanziLight,
    xuanziDark,
    simpleLight,
  ],
  templates: {
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
    comparison: SlideComparison,
    timeline: SlideTimeline,
    list: SlideList,
  },
}
