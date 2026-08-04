<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="sm-list w-full h-full relative overflow-hidden"
    style="background: var(--color-background)">

    <!-- 纸纹理 -->
    <div class="sm-paper-texture absolute inset-0 pointer-events-none" />

    <!-- 背景墨晕 — 分散分布 -->
    <div class="absolute left-[30%] top-[20%] w-44 h-44 rounded-full pointer-events-none opacity-[0.03]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />
    <div class="absolute right-[20%] bottom-[25%] w-36 h-36 rounded-full pointer-events-none opacity-[0.025]"
      style="background: radial-gradient(ellipse, var(--color-foreground) 0%, transparent 70%)" />

    <!-- 标题 — 左上角竖排 -->
    <div v-if="slide.title" class="sm-list-title-area">
      <h2 class="sm-list-title-vertical">{{ slide.title }}</h2>
      <div class="sm-list-title-line" />
    </div>

    <!-- 列表内容 — 散点流动布局 -->
    <div class="sm-list-scatter" v-html="slide.html" />

    <!-- 右下印章 -->
    <div class="sm-seal absolute bottom-8 right-8 w-12 h-12 flex items-center justify-center select-none"
      style="border: 2px solid var(--color-seal); color: var(--color-seal); font-family: 'KaiTi', 'STKaiti', serif; writing-mode: vertical-rl; font-size: 0.5rem; letter-spacing: 0.1em; transform: rotate(5deg); opacity: 0.4; padding: 1px;">
      录
    </div>
  </div>
</template>

<style scoped>
.sm-list {
  padding: 2rem;
}

.sm-paper-texture {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-paper-texture) 2px, var(--color-paper-texture) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, var(--color-paper-texture) 3px, var(--color-paper-texture) 6px);
}

/* 标题 — 竖排左上角 */
.sm-list-title-area {
  position: absolute;
  left: 5%;
  top: 12%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sm-list-title-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: calc(1.8rem * var(--content-scale));
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'Noto Serif SC', 'STSong', 'SimSun', Georgia, serif;
  letter-spacing: 0.15em;
  line-height: 1.3;
  max-height: 50vh;
}

.sm-list-title-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent, var(--color-seal) 40%, var(--color-seal) 60%, transparent);
  opacity: 0.25;
}

/* 散点布局 — 列表项不再整齐排列，而是像书法卷轴上的字一样自然流动 */
.sm-list-scatter {
  position: absolute;
  left: 14%;
  right: 8%;
  top: 50%;
  transform: translateY(-50%);
  max-height: 80%;
}

.sm-list-scatter :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem 2rem;
  align-items: flex-start;
  justify-content: flex-start;
}

/* 每条列表项 — 不同偏移和微旋 */
.sm-list-scatter :deep(li) {
  font-size: var(--fs-body);
  line-height: 1.7;
  padding: 0.8rem 1.5rem;
  border-radius: 2px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  position: relative;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  /* 不规则边缘 */
  clip-path: polygon(
    1% 0%, 99% 1%, 100% 4%, 98% 100%, 2% 99%, 0% 97%
  );
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  max-width: 420px;
  flex-shrink: 0;
}

/* 散落偏移 — 每项微调，形成自然流动感 */

/* 左侧毛笔标记点 */
.sm-list-scatter :deep(li)::before {
  content: '';
  position: absolute;
  left: 0.6rem;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 6px;
  height: 6px;
  background: var(--color-seal);
  opacity: 0.45;
  border-radius: 1px;
}

/* 每个 item 左侧有一点装饰线条（仿笔触起笔） */
.sm-list-scatter :deep(li)::after {
  content: '';
  position: absolute;
  left: 1.4rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 1px;
  background: linear-gradient(90deg, var(--color-ink-light), transparent);
  opacity: 0.2;
}

/* hover 效果 — 墨色加深 */
.sm-list-scatter :deep(li:hover) {
  background: color-mix(in srgb, var(--color-ink-wash) 50%, var(--color-card));
  border-color: var(--color-ink-light);
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  transform: scale(1.03) !important;
}

.sm-list-scatter :deep(strong) {
  font-weight: 700;
  color: var(--color-heading);
}

.sm-list-scatter :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', Georgia, serif;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.sm-list-scatter :deep(ul) {
  margin-bottom: 2rem;
}
</style>
