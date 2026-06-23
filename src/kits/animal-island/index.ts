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
import islandLight from './themes/island-light.json'
import islandDark from './themes/island-dark.json'
import forestLight from './themes/forest-light.json'
import forestDark from './themes/forest-dark.json'
import oceanLight from './themes/ocean-light.json'
import coralDark from './themes/coral-dark.json'

export const animalIslandKit: KitDef = {
  id: 'animal-island',
  label: 'Animal Island',
  description: '自然治愈风格，暖调配色，圆角卡片布局，动物岛设计语言',
  decorations: { background: 'static' },
  themes: [
    islandLight,
    islandDark,
    forestLight,
    forestDark,
    oceanLight,
    coralDark,
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
