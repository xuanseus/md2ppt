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
import gameboyLight from './themes/gameboy-light.json'
import gameboyDark from './themes/gameboy-dark.json'
import sunsetGold from './themes/sunset-gold.json'
import oceanBlue from './themes/ocean-blue.json'

export const pixeliumKit: KitDef = {
  id: 'pixelium',
  label: 'Pixel Island',
  description: '复古像素游戏风，Canvas 像素渲染，宝可梦/星露谷美学',
  decorations: { background: 'static' },
  themes: [
    oceanBlue,
    sunsetGold,
    gameboyLight,
    gameboyDark,
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
