<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-media w-full h-full" style="background: #000">
    <!-- 扫描线叠加 -->
    <div class="absolute inset-0 pointer-events-none z-10 cp-cam-scanlines" />

    <!-- ═══ 监控摄像头取景框 ═══ -->
    <div class="relative z-0 w-full h-full flex items-center justify-center" style="padding: 2rem">
      <!-- 媒体内容 -->
      <div class="cp-cam-frame">
        <div v-html="slide.html" class="cp-media-content" />

        <!-- ═══ HUD 覆盖层 ═══ -->

        <!-- 四角 bracket（取景框） -->
        <div class="cp-cam-bracket cp-cam-br-tl" />
        <div class="cp-cam-bracket cp-cam-br-tr" />
        <div class="cp-cam-bracket cp-cam-br-bl" />
        <div class="cp-cam-bracket cp-cam-br-br" />

        <!-- 十字准星 -->
        <div class="cp-crosshair" />

        <!-- 顶部信息条 -->
        <div class="cp-cam-info-top">
          <div class="flex items-center gap-3">
            <span class="cp-rec-dot cp-rec-pulse" />
            <span class="cp-mono cp-rec-text">REC</span>
          </div>
          <span class="cp-mono cp-cam-label">CAM-07</span>
          <span class="cp-mono cp-cam-timestamp">{{ new Date().toISOString().slice(0, 19).replace('T', ' ') }} UTC</span>
        </div>

        <!-- 底部状态条 -->
        <div class="cp-cam-info-bottom">
          <div class="flex items-center gap-4">
            <span class="cp-mono cp-cam-stat">RES: 4K</span>
            <span class="cp-mono cp-cam-stat">FPS: 60.0</span>
            <span class="cp-mono cp-cam-stat">IR: ON</span>
            <span class="cp-mono cp-cam-stat">ZOOM: 1.0x</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="cp-cam-waveform">
              <span v-for="n in 8" :key="n" class="cp-cam-wf-bar cp-cam-wf-anim" :style="{ animationDelay: (n * 0.08) + 's' }" />
            </span>
            <span class="cp-mono cp-cam-stat">AUDIO: -3dB</span>
          </div>
        </div>

        <!-- 角标：target lock 框线 -->
        <div class="cp-target-lock" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace; }

/* 监控扫描线 */
.cp-cam-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.02) 2px,
    rgba(255, 255, 255, 0.02) 4px
  );
}

/* 取景框 */
.cp-cam-frame {
  position: relative;
  max-width: 90%;
  max-height: 80%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba(0, 0, 0, 0.3);
}

/* 四角 bracket */
.cp-cam-bracket {
  position: absolute;
  width: 30px; height: 30px;
  pointer-events: none;
  z-index: 20;
}
.cp-cam-br-tl { top: 6px; left: 6px; border-top: 3px solid rgba(255,255,255,0.6); border-left: 3px solid rgba(255,255,255,0.6); box-shadow: -1px -1px 6px rgba(255,255,255,0.3); }
.cp-cam-br-tr { top: 6px; right: 6px; border-top: 3px solid rgba(255,255,255,0.6); border-right: 3px solid rgba(255,255,255,0.6); box-shadow: 1px -1px 6px rgba(255,255,255,0.3); }
.cp-cam-br-bl { bottom: 6px; left: 6px; border-bottom: 3px solid rgba(255,255,255,0.6); border-left: 3px solid rgba(255,255,255,0.6); box-shadow: -1px 1px 6px rgba(255,255,255,0.3); }
.cp-cam-br-br { bottom: 6px; right: 6px; border-bottom: 3px solid rgba(255,255,255,0.6); border-right: 3px solid rgba(255,255,255,0.6); box-shadow: 1px 1px 6px rgba(255,255,255,0.3); }

/* 十字准星 */
.cp-crosshair {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 40px; height: 40px;
  pointer-events: none;
  z-index: 20;
  opacity: 0.5;
}

.cp-crosshair::before {
  content: '';
  position: absolute;
  top: 50%; left: 0; right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 4px rgba(255,255,255,0.4);
}

.cp-crosshair::after {
  content: '';
  position: absolute;
  left: 50%; top: 0; bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 4px rgba(255,255,255,0.4);
}

/* 录制指示器 */
.cp-rec-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #ff0000;
  box-shadow: 0 0 10px #ff0000, 0 0 20px rgba(255, 0, 0, 0.5);
}

.cp-rec-pulse { animation: cp-rec-pulse 1s ease-in-out infinite; }

@keyframes cp-rec-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.cp-rec-text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #ff0000;
  text-shadow: 0 0 8px rgba(255, 0, 0, 0.6);
}

/* 顶部信息条 */
.cp-cam-info-top {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 20;
  pointer-events: none;
}

.cp-cam-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  text-shadow: 0 0 6px rgba(255,255,255,0.3);
  letter-spacing: 0.1em;
  background: rgba(0,0,0,0.4);
  padding: 2px 6px;
}

.cp-cam-timestamp {
  font-size: 0.6rem;
  color: rgba(255,255,255,0.5);
  background: rgba(0,0,0,0.4);
  padding: 2px 6px;
}

/* 底部状态条 */
.cp-cam-info-bottom {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 20;
  pointer-events: none;
  background: rgba(0,0,0,0.5);
  padding: 4px 8px;
}

.cp-cam-stat {
  font-size: 0.55rem;
  color: rgba(255,255,255,0.5);
}

/* 波形 */
.cp-cam-waveform {
  display: flex;
  align-items: flex-end;
  gap: 1px;
  height: 16px;
}

.cp-cam-wf-bar {
  width: 3px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1px;
}

.cp-cam-wf-anim { animation: cp-wf-anim 0.6s ease-in-out infinite; }

@keyframes cp-wf-anim {
  0%, 100% { height: 4px; }
  50% { height: 12px; }
}

/* target lock */
.cp-target-lock {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 80px; height: 80px;
  pointer-events: none;
  z-index: 19;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  opacity: 0.3;
  animation: cp-target-scan 4s linear infinite;
}

@keyframes cp-target-scan {
  0% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.8); }
  50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.2); }
}

/* 媒体内容样式 */
.cp-media-content :deep(video) {
  width: 100%;
  height: auto;
  display: block;
}

.cp-media-content :deep(img) {
  max-width: 100%;
  display: block;
  object-fit: contain;
}
</style>
