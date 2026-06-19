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
import inkBlack from './themes/ink-black.json'
import ricePaper from './themes/rice-paper.json'
import vermillion from './themes/vermillion.json'
import celadon from './themes/celadon.json'

export const shuimoKit: KitDef = {
  id: 'shuimo',
  label: '水墨中国',
  description: '中国传统水墨画风格，黑白灰渐变，留白美学，毛笔字韵',
  decorations: { background: 'static' },
  themes: [
    inkBlack,
    ricePaper,
    vermillion,
    celadon,
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
