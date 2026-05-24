<p align="center">
  <img src="public/favicon.png" width="80" alt="Logo" />
</p>

<h1 align="center">MD2PPT</h1>
<p align="center">Markdown → 横向翻页网页 PPT / Horizontal Swipe Web Deck</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" />
</p>

---

## 中文

### 这是什么

**MD2PPT** 是一个把 Markdown 实时渲染为横向翻页网页 PPT 的工具。写 MD，浏览器里看效果，构建后是单个 HTML 文件，双击就能打开。

### 快速开始

```bash
npm install
npm run dev        # 开发 → http://localhost:5173
```

编辑 MD 文件，浏览器自动刷新。

```bash
npm run build      # 构建到 dist/
npm run preview    # 预览构建结果
```

构建产物 `dist/index.html` 可以直接双击打开，无需服务器。

### 配置

编辑 `.env`：

```env
VITE_MD_FILE_PATH=../slides.md
VITE_ASSETS_PATH=../assets
```

### 幻灯片拆分

| 触发行 | 效果 |
|--------|------|
| `#` / `##` / `###` / `####` | 每个标题独立成页 |
| `---` | 分页点 |
| `<video>` / `<img>` | 单独抽出全屏页 |
| ` ``` ` 代码块 | 内部不受分页影响 |

### 布局类型

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

### 快捷键

| 键 | 功能 |
|----|------|
| `←` `→` 空格 PageUp/Down | 翻页 |
| Home / End | 首尾页 |
| ESC | 全局预览 |
| F | 全屏 |
| 数字键 | 跳转指定页 |
| 鼠标滚轮 / 触摸滑动 | 翻页 |

### 主题

`src/themes/` 下为 JSON 格式主题文件。新增主题：复制已有 JSON → 修改色值 → 在 `index.ts` 中注册。

### 技术栈

- **Vue 3** Composition API `<script setup>`
- **TypeScript** + **Vite 8**
- **Tailwind CSS v4** `@tailwindcss/vite`
- **marked** + **shiki** — MD 解析 & 代码高亮
- **自定义 Vite 插件** — `virtual:slides` 虚拟模块 + HMR
- **unplugin-auto-import / unplugin-vue-components** — 自动导入
- **vite-plugin-singlefile** — 单文件打包

---

## English

### What is this

**MD2PPT** turns Markdown into a horizontal swipe web deck with live preview. Write MD, see the result in browser instantly, and build into a single self-contained HTML file.

### Quick Start

```bash
npm install
npm run dev        # Dev server → http://localhost:5173
```

Edit your MD file — the browser reloads automatically.

```bash
npm run build      # Build to dist/
npm run preview    # Preview the build
```

The output `dist/index.html` works by double-clicking — no server needed.

### Configuration

Edit `.env`:

```env
VITE_MD_FILE_PATH=../slides.md
VITE_ASSETS_PATH=../assets
```

### Slide Splitting Rules

| Trigger | Behavior |
|---------|----------|
| `#` / `##` / `###` / `####` | Each heading becomes its own slide |
| `---` | Slide break |
| `<video>` / `<img>` | Extracted to fullscreen slide |
| ` ``` ` fenced code block | Protected from splitting |

### Layout Types

Add `{layout: xxx}` after a heading to specify layout. 12 types available:

| Layout | Use case |
|--------|----------|
| `cover` | Title / closing slide |
| `section` | Chapter divider |
| `content` | Standard content |
| `two-column` | Side-by-side columns |
| `stats` | Big-number highlight |
| `quote` | Blockquote showcase |
| `code-full` | Code display |
| `image-grid` | Image gallery |
| `media-hero` | Video / hero image |
| `comparison` | Before / after |
| `timeline` | Milestone roadmap |
| `list` | Feature checklist |

Example:

```markdown
### Key Metrics {layout: stats}

**80%**

Year-over-year user growth rate
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` Space PageUp/Down | Navigate slides |
| Home / End | First / last slide |
| ESC | Overview mode |
| F | Fullscreen |
| Number keys | Jump to slide |
| Scroll / touch swipe | Navigate |

### Themes

JSON theme files live in `src/themes/`. To add one: duplicate an existing JSON → tweak colors → register in `index.ts`.

### Tech Stack

- **Vue 3** Composition API `<script setup>`
- **TypeScript** + **Vite 8**
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **marked** + **shiki** — Markdown parsing & syntax highlighting
- **Custom Vite plugin** — `virtual:slides` virtual module + HMR + asset middleware
- **unplugin-auto-import / unplugin-vue-components** — auto-imports
- **vite-plugin-singlefile** — single HTML output

---

<p align="center">MIT</p>
