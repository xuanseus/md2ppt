// 主题文件按此数组顺序循环切换，新增主题只需：
// 1. 在此目录新建 xxx.json（参考已有文件格式）
// 2. 在此数组中加入 import 即可
import xuanziLight from './xuanzi-light.json'
import xuanziDark from './xuanzi-dark.json'
import simpleLight from './simple-light.json'
import simpleDark from './simple-dark.json'

export interface ThemeDef {
  name: string
  label: string
  dark: boolean
  vars: Record<string, string>
}

const themes: ThemeDef[] = [
  xuanziLight,
  xuanziDark,
  simpleLight,
  simpleDark,
]

export default themes

export function getNextTheme(currentName: string): ThemeDef {
  const idx = themes.findIndex((t) => t.name === currentName)
  return themes[(idx + 1) % themes.length]
}

export function getTheme(name: string): ThemeDef | undefined {
  return themes.find((t) => t.name === name)
}
