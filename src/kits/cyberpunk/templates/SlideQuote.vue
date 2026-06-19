<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="cp-quote w-full h-full" style="background: #000a00">
    <!-- 密集扫描线 -->
    <div class="absolute inset-0 pointer-events-none z-0 cp-phosphor-scan" />

    <!-- 绿色荧光屏边框 -->
    <div class="absolute inset-4 pointer-events-none" style="border: 1px solid rgba(0, 255, 65, 0.2); box-shadow: inset 0 0 60px rgba(0, 255, 65, 0.05)" />

    <!-- 四角 bracket — 磷光绿 -->
    <div class="absolute top-6 left-6 w-10 h-10 pointer-events-none cp-phosphor-bracket-tl" />
    <div class="absolute top-6 right-6 w-10 h-10 pointer-events-none cp-phosphor-bracket-tr" />
    <div class="absolute bottom-6 left-6 w-10 h-10 pointer-events-none cp-phosphor-bracket-bl" />
    <div class="absolute bottom-6 right-6 w-10 h-10 pointer-events-none cp-phosphor-bracket-br" />

    <div class="relative z-10 w-full h-full flex flex-col" style="padding: 3rem 4rem">

      <!-- ═══ 顶部：传输协议头 ═══ -->
      <div class="cp-transmission-header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="cp-mono text-sm cp-phosphor-blink" style="color: #00ff41">⬡</span>
            <span class="cp-mono" style="font-size: 0.7rem; color: #00ff41; letter-spacing: 0.15em">DECRYPTED MESSAGE</span>
          </div>
          <div class="cp-mono" style="font-size: 0.6rem; color: rgba(0, 255, 65, 0.5)">
            CLASSIFICATION: <span style="color: #00ff41">OMEGA-BLACK</span>
          </div>
        </div>
        <div class="cp-header-line mt-2" />
      </div>

      <!-- ═══ 中间：引文（传输正文） ═══ -->
      <div class="flex-1 flex items-center justify-center" style="padding: 2rem 0">
        <div class="cp-transmission-body">
          <!-- 左侧传输标签 -->
          <div class="cp-mono cp-label-left" style="font-size: 0.5rem; color: rgba(0, 255, 65, 0.3)">
            SRC: NODE_7F.33.01<br/>
            ENC: AES-256<br/>
            CHK: VALID
          </div>

          <!-- 引文内容 — 绿色磷光 -->
          <div class="cp-quote-text-wrap">
            <div class="cp-quote-marker cp-mono" style="color: rgba(0, 255, 65, 0.4)">BEGIN TRANSMISSION</div>
            <div v-html="slide.html" class="cp-quote-prose" />
            <div class="cp-quote-marker cp-mono mt-3" style="color: rgba(0, 255, 65, 0.4)">END TRANSMISSION</div>
          </div>

          <!-- 右侧传输标签 -->
          <div class="cp-mono cp-label-right" style="font-size: 0.5rem; color: rgba(0, 255, 65, 0.3)">
            DST: NODE_9C.7A.02<br/>
            DEC: 0.003ms<br/>
            SIG: +12dB
          </div>
        </div>
      </div>

      <!-- ═══ 底部：信号指数量 ═══ -->
      <div class="cp-signature-bar">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="cp-mono" style="font-size: 0.55rem; color: rgba(0, 255, 65, 0.4)">SIGNAL</span>
            <div class="cp-signal-strength">
              <div v-for="n in 8" :key="n" class="cp-signal-block cp-signal-anim" :style="{
                height: (n * 10 + 4) + '%',
                opacity: n > 5 ? 1 : n > 3 ? 0.6 : 0.3,
                animationDelay: (n * 0.1) + 's'
              }" />
            </div>
            <span class="cp-mono" style="font-size: 0.55rem; color: #00ff41">98%</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="cp-mono" style="font-size: 0.55rem; color: rgba(0, 255, 65, 0.4)">NOISE</span>
            <div class="cp-noise-wave">
              <div v-for="n in 6" :key="n" class="cp-noise-dot cp-noise-anim" :style="{ animationDelay: (n * 0.15) + 's' }" />
            </div>
            <span class="cp-mono" style="font-size: 0.55rem; color: rgba(0, 255, 65, 0.6)">0.02%</span>
          </div>
        </div>
      </div>

      <!-- 扫描线束（横贯） -->
      <div class="cp-scan-beam" />
    </div>
  </div>
</template>

<style scoped>
.cp-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace; }

/* 磷光扫描线 — 更密的绿色 CRT 感 */
.cp-phosphor-scan {
  background:
    repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 255, 65, 0.03) 1px, rgba(0, 255, 65, 0.03) 2px),
    repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(0, 255, 65, 0.01) 120px, rgba(0, 255, 65, 0.01) 121px);
}

/* Phosphor brackets */
.cp-phosphor-bracket-tl { border-top: 2px solid rgba(0, 255, 65, 0.5); border-left: 2px solid rgba(0, 255, 65, 0.5); box-shadow: -1px -1px 8px rgba(0, 255, 65, 0.2); }
.cp-phosphor-bracket-tr { border-top: 2px solid rgba(0, 255, 65, 0.5); border-right: 2px solid rgba(0, 255, 65, 0.5); box-shadow: 1px -1px 8px rgba(0, 255, 65, 0.2); }
.cp-phosphor-bracket-bl { border-bottom: 2px solid rgba(0, 255, 65, 0.5); border-left: 2px solid rgba(0, 255, 65, 0.5); box-shadow: -1px 1px 8px rgba(0, 255, 65, 0.2); }
.cp-phosphor-bracket-br { border-bottom: 2px solid rgba(0, 255, 65, 0.5); border-right: 2px solid rgba(0, 255, 65, 0.5); box-shadow: 1px 1px 8px rgba(0, 255, 65, 0.2); }

.cp-phosphor-blink { animation: cp-phosphor-blink 4s step-end infinite; }

@keyframes cp-phosphor-blink {
  0%, 90%, 100% { opacity: 1; }
  92%, 96% { opacity: 0.1; }
}

/* 头部线 */
.cp-header-line {
  height: 2px;
  background: repeating-linear-gradient(90deg, #00ff41 0, #00ff41 4px, transparent 4px, transparent 8px);
  opacity: 0.4;
}

/* 传输正文区 */
.cp-transmission-body {
  display: flex;
  gap: 2rem;
  align-items: center;
  width: 100%;
}

.cp-label-left { writing-mode: vertical-rl; text-orientation: mixed; flex-shrink: 0; }
.cp-label-right { writing-mode: vertical-rl; text-orientation: mixed; flex-shrink: 0; }

.cp-quote-text-wrap {
  flex: 1;
  text-align: center;
}

.cp-quote-marker {
  font-size: 0.6rem;
  letter-spacing: 0.2em;
}

.cp-quote-prose :deep(h3) {
  font-size: var(--fs-caption);
  font-weight: 500;
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: rgba(0, 255, 65, 0.6);
  font-family: 'JetBrains Mono', monospace;
}

.cp-quote-prose :deep(blockquote),
.cp-quote-prose :deep(p) {
  font-size: var(--fs-quote);
  font-weight: 300;
  line-height: 1.6;
  text-align: center;
  font-style: normal;
  border: none;
  margin: 0;
  color: #00ff41;
  font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
  text-shadow: 0 0 15px #00ff41, 0 0 40px rgba(0, 255, 65, 0.5);
}

/* 信号强度 */
.cp-signal-strength {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 18px;
}

.cp-signal-block {
  width: 4px;
  background: #00ff41;
  border-radius: 1px 1px 0 0;
  box-shadow: 0 0 4px #00ff41;
}

.cp-signal-anim { animation: cp-signal-pulse 2s ease-in-out infinite; }

@keyframes cp-signal-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 噪音指示器 */
.cp-noise-wave { display: flex; gap: 3px; align-items: flex-end; height: 12px; }

.cp-noise-dot {
  width: 2px;
  height: 6px;
  background: #00ff41;
  opacity: 0.5;
  box-shadow: 0 0 3px #00ff41;
}

.cp-noise-anim { animation: cp-noise-flicker 0.8s ease-in-out infinite; }

@keyframes cp-noise-flicker {
  0%, 100% { opacity: 0.3; height: 4px; }
  30% { opacity: 0.8; height: 10px; }
  60% { opacity: 0.5; height: 6px; }
}

/* 扫描光束 */
.cp-scan-beam {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.3), transparent);
  box-shadow: 0 0 15px rgba(0, 255, 65, 0.5), 0 2px 6px rgba(0, 255, 65, 0.1);
  animation: cp-scan-beam 4s linear infinite;
  pointer-events: none;
}

@keyframes cp-scan-beam {
  0% { top: 0%; }
  100% { top: 100%; }
}

.cp-signature-bar {
  border-top: 1px solid rgba(0, 255, 65, 0.15);
  padding-top: 1rem;
}
</style>
