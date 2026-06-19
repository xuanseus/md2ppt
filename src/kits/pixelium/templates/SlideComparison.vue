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
</script>

<template>
  <div class="px-comparison flex items-center justify-center w-full h-full" style="background: linear-gradient(160deg, #0a0a1e 0%, #1a1030 40%, #0a0a1e 100%)">
    <div class="absolute inset-0 pointer-events-none opacity-3" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3))" />

    <!-- 战斗粒子 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
      <div v-for="p in 10" :key="'bp'+p" class="absolute px-vs-particle" :style="{ width: (4 + p % 3 * 3) + 'px', height: (4 + p % 3 * 3) + 'px', left: ((p * 89 + 37) % 100) + '%', top: ((p * 61 + 13) % 100) + '%', background: p % 2 === 0 ? '#4a9eff' : '#ff4a6a', animationDelay: (p * 0.15) + 's' }" />
    </div>

    <div class="relative z-10 w-full max-w-6xl px-10 slide-animate">
      <div v-if="slide.title" class="text-center mb-6">
        <h2 style="font-size: var(--fs-h2); font-weight: 700; color: var(--color-heading); font-family: var(--px-font); text-shadow: 2px 2px 0 #0006">{{ slide.title }}</h2>
      </div>

      <div v-if="parsed.subtitle" v-html="parsed.subtitle" class="text-center mb-4" style="font-size: var(--fs-body-sm); color: var(--color-muted-foreground); font-family: var(--px-font)" />

      <!-- 战斗画面 -->
      <div :style="{ background: 'var(--color-card)', border: '4px solid var(--color-border)', boxShadow: '0 0 0 2px var(--color-background), 0 0 0 6px var(--color-border), 8px 8px 0 #0008', display: 'flex', position: 'relative', overflow: 'hidden' }">
        <!-- 中央 VS 分隔 -->
        <div class="absolute left-50p top-0 bottom-0 z-10 -translate-x-50p" style="width: 4px; background: linear-gradient(180deg, var(--color-accent), var(--color-h1-to), var(--color-accent))"></div>

        <!-- VS 徽章 -->
        <div class="px-vs-badge absolute left-50p top-50p -translate-x-50p -translate-y-50p z-20" style="width: 56px; height: 56px; background: var(--color-accent); color: var(--color-background); display: flex; align-items: center; justify-content: center; font-family: var(--px-font); font-weight: 900; font-size: 1.1rem; letter-spacing: 0.1em; border: 3px solid var(--color-background); box-shadow: 0 0 0 2px var(--color-accent), 4px 4px 0 #0006">
          <span style="text-shadow: 2px 2px 0 #0004">VS</span>
        </div>

        <!-- 左列：Ally -->
        <div :style="{ flex: '1', background: 'color-mix(in srgb, #4a9eff 6%, transparent)', padding: '2rem', borderRight: '2px solid var(--color-border)' }">
          <div class="mb-4 text-center">
            <span class="px-side-tag" style="background: #4a9eff; color: #fff; box-shadow: 3px 3px 0 #0004">ALLY</span>
          </div>
          <div class="mb-4 px-4">
            <div class="flex justify-between mb-1">
              <span style="color: #4a9eff; font-weight: 700; font-family: var(--px-font); font-size: 0.7rem">HP</span>
            </div>
            <div class="px-vs-hp-bar" style="border-color: #4a9eff"><div class="px-vs-hp-fill" style="background: #4a9eff; width: 85%"></div></div>
          </div>
          <div v-for="col in parsed.columns.slice(0,1)" :key="col.title">
            <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom: 2px dashed #4a9eff55">
              <span style="font-family: monospace; color: #4a9eff; font-size: 1.2rem">⚔</span>
              <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); font-family: var(--px-font)">{{ col.title }}</h4>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0">
              <li v-for="(item, j) in col.items" :key="j" class="flex items-center gap-3" style="font-size: var(--fs-body-sm); color: var(--color-foreground); padding: 0.5rem 0; line-height: 1.6; font-family: var(--px-font)">
                <span style="color: #4a9eff; font-family: monospace">▶</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 右列：Enemy -->
        <div :style="{ flex: '1', background: 'color-mix(in srgb, #ff4a6a 6%, transparent)', padding: '2rem', borderLeft: '2px solid var(--color-border)' }">
          <div class="mb-4 text-center">
            <span class="px-side-tag" style="background: #ff4a6a; color: #fff; box-shadow: 3px 3px 0 #0004">ENEMY</span>
          </div>
          <div class="mb-4 px-4">
            <div class="flex justify-between mb-1">
              <span style="color: #ff4a6a; font-weight: 700; font-family: var(--px-font); font-size: 0.7rem">HP</span>
            </div>
            <div class="px-vs-hp-bar" style="border-color: #ff4a6a"><div class="px-vs-hp-fill" style="background: #ff4a6a; width: 62%"></div></div>
          </div>
          <div v-for="col in parsed.columns.slice(1,2)" :key="col.title">
            <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom: 2px dashed #ff4a6a55">
              <span style="font-family: monospace; color: #ff4a6a; font-size: 1.2rem">☠</span>
              <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); font-family: var(--px-font)">{{ col.title }}</h4>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0">
              <li v-for="(item, j) in col.items" :key="j" class="flex items-center gap-3" style="font-size: var(--fs-body-sm); color: var(--color-foreground); padding: 0.5rem 0; line-height: 1.6; font-family: var(--px-font)">
                <span style="color: #ff4a6a; font-family: monospace">▶</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 战斗指令栏 -->
      <div class="mt-3 flex items-center justify-center gap-8 px-6 py-2d5" style="background: var(--color-card); border: 2px solid var(--color-border); box-shadow: 4px 4px 0 #0006">
        <span class="px-vs-cmd" style="color: #4a9eff">ATTACK</span>
        <span style="color: var(--color-border); font-family: var(--px-font)">|</span>
        <span class="px-vs-cmd" style="color: var(--color-muted-foreground)">DEFEND</span>
        <span style="color: var(--color-border); font-family: var(--px-font)">|</span>
        <span class="px-vs-cmd" style="color: var(--color-muted-foreground)">ITEM</span>
        <span style="color: var(--color-border); font-family: var(--px-font)">|</span>
        <span class="px-vs-cmd" style="color: #ff4a6a">FLEE</span>
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
.px-vs-cmd { font-size: 0.7rem; font-weight: 800; font-family: var(--px-font); letter-spacing: 0.1em; text-transform: uppercase; }
</style>
