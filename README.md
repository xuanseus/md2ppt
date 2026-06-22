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

<p align="center">
  🌐 <a href="./README.en.md">English Version</a>
</p>

---

## 这是什么

**MD2PPT** 是一个把 Markdown 实时渲染为横向翻页网页 PPT 的工具。写 MD，浏览器里看效果，构建后双击打开。

**核心亮点**：内置 `/md2ppt` skill，把演讲稿扔给 AI，自动提炼要点并生成带布局标记的 PPT。PPT 是视觉锚点，不是提词器。

## AI 生成 PPT（推荐流程）

```
你（演讲稿） → AI（/md2ppt） → 带标签的 MD → 浏览器实时预览
```

### 第一步：准备演讲稿

写一份纯文本 Markdown，不需要任何布局标记：

```markdown
# 我的演讲标题

## 开场

大家好，今天我要介绍...

## 核心数据

用户增长 80%，收入翻倍...
```

### 第二步：AI 自动生成

在 Claude Code 中输入 `/md2ppt`，粘贴演讲稿。AI 自动：

- 🔍 分析内容结构（封面、章节、数据、代码、对比…）
- ✂️ **提炼要点**：长句变短语，段落变关键词
- 🏷️ 添加 `{layout: xxx}` 布局标记
- 📝 输出 `xxx-ppt.md` 文件

### 第三步：预览效果

```bash
# 将生成的 -ppt.md 设为源文件
# 编辑 .env → VITE_MD_FILE_PATH=../my-speech-ppt.md

npm run dev
```

浏览器打开 `http://localhost:5173`，用 ← → 键翻页查看。

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

### 方式一：需要继续编辑内容 → 启动本地服务器

| 平台 | 启动方式 | 依赖 |
|------|---------|------|
| **Windows** | 双击 `dist/start.bat` | PowerShell（系统自带） |
| **macOS** | 双击 `dist/start.command` | Perl（系统自带） |
| **Linux** | 终端执行 `bash dist/start.sh` | Perl（系统自带） |

> 全部单文件零依赖。`start.bat` 内嵌 PowerShell 服务器，`start.command` / `start.sh` 内嵌 Perl 服务器。

> 构建时根据当前系统自动选择对应脚本，无需手动挑选。

```
dist/
├── start.bat / .command / .sh  ← 对应平台的启动脚本（单文件内嵌服务器）
├── slides-ppt.md               ← 编辑这个
└── assets/
    ├── index.html
    └── favicon.png
```

1. 双击对应平台的启动脚本 → 自动打开浏览器
2. 编辑 `dist/slides-ppt.md` 并保存 → 500ms 内自动刷新
3. 关闭终端 → 服务器自动停止

> 💡 原理：页面每 500ms `fetch('./slides-ppt.md')` 检测变化，自动重新渲染。

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
| `---` | 全局分页符（所有布局生效） |
| `<video>` / `<img>` | 单独抽出全屏页，行末加 `{layout: media-hero}` |
| ` ``` ` 代码块 | 内部不受分页影响 |

## 布局类型（11 种）

在标题后加 `{layout: xxx}` 指定布局：

| 布局 | 用途 |
|------|------|
| `cover` | 封面 / 结束页 |
| `section` | 章节过渡 |
| `content` | 标准内容 |
| `two-column` | 左右两列（`**粗体**` 标记列标题） |
| `stats` | 数据大字报 |
| `quote` | 大段引用 |
| `code-full` | 代码展示 |
| `media-hero` | 视频 / 大图 |
| `comparison` | 方案对比（`**粗体**` + `- 列表`） |
| `timeline` | 时间线 |
| `list` | 特性列表 |

示例：

```markdown
### 核心数据 {layout: stats}

**80%**

用户增长率，较去年同期翻倍
```

两列 / 对比示例（`**粗体**` 标记列标题）：

```markdown
### 方案对比 {layout: comparison}

**传统方案**
- ❌ 部署复杂
- ❌ 维护困难

**创新方案**
- ✅ 一键部署
- ✅ 自动化运维
```

媒体示例：

```markdown
<video src="./assets/demo.mp4" controls></video>
```

## 模板套件 & 主题（7 套）

底部控制栏短按循环 / 长按弹出面板直达：

| 套件 | 风格 | 开源地址 |
|------|------|---------|
| **Realtime Beats** | 现代科技风，WebGL 动态背景，玻璃拟态 | [GitHub](https://github.com/anggiedimasta/ui) |
| **Animal Island** | 自然治愈风，暖调配色，圆角卡片 | [GitHub](https://github.com/guokaigdg/animal-island-vue) |
| **Holo Sci-Fi** | 全息科幻风，霓虹配色，六边形几何 | [GitHub](https://github.com/OviOvocny/Holo) |
| **Pixel Island** | 复古像素游戏风，宝可梦 / 星露谷美学 | [GitHub](https://github.com/shika-works/pixelium-design) |
| **Water Ink** | 中国水墨风，宣纸纹理，竖排书法 | [GitHub](https://github.com/shuimo-design/shuimo-ui) |
| **Cyberpunk 2077** | 赛博朋克风，终端 HUD，霓虹暗夜 | [GitHub](https://github.com/xuanseus/md2ppt) |
| **Pixel Retro** | 8-bit NES 美学，像素级精确边框 | [GitHub](https://github.com/maomentai817/pixel-ui) |

每套自带 4 种配色主题。新增套件：`src/kits/` 下新建目录 → `index.ts` → 注册到 `kits/index.ts`。

### 套件预览 / Kit Preview

| Animal Island | Realtime Beats | Pixel Island |
|:---:|:---:|:---:|
| ![Animal Island](docs/animal-island.png) | ![Beats](docs/beats.png) | ![Pixel Island](docs/pixelium.png) |
| 自然治愈风 | 现代科技风 | 复古像素游戏风 |

## 快捷键

| 键 | 功能 |
|----|------|
| `←` `→` 空格 PageUp/Down | 翻页 |
| Home / End | 首尾页 |
| Tab | 全局预览 |
| F | 全屏 |
| 数字键 | 跳转指定页 |
| 鼠标滚轮 / 触摸滑动 | 翻页 |
| P | 自动播放 |
| K / T / A / S | 套件 / 主题 / 动画 / 缩放 |

## Dock 控制栏

- 翻页 / 全屏 / 预览 / **自动播放（3s 间隔）** / 套件 / 主题 / 翻页动画 / 内容缩放
- 非全屏始终显示，全屏 3s 无操作自动隐藏
- 套件/主题/动画/缩放：短按循环，**长按弹出面板滑动选择**
- 7 种翻页动画：slide / fade / zoom / flip / pixel / reveal / none
- 3 档缩放：1x / 1.25x / 1.5x

## 技术栈

- **Vue 3** Composition API `<script setup>`
- **TypeScript** + **Vite**
- **Tailwind CSS v4** `@tailwindcss/vite`
- **marked** + **shiki** — MD 解析 & Dracula 代码高亮
- **自定义 Vite 插件** — `virtual:slides` 虚拟模块 + HMR
- **unplugin-auto-import / unplugin-vue-components** — 自动导入
- **vite-plugin-singlefile** — 单文件打包

---

<p align="center">MIT</p>

