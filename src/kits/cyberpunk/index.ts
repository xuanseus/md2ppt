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
import nightCity from './themes/night-city.json'
import synthwave from './themes/synthwave.json'
import greenTerminal from './themes/green-terminal.json'
import arcticNeon from './themes/arctic-neon.json'

export const cyberpunkKit: KitDef = {
  id: 'cyberpunk',
  label: 'Cyberpunk 2077',
  description: '赛博朋克霓虹风，高对比暗色，品红/青色/黄色激光配色',
  decorations: { background: 'static' },
  themes: [
    nightCity,
    synthwave,
    greenTerminal,
    arcticNeon,
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
