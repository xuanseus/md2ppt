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
import neonDark from './themes/neon-dark.json'
import neonLight from './themes/neon-light.json'
import amberDark from './themes/amber-dark.json'
import matrixDark from './themes/matrix-dark.json'

export const holoKit: KitDef = {
  id: 'holo',
  label: 'Holo Sci-Fi',
  description: '全息科幻风，三角形几何装饰，霓虹 HSL 配色',
  decorations: { background: 'static' },
  themes: [
    neonDark,
    neonLight,
    amberDark,
    matrixDark,
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
