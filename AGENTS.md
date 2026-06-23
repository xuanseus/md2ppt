# MD2PPT — Markdown 实时渲染 PPT

将 Markdown 实时渲染为横向翻页网页 PPT 的工具。写 MD，浏览器预览，构建后双击即用。

## AI 生成 PPT（推荐）

在对话中输入 `/md2ppt` 并提供演讲稿，AI 自动提炼要点并生成带布局标记的 PPT 文件。

将生成的 `-ppt.md` 设为 `.env` 中的 `VITE_MD_FILE_PATH`，然后 `npm run dev` 预览效果。

> 💡 **演讲稿 ≠ 展示稿**：PPT 是视觉锚点不是提词器。28 种布局 + 20 种 GSAP 动画预设。每套 6 种配色主题。

## 快速开始

```bash
npm install          # 安装依赖
npm run dev          # 开发 → http://localhost:5173
npm run build        # 构建到 dist/
npm run preview      # 预览构建产物
```

编辑 MD 文件后自动热更新（HMR）。构建产物的 `dist/index.html` 可直接双击全屏演示。

## 打包后使用

| 平台 | 启动方式 | 依赖 |
|------|---------|------|
| **Windows** | 双击 `dist/start.bat` | PowerShell（系统自带） |
| **macOS** | 双击 `dist/start.command` | Perl（系统自带） |
| **Linux** | 终端执行 `bash dist/start.sh` | Perl（系统自带） |

> 全部单文件零依赖，构建时自动选择对应平台脚本。

1. 双击启动脚本 → 自动打开浏览器
2. 编辑 `dist/slides-ppt.md` 并保存 → 500ms 内自动刷新
3. 关闭终端 → 服务器自动停止

内容定稿后直接双击 `index.html` 即可全屏演示，无需服务器。

## 配置 (.env)

```env
VITE_MD_FILE_PATH=md/slides-ppt.md   # MD 文件路径
VITE_ASSETS_PATH=md/assets           # 资源目录路径
```

## 幻灯片拆分规则

| 触发行 | 行为 |
|--------|------|
| `#` / `##` / `###` / `####` | 每个标题独立成页 |
| `---` 水平线 | **全局分页符** |
| `<video>` / `<img>` 标签 | 单独抽出全屏页 |
| ` ``` ` 代码块 | 内部不受分页影响 |

## 模板套件（7 套）

| 套件 | 风格 |
|------|------|
| **Realtime Beats** | 现代科技风，WebGL 动态背景，玻璃拟态 |
| **Animal Island** | 自然治愈风，暖调配色，圆角卡片 |
| **Holo Sci-Fi** | 全息科幻风，霓虹配色，六边形几何 |
| **Pixel Island** | 复古像素游戏风，宝可梦 / 星露谷美学 |
| **Water Ink** | 中国水墨风，宣纸纹理，竖排书法 |
| **Cyberpunk 2077** | 赛博朋克风，终端 HUD，霓虹暗夜 |
| **Pixel Retro** | 8-bit NES 美学，像素级精确边框 |

每套各 6 种配色。底部控制栏短按循环 / 长按面板直达。

## 布局类型（28 种）

在标题后加 `{layout: xxx}`，可附带 `{anim: xxx}` 动画标记：

| 类别 | 布局 | 用途 |
|------|------|------|
| **封面** | `cover` `cover-split` `cover-minimal` | 标准 / 分屏 / 极简 |
| **章节** | `section` `section-icon` `section-number` | 卡片 / 图标 / 编号 |
| **内容** | `content` `content-centered` `content-cards` | 标准 / 居中 / 卡片 |
| **双列** | `two-column` `two-top-bottom` `two-asymmetric` | 左右 / 上下 / 非对称 |
| **数据** | `stats` `stats-grid` `stats-inline` | 大字报 / 网格 / 内嵌 |
| **引用** | `quote` `quote-large` | 标准 / 全屏大字 |
| **代码** | `code-full` | 全屏代码 |
| **对比** | `comparison` `comparison-cards` | 二元 / 卡片 |
| **时间线** | `timeline` `timeline-horizontal` | 纵向 / 横向 |
| **列表** | `list` `list-numbered` `list-checklist` | 图标 / 编号 / 勾选 |
| **媒体** | `media-hero` `media-grid` | 全屏 / 网格 |

## 动画预设（20 种）

| 类别 | 预设 |
|------|------|
| **Entry** | `fade-in` `fade-in-up/down/left/right` `slide-in-up/left/right` `zoom-in` `zoom-out` `bounce-in` `flip-in-x/y` |
| **Stagger** | `stagger-fade-up/left/right` `stagger-scale` `stagger-bounce` |
| **Exit** | `fade-out` `slide-out-left` |

## Dock 控制栏

- 翻页 / 全屏 / 预览 / **自动播放（3s）** / 套件 / 主题 / 动画 / 缩放
- 非全屏始终显示，全屏 3s 无操作自动隐藏
- 套件/主题/动画/缩放：短按循环下一个，长按弹出面板滑动选择

## 快捷键

| 键 | 功能 |
|----|------|
| `←` `→` 空格 PageUp/Down | 翻页 |
| Tab | 全局预览 |
| F | 全屏 |
| P | 自动播放 |
| K / T / A / S | 套件 / 主题 / 动画 / 缩放 |
| 数字键 | 跳转指定页 |

## 技术栈

Vue 3 + TypeScript + Vite + Tailwind CSS v4 + marked + shiki

> 布局规则和转换细节见 `.agents/skills/md2ppt/SKILL.md`