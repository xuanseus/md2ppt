import { ref } from 'vue'

export type TransitionType = 'slide' | 'fade' | 'zoom' | 'flip' | 'none'

export function useSlideTransition() {
  const currentTransition = ref<TransitionType>('slide')

  const transitions: TransitionType[] = ['slide', 'fade', 'zoom', 'flip', 'none']

  function setTransition(t: TransitionType) {
    currentTransition.value = t
  }

  function cycleTransition() {
    const idx = transitions.indexOf(currentTransition.value)
    const next = transitions[(idx + 1) % transitions.length]
    currentTransition.value = next
  }

  return {
    currentTransition,
    transitions,
    setTransition,
    cycleTransition,
  }
}
