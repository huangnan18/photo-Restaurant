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

## Refactor · Darkroom Film Style (planned, not yet implemented)

Visual-only restyle from "warm Polaroid scrapbook" → "darkroom film negative". **Architecture, data model, routes, image pipeline, SSG all unchanged — design layer only.** Full spec in `SPEC.md`.

Decided:
1. **Nav** → left vertical sidebar (was top-centered). `layout.tsx` gets a flex shell: `<SiteSidebar />` + `<div class="content">{children}</div>`; collapses to top bar ≤900px. `SiteHeader.tsx` → `SiteSidebar.tsx` (stays a client component).
2. **Story page** → darkroom contact-print style (was handwritten letter). Drop lined-paper / red margin / Long Cang; dark bg + gold-brown title + EXIF sign-off.

Token swap (`globals.css` `@theme`): `--color-bg #15110d`, `--color-card #211b14`, `--color-frame #0c0a07`, `--color-text #e7ddcb`, `--color-ink #f2ead8`, `--color-muted #8f8472`, `--color-accent #c8a45e`, `--color-border rgba(200,164,94,0.18)`. Remove `--font-long-cang`.

`custom.css` rework: grain `mix-blend-mode` → `overlay` (multiply goes black on dark bg); add full-page 35mm `.film-frame` (sprocket strips + `KODAK PORTRA 400`, desktop only); `.polaroid` → near-black frame + `border-radius:4px`, **drop nth-child rotation** (orderly contact-print), drop sepia; `.letter` → contact-print; `.photo-nav` → outlined buttons + `01 / 12` frame counter.

Not in scope: thumbnail filmstrip, category filters (additive features).

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
