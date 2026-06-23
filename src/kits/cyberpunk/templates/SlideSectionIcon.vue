<script setup lang="ts">
import type { Slide } from '../../../types/slides'

const props = defineProps<{ slide: Slide }>()
const icon = (props.slide.rawMd.match(/\{icon:\s*(\S+)\}/i) || [])[1] || '✦'
</script>

<template>
  <div class="cp-section w-full h-full" style="background: var(--color-background)">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-scanlines" />

    <!-- 底部状态栏 -->
    <div class="absolute bottom-0 left-0 right-0 z-20 cp-statusbar" style="height: 32px; background: color-mix(in srgb, var(--color-card) 90%, transparent); border-top: 1px solid var(--color-border)">
      <div class="flex items-center justify-between h-full px-4" style="font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace">
        <div class="flex items-center gap-4">
          <span class="text-xs" style="color: var(--color-accent)">SECT</span>
          <span class="text-xs opacity-50" style="color: var(--color-muted-foreground)">ICON::{{ icon }}</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs opacity-50" style="color: var(--color-muted-foreground)">LINE: {{ slide.index + 1 }}</span>
          <span class="text-xs cp-blink" style="color: #00ff88">&#9679; ACTIVE</span>
        </div>
      </div>
    </div>

    <div class="absolute z-10 flex flex-col items-center justify-center" style="inset: 0">
      <!-- Icon diamond -->
      <div class="cp-icon-diamond">
        <span class="cp-icon-glyph">{{ icon }}</span>
      </div>

      <!-- Terminal prompt -->
      <div class="cp-terminal-prompt mt-6">
        <span class="cp-mono" style="color: #00ff88">root@system</span>
        <span class="cp-mono" style="color: var(--color-foreground)">:</span>
        <span class="cp-mono" style="color: var(--color-accent)">~/chapters</span>
        <span class="cp-mono" style="color: var(--color-foreground)">$ </span>
        <span class="cp-mono" style="color: var(--color-heading)">cat section</span>
        <span class="cp-cursor-blink cp-mono" style="color: var(--color-accent)">&#9608;</span>
      </div>

      <!-- 章节标题 -->
      <h2 v-if="slide.title" class="cp-section-title">{{ slide.title }}</h2>

      <!-- 副标题/描述 -->
      <div v-if="slide.html" v-html="slide.html" class="cp-section-sub" />

      <!-- 输出分隔线 -->
      <div class="mt-6 flex items-center gap-2 opacity-40 max-w-xl w-full">
        <span class="cp-mono text-xs" style="color: var(--color-muted-foreground)">OUTPUT</span>
        <div class="flex-1" style="height: 1px; background: repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 4px, transparent 4px, transparent 8px)" />
        <span class="cp-mono text-xs" style="color: var(--color-muted-foreground)">EOF</span>
      </div>
    </div>

    <!-- 右侧竖排装饰 -->
    <div class="absolute right-4 top-1/4 bottom-1/3 pointer-events-none opacity-15">
      <div class="cp-mono text-xs cp-vertical-text" style="color: var(--color-accent); writing-mode: vertical-rl; letter-spacing: 0.3em">
        SYS_LOG_v4.2.1_SECTION_ICON
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.05) 3px,
    rgba(0, 0, 0, 0.05) 6px
  );
}

.cp-mono {
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

.cp-icon-diamond {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--color-card) 80%, transparent);
  border: 2px solid var(--color-accent);
  box-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 30%, transparent), 0 0 60px color-mix(in srgb, var(--color-accent) 10%, transparent), inset 0 0 20px color-mix(in srgb, var(--color-accent) 5%, transparent);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.cp-icon-glyph {
  font-size: 2.5rem;
  color: var(--color-accent);
  text-shadow: 0 0 15px var(--color-accent);
}

.cp-terminal-prompt {
  font-size: calc(0.9rem * var(--content-scale));
  letter-spacing: 0.02em;
  opacity: 0.85;
}

.cp-cursor-blink {
  animation: cp-cursor 0.8s step-end infinite;
}

@keyframes cp-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cp-section-title {
  font-size: calc(3.5rem * var(--content-scale));
  font-weight: 900;
  line-height: 1.1;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 50px var(--color-accent), 0 0 100px color-mix(in srgb, var(--color-accent) 30%, transparent);
  text-transform: uppercase;
  text-align: center;
  margin-top: 0.5rem;
}

.cp-section-sub :deep(h1),
.cp-section-sub :deep(h2),
.cp-section-sub :deep(h3),
.cp-section-sub :deep(h4) {
  display: none;
}

.cp-section-sub :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-muted-foreground);
  line-height: 1.7;
  margin-top: 1rem;
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 10px color-mix(in srgb, var(--color-accent) 8%, transparent);
}

.cp-blink { animation: cp-blink 1.5s step-end infinite; }

@keyframes cp-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.cp-vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.55rem;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  text-shadow: 0 0 8px var(--color-accent);
}
</style>
