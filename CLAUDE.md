# MD 实时渲染 PPT 项目

## AI 生成 PPT（推荐）

使用内置 `/md2ppt` skill，将演讲稿交给 AI 自动生成带布局标记的 PPT：

1. 准备一份纯文本演讲稿（.md）
2. 在对话中输入 `/md2ppt` 并提供演讲稿
3. AI 自动分析内容结构 → 添加 `{layout: xxx}` 标记 → 输出 `-ppt.md` 文件
4. 将生成的 `-ppt.md` 设为 `.env` 中的 `VITE_MD_FILE_PATH`
5. `npm run dev` 预览效果

> 💡 12 种布局自动匹配：cover / section / content / two-column / stats / quote / code-full / image-grid / media-hero / comparison / timeline / list

## 使用方式

### 开发模式（推荐）
```bash
npm run dev      # 开发模式 → http://localhost:5173
```
- ✅ 编辑 MD 文件后自动刷新
- ✅ 热模块替换（HMR），无需手动刷新

### 生产构建
```bash
npm run build    # 生产构建到 dist/
npm run preview  # 预览构建结果
```

### 打包后使用

**双击 `dist/start.bat`**（PowerShell 零依赖本地服务器）

```
dist/
├── start.bat           ← 双击启动
├── slides-ppt.md      ← 编辑这个
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

## 配置

编辑 `.env` 切换 MD 文件和资源路径：

```env
# MD 文件路径（相对于项目根目录）
VITE_MD_FILE_PATH=md/slides-ppt.md

# 资源目录路径（相对于项目根目录）
VITE_ASSETS_PATH=md/assets
```

## 幻灯片拆分规则

原则：**宁可一页少，不能一页多**。

| 触发行 | 行为 |
|--------|------|
| `##` / `###` / `####` 标题 | 每个标题独立成页 |
| `<video>` / `<img>` 标签 | 单独抽出一页，全屏铺满 |
| `---` 水平线 | 分页点 |
| ` ``` ` 代码块 | 内部内容受保护，不触发分页 |

## 幻灯片模板

| 类型 | 判断规则 | 组件 |
|------|---------|------|
| cover | 首页以 `# ` 开头 | `SlideCover.vue` |
| section | 标题为主，正文 `< 100` 字符 | `SlideSection.vue` |
| code | 代码块占比 > 40% | `SlideCode.vue` |
| media | 含 `<video>` / `<img>` | `SlideMedia.vue` |
| content | 默认 | `SlideContent.vue` |

## 主题

`src/themes/` 目录，JSON 格式。新增主题只需：

1. 复制已有 JSON 文件，修改色值
2. 在 `index.ts` 中 import 并加入数组

切换顺序 = 数组排列顺序。

## 快捷键

| 键 | 功能 |
|----|------|
| `←` `→` 空格 PageUp/Down | 翻页 |
| Home / End | 首尾页 |
| ESC | 全局预览 |
| F | 全屏 |
| 数字键 | 跳转 |
| 鼠标滚轮 | 翻页 |
| 触摸滑动 | 翻页 |

## 架构

- **Vue 3 + TypeScript + Vite 8** — Composition API `<script setup>`
- **Tailwind CSS v4** — `@tailwindcss/vite` 插件
- **marked** — MD 解析，`v-html` 渲染
- **自定义 Vite 插件** — `virtual:slides` 虚拟模块 + 文件监听 + HMR + 资源中间件
- **Auto-imports** — `unplugin-auto-import`（Vue API）+ `unplugin-vue-components`（组件自动注册）
