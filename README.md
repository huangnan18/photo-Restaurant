# 拾光 · 摄影集

用镜头记录行走的光。

## 技术栈

- **框架**: Next.js 16 (App Router) + TypeScript
- **样式**: Tailwind CSS + 自定义 CSS
- **图片**: sharp 多尺寸 WebP/JPEG + LQIP 占位图
- **部署**: Vercel CDN

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
```

## 添加照片

```bash
# 1. 将原始照片放入 originals/
cp ~/photo.jpg originals/photos/2026/06/photo.jpg

# 2. 编辑 content/photos.json 添加条目

# 3. 优化图片（生成多尺寸 WebP/JPEG）
npm run optimize

# 4. 本地预览
npm run dev

# 5. 提交部署
git add . && git commit -m "新照片" && git push
```

## 内容模型

照片 (`content/photos.json`):

```json
{
  "slug": "photo-slug",
  "title": "照片标题",
  "image": "photos/2026/06/photo.jpg",
  "date": "2026-06-01",
  "location": "地点",
  "story": "配文故事...",
  "camera": "相机型号",
  "lens": "镜头型号"
}
```

## 目录结构

```
├── content/           # JSON 数据文件
├── originals/         # 原始照片（不入 git）
├── public/images/     # 优化后图片（入 git，上 CDN）
├── scripts/           # 构建脚本
└── src/               # Next.js 源码
    ├── app/           # 路由页面
    ├── components/    # React 组件
    └── lib/           # 工具函数
```

## 许可

MIT
