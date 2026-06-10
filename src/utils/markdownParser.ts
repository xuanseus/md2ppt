import { marked } from 'marked'
import { createHighlighter, type Highlighter } from 'shiki'
import type { Slide } from '../types/slides'

let highlighter: Highlighter | null = null
let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (highlighter) return highlighter
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: ['javascript', 'typescript', 'bash', 'html', 'css', 'json', 'markdown'],
    }).then(h => {
      highlighter = h
      return h
    })
  }
  return highlighterPromise
}

let codeCache = new Map<string, string>()

function highlightCodeSync(code: string, lang?: string): string {
  if (!lang || !highlighter) return code
  
  const cacheKey = `${lang}:${code}`
  if (codeCache.has(cacheKey)) {
    return codeCache.get(cacheKey)!
  }
  
  try {
    const html = highlighter.codeToHtml(code, {
      lang,
      theme: 'github-dark',
    })
    codeCache.set(cacheKey, html)
    return html
  } catch {
    return code
  }
}

marked.use({
  breaks: true,
  gfm: true,
  extensions: [
    {
      name: 'heading',
      level: 'block',
      renderer(this: any, token: any) {
        const text = this.parser.parseInline(token.tokens)
        const sizes: Record<number, string> = {
          1: 'text-4xl md:text-6xl font-bold tracking-tight',
          2: 'text-2xl md:text-4xl font-bold',
          3: 'text-xl md:text-2xl font-semibold',
          4: 'text-lg md:text-xl font-medium',
        }
        const cls = sizes[token.depth] || sizes[4]
        return `<h${token.depth} class="${cls}">${text}</h${token.depth}>`
      },
    },
    {
      name: 'link',
      level: 'inline',
      renderer(this: any, token: any) {
        const text = this.parser.parseInline(token.tokens)
        return `<a href="${token.href}" target="_blank" rel="noopener noreferrer" class="underline decoration-2 underline-offset-2">${text}</a>`
      },
    },
    {
      name: 'code',
      level: 'block',
      renderer(_token: any) {
        const token = _token
        const highlighted = highlightCodeSync(token.text, token.lang)
        const dots = `
      <div class="flex gap-1.5 px-4 py-2">
        <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
      </div>
    `
        const label = token.lang ? `<div class="text-xs text-muted-foreground px-4 pb-1 font-mono">${token.lang}</div>` : ''
        return `<div class="code-block-wrapper rounded-lg overflow-hidden bg-[#0d1117] border border-gray-700">${dots}${label}<div class="px-4 pb-3 overflow-x-auto">${highlighted}</div></div>`
      },
    },
    {
      name: 'paragraph',
      level: 'block',
      renderer(this: any, token: any) {
        const text = this.parser.parseInline(token.tokens)
        if (/^<(video|img|iframe)\b/i.test(text.trim())) {
          return text
        }
        return `<p>${text}</p>`
      },
    },
    {
      name: 'blockquote',
      level: 'block',
      renderer(this: any, token: any) {
        const text = this.parser.parseInline(token.tokens)
        return `<blockquote class="border-l-4 border-l-accent pl-5 py-3 italic text-muted-foreground">${text}</blockquote>`
      },
    },
    {
      name: 'image',
      level: 'inline',
      renderer(token: any) {
        const titleAttr = token.title ? ` title="${token.title}"` : ''
        return `<img src="${token.href}" alt="${token.text || ''}"${titleAttr} class="max-w-full max-h-[60vh] object-contain rounded-lg mx-auto my-4" />`
      },
    },
  ],
})

export function parseMarkdown(rawMd: string): string {
  const cleaned = rawMd.replace(/\[TOC\]/gi, '')
  let html = marked.parse(cleaned) as string
  // Auto-add controls to video tags
  html = html.replace(/(<video\b[^>]*)(>)/gi, (_, pre, close) => {
    if (!/\bcontrols\b/i.test(pre)) {
      return `${pre} controls${close}`
    }
    return `${pre}${close}`
  })
  return html
}

function isEmptySlide(content: string[]): boolean {
  return content.join('\n').trim().length === 0
}

function commitSlide(
  slides: { rawMd: string; layout?: string }[],
  content: string[],
  layout?: string
) {
  if (!isEmptySlide(content)) {
    slides.push({ 
      rawMd: content.join('\n'),
      layout 
    })
  }
}

export function splitIntoSlides(rawMd: string): Slide[] {
  const lines = rawMd.split('\n')
  const slides: { rawMd: string; layout?: string }[] = []

  let current: string[] = []
  let inCodeBlock = false
  let currentLayout: string | undefined

  for (const line of lines) {
    // Track fenced code blocks
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      current.push(line)
      continue
    }

    if (inCodeBlock) {
      current.push(line)
      continue
    }

    // Check for layout marker: # Title {layout: cover} or ## Title {layout: section}
    const layoutMatch = line.match(/^(#{1,6}\s.+?)\s*\{layout:\s*([\w-]+)\}/i)
    if (layoutMatch) {
      const newLayout = layoutMatch[2]
      const cleanLine = layoutMatch[1]
      commitSlide(slides, current, currentLayout)  // 提交前一个幻灯片
      current = [cleanLine]
      currentLayout = newLayout  // 设置当前幻灯片的 layout
      // 对于两列布局，保留 currentLayout 以便后续识别 --- 分隔符
      // 注意：不能在这里就设置为 undefined，否则后续无法识别
      continue
    }

    // Split at # / ## / ### / #### / ##### / ###### headings
    // 但如果已显式指定 layout，则不拆分，将子标题合并到当前幻灯片中
    if (/^#{1,6}\s/.test(line)) {
      if (currentLayout) {
        current.push(line)
        continue
      }
      commitSlide(slides, current, currentLayout)
      current = [line]
      currentLayout = undefined
      continue
    }

    // Split at --- horizontal rules (except for two-column layout)
    if (/^-{3,}$/.test(line.trim())) {
      // 如果是两列布局，不分割幻灯片，而是继续收集内容
      if (currentLayout !== 'two-column') {
        commitSlide(slides, current, currentLayout)
        current = []
        currentLayout = undefined
        continue
      }
      // 两列布局中的 --- 保留为内容的一部分，继续添加
      current.push(line)
      continue
    }

    // Isolate standalone <video> / <img>
    if (/^\s*<(video|img)\b/i.test(line)) {
      const nonEmptyLines = current.filter(l => l.trim())
      const hasOnlyHeading = nonEmptyLines.length === 1 && /^#{1,6}\s/.test(nonEmptyLines[0])
      if (hasOnlyHeading) {
        current.push(line)
        continue
      }
      commitSlide(slides, current, currentLayout)
      slides.push({ rawMd: line })
      current = []
      currentLayout = undefined
      continue
    }

    current.push(line)
  }

  // Last slide
  commitSlide(slides, current, currentLayout)

  return slides
    .map((s, i) => {
      const rawMd = s.rawMd.trim()
      const layout = s.layout as any
      
      // 对于两列布局，需要用 --- 分隔左右两列
      if (layout === 'two-column') {
        const parts = rawMd.split(/^---$/m).map(p => p.trim()).filter(p => p)
        const title = extractTitle(rawMd)
        // 从左侧内容中移除标题行，避免标题重复显示
        let leftContent = parts[0] || ''
        if (title && leftContent) {
          leftContent = leftContent.replace(/^#{1,6}\s+.+(\n|$)/, '').trim()
        }
        return {
          id: i,
          rawMd,
          html: parseMarkdown(parts[0] || ''),
          type: 'content' as const,
          layout,
          title,
          index: i,
          leftHtml: parseMarkdown(leftContent),
          rightHtml: parseMarkdown(parts[1] || ''),
        }
      }
      
      return {
        id: i,
        rawMd,
        html: parseMarkdown(rawMd),
        type: 'content' as const,
        layout,
        title: extractTitle(rawMd),
        index: i,
      }
    })
    .filter((s) => s.rawMd.length > 0)
}

function extractTitle(rawMd: string): string {
  const match = rawMd.match(/^#{1,6}\s+(.+)$/m)
  return match ? match[1].trim() : ''
}

// Initialize highlighter asynchronously
export async function initHighlighter(): Promise<void> {
  await getHighlighter()
}
