import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAlbumBySlug, getAllAlbums } from "@/lib/albums";
import { getPhotosByAlbum } from "@/lib/photos";
import MasonryGallery from "@/components/MasonryGallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllAlbums().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) return { title: "未找到" };
  return {
    title: album.title,
    description: album.description,
  };
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();

  const photos = getPhotosByAlbum(slug);

  return (
    <>
      <div className="text-center pt-12 pb-8">
        <h2 className="text-2xl tracking-wider text-[var(--color-text)]">
          <span className="font-[var(--font-playfair)]">{album.title}</span>
        </h2>
        {album.description && (
          <p className="text-sm text-[var(--color-muted)] mt-2 italic">
            {album.description}
          </p>
        )}
      </div>
      <MasonryGallery photos={photos} preloadCount={6} />
    </>
  );
}
