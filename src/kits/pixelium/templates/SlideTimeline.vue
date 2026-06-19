<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ slide: Slide }>()

interface TimelineEntry {
  date: string
  content: string
}

const parsed = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()

  const entries: TimelineEntry[] = []
  const beforeText: string[] = []
  const afterText: string[] = []
  let hitItems = false

  for (const line of body.split('\n')) {
    const m = line.replace(/\r$/, '').match(/^\s*-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/)
    if (m) {
      hitItems = true
      entries.push({ date: m[1], content: m[2] })
      continue
    }
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('-')) {
      if (hitItems) afterText.push(trimmed)
      else beforeText.push(trimmed)
    }
  }

  const subtitle = beforeText.length ? marked.parse(beforeText.join('\n')) as string : ''
  const after = afterText.length ? marked.parse(afterText.join('\n')) as string : ''
  return { subtitle, entries, afterText: after }
})
</script>

<template>
  <div class="px-timeline flex items-center justify-center w-full h-full" style="background: linear-gradient(180deg, #0d0d1a 0%, #1a1230 50%, #0d0d1a 100%)">
    <div class="absolute inset-0 pointer-events-none opacity-3" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3))" />

    <div class="relative z-10 w-full max-w-3xl px-10 slide-animate">
      <!-- Quest Log 窗口 -->
      <div :style="{ background: 'var(--color-card)', border: '4px solid var(--color-border)', boxShadow: '0 0 0 2px var(--color-background), 0 0 0 6px var(--color-border), 6px 6px 0 #0008', overflow: 'hidden' }">
        <!-- 任务日志标题栏 -->
        <div :style="{ background: 'linear-gradient(90deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 60%, var(--color-h1-to)))', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid var(--color-border)' }">
          <div class="flex items-center gap-3">
            <span style="font-family: monospace; color: var(--color-background); font-size: 1.1rem">📜</span>
            <span class="font-extrabold text-sm tracking-widest uppercase" style="color: var(--color-background); font-family: var(--px-font)">QUEST LOG</span>
          </div>
          <span class="font-bold text-xs" style="color: var(--color-background); font-family: var(--px-font); opacity: 0.7">{{ parsed.entries.length }}/{{ parsed.entries.length }}</span>
        </div>

        <!-- 标题 -->
        <div v-if="slide.title" style="padding: 1rem 2rem 0.5rem">
          <h2 style="font-size: var(--fs-h3); font-weight: 700; color: var(--color-heading); font-family: var(--px-font)">{{ slide.title }}</h2>
        </div>

        <div v-if="parsed.subtitle" v-html="parsed.subtitle" style="padding: 0 2rem 0.5rem; font-size: var(--fs-body-sm); color: var(--color-muted-foreground); font-family: var(--px-font)" />

        <!-- 任务条目列表 -->
        <div v-if="parsed.entries.length" style="padding: 0.5rem 1.5rem 1.5rem">
          <div v-for="(entry, i) in parsed.entries" :key="i" class="px-quest-entry"
            :style="{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem 1rem', marginBottom: '0.5rem', background: i === 0 ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)' : 'color-mix(in srgb, var(--color-accent) 4%, transparent)', border: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-border)'), boxShadow: '3px 3px 0 #0004' }">
            <!-- 完成复选框 -->
            <div :style="{ flexShrink: 0, width: '22px', height: '22px', background: i === 0 ? 'var(--color-accent)' : 'var(--color-muted)', border: '2px solid ' + (i === 0 ? 'var(--color-accent)' : 'var(--color-border)'), display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }">
              <span v-if="i === 0" style="color: var(--color-background); font-size: 0.6rem; font-weight: 900; font-family: monospace">✓</span>
              <span v-else style="color: var(--color-border); font-size: 0.5rem; font-family: monospace">□</span>
            </div>
            <!-- 任务内容 -->
            <div class="flex-1">
              <div :style="{ fontSize: 'var(--fs-caption)', fontWeight: 600, color: 'var(--color-accent)', fontFamily: 'var(--px-font)', marginBottom: '0.2rem', textDecoration: i === 0 ? 'line-through' : 'none', opacity: i === 0 ? 0.6 : 1 }">
                ◈ Objective {{ String(i + 1).padStart(2, '0') }}: {{ entry.date }}
              </div>
              <div :style="{ fontSize: 'var(--fs-body-sm)', color: 'var(--color-foreground)', fontFamily: 'var(--px-font)', lineHeight: 1.6, opacity: i === 0 ? 0.55 : 1 }">{{ entry.content }}</div>
            </div>
          </div>
        </div>

        <p v-if="!parsed.entries.length && !parsed.subtitle" class="text-center py-8" style="color: var(--color-muted-foreground); font-family: var(--px-font); font-size: var(--fs-body-sm)">No active quests...</p>

        <!-- 底部状态栏 -->
        <div :style="{ background: 'var(--color-muted)', borderTop: '3px solid var(--color-border)', padding: '0.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6rem', fontFamily: 'var(--px-font)', color: 'var(--color-muted-foreground)' }">
          <span>◀ SELECT</span>
          <span>▼ DETAILS</span>
          <span>B: BACK</span>
        </div>
      </div>

      <div v-if="parsed.afterText" v-html="parsed.afterText" class="text-center mt-4" style="font-size: var(--fs-caption); color: var(--color-muted-foreground); font-family: var(--px-font)" />
    </div>
  </div>
</template>

<style scoped>
.px-timeline { padding: 2.5rem 3rem; }
.px-quest-entry { transition: background 0.1s step-end; }
.px-quest-entry:hover { background: color-mix(in srgb, var(--color-accent) 14%, transparent) !important; transform: translateX(2px); }
</style>
