import { ref, onUnmounted } from 'vue'

/**
 * 长按 / 短按 混合交互
 * - 短按（松开前 < delay）：触发 onShort
 * - 长按（按住 >= delay）：触发 onLong
 */
export function useLongPress(onShort: (e: PointerEvent) => void, onLong: () => void, delay = 500) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let longTriggered = false
  const pressing = ref(false)

  function start(e: PointerEvent) {
    longTriggered = false
    pressing.value = true
    timer = setTimeout(() => {
      longTriggered = true
      pressing.value = false
      onLong()
    }, delay)
  }

  function end(e: PointerEvent) {
    pressing.value = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (!longTriggered) {
      onShort(e)
    }
  }

  function cancel() {
    pressing.value = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  onUnmounted(cancel)

  return {
    pressing,
    onPointerDown: start,
    onPointerUp: end,
    onPointerLeave: cancel,
  }
}
