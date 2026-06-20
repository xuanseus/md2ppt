<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Column {
  title: string
  items: string[]
}

const parsed = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()

  const columns: Column[] = []
  const beforeText: string[] = []
  const afterText: string[] = []
  let hitColumns = false

  const parts = body.split(/(?=^\*\*[^*]+\*\*$)/gm)
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const titleMatch = trimmed.match(/^\*\*([^*]+)\*\*/m)
    if (titleMatch) {
      hitColumns = true
      const items: string[] = []
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        const itemMatch = t.match(/^-\s+(.+)$/)
        if (itemMatch) {
          items.push(itemMatch[1])
        } else if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
          afterText.push(t)
        }
      }
      columns.push({ title: titleMatch[1], items })
    } else {
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t) beforeText.push(t)
      }
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2), afterText: after }
})

const leftChars = computed(() => parsed.value.columns[0]?.items.join("").length || 0)
const rightChars = computed(() => parsed.value.columns[1]?.items.join("").length || 0)
const totalChars = computed(() => leftChars.value + rightChars.value)
</script>

<template>
  <div class="px-comparison flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <div class="absolute inset-0 pointer-events-none opacity-3" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3))" />

    <!-- 战斗粒子 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
      <div v-for="p in 10" :key="'bp'+p" class="absolute px-vs-particle" :style="{ width: (4 + p % 3 * 3) + 'px', height: (4 + p % 3 * 3) + 'px', left: ((p * 89 + 37) % 100) + '%', top: ((p * 61 + 13) % 100) + '%', background: p % 2 === 0 ? 'var(--color-accent)' : 'var(--color-h1-to)', animationDelay: (p * 0.15) + 's' }" />
    </div>

    <div class="relative z-10 w-full max-w-6xl px-10 slide-animate">
      <div v-if="slide.title" class="text-center mb-6">
        <h2 style="font-size: var(--fs-h2); font-weight: 700; color: var(--color-heading); font-family: var(--px-font); text-shadow: 2px 2px 0 #0006">{{ slide.title }}</h2>
      </div>

      <div v-if="parsed.subtitle" v-html="parsed.subtitle" class="text-center mb-4" style="font-size: var(--fs-body-sm); color: var(--color-muted-foreground); font-family: var(--px-font)" />

      <!-- 战斗画面 -->
      <div :style="{ background: 'var(--color-card)', border: '4px solid var(--color-border)', boxShadow: '0 0 0 2px var(--color-background), 0 0 0 6px var(--color-border), 8px 8px 0 #0008', display: 'flex', position: 'relative', overflow: 'hidden' }">
        <!-- 中央 VS 分隔 -->
        <div class="absolute left-50p top-0 bottom-0 z-10 -translate-x-50p" style="width: 4px; background: var(--color-background)"></div>

        <!-- VS 徽章 -->
        <div class="px-vs-badge absolute left-50p top-50p -translate-x-50p -translate-y-50p z-20" style="width: 56px; height: 56px; background: var(--color-accent); color: var(--color-background); display: flex; align-items: center; justify-content: center; font-family: var(--px-font); font-weight: 900; font-size: 1.1rem; letter-spacing: 0.1em; border: 3px solid var(--color-background); box-shadow: 0 0 0 2px var(--color-accent), 4px 4px 0 #0006">
          <span style="text-shadow: 2px 2px 0 #0004">VS</span>
        </div>

        <!-- 左列：Ally -->
        <div :style="{ flex: '1', background: 'color-mix(in srgb, var(--color-accent) 6%, transparent)', padding: '2rem', borderRight: '2px solid var(--color-border)' }">
          <div class="mb-4 text-center">
            <span class="px-side-tag" style="background: var(--color-accent); color: var(--color-accent-foreground); box-shadow: 3px 3px 0 #0004">ALLY</span>
          </div>
          <div class="mb-4 px-4">
            <div class="flex justify-between mb-1">
              <span style="color: var(--color-accent); font-weight: 700; font-family: var(--px-font); font-size: 0.7rem">LEFT</span>
              <span style="color: var(--color-accent); font-family: var(--px-font); font-size: 0.65rem">{{ leftChars }} ch</span>
            </div>
            <div class="px-vs-hp-bar" style="border-color: var(--color-accent)"><div class="px-vs-hp-fill" style="background: var(--color-accent);" :style="{ width: totalChars ? (leftChars / totalChars * 100) + '%' : '50%' }"></div></div>
          </div>
          <div v-for="col in parsed.columns.slice(0,1)" :key="col.title">
            <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom: 2px dashed color-mix(in srgb, var(--color-accent) 33%, transparent)">
              <span style="font-family: monospace; color: var(--color-accent); font-size: 1.2rem">⚔</span>
              <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); font-family: var(--px-font)">{{ col.title }}</h4>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0">
              <li v-for="(item, j) in col.items" :key="j" style="display: flex; align-items: baseline; gap: 0.4rem; font-size: var(--fs-body-sm); color: var(--color-foreground); padding: 0.5rem 0; line-height: 1.6; font-family: var(--px-font);">
                <span style="color: var(--color-accent); font-family: monospace; font-size: 0.65em; flex-shrink: 0;">▶</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 右列：Enemy -->
        <div :style="{ flex: '1', background: 'color-mix(in srgb, var(--color-h1-to) 6%, transparent)', padding: '2rem', borderLeft: '2px solid var(--color-border)' }">
          <div class="mb-4 text-center">
            <span class="px-side-tag" style="background: var(--color-h1-to); color: var(--color-accent-foreground); box-shadow: 3px 3px 0 #0004">ENEMY</span>
          </div>
          <div class="mb-4 px-4">
            <div class="flex justify-between mb-1">
              <span style="color: var(--color-h1-to); font-weight: 700; font-family: var(--px-font); font-size: 0.7rem">RIGHT</span>
              <span style="color: var(--color-h1-to); font-family: var(--px-font); font-size: 0.65rem">{{ rightChars }} ch</span>
            </div>
            <div class="px-vs-hp-bar" style="border-color: var(--color-h1-to)"><div class="px-vs-hp-fill" style="background: var(--color-h1-to);" :style="{ width: totalChars ? (rightChars / totalChars * 100) + '%' : '50%' }"></div></div>
          </div>
          <div v-for="col in parsed.columns.slice(1,2)" :key="col.title">
            <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom: 2px dashed color-mix(in srgb, var(--color-h1-to) 33%, transparent)">
              <span style="font-family: monospace; color: var(--color-h1-to); font-size: 1.2rem">☠</span>
              <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); font-family: var(--px-font)">{{ col.title }}</h4>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0">
              <li v-for="(item, j) in col.items" :key="j" style="display: flex; align-items: baseline; gap: 0.4rem; font-size: var(--fs-body-sm); color: var(--color-foreground); padding: 0.5rem 0; line-height: 1.6; font-family: var(--px-font);">
                <span style="color: var(--color-h1-to); font-family: monospace; font-size: 0.65em; flex-shrink: 0;">▶</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="parsed.afterText" v-html="parsed.afterText" class="text-center mt-4" style="font-size: var(--fs-caption); color: var(--color-muted-foreground); font-family: var(--px-font)" />
    </div>
  </div>
</template>

<style scoped>
@keyframes px-vs-pop { 0% { transform: translate(-50%, -50%) scale(0); } 50% { transform: translate(-50%, -50%) scale(1.2); } 100% { transform: translate(-50%, -50%) scale(1); } }
@keyframes px-vs-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

.px-comparison { padding: 2.5rem 3rem; }
.px-vs-badge { animation: px-vs-pop 0.5s step-end; }
.px-vs-particle { animation: px-vs-float 2.5s step-end infinite; }
.px-side-tag { display: inline-block; padding: 0.25rem 1.5rem; font-size: 0.65rem; font-weight: 800; font-family: var(--px-font); letter-spacing: 0.2em; text-transform: uppercase; }
.px-vs-hp-bar { width: 100%; height: 14px; background: var(--color-muted); border: 2px solid; position: relative; }
.px-vs-hp-fill { height: 100%; }
</style>
