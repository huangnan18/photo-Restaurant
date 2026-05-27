import albums from "@content/albums.json";

export interface Album {
  slug: string;
  title: string;
  description?: string;
  cover: string;
  type?: "travel" | "time";
}

export function getAllAlbums(): Album[] {
  return albums as Album[];
}

export function getAlbumBySlug(slug: string): Album | undefined {
  return (albums as Album[]).find((a) => a.slug === slug);
}
