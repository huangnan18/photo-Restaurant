import { getAllPhotos } from "@/lib/photos";
import MasonryGallery from "@/components/MasonryGallery";

export default function HomePage() {
  const photos = getAllPhotos();
  return <MasonryGallery photos={photos} preloadCount={8} />;
}
