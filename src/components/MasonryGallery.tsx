import type { Photo } from "@/lib/photos";
import PolaroidCard from "./PolaroidCard";

interface MasonryGalleryProps {
  photos: Photo[];
  preloadCount?: number;
}

export default function MasonryGallery({
  photos,
  preloadCount = 8,
}: MasonryGalleryProps) {
  return (
    <main className="masonry">
      {photos.map((photo, i) => (
        <PolaroidCard
          key={photo.slug}
          photo={photo}
          preload={i < preloadCount}
        />
      ))}
    </main>
  );
}
