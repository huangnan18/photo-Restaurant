# CLAUDE.md

## Build Commands

```bash
npm run dev          # 本地开发服务器 (localhost:3000)
npm run build        # 生产构建（含图片优化）
npm run optimize     # 仅运行图片优化（sharp → public/images/）
npx vercel --prod    # 部署到生产环境
```

## Architecture

- **Framework**: Next.js 16 App Router + TypeScript, fully static (SSG)
- **Styling**: Tailwind CSS v4 (`@theme` in globals.css) + `custom.css` for special effects
- **Content**: JSON files in `content/`, imported directly in Server Components
- **Images**: sharp-optimized multi-size WebP/JPEG in `public/images/`, committed to git, served via Vercel CDN
- **No client state**: Only `SiteHeader` is a client component (for `usePathname`). All pages are Server Components.

## Content Model

### `content/photos.json`
```json
{ "slug": "...", "title": "...", "image": "photos/2026/05/xxx.jpg", "date": "YYYY-MM-DD", "location": "...", "story": "...", "album": null, "camera": "...", "lens": "..." }
```
- `slug` is the URL identifier (`/photo/[slug]`)
- `image` path is relative to `originals/`
- `album` references `albums.json` slug, or `null`

### `content/albums.json`
```json
{ "slug": "...", "title": "...", "description": "...", "cover": "photos/...", "type": "travel" }
```

## Image Pipeline

```
originals/ (gitignored, raw photos)
  ↓ npm run optimize (sharp)
public/images/ (committed, deployed to CDN)
  {slug}-{400,800,1200,2400}w.{webp,jpg}
```

- Use native `<img>` with `srcSet`/`sizes`, NOT `next/image` — CSS columns masonry is incompatible with next/image
- Dev mode serves from `public/images/` directly (same as prod)
- `src/lib/images.ts` provides `getPhotoUrl()`, `getSrcSet()`, `getSizes()`

## Key Files

| File | Role |
|---|---|
| `src/app/layout.tsx` | Root layout, Google Fonts, metadata |
| `src/app/page.tsx` | Home — `getAllPhotos()` → `MasonryGallery` |
| `src/app/photo/[slug]/page.tsx` | Detail — `PolaroidCard`-static + `LetterLayout` |
| `src/app/albums/page.tsx` | Album index grid |
| `src/app/album/[slug]/page.tsx` | Album filter → `MasonryGallery` |
| `src/app/about/page.tsx` | `LetterLayout` self-intro |
| `src/components/PolaroidCard.tsx` | Core card component, `<img>` with lazy loading |
| `src/components/MasonryGallery.tsx` | CSS columns container, first 8 preloaded |
| `src/components/LetterLayout.tsx` | Letter-style layout (greeting/body/closing) |
| `src/components/SiteHeader.tsx` | Client component, `usePathname` for active nav |
| `src/components/SiteFooter.tsx` | Simple footer |
| `src/lib/photos.ts` | `getAllPhotos`, `getPhotoBySlug`, `getPhotosByAlbum`, `getAdjacentPhotos` |
| `src/lib/albums.ts` | `getAllAlbums`, `getAlbumBySlug` |
| `src/lib/images.ts` | `getPhotoUrl`, `getSrcSet`, `getSizes`, `formatDate` |
| `src/app/custom.css` | All effects: noise texture, polaroid rotations, masonry, letter layout |
| `scripts/optimize-images.mjs` | sharp: resize + WebP/JPEG + LQIP |

## Styling Convention

- **Tailwind**: layout, spacing, typography, colors (via CSS variables)
- **custom.css**: CSS columns, nth-child rotation, warm box-shadows, film fade filter, SVG noise, letter typography — anything Tailwind can't express
- **Design tokens** in `globals.css` `@theme` block: colors (`--color-bg`, `--color-card`, `--color-text`, `--color-muted`, `--color-accent`, `--color-border`), fonts (`--font-playfair`, `--font-long-cang`)

## Important Conventions

- All routes are fully static at build time. Dynamic routes (`photo/[slug]`, `album/[slug]`) use `generateStaticParams`.
- Path alias `@/*` → `./src/*`, `@content/*` → `./content/*`
- `originals/` and `src/lib/lqip.json` are gitignored
- `.env.example` was removed — project needs no environment variables
- Vercel auto-deploys on `git push` to `main`
