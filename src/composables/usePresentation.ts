import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { splitIntoSlides, initHighlighter } from '../utils/markdownParser'
import { classifyAllSlides } from '../utils/slideClassifier'
import type { Slide, NavigationDirection } from '../types/slides'
import rawMdContent from 'virtual:slides'

// 构建时 MD 文件路径，取 basename（打包后复制到 dist 根目录）
const MD_FILENAME = import.meta.env.VITE_MD_FILE_PATH.split('/').pop()!

export function usePresentation() {
  const slides = ref<Slide[]>([])
  const currentSlideIndex = ref(0)
  const rawMd = ref(rawMdContent) // baked-in 兜底
  const isReloading = ref(false)
  const reloadError = ref('')
  let pollTimer: ReturnType<typeof setInterval> | null = null

  function reloadSlides() {
    if (!rawMd.value) return
    const parsed = splitIntoSlides(rawMd.value)
    slides.value = classifyAllSlides(parsed)
    if (currentSlideIndex.value >= slides.value.length) {
      currentSlideIndex.value = Math.max(0, slides.value.length - 1)
    }
  }

  // 尝试从同目录 fetch MD（HTTP 服务器场景，无需手动选文件）
  async function tryFetchMd(): Promise<string | null> {
    try {
      const response = await fetch(`./${MD_FILENAME}`)
      if (response.ok) {
        const text = await response.text()
        // 排除 Vite dev server SPA fallback 返回的 HTML（以 <!doctype 或 <html 开头）
        const trimmed = text.trimStart()
        if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
          return null
        }
        return text
      }
    } catch {
      // file:// 协议下 fetch 被 CORS 拦截
    }
    return null
  }

  // 通过文件选择器加载 MD（file:// 协议降级方案）
  async function pickMdFile(): Promise<string | null> {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md'

    const file = await new Promise<File | null>((resolve) => {
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement
        resolve(target.files?.[0] ?? null)
      }
      input.oncancel = () => resolve(null)  // ESC 取消不算错误
      input.click()
    })

    return file ? file.text() : null
  }

  // 重新加载 MD：优先 fetch，降级到文件选择器
  async function reloadMarkdownFromFile() {
    isReloading.value = true
    reloadError.value = ''

    try {
      // 优先尝试 HTTP fetch（serve 场景一键刷新）
      let text = await tryFetchMd()
      if (!text) {
        // fetch 失败，降级到手动选文件
        text = await pickMdFile()
      }
      if (text) {
        rawMd.value = text
        reloadSlides()
      }
    } catch (error) {
      console.error('Failed to reload markdown:', error)
      reloadError.value = error instanceof Error ? error.message : '重新加载失败'
    } finally {
      isReloading.value = false
    }
  }

  // Initialize highlighter and load slides
  onMounted(async () => {
    await initHighlighter()

    // 优先尝试从同目录加载 MD（HTTP 服务器下可获取最新版本）
    const fetched = await tryFetchMd()
    if (fetched) {
      rawMd.value = fetched
    }
    // 失败则使用 baked-in 内容（rawMd.value 已有初始值）

    reloadSlides()

    // 设置页面标题（去掉 .md 后缀）
    document.title = MD_FILENAME.replace(/\.md$/i, '')

    // 轮询检测 MD 变化，有改动自动刷新（HTTP 服务器场景）
    if (fetched) {
      pollTimer = setInterval(async () => {
        const text = await tryFetchMd()
        if (text && text !== rawMd.value) {
          rawMd.value = text
          reloadSlides()
        }
      }, 500)
    }

    // Init from URL path (在幻灯片加载完成后执行)
    const pathParts = window.location.pathname.split('/').filter(Boolean)
    const lastPart = pathParts[pathParts.length - 1]
    const slideNum = parseInt(lastPart)
    if (!isNaN(slideNum) && slideNum > 0 && /^\d+$/.test(lastPart)) {
      goToSlide(slideNum - 1)
    }
  })

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
  })

  const currentSlide = computed(() =>
    slides.value[currentSlideIndex.value] || null,
  )
  const totalSlides = computed(() => slides.value.length)
  const hasPrev = computed(() => currentSlideIndex.value > 0)
  const hasNext = computed(() => currentSlideIndex.value < slides.value.length - 1)

  function goToSlide(index: number) {
    currentSlideIndex.value = Math.max(0, Math.min(index, slides.value.length - 1))
  }

  function next() { goToSlide(currentSlideIndex.value + 1) }
  function prev() { goToSlide(currentSlideIndex.value - 1) }
  function goToFirst() { goToSlide(0) }
  function goToLast() { goToSlide(slides.value.length - 1) }

  function handleNavigate(direction: NavigationDirection) {
    if (typeof direction === 'number') {
      goToSlide(direction)
    } else if (direction === 'next') {
      next()
    } else {
      prev()
    }
  }

  watch(currentSlideIndex, (idx) => {
    const slideNum = idx + 1
    // 使用相对路径，避免跨域问题
    const newUrl = slideNum === 1 ? '/' : `/${slideNum}`
    window.history.replaceState(null, '', newUrl)
  })

  return {
    slides,
    currentSlideIndex,
    currentSlide,
    totalSlides,
    hasPrev,
    hasNext,
    goToSlide,
    next,
    prev,
    goToFirst,
    goToLast,
    handleNavigate,
    reloadMarkdownFromFile,
    isReloading,
    reloadError,
  }
}
