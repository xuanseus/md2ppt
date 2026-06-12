<p align="center">
  <img src="public/favicon.png" width="80" alt="Logo" />
</p>

<h1 align="center">MD2PPT</h1>
<p align="center">Markdown → 横向翻页网页 PPT</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" />
</p>

---

## 这是什么

**MD2PPT** 是一个把 Markdown 实时渲染为横向翻页网页 PPT 的工具。写 MD，浏览器里看效果，构建后是单个 HTML 文件，双击就能打开。

**核心亮点**：内置 `/md2ppt` skill，把演讲稿扔给 AI，自动生成带布局标记的 PPT。

## AI 生成 PPT（推荐流程）

```
你（演讲稿） → AI（/md2ppt） → 带标签的 MD → 浏览器实时预览
```

### 第一步：准备演讲稿

写一份纯文本 Markdown 演讲稿，不需要任何布局标记：

```markdown
# 我的演讲标题

## 开场

大家好，今天我要介绍...

## 核心数据

用户增长 80%，收入翻倍...

## 技术架构

采用了微服务架构...
```

### 第二步：AI 自动生成

在 Claude Code 中输入 `/md2ppt`，把演讲稿内容粘贴进去。AI 会自动：

- 🔍 分析内容结构（封面、章节、数据、代码、对比…）
- 🏷️ 添加 `{layout: xxx}` 布局标记
- 📝 输出 `xxx-ppt.md` 文件

### 第三步：预览效果

```bash
# 将生成的 -ppt.md 设为源文件
# 编辑 .env → VITE_MD_FILE_PATH=../my-speech-ppt.md

npm run dev
```

浏览器打开 `http://localhost:5173`，用 ← → 键翻页查看效果。

## 快速开始

```bash
npm install
npm run dev        # 开发 → http://localhost:5173
```

编辑 MD 文件，浏览器自动刷新。

```bash
npm run build      # 构建到 dist/
npm run preview    # 预览构建结果
```

## 打包后使用

构建产物在 `dist/` 目录，根据需求选择使用方式：

### 方式一：需要继续编辑内容 → 用 BAT 启动

**双击 `dist/start.bat`**（PowerShell 零依赖本地服务器）

```
dist/
├── start.bat           ← 双击启动
├── slides-ppt.md       ← 编辑这个
└── assets/
    ├── index.html
    ├── serve.ps1
    └── favicon.png
```

1. 双击 `start.bat` → PowerShell 起本地服务器 + 自动打开浏览器
2. 编辑 `dist/slides-ppt.md` 并保存 → 500ms 内浏览器自动刷新
3. 关闭终端窗口 → 服务器自动停止
4. 再次双击 `start.bat` → 检测到已运行则只打开浏览器，不重复启动

> 💡 原理：页面每 500ms `fetch('./slides-ppt.md')` 检测变化，有改动自动重新渲染。

### 方式二：内容已定稿 → 只保留 HTML

HTML 文件内置了打包时的 MD 内容，**无需服务器、无需 MD 文件**。

- **无图片** → 一个 `index.html` 就够
- **有图片** → `index.html` + 图片文件（保持相对路径）

直接双击 `index.html` 即可全屏演示。

## 配置

编辑 `.env`：

```env
# MD 文件路径（相对于项目根目录）
VITE_MD_FILE_PATH=md/slides-ppt.md

# 资源目录路径（相对于项目根目录）
VITE_ASSETS_PATH=md/assets
```

## 幻灯片拆分

| 触发行 | 效果 |
|--------|------|
| `#` / `##` / `###` / `####` | 每个标题独立成页 |
| `---` | 分页点 |
| `<video>` / `<img>` | 单独抽出全屏页，行末加 `{layout: media-hero}` |
| ` ``` ` 代码块 | 内部不受分页影响 |

## 布局类型

在标题后加 `{layout: xxx}` 指定布局，共 12 种：

| 布局 | 用途 |
|------|------|
| `cover` | 封面 / 结束页 |
| `section` | 章节过渡 |
| `content` | 标准内容 |
| `two-column` | 左右两列 |
| `stats` | 数据大字报 |
| `quote` | 大段引用 |
| `code-full` | 代码展示 |
| `image-grid` | 图片网格 |
| `media-hero` | 视频 / 大图 |
| `comparison` | 方案对比 |
| `timeline` | 时间线 |
| `list` | 特性列表 |

示例：

```markdown
### 核心数据 {layout: stats}

**80%**

用户增长率，较去年同期翻倍
```

媒体示例（标题 + `---` 分隔 + 媒体行末尾标签）：

```markdown
## 演示视频

---

<video src="./assets/demo.mp4" controls></video> {layout: media-hero}
```

## 快捷键

| 键 | 功能 |
|----|------|
| `←` `→` 空格 PageUp/Down | 翻页 |
| Home / End | 首尾页 |
| ESC | 全局预览 |
| F | 全屏 |
| 数字键 | 跳转指定页 |
| 鼠标滚轮 / 触摸滑动 | 翻页 |

## 主题

`src/themes/` 下为 JSON 格式主题文件。新增主题：复制已有 JSON → 修改色值 → 在 `index.ts` 中注册。

## 技术栈

- **Vue 3** Composition API `<script setup>`
- **TypeScript** + **Vite 8**
- **Tailwind CSS v4** `@tailwindcss/vite`
- **marked** + **shiki** — MD 解析 & 代码高亮
- **自定义 Vite 插件** — `virtual:slides` 虚拟模块 + HMR
- **unplugin-auto-import / unplugin-vue-components** — 自动导入
- **vite-plugin-singlefile** — 单文件打包

---

<p align="center">MIT</p>
