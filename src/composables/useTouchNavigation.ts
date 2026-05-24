import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useTouchNavigation(
  next: () => void,
  prev: () => void,
  elementRef: Ref<HTMLElement | null>,
) {
  const touchStartX = ref(0)
  const touchStartY = ref(0)

  function handleTouchStart(e: TouchEvent) {
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
  }

  function handleTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX.value
    const dy = e.changedTouches[0].clientY - touchStartY.value

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next()
      else prev()
    }
  }

  onMounted(() => {
    const el = elementRef.value
    if (el) {
      el.addEventListener('touchstart', handleTouchStart, { passive: true })
      el.addEventListener('touchend', handleTouchEnd, { passive: true })
    }
  })

  onUnmounted(() => {
    const el = elementRef.value
    if (el) {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  })
}
