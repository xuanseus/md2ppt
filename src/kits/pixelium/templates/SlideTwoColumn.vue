<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface Column {
  title: string
  html: string
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
      const contentLines: string[] = []
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t && !t.match(/^\*\*[^*]+\*\*$/)) {
          contentLines.push(t)
        }
      }
      columns.push({ title: titleMatch[1], html: marked.parse(contentLines.join('\n')) as string })
    } else {
      for (const line of trimmed.split('\n')) {
        const t = line.trim()
        if (t) {
          if (hitColumns) afterText.push(t)
          else beforeText.push(t)
        }
      }
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, columns: columns.slice(0, 2), afterText: after }
})
</script>

<template>
  <div class="px-twocol flex items-center justify-center w-full h-full" style="background: var(--color-background)">
    <div class="absolute inset-0 pointer-events-none opacity-3" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3))" />

    <div class="relative z-10 w-full max-w-7xl px-10 flex gap-0 items-stretch slide-animate">
      <!-- 左侧：RPG 角色状态面板 -->
      <div class="flex-shrink-0" :style="{ width: '240px', background: 'var(--color-card)', border: '3px solid var(--color-border)', boxShadow: '5px 5px 0 #0006', display: 'flex', flexDirection: 'column', padding: '1.5rem 1.25rem' }">
        <!-- 面板头部 -->
        <div class="mb-4 pb-3" style="border-bottom: 2px solid var(--color-border)">
          <div class="mx-auto mb-3 flex items-center justify-center" style="width: 64px; height: 64px; background: var(--color-muted); border: 2px solid var(--color-border)">
            <span style="font-family: monospace; color: var(--color-accent); font-size: 1.5rem; opacity: 0.5">◉</span>
          </div>
          <h2 class="text-center font-bold" style="font-size: var(--fs-body-sm); color: var(--color-heading); font-family: var(--px-font)">
            {{ slide.title || 'STATUS' }}
          </h2>
        </div>

        <!-- RPG 属性条 -->
        <div class="flex flex-col gap-4 flex-1">
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-xs font-bold" style="color: var(--color-accent); font-family: var(--px-font)">HP</span>
              <span class="text-xs" style="color: var(--color-muted-foreground); font-family: var(--px-font)">42/42</span>
            </div>
            <div class="px-hp-bar-bg"><div class="px-hp-bar-fill"></div></div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-xs font-bold" style="color: var(--color-h1-to); font-family: var(--px-font)">MP</span>
              <span class="text-xs" style="color: var(--color-muted-foreground); font-family: var(--px-font)">28/28</span>
            </div>
            <div class="px-mp-bar-bg"><div class="px-mp-bar-fill"></div></div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-xs font-bold" style="color: var(--color-muted-foreground); font-family: var(--px-font)">EXP</span>
              <span class="text-xs" style="color: var(--color-muted-foreground); font-family: var(--px-font)">to Lv.9</span>
            </div>
            <div class="px-exp-bar-bg"><div class="px-exp-bar-fill"></div></div>
          </div>
        </div>

        <div v-if="parsed.subtitle" v-html="parsed.subtitle" class="mt-auto pt-3 px-stat-sub" style="border-top: 2px solid var(--color-border); font-size: var(--fs-caption); color: var(--color-muted-foreground); font-family: var(--px-font)" />

        <div class="mt-3 text-center" style="font-family: monospace; color: var(--color-accent); opacity: 0.25; font-size: 0.45rem">██████████</div>
      </div>

      <!-- 分隔线 -->
      <div class="flex-shrink-0 flex flex-col items-center justify-center" style="width: 48px">
        <div style="font-family: monospace; color: var(--color-accent); opacity: 0.3; font-size: 0.7rem; writing-mode: vertical-rl; letter-spacing: 2px">╱ ╱ ╱ ╱ ╱</div>
      </div>

      <!-- 右侧：描述卡片 -->
      <div class="flex-1 flex flex-col gap-4">
        <div v-for="(col, i) in parsed.columns" :key="i" class="px-desc-card flex-1" :style="{ background: 'var(--color-card)', border: '3px solid var(--color-border)', boxShadow: '5px 5px 0 #0006', padding: '1.5rem 2rem', transition: 'transform 0.1s step-end' }">
          <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom: 2px dashed var(--color-border)">
            <span style="font-family: monospace; color: var(--color-accent); font-size: 1rem">{{ i === 0 ? '◆' : '◇' }}</span>
            <h4 style="font-size: var(--fs-h4); font-weight: 700; color: var(--color-heading); font-family: var(--px-font)">{{ col.title }}</h4>
          </div>
          <div v-html="col.html" class="px-twocol-prose" />
        </div>
      </div>
    </div>

    <div v-if="parsed.afterText" class="absolute bottom-10 left-50p -translate-x-50p text-center px-twocol-after" v-html="parsed.afterText"></div>
  </div>
</template>

<style scoped>
.px-twocol { padding: 2.5rem 3rem; }

.px-hp-bar-bg, .px-mp-bar-bg, .px-exp-bar-bg {
  width: 100%; height: 12px; border: 2px solid var(--color-border);
  background: var(--color-muted); position: relative;
}
.px-hp-bar-fill { height: 100%; width: 100%; background: linear-gradient(90deg, #4c9, color-mix(in srgb, #4c9 60%, var(--color-accent))); animation: px-bar-pulse 2s step-end infinite; }
.px-mp-bar-fill { height: 100%; width: 80%; background: linear-gradient(90deg, var(--color-h1-to), color-mix(in srgb, var(--color-h1-to) 60%, var(--color-accent))); }
.px-exp-bar-fill { height: 100%; width: 35%; background: repeating-linear-gradient(90deg, var(--color-accent) 0px, var(--color-accent) 4px, transparent 4px, transparent 8px); }

@keyframes px-bar-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }

.px-desc-card:hover { transform: translateY(-3px); box-shadow: 7px 7px 0 #0008 !important; }

.px-twocol-prose :deep(p) { font-size: var(--fs-body-sm); line-height: 1.7; margin-bottom: 0.75rem; color: var(--color-foreground); font-family: var(--px-font); }
.px-twocol-prose :deep(ul), .px-twocol-prose :deep(ol) { padding-left: 1rem; margin-bottom: 0.75rem; }
.px-twocol-prose :deep(li) { margin-bottom: 0.5rem; line-height: 1.6; font-size: var(--fs-body-sm); font-family: var(--px-font); }
.px-twocol-prose :deep(li)::marker { color: var(--color-accent); }
.px-twocol-prose :deep(strong) { font-weight: 700; color: var(--color-accent); font-family: var(--px-font); }

.px-stat-sub :deep(p) { font-size: var(--fs-caption); color: var(--color-muted-foreground); line-height: 1.5; font-family: var(--px-font); }
.px-stat-sub :deep(img), .px-twocol-after :deep(img) {
  max-width: 100%; max-height: 160px; object-fit: contain;
  margin: 0 auto 1rem; border: 2px solid var(--color-border);
  box-shadow: 4px 4px 0 color-mix(in srgb, var(--color-accent) 12%, transparent);
}
</style>
