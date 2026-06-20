<script setup lang="ts">
import type { Slide } from '../../../types/slides'

defineProps<{ slide: Slide }>()
</script>

<template>
  <div class="holo-content relative flex items-center justify-center w-full h-full overflow-hidden" style="background: var(--color-background)">
    <!-- ============ 网格地面参考线 ============ -->
    <div class="absolute bottom-0 left-0 w-full pointer-events-none opacity-[0.03]" style="height: 40%;">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holoFloorGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <line x1="0" y1="50" x2="50" y2="0" stroke="var(--color-accent)" stroke-width="0.5"/>
            <line x1="25" y1="50" x2="25" y2="0" stroke="var(--color-accent)" stroke-width="1"/>
            <line x1="0" y1="50" x2="50" y2="50" stroke="var(--color-accent)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoFloorGrid)" />
      </svg>
    </div>

    <!-- ============ 左侧仪表盘面板 ============ -->
    <div class="absolute z-10 holo-dash-left">
      <div class="holo-dash-indicator active">
        <span class="holo-dash-dot"></span>
        <span class="holo-dash-label">SYS</span>
      </div>
      <div class="holo-dash-indicator">
        <span class="holo-dash-dot"></span>
        <span class="holo-dash-label">NET</span>
      </div>
      <div class="holo-dash-indicator">
        <span class="holo-dash-dot"></span>
        <span class="holo-dash-label">DAT</span>
      </div>
      <div class="holo-dash-divider"></div>
      <div class="holo-dash-indicator warn">
        <span class="holo-dash-tri"></span>
        <span class="holo-dash-label">SIG</span>
      </div>
    </div>

    <!-- ============ 中央六边形内容卡片 ============ -->
    <div class="relative z-20 holo-hex-card-wrapper">
      <!-- 外围浮动钻石装饰 -->
      <span class="holo-float-diamond" style="--fx: -20px; --fy: -30px; --fd: 3s;"></span>
      <span class="holo-float-diamond" style="--fx: 40px; --fy: 20px; --fd: 4s; opacity: 0.5;"></span>
      <span class="holo-float-diamond" style="--fx: -35px; --fy: 35px; --fd: 3.5s; opacity: 0.7;"></span>
      <span class="holo-float-diamond" style="--fx: 25px; --fy: -25px; --fd: 4.5s; opacity: 0.4;"></span>

      <!-- 六边形卡片 -->
      <div class="holo-hex-card">
        <div v-html="slide.html" class="holo-content-prose"></div>
      </div>
    </div>

    <!-- ============ 右侧仪表盘面板 ============ -->
    <div class="absolute z-10 holo-dash-right">
      <div class="holo-dash-data-block">
        <span class="holo-dash-data-value">98%</span>
        <span class="holo-dash-data-label">LOAD</span>
      </div>
      <div class="holo-dash-divider"></div>
      <div class="holo-dash-data-block">
        <span class="holo-dash-data-value">44ms</span>
        <span class="holo-dash-data-label">LAT</span>
      </div>
      <div class="holo-dash-divider"></div>
      <div class="holo-dash-bars">
        <span class="holo-dash-bar" style="height: 12px;"></span>
        <span class="holo-dash-bar active" style="height: 28px;"></span>
        <span class="holo-dash-bar" style="height: 18px;"></span>
        <span class="holo-dash-bar active" style="height: 32px;"></span>
        <span class="holo-dash-bar" style="height: 22px;"></span>
      </div>
    </div>

    <!-- ============ 底角扫描数据 ============ -->
    <div class="absolute bottom-4 left-4 z-10 holo-bottom-data">
      <span class="holo-data-text">FRAME: {{ String(Date.now() % 100000).padStart(5, '0') }}</span>
      <span class="holo-data-sep">|</span>
      <span class="holo-data-text">TARGET: ACQ</span>
    </div>
  </div>
</template>

<style scoped>
/* ===== 六边形卡片包裹 ===== */
.holo-hex-card-wrapper {
  width: 720px;
  max-width: 80vw;
  position: relative;
}

/* ===== 六边形卡片 ===== */
.holo-hex-card {
  padding: 2.5rem 4rem 6.5rem;
  background: var(--color-card);
  clip-path: polygon(
    30% 2%, 70% 2%, 95% 12%, 98% 40%, 98% 70%,
    95% 88%, 70% 98%, 30% 98%, 5% 88%, 2% 70%,
    2% 40%, 5% 12%
  );
  border: none;
  position: relative;
}

.holo-hex-card::before {
  content: '';
  position: absolute;
  inset: 2px;
  clip-path: polygon(
    30% 2%, 70% 2%, 95% 12%, 98% 40%, 98% 70%,
    95% 88%, 70% 98%, 30% 98%, 5% 88%, 2% 70%,
    2% 40%, 5% 12%
  );
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--color-accent) 15%, transparent) 0%,
    transparent 50%,
    color-mix(in srgb, var(--color-h1-to) 10%, transparent) 100%);
  z-index: -1;
}

/* ===== 浮动钻石 ===== */
.holo-float-diamond {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color-accent);
  transform: rotate(45deg);
  top: 50%;
  left: 50%;
  animation: holo-float var(--fd, 3s) ease-in-out infinite alternate;
}

@keyframes holo-float {
  0% { transform: rotate(45deg) translate(0, 0); }
  100% { transform: rotate(45deg) translate(var(--fx, 20px), var(--fy, 20px)); }
}

/* ===== 左侧仪表盘面板 ===== */
.holo-dash-left {
  left: 3%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0.75rem;
  background: color-mix(in srgb, var(--color-card) 80%, transparent);
  border: 1px solid var(--color-border);
  clip-path: polygon(0 8px, 100% 0, 100% calc(100% - 8px), 0 100%);
}

.holo-dash-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.holo-dash-dot {
  width: 8px;
  height: 8px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: var(--color-accent);
  opacity: 0.3;
}

.holo-dash-indicator.active .holo-dash-dot {
  opacity: 1;
  box-shadow: var(--holo-glow);
  animation: holo-dot-blink 2s ease-in-out infinite;
}

.holo-dash-tri {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 7px solid var(--color-h1-to);
}

.holo-dash-label {
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.holo-dash-indicator.active .holo-dash-label,
.holo-dash-indicator.warn .holo-dash-label {
  color: var(--color-accent);
}

.holo-dash-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
  margin: 0.25rem 0;
}

/* ===== 右侧仪表盘面板 ===== */
.holo-dash-right {
  right: 3%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: color-mix(in srgb, var(--color-card) 80%, transparent);
  border: 1px solid var(--color-border);
  clip-path: polygon(0 0, 100% 8px, 100% 100%, 0 calc(100% - 8px));
}

.holo-dash-data-block {
  text-align: center;
}

.holo-dash-data-value {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-accent);
  text-shadow: var(--holo-glow);
}

.holo-dash-data-label {
  display: block;
  font-size: 0.45rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-muted-foreground);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.holo-dash-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 32px;
}

.holo-dash-bar {
  width: 5px;
  background: color-mix(in srgb, var(--color-accent) 20%, transparent);
  transition: height 0.3s ease;
}

.holo-dash-bar.active {
  background: var(--color-accent);
  box-shadow: var(--holo-glow);
}

/* ===== 底部数据 ===== */
.holo-bottom-data {
  font-size: 0.55rem;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  gap: 0.5rem;
}

.holo-data-text {
  color: var(--color-muted-foreground);
  opacity: 0.5;
}

.holo-data-sep {
  color: var(--color-accent);
  opacity: 0.2;
}

/* ===== 内容样式 ===== */
.holo-content-prose :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.2;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
}

.holo-content-prose :deep(h3) {
  font-size: var(--fs-h3);
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1.25rem;
  text-align: center;
  color: var(--color-heading);
  font-family: 'JetBrains Mono', monospace;
}

.holo-content-prose :deep(p) {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--color-foreground);
}

.holo-content-prose :deep(ul),
.holo-content-prose :deep(ol) {
  padding-left: 0;
  margin: 1rem 0;
  list-style: none;
}

.holo-content-prose :deep(li) {
  font-size: var(--fs-body-sm);
  margin-bottom: 0.6rem;
  line-height: 1.7;
  padding-left: 2rem;
  position: relative;
}

.holo-content-prose :deep(li)::before {
  content: '\25B6';
  position: absolute;
  left: 0;
  top: 0.35em;
  font-size: 0.6em;
  color: var(--color-accent);
}

.holo-content-prose :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: normal;
  background: color-mix(in srgb, var(--color-accent) 6%, transparent);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 0);
}

.holo-content-prose :deep(code) {
  padding: 0.2rem 0.5rem;
  font-size: 0.9em;
  font-family: 'JetBrains Mono', monospace;
}

.holo-content-prose :deep(pre) {
  overflow-x: auto;
}

.holo-content-prose :deep(h1) {
  background: linear-gradient(135deg, var(--color-h1-from), var(--color-h1-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.holo-content-prose :deep(a) {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-accent);
}

holo-content-prose :deep(img) {
    max-width: 60%;
    max-height: 40vh;
    display: block;
    margin: 1rem auto;
    object-fit: contain;
  }

@keyframes holo-dot-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
