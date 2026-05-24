# MD 实时渲染 PPT 项目

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
**直接双击打开 `dist/index.html`**

编辑 MD 后更新步骤：
1. 编辑 `dist/xxx.md` 文件并保存
2. 在浏览器底部控制栏点击 **🔄 刷新图标**
3. 选择编辑后的 MD 文件
4. 立即看到更新！

> 💡 提示：MD 文件已复制到 dist 根目录，方便编辑和重新加载

## 配置

编辑 `.env` 切换 MD 文件和资源路径：

```
VITE_MD_FILE_PATH=test-slides.md
VITE_ASSETS_PATH=assets
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
