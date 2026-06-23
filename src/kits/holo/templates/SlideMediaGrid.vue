<script setup lang="ts">
import { computed } from 'vue'
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const cols = parseInt((props.slide.rawMd.match(/\{cols:\s*(\d+)\}/i) || [])[1] || '2')

const images = computed(() => {
  const body = props.slide.rawMd.replace(/^#{1,6}\s+.+(\n|$)/m, '').trim()
  const urls: string[] = []
  for (const line of body.split('\n')) {
    const m = line.match(/!\[.*\]\((.+)\)/)
    if (m) urls.push(m[1])
  }
  return urls
})
</script>

<template>
  <div class="holo-media-grid relative flex flex-col items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 背景网格 ============ -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.025]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoMediaGridBg" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="var(--color-accent)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoMediaGridBg)" />
      </svg>
    </div>

    <!-- ============ 标题 ============ -->
    <div class="relative z-10 mb-6">
      <h3 v-if="slide.title" class="holo-mg-title">{{ slide.title }}</h3>
    </div>

    <!-- ============ 图片网格 ============ -->
    <div class="relative z-10" style="width: 85%; max-width: 960px;">
      <div class="holo-mg-grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
        <div
          v-for="(url, i) in images"
          :key="i"
          class="holo-mg-item"
          :style="{ animationDelay: `${0.1 + i * 0.1}s` }"
        >
          <!-- 六边形视口框架 -->
          <div class="holo-mg-frame">
            <img :src="url" class="holo-mg-img" />
          </div>
          <!-- 角括号 -->
          <div class="holo-mg-bracket tl"></div>
          <div class="holo-mg-bracket tr"></div>
          <div class="holo-mg-bracket bl"></div>
          <div class="holo-mg-bracket br"></div>
        </div>
      </div>
    </div>

    <!-- ============ 回退内容 ============ -->
    <div v-if="!images.length" class="relative z-10" v-html="slide.html"></div>
  </div>
</template>

<style scoped>
/* ===== 标题 ===== */
.holo-mg-title {
  font-size: var(--fs-h2);
  font-weight: 700;
  text-align: center;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  text-shadow: var(--holo-glow);
  margin: 0;
}

/* ===== 网格 ===== */
.holo-mg-grid {
  display: grid;
  gap: 1.5rem;
}

/* ===== 图片容器 ===== */
.holo-mg-item {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16/9;
  position: relative;
  animation: holo-card-in 0.5s ease both;
}

/* ===== 六边形框架 ===== */
.holo-mg-frame {
  width: 100%;
  height: 100%;
  clip-path: polygon(
    10% 0%, 90% 0%, 100% 15%, 100% 85%,
    90% 100%, 10% 100%, 0% 85%, 0% 15%
  );
  background: var(--color-card);
  border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
  box-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 6%, transparent);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.holo-mg-frame:hover {
  box-shadow: var(--holo-border-glow), 0 0 40px color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.holo-mg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== 角括号 ===== */
.holo-mg-bracket {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
  opacity: 0.3;
}

.holo-mg-bracket.tl {
  top: 0;
  left: calc(10%);
  border-top: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
}

.holo-mg-bracket.tr {
  top: 0;
  right: calc(10%);
  border-top: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
}

.holo-mg-bracket.bl {
  bottom: 0;
  left: calc(10%);
  border-bottom: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
}

.holo-mg-bracket.br {
  bottom: 0;
  right: calc(10%);
  border-bottom: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
}

@keyframes holo-card-in {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
