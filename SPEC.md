# 摄影博客 SPEC

## 项目概述

个人摄影作品展示博客。胶片复古风格，像翻阅一本旧相册或打开一封手写信 —— 温暖、手工感、有故事。

---

## 设计系统

### 配色

| 用途 | 色值 | 说明 |
|---|---|---|
| 页面底色 | `#faf6f0` | 暖奶油色，避免纯白 |
| 卡片底色 | `#fffef9` | 偏暖白，模拟相纸 |
| 主文字 | `#3d3226` | 深褐，不刺眼 |
| 辅助文字 | `#8b7e6a` | 暖灰，日期/地点等 |
| 强调色 | `#c75b39` | 锈红，链接/悬停 |
| 浅边框 | `#e5ddd0` | 分割线/内阴影 |

### 字体

| 用途 | 字体 | 备选 |
|---|---|---|
| 英文标题 | Playfair Display | Georgia |
| 中文标题 | Noto Serif SC (思源宋体) | 系统 serif |
| 正文 | Georgia | Noto Serif SC |
| 手写点缀 | Long Cang | — |

### 质感

- 极淡 SVG 噪点纸纹覆盖背景
- 照片默认微褪色 (`contrast(0.96) saturate(0.9)`)，hover 恢复全饱和度
- 卡片纸质感阴影：暖色多层 box-shadow

---

## 页面结构

### 1. 照片列表（首页 `/`）

瀑布流布局 + 拍立得卡片。

- **布局**：CSS columns 瀑布流，桌面 3 列 → 平板 2 列 → 手机 1 列
- **卡片**：白色拍立得边框（四边白边，下方更宽模拟签名区），nth-child 微旋转 ±1.5°，hover 回正 + 放大
- **图片**：首屏 6-8 张预加载，其余懒加载 + 模糊占位图渐入
- **信息**：手写体标题 + 日期/地点

### 2. 照片详情（`/photo/[slug]`）

**书信风格** —— 如同一封寄给读者的信。

- 上部：大图（带拍立得白框）
- 下部：书信排版 —— 称呼、正文故事、落款（日期 + 地点）
- 底部：前后篇翻页链接

### 3. 专题索引（`/albums`）

相册合集入口，封面网格展示。

- 组织维度：按地点/旅行、按时间
- 每个专题一张封面图 + 标题 + 简介

### 4. 专题详情（`/album/[slug]`）

复用瀑布流组件，按专题过滤照片。

### 5. 关于（`/about`）

书信体自述 + 联系方式。

---

## 内容模型

### 照片 (`content/photos.json`)

```json
[
  {
    "slug": "morning-mist",
    "title": "晨雾",
    "image": "photos/2024/11/morning-mist.jpg",
    "date": "2024-11-15",
    "location": "黄山",
    "story": "那天凌晨四点摸黑上山...",
    "album": "shan-chuan-ji-xing",
    "camera": "Leica M6",
    "lens": "Summicron 35mm f/2"
  }
]
```

| 字段 | 必填 | 说明 |
|---|---|---|
| slug | 是 | URL 标识，唯一 |
| title | 是 | 照片标题 |
| image | 是 | 原始图片路径（相对于 originals/） |
| date | 是 | 拍摄日期 |
| location | 否 | 拍摄地点 |
| story | 否 | 文字故事（书信正文） |
| album | 否 | 所属专题 slug |
| camera | 否 | 相机型号 |
| lens | 否 | 镜头型号 |

### 专题 (`content/albums.json`)

```json
[
  {
    "slug": "shan-chuan-ji-xing",
    "title": "山川纪行",
    "description": "2024年的几次登山旅行",
    "cover": "photos/2024/11/morning-mist.jpg",
    "type": "travel"
  }
]
```

| 字段 | 必填 | 说明 |
|---|---|---|
| slug | 是 | URL 标识 |
| title | 是 | 专题名称 |
| description | 否 | 简短介绍 |
| cover | 是 | 封面图路径 |
| type | 否 | travel 或 time |

---

## 技术架构

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | Next.js (App Router) + TypeScript | 页面路由、静态生成 |
| 样式 | Tailwind CSS + 自定义 CSS | 布局用 Tailwind，特效（拍立得/书信）用 CSS |
| 内容 | JSON 文件 | 编辑后重新构建部署 |
| 图片存储 | Cloudflare R2 | 无穷流出流量费，10GB 免费 |
| 图片处理 | sharp (构建脚本) | 多尺寸 WebP/JPEG + LQIP 占位图 |
| 部署 | Vercel | 代码托管 + 自动部署，100GB 带宽/月免费 |

### 图片管线

```
原始照片 (originals/)
  ↓ 不上传 git
scripts/optimize-images.mjs (sharp)
  ↓ 生成 400w / 800w / 1200w / 2400w WebP + JPEG
  ↓ 生成 20×20 LQIP base64
上传至 Cloudflare R2 / 或放入 public/images/
```

### 加载策略

| 场景 | 策略 |
|---|---|
| 瀑布流首屏（前 6-8 张） | `fetchpriority="high"`，无懒加载 |
| 瀑布流其余 | `loading="lazy"` + LQIP 占位 → 原图淡入 |
| 详情页大图 | `priority` 预加载，2400w 尺寸 |
| 响应式 | `<picture>` + `srcset`，浏览器按屏幕宽度自选尺寸 |
| 格式 | 优先 WebP，`<picture>` 回退 JPEG |

### 目录结构

```
jiaofu/
├── content/
│   ├── photos.json
│   └── albums.json
├── originals/              # 原始照片（不入 git）
│   └── photos/
│       └── 2024/
│           └── 11/
│               └── morning-mist.jpg
├── public/
│   └── images/             # 构建生成的优化图片
├── scripts/
│   └── optimize-images.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # 首页（照片列表）
│   │   ├── photo/[slug]/page.tsx       # 照片详情
│   │   ├── albums/page.tsx             # 专题索引
│   │   ├── album/[slug]/page.tsx       # 专题详情
│   │   └── about/page.tsx              # 关于
│   ├── components/
│   │   ├── MasonryGallery.tsx
│   │   ├── PolaroidCard.tsx
│   │   ├── LetterLayout.tsx            # 书信体布局
│   │   ├── SiteHeader.tsx
│   │   └── SiteFooter.tsx
│   └── lib/
│       ├── photos.ts                   # 读取/过滤 photos.json
│       ├── albums.ts                   # 读取 albums.json
│       └── images.ts                   # 图片 URL 工具
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 构建与部署

### 开发

```bash
npm run dev          # 本地开发
npm run build        # 构建（含图片优化）
```

### 部署流程

```
本地编辑 content/*.json + 添加原始照片
  → npm run build（含图片优化）
  → git push
  → Vercel 自动部署
  → 图片上传至 R2（可选独立步骤）
```

### 不做的功能

- 评论区
- 暗色模式
- EXIF 自动解析（可后续加）
- CMS 后台
- RSS / 订阅
- 搜索

---

## 参考资料

- 视觉原型：`photos.html`（已实现，拍立得瀑布流 + 胶片复古配色）
- 配色与字体方案：本文档设计系统章节
