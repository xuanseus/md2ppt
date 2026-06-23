/**
 * 幻灯片动画引擎 — 20 种 GSAP 预设
 *
 * 用法：在标题行加 {anim: xxx} 标记
 *   ### 页面标题 {layout: stats, anim: fade-in-up}
 *
 * 分类：
 *   Entry    — 整页入场动画
 *   Stagger  — 子元素依次出场（列表/网格用）
 *   Exit     — 整页退场（自动播放用）
 */

import { gsap } from 'gsap'

// ── 类型 ──

export type EntryAnim =
  | 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right'
  | 'slide-in-up' | 'slide-in-left' | 'slide-in-right'
  | 'zoom-in' | 'zoom-out' | 'bounce-in'
  | 'flip-in-x' | 'flip-in-y'

export type StaggerAnim =
  | 'stagger-fade-up' | 'stagger-fade-left' | 'stagger-fade-right'
  | 'stagger-scale' | 'stagger-bounce'

export type ExitAnim = 'fade-out' | 'slide-out-left'

// ── 默认参数 ──

const DURATION = 0.6
const DISTANCE = 40
const STAGGER_DELAY = 0.08
const EASE = 'power3.out'

// ── 入场动画 ──

export function animateEntry(
  el: HTMLElement,
  anim: EntryAnim | string,
  opts?: { duration?: number; delay?: number; distance?: number }
): gsap.core.Tween | null {
  if (!anim || anim === 'none') return null
  const d = opts?.duration ?? DURATION
  const dist = opts?.distance ?? DISTANCE
  const delay = opts?.delay ?? 0

  gsap.set(el, { opacity: 0 })

  const map: Record<string, gsap.TweenVars> = {
    'fade-in':         { opacity: 1, duration: d },
    'fade-in-up':      { opacity: 1, y: 0, duration: d, ...fromY(dist) },
    'fade-in-down':    { opacity: 1, y: 0, duration: d, ...fromY(-dist) },
    'fade-in-left':    { opacity: 1, x: 0, duration: d, ...fromX(dist) },
    'fade-in-right':   { opacity: 1, x: 0, duration: d, ...fromX(-dist) },
    'slide-in-up':     { y: 0, duration: d, ...fromY(dist) },
    'slide-in-left':   { x: 0, duration: d, ...fromX(dist) },
    'slide-in-right':  { x: 0, duration: d, ...fromX(-dist) },
    'zoom-in':         { opacity: 1, scale: 1, duration: d, ease: 'back.out(1.4)' },
    'zoom-out':        { opacity: 1, scale: 1, duration: d },
    'bounce-in':       { opacity: 1, scale: 1, duration: d * 1.3, ease: 'elastic.out(1, 0.5)' },
    'flip-in-x':       { opacity: 1, rotationX: 0, duration: d },
    'flip-in-y':       { opacity: 1, rotationY: 0, duration: d },
  }

  const vars = map[anim]
  if (!vars) return gsap.to(el, { opacity: 1, duration: 0.1 })

  // 预设非 opacity 的初始状态
  if (anim.includes('fade-in-') && anim.includes('up')) gsap.set(el, { y: dist })
  if (anim.includes('fade-in-') && anim.includes('down')) gsap.set(el, { y: -dist })
  if (anim.includes('fade-in-') && anim.includes('left')) gsap.set(el, { x: dist })
  if (anim.includes('fade-in-') && anim.includes('right')) gsap.set(el, { x: -dist })
  if (anim.includes('slide-in-') && anim.includes('up')) gsap.set(el, { y: dist })
  if (anim.includes('slide-in-') && anim.includes('left')) gsap.set(el, { x: dist })
  if (anim.includes('slide-in-') && anim.includes('right')) gsap.set(el, { x: -dist })
  if (anim === 'zoom-in') gsap.set(el, { scale: 0.5 })
  if (anim === 'zoom-out') gsap.set(el, { scale: 1.5 })
  if (anim === 'bounce-in') gsap.set(el, { scale: 0.3 })
  if (anim === 'flip-in-x') gsap.set(el, { rotationX: 90 })
  if (anim === 'flip-in-y') gsap.set(el, { rotationY: 90 })

  return gsap.to(el, { ...vars, delay })
}

function fromY(v: number) { return { y: v } }
function fromX(v: number) { return { x: v } }

// ── 子元素依次出场 ──

export function animateStagger(
  container: HTMLElement,
  anim: StaggerAnim | string,
  opts?: { duration?: number; delay?: number; distance?: number }
): gsap.core.Timeline | null {
  if (!anim || anim === 'none') return null
  const d = opts?.duration ?? 0.5
  const dist = opts?.distance ?? 60
  const delay = opts?.delay ?? 0.1
  const children = container.children

  if (!children.length) return null

  const tl = gsap.timeline({ delay })
  const base: gsap.TweenVars = { duration: d, ease: EASE, stagger: STAGGER_DELAY }

  switch (anim) {
    case 'stagger-fade-up':
      tl.fromTo(children, { opacity: 0, y: dist }, { ...base, opacity: 1, y: 0 }); break
    case 'stagger-fade-left':
      tl.fromTo(children, { opacity: 0, x: dist }, { ...base, opacity: 1, x: 0 }); break
    case 'stagger-fade-right':
      tl.fromTo(children, { opacity: 0, x: -dist }, { ...base, opacity: 1, x: 0 }); break
    case 'stagger-scale':
      tl.fromTo(children, { opacity: 0, scale: 0.7 }, { ...base, opacity: 1, scale: 1 }); break
    case 'stagger-bounce':
      tl.fromTo(children, { opacity: 0, scale: 0.3 }, { ...base, opacity: 1, scale: 1, ease: 'elastic.out(1, 0.5)', duration: d * 1.2 }); break
  }

  return tl
}

// ── 退场动画 ──

export function animateExit(
  el: HTMLElement,
  anim: ExitAnim | string,
  opts?: { duration?: number }
): gsap.core.Tween | null {
  if (!anim || anim === 'none') return null
  const d = opts?.duration ?? 0.3

  switch (anim) {
    case 'fade-out':
      return gsap.to(el, { opacity: 0, duration: d })
    case 'slide-out-left':
      return gsap.to(el, { x: -80, opacity: 0, duration: d })
    default:
      return gsap.to(el, { opacity: 0, duration: 0.2 })
  }
}

// ── 从 slide 参数中提取动画名 ──

export function extractAnim(rawMd: string): string | undefined {
  const m = rawMd.match(/\{anim:\s*([\w-]+)\}/i)
  return m ? m[1] : undefined
}
