import type { Slide, SlideType } from '../types/slides'

export function classifySlide(slide: Slide, index: number, _allSlides: Slide[]): SlideType {
  const { rawMd, html } = slide

  // Cover: first slide starting with # heading
  if (index === 0 && /^#\s/.test(rawMd.trim())) {
    return 'cover'
  }

  // Section: only has ##/### heading with minimal body content
  const bodyWithoutHeadings = rawMd
    .replace(/^#{1,4}\s.*$/gm, '')
    .trim()
  const headingCount = (rawMd.match(/^#{1,4}\s/gm) || []).length
  if (headingCount >= 1 && bodyWithoutHeadings.length < 100) {
    return 'section'
  }

  // Media: contains <video> or <img> tags
  if (/<(video|img)\b/i.test(html)) {
    return 'media'
  }

  // Code: fenced code blocks take >40% of content
  const codeContent = rawMd.match(/```[\s\S]*?```/g)
  if (codeContent) {
    const codeLen = codeContent.reduce((sum, c) => sum + c.length, 0)
    if (codeLen / rawMd.length > 0.4) {
      return 'code'
    }
  }

  return 'content'
}

export function classifyAllSlides(slides: Slide[]): Slide[] {
  return slides.map((slide, i) => ({
    ...slide,
    type: classifySlide(slide, i, slides),
  }))
}
