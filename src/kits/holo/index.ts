import type { KitDef } from '../types'

// ── 模板组件 ──
import SlideCover from './templates/SlideCover.vue'
import SlideCoverSplit from './templates/SlideCoverSplit.vue'
import SlideCoverMinimal from './templates/SlideCoverMinimal.vue'
import SlideSection from './templates/SlideSection.vue'
import SlideSectionIcon from './templates/SlideSectionIcon.vue'
import SlideSectionNumber from './templates/SlideSectionNumber.vue'
import SlideCode from './templates/SlideCode.vue'
import SlideMedia from './templates/SlideMedia.vue'
import SlideMediaGrid from './templates/SlideMediaGrid.vue'
import SlideContent from './templates/SlideContent.vue'
import SlideContentCentered from './templates/SlideContentCentered.vue'
import SlideContentCards from './templates/SlideContentCards.vue'
import SlideTwoColumn from './templates/SlideTwoColumn.vue'
import SlideTwoTopBottom from './templates/SlideTwoTopBottom.vue'
import SlideTwoAsymmetric from './templates/SlideTwoAsymmetric.vue'
import SlideStats from './templates/SlideStats.vue'
import SlideStatsGrid from './templates/SlideStatsGrid.vue'
import SlideStatsInline from './templates/SlideStatsInline.vue'
import SlideQuote from './templates/SlideQuote.vue'
import SlideQuoteLarge from './templates/SlideQuoteLarge.vue'
import SlideComparison from './templates/SlideComparison.vue'
import SlideComparisonCards from './templates/SlideComparisonCards.vue'
import SlideTimeline from './templates/SlideTimeline.vue'
import SlideTimelineHorizontal from './templates/SlideTimelineHorizontal.vue'
import SlideList from './templates/SlideList.vue'
import SlideListNumbered from './templates/SlideListNumbered.vue'
import SlideListChecklist from './templates/SlideListChecklist.vue'

// ── 主题文件 ──
import neonDark from './themes/neon-dark.json'
import neonLight from './themes/neon-light.json'
import amberDark from './themes/amber-dark.json'
import matrixDark from './themes/matrix-dark.json'
import neonViolet from './themes/neon-violet.json'
import neonGreen from './themes/neon-green.json'

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
    neonViolet,
    neonGreen,
  ],
  templates: {
    'cover':              SlideCover,
    'cover-split':        SlideCoverSplit,
    'cover-minimal':      SlideCoverMinimal,
    'section':            SlideSection,
    'section-icon':       SlideSectionIcon,
    'section-number':     SlideSectionNumber,
    'code':               SlideCode,
    'code-full':          SlideCode,
    'media':              SlideMedia,
    'media-hero':         SlideMedia,
    'media-grid':         SlideMediaGrid,
    'content':            SlideContent,
    'content-centered':   SlideContentCentered,
    'content-cards':      SlideContentCards,
    'two-column':         SlideTwoColumn,
    'two-top-bottom':     SlideTwoTopBottom,
    'two-asymmetric':     SlideTwoAsymmetric,
    'stats':              SlideStats,
    'stats-grid':         SlideStatsGrid,
    'stats-inline':       SlideStatsInline,
    'quote':              SlideQuote,
    'quote-large':        SlideQuoteLarge,
    'comparison':         SlideComparison,
    'comparison-cards':   SlideComparisonCards,
    'timeline':           SlideTimeline,
    'timeline-horizontal': SlideTimelineHorizontal,
    'list':               SlideList,
    'list-numbered':      SlideListNumbered,
    'list-checklist':     SlideListChecklist,
  },
}
