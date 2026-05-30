# 摄影博客 SPEC

## 项目概述

个人摄影作品展示博客。**暗房胶片负片美学** —— 深棕黑底、金棕点缀、整页 35mm 胶片框，像在暗房里端详一卷接触印相。冷静、克制、电影感。

> 早期为「暖色拍立得手账」风格（暖米白底 / 锈红 / 草书 / 随机旋转），现已翻新。
> **架构、数据模型、路由、图片管线、SSG 全部不变，只改设计层。**

---

## 重构 · 暗房胶片风

### 改 / 不改

**不动**
- `content/*.json` 数据模型与字段
- `src/lib/*`（photos / albums / images）全部函数签名
- 图片管线（`scripts/optimize-images.mjs`、`public/images/`）
- 所有路由与 `generateStaticParams`
- masonry 布局机制本身

**改**
- 设计令牌（亮米白 → 暗棕黑、暖橙 → 金棕）
- `custom.css` 全部效果（胶片框、颗粒、卡片、印样）
- 布局外壳：顶部居中导航 → 左侧竖排栏
- `PolaroidCard` 卡片样式 + EXIF 行
- 故事区：手写信纸 → 暗房印样
- 详情页 EXIF / 翻页样式
- 字体引入（去草书 Long Cang）

### 关键决策（已定）

1. **导航布局** → 左侧竖排固定栏（最还原设计图）。在 `layout.tsx` 加一层 flex 外壳，主内容右移；移动端折叠回顶部横条。
2. **故事区** → 暗房印样风：深底 + 金棕标题 + EXIF 落款，去掉信纸横线 / 红边线 / 草书。

---

## 设计系统

### 配色

设计令牌定义于 `globals.css` 的 `@theme` 块。

| 用途 | 色值 | 说明 |
|---|---|---|
| 页面底色 | `#15110d` | 深棕黑，暗房负片感 |
| 卡片底色 | `#211b14` | 略亮衬底 |
| 胶片框 | `#0c0a07` | 近黑，35mm 框 / 卡片边 |
| 主文字 | `#e7ddcb` | 暖米白正文 |
| 高亮标题 | `#f2ead8` | 标题最亮 |
| 辅助文字 | `#8f8472` | 暖灰，EXIF / 日期 |
| 强调色 | `#c8a45e` | 金棕，链接 / 帧号 / 下划线 |
| 边框 | `rgba(200,164,94,0.18)` | 金棕低透明分割线 |

### 字体

| 用途 | 字体 | 备选 |
|---|---|---|
| 英文标题 / 标签 | Playfair Display | Georgia |
| 中文标题 | Noto Serif SC (思源宋体) | 系统 serif |
| 正文 | Georgia | Noto Serif SC |
| EXIF / 帧号 | Playfair（letterspaced 小字） | Georgia |

> 草书 Long Cang 已移除：暗调电影感里手写体偏跳。

### 质感

- 极淡 SVG 颗粒覆盖（`mix-blend-mode: overlay`，暗底专用 —— multiply 会全黑）
- 加深暗角 vignette，营造负片边缘
- 整页 35mm 胶片框：齿孔条 + `KODAK PORTRA 400 · 拾光` 标记（桌面显示，移动端隐藏）
- 照片轻微去饱和（`contrast(0.96) saturate(0.9)`），去掉旧的 sepia 暖偏；hover 恢复全饱和
- 卡片用 `--color-frame` 近黑衬底，照片 `border-radius: 4px`，**去掉随机旋转**（工整接触印相风）

---

## 页面结构

### 整体外壳

**左侧竖排导航栏** + 右侧主内容。

- `layout.tsx` 包一层 flex 外壳：`<SiteSidebar />` + `<div class="content">{children}</div>`
- 侧栏固定宽 ~200px，`position: sticky`，含：顶部 logo「拾光 / a photography journal」、中部竖排导航（照片 / 相册 / 关于，金棕 active 态）、底部版权 + 照片计数
- 移动端（≤900px）：侧栏折叠回顶部横条，外壳改 `flex-direction: column`
- 整页叠加 `.film-frame` 35mm 胶片框（齿孔 + `KODAK PORTRA 400`），桌面显示

### 1. 照片列表（首页 `/`）

接触印相式瀑布流。

- **布局**：CSS columns 瀑布流，桌面 3 列 → 平板 2 列 → 手机 1 列
- **卡片**：`--color-frame` 近黑衬底，照片 `border-radius: 4px`，**无随机旋转**（工整接触印相），hover 轻微放大 + 恢复饱和
- **图片**：首屏 8 张预加载，其余懒加载
- **信息**：金棕 letterspaced 标题 + EXIF 行（地点 / 日期 / camera·lens）

### 2. 照片详情（`/photo/[slug]`）

**暗房印样风** —— 大图 + 印样落款，非手写信。

- 上部：大图（圆角 + 近黑印样框），可选竖排 EXIF（`writing-mode: vertical-rl`）
- 下部：故事正文 + 金棕标题 + EXIF 落款（地点 / camera·lens / 日期）
- 底部：前后篇翻页（描边方块按钮 + `01 / 12` 帧计数）

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
| 框架 | Next.js 16 (App Router) + TypeScript | 全静态生成（SSG） |
| 样式 | Tailwind CSS v4 + 自定义 CSS | 布局/排版用 Tailwind，特效（胶片框/印样）用 `custom.css` |
| 内容 | JSON 文件 | 编辑后重新构建部署 |
| 图片存储 | committed → Vercel CDN | sharp 优化后入 git，经 Vercel CDN 分发 |
| 图片处理 | sharp (构建脚本) | 多尺寸 WebP/JPEG |
| 部署 | Vercel | `git push main` 自动部署 |

### 图片管线

```
原始照片 (originals/，gitignored)
  ↓ npm run optimize (sharp)
public/images/ (committed)
  {slug}-{400,800,1200,2400}w.{webp,jpg}
  ↓ git push
Vercel CDN 分发
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
  → git push main
  → Vercel 自动部署（public/images/ 已入 git，随代码一同分发）
```

### 不做的功能

- 评论区
- 亮色模式（本身即暗调胶片风）
- EXIF 自动解析（手动填 camera / lens 字段）
- CMS 后台
- RSS / 订阅
- 搜索
- 底部缩略图胶片条 / 分类筛选（属加功能，本次重构不含）

---

## 参考资料

- 视觉参考：暗房胶片负片设计图（深棕黑 + 金棕 + 35mm 框 + 左侧竖排导航）
- 配色与字体方案：本文档设计系统章节
- 文件级改造清单：见 `CLAUDE.md`
