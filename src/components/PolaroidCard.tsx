import Link from "next/link";
import type { Photo } from "@/lib/photos";
import { getPhotoUrl, getSrcSet, getSizes, formatDate } from "@/lib/images";

interface PolaroidCardProps {
  photo: Photo;
  preload?: boolean;
}

export default function PolaroidCard({
  photo,
  preload = false,
}: PolaroidCardProps) {
  return (
    <Link href={`/photo/${photo.slug}`} className="polaroid">
      <img
        src={getPhotoUrl(photo.image, 800)}
        srcSet={getSrcSet(photo.image)}
        sizes={getSizes()}
        alt={photo.title}
        loading={preload ? "eager" : "lazy"}
        {...(preload ? { fetchPriority: "high" as const } : {})}
        width={800}
        height={560}
      />
      <div className="caption">
        <div className="title">{photo.title}</div>
        <div className="meta">
          {photo.location && `${photo.location} · `}
          {formatDate(photo.date)}
        </div>
      </div>
    </Link>
  );
}
