import Link from "next/link";
import type { Metadata } from "next";
import { getAllAlbums } from "@/lib/albums";
import { getPhotosByAlbum } from "@/lib/photos";
import { getPhotoUrl } from "@/lib/images";

export const metadata: Metadata = {
  title: "相册",
};

export default function AlbumsPage() {
  const albums = getAllAlbums();

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 pb-24">
      <h2 className="font-[var(--font-playfair)] text-2xl text-center text-[var(--color-muted)] mb-12 tracking-wider">
        Albums
      </h2>
      <div className="album-grid">
        {albums.map((album) => {
          const photos = getPhotosByAlbum(album.slug);
          return (
            <Link
              key={album.slug}
              href={`/album/${album.slug}`}
              className="album-card"
            >
              <img
                src={getPhotoUrl(album.cover, 600)}
                alt={album.title}
                loading="lazy"
                width={600}
                height={450}
              />
              <div className="title">{album.title}</div>
              {album.description && (
                <div className="desc">{album.description}</div>
              )}
              <div className="count">{photos.length} 张照片</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
