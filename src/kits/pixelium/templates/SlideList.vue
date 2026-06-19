<script setup lang="ts">
import type { Slide } from '../../../types/slides'
import { computed } from 'vue'

const props = defineProps<{ slide: Slide }>()

const items = computed(() => {
  const raw = props.slide.rawMd
  const body = raw.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const result: string[] = []
  for (const line of body.split('\n')) {
    const m = line.trim().match(/^-\s+(.+)$/)
    if (m) result.push(m[1])
  }
  return result
})
</script>

<template>
  <div class="px-list flex items-center justify-center w-full h-full" style="background: linear-gradient(180deg, #0d0d1a 0%, #1a1230 50%, #0d0d1a 100%)">
    <div class="absolute inset-0 pointer-events-none opacity-3" style="background-image: repeating-linear-gradient(0deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3)), repeating-linear-gradient(90deg, var(--color-foreground) 0px, var(--color-foreground) 1px, transparent 1px, transparent calc(var(--px-bit) * 3))" />

    <div class="relative z-10 w-full max-w-5xl px-10 slide-animate">
      <!-- 背包窗口 -->
      <div :style="{ background: 'var(--color-card)', border: '4px solid var(--color-border)', boxShadow: '0 0 0 2px var(--color-background), 0 0 0 6px var(--color-border), 6px 6px 0 #0008', overflow: 'hidden' }">
        <!-- 背包标题栏 -->
        <div :style="{ background: 'linear-gradient(90deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 70%, var(--color-h1-to)))', padding: '0.6rem 1.5rem', borderBottom: '3px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <div class="flex items-center gap-2">
            <span style="font-family: monospace; color: var(--color-background); font-size: 1rem">🎒</span>
            <span class="font-extrabold text-sm tracking-widest uppercase" style="color: var(--color-background); font-family: var(--px-font)">{{ slide.title || 'INVENTORY' }}</span>
          </div>
          <span class="font-bold text-xs" style="color: var(--color-background); font-family: var(--px-font); opacity: 0.7">{{ items.length }}/{{ Math.max(items.length, 20) }}</span>
        </div>

        <!-- 背包网格 -->
        <div :style="{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', maxHeight: '55vh', overflowY: 'auto' }">
          <!-- 物品格 -->
          <div v-for="(item, idx) in items" :key="idx" class="px-inv-slot"
            :style="{ background: 'var(--color-muted)', border: '3px solid var(--color-border)', boxShadow: '3px 3px 0 #0004', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.08s step-end, background 0.08s step-end, box-shadow 0.08s step-end', cursor: 'default' }">
            <!-- 物品图标槽 -->
            <div :style="{ width: '44px', height: '44px', background: 'var(--color-background)', border: '2px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontFamily: 'monospace', color: 'var(--color-accent)' }">
              {{ ['◆','◇','○','●','▲','△','■','□','★','☆','♥','♠'][idx % 12] }}
            </div>
            <!-- 物品名称 -->
            <span :style="{ fontSize: 'calc(var(--fs-caption) * 0.95)', fontFamily: 'var(--px-font)', color: 'var(--color-foreground)', textAlign: 'center', lineHeight: 1.3, fontWeight: 600 }">{{ item }}</span>
          </div>

          <!-- 空槽填充 -->
          <div v-for="n in Math.max(0, 8 - items.length)" :key="'empty'+n" class="px-inv-empty"
            :style="{ background: 'var(--color-muted)', border: '2px dashed var(--color-border)', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.3 }">
            <div :style="{ width: '44px', height: '44px', background: 'var(--color-background)', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: 'var(--color-border)', fontSize: '0.8rem' }">—</div>
            <span style="font-size: var(--fs-caption); font-family: var(--px-font); color: var(--color-muted-foreground)">Empty</span>
          </div>
        </div>

        <!-- 底部描述栏 -->
        <div :style="{ background: 'var(--color-muted)', borderTop: '3px solid var(--color-border)', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.65rem', fontFamily: 'var(--px-font)' }">
          <span style="color: var(--color-accent); font-weight: 700">▶ Use</span>
          <span style="color: var(--color-muted-foreground)">Drop</span>
          <span style="color: var(--color-muted-foreground)">Sort</span>
          <span class="ml-auto" style="color: var(--color-muted-foreground); opacity: 0.5">← → Navigate | A: Select | B: Back</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.px-list { padding: 2.5rem 3rem; }
.px-inv-slot:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--color-accent) 12%, transparent) !important; box-shadow: 5px 5px 0 var(--color-accent) !important; border-color: var(--color-accent) !important; }
.px-inv-empty:hover { transform: none; background: var(--color-muted) !important; box-shadow: none !important; border-color: var(--color-border) !important; }
</style>
