# MD2PPT — Markdown 实时渲染 PPT

## AI 生成 PPT（推荐）

使用内置 `/md2ppt` skill，将演讲稿交给 AI 自动提炼要点并生成带布局标记的 PPT：

1. 准备一份纯文本演讲稿（.md）
2. 在对话中输入 `/md2ppt` 并提供演讲稿
3. AI 自动分析内容结构 → **提炼要点**（长句变短语，段落变关键词）→ 添加 `{layout: xxx}` 标记 → 输出 `-ppt.md` 文件
4. 将生成的 `-ppt.md` 设为 `.env` 中的 `VITE_MD_FILE_PATH`
5. `npm run dev` 预览效果

> 💡 **演讲稿 ≠ 展示稿**：PPT 是视觉锚点不是提词器。11 种布局自动匹配：cover / section / content / two-column / stats / quote / code-full / media-hero / comparison / timeline / list

## 使用方式

```bash
npm install
npm run dev      # 开发模式 → http://localhost:5173
npm run build    # 生产构建到 dist/
npm run preview  # 预览构建结果
```

编辑 MD 文件后自动刷新（HMR）。

### 打包后使用

| 平台 | 启动方式 | 依赖 |
|------|---------|------|
| **Windows** | 双击 `dist/start.bat` | PowerShell（系统自带） |
| **macOS** | 双击 `dist/start.command` | Perl（系统自带） |
| **Linux** | 终端执行 `bash dist/start.sh` | Perl（系统自带） |

> 全部单文件零依赖。`start.bat` 内嵌 PowerShell 服务器，`start.command` / `start.sh` 内嵌 Perl 服务器。

> 构建时根据当前系统自动选择对应脚本。如需跨平台分发，手动复制 `scripts/` 下其他脚本即可。

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

### 内容定稿后

HTML 文件内置了打包时的 MD 内容，**无需服务器**。直接双击 `index.html` 即可全屏演示。

## 配置

编辑 `.env`：

```env
VITE_MD_FILE_PATH=md/slides-ppt.md
VITE_ASSETS_PATH=md/assets
```

## 幻灯片拆分

原则：**宁可一页少，不能一页多**。

| 触发行 | 行为 |
|--------|------|
| `#` / `##` / `###` / `####` | 每个标题独立成页 |
| `---` 水平线 | **全局分页符** |
| `<video>` / `<img>` 标签 | 单独抽出全屏页 |
| ` ``` ` 代码块 | 内部不受分页影响 |

## 布局类型（11 种）

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

```markdown
### 方案对比 {layout: comparison}

**传统方案**
- ❌ 部署复杂
- ❌ 维护困难

**创新方案**
- ✅ 一键部署
- ✅ 自动化运维
```

## 模板套件 & 主题（7 套）

底部控制栏 **短按循环 / 长按面板直达**：

| 套件 | 风格 |
|------|------|
| **Realtime Beats** | 现代科技风，WebGL 动态背景，玻璃拟态 |
| **Animal Island** | 自然治愈风，暖调配色，圆角卡片 |
| **Holo Sci-Fi** | 全息科幻风，霓虹配色，六边形几何 |
| **Pixel Island** | 复古像素游戏风，宝可梦 / 星露谷美学 |
| **Water Ink** | 中国水墨风，宣纸纹理，竖排书法 |
| **Cyberpunk 2077** | 赛博朋克风，终端 HUD，霓虹暗夜 |
| **Pixel Retro** | 8-bit NES 美学，像素级精确边框 |

每套自带 4 种配色主题。新增套件：`src/kits/` 下新建目录 → `index.ts` → 注册到 `kits/index.ts`。

## 快捷键

| 键 | 功能 |
|----|------|
| `←` `→` 空格 PageUp/Down | 翻页 |
| Home / End | 首尾页 |
| Tab | 全局预览 |
| F | 全屏 |
| P | 自动播放 |
| K / T / A / S | 套件 / 主题 / 动画 / 缩放 |
| 数字键 | 跳转指定页 |
| 鼠标滚轮 / 触摸滑动 | 翻页 |

## Dock 控制栏

- 翻页 / 全屏 / 预览 / **自动播放（3s）** / 套件 / 主题 / 动画 / 缩放
- 非全屏始终显示，全屏 3s 无操作自动隐藏
- 套件/主题/动画/缩放：短按循环下一个，长按弹出面板滑动选择

## 技术栈

- **Vue 3** Composition API `<script setup>` + TypeScript
- **Vite** + **Tailwind CSS v4** `@tailwindcss/vite`
- **marked** + **shiki** — MD 解析 & Dracula 代码高亮
- **自定义 Vite 插件** — `virtual:slides` 虚拟模块 + HMR
- **unplugin-auto-import / unplugin-vue-components** — 自动导入
- **vite-plugin-singlefile** — 单文件打包
