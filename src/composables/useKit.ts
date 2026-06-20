import { kits, defaultKit, getKit, type KitDef } from '../kits'
import type { KitThemeDef } from '../kits/types'

const KIT_STORAGE_KEY = 'active-kit'
const THEME_STORAGE_KEY = 'theme-preset'

/** 当前激活的套件 */
export function useKit() {
  const storedKitId = localStorage.getItem(KIT_STORAGE_KEY) || defaultKit.id
  const activeKit = getKit(storedKitId) || defaultKit

  /** 当前套件 */
  function getActiveKit(): KitDef {
    return activeKit
  }

  /** 切换套件 */
  function setKit(kitId: string) {
    const kit = getKit(kitId)
    if (!kit) return
    localStorage.setItem(KIT_STORAGE_KEY, kit.id)
    // 切换套件时自动应用该套件的第一个主题
    if (kit.themes.length > 0) {
      applyTheme(kit, kit.themes[0])
    }
    // 保存全屏状态，reload 后恢复
    if (document.fullscreenElement) {
      localStorage.setItem('was-fullscreen', '1')
    }
    // 需要刷新页面来重新加载模板
    window.location.reload()
  }

  /** 获取下一个套件（用于循环切换） */
  function getNextKit(): KitDef {
    const idx = kits.findIndex(k => k.id === activeKit.id)
    return kits[(idx + 1) % kits.length]
  }

  /** 应用主题 */
  function applyTheme(kit: KitDef, theme: KitThemeDef) {
    const el = document.documentElement
    el.classList.toggle('dark', theme.dark)
    for (const [k, v] of Object.entries(theme.vars)) {
      el.style.setProperty(k, v)
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme.name)
  }

  /** 获取当前主题名 */
  function getCurrentThemeName(): string {
    return localStorage.getItem(THEME_STORAGE_KEY) || activeKit.themes[0]?.name || ''
  }

  /** 获取当前主题对象 */
  function getCurrentTheme(): KitThemeDef | undefined {
    const name = getCurrentThemeName()
    return activeKit.themes.find(t => t.name === name) || activeKit.themes[0]
  }

  /** 获取下一个主题 */
  function getNextTheme(): KitThemeDef {
    const cur = getCurrentTheme()
    if (!cur) return activeKit.themes[0]
    const idx = activeKit.themes.findIndex(t => t.name === cur.name)
    return activeKit.themes[(idx + 1) % activeKit.themes.length]
  }

  /** 切换到下一个主题 */
  function cycleTheme() {
    const next = getNextTheme()
    applyTheme(activeKit, next)
  }

  return {
    activeKit,
    kits,
    getActiveKit,
    setKit,
    getNextKit,
    getCurrentTheme,
    getCurrentThemeName,
    getNextTheme,
    cycleTheme,
    applyTheme,
  }
}

/** 页面初始化时应用保存的主题 */
export function initTheme() {
  const storedKitId = localStorage.getItem(KIT_STORAGE_KEY) || defaultKit.id
  const kit = getKit(storedKitId) || defaultKit
  const storedThemeName = localStorage.getItem(THEME_STORAGE_KEY) || kit.themes[0]?.name
  const theme = kit.themes.find(t => t.name === storedThemeName) || kit.themes[0]

  if (theme) {
    const el = document.documentElement
    el.classList.toggle('dark', theme.dark)
    for (const [k, v] of Object.entries(theme.vars)) {
      el.style.setProperty(k, v)
    }
  }

  // 恢复全屏状态（套件切换 reload 后）
  if (localStorage.getItem('was-fullscreen') === '1') {
    localStorage.removeItem('was-fullscreen')
    setTimeout(() => document.documentElement.requestFullscreen?.(), 300)
  }
}
