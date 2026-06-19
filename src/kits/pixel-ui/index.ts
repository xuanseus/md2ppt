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
import sunset from './themes/8bit-sunset.json'
import monoGreen from './themes/mono-green.json'
import arcadeBlue from './themes/arcade-blue.json'
import pastelPixel from './themes/pastel-pixel.json'

export const pixelUiKit: KitDef = {
  id: 'pixel-ui',
  label: 'Pixel Retro',
  description: 'Houdini 像素艺术渲染，像素级精确边框阴影，复古 8-bit 美学',
  decorations: { background: 'static' },
  themes: [
    sunset,
    monoGreen,
    arcadeBlue,
    pastelPixel,
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
