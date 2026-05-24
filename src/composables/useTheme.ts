import themes, { type ThemeDef } from '../themes/index'

const STORAGE_KEY = 'theme-preset'

export { themes, type ThemeDef }

export function useTheme() {
  const storedName = localStorage.getItem(STORAGE_KEY) || themes[0].name
  const active = themes.find((t) => t.name === storedName) || themes[0]

  function apply(t: ThemeDef) {
    const el = document.documentElement
    el.classList.toggle('dark', t.dark)
    for (const [k, v] of Object.entries(t.vars)) {
      el.style.setProperty(k, v)
    }
  }

  // Apply on init
  apply(active)

  // Listen for system preference changes when no user choice
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem(STORAGE_KEY) === null) {
      const next = themes.find((t) => t.dark === e.matches) || themes[0]
      apply(next)
    }
  })
}
