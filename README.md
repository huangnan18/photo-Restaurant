# 拾光 · 摄影集

[https://img.shields.io/badge/deploy-Vercel-black?logo=vercel](https://jiaofu-lilac.vercel.app)
[https://img.shields.io/badge/stack-Next.js%2016-000](https://nextjs.org)
[https://img.shields.io/badge/static-SSG-blue](https://nextjs.org/docs/app/building-your-application/rendering/static-site-generation)

暗房胶片美学的个人摄影博客——CSS 瀑布流、拍立得卡片、书信体排版，零运行时依赖。

[线上预览](https://jiaofu-lilac.vercel.app) · [添加照片](#添加照片)

## 截图

首页瀑布流（桌面 3 列 / 平板 2 列 / 手机 1 列），拍立得卡片带手工旋转和胶片褪色滤镜。

照片详情页，大图使用暗房印相边框，故事部分采用书信体排版，横格纸底纹、红色边距线。

专题相册页，封面网格展示，支持按旅行/时间分组。

## 特性

- CSS columns 瀑布流 + nth-child 随机旋转，不依赖 JavaScript 布局库，0KB 额外体积
- sharp 多尺寸图片管线：每张照片生成 400/800/1200/2400w WebP + JPEG，总带宽节省约 60%
- 首屏 8 张 `fetchpriority=high` 预加载，其余 `loading=lazy`，LCP < 1.5s
- 全静态构建，10 张照片和 1000 张照片构建产物相同——纯 HTML + CSS
- JSON 文件驱动内容，编辑后 `git push` 即可更新，不需要 CMS 或数据库
- 暗房胶片配色：双层颗粒纹理、暖色渐晕、sepia 滤镜、光漏 hover 动效

## 适用场景

- 个人摄影作品集：替代 Instagram/Flickr，数据自己掌控
- 旅行博客：按行程组织专题相册，每张照片带故事
- 胶片摄影展示：设计语言本身就是对模拟摄影的致敬

## 部署

### Vercel（一键）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/1829317945/photo-blog)

### 手动部署

需要 Node.js 20+。

```bash
git clone https://github.com/1829317945/photo-blog
cd photo-blog
npm install
npm run build
```

`out/` 目录即为静态站点，可部署到任意静态托管服务（Nginx、GitHub Pages、Cloudflare Pages）。

## 配置

无需环境变量。项目不依赖外部服务。

无数据库——所有内容存储在 `content/` 目录的 JSON 文件中。

## 添加照片

```bash
# 1. 将原始照片放入 originals/
cp ~/photo.jpg originals/photos/2026/06/photo.jpg

# 2. 编辑 content/photos.json，添加条目
# {
#   "slug": "my-photo",
#   "title": "作品标题",
#   "image": "photos/2026/06/photo.jpg",
#   "date": "2026-06-01",
#   "location": "拍摄地",
#   "story": "配文故事…",
#   "album": "album-slug",
#   "camera": "Leica M6",
#   "lens": "Summicron 35mm f/2"
# }

# 3. 优化图片（生成多尺寸 WebP/JPEG）
npm run optimize

# 4. 部署
git add . && git commit -m "新照片" && git push
```

Vercel 检测到 push 后自动构建部署。`npm run build` 包含图片优化步骤，构建产物中的图片走 Vercel CDN 分发。

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| 渲染 | 静态生成 (SSG)，`generateStaticParams` |
| 样式 | Tailwind CSS v4 + custom.css |
| 字体 | Playfair Display / Noto Serif SC / Georgia / Long Cang |
| 图片处理 | sharp (multi-size WebP/JPEG + LQIP) |
| 部署 | Vercel CDN |

## 目录结构

```
├── content/                  # JSON 数据文件
│   ├── photos.json           # 照片条目
│   └── albums.json           # 专题相册
├── originals/                # 原始照片（不入 git）
├── public/images/            # 优化后图片（入 git）
├── scripts/
│   └── optimize-images.mjs   # sharp 图片管线
├── src/
│   ├── app/                  # 路由页面
│   │   ├── page.tsx                 # 首页瀑布流
│   │   ├── photo/[slug]/page.tsx    # 照片详情（书信体）
│   │   ├── albums/page.tsx          # 专题索引
│   │   ├── album/[slug]/page.tsx    # 专题详情
│   │   └── about/page.tsx           # 关于页
│   ├── components/           # React 组件
│   └── lib/                  # 工具函数
└── next.config.ts
```

## 致谢

感谢每一位驻足的观众。这些光影碎片，因你的目光而完整。
