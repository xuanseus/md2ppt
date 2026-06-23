export type SlideType = 'cover' | 'section' | 'code' | 'media' | 'content'

export type SlideLayout = 
  | 'auto'        // 自动检测（默认）
  | 'cover'       // 封面页
  | 'section'     // 章节页
  | 'content'     // 标准内容页
  | 'two-column'  // 两列布局
  | 'stats'       // 数据大字报
  | 'quote'       // 引用页
  | 'code-full'   // 全屏代码
  | 'media-hero'  // 媒体大图
  | 'comparison'  // 对比页
  | 'timeline'    // 时间线
  | 'list'        // 列表页

export interface Slide {
  id: number
  rawMd: string
  html: string
  type: SlideType
  layout?: SlideLayout  // 可选的布局标记
  title?: string        // 幻灯片标题
  index: number         // 幻灯片索引
  leftHtml?: string     // 两列布局：左列内容
  rightHtml?: string    // 两列布局：右列内容
  /** 动画预设名 {anim: fade-in-up} */
  anim?: string
}

export type NavigationDirection = 'next' | 'prev' | number
