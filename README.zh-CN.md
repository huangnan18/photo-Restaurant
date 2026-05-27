# 拾光 · 摄影集

[![Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://jiaofu-lilac.vercel.app)
[![Next.js](https://img.shields.io/npm/v/next/latest?label=Next.js)](https://nextjs.org)

纯静态个人摄影博客——CSS 瀑布流、拍立得卡片、书信体排版。JSON 驱动内容，sharp 管线优化图片，Vercel CDN 分发。

[线上预览](https://jiaofu-lilac.vercel.app)

## 截图

首页瀑布流，CSS columns 实现，桌面 3 列/平板 2 列/手机 1 列。拍立得卡片 nth-child 随机旋转，hover 回正并放大。照片全局 sepia 褪色滤镜，hover 恢复全饱和度。

照片详情页，大图采用暗房放大印相边框，故事部分使用书信体排版，横格纸底纹、红色边距线、手写体落款。

[在线 Demo](https://jiaofu-lilac.vercel.app)

## 特性

- CSS columns 瀑布流，不依赖 JS 布局库——额外体积 0KB
- sharp 图片管线：每张原图生成 400/800/1200/2400w 四个尺寸、WebP + JPEG 双格式。单张 800w WebP 平均 89KB，相比原图节省约 90% 带宽
- 首屏前 8 张卡片 `fetchpriority=high` 预加载，其余 `loading=lazy` + native srcset 响应式
- 全静态构建，10 张和 1000 张照片的页面结构一致——纯 HTML + CSS，无运行时开销
- 内容存于 JSON 文件，编辑后 `git push` 上线，无需 CMS 或数据库
- 双层 SVG 噪点纹理 + CSS 径向渐晕 + sepia 滤镜模拟胶片暗房效果

## 适用场景

- 个人摄影作品集：数据自控，不依赖 Instagram/Flickr 等平台
- 旅行博客：按专题组织相册，每张照片带书信体故事
- 胶片作品展示：设计语言本身呼应模拟摄影的质感

## 部署

### Vercel（一键）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/1829317945/photo-blog)

### 手动部署

需要 Node.js 20+。

```bash
git clone https://github.com/1829317945/photo-blog
cd photo-blog
npm install
npm run optimize        # 先跑图片优化
npm run build           # 构建静态站点
```

`out/` 目录可直接部署到任意静态托管服务（Nginx、GitHub Pages、Cloudflare Pages）。

`npm run build` 默认包含图片优化步骤，部署到 Vercel 时自动执行。后续每次 `git push` 触发自动构建。

## 配置

无需环境变量，无需外部服务。内容通过 `content/` 目录的 JSON 文件管理。

## 添加内容

### 照片

编辑 `content/photos.json`：

```json
{
  "slug": "my-photo",
  "title": "作品标题",
  "image": "photos/2026/06/my-photo.jpg",
  "date": "2026-06-01",
  "location": "拍摄地点",
  "story": "照片配文——显示在详情页的书信体中。",
  "album": "album-slug",
  "camera": "Leica M6",
  "lens": "Summicron 35mm f/2"
}
```

然后将原始照片放入 `originals/` 对应路径，运行：

```bash
npm run optimize   # sharp 多尺寸 WebP/JPEG + LQIP
npm run dev        # 本地预览
```

### 专题

编辑 `content/albums.json`：

```json
{
  "slug": "album-slug",
  "title": "专题名称",
  "description": "简短描述",
  "cover": "photos/2026/06/cover.jpg",
  "type": "travel"
}
```

照片的 `album` 字段与专题 `slug` 对应时自动归组。

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 16 App Router |
| 渲染 | 纯静态 (SSG)，`generateStaticParams` 生成所有动态路由 |
| 样式 | Tailwind CSS v4 + custom.css |
| 字体 | Playfair Display / Noto Serif SC / Georgia / Long Cang |
| 图片 | sharp (multi-size WebP/JPEG + LQIP base64) |
| 部署 | Vercel CDN |

```
jiaofu/
├── content/                  # 内容（JSON）
│   ├── photos.json
│   └── albums.json
├── originals/                # 原始照片（gitignore）
├── public/images/            # 优化后图片（入 git，CDN 分发）
├── scripts/
│   └── optimize-images.mjs   # sharp 图片管线
├── src/
│   ├── app/                  # 5 个路由页面
│   │   ├── page.tsx                  # 首页瀑布流
│   │   ├── photo/[slug]/page.tsx     # 照片详情（书信体）
│   │   ├── albums/page.tsx           # 专题索引
│   │   ├── album/[slug]/page.tsx     # 专题详情
│   │   └── about/page.tsx            # 关于
│   ├── components/           # 5 个 React 组件
│   └── lib/                  # 工具函数
└── next.config.ts
```

## 致谢

感谢每一位驻足的观众。这些光影碎片，因你的目光而完整。
