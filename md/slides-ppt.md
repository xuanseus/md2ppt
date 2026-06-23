# MD2PPT — 让 Markdown 秒变演示文稿 {layout: cover, anim: fade-in-up}

写 MD，浏览器里看效果，构建后双击打开。

---

### 分屏封面 {layout: cover-split, anim: fade-in-left}

左边标题右边装饰，适合产品发布会开场。

---

## 章节过渡 {layout: section}

居中卡片 + StarBorder 动画边框，适合大章节切换。

---

## 图标章节 {layout: section-icon, icon: 🚀}

用 emoji 图标做章节标记，适合轻松活泼的演示。

---

## 开始之前 {layout: section-number, num: 01, anim: fade-in}

本演示覆盖 28 种布局模板 + 20 种动画预设。

---

### 内容页 {layout: content}

这是最常用的标准内容页，适合放正文、列表和代码块。

#### 排版说明

正文字号自适应缩放系数，确保不同屏幕和距离都能看清。

- 列表项字号比正文略小
- 行高保持 1.6，密集内容也不拥挤
- 支持多级标题嵌套

---

### 居中内容 {layout: content-centered}

短段落居中排版，适合核心观点传达。

每一页只讲一件事，别让听众分心。

---

### 卡片内容 {layout: content-cards}

> 重要信息放在玻璃卡片中，视觉焦点更集中。

- 适合强调某一段关键内容
- backdrop-filter 玻璃拟态效果

---

### 左右双列 {layout: two-column}

**核心特性**

左侧放主要优势，右侧放补充说明。

- 一键生成演示文稿
- 28 种布局开箱即用
- 代码语法自动高亮

**使用场景**

可根据实际需求灵活组合。

- 技术方案宣讲
- 项目成果汇报
- 个人作品展示

---

### 上下双列 {layout: two-top-bottom, anim: fade-in-up}

**第一步：编写**

写 Markdown，像写笔记一样简单，不需要打开 PowerPoint。

**第二步：预览**

浏览器实时预览，改一个字页面立刻刷新。

---

### 非对称双列 {layout: two-asymmetric, ratio: 2-1, anim: fade-in-left}

**主要内容**

占据更大空间的左侧栏，适合放重点阐述、核心理念或详细说明。

- 重点信息放在大栏
- 次要内容放在小栏
- 视觉层次一目了然

**补充说明**

右侧小栏放补充信息或关键词。

---

#### 数据大字报 {layout: stats, anim: zoom-in}

**80%**

用户反馈，用 MD2PPT 后演示文稿制作时间缩短了八成

---

#### 数据网格 {layout: stats-grid, cols: 3, anim: stagger-fade-up}

**420 亿**|||<p>市场规模，较去年同期增长 52%</p>

**80%**|||<p>目标用户已具备付费意愿</p>

**95%**|||<p>客户满意度持续领先行业</p>

---

#### 内联数据 {layout: stats-inline}

2026 年，产品月活突破 **1000 万**，付费转化率达 **12%**，季度营收 **2.5 亿**。

---

### 引用页 {layout: quote, anim: fade-in}

> "让工具跑起来只是开始。写 MD、看效果、调样式，整个过程都在浏览器里实时反馈。"

---

### 超大引用 {layout: quote-large, anim: zoom-in}

> "做减法，直到只剩灵魂。"

---

#### 全屏代码 {layout: code-full}

```python
def build_ppt(markdown_path: str):
    """读取 Markdown 文件，解析为幻灯片"""
    with open(markdown_path) as f:
        content = f.read()
    slides = split_into_slides(content)
    return render_deck(slides)
```

---

### 方案对比 {layout: comparison, anim: fade-in-up}

**传统方案**
- ❌ 需要安装 PowerPoint 或 Keynote
- ❌ 手动调整文本框和图片位置
- ❌ 多人协作时格式容易混乱

**MD2PPT 方案**
- ✅ 纯 Markdown 编写，无需专业软件
- ✅ 布局自动适配，28 种模板一键切换
- ✅ Git 管理内容，协作从未如此简单

---

### 卡片对比 {layout: comparison-cards, anim: fade-in-up}

**传统方案**
- ❌ 3 个月交付周期
- ❌ 百万级部署成本
- ❌ 无法在线协作

**MD2PPT 方案**
- ✅ 3 分钟启动
- ✅ 按需付费，零前期成本
- ✅ 实时协同编辑

---

#### 纵向时间线 {layout: timeline, anim: stagger-fade-up}

- **2024 Q1**: 项目启动，完成需求分析和原型设计
- **2024 Q2**: 核心功能开发，28 种布局模板全部就绪
- **2024 Q3**: 公开测试，收集社区反馈并持续优化
- **2024 Q4**: 正式发布 v1.0，全面推广

---

#### 横向里程碑 {layout: timeline-horizontal, anim: fade-in-up}

- **Q1 启动**: 需求分析
- **Q2 开发**: 模板就绪
- **Q3 测试**: 社区反馈
- **Q4 发布**: 全面推广

---

### 图标列表 {layout: list, anim: stagger-fade-up}

- 🚀 快速部署：克隆项目，npm install，1 分钟跑起来
- 🔒 代码高亮：Shiki 驱动，支持 20+ 编程语言
- 💡 实时预览：编辑 MD 文件，浏览器自动刷新
- 📊 模板丰富：28 种布局，20 种动画预设

---

### 编号步骤 {layout: list-numbered, anim: stagger-fade-up}

- 克隆项目仓库到本地
- npm install 安装依赖
- npm run dev 启动预览

---

### 勾选清单 {layout: list-checklist, anim: stagger-fade-up}

- ✅ 支持 Markdown 实时预览
- ✅ 28 种布局模板
- ✅ 20 种动画预设
- ✅ 7 套主题一键切换
- ✅ 单文件零依赖分发

---

### 媒体网格 {layout: media-grid, cols: 2}

![示例截图](./assets/img.png)
![示例截图](./assets/img.png)
![示例截图](./assets/img.png)
![示例截图](./assets/img.png)

---

### 效果展示 {layout: content}

图片直接嵌入正文，content 布局自动处理排版：

![示例图片](./assets/img.png)

---

<video src="./assets/video.mp4" controls></video>

---

### 感谢观看 {layout: cover-minimal, anim: zoom-in}

28 种布局 + 20 种动画，欢迎提出反馈和建议。
