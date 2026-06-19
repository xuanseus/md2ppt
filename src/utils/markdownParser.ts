import { marked } from 'marked'
import { getSingletonHighlighter, type Highlighter } from 'shiki'
import type { Slide } from '../types/slides'

// 用单例模式同步获取高亮器（首次调用会等待异步初始化完成）
let _highlighter: Highlighter | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!_highlighter) {
    _highlighter = await getSingletonHighlighter({
      themes: ['dracula-soft'],
      langs: ['javascript', 'typescript', 'bash', 'html', 'css', 'json', 'markdown', 'python', 'java', 'go', 'rust', 'c', 'cpp', 'csharp', 'swift', 'kotlin', 'ruby', 'php', 'sql', 'yaml', 'xml', 'dockerfile', 'shell', 'powershell', 'makefile', 'diff', 'vue', 'svelte'],
    })
  }
  return _highlighter
}

let codeCache = new Map<string, string>()

// 统一 cache key：去掉 \r 并 trim，让预高亮和 marked 渲染器的 key 一致
function normalizeCodeKey(code: string): string {
  return code.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
}

async function highlightCode(code: string, lang?: string): Promise<string> {
  if (!lang) return code

  const cacheKey = `${lang}:${normalizeCodeKey(code)}`
  if (codeCache.has(cacheKey)) {
    return codeCache.get(cacheKey)!
  }

  try {
    const h = await getHighlighter()
    const html = h.codeToHtml(code, {
      lang,
      theme: 'dracula-soft',
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
        const lang = (token.lang || '').trim()
        // 使用预高亮的结果（由 preHighlightCodeBlocks 提前处理）
        const cacheKey = `${lang}:${normalizeCodeKey(token.text)}`
        const highlighted = codeCache.get(cacheKey) || token.text
        const dots = `
      <div class="flex gap-1.5 px-4 py-2">
        <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
      </div>
    `
        const label = lang ? `<div class="text-xs px-4 pb-2 font-mono" style="color: #6272a4">${lang}</div>` : ''
        return `<div class="code-block-wrapper rounded-xl overflow-hidden border-2 border-[var(--color-accent)]/20 shadow-lg shadow-[var(--color-accent)]/5" style="background: #282a36">${dots}${label}<div class="px-4 pb-3 overflow-x-auto">${highlighted}</div></div>`
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
        // parse 处理块级 token（支持多段 blockquote），parseInline 只认行内 token
        const text = this.parser.parse(token.tokens)
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

// 预高亮：扫描 MD 中所有代码块，提前填充 cache，让 marked 渲染器直接读取
async function preHighlightCodeBlocks(rawMd: string): Promise<void> {
  const regex = /^```(\w+)?\r?\n([\s\S]*?)^```/gm
  let match: RegExpExecArray | null
  while ((match = regex.exec(rawMd)) !== null) {
    const lang = (match[1] || '').trim()
    const code = match[2]
    if (lang) {
      await highlightCode(code, lang)
    }
  }
}

export async function parseMarkdown(rawMd: string): Promise<string> {
  await preHighlightCodeBlocks(rawMd)
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

export async function splitIntoSlides(rawMd: string): Promise<Slide[]> {
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

    // Split at --- horizontal rules（统一分页符）
    if (/^-{3,}$/.test(line.trim())) {
      commitSlide(slides, current, currentLayout)
      current = []
      currentLayout = undefined
      continue
    }

    // Isolate standalone <video> / <img>
    if (/^\s*<(video|img)\b/i.test(line)) {
      // 支持媒体行末尾的 {layout: media-hero} 标记
      const mediaLayoutMatch = line.match(/\{layout:\s*([\w-]+)\}\s*$/i)
      const mediaLayout = mediaLayoutMatch ? mediaLayoutMatch[1] : undefined
      const cleanLine = mediaLayoutMatch
        ? line.replace(/\s*\{layout:\s*[\w-]+\}\s*$/i, '').trimEnd()
        : line

      const nonEmptyLines = current.filter(l => l.trim())
      const hasOnlyHeading = nonEmptyLines.length === 1 && /^#{1,6}\s/.test(nonEmptyLines[0])
      // 仅当 heading-only 且媒体行无显式 layout 时才合并（兼容旧行为）
      if (hasOnlyHeading && !mediaLayout) {
        current.push(cleanLine)
        continue
      }
      commitSlide(slides, current, currentLayout)
      slides.push({ rawMd: cleanLine, layout: mediaLayout })
      current = []
      currentLayout = undefined
      continue
    }

    current.push(line)
  }

  // Last slide
  commitSlide(slides, current, currentLayout)

  return (await Promise.all(
    slides.map(async (s, i) => {
      const rawMd = s.rawMd.trim()
      const layout = s.layout as any

      return {
        id: i,
        rawMd,
        html: await parseMarkdown(rawMd),
        type: 'content' as const,
        layout,
        title: extractTitle(rawMd),
        index: i,
      }
    })
  )).filter((s) => s.rawMd.length > 0)
}

function extractTitle(rawMd: string): string {
  const match = rawMd.match(/^#{1,6}\s+(.+)$/m)
  if (!match) return ''
  // 去掉 {layout: xxx} / {class: xxx} 等标记
  return match[1].replace(/\s*\{[^}]+\}\s*$/g, '').trim()
}
