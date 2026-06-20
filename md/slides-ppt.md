# MD2PPT — 让 Markdown 秒变演示文稿 {layout: cover}

写 MD，浏览器里看效果，构建后双击打开。

---

## 开始之前 {layout: section}

本演示覆盖全部 11 种布局模板，帮你快速了解每种页面的适用场景。

---

### 内容页 {layout: content}

这是最常用的标准内容页，适合放正文、列表和代码块。

#### 排版说明

正文字号自适应缩放系数，确保不同屏幕和距离都能看清。

- 列表项字号比正文略小，适合辅助说明
- 行高保持 1.6，密集内容也不拥挤
- 支持多级标题嵌套，结构清晰

---

### 两列布局 {layout: two-column}

**核心特性**

左侧放主要优势，右侧放补充说明，适合对比展示。

- 一键生成演示文稿
- 11 种布局开箱即用
- 代码语法自动高亮

**使用场景**

可根据实际需求灵活组合，轻松应对各种展示。

- 技术方案宣讲
- 项目成果汇报
- 个人作品展示

---

#### 数据大字报 {layout: stats}

**80%**

用户反馈，用 MD2PPT 后演示文稿制作时间缩短了八成

---

### 引用页 {layout: quote}

> "让工具跑起来只是开始。写 MD、看效果、调样式，整个过程都在浏览器里实时反馈。你不需要打开 PowerPoint，不需要拖拽文本框，只需要专注内容本身。"

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

代码块使用 Shiki 语法高亮，Dracula 配色，全局统一风格。

---

### 方案对比 {layout: comparison}

新旧方案全方位对比，帮你快速做出技术选型决策

**传统方案**
- ❌ 需要安装 PowerPoint 或 Keynote
- ❌ 手动调整文本框和图片位置
- ❌ 多人协作时格式容易混乱

**MD2PPT 方案**
- ✅ 纯 Markdown 编写，无需专业软件
- ✅ 布局自动适配，11 种模板一键切换
- ✅ Git 管理内容，协作从未如此简单

实际项目中建议根据团队情况灵活选择

---

#### 项目历程 {layout: timeline}

从构想到上线，每个阶段都稳步推进

- **2024 Q1**: 项目启动，完成需求分析和原型设计
- **2024 Q2**: 核心功能开发，11 种布局模板全部就绪
- **2024 Q3**: 公开测试，收集社区反馈并持续优化
- **2024 Q4**: 正式发布 v1.0，全面推广

---

### 产品特性 {layout: list}

四大核心能力，为开发者提供一站式演示方案

- 🚀 快速部署：克隆项目，npm install，1 分钟跑起来
- 🔒 代码高亮：Shiki 驱动，支持 20+ 编程语言
- 💡 实时预览：编辑 MD 文件，浏览器自动刷新
- 📊 模板丰富：cover / section / stats / timeline 等 11 种布局

更多功能持续迭代中，敬请期待

---

### 效果展示 {layout: content}

图片直接嵌入正文，content 布局自动处理排版：

![示例图片](./assets/img.png)

视频同样支持，拖入 MD 文件即可播放。

---

<video src="./assets/video.mp4" controls></video>

---

### 感谢观看 {layout: cover}

11 种布局测试完毕，欢迎提出反馈和建议。
