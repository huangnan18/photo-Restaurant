import photos from "@content/photos.json";

export interface Photo {
  slug: string;
  title: string;
  image: string;
  date: string;
  location?: string;
  story?: string;
  album?: string | null;
  camera?: string;
  lens?: string;
}

export function getAllPhotos(): Photo[] {
  return photos as Photo[];
}

export function getPhotoBySlug(slug: string): Photo | undefined {
  return (photos as Photo[]).find((p) => p.slug === slug);
}

export function getPhotosByAlbum(albumSlug: string): Photo[] {
  return (photos as Photo[]).filter((p) => p.album === albumSlug);
}

export function getAdjacentPhotos(slug: string): {
  prev: Photo | null;
  next: Photo | null;
} {
  const all = getAllPhotos();
  const idx = all.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
