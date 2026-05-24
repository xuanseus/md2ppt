import { ref, computed, watch, onMounted } from 'vue'
import { splitIntoSlides, initHighlighter } from '../utils/markdownParser'
import { classifyAllSlides } from '../utils/slideClassifier'
import type { Slide, NavigationDirection } from '../types/slides'
import rawMdContent from 'virtual:slides'

export function usePresentation() {
  const slides = ref<Slide[]>([])
  const currentSlideIndex = ref(0)
  const rawMd = ref(rawMdContent) // 初始使用打包的内容
  const isReloading = ref(false)
  const reloadError = ref('')

  function reloadSlides() {
    if (!rawMd.value) return
    const parsed = splitIntoSlides(rawMd.value)
    slides.value = classifyAllSlides(parsed)
    if (currentSlideIndex.value >= slides.value.length) {
      currentSlideIndex.value = Math.max(0, slides.value.length - 1)
    }
  }

  // 手动刷新 MD 内容（通过 FileReader API 绕过 CORS）
  async function reloadMarkdownFromFile() {
    isReloading.value = true
    reloadError.value = ''
    
    try {
      // 使用 File API 让用户选择 MD 文件
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.md'
      
      const file = await new Promise<File>((resolve, reject) => {
        input.onchange = (e) => {
          const target = e.target as HTMLInputElement
          if (target.files && target.files[0]) {
            resolve(target.files[0])
          } else {
            reject(new Error('未选择文件'))
          }
        }
        input.onerror = () => reject(new Error('文件选择失败'))
        input.click()
      })
      
      const text = await file.text()
      rawMd.value = text
      reloadSlides()
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
    reloadSlides()
    
    // Init from URL path (在幻灯片加载完成后执行)
    const pathParts = window.location.pathname.split('/').filter(Boolean)
    const lastPart = pathParts[pathParts.length - 1]
    const slideNum = parseInt(lastPart)
    if (!isNaN(slideNum) && slideNum > 0 && /^\d+$/.test(lastPart)) {
      goToSlide(slideNum - 1)
    }
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
