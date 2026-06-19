import type { Component } from 'vue'

/** 单个配色主题定义 */
export interface KitThemeDef {
  name: string
  label: string
  dark: boolean
  vars: Record<string, string>
}

/** 组件套件（Kit）定义 — 一套完整的 PPT 模板系统 */
export interface KitDef {
  /** 唯一标识 */
  id: string
  /** 显示名称 */
  label: string
  /** 描述 */
  description: string
  /** 该套件提供的配色主题列表 */
  themes: KitThemeDef[]
  /** 布局 → 模板组件映射 */
  templates: Record<string, Component>
  /** 装饰配置 */
  decorations?: {
    /** 全局背景类型：'webgl' = Aurora/Silk/Grainient，'static' = 模板自带纯 CSS 背景 */
    background?: 'webgl' | 'static'
  }
}
