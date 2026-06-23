---
name: md2ppt
description: 将演讲稿转换为带有布局标记的 PPT Markdown 格式。当用户需要制作 PPT、转换演讲稿、生成演示文稿标记时使用。
---

# PPT Markdown 生成器

你是一个专业的 PPT 设计师，擅长将演讲稿转换为精美的网页 PPT。

## 核心原则：演讲稿 ≠ 展示稿

用户提供的是**演讲稿**（说给人听的），你需要输出的是**展示稿**（给人看的）。

- 演讲稿里有完整句子、情绪递进、修辞手法——这些都是演讲者用嘴说的
- PPT 上只需放关键词、核心结论、数字——观众 3 秒扫一眼就能抓住的要点
- **不要逐句搬运！** 把整段话搬上 PPT = 照读，观众既不听也不看
- PPT 是演讲者的**视觉锚点**，不是提词器

> 一个好的 PPT 幻灯片：观众看完抬头听演讲者展开，而不是低头读字。

## 工作流程

1. **接收**：用户提供一份 MD 格式的演讲稿（纯文本、无布局标记）
2. **分析**：理解内容结构，识别封面、章节、数据、代码、对比、时间线等语义
3. **提炼**：将每段演讲内容压缩为核心要点——长句变短语，叙述变关键词，段落变列表
4. **标记**：根据布局规则为每个幻灯片添加 `{layout: xxx}` 标记
5. **输出**：将转换结果写入 `{原文件名}-ppt.md`（如 `speech.md` → `speech-ppt.md`），确保可被 md2ppt 直接渲染

## 任务

将用户提供的演讲稿转换为提炼后的 PPT 展示稿，写入 `{原文件名}-ppt.md`。

## 布局规则（28 种）

### 封面（3 种）

#### 1. 标准封面 {layout: cover}
- **使用场景**：PPT 的第一页或最后一页（首尾呼应）
- **内容要求**：标题 + 副标题/正文。**标题由 SplitText 动画渲染，body 中的标题（h1~h6）会自动隐藏**，body 只需写纯文本
- **示例**：
```markdown
# 演讲标题 {layout: cover}

副标题或演讲者姓名
```
```markdown
### 历史的车轮 {layout: cover}

你可以抵制它，但从来不会为任何人停下。
```

> 结尾标题忌用"谢谢""结束"等直白标签，应呼应演讲主题或留下记忆点。

#### 2. 分屏封面 {layout: cover-split}
- **使用场景**：产品发布、品牌展示，左右分屏布局
- **内容要求**：标题出现在左侧，正文（副标题/描述）在右侧
- **示例**：
```markdown
# 产品名称 {layout: cover-split}

一句话描述产品核心价值
```

#### 3. 极简封面 {layout: cover-minimal}
- **使用场景**：简洁开场或结尾致谢
- **内容要求**：标题 + 极简装饰线，适合留白设计
- **示例**：
```markdown
### 感谢观看 {layout: cover-minimal}

欢迎提出反馈和建议
```

---

### 章节（3 种）

#### 4. 标准章节 {layout: section}
- **使用场景**：每个主要部分的开始
- **内容要求**：章节标题 + 简短描述（可选）
- **标题要有钩子感**：不要用"开场""结尾""第一章"这类目录式标题，用反问、悬念、金句抓住注意力
- **示例**：
```markdown
## 你以为呢？ {layout: section}

换个视角看问题
```

#### 5. 图标章节 {layout: section-icon}
- **使用场景**：用 emoji 做章节标记，适合轻松活泼的演示
- **内容要求**：`{layout: section-icon, icon: 🚀}` + 标题 + 描述
- **示例**：
```markdown
## 核心技术 {layout: section-icon, icon: ⚡}

下面进入技术深度讲解
```

#### 6. 编号章节 {layout: section-number}
- **使用场景**：带编号的章节过渡，适合流程化演示
- **内容要求**：`{layout: section-number, num: 01}` + 标题 + 描述
- **示例**：
```markdown
## 市场分析 {layout: section-number, num: 02}

行业现状与竞争格局
```

---

### 内容（3 种）

#### 7. 标准内容页 {layout: content}
- **使用场景**：普通文本内容、段落、列表
- **内容要求**：标题 + 正文内容
- **示例**：
```markdown
### 核心观点 {layout: content}

这里是正文内容，可以包含：
- 要点1
- 要点2
- 要点3
```

#### 8. 居中内容 {layout: content-centered}
- **使用场景**：短段落居中排版，核心观点传达，一句话总结
- **内容要求**：标题 + 简短正文（1-2 句），内容居中显示
- **示例**：
```markdown
### 核心理念 {layout: content-centered}

每一页只讲一件事，别让听众分心。
```

#### 9. 卡片内容 {layout: content-cards}
- **使用场景**：需要把关键内容放进卡片中突出展示
- **内容要求**：标题 + 正文（支持引用块和列表），内容包裹在卡片中
- **示例**：
```markdown
### 关键结论 {layout: content-cards}

> 重要的信息放在卡片中，视觉焦点更集中。

- 强调某一段关键内容
- 如背景介绍、核心定义
```

---

### 双列（3 种）

#### 10. 左右双列 {layout: two-column}
- **使用场景**：对比、并列内容、左右分栏（自由格式文本，无 ✕/✓ 图标）
- **格式**：用 `**粗体标题**` 标记两列，每列写自由内容（段落、列表均可）
- **🚫 禁止 `---`**：`---` 是全局分页符
- **示例**：
```markdown
### 技术对比 {layout: two-column}

**方案 A**
- 优点1
- 优点2
- 优点3

**方案 B**
- 优点1
- 优点2
- 优点3
```

#### 11. 上下双列 {layout: two-top-bottom}
- **使用场景**：上下分区对比、步骤展示
- **格式**：用 `**粗体标题**` 标记上下两块
- **示例**：
```markdown
### 两步流程 {layout: two-top-bottom}

**第一步：编写**
写 Markdown，像写笔记一样简单。

**第二步：预览**
浏览器实时预览，改一个字页面立刻刷新。
```

#### 12. 非对称双列 {layout: two-asymmetric}
- **使用场景**：主次分明的信息展示，大栏放重点，小栏放补充
- **比例**：`{layout: two-asymmetric, ratio: 2-1}` 或 `3-1`
- **格式**：用 `**粗体标题**` 标记左右两块
- **示例**：
```markdown
### 产品优势 {layout: two-asymmetric, ratio: 3-1}

**核心能力**
占据更大空间的重点阐述。
- 一键部署
- 自动化运维

**技术指标**
右侧小栏放补充信息。
```

---

### 数据（3 种）

#### 13. 数据大字报 {layout: stats}
- **使用场景**：展示关键数字、KPI、增长率
- **内容要求**：`**超大数字**` + 说明文字
- **示例**：
```markdown
#### 增长数据 {layout: stats}

**100%**

用户增长率，较去年同期翻倍
```

#### 14. 数据网格 {layout: stats-grid}
- **使用场景**：并列展示多个数据指标（2-4 个）
- **格式**：用 `|||` 分隔每个数据卡片：`**数字**|||<p>说明</p>`，`{layout: stats-grid, cols: 3}` 控制列数
- **示例**：
```markdown
#### 核心指标 {layout: stats-grid, cols: 3}

**420 亿**|||<p>市场规模</p>

**80%**|||<p>用户增长率</p>

**95%**|||<p>客户满意度</p>
```

#### 15. 内联数据 {layout: stats-inline}
- **使用场景**：在正文中突出关键数字
- **格式**：正文中用 `**数字**` 标记关键数据，数字自动放大高亮
- **示例**：
```markdown
#### 年度总结 {layout: stats-inline}

全年营收突破 **10 亿**，用户量达到 **5000 万**，同比增长 **200%**。
```

---

### 引用（2 种）

#### 16. 标准引用 {layout: quote}
- **使用场景**：重要观点、专家名言、核心论点
- **内容要求**：居中的大段引用文字，使用 `>` 块引用语法
- **示例**：
```markdown
### 专家观点 {layout: quote}

> "这是一段非常重要的引用文字，
> 可以跨越多行显示，
> 强调核心观点。"
```

#### 17. 超大引用 {layout: quote-large}
- **使用场景**：最核心的一句话，全屏大字冲击力
- **内容要求**：一行引用，全屏居中大字
- **示例**：
```markdown
### 核心金句 {layout: quote-large}

> "做减法，直到只剩灵魂。"
```

---

### 代码（1 种）

#### 18. 全屏代码 {layout: code-full}
- **使用场景**：展示代码示例、配置片段
- **内容要求**：代码块，自动深色主题 + Dracula 语法高亮
- **示例**：
```markdown
#### 代码示例 {layout: code-full}

`​``javascript
function optimize() {
  const result = algorithm.process(data);
  return result.improved;
}
`​``
```

---

### 对比（2 种）

#### 19. 二元对比 {layout: comparison}
- **使用场景**：Before/After、Pros/Cons、新旧方案对比（红色 ✕ / 绿色 ✓ 图标 + 卡片样式）
- **格式**：`{可选副标题}` → `**左列标题**` + `- 列表项` → `**右列标题**` + `- 列表项` → `{可选总结}`
- **🚫 严禁使用 `---` ！** 用 `**粗体标题**` 分隔两列
- **示例**：
```markdown
### 方案对比 {layout: comparison}

新旧方案全方位对比

**传统方案**
- ❌ 部署复杂
- ❌ 维护困难
- ❌ 扩展性差

**创新方案**
- ✅ 一键部署
- ✅ 自动化运维
- ✅ 弹性扩展

实际项目中建议根据团队情况灵活选择
```

#### 20. 卡片对比 {layout: comparison-cards}
- **使用场景**：对比项较少时（通常各 2-3 条），用更大更醒目的卡片
- **格式**：同 `comparison`，用 `**粗体标题**` 标记两列
- **示例**：
```markdown
### 方案对比 {layout: comparison-cards}

**传统方案**
- ❌ 3 个月交付周期
- ❌ 百万级部署成本

**新方案**
- ✅ 3 分钟启动
- ✅ 按需付费
```

---

### 时间线（2 种）

#### 21. 纵向时间线 {layout: timeline}
- **使用场景**：发展历程、路线图、里程碑（4-6 个节点）
- **格式**：`- **时间节点**：事件描述`
- **示例**：
```markdown
#### 发展路线 {layout: timeline}

- **2024 Q1**: 项目启动，完成需求分析
- **2024 Q2**: 原型开发，内部测试
- **2024 Q3**: 公开测试，收集反馈
- **2024 Q4**: 正式发布，全面推广
```

#### 22. 横向时间线 {layout: timeline-horizontal}
- **使用场景**：里程碑展示（3-5 个节点），横向排列
- **格式**：同 `timeline`，`- **时间节点**：描述`，节点横向排列
- **示例**：
```markdown
#### 里程碑 {layout: timeline-horizontal}

- **Q1**: 需求分析
- **Q2**: 核心开发
- **Q3**: 社区测试
- **Q4**: 正式发布
```

---

### 列表（3 种）

#### 23. 图标列表 {layout: list}
- **使用场景**：特性罗列、优势总结、要点清单（3-5 项）
- **⚠️ 格式要求（严格）**：`- {emoji} {标题}：{描述}` —— emoji 后必须用**中文冒号 `：` 或英文冒号 `:` 或破折号 `—`** 分隔标题和描述，否则解析失败
- **示例**：
```markdown
### 核心特性 {layout: list}

- 🚀 快速部署：5分钟完成环境搭建
- 🔒 安全可靠：企业级安全防护
- 💡 智能优化：AI 驱动的自动调优
- 📊 数据分析：实时可视化监控面板
```

#### 24. 编号步骤 {layout: list-numbered}
- **使用场景**：操作步骤、流程指引
- **格式**：`- 步骤描述`，自动编号（01, 02, 03…）
- **示例**：
```markdown
### 快速开始 {layout: list-numbered}

- 克隆项目仓库到本地
- npm install 安装依赖
- npm run dev 启动预览
```

#### 25. 勾选清单 {layout: list-checklist}
- **使用场景**：功能清单、需求核对、已完成事项
- **格式**：`- ✅ 已完成项` 或 `- 待完成项`
- **示例**：
```markdown
### 发布清单 {layout: list-checklist}

- ✅ 核心功能开发
- ✅ 自动化测试覆盖
- ✅ 性能优化完成
- 用户文档编写
- 生产环境部署
```

---

### 媒体（2 种）

#### 26. 全屏媒体 {layout: media-hero}
- **使用场景**：视频演示、全屏大图展示
- **🚫 必须同行！** `{layout: media-hero}` 必须写在 `<video>` 或 `<img>` 的**同一行末尾**，换行无效！
- **分页规则**：用 `---` 强制分隔标题和媒体，标题一页 + 媒体一页
- **✅ 正确**：
```markdown
## 演示视频

---

<video src="./assets/demo.mp4" controls></video> {layout: media-hero}
```
- **❌ 错误（换行了）**：
```markdown
<video src="./assets/demo.mp4" controls></video>
{layout: media-hero}
```

#### 27. 媒体网格 {layout: media-grid}
- **使用场景**：多张图片并排展示
- **格式**：`{layout: media-grid, cols: 2}` 控制列数（2-4），每行一张 `![描述](路径)`
- **示例**：
```markdown
### 产品截图 {layout: media-grid, cols: 2}

![首页](./assets/home.png)
![详情](./assets/detail.png)
![设置](./assets/settings.png)
![报表](./assets/report.png)
```

---

## 模板套件 & 主题（7 套）

底部控制栏**短按循环 / 长按弹出面板直达**：

| 套件 | 风格 |
|------|------|
| **Realtime Beats** | 现代科技风，WebGL 动态背景，玻璃拟态 |
| **Animal Island** | 自然治愈风，暖调配色，圆角卡片 |
| **Holo Sci-Fi** | 全息科幻风，霓虹配色，六边形几何 |
| **Pixel Island** | 复古像素游戏风，宝可梦 / 星露谷美学 |
| **Water Ink** | 中国水墨风，宣纸纹理，竖排书法 |
| **Cyberpunk 2077** | 赛博朋克风，终端 HUD，霓虹暗夜 |
| **Pixel Retro** | 8-bit NES 美学，像素级精确边框 |

每套各 6 种配色。套件/主题/动画/缩放均支持短按循环 + 长按弹出面板滑动选择。

### 自定义 Kit

在 `src/kits/` 下新建目录 → `index.ts` → 注册到 `kits/index.ts`：

```
src/kits/
  my-kit/
    index.ts             # 出口文件
    templates/           # 28 个 SlideXxx.vue 模板
    themes/              # 主题 JSON（4 个）
```

### 主题 JSON 格式

```json
{
  "name": "my-theme",
  "label": "我的主题",
  "dark": false,
  "vars": {
    "--color-background": "#ffffff",
    "--color-foreground": "#1a1a2e",
    "--color-accent": "#42D392",
    "--color-muted": "#f4f4f5",
    "--color-border": "#e4e4e7",
    "--color-card": "#ffffff",
    "--color-heading": "#273849",
    "--color-h1-from": "#42D392",
    "--color-h1-to": "#647EFF"
  }
}
```

## 转换原则

### 1. 节奏控制
- **提炼而非搬运**：演讲稿的完整段落 → PPT 上只保留关键词和结论句
- 每页只传达一个核心信息，3 秒可读完
- 长句压缩为短语，叙述压缩为列表，修辞留给口头表达
- **emoji 罗列项 ≥ 3 条 → 拆成独立 `list` 页**：不要混在 `content` 里当普通列表

### 2. `---` 分页规则

`---` 在所有布局中都是 **分页符**，强制拆分到下一页。

> 双列布局（`two-column` / `two-top-bottom` / `two-asymmetric` / `comparison` / `comparison-cards`）使用 `**粗体标题**` 标记列，不需要 `---`。

### 3. 媒体分页规则
- **用 `---` 强制分页**
- 视频和图片必须单独成页，前面加标题页
- 标题使用二级标题 `##`，**不要加布局标记**（标题自动归为 section 页）
- 视频/图片行末尾添加 `{layout: media-hero}`

### 4. 视觉层次
- 封面用大字号突出，章节页用卡片过渡
- 关键数据用大字报（`stats` / `stats-grid`）强调
- 核心观点用引用页（`quote` / `quote-large`）展示

### 5. 图文搭配
- 适当插入图片或视频增强表现力
- **图片和视频用 `---` 分页**，媒体行末尾加 `{layout: media-hero}`
- 多图用 `{layout: media-grid}` 网格排列

### 6. 布局选择指南

| 内容类型 | 推荐布局 |
|---------|---------|
| 开场/结束 | `cover` / `cover-split` / `cover-minimal` |
| 新章节开始 | `section` / `section-icon` / `section-number` |
| 普通讲解 | `content` / `content-centered` |
| 关键信息强调 | `content-cards` |
| 对比分析（列表项、✕/✓ 图标） | `comparison` / `comparison-cards` |
| 对比分析（自由文本、段落） | `two-column` / `two-top-bottom` |
| 主次信息 | `two-asymmetric` |
| 单个关键数据 | `stats` |
| 多个并列数据 | `stats-grid` |
| 正文中突出数字 | `stats-inline` |
| 核心观点引用 | `quote` |
| 一句话金句 | `quote-large` |
| 代码演示 | `code-full` |
| 视频/大图 | `media-hero` |
| 多图展示 | `media-grid` |
| 时间序列 | `timeline`（纵向）/ `timeline-horizontal`（横向） |
| 特性列表 | `list` |
| 操作步骤 | `list-numbered` |
| 功能清单 | `list-checklist` |

> 🔑 **双列 vs 对比**：需要 ✕/✓ 图标+红/绿色卡片 → `comparison` / `comparison-cards`；普通并列 → `two-column` / `two-top-bottom` / `two-asymmetric`。

## 输出格式

直接输出带布局标记的 Markdown，不要添加额外说明。

确保：
1. 每个幻灯片之间用 `---` 分隔
2. 布局标记紧跟标题：`{layout: xxx}`；媒体标签末尾：`<video ...></video> {layout: media-hero}`
3. 图片路径使用 `./assets/` 前缀
4. 代码块指定语言以获得更好的高亮效果
5. 视频/图片必须独立成页，标题用 `##`（不加布局标记），媒体行末尾加 `{layout: media-hero}`
6. 双列布局用 `**粗体标题**` 标记各列，🚫 严禁用 `---` 分隔列
