import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useKeyboardNavigation(
  next: () => void,
  prev: () => void,
  goToFirst: () => void,
  goToLast: () => void,
  goToSlide: (n: number) => void,
  isOverview: Ref<boolean>,
) {
  let digitBuffer = ''
  let digitTimer: ReturnType<typeof setTimeout> | null = null

  function handleKeydown(e: KeyboardEvent) {
    // Don't handle if user is typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.preventDefault()
        next()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault()
        prev()
        break
      case 'Home':
        e.preventDefault()
        goToFirst()
        break
      case 'End':
        e.preventDefault()
        goToLast()
        break
      case 'f':
      case 'F':
        e.preventDefault()
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
        break
      case 'Escape':
        e.preventDefault()
        if (isOverview.value) {
          isOverview.value = false
        } else {
          isOverview.value = true
        }
        break
      default:
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault()
          digitBuffer += e.key
          if (digitTimer) clearTimeout(digitTimer)
          digitTimer = setTimeout(() => {
            const target = parseInt(digitBuffer) - 1
            if (target >= 0) goToSlide(target)
            digitBuffer = ''
          }, 600)
        }
        break
    }
  }

  function handlePopState() {
    const pathParts = window.location.pathname.split('/').filter(Boolean)
    const lastPart = pathParts[pathParts.length - 1]
    if (/^\d+$/.test(lastPart)) {
      const slideNum = parseInt(lastPart)
      if (slideNum > 0) {
        goToSlide(slideNum - 1)
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('popstate', handlePopState)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('popstate', handlePopState)
  })
}
