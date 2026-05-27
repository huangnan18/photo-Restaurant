# 拾光 · Photo Journal

[![Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://jiaofu-lilac.vercel.app)
[![Next.js](https://img.shields.io/npm/v/next/latest?label=Next.js)](https://nextjs.org)

A static photo blog with a darkroom film aesthetic — CSS masonry, Polaroid cards, and letter-style storytelling. JSON-driven content, sharp-optimized images, served from Vercel CDN.

[Live preview](https://jiaofu-lilac.vercel.app)

## Screenshots

Home page masonry — CSS columns, 3/2/1 responsive breakpoints. Cards use nth-child pseudo-random rotation and spring back to center on hover. Images carry a sepia desaturation filter that resolves on hover.

Photo detail page — large print in a darkroom-style frame, story text in a letter layout with ruled-paper texture, red margin line, and handwritten-ink closing.

[Online demo](https://jiaofu-lilac.vercel.app)

## Features

- CSS columns masonry with no JS layout library — an extra 0KB on the wire
- sharp pipeline: 400/800/1200/2400w sizing in WebP + JPEG per photo. 800w WebP averages 89KB, saving ~90% bandwidth vs the original
- First 8 cards preloaded with `fetchpriority=high`; the rest use `loading=lazy` with native srcset
- Fully static build — 10 photos or 1000, the output is the same: plain HTML + CSS
- Content lives in JSON files. Edit, `git push`, done. No CMS, no database
- Dual-layer SVG film grain, radial vignette, and sepia filter for darkroom atmosphere

## Use cases

- Personal photography portfolio — own your images, no platform lock-in
- Travel journal — group photos into albums, each with a long-form letter story
- Film photography showcase — the design language is itself a nod to analog

## Deploy

### Vercel (one click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/1829317945/photo-blog)

### Manual

Requires Node.js 20+.

```bash
git clone https://github.com/1829317945/photo-blog
cd photo-blog
npm install
npm run optimize        # image pipeline first
npm run build           # static output
```

The `out/` directory can be served from Nginx, GitHub Pages, or Cloudflare Pages. Each `git push` to `main` triggers a rebuild on Vercel.

## Configuration

No environment variables. No external services. Content is managed via JSON files under `content/`.

## Adding content

### Photos

Edit `content/photos.json`:

```json
{
  "slug": "my-photo",
  "title": "Photo Title",
  "image": "photos/2026/06/my-photo.jpg",
  "date": "2026-06-01",
  "location": "Where",
  "story": "Story text — appears in the letter layout on the detail page.",
  "album": "album-slug",
  "camera": "Leica M6",
  "lens": "Summicron 35mm f/2"
}
```

Place the original photo under `originals/` at the matching path, then:

```bash
npm run optimize   # multi-size WebP/JPEG via sharp
npm run dev        # preview at localhost:3000
```

### Albums

Edit `content/albums.json`:

```json
{
  "slug": "album-slug",
  "title": "Album Title",
  "description": "Short description",
  "cover": "photos/2026/06/cover.jpg",
  "type": "travel"
}
```

Photos link to albums via the `album` field matching an album's `slug`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| Rendering | Static (SSG) via `generateStaticParams` |
| Styling | Tailwind CSS v4 + custom.css |
| Fonts | Playfair Display / Noto Serif SC / Georgia / Long Cang |
| Images | sharp (multi-size WebP/JPEG + LQIP base64) |
| Hosting | Vercel CDN |

```
jiaofu/
├── content/                  # JSON content
│   ├── photos.json
│   └── albums.json
├── originals/                # raw photos (gitignored)
├── public/images/            # optimized output (committed, CDN-served)
├── scripts/
│   └── optimize-images.mjs   # sharp pipeline
├── src/
│   ├── app/                  # 5 route pages
│   │   ├── page.tsx                  # home (masonry)
│   │   ├── photo/[slug]/page.tsx     # detail (letter)
│   │   ├── albums/page.tsx           # album index
│   │   ├── album/[slug]/page.tsx     # album detail
│   │   └── about/page.tsx            # about
│   ├── components/           # 5 React components
│   └── lib/                  # utilities
└── next.config.ts
```

## Credits

感谢每一位驻足的观众。这些光影碎片，因你的目光而完整。

*To every visitor who paused — these fragments of light find their meaning in your gaze.*
